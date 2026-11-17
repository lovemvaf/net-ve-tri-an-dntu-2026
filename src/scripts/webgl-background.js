import * as THREE from 'three';

/**
 * V9 SPECTACULAR CINEMATIC VFX ENGINE
 * Architecture:
 *  - Layer 0: #webgl-canvas (z-index: 0) — Three.js Volumetric Dawn Sky & Deep Space Field
 *  - Layer 1: #ambient-sky-canvas (z-index: 1) — 3-Layer Starfield (Far/Mid/Near Bokeh), Dawn Clouds, Ambient Birds & Outer Petals
 *  - Layer 2: Main Content (#landing-page & .reveal)
 *  - Layer 3: #grand-vfx-canvas (z-index: 265, pointer-events: none) — Unoccluded Grand Particle Wave (Curl-Noise Flow Field),
 *             Floral Storm (85 3D Two-Sided Petals), and Grand Bird Flock (16 Articulated Boids) with Smart Content-Safe Masking!
 */
export function createWebGLBackground(canvasElement) {
  let renderer, scene, camera;
  let particles, particlePositions, particleVelocities;
  let lightRaysMesh, lightRaysMaterial;

  const skyCanvas = document.getElementById('ambient-sky-canvas');
  const skyCtx = skyCanvas ? skyCanvas.getContext('2d', { alpha: true }) : null;

  const grandCanvas = document.getElementById('grand-vfx-canvas');
  const grandCtx = grandCanvas ? grandCanvas.getContext('2d', { alpha: true }) : null;

  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const pointCount = isLowEnd ? 80 : 140;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = 0, mouseY = 0;
  let targetCameraX = 0, currentCameraX = 0;
  let targetCameraY = 0, currentCameraY = 0;
  let targetCameraZ = 115, currentCameraZ = 115;
  let targetRayIntensity = 0.62, currentRayIntensity = 0.62;
  let targetDawnGlow = 0.58, currentDawnGlow = 0.58;

  let currentSlideIndex = -1; // -1 = Landing, 0..5 = Slide 01..06
  let isFinaleState = false;
  let currentMoodIndex = 0;
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let isLiteMode = false;
  let isTabHidden = false;
  let animFrameId = null;
  const clock = new THREE.Clock();

  // Real-time FPS & Telemetry tracking for PerformanceController & VFX Showcase
  let frameCounter = 0;
  let fpsLastCheck = performance.now();
  let currentFps = 60;

  // ===========================================================================
  // 1. SLIDE ATMOSPHERIC MOODS
  // ===========================================================================
  const moods = [
    { key: 'slide-1', camX: 0,   camY: 0,  camZ: 112, speed: 0.0007, rayIntensity: 0.62, dawnGlow: 0.54, rayAngle: 0.22, allowBirds: false, petalDensity: 0.20 },
    { key: 'slide-2', camX: -18, camY: 8,  camZ: 100, speed: 0.0005, rayIntensity: 0.72, dawnGlow: 0.68, rayAngle: 0.38, allowBirds: false, petalDensity: 0.75 },
    { key: 'slide-3', camX: 14,  camY: 12, camZ: 95,  speed: 0.0010, rayIntensity: 0.78, dawnGlow: 0.82, rayAngle: -0.18, allowBirds: true,  petalDensity: 0.15 },
    { key: 'slide-4', camX: 6,   camY: 18, camZ: 98,  speed: 0.0008, rayIntensity: 0.65, dawnGlow: 0.66, rayAngle: 0.08, allowBirds: false, petalDensity: 0.15 },
    { key: 'slide-5', camX: -10, camY: -6, camZ: 116, speed: 0.0005, rayIntensity: 0.48, dawnGlow: 0.46, rayAngle: 0.25, allowBirds: false, petalDensity: 0.20 },
    { key: 'slide-6', camX: 0,   camY: 5,  camZ: 102, speed: 0.0006, rayIntensity: 0.78, dawnGlow: 0.82, rayAngle: 0.0,  allowBirds: false, petalDensity: 0.92 },
    { key: 'finale',  camX: 0,   camY: 10, camZ: 98,  speed: 0.0006, rayIntensity: 0.86, dawnGlow: 0.94, rayAngle: -0.10, allowBirds: true,  petalDensity: 0.65 }
  ];

  // ===========================================================================
  // 2. PRE-RENDERED HIGH-ART SPRITES (Star Halo, Bokeh Orb, Dawn Cloud, 4 Petal Types)
  // ===========================================================================
  const petalSprites = [];
  let starHaloSprite = null;
  let bokehOrbSprite = null;
  let cloudMistSprite = null;

  function buildOffscreenSprites() {
    // A. Bright Star Halo & Golden Wave Mote Sprite (64x64)
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 64;
    sCanvas.height = 64;
    const sCtx = sCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sGrad.addColorStop(0, 'rgba(255, 253, 245, 1)');
    sGrad.addColorStop(0.18, 'rgba(247, 224, 174, 0.92)');
    sGrad.addColorStop(0.48, 'rgba(240, 204, 133, 0.34)');
    sGrad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);
    starHaloSprite = sCanvas;

    // B. Soft Near-Field Bokeh Orb Sprite (96x96)
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 96;
    bCanvas.height = 96;
    const bCtx = bCanvas.getContext('2d');
    const bGrad = bCtx.createRadialGradient(48, 48, 4, 48, 48, 46);
    bGrad.addColorStop(0, 'rgba(247, 224, 174, 0.38)');
    bGrad.addColorStop(0.55, 'rgba(240, 204, 133, 0.22)');
    bGrad.addColorStop(0.82, 'rgba(244, 184, 196, 0.12)');
    bGrad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(0, 0, 96, 96);
    bokehOrbSprite = bCanvas;

    // C. Soft Dawn Cloud / Horizon Mist Sprite (320x160)
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 320;
    cCanvas.height = 160;
    const cCtx = cCanvas.getContext('2d');
    const cGrad = cCtx.createRadialGradient(160, 80, 10, 160, 80, 150);
    cGrad.addColorStop(0, 'rgba(247, 224, 174, 0.24)');
    cGrad.addColorStop(0.45, 'rgba(240, 204, 133, 0.11)');
    cGrad.addColorStop(0.75, 'rgba(194, 208, 227, 0.05)');
    cGrad.addColorStop(1, 'rgba(11, 25, 46, 0)');
    cCtx.fillStyle = cGrad;
    cCtx.fillRect(0, 0, 320, 160);
    cloudMistSprite = cCanvas;

    // D. 4 High-Resolution 20/11 Petal Sprites (56x56 — Blush Rose, Champagne Gold, Warm Ivory, Soft Crimson)
    petalSprites.length = 0;
    const palette = [
      { inner: '#FFE5EC', mid: '#F4B8C4', outer: '#E08A9D', vein: 'rgba(173, 31, 41, 0.28)' },
      { inner: '#FFFDF5', mid: '#F7E0AE', outer: '#D9AE5F', vein: 'rgba(154, 107, 22, 0.30)' },
      { inner: '#FFFFFF', mid: '#F8F1E3', outer: '#E5D4B8', vein: 'rgba(212, 168, 83, 0.28)' },
      { inner: '#FAD2D8', mid: '#DE6E7B', outer: '#B82937', vein: 'rgba(255, 240, 230, 0.25)' }
    ];
    palette.forEach((p) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 56;
      pCanvas.height = 56;
      const pCtx = pCanvas.getContext('2d');
      pCtx.translate(28, 28);

      const pGrad = pCtx.createLinearGradient(0, -18, 0, 18);
      pGrad.addColorStop(0, p.inner);
      pGrad.addColorStop(0.55, p.mid);
      pGrad.addColorStop(1, p.outer);

      // Rich notched rose/chrysanthemum petal shape
      pCtx.beginPath();
      pCtx.moveTo(0, 17);
      pCtx.bezierCurveTo(-15, 10, -19, -7, -6, -16);
      pCtx.quadraticCurveTo(-1, -12, 0, -13.5);
      pCtx.quadraticCurveTo(1, -12, 6, -16);
      pCtx.bezierCurveTo(19, -7, 15, 10, 0, 17);
      pCtx.closePath();
      pCtx.fillStyle = pGrad;
      pCtx.fill();

      // Delicate petal veins
      pCtx.strokeStyle = p.vein;
      pCtx.lineWidth = 1.0;
      pCtx.beginPath();
      pCtx.moveTo(0, 13);
      pCtx.quadraticCurveTo(-1.5, 0, 0, -10);
      pCtx.moveTo(0, 5);
      pCtx.quadraticCurveTo(-6, -1, -8, -7);
      pCtx.moveTo(0, 5);
      pCtx.quadraticCurveTo(6, -1, 8, -7);
      pCtx.stroke();

      petalSprites.push(pCanvas);
    });
  }

  // ===========================================================================
  // 3. MULTI-LAYER STARFIELD, DAWN MIST, BIRDS, FLORAL STORM & PARTICLE WAVE
  // ===========================================================================
  const farStars = [];
  const midStars = [];
  const nearBokeh = [];
  const dawnClouds = [];
  const ambientBirds = [];
  const ambientPetals = [];

  // Foreground Grand VFX arrays (rendered on #grand-vfx-canvas at z-index: 265!)
  const waveParticles = [];
  const floralStormPetals = [];
  const grandFlockBirds = [];

  let orchestratorState = 'grand';
  let activeGrandMoment = 'landing-opening';
  let grandMomentElapsed = 0;
  let grandMomentDuration = 3.6;
  let accentCycleTimer = 0;
  let currentAccentType = 'dust-wave';

  function initAmbientSystems() {
    buildOffscreenSprites();

    // 1A. Far Field Stars (110 pinpoint stars across the sky)
    farStars.length = 0;
    const farCount = isLowEnd ? 65 : 110;
    for (let i = 0; i < farCount; i++) {
      farStars.push({
        nx: Math.random(),
        ny: Math.random() * 0.88,
        radius: 0.7 + Math.random() * 0.9,
        baseAlpha: 0.32 + Math.random() * 0.45,
        twinkleSpeed: 0.5 + Math.random() * 1.1,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 3
      });
    }

    // 1B. Middle Field Luminous Stars & Golden Dust (55 medium glowing stars with wind drift)
    midStars.length = 0;
    const midCount = isLowEnd ? 34 : 55;
    for (let i = 0; i < midCount; i++) {
      midStars.push({
        nx: Math.random(),
        ny: Math.random() * 0.92,
        vx: 0.00012 + Math.random() * 0.00018,
        vy: -0.00008 - Math.random() * 0.00014,
        size: 10 + Math.random() * 14,
        baseAlpha: 0.45 + Math.random() * 0.42,
        twinkleSpeed: 0.8 + Math.random() * 0.9,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 8
      });
    }

    // 1C. Near Field Soft Bokeh Orbs (18 large warm bokeh lights)
    nearBokeh.length = 0;
    const bokehCount = isLowEnd ? 10 : 18;
    for (let i = 0; i < bokehCount; i++) {
      const inOuterWing = i % 2 === 0;
      nearBokeh.push({
        nx: inOuterWing ? (i % 4 === 0 ? 0.02 + Math.random() * 0.14 : 0.84 + Math.random() * 0.14) : Math.random(),
        ny: inOuterWing ? 0.1 + Math.random() * 0.8 : 0.02 + Math.random() * 0.22,
        vx: (Math.random() - 0.4) * 0.00015,
        vy: -0.00012 - Math.random() * 0.00012,
        size: 26 + Math.random() * 28,
        baseAlpha: 0.22 + Math.random() * 0.24,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 2. Soft Dawn Clouds / Horizon Mist (6 atmospheric clouds)
    dawnClouds.length = 0;
    for (let i = 0; i < 6; i++) {
      dawnClouds.push({
        nx: i * 0.18,
        ny: 0.05 + (i % 3) * 0.06,
        scaleX: 1.7 + (i % 3) * 0.55,
        scaleY: 0.85 + (i % 2) * 0.35,
        speedX: 0.0022 + (i % 2) * 0.001,
        alpha: 0.38 + (i % 3) * 0.14
      });
    }

    // 3. Ambient Bird Flock (8 graceful birds in upper sky y = 4%..15%, clearly visible scale!)
    ambientBirds.length = 0;
    const ambBirdConfigs = [
      { nx: 0.12, ny: 0.075, scale: 1.15, speed: 0.032, wingSpeed: 3.8, phase: 0.0, tier: 'near' },
      { nx: 0.16, ny: 0.058, scale: 0.98, speed: 0.032, wingSpeed: 4.1, phase: 0.8, tier: 'near' },
      { nx: 0.20, ny: 0.082, scale: 0.88, speed: 0.031, wingSpeed: 3.9, phase: 1.6, tier: 'mid' },
      { nx: 0.24, ny: 0.064, scale: 0.78, speed: 0.030, wingSpeed: 3.6, phase: 2.3, tier: 'mid' },
      { nx: 0.58, ny: 0.068, scale: 1.05, speed: 0.028, wingSpeed: 3.7, phase: 0.4, tier: 'near' },
      { nx: 0.63, ny: 0.052, scale: 0.90, speed: 0.028, wingSpeed: 4.0, phase: 1.2, tier: 'mid' },
      { nx: 0.67, ny: 0.074, scale: 0.76, speed: 0.027, wingSpeed: 3.5, phase: 2.1, tier: 'far' },
      { nx: 0.71, ny: 0.058, scale: 0.68, speed: 0.027, wingSpeed: 3.4, phase: 2.9, tier: 'far' }
    ];
    ambBirdConfigs.forEach((b) => ambientBirds.push({ ...b }));

    // 4. Ambient Outer-Stage Petals (14 graceful 3D petals drifting in the outer wings)
    ambientPetals.length = 0;
    for (let i = 0; i < 14; i++) {
      const isLeft = i % 2 === 0;
      ambientPetals.length < 14 &&
        ambientPetals.push({
          nx: isLeft ? 0.015 + (i * 0.013) % 0.085 : 0.90 + (i * 0.013) % 0.085,
          ny: (i / 14) * 0.92,
          vx: (isLeft ? 1 : -1) * 0.00012,
          vy: 0.00024 + (i % 3) * 0.00008,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.018,
          roll: Math.random() * Math.PI * 2,
          rollSpeed: 0.022 + (i % 3) * 0.008,
          scale: 0.58 + (i % 3) * 0.18,
          spriteIdx: i % petalSprites.length,
          phase: i * 0.8
        });
    }
  }

  // ===========================================================================
  // 4. SPAWNERS FOR THE 3 SPECTACULAR FOREGROUND GRAND VFX SYSTEMS (#grand-vfx-canvas)
  // ===========================================================================

  // A. Spawn Golden Particle Wave ("A Thousand Lights of Gratitude" — Curl-Noise Flow Stream)
  function spawnGoldenParticleWave(count = 190, duration = 3.6) {
    waveParticles.length = 0;
    const actualCount = isLiteMode ? Math.round(count * 0.35) : isLowEnd ? Math.round(count * 0.65) : count;
    for (let i = 0; i < actualCount; i++) {
      const streamIdx = i % 3; // 3 sweeping S-curve ribbons across upper, mid-corridor, and lower-horizon
      const baseNy = streamIdx === 0 ? 0.14 : streamIdx === 1 ? 0.48 : 0.82;
      const delay = (i / actualCount) * 0.85;
      waveParticles.push({
        nx: -0.05 + (i / actualCount) * 0.75 + (Math.random() - 0.5) * 0.08,
        ny: baseNy + (Math.random() - 0.5) * 0.16,
        vx: 0.24 + Math.random() * 0.18,
        vy: -0.04 + (Math.random() - 0.5) * 0.08,
        size: i % 6 === 0 ? 22 + Math.random() * 14 : 9 + Math.random() * 11,
        alpha: 0.65 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        delay,
        life: 0,
        maxLife: duration - delay * 0.5,
        streamIdx
      });
    }
  }

  // B. Spawn Floral Storm ("Hoa Tri Ân Ngập Trời" — 85 3D Tumbling Two-Sided Petals)
  function spawnFloralStorm(count = 85, duration = 3.8) {
    floralStormPetals.length = 0;
    const actualCount = isLiteMode ? Math.round(count * 0.35) : isLowEnd ? Math.round(count * 0.65) : count;
    for (let i = 0; i < actualCount; i++) {
      // Launch from lower-left, lower-right, and sweeping wind arcs across the whole stage
      const fromLeft = i % 2 === 0;
      const tier = i % 5 === 0 ? 'near' : i % 2 === 0 ? 'mid' : 'far';
      const scale = tier === 'near' ? 0.85 + Math.random() * 0.35 : tier === 'mid' ? 0.58 + Math.random() * 0.22 : 0.38 + Math.random() * 0.16;
      const delay = (i / actualCount) * 0.75;
      floralStormPetals.push({
        nx: fromLeft ? -0.04 + Math.random() * 0.45 : 0.55 + Math.random() * 0.48,
        ny: 0.12 + Math.random() * 0.84,
        vx: (fromLeft ? 1 : -0.6) * (0.16 + Math.random() * 0.18),
        vy: -0.14 - Math.random() * 0.16,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2.4,
        roll: Math.random() * Math.PI * 2,
        rollSpeed: 2.2 + Math.random() * 2.0,
        scale,
        spriteIdx: i % petalSprites.length,
        delay,
        life: 0,
        maxLife: duration - delay * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // C. Spawn Grand Bird Flock (16 Articulated Birds Soaring Across the Sky Toward the Horizon)
  function spawnGrandBirdFlock(count = 16, duration = 3.8) {
    grandFlockBirds.length = 0;
    const actualCount = isLiteMode ? 8 : count;
    for (let i = 0; i < actualCount; i++) {
      const groupIdx = i % 3;
      const tier = i % 3 === 0 ? 'near' : i % 3 === 1 ? 'mid' : 'far';
      const scale = tier === 'near' ? 1.45 + (i % 3) * 0.18 : tier === 'mid' ? 1.08 + (i % 2) * 0.14 : 0.78 + (i % 2) * 0.12;
      // Start in a natural loose formation in the upper-left / mid-upper sky and glide toward the right sunrise horizon
      const startNx = 0.04 + groupIdx * 0.18 + (i * 0.038) % 0.28;
      const startNy = 0.06 + groupIdx * 0.045 + (i % 4) * 0.024;
      grandFlockBirds.push({
        nx: startNx,
        ny: startNy,
        vx: 0.14 + (scale * 0.045),
        vy: -0.022 - (i % 3) * 0.008,
        scale,
        wingSpeed: 4.8 + (i % 4) * 0.45,
        phase: i * 0.85,
        tier,
        life: 0,
        maxLife: duration
      });
    }
  }

  // ===========================================================================
  // 5. TRIGGER GRAND CINEMATIC MOMENTS & VFX SHOWCASE MODES
  // ===========================================================================
  function triggerGrandMoment(momentName) {
    if (isReducedMotion) return;
    activeGrandMoment = momentName;
    orchestratorState = 'grand';
    grandMomentElapsed = 0;

    const skyLayer = document.getElementById('living-sky-layer');
    skyLayer?.setAttribute('data-ambient-state', momentName);

    if (momentName === 'landing-opening') {
      // GRAND MOMENT 01 — LANDING: The Sky of Gratitude (Particle Wave + Petals + Distant Flock)
      grandMomentDuration = 3.6;
      spawnGoldenParticleWave(170, 3.5);
      spawnFloralStorm(42, 3.5);
      spawnGrandBirdFlock(12, 3.6);
    } else if (momentName === 'thousand-thank-yous') {
      // GRAND MOMENT 02 — SLIDE 05 -> 06: A Thousand Thank-Yous (Spectacular Floral Storm + Golden Glow)
      grandMomentDuration = 3.8;
      spawnFloralStorm(88, 3.8);
      spawnGoldenParticleWave(135, 3.4);
      grandFlockBirds.length = 0; // Section VII: Focus purely on Floral Storm & Golden Light on Slide 05 -> 06
    } else if (momentName === 'beyond-the-horizon') {
      // GRAND MOMENT 03 — FINAL POSTER: Beyond the Horizon (Sky-Opening Particle Wave + 16-Bird Horizon Flock + Outer Petals)
      grandMomentDuration = 3.8;
      spawnGoldenParticleWave(220, 3.7);
      spawnGrandBirdFlock(16, 3.8);
      spawnFloralStorm(36, 3.4);
    } else if (momentName === 'slide3-horizon-flock') {
      // Slide 03 Entry: Book-Boat Horizon Bird Flock & Sunrise Wave
      grandMomentDuration = 3.2;
      spawnGrandBirdFlock(14, 3.2);
      spawnGoldenParticleWave(95, 2.8);
      floralStormPetals.length = 0;
    } else if (momentName === 'bird-flock-only') {
      grandMomentDuration = 4.0;
      spawnGrandBirdFlock(18, 4.0);
      waveParticles.length = 0;
      floralStormPetals.length = 0;
    } else if (momentName === 'particle-wave-only') {
      grandMomentDuration = 4.0;
      spawnGoldenParticleWave(240, 4.0);
      floralStormPetals.length = 0;
      grandFlockBirds.length = 0;
    } else if (momentName === 'floral-storm-only') {
      grandMomentDuration = 4.0;
      spawnFloralStorm(95, 4.0);
      waveParticles.length = 0;
      grandFlockBirds.length = 0;
    }
  }

  // Draw an articulated, high-contrast stylized bird silhouette with warm golden-ivory rim light
  function drawArticulatedBird(ctx, x, y, scale, wingAngle, tier, alpha, vx = 1, vy = -0.12) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    const heading = Math.atan2(vy, vx);
    ctx.rotate(Math.max(-0.32, Math.min(0.18, heading * 0.65)));
    ctx.scale(scale, scale);

    // 2-joint wing kinematics (shoulder lift + wrist flap)
    const flap = Math.sin(wingAngle);
    const wrist = Math.sin(wingAngle - 0.55);
    const shoulderY = -4.5 - flap * 4.2;
    const tipY = -2.0 - flap * 8.5 - wrist * 3.2;

    // Subtle soft golden glow behind near/mid birds for projector visibility
    if (tier !== 'far' && starHaloSprite) {
      ctx.globalAlpha = alpha * 0.28;
      ctx.drawImage(starHaloSprite, -22, -22, 44, 44);
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = tier === 'far' ? '#F0CC85' : '#FFFDF7';
    ctx.strokeStyle = 'rgba(240, 204, 133, 0.85)';
    ctx.lineWidth = tier === 'near' ? 1.1 : 0.7;

    ctx.beginPath();
    // Left wingtip -> left shoulder -> sleek head/beak -> right shoulder -> right wingtip
    ctx.moveTo(-21, tipY);
    ctx.quadraticCurveTo(-10, shoulderY, -1.5, -1.2);
    ctx.lineTo(0, -2.8);
    ctx.lineTo(1.5, -1.2);
    ctx.quadraticCurveTo(10, shoulderY, 21, tipY);
    // Trailing edge of wings & tail
    ctx.quadraticCurveTo(10, shoulderY + 3.4, 2.2, 2.0);
    ctx.lineTo(0, 4.2);
    ctx.lineTo(-2.2, 2.0);
    ctx.quadraticCurveTo(-10, shoulderY + 3.4, -21, tipY);
    ctx.closePath();
    ctx.fill();
    if (tier !== 'far') ctx.stroke();

    ctx.restore();
  }

  // Smart Foreground Visibility Mask:
  // Allows Grand VFX to sweep boldly across the screen during transition climax (t < 1.6s),
  // while protecting the center poster / teacher faces so they are never obscured!
  function getForegroundCorridorAlpha(nx, ny, elapsedInMoment) {
    // Protect central poster / portrait core [x: 0.34..0.66, y: 0.20..0.82]
    const inPosterCore = nx > 0.35 && nx < 0.65 && ny > 0.20 && ny < 0.82;
    if (inPosterCore) {
      // During the first 1.1s of a transition wave, allow a soft 38% veil; afterwards keep poster 100% clear
      return elapsedInMoment < 1.1 ? 0.38 * (1 - elapsedInMoment / 1.1) : 0.0;
    }
    return 1.0;
  }

  // ===========================================================================
  // 6. RENDER BACKGROUND SKY CANVAS (#ambient-sky-canvas, z-index: 1)
  // ===========================================================================
  function renderAmbientSkyCanvas(elapsed, dt) {
    if (!skyCtx || !skyCanvas) return;
    skyCtx.clearRect(0, 0, width, height);

    const mood = moods[currentMoodIndex] || moods[0];

    // Update MotionOrchestrator state machine
    if (!isReducedMotion) {
      if (orchestratorState === 'grand') {
        grandMomentElapsed += dt;
        if (grandMomentElapsed >= grandMomentDuration) {
          orchestratorState = 'resting';
          accentCycleTimer = 0;
          waveParticles.length = 0;
          floralStormPetals.length = 0;
          grandFlockBirds.length = 0;
          const skyLayer = document.getElementById('living-sky-layer');
          skyLayer?.setAttribute('data-ambient-state', 'resting');
        }
      } else {
        accentCycleTimer += dt;
        const cyclePos = accentCycleTimer % 12.0;
        if (cyclePos > 7.5) {
          if (orchestratorState !== 'accent') {
            orchestratorState = 'accent';
            const waveIdx = Math.floor(accentCycleTimer / 12.0) % 3;
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

    // 1. Soft Dawn Clouds / Horizon Mist
    if (cloudMistSprite) {
      for (let i = 0; i < dawnClouds.length; i++) {
        const cl = dawnClouds[i];
        if (!isReducedMotion) {
          cl.nx += cl.speedX * dt;
          if (cl.nx > 1.18) cl.nx = -0.18;
        }
        const cx = cl.nx * width;
        const cy = cl.ny * height;
        const cw = 320 * cl.scaleX;
        const ch = 160 * cl.scaleY;
        skyCtx.globalAlpha = cl.alpha * mood.dawnGlow;
        skyCtx.drawImage(cloudMistSprite, cx - cw * 0.5, cy - ch * 0.5, cw, ch);
      }
    }

    // 2A. Far Field Stars (110 stars)
    skyCtx.fillStyle = '#F8F1E3';
    for (let i = 0; i < farStars.length; i++) {
      const st = farStars[i];
      const sx = st.nx * width + (isReducedMotion ? 0 : -mouseX * st.parallax);
      const sy = st.ny * height + (isReducedMotion ? 0 : -mouseY * st.parallax * 0.6);
      const twinkle = isReducedMotion ? 1 : 0.68 + 0.32 * Math.sin(elapsed * st.twinkleSpeed + st.twinklePhase);
      skyCtx.globalAlpha = Math.min(0.95, st.baseAlpha * twinkle * (isGrand ? 1.2 : 1.0));
      skyCtx.beginPath();
      skyCtx.arc(sx, sy, st.radius, 0, Math.PI * 2);
      skyCtx.fill();
    }

    // 2B. Middle Field Luminous Stars & Golden Dust (55 glowing halos)
    if (starHaloSprite) {
      for (let i = 0; i < midStars.length; i++) {
        const ms = midStars[i];
        if (!isReducedMotion) {
          ms.nx += ms.vx;
          ms.ny += ms.vy;
          if (ms.nx > 1.02) ms.nx = -0.02;
          if (ms.ny < -0.02) ms.ny = 0.96;
        }
        const sx = ms.nx * width + (isReducedMotion ? 0 : -mouseX * ms.parallax);
        const sy = ms.ny * height + (isReducedMotion ? 0 : -mouseY * ms.parallax * 0.6);
        const twinkle = isReducedMotion ? 0.85 : 0.65 + 0.35 * Math.sin(elapsed * ms.twinkleSpeed + ms.twinklePhase);
        skyCtx.globalAlpha = Math.min(0.95, ms.baseAlpha * twinkle * (isGrand ? 1.25 : 1.0));
        skyCtx.drawImage(starHaloSprite, sx - ms.size * 0.5, sy - ms.size * 0.5, ms.size, ms.size);
      }
    }

    // 2C. Near Field Bokeh Orbs (18 soft bokeh lights)
    if (bokehOrbSprite) {
      for (let i = 0; i < nearBokeh.length; i++) {
        const bk = nearBokeh[i];
        if (!isReducedMotion) {
          bk.nx += bk.vx;
          bk.ny += bk.vy;
          if (bk.ny < -0.05) bk.ny = 0.95;
          if (bk.nx < -0.05) bk.nx = 1.04;
          if (bk.nx > 1.05) bk.nx = -0.04;
        }
        const pulse = isReducedMotion ? 0.8 : 0.65 + 0.35 * Math.sin(elapsed * 0.75 + bk.phase);
        skyCtx.globalAlpha = bk.baseAlpha * pulse * (isGrand ? 1.35 : 0.95);
        skyCtx.drawImage(bokehOrbSprite, bk.nx * width - bk.size * 0.5, bk.ny * height - bk.size * 0.5, bk.size, bk.size);
      }
    }

    // 3. Ambient Bird Flock (Active on Landing, Slide 03, Finale, or distant accent)
    const showAmbBirds =
      currentSlideIndex === -1 ||
      mood.allowBirds ||
      (orchestratorState === 'accent' && currentAccentType === 'distant-birds');

    if (showAmbBirds) {
      for (let i = 0; i < ambientBirds.length; i++) {
        const b = ambientBirds[i];
        if (!isReducedMotion) {
          b.nx += b.speed * dt;
          if (b.nx > 0.96) b.nx = 0.04;
        }
        const arcY = Math.sin(b.nx * Math.PI) * 0.018;
        const bx = b.nx * width;
        const by = Math.max(24, (b.ny - arcY) * height);
        const wingAngle = isReducedMotion ? 0.35 : elapsed * b.wingSpeed + b.phase;
        const alpha = b.tier === 'near' ? 0.86 : b.tier === 'mid' ? 0.72 : 0.54;
        drawArticulatedBird(skyCtx, bx, by, b.scale, wingAngle, b.tier, alpha, 1, -0.08);
      }
    }

    // 4. Ambient Outer-Margin Petals
    if (petalSprites.length > 0 && mood.petalDensity > 0.18) {
      for (let i = 0; i < ambientPetals.length; i++) {
        const pt = ambientPetals[i];
        if (!isReducedMotion) {
          pt.nx += pt.vx + Math.sin(elapsed * 0.8 + pt.phase) * 0.00008;
          pt.ny += pt.vy;
          pt.rot += pt.rotSpeed;
          pt.roll += pt.rollSpeed;
          if (pt.ny > 0.96) pt.ny = 0.04;
        }
        const sprite = petalSprites[pt.spriteIdx];
        skyCtx.save();
        skyCtx.globalAlpha = 0.78 * mood.petalDensity;
        skyCtx.translate(pt.nx * width, pt.ny * height);
        skyCtx.rotate(pt.rot);
        const flip3D = 0.35 + 0.65 * Math.abs(Math.cos(pt.roll));
        skyCtx.scale(pt.scale * flip3D, pt.scale);
        skyCtx.drawImage(sprite, -28, -28, 56, 56);
        skyCtx.restore();
      }
    }

    skyCtx.globalAlpha = 1;
  }

  // ===========================================================================
  // 7. RENDER SPECTACULAR FOREGROUND GRAND VFX CANVAS (#grand-vfx-canvas, z-index: 265)
  // ===========================================================================
  function renderGrandVfxCanvas(elapsed, dt) {
    if (!grandCtx || !grandCanvas) return;
    grandCtx.clearRect(0, 0, width, height);

    if (isReducedMotion || orchestratorState !== 'grand') return;

    // Smooth master envelope: swells rapidly in 0..0.35s, holds climax 0.35s..2.2s, gently subsides 2.2s..duration
    const normT = Math.min(1, grandMomentElapsed / Math.max(0.1, grandMomentDuration));
    const masterEnvelope =
      normT < 0.12
        ? normT / 0.12
        : normT > 0.62
          ? Math.max(0, 1 - (normT - 0.62) / 0.38)
          : 1.0;

    if (masterEnvelope <= 0.01) return;

    // 1. Render Golden Particle Wave ("A Thousand Lights of Gratitude" — Curl-Noise Flow Stream)
    if (waveParticles.length > 0 && starHaloSprite) {
      for (let i = 0; i < waveParticles.length; i++) {
        const wp = waveParticles[i];
        if (grandMomentElapsed < wp.delay) continue;
        wp.life += dt;

        // Curl-like sinusoidal flow field along the S-curve stream
        const curlAngle = Math.sin(wp.nx * 5.2 + elapsed * 1.4 + wp.phase) * 0.42;
        const speedMult = isLiteMode ? 0.5 : 1.0;
        const vx = wp.vx * Math.cos(curlAngle) * speedMult;
        const vy = (wp.vy + Math.sin(curlAngle) * 0.14) * speedMult;

        wp.nx += vx * dt;
        wp.ny += vy * dt;
        if (wp.nx > 1.04) wp.nx = -0.04;

        const corridorAlpha = getForegroundCorridorAlpha(wp.nx, wp.ny, grandMomentElapsed);
        const pAlpha = wp.alpha * masterEnvelope * corridorAlpha;
        if (pAlpha <= 0.03) continue;

        const px = wp.nx * width;
        const py = wp.ny * height;

        // Silky golden motion trail behind each wave particle
        grandCtx.strokeStyle = `rgba(247, 224, 174, ${(pAlpha * 0.38).toFixed(3)})`;
        grandCtx.lineWidth = wp.size > 16 ? 2.0 : 1.2;
        grandCtx.beginPath();
        grandCtx.moveTo(px, py);
        grandCtx.lineTo(px - vx * width * 0.045, py - vy * height * 0.045);
        grandCtx.stroke();

        grandCtx.globalAlpha = pAlpha;
        grandCtx.drawImage(starHaloSprite, px - wp.size * 0.5, py - wp.size * 0.5, wp.size, wp.size);
      }
    }

    // 2. Render Floral Storm ("Hoa Tri Ân Ngập Trời" — 85 3D Tumbling Petals)
    if (floralStormPetals.length > 0 && petalSprites.length > 0) {
      for (let i = 0; i < floralStormPetals.length; i++) {
        const fp = floralStormPetals[i];
        if (grandMomentElapsed < fp.delay) continue;
        fp.life += dt;

        const sway = Math.sin(elapsed * 2.1 + fp.phase) * 0.08;
        fp.nx += (fp.vx + sway) * dt;
        fp.ny += (fp.vy + Math.cos(elapsed * 1.6 + fp.phase) * 0.05) * dt;
        fp.rot += fp.rotSpeed * dt;
        fp.roll += fp.rollSpeed * dt;

        if (fp.nx > 1.05) fp.nx = -0.04;
        if (fp.nx < -0.05) fp.nx = 1.04;
        if (fp.ny < -0.05) fp.ny = 0.96;

        const corridorAlpha = getForegroundCorridorAlpha(fp.nx, fp.ny, grandMomentElapsed);
        const fAlpha = 0.92 * masterEnvelope * corridorAlpha;
        if (fAlpha <= 0.03) continue;

        const px = fp.nx * width;
        const py = fp.ny * height;
        const sprite = petalSprites[fp.spriteIdx];

        grandCtx.save();
        grandCtx.globalAlpha = fAlpha;
        grandCtx.translate(px, py);
        grandCtx.rotate(fp.rot);
        const flip3D = 0.32 + 0.68 * Math.abs(Math.cos(fp.roll));
        grandCtx.scale(fp.scale * flip3D, fp.scale);
        grandCtx.drawImage(sprite, -28, -28, 56, 56);
        grandCtx.restore();
      }
    }

    // 3. Render Grand Bird Flock (16 Articulated Birds Soaring Toward the Horizon)
    if (grandFlockBirds.length > 0) {
      for (let i = 0; i < grandFlockBirds.length; i++) {
        const gb = grandFlockBirds[i];
        gb.life += dt;
        gb.nx += gb.vx * dt;
        gb.ny += (gb.vy + Math.sin(elapsed * 1.5 + gb.phase) * 0.012) * dt;
        if (gb.nx > 1.04) gb.nx = -0.04;
        if (gb.ny < 0.025) gb.ny = 0.16;

        const bAlpha = (gb.tier === 'near' ? 0.95 : gb.tier === 'mid' ? 0.82 : 0.65) * masterEnvelope;
        if (bAlpha <= 0.03) continue;

        const bx = gb.nx * width;
        const by = gb.ny * height;
        const wingAngle = elapsed * gb.wingSpeed + gb.phase;
        drawArticulatedBird(grandCtx, bx, by, gb.scale, wingAngle, gb.tier, bAlpha, gb.vx, gb.vy);
      }
    }

    grandCtx.globalAlpha = 1;
  }

  // ===========================================================================
  // 8. THREE.JS WEBGL DEPTH BACKGROUND & UNIFIED ANIMATION LOOP
  // ===========================================================================
  function init() {
    if (skyCanvas) {
      skyCanvas.width = width;
      skyCanvas.height = height;
    }
    if (grandCanvas) {
      grandCanvas.width = width;
      grandCanvas.height = height;
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
      console.warn('WebGL fallback to 2D Canvas Engine:', e);
    }

    if (renderer) {
      const rayGeo = new THREE.PlaneGeometry(390, 250, 1, 1);
      lightRaysMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.62 },
          uDawnGlow: { value: 0.58 },
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

            float dawnBand = smoothstep(0.50, 0.92, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y)) * uDawnGlow * 0.45;
            float verticalFade = smoothstep(0.0, 0.85, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
            float radialVignette = max(0.0, 1.0 - dot(uv, uv) * 2.2);

            float alpha = ((beam1 + beam2) * verticalFade * radialVignette * 0.15 * uIntensity) + dawnBand * 0.15;
            vec3 col = mix(uColorNavy, mix(uColorGold, uColorIvory, 0.32), 0.80);
            gl_FragColor = vec4(col, alpha);
          }
        `
      });
      lightRaysMesh = new THREE.Mesh(rayGeo, lightRaysMaterial);
      lightRaysMesh.position.set(0, 0, -45);
      scene.add(lightRaysMesh);

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

        particleVelocities[i3]     = (Math.random() - 0.45) * 0.025;
        particleVelocities[i3 + 1] = (Math.random() * 0.022) + 0.005;
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
        size: 2.8,
        map: texture,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
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
    if (grandCanvas) {
      grandCanvas.width = width;
      grandCanvas.height = height;
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

    const now = performance.now();
    frameCounter++;
    if (now - fpsLastCheck >= 500) {
      currentFps = Math.min(60, Math.round((frameCounter * 1000) / (now - fpsLastCheck)));
      frameCounter = 0;
      fpsLastCheck = now;
      const telemetryEl = document.getElementById('vfx-telemetry-readout');
      if (telemetryEl && document.body.classList.contains('vfx-showcase-active')) {
        const totalStars = farStars.length + midStars.length + nearBokeh.length;
        const activeWave = orchestratorState === 'grand' ? waveParticles.length : 0;
        const activePetals = (orchestratorState === 'grand' ? floralStormPetals.length : 0) + ambientPetals.length;
        const activeBirds = (orchestratorState === 'grand' ? grandFlockBirds.length : 0) + ambientBirds.length;
        telemetryEl.textContent = `FPS: ${currentFps} | Stars: ${totalStars} | Wave: ${activeWave} | Petals: ${activePetals} | Birds: ${activeBirds}`;
      }
    }

    const elapsed = clock.getElapsedTime();
    const dt = Math.min(0.05, Math.max(0.008, elapsed - lastTime));
    lastTime = elapsed;

    // 1. Render Background Sky Canvas (#ambient-sky-canvas, z-index: 1)
    renderAmbientSkyCanvas(elapsed, dt);

    // 2. Render Foreground Spectacular Grand VFX Canvas (#grand-vfx-canvas, z-index: 265)
    renderGrandVfxCanvas(elapsed, dt);

    // 3. Render Three.js WebGL Volumetric Depth Plane (#webgl-canvas, z-index: 0)
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

    // Trigger Grand Moments & Slide-Specific Horizon Events
    if (slideIdx === -1) {
      triggerGrandMoment('landing-opening');
    } else if (slideIdx === 2 && prevSlideIdx !== 2) {
      triggerGrandMoment('slide3-horizon-flock');
    } else if (slideIdx === 3 && prevSlideIdx === 2) {
      triggerGrandMoment('slide3-horizon-flock');
    } else if (slideIdx === 5 && !isFinale) {
      triggerGrandMoment('thousand-thank-yous');
    } else if (slideIdx === 5 && isFinale) {
      triggerGrandMoment('beyond-the-horizon');
    } else {
      orchestratorState = 'resting';
      waveParticles.length = 0;
      floralStormPetals.length = 0;
      grandFlockBirds.length = 0;
      skyEl?.setAttribute('data-ambient-state', 'resting');
    }
  }

  function setReducedMotion(reduced) {
    isReducedMotion = reduced;
    if (reduced && grandCtx) {
      grandCtx.clearRect(0, 0, width, height);
    }
  }

  function setLiteMode(lite) {
    isLiteMode = lite;
  }

  function getVfxStats() {
    return {
      fps: currentFps,
      orchestratorState,
      activeGrandMoment,
      starsTotal: farStars.length + midStars.length + nearBokeh.length,
      waveCount: orchestratorState === 'grand' ? waveParticles.length : 0,
      floralStormCount: orchestratorState === 'grand' ? floralStormPetals.length : 0,
      grandBirdCount: orchestratorState === 'grand' ? grandFlockBirds.length : 0,
      ambientBirdCount: ambientBirds.length,
      ambientPetalCount: ambientPetals.length
    };
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
    setLiteMode,
    getVfxStats,
    destroy
  };
}
