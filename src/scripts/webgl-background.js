import * as THREE from 'three';

/**
 * V8 ULTIMATE CINEMATIC AMBIENT ENGINE
 * Subsystems:
 *  1. AmbientEnvironment (WebGL Depth Shader + Multi-Tier Starfield + Dawn Mist + Safe-Zone Golden Dust Clusters)
 *  2. BirdSystem (Stylized Bezier Flying Birds with Natural Wing Beats & Rest Intervals)
 *  3. FloralSystem (Pre-rendered Artistic 20/11 Rose/Chrysanthemum Petals & Grand Tribute Gathering)
 *  4. MotionOrchestrator (3-State Rhythm: Resting Atmosphere <-> Ambient Accent <-> Grand Event)
 *  5. PerformanceController (Single Unified rAF Loop, dpr=1, Offscreen Sprite Caching, 60 FPS Locked)
 */
export function createWebGLBackground(canvasElement) {
  let renderer, scene, camera;
  let particles, particlePositions, particleVelocities;
  let lightRaysMesh, lightRaysMaterial;

  const skyCanvas = document.getElementById('ambient-sky-canvas');
  const skyCtx = skyCanvas ? skyCanvas.getContext('2d', { alpha: true }) : null;

  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const pointCount = isLowEnd ? 75 : 130;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = 0, mouseY = 0;
  let targetCameraX = 0, currentCameraX = 0;
  let targetCameraY = 0, currentCameraY = 0;
  let targetCameraZ = 115, currentCameraZ = 115;
  let targetRayIntensity = 0.58, currentRayIntensity = 0.58;
  let targetDawnGlow = 0.52, currentDawnGlow = 0.52;

  let currentSlideIndex = -1; // -1 = Landing, 0..5 = Slide 01..06
  let isFinaleState = false;
  let currentMoodIndex = 0;
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let isTabHidden = false;
  let animFrameId = null;
  const clock = new THREE.Clock();

  // ===========================================================================
  // 1. SLIDE ATMOSPHERIC MOODS (Section XI — Slide-by-Slide Polish)
  // ===========================================================================
  const moods = [
    // 0: Slide 01 — Khởi nguồn (Deep academic navy, knowledge light, sparse golden dust)
    { key: 'slide-1', camX: 0,   camY: 0,  camZ: 112, speed: 0.0007, rayIntensity: 0.58, dawnGlow: 0.48, rayAngle: 0.22, allowBirds: false, petalDensity: 0.15 },
    // 1: Slide 02 — Người thầy (Warm ivory-gold nostalgia, gentle 20/11 petals, no wires)
    { key: 'slide-2', camX: -18, camY: 8,  camZ: 100, speed: 0.0005, rayIntensity: 0.68, dawnGlow: 0.65, rayAngle: 0.38, allowBirds: false, petalDensity: 0.65 },
    // 2: Slide 03 — Con thuyền tri thức (Horizon clouds, distant birds, sunrise glow)
    { key: 'slide-3', camX: 14,  camY: 12, camZ: 95,  speed: 0.0010, rayIntensity: 0.74, dawnGlow: 0.78, rayAngle: -0.18, allowBirds: true,  petalDensity: 0.10 },
    // 3: Slide 04 — Sinh viên 5 tốt (Calm outer-margin light, dignified & clear)
    { key: 'slide-4', camX: 6,   camY: 18, camZ: 98,  speed: 0.0008, rayIntensity: 0.62, dawnGlow: 0.64, rayAngle: 0.08, allowBirds: false, petalDensity: 0.12 },
    // 4: Slide 05 — Hành trình thực tế (Subtle memory glow behind gallery, zero clutter)
    { key: 'slide-5', camX: -10, camY: -6, camZ: 116, speed: 0.0005, rayIntensity: 0.44, dawnGlow: 0.42, rayAngle: 0.25, allowBirds: false, petalDensity: 0.15 },
    // 5: Slide 06 — Tri ân thầy cô (Warm golden light, elegant 20/11 floral presence)
    { key: 'slide-6', camX: 0,   camY: 5,  camZ: 102, speed: 0.0006, rayIntensity: 0.72, dawnGlow: 0.76, rayAngle: 0.0,  allowBirds: false, petalDensity: 0.85 },
    // 6: Finale — Beyond the Horizon (Golden sunrise + deep navy sky, horizon birds, calm hold)
    { key: 'finale',  camX: 0,   camY: 10, camZ: 98,  speed: 0.0006, rayIntensity: 0.80, dawnGlow: 0.88, rayAngle: -0.10, allowBirds: true,  petalDensity: 0.55 }
  ];

  // ===========================================================================
  // 2. OFFSCREEN SPRITE CACHES (Pre-rendered once for <0.3ms/frame 60fps drawing)
  // ===========================================================================
  const petalSprites = [];
  let starHaloSprite = null;
  let cloudMistSprite = null;

  function buildOffscreenSprites() {
    // A. Soft Star Halo & Golden Dust Sprite
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 48;
    sCanvas.height = 48;
    const sCtx = sCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(24, 24, 0, 24, 24, 24);
    sGrad.addColorStop(0, 'rgba(255, 252, 242, 1)');
    sGrad.addColorStop(0.22, 'rgba(247, 224, 174, 0.82)');
    sGrad.addColorStop(0.55, 'rgba(240, 204, 133, 0.22)');
    sGrad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 48, 48);
    starHaloSprite = sCanvas;

    // B. Soft Dawn Cloud / Horizon Mist Sprite
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 256;
    cCanvas.height = 128;
    const cCtx = cCanvas.getContext('2d');
    const cGrad = cCtx.createRadialGradient(128, 64, 8, 128, 64, 120);
    cGrad.addColorStop(0, 'rgba(240, 204, 133, 0.16)');
    cGrad.addColorStop(0.5, 'rgba(194, 208, 227, 0.07)');
    cGrad.addColorStop(1, 'rgba(11, 25, 46, 0)');
    cCtx.fillStyle = cGrad;
    cCtx.fillRect(0, 0, 256, 128);
    cloudMistSprite = cCanvas;

    // C. 3 Artistic 20/11 Petal Sprites (Blush Rose, Champagne Gold, Warm Ivory)
    const palette = [
      { inner: '#F8D7E0', outer: '#F4B8C4', vein: 'rgba(173, 31, 41, 0.22)' },
      { inner: '#FBF3DF', outer: '#F0CC85', vein: 'rgba(212, 168, 83, 0.28)' },
      { inner: '#FFFFFF', outer: '#F8F1E3', vein: 'rgba(240, 204, 133, 0.25)' }
    ];
    palette.forEach((p) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 36;
      pCanvas.height = 36;
      const pCtx = pCanvas.getContext('2d');
      pCtx.translate(18, 18);

      const pGrad = pCtx.createLinearGradient(0, -12, 0, 12);
      pGrad.addColorStop(0, p.inner);
      pGrad.addColorStop(1, p.outer);

      // Graceful notched rose/chrysanthemum petal silhouette
      pCtx.beginPath();
      pCtx.moveTo(0, 11);
      pCtx.bezierCurveTo(-10, 6, -12, -5, -4, -10);
      pCtx.quadraticCurveTo(0, -7, 0, -8.5);
      pCtx.quadraticCurveTo(0, -7, 4, -10);
      pCtx.bezierCurveTo(12, -5, 10, 6, 0, 11);
      pCtx.closePath();
      pCtx.fillStyle = pGrad;
      pCtx.fill();

      pCtx.strokeStyle = p.vein;
      pCtx.lineWidth = 0.8;
      pCtx.beginPath();
      pCtx.moveTo(0, 8);
      pCtx.quadraticCurveTo(-1, 0, 0, -6);
      pCtx.stroke();

      petalSprites.push(pCanvas);
    });
  }

  // ===========================================================================
  // 3. AMBIENT ENVIRONMENT DATA: STARS, CLOUDS, GOLDEN DUST, BIRDS, PETALS
  // ===========================================================================
  const stars = [];
  const goldenDust = [];
  const dawnClouds = [];
  const birds = [];
  const outerPetals = [];
  const grandBurstPetals = [];

  // MotionOrchestrator state machine: 'resting' | 'accent' | 'grand'
  let orchestratorState = 'grand';
  let activeGrandMoment = 'landing-opening';
  let grandMomentTimer = 3.2; // Seconds remaining in current grand moment
  let accentCycleTimer = 0;
  let currentAccentType = 'dust-wave'; // 'dust-wave' | 'star-glow' | 'distant-birds'

  function initAmbientSystems() {
    buildOffscreenSprites();

    // 1. Multi-tier Starfield (64 stars, mostly in upper sky & outer stage margins)
    stars.length = 0;
    const starCount = isLowEnd ? 42 : 64;
    for (let i = 0; i < starCount; i++) {
      // Bias stars toward upper sky (y < 0.28) or outer left/right wings
      const inUpperSky = i < starCount * 0.62;
      const nx = inUpperSky
        ? Math.random()
        : (i % 2 === 0 ? Math.random() * 0.14 : 0.86 + Math.random() * 0.14);
      const ny = inUpperSky ? 0.02 + Math.random() * 0.22 : 0.15 + Math.random() * 0.78;
      const isHeroStar = i % 7 === 0;
      stars.push({
        nx,
        ny,
        radius: isHeroStar ? 1.8 + Math.random() * 0.7 : 0.75 + Math.random() * 0.85,
        baseAlpha: isHeroStar ? 0.62 + Math.random() * 0.25 : 0.24 + Math.random() * 0.38,
        twinkleSpeed: 0.45 + Math.random() * 0.85,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: isHeroStar ? 10 : 4,
        isHeroStar
      });
    }

    // 2. Soft Dawn Clouds / Horizon Mist (5 slow-drifting atmospheric clouds)
    dawnClouds.length = 0;
    for (let i = 0; i < 5; i++) {
      dawnClouds.push({
        nx: 0.1 + i * 0.2,
        ny: 0.04 + (i % 2) * 0.07,
        scaleX: 1.6 + (i % 3) * 0.5,
        scaleY: 0.75 + (i % 2) * 0.35,
        speedX: 0.0018 + (i % 2) * 0.0009,
        alpha: 0.32 + (i % 3) * 0.12
      });
    }

    // 3. Golden Dust Clusters (38 warm particles in outer margins & upper sky)
    goldenDust.length = 0;
    const dustCount = isLowEnd ? 24 : 38;
    for (let i = 0; i < dustCount; i++) {
      // Cluster centers around outer stage edges so foreground content stays 100% clean
      const side = i % 3;
      const nx =
        side === 0
          ? 0.015 + Math.random() * 0.11
          : side === 1
            ? 0.875 + Math.random() * 0.11
            : 0.12 + Math.random() * 0.76;
      const ny = side === 2 ? 0.02 + Math.random() * 0.11 : 0.08 + Math.random() * 0.84;
      goldenDust.push({
        nx,
        ny,
        vx: (Math.random() - 0.42) * 0.00018,
        vy: -0.00015 - Math.random() * 0.00022,
        size: 8 + Math.random() * 14,
        baseAlpha: 0.28 + Math.random() * 0.42,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 4. BirdSystem (7 stylized birds in 2 depth tiers along upper-sky Bezier arcs)
    birds.length = 0;
    const birdConfigs = [
      // Far horizon flock (smaller, softer champagne gold)
      { nx: 0.16, ny: 0.042, scale: 0.56, speed: 0.018, wingSpeed: 3.1, phase: 0.2, tier: 'far' },
      { nx: 0.19, ny: 0.032, scale: 0.48, speed: 0.018, wingSpeed: 3.3, phase: 1.1, tier: 'far' },
      { nx: 0.22, ny: 0.040, scale: 0.44, speed: 0.018, wingSpeed: 3.0, phase: 2.0, tier: 'far' },
      { nx: 0.68, ny: 0.036, scale: 0.54, speed: 0.016, wingSpeed: 3.2, phase: 0.7, tier: 'far' },
      // Mid-near graceful flock (warm ivory, gentle glide in upper sky margin)
      { nx: 0.34, ny: 0.052, scale: 0.82, speed: 0.024, wingSpeed: 3.8, phase: 0.0, tier: 'near' },
      { nx: 0.38, ny: 0.038, scale: 0.72, speed: 0.024, wingSpeed: 4.0, phase: 0.9, tier: 'near' },
      { nx: 0.41, ny: 0.048, scale: 0.64, speed: 0.024, wingSpeed: 3.7, phase: 1.8, tier: 'near' }
    ];
    birdConfigs.forEach((b) => birds.push({ ...b }));

    // 5. FloralSystem (8 outer-margin ambient petals — strictly outside the content safe zone)
    outerPetals.length = 0;
    for (let i = 0; i < 8; i++) {
      const isLeft = i % 2 === 0;
      outerPetals.push({
        nx: isLeft ? 0.015 + (i * 0.011) % 0.055 : 0.93 + (i * 0.011) % 0.055,
        ny: 0.12 + ((i * 0.19) % 0.76),
        vx: (isLeft ? 1 : -1) * 0.00008,
        vy: 0.00018 + (i % 3) * 0.00006,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        scale: 0.52 + (i % 3) * 0.14,
        spriteIdx: i % petalSprites.length,
        phase: i * 0.9
      });
    }
  }

  // Trigger one of the 3 Grand Cinematic Moments (Section VIII)
  function triggerGrandMoment(momentName) {
    activeGrandMoment = momentName;
    orchestratorState = 'grand';
    const skyLayer = document.getElementById('living-sky-layer');
    skyLayer?.setAttribute('data-ambient-state', momentName);

    if (momentName === 'landing-opening') {
      // GRAND MOMENT 01 — The Sky of Gratitude (2.8s climax -> calm resting state)
      grandMomentTimer = 2.8;
    } else if (momentName === 'thousand-thank-yous') {
      // GRAND MOMENT 02 — Slide 05 -> Slide 06: A Thousand Thank-Yous (Petal gathering wave)
      grandMomentTimer = 2.4;
      grandBurstPetals.length = 0;
      const burstCount = isLowEnd ? 10 : 16;
      for (let i = 0; i < burstCount; i++) {
        const startNx = 0.08 + (i / burstCount) * 0.84;
        const startNy = 0.82 + (i % 3) * 0.06;
        // Converge gently toward the 20/11 floral tribute region & outer halo, then fade out
        grandBurstPetals.push({
          nx: startNx,
          ny: startNy,
          targetNx: 0.22 + (i % 5) * 0.12,
          targetNy: 0.24 + (i % 4) * 0.14,
          progress: 0,
          speed: 0.48 + (i % 4) * 0.08,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: 0.025,
          scale: 0.65 + (i % 3) * 0.18,
          spriteIdx: i % petalSprites.length
        });
      }
    } else if (momentName === 'beyond-the-horizon') {
      // GRAND MOMENT 03 — Full Poster Finale: Beyond the Horizon (2.8s sunrise & birds -> Final Hold)
      grandMomentTimer = 2.8;
      // Reset bird flock positions for a graceful horizon flight across the upper sky
      birds.forEach((b, idx) => {
        b.nx = 0.14 + idx * 0.055;
        b.ny = 0.032 + (idx % 3) * 0.014;
      });
    }
  }

  // Content Safe-Zone Attenuation (Section XII.C — Never cover text, faces, or poster)
  function getSafeZoneAlpha(nx, ny) {
    // Central slide content region: x in [0.09..0.91], y in [0.11..0.89]
    if (nx > 0.09 && nx < 0.91 && ny > 0.11 && ny < 0.89) {
      const dx = Math.min(nx - 0.09, 0.91 - nx);
      const dy = Math.min(ny - 0.11, 0.89 - ny);
      const edgeDist = Math.min(dx, dy);
      return Math.max(0, 1 - edgeDist * 18);
    }
    return 1;
  }

  // Draw a stylized, graceful bird silhouette with smooth curved wings (Section VI.A)
  function drawStylizedBird(ctx, x, y, scale, wingAngle, isFar, alpha) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(-0.07); // Slight upward ascent toward the horizon

    const wingLift = Math.sin(wingAngle) * 5.5;
    const wingTipY = -2.5 - wingLift;
    const midJointY = -4.2 - wingLift * 0.55;

    ctx.fillStyle = isFar
      ? `rgba(240, 204, 133, ${alpha.toFixed(3)})`
      : `rgba(248, 241, 227, ${alpha.toFixed(3)})`;

    ctx.beginPath();
    // Left wing tip -> left shoulder -> center body -> right shoulder -> right wing tip
    ctx.moveTo(-15, wingTipY);
    ctx.quadraticCurveTo(-7.5, midJointY, 0, 0);
    ctx.quadraticCurveTo(7.5, midJointY, 15, wingTipY);
    // Lower trailing edge of wings
    ctx.quadraticCurveTo(7.5, midJointY + 2.4, 0, 2.2);
    ctx.quadraticCurveTo(-7.5, midJointY + 2.4, -15, wingTipY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderAmbientSkyCanvas(elapsed, dt) {
    if (!skyCtx || !skyCanvas) return;
    skyCtx.clearRect(0, 0, width, height);

    const mood = moods[currentMoodIndex] || moods[0];

    // Update MotionOrchestrator state timer (Section X — Ambient Motion While Speaking)
    if (!isReducedMotion) {
      if (orchestratorState === 'grand') {
        grandMomentTimer -= dt;
        if (grandMomentTimer <= 0) {
          orchestratorState = 'resting';
          accentCycleTimer = 0;
          const skyLayer = document.getElementById('living-sky-layer');
          skyLayer?.setAttribute('data-ambient-state', 'resting');
        }
      } else {
        accentCycleTimer += dt;
        // 8s calm resting -> 4.5s gentle single accent wave -> repeat
        const cyclePos = accentCycleTimer % 12.5;
        if (cyclePos > 8.0) {
          if (orchestratorState !== 'accent') {
            orchestratorState = 'accent';
            const waveIdx = Math.floor(accentCycleTimer / 12.5) % 3;
            currentAccentType = waveIdx === 0 ? 'dust-wave' : waveIdx === 1 ? 'star-glow' : 'distant-birds';
            const skyLayer = document.getElementById('living-sky-layer');
            skyLayer?.setAttribute('data-ambient-state', `accent-${currentAccentType}`);
          }
        } else if (orchestratorState !== 'resting') {
          orchestratorState = 'resting';
          const skyLayer = document.getElementById('living-sky-layer');
          skyLayer?.setAttribute('data-ambient-state', 'resting');
        }
      }
    }

    const isGrand = orchestratorState === 'grand';
    const isStarAccent = orchestratorState === 'accent' && currentAccentType === 'star-glow';
    const isDustAccent = orchestratorState === 'accent' && currentAccentType === 'dust-wave';
    const isBirdAccent = orchestratorState === 'accent' && currentAccentType === 'distant-birds';

    // 1. Render Soft Dawn Clouds / Horizon Mist in Upper Sky
    if (cloudMistSprite) {
      for (let i = 0; i < dawnClouds.length; i++) {
        const cl = dawnClouds[i];
        if (!isReducedMotion) {
          cl.nx += cl.speedX * dt;
          if (cl.nx > 1.15) cl.nx = -0.15;
        }
        const cx = cl.nx * width;
        const cy = cl.ny * height;
        const cw = 256 * cl.scaleX;
        const ch = 128 * cl.scaleY;
        skyCtx.globalAlpha = cl.alpha * mood.dawnGlow;
        skyCtx.drawImage(cloudMistSprite, cx - cw * 0.5, cy - ch * 0.5, cw, ch);
      }
    }

    // 2. Render Multi-Tier Starfield (Section V.A)
    for (let i = 0; i < stars.length; i++) {
      const st = stars[i];
      const sx = st.nx * width + (isReducedMotion ? 0 : -mouseX * st.parallax);
      const sy = st.ny * height + (isReducedMotion ? 0 : -mouseY * st.parallax * 0.6);
      const safeAlpha = getSafeZoneAlpha(st.nx, st.ny);
      if (safeAlpha <= 0.02) continue;

      const twinkle = isReducedMotion
        ? 1
        : 0.72 + 0.28 * Math.sin(elapsed * st.twinkleSpeed + st.twinklePhase);
      const boost = isGrand || isStarAccent ? 1.22 : 1.0;
      const alpha = Math.min(0.95, st.baseAlpha * twinkle * safeAlpha * boost);

      if (st.isHeroStar && starHaloSprite) {
        skyCtx.globalAlpha = alpha * 0.55;
        skyCtx.drawImage(starHaloSprite, sx - 10, sy - 10, 20, 20);
      }
      skyCtx.globalAlpha = alpha;
      skyCtx.fillStyle = '#F8F1E3';
      skyCtx.beginPath();
      skyCtx.arc(sx, sy, st.radius, 0, Math.PI * 2);
      skyCtx.fill();
    }

    // 3. Render Golden Dust Clusters in Outer Margins (Section V.B)
    if (starHaloSprite) {
      const dustBoost = isGrand ? 1.35 : isDustAccent ? 1.25 : 0.9;
      for (let i = 0; i < goldenDust.length; i++) {
        const gd = goldenDust[i];
        if (!isReducedMotion) {
          gd.nx += gd.vx;
          gd.ny += gd.vy;
          if (gd.ny < 0.01) gd.ny = 0.94;
          if (gd.nx < 0.005) gd.nx = 0.98;
          if (gd.nx > 0.995) gd.nx = 0.01;
        }
        const safeAlpha = getSafeZoneAlpha(gd.nx, gd.ny);
        if (safeAlpha <= 0.02) continue;

        const pulse = isReducedMotion ? 0.85 : 0.65 + 0.35 * Math.sin(elapsed * 0.9 + gd.phase);
        const alpha = Math.min(0.88, gd.baseAlpha * pulse * safeAlpha * dustBoost);
        const gx = gd.nx * width;
        const gy = gd.ny * height;
        skyCtx.globalAlpha = alpha;
        skyCtx.drawImage(starHaloSprite, gx - gd.size * 0.5, gy - gd.size * 0.5, gd.size, gd.size);
      }
    }

    // 4. Render BirdSystem (Section VI — Only on Landing, Slide 03, Finale, or gentle distant accent)
    const showBirds =
      currentSlideIndex === -1 ||
      mood.allowBirds ||
      (isBirdAccent && currentSlideIndex !== 1 && currentSlideIndex !== 4);

    if (showBirds) {
      const birdMasterAlpha =
        isGrand && (activeGrandMoment === 'landing-opening' || activeGrandMoment === 'beyond-the-horizon')
          ? 0.92
          : mood.allowBirds
            ? 0.72
            : 0.42;

      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        // During subtle accent waves, only fly the far horizon birds
        if (!isGrand && !mood.allowBirds && b.tier !== 'far') continue;

        if (!isReducedMotion) {
          b.nx += b.speed * dt;
          if (b.nx > 0.94) b.nx = 0.06;
        }
        // Bezier-like gentle vertical curve across the upper sky margin (y stays in 2.2%..5.8%)
        const arcOffset = Math.sin(b.nx * Math.PI) * 0.012;
        const bx = b.nx * width;
        const by = Math.max(18, (b.ny - arcOffset) * height);
        const wingAngle = isReducedMotion ? 0.4 : elapsed * b.wingSpeed + b.phase;
        const isFar = b.tier === 'far';
        const alpha = birdMasterAlpha * (isFar ? 0.68 : 0.92);
        drawStylizedBird(skyCtx, bx, by, b.scale, wingAngle, isFar, alpha);
      }
    }

    // 5. Render FloralSystem (Section VII — Outer Margin Petals + Grand Moment 02 Gathering)
    if (petalSprites.length > 0 && mood.petalDensity > 0.2) {
      for (let i = 0; i < outerPetals.length; i++) {
        const pt = outerPetals[i];
        if (!isReducedMotion) {
          pt.nx += pt.vx + Math.sin(elapsed * 0.7 + pt.phase) * 0.00005;
          pt.ny += pt.vy;
          pt.rot += pt.rotSpeed;
          if (pt.ny > 0.92) pt.ny = 0.08;
        }
        const safeAlpha = getSafeZoneAlpha(pt.nx, pt.ny);
        if (safeAlpha <= 0.05) continue;

        const px = pt.nx * width;
        const py = pt.ny * height;
        const sprite = petalSprites[pt.spriteIdx];
        skyCtx.save();
        skyCtx.globalAlpha = 0.65 * mood.petalDensity * safeAlpha;
        skyCtx.translate(px, py);
        skyCtx.rotate(pt.rot);
        const tiltX = 0.72 + 0.28 * Math.cos(elapsed * 1.1 + pt.phase);
        skyCtx.scale(pt.scale * tiltX, pt.scale);
        skyCtx.drawImage(sprite, -18, -18, 36, 36);
        skyCtx.restore();
      }
    }

    // Grand Moment 02: A Thousand Thank-Yous (Petal Gathering Wave during Slide 05 -> Slide 06)
    if (isGrand && activeGrandMoment === 'thousand-thank-yous' && grandBurstPetals.length > 0) {
      for (let i = 0; i < grandBurstPetals.length; i++) {
        const gp = grandBurstPetals[i];
        gp.progress = Math.min(1, gp.progress + gp.speed * dt);
        const easeP = 1 - Math.pow(1 - gp.progress, 3);
        const curNx = gp.nx + (gp.targetNx - gp.nx) * easeP;
        const curNy = gp.ny + (gp.targetNy - gp.ny) * easeP - Math.sin(easeP * Math.PI) * 0.08;
        const envAlpha = Math.sin(gp.progress * Math.PI) * 0.82;
        if (envAlpha <= 0.02) continue;

        const sprite = petalSprites[gp.spriteIdx];
        skyCtx.save();
        skyCtx.globalAlpha = envAlpha;
        skyCtx.translate(curNx * width, curNy * height);
        skyCtx.rotate(gp.rot + elapsed * 0.8);
        skyCtx.scale(gp.scale, gp.scale * 0.85);
        skyCtx.drawImage(sprite, -18, -18, 36, 36);
        skyCtx.restore();
      }
    }

    skyCtx.globalAlpha = 1;
  }

  // ===========================================================================
  // 4. THREE.JS WEBGL DEPTH BACKGROUND (Wire-Free Soft Volumetric Sky & Particles)
  // ===========================================================================
  function init() {
    if (skyCanvas) {
      skyCanvas.width = width;
      skyCanvas.height = height;
    }
    initAmbientSystems();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x091526, 0.0038);

    camera = new THREE.PerspectiveCamera(55, width / height, 1, 900);
    camera.position.set(0, 0, 112);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
    } catch (e) {
      console.warn('WebGL fallback to 2D Ambient Sky Canvas:', e);
    }

    if (renderer) {
      // 1. Soft Volumetric Golden Dawn Shader Plane (Fast polynomial math — 60 FPS on GPU & SwiftShader)
      const rayGeo = new THREE.PlaneGeometry(390, 250, 1, 1);
      lightRaysMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.58 },
          uDawnGlow: { value: 0.52 },
          uAngle: { value: 0.22 },
          uColorGold: { value: new THREE.Color('#F0CC85') },
          uColorIvory: { value: new THREE.Color('#F8F1E3') },
          uColorNavy: { value: new THREE.Color('#19365F') }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uIntensity;
          uniform float uDawnGlow;
          uniform float uAngle;
          uniform vec3 uColorGold;
          uniform vec3 uColorIvory;
          uniform vec3 uColorNavy;

          void main() {
            vec2 uv = vUv - 0.5;
            float c = cos(uAngle);
            float s = sin(uAngle);
            float rotX = uv.x * c - uv.y * s;

            float d1 = (rotX - 0.12 + sin(uTime * 0.22) * 0.04) * 3.0;
            float beam1 = max(0.0, 1.0 - d1 * d1);
            float d2 = (rotX + 0.22) * 4.0;
            float beam2 = max(0.0, 1.0 - d2 * d2) * 0.62;

            float dawnBand = smoothstep(0.52, 0.92, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y)) * uDawnGlow * 0.42;
            float verticalFade = smoothstep(0.0, 0.85, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
            float radialVignette = max(0.0, 1.0 - dot(uv, uv) * 2.2);

            float alpha = ((beam1 + beam2) * verticalFade * radialVignette * 0.14 * uIntensity) + dawnBand * 0.13;
            vec3 col = mix(uColorNavy, mix(uColorGold, uColorIvory, 0.3), 0.78);
            gl_FragColor = vec4(col, alpha);
          }
        `
      });
      lightRaysMesh = new THREE.Mesh(rayGeo, lightRaysMaterial);
      lightRaysMesh.position.set(0, 0, -45);
      scene.add(lightRaysMesh);

      // 2. Subtle Deep-Space 3D Star/Dust Points (No 3D wire/constellation lines!)
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(pointCount * 3);
      const particleColors = new Float32Array(pointCount * 3);
      particleVelocities = new Float32Array(pointCount * 3);

      const champagneGold = new THREE.Color('#F0CC85');
      const warmIvory = new THREE.Color('#F8F1E3');
      const blushRose = new THREE.Color('#F4B8C4');

      for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3;
        particlePositions[i3]     = (Math.random() - 0.5) * 320;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 190;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 210;

        particleVelocities[i3]     = (Math.random() - 0.45) * 0.024;
        particleVelocities[i3 + 1] = (Math.random() * 0.020) + 0.005;
        particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.020;

        const r = Math.random();
        const col = r < 0.58 ? champagneGold : r < 0.88 ? warmIvory : blushRose;
        particleColors[i3]     = col.r;
        particleColors[i3 + 1] = col.g;
        particleColors[i3 + 2] = col.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      const texture = new THREE.CanvasTexture(starHaloSprite);
      const material = new THREE.PointsMaterial({
        size: 2.6,
        map: texture,
        vertexColors: true,
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    animate();
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / width - 0.5) * 2;
    mouseY = (e.clientY / height - 0.5) * 2;
  }

  function onVisibilityChange() {
    isTabHidden = document.hidden;
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (skyCanvas) {
      skyCanvas.width = width;
      skyCanvas.height = height;
    }
    if (renderer && camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  }

  let lastTime = 0;
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    if (isTabHidden) return;

    const elapsed = clock.getElapsedTime();
    const dt = Math.min(0.05, Math.max(0.008, elapsed - lastTime));
    lastTime = elapsed;

    // 1. Render 2D Living Sky Canvas (Stars, Dawn Clouds, Safe-Zone Golden Dust, Bezier Birds, 20/11 Petals)
    renderAmbientSkyCanvas(elapsed, dt);

    // 2. Render 3D WebGL Volumetric Depth Plane & Deep Space Motes
    if (!renderer) return;
    const mood = moods[currentMoodIndex] || moods[0];

    targetCameraX = mood.camX + (isReducedMotion ? 0 : mouseX * 7);
    targetCameraY = mood.camY + (isReducedMotion ? 0 : -mouseY * 5.5);
    targetCameraZ = mood.camZ;
    targetRayIntensity = mood.rayIntensity;
    targetDawnGlow = mood.dawnGlow;

    const lerp = isReducedMotion ? 0.12 : 0.032;
    currentCameraX += (targetCameraX - currentCameraX) * lerp;
    currentCameraY += (targetCameraY - currentCameraY) * lerp;
    currentCameraZ += (targetCameraZ - currentCameraZ) * lerp;
    currentRayIntensity += (targetRayIntensity - currentRayIntensity) * lerp;
    currentDawnGlow += (targetDawnGlow - currentDawnGlow) * lerp;

    camera.position.set(currentCameraX, currentCameraY, currentCameraZ);
    camera.lookAt(0, 0, 0);

    if (lightRaysMaterial) {
      lightRaysMaterial.uniforms.uTime.value = isReducedMotion ? 0 : elapsed;
      lightRaysMaterial.uniforms.uIntensity.value = currentRayIntensity;
      lightRaysMaterial.uniforms.uDawnGlow.value = currentDawnGlow;
      lightRaysMaterial.uniforms.uAngle.value += (mood.rayAngle - lightRaysMaterial.uniforms.uAngle.value) * 0.03;
    }

    if (particles && !isReducedMotion) {
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3;
        pos[i3]     += particleVelocities[i3];
        pos[i3 + 1] += particleVelocities[i3 + 1];
        pos[i3 + 2] += particleVelocities[i3 + 2];

        if (pos[i3] > 165) pos[i3] = -165;
        if (pos[i3] < -165) pos[i3] = 165;
        if (pos[i3 + 1] > 105) pos[i3 + 1] = -105;
        if (pos[i3 + 1] < -105) pos[i3 + 1] = 105;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += mood.speed * 0.5;
    }

    renderer.render(scene, camera);
  }

  function setSlideMood(slideIdx, isFinale = false, prevSlideIdx = null) {
    currentSlideIndex = slideIdx;
    isFinaleState = isFinale;

    if (isFinale) {
      currentMoodIndex = 6;
    } else if (slideIdx === -1) {
      currentMoodIndex = 0;
    } else {
      currentMoodIndex = Math.max(0, Math.min(slideIdx, 5));
    }

    const skyEl = document.getElementById('living-sky-layer');
    if (skyEl) {
      if (isFinale) {
        skyEl.setAttribute('data-sky-mood', 'finale');
      } else if (slideIdx === -1) {
        skyEl.setAttribute('data-sky-mood', 'landing');
      } else {
        skyEl.setAttribute('data-sky-mood', `slide-${currentMoodIndex + 1}`);
      }
    }

    // Automatically trigger the 3 Grand Cinematic Moments when entering their target states
    if (slideIdx === -1) {
      triggerGrandMoment('landing-opening');
    } else if (slideIdx === 5 && !isFinale && prevSlideIdx === 4) {
      triggerGrandMoment('thousand-thank-yous');
    } else if (slideIdx === 5 && isFinale) {
      triggerGrandMoment('beyond-the-horizon');
    } else {
      orchestratorState = 'resting';
      skyEl?.setAttribute('data-ambient-state', 'resting');
    }
  }

  function setReducedMotion(reduced) {
    isReducedMotion = reduced;
  }

  function destroy() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (renderer) renderer.dispose();
  }

  init();

  return {
    setSlideMood,
    triggerGrandMoment,
    setReducedMotion,
    destroy
  };
}
