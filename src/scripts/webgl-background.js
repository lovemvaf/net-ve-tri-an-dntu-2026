import * as THREE from 'three';

/**
 * V10 ULTIMATE CINEMATIC FLORAL UNIVERSE ENGINE (CinematicEnvironment)
 * Modules integrated into 1 unified rAF loop (zero duplicate loops, zero timer leaks):
 *  1. SkyWorld (Deep Sky + Far Clouds + Near Illuminated Clouds + Golden Horizon Shader)
 *  2. StarfieldSystem (Far Stars 110 + Mid Stars 55 + Near Bokeh 18)
 *  3. FloralBloomSystem (6-Stage Blooming Flowers: Bud -> Unfurl -> Full Bloom + Pollen -> Petal Release + Floral Storm)
 *  4. BirdFlockSystem (Ambient Birds + Cinematic Flock + Grand Horizon Flock with 2-joint articulated wings)
 *  5. SceneMoodManager (13 distinct subscene profiles: landing-main, s1-main, s2-main, s3-step-1..4, s4-main, s5-stage-1..3, s6-tribute, s6-finale-poster)
 *  6. AmbientBurstDirector (RecurringCinematicVFX: Automatic 4–7s recurring bursts cycling SOFT -> MEDIUM -> SOFT -> GRAND on EVERY scene)
 *  7. PerformanceController (High / Balanced / Lite / Reduced Motion tiers + Safe-Zone Debug Visualizer)
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
  let targetRayIntensity = 0.65, currentRayIntensity = 0.65;
  let targetDawnGlow = 0.62, currentDawnGlow = 0.62;

  let currentSlideIndex = -1;
  let currentStepIndex = 0;
  let currentSceneId = 'landing-main';
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let performanceTier = isLowEnd ? 'Balanced' : 'High'; // 'High' | 'Balanced' | 'Lite' | 'Reduced Motion'
  let isTabHidden = false;
  let showSafeZonesDebug = false;
  let grandOverlayEnabled = true;
  let animFrameId = null;
  const clock = new THREE.Clock();

  // Real-time FPS & Instantaneous Frame-Time Governor
  let frameCounter = 0;
  let fpsLastCheck = performance.now();
  let currentFps = 60;
  let rollingFrameMs = 16.0;

  // ===========================================================================
  // 1. SCENE MOOD PROFILES FOR ALL 13 SUBSCENES (Section XI)
  // ===========================================================================
  const SCENE_PROFILES = {
    'landing-main': {
      sceneId: 'landing-main',
      moodKey: 'landing',
      camX: 0, camY: 2, camZ: 110, speed: 0.0007, rayIntensity: 0.68, dawnGlow: 0.72, rayAngle: 0.18,
      allowBirds: true, petalDensity: 0.78, bloomStyle: 'mixed', waveDir: 'arc',
      entryBurstLevel: 'GRAND', primaryFocus: 'floral-bloom-and-wave', protectCenterPoster: true
    },
    's1-main': {
      sceneId: 's1-main',
      moodKey: 'slide-1-first-light',
      camX: 0, camY: 0, camZ: 112, speed: 0.0007, rayIntensity: 0.64, dawnGlow: 0.58, rayAngle: 0.24,
      allowBirds: false, petalDensity: 0.32, bloomStyle: 'gold', waveDir: 'horizon',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'stardust-and-knowledge-wave', protectCenterPoster: false
    },
    's2-main': {
      sceneId: 's2-main',
      moodKey: 'slide-2-teachers-light',
      camX: -18, camY: 8, camZ: 100, speed: 0.0005, rayIntensity: 0.74, dawnGlow: 0.74, rayAngle: 0.36,
      allowBirds: false, petalDensity: 0.88, bloomStyle: 'rose-ivory', waveDir: 'gentle-right',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'floral-bloom-tribute', protectCenterPoster: false
    },
    's3-step-1': {
      sceneId: 's3-step-1',
      moodKey: 'slide-3-book-boat',
      camX: 12, camY: 10, camZ: 96, speed: 0.0009, rayIntensity: 0.76, dawnGlow: 0.80, rayAngle: -0.15,
      allowBirds: true, petalDensity: 0.28, bloomStyle: 'gold', waveDir: 'arc',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'bird-flock-and-clouds', protectCenterPoster: false
    },
    's3-step-2': {
      sceneId: 's3-step-2',
      moodKey: 'slide-3-stairway',
      camX: 15, camY: 14, camZ: 94, speed: 0.0009, rayIntensity: 0.78, dawnGlow: 0.78, rayAngle: -0.20,
      allowBirds: false, petalDensity: 0.25, bloomStyle: 'sunflower-gold', waveDir: 'ascending',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'ascending-stardust-wave', protectCenterPoster: false
    },
    's3-step-3': {
      sceneId: 's3-step-3',
      moodKey: 'slide-3-ai-future',
      camX: 18, camY: 16, camZ: 92, speed: 0.0011, rayIntensity: 0.84, dawnGlow: 0.90, rayAngle: -0.24,
      allowBirds: true, petalDensity: 0.25, bloomStyle: 'gold', waveDir: 'sunrise-expand',
      entryBurstLevel: 'GRAND', primaryFocus: 'horizon-wave-and-birds', protectCenterPoster: false
    },
    's3-step-4': {
      sceneId: 's3-step-4',
      moodKey: 'slide-3-full-panorama',
      camX: 6, camY: 8, camZ: 100, speed: 0.0008, rayIntensity: 0.80, dawnGlow: 0.85, rayAngle: -0.10,
      allowBirds: true, petalDensity: 0.55, bloomStyle: 'mixed', waveDir: 'arc',
      entryBurstLevel: 'GRAND', primaryFocus: 'panorama-bloom-and-wave', protectCenterPoster: false
    },
    's4-main': {
      sceneId: 's4-main',
      moodKey: 'slide-4-sv5tot',
      camX: 6, camY: 18, camZ: 98, speed: 0.0008, rayIntensity: 0.68, dawnGlow: 0.70, rayAngle: 0.08,
      allowBirds: false, petalDensity: 0.35, bloomStyle: 'sunflower-gold', waveDir: 'ascending',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'ascending-achievement-stardust', protectCenterPoster: false
    },
    's5-stage-1': {
      sceneId: 's5-stage-1',
      moodKey: 'slide-5-stage-1-beginnings',
      camX: -10, camY: -4, camZ: 114, speed: 0.0005, rayIntensity: 0.56, dawnGlow: 0.62, rayAngle: 0.22,
      allowBirds: false, petalDensity: 0.58, bloomStyle: 'rose-ivory', waveDir: 'gentle-right',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'memory-floral-and-dust', protectCenterPoster: false, isPhotoGallery: true
    },
    's5-stage-2': {
      sceneId: 's5-stage-2',
      moodKey: 'slide-5-stage-2-effort',
      camX: -6, camY: 2, camZ: 110, speed: 0.0007, rayIntensity: 0.64, dawnGlow: 0.72, rayAngle: 0.14,
      allowBirds: true, petalDensity: 0.38, bloomStyle: 'gold', waveDir: 'ascending',
      entryBurstLevel: 'MEDIUM', primaryFocus: 'effort-birds-and-stardust', protectCenterPoster: false, isPhotoGallery: true
    },
    's5-stage-3': {
      sceneId: 's5-stage-3',
      moodKey: 'slide-5-stage-3-gratitude',
      camX: -4, camY: 6, camZ: 106, speed: 0.0006, rayIntensity: 0.72, dawnGlow: 0.80, rayAngle: 0.06,
      allowBirds: false, petalDensity: 0.85, bloomStyle: 'mixed', waveDir: 'arc',
      entryBurstLevel: 'GRAND', primaryFocus: 'gratitude-floral-bloom', protectCenterPoster: false, isPhotoGallery: true
    },
    's6-tribute': {
      sceneId: 's6-tribute',
      moodKey: 'slide-6-teacher-tribute',
      camX: 0, camY: 5, camZ: 102, speed: 0.0006, rayIntensity: 0.82, dawnGlow: 0.86, rayAngle: 0.0,
      allowBirds: false, petalDensity: 0.96, bloomStyle: 'mixed', waveDir: 'arc',
      entryBurstLevel: 'GRAND', primaryFocus: 'grand-floral-tribute', protectCenterPoster: false
    },
    's6-finale-poster': {
      sceneId: 's6-finale-poster',
      moodKey: 'finale-full-poster',
      camX: 0, camY: 10, camZ: 98, speed: 0.0006, rayIntensity: 0.88, dawnGlow: 0.95, rayAngle: -0.10,
      allowBirds: true, petalDensity: 0.75, bloomStyle: 'mixed', waveDir: 'sunrise-expand',
      entryBurstLevel: 'GRAND', primaryFocus: 'horizon-finale-all', protectCenterPoster: true, isFinalHold: true
    }
  };

  function getActiveProfile() {
    return SCENE_PROFILES[currentSceneId] || SCENE_PROFILES['landing-main'];
  }

  // ===========================================================================
  // 2. PRE-RENDERED SPRITE ATLASES (Star Halo, Bokeh, Clouds, 4 Petals, 3 Flower Ring Templates)
  // ===========================================================================
  const petalSprites = [];
  const flowerOuterSprites = [];
  const flowerInnerSprites = [];
  let starHaloSprite = null;
  let bokehOrbSprite = null;
  let farCloudSprite = null;
  let nearCloudSprite = null;

  function buildOffscreenSprites() {
    // A. Bright Star Halo & Golden Wave Mote Sprite (48x48 — Optimal GPU/CPU cache size)
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 48;
    sCanvas.height = 48;
    const sCtx = sCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(24, 24, 0, 24, 24, 24);
    sGrad.addColorStop(0, 'rgba(255, 253, 245, 1)');
    sGrad.addColorStop(0.18, 'rgba(247, 224, 174, 0.92)');
    sGrad.addColorStop(0.48, 'rgba(240, 204, 133, 0.34)');
    sGrad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 48, 48);
    starHaloSprite = sCanvas;

    // B. Soft Near-Field Bokeh Orb Sprite (64x64)
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 64;
    bCanvas.height = 64;
    const bCtx = bCanvas.getContext('2d');
    const bGrad = bCtx.createRadialGradient(32, 32, 2, 32, 32, 31);
    bGrad.addColorStop(0, 'rgba(247, 224, 174, 0.38)');
    bGrad.addColorStop(0.55, 'rgba(240, 204, 133, 0.22)');
    bGrad.addColorStop(0.82, 'rgba(244, 184, 196, 0.12)');
    bGrad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(0, 0, 64, 64);
    bokehOrbSprite = bCanvas;

    // C1. Far Cloud Sprite (192x96 — Soft deep horizon mist)
    const fcCanvas = document.createElement('canvas');
    fcCanvas.width = 192;
    fcCanvas.height = 96;
    const fcCtx = fcCanvas.getContext('2d');
    const fcGrad = fcCtx.createRadialGradient(96, 48, 8, 96, 48, 92);
    fcGrad.addColorStop(0, 'rgba(194, 208, 227, 0.15)');
    fcGrad.addColorStop(0.55, 'rgba(25, 54, 95, 0.08)');
    fcGrad.addColorStop(1, 'rgba(11, 25, 46, 0)');
    fcCtx.fillStyle = fcGrad;
    fcCtx.fillRect(0, 0, 192, 96);
    farCloudSprite = fcCanvas;

    // C2. Near Illuminated Cloud Sprite (192x96 — Warm golden dawn-lit cloud)
    const ncCanvas = document.createElement('canvas');
    ncCanvas.width = 192;
    ncCanvas.height = 96;
    const ncCtx = ncCanvas.getContext('2d');
    const ncGrad = ncCtx.createRadialGradient(96, 48, 6, 96, 48, 90);
    ncGrad.addColorStop(0, 'rgba(247, 224, 174, 0.28)');
    ncGrad.addColorStop(0.45, 'rgba(240, 204, 133, 0.14)');
    ncGrad.addColorStop(0.75, 'rgba(244, 184, 196, 0.06)');
    ncGrad.addColorStop(1, 'rgba(11, 25, 46, 0)');
    ncCtx.fillStyle = ncGrad;
    ncCtx.fillRect(0, 0, 192, 96);
    nearCloudSprite = ncCanvas;

    // D. 4 High-Art 20/11 Petal Sprites (36x36 — Fast 60fps rotation)
    petalSprites.length = 0;
    const palette = [
      { inner: '#FFE5EC', mid: '#F4B8C4', outer: '#E08A9D', vein: 'rgba(173, 31, 41, 0.28)' },
      { inner: '#FFFDF5', mid: '#F7E0AE', outer: '#D9AE5F', vein: 'rgba(154, 107, 22, 0.30)' },
      { inner: '#FFFFFF', mid: '#F8F1E3', outer: '#E5D4B8', vein: 'rgba(212, 168, 83, 0.28)' },
      { inner: '#FAD2D8', mid: '#DE6E7B', outer: '#B82937', vein: 'rgba(255, 240, 230, 0.25)' }
    ];
    palette.forEach((p) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 36;
      pCanvas.height = 36;
      const pCtx = pCanvas.getContext('2d');
      pCtx.translate(18, 18);

      const pGrad = pCtx.createLinearGradient(0, -12, 0, 12);
      pGrad.addColorStop(0, p.inner);
      pGrad.addColorStop(0.55, p.mid);
      pGrad.addColorStop(1, p.outer);

      pCtx.beginPath();
      pCtx.moveTo(0, 11);
      pCtx.bezierCurveTo(-10, 6, -12, -5, -4, -10.5);
      pCtx.quadraticCurveTo(-0.5, -8, 0, -9);
      pCtx.quadraticCurveTo(0.5, -8, 4, -10.5);
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

    // E. 3 Pre-Rendered Composite Blooming Flower Sprites (64x64 — Halo + Outer Ring + Inner Ring + Golden Pistil in 1 Blit!)
    flowerOuterSprites.length = 0;
    flowerInnerSprites.length = 0;
    const flowerThemes = [
      { petalCount: 8, innerColor: '#FFF8FA', midColor: '#F4B8C4', outerColor: '#D96B82', stroke: 'rgba(255, 250, 242, 0.7)' },
      { petalCount: 12, innerColor: '#FFFFF8', midColor: '#F7E0AE', outerColor: '#D4A853', stroke: 'rgba(255, 252, 240, 0.75)' },
      { petalCount: 10, innerColor: '#FFF5F7', midColor: '#F8F1E3', outerColor: '#E598A8', stroke: 'rgba(240, 204, 133, 0.8)' }
    ];

    flowerThemes.forEach((ft) => {
      const oCan = document.createElement('canvas');
      oCan.width = 64;
      oCan.height = 64;
      const oCtx = oCan.getContext('2d');
      oCtx.translate(32, 32);

      // Soft warm aura baked into the flower sprite
      const auraG = oCtx.createRadialGradient(0, 0, 2, 0, 0, 31);
      auraG.addColorStop(0, 'rgba(247, 224, 174, 0.35)');
      auraG.addColorStop(1, 'rgba(240, 204, 133, 0)');
      oCtx.fillStyle = auraG;
      oCtx.fillRect(-32, -32, 64, 64);

      for (let k = 0; k < ft.petalCount; k++) {
        oCtx.save();
        oCtx.rotate((k * Math.PI * 2) / ft.petalCount);
        const g = oCtx.createLinearGradient(0, -4, 0, -27);
        g.addColorStop(0, ft.innerColor);
        g.addColorStop(0.6, ft.midColor);
        g.addColorStop(1, ft.outerColor);

        oCtx.beginPath();
        oCtx.moveTo(0, -3);
        oCtx.bezierCurveTo(-8, -9, -9, -22, -2, -27);
        oCtx.quadraticCurveTo(0, -25, 2, -27);
        oCtx.bezierCurveTo(9, -22, 8, -9, 0, -3);
        oCtx.closePath();
        oCtx.fillStyle = g;
        oCtx.fill();
        oCtx.strokeStyle = ft.stroke;
        oCtx.lineWidth = 0.7;
        oCtx.stroke();
        oCtx.restore();
      }

      const innerCount = Math.max(6, ft.petalCount - 2);
      for (let k = 0; k < innerCount; k++) {
        oCtx.save();
        oCtx.rotate(((k + 0.5) * Math.PI * 2) / innerCount);
        const g = oCtx.createLinearGradient(0, -2, 0, -17);
        g.addColorStop(0, '#FFFFFF');
        g.addColorStop(0.65, ft.innerColor);
        g.addColorStop(1, ft.midColor);

        oCtx.beginPath();
        oCtx.moveTo(0, -2);
        oCtx.bezierCurveTo(-5.5, -6, -6, -14, 0, -17.5);
        oCtx.bezierCurveTo(6, -14, 5.5, -6, 0, -2);
        oCtx.closePath();
        oCtx.fillStyle = g;
        oCtx.fill();
        oCtx.restore();
      }

      const cGrad = oCtx.createRadialGradient(0, 0, 0.5, 0, 0, 6);
      cGrad.addColorStop(0, '#FFFDF5');
      cGrad.addColorStop(0.55, '#F0CC85');
      cGrad.addColorStop(1, '#B88324');
      oCtx.fillStyle = cGrad;
      oCtx.beginPath();
      oCtx.arc(0, 0, 5, 0, Math.PI * 2);
      oCtx.fill();

      for (let s = 0; s < 8; s++) {
        const a = (s * Math.PI * 2) / 8;
        oCtx.fillStyle = '#FFFDF5';
        oCtx.beginPath();
        oCtx.arc(Math.cos(a) * 6.5, Math.sin(a) * 6.5, 1.0, 0, Math.PI * 2);
        oCtx.fill();
      }
      flowerOuterSprites.push(oCan);
    });
  }

  // ===========================================================================
  // 3. SYSTEM ARRAYS & RECURRING 4–7s BURST SCHEDULER (AmbientBurstDirector)
  // ===========================================================================
  const farStars = [];
  const midStars = [];
  const nearBokeh = [];
  const farClouds = [];
  const nearClouds = [];
  const ambientBirds = [];
  const ambientPetals = [];

  // Foreground Grand / Recurring Burst VFX arrays (#grand-vfx-canvas at z-index: 265)
  const bloomFlowers = [];
  const waveParticles = [];
  const floralStormPetals = [];
  const grandFlockBirds = [];

  // RecurringCinematicVFX Scheduler State (Section X — 4–7s cycle)
  const BURST_CYCLE_PATTERN = ['SOFT', 'MEDIUM', 'SOFT', 'GRAND', 'SOFT', 'MEDIUM', 'SOFT', 'GRAND'];
  let burstCycleIndex = 0;
  let currentBurstLevel = 'GRAND'; // 'SOFT' | 'MEDIUM' | 'GRAND' | 'RESTING'
  let lastBurstDescription = 'GRAND (Opening)';
  let burstElapsed = 0;
  let burstDuration = 3.8;
  let timeSinceLastBurstStart = 0;
  let nextBurstInterval = 5.2; // Always chosen in [4.5s .. 6.4s] -> strictly inside 4–7s!
  let transitionHoldTimer = 0;
  let totalBurstsTriggered = 0;
  const burstHistory = [];

  function initAmbientSystems() {
    buildOffscreenSprites();

    // 1A. Far Stars (110)
    farStars.length = 0;
    const farCount = isLowEnd ? 68 : 110;
    for (let i = 0; i < farCount; i++) {
      farStars.push({
        nx: Math.random(),
        ny: Math.random() * 0.90,
        radius: 0.7 + Math.random() * 0.95,
        baseAlpha: 0.34 + Math.random() * 0.45,
        twinkleSpeed: 0.5 + Math.random() * 1.1,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 3
      });
    }

    // 1B. Mid Stars & Golden Dust (55)
    midStars.length = 0;
    const midCount = isLowEnd ? 35 : 55;
    for (let i = 0; i < midCount; i++) {
      midStars.push({
        nx: Math.random(),
        ny: Math.random() * 0.92,
        vx: 0.00014 + Math.random() * 0.00018,
        vy: -0.00009 - Math.random() * 0.00014,
        size: 10 + Math.random() * 14,
        baseAlpha: 0.46 + Math.random() * 0.42,
        twinkleSpeed: 0.8 + Math.random() * 0.9,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 8
      });
    }

    // 1C. Near Bokeh Orbs (18)
    nearBokeh.length = 0;
    const bokehCount = isLowEnd ? 10 : 18;
    for (let i = 0; i < bokehCount; i++) {
      const inOuterWing = i % 2 === 0;
      nearBokeh.push({
        nx: inOuterWing ? (i % 4 === 0 ? 0.02 + Math.random() * 0.14 : 0.84 + Math.random() * 0.14) : Math.random(),
        ny: inOuterWing ? 0.1 + Math.random() * 0.8 : 0.02 + Math.random() * 0.22,
        vx: (Math.random() - 0.4) * 0.00015,
        vy: -0.00012 - Math.random() * 0.00012,
        size: 28 + Math.random() * 28,
        baseAlpha: 0.24 + Math.random() * 0.24,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 2A. Far Clouds (2 slow deep horizon clouds)
    farClouds.length = 0;
    for (let i = 0; i < 2; i++) {
      farClouds.push({
        nx: 0.22 + i * 0.52,
        ny: 0.045 + (i % 2) * 0.04,
        scaleX: 1.5,
        scaleY: 0.75,
        speedX: 0.0014,
        alpha: 0.38
      });
    }

    // 2B. Near Dawn-Lit Clouds (2 warm golden clouds)
    nearClouds.length = 0;
    for (let i = 0; i < 2; i++) {
      nearClouds.push({
        nx: 0.15 + i * 0.58,
        ny: 0.065 + (i % 2) * 0.045,
        scaleX: 1.35,
        scaleY: 0.7,
        speedX: 0.0024,
        alpha: 0.42
      });
    }

    // 3. Ambient Birds (8 graceful birds in upper sky)
    ambientBirds.length = 0;
    const ambBirdConfigs = [
      { nx: 0.12, ny: 0.072, scale: 1.15, speed: 0.032, wingSpeed: 3.8, phase: 0.0, tier: 'near' },
      { nx: 0.16, ny: 0.056, scale: 0.98, speed: 0.032, wingSpeed: 4.1, phase: 0.8, tier: 'near' },
      { nx: 0.20, ny: 0.080, scale: 0.88, speed: 0.031, wingSpeed: 3.9, phase: 1.6, tier: 'mid' },
      { nx: 0.24, ny: 0.062, scale: 0.78, speed: 0.030, wingSpeed: 3.6, phase: 2.3, tier: 'mid' },
      { nx: 0.58, ny: 0.066, scale: 1.05, speed: 0.028, wingSpeed: 3.7, phase: 0.4, tier: 'near' },
      { nx: 0.63, ny: 0.050, scale: 0.90, speed: 0.028, wingSpeed: 4.0, phase: 1.2, tier: 'mid' },
      { nx: 0.67, ny: 0.072, scale: 0.76, speed: 0.027, wingSpeed: 3.5, phase: 2.1, tier: 'far' },
      { nx: 0.71, ny: 0.056, scale: 0.68, speed: 0.027, wingSpeed: 3.4, phase: 2.9, tier: 'far' }
    ];
    ambBirdConfigs.forEach((b) => ambientBirds.push({ ...b }));

    // 4. Ambient Outer Petals (16)
    ambientPetals.length = 0;
    for (let i = 0; i < 16; i++) {
      const isLeft = i % 2 === 0;
      ambientPetals.push({
        nx: isLeft ? 0.015 + (i * 0.012) % 0.085 : 0.90 + (i * 0.012) % 0.085,
        ny: (i / 16) * 0.92,
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
  // 4. SPAWNERS FOR BLOOMING FLOWERS, PARTICLE WAVES, FLORAL STORM & BIRDS
  // ===========================================================================
  function getTierMultiplier() {
    if (performanceTier === 'Lite') return 0.4;
    if (performanceTier === 'Balanced') return 0.7;
    return 1.0;
  }

  // A. Spawn Multi-Stage Blooming Flowers (Section VII.B — Bud -> Open Petals -> Full Bloom + Pollen -> Release)
  function spawnFloralBlooms(count = 10, duration = 3.8, bloomStyle = 'mixed') {
    bloomFlowers.length = 0;
    const actualCount = Math.max(3, Math.round(count * getTierMultiplier()));
    // Anchor positions along the upper sky arch, left/right exhibition wings, and corner vignettes
    const anchors = [
      { nx: 0.055, ny: 0.18 }, { nx: 0.945, ny: 0.18 },
      { nx: 0.048, ny: 0.48 }, { nx: 0.952, ny: 0.48 },
      { nx: 0.062, ny: 0.78 }, { nx: 0.938, ny: 0.78 },
      { nx: 0.18,  ny: 0.065 }, { nx: 0.82,  ny: 0.065 },
      { nx: 0.32,  ny: 0.055 }, { nx: 0.68,  ny: 0.055 },
      { nx: 0.12,  ny: 0.88 },  { nx: 0.88,  ny: 0.88 },
      { nx: 0.24,  ny: 0.11 },  { nx: 0.76,  ny: 0.11 }
    ];

    for (let i = 0; i < actualCount; i++) {
      const anchor = anchors[i % anchors.length];
      let themeIdx = i % 3;
      if (bloomStyle === 'rose-ivory') themeIdx = i % 2 === 0 ? 0 : 2;
      else if (bloomStyle === 'gold' || bloomStyle === 'sunflower-gold') themeIdx = 1;

      const delay = (i / actualCount) * 0.55;
      bloomFlowers.push({
        nx: anchor.nx + (Math.random() - 0.5) * 0.025,
        ny: anchor.ny + (Math.random() - 0.5) * 0.025,
        maxRadius: 34 + (i % 3) * 11, // 68px to 112px full bloom diameter!
        themeIdx,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (i % 2 === 0 ? 1 : -1) * 0.18,
        delay,
        life: 0,
        maxLife: duration - delay * 0.4,
        releasedPetals: false,
        phase: i * 1.1
      });
    }
  }

  // B. Spawn Golden Particle Wave (Section VIII.B — Directed Flow Streams)
  function spawnGoldenParticleWave(count = 160, duration = 3.6, waveDir = 'arc') {
    waveParticles.length = 0;
    const actualCount = Math.max(25, Math.round(count * getTierMultiplier()));
    for (let i = 0; i < actualCount; i++) {
      const streamIdx = i % 3;
      const baseNy = streamIdx === 0 ? 0.12 : streamIdx === 1 ? 0.48 : 0.84;
      const delay = (i / actualCount) * 0.65;
      const isAscending = waveDir === 'ascending';
      waveParticles.push({
        nx: -0.04 + (i / actualCount) * 0.85 + (Math.random() - 0.5) * 0.08,
        ny: isAscending ? 0.88 - (i / actualCount) * 0.65 : baseNy + (Math.random() - 0.5) * 0.15,
        vx: isAscending ? 0.18 + Math.random() * 0.14 : 0.22 + Math.random() * 0.18,
        vy: isAscending ? -0.16 - Math.random() * 0.12 : -0.04 + (Math.random() - 0.5) * 0.08,
        size: i % 5 === 0 ? 22 + Math.random() * 14 : 9 + Math.random() * 11,
        alpha: 0.68 + Math.random() * 0.32,
        phase: Math.random() * Math.PI * 2,
        delay,
        life: 0,
        maxLife: duration - delay * 0.4,
        waveDir
      });
    }
  }

  // C. Spawn Floral Wave / Storm (Section VII.C & VII.D)
  function spawnFloralStorm(count = 75, duration = 3.7) {
    floralStormPetals.length = 0;
    const actualCount = Math.max(16, Math.round(count * getTierMultiplier()));
    for (let i = 0; i < actualCount; i++) {
      const fromLeft = i % 2 === 0;
      const tier = i % 4 === 0 ? 'near' : i % 2 === 0 ? 'mid' : 'far';
      const scale = tier === 'near' ? 0.86 + Math.random() * 0.34 : tier === 'mid' ? 0.58 + Math.random() * 0.22 : 0.38 + Math.random() * 0.16;
      const delay = (i / actualCount) * 0.65;
      floralStormPetals.push({
        nx: fromLeft ? -0.03 + Math.random() * 0.46 : 0.54 + Math.random() * 0.48,
        ny: 0.10 + Math.random() * 0.84,
        vx: (fromLeft ? 1 : -0.65) * (0.15 + Math.random() * 0.16),
        vy: -0.12 - Math.random() * 0.15,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2.2,
        roll: Math.random() * Math.PI * 2,
        rollSpeed: 2.1 + Math.random() * 1.9,
        scale,
        spriteIdx: i % petalSprites.length,
        delay,
        life: 0,
        maxLife: duration - delay * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // D. Spawn Cinematic / Grand Horizon Bird Flock (Section IX)
  function spawnGrandBirdFlock(count = 14, duration = 3.7) {
    grandFlockBirds.length = 0;
    const actualCount = Math.max(5, Math.round(count * getTierMultiplier()));
    for (let i = 0; i < actualCount; i++) {
      const groupIdx = i % 3;
      const tier = i % 3 === 0 ? 'near' : i % 3 === 1 ? 'mid' : 'far';
      const scale = tier === 'near' ? 1.45 + (i % 3) * 0.18 : tier === 'mid' ? 1.08 + (i % 2) * 0.14 : 0.78 + (i % 2) * 0.12;
      const startNx = 0.04 + groupIdx * 0.18 + (i * 0.038) % 0.28;
      const startNy = 0.055 + groupIdx * 0.042 + (i % 4) * 0.022;
      grandFlockBirds.push({
        nx: startNx,
        ny: startNy,
        vx: 0.14 + scale * 0.042,
        vy: -0.020 - (i % 3) * 0.007,
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
  // 5. RECURRING BURST ORCHESTRATOR (4–7s Cycle: SOFT -> MEDIUM -> SOFT -> GRAND)
  // ===========================================================================
  function triggerSceneBurst(level = 'MEDIUM', customMode = null) {
    if (isReducedMotion) return;
    const profile = getActiveProfile();
    currentBurstLevel = level;
    burstElapsed = 0;
    timeSinceLastBurstStart = 0;
    // Choose next burst interval strictly within 4.5s .. 6.2s (inside 4–7s target window!)
    nextBurstInterval = 4.6 + (totalBurstsTriggered % 3) * 0.55;
    totalBurstsTriggered++;

    const skyLayer = document.getElementById('living-sky-layer');
    skyLayer?.setAttribute('data-ambient-state', customMode || `${level.toLowerCase()}-${profile.sceneId}`);

    if (customMode === 'floral-bloom') {
      burstDuration = 3.9;
      spawnFloralBlooms(14, 3.9, profile.bloomStyle);
      spawnFloralStorm(45, 3.6);
      waveParticles.length = 0;
      grandFlockBirds.length = 0;
      lastBurstDescription = `FLORAL BLOOM (${profile.sceneId})`;
    } else if (customMode === 'floral-storm' || customMode === 'thousand-thank-yous') {
      burstDuration = 3.9;
      spawnFloralBlooms(12, 3.8, 'mixed');
      spawnFloralStorm(88, 3.9);
      spawnGoldenParticleWave(130, 3.5, 'arc');
      grandFlockBirds.length = 0;
      lastBurstDescription = `FLORAL STORM (${profile.sceneId})`;
    } else if (customMode === 'bird-flock' || customMode === 'bird-flock-only') {
      burstDuration = 3.8;
      spawnGrandBirdFlock(18, 3.8);
      spawnGoldenParticleWave(80, 3.4, 'arc');
      bloomFlowers.length = 0;
      floralStormPetals.length = 0;
      lastBurstDescription = `BIRD FLOCK (${profile.sceneId})`;
    } else if (customMode === 'particle-wave' || customMode === 'particle-wave-only') {
      burstDuration = 3.8;
      spawnGoldenParticleWave(220, 3.8, profile.waveDir);
      bloomFlowers.length = 0;
      floralStormPetals.length = 0;
      grandFlockBirds.length = 0;
      lastBurstDescription = `GOLDEN WAVE (${profile.sceneId})`;
    } else if (level === 'SOFT') {
      burstDuration = 3.1;
      spawnFloralBlooms(5, 3.1, profile.bloomStyle);
      spawnFloralStorm(26, 3.0);
      spawnGoldenParticleWave(58, 3.0, profile.waveDir);
      if (profile.allowBirds) spawnGrandBirdFlock(6, 3.1);
      else grandFlockBirds.length = 0;
      lastBurstDescription = `SOFT (${profile.sceneId})`;
    } else if (level === 'MEDIUM') {
      burstDuration = 3.5;
      spawnFloralBlooms(9, 3.5, profile.bloomStyle);
      spawnFloralStorm(50, 3.4);
      spawnGoldenParticleWave(115, 3.4, profile.waveDir);
      if (profile.allowBirds) spawnGrandBirdFlock(10, 3.5);
      else grandFlockBirds.length = 0;
      lastBurstDescription = `MEDIUM (${profile.sceneId})`;
    } else {
      // GRAND Burst (Landing, Teacher Tribute, Final Poster, or every 4th recurring cycle!)
      burstDuration = 3.9;
      spawnFloralBlooms(10, 3.9, profile.bloomStyle);
      spawnFloralStorm(profile.sceneId === 's6-tribute' ? 76 : 36, 3.8);
      spawnGoldenParticleWave(profile.sceneId === 's6-finale-poster' ? 160 : 140, 3.8, profile.waveDir);
      if (profile.allowBirds || level === 'GRAND') {
        spawnGrandBirdFlock(profile.sceneId === 's6-tribute' ? 0 : 15, 3.8);
      } else {
        grandFlockBirds.length = 0;
      }
      lastBurstDescription = `GRAND (${profile.sceneId})`;
    }

    burstHistory.push({
      index: totalBurstsTriggered,
      level,
      mode: customMode || level,
      sceneId: profile.sceneId,
      timestampMs: Math.round(performance.now())
    });
    if (burstHistory.length > 30) burstHistory.shift();
  }

  function triggerGrandMoment(momentName) {
    if (momentName === 'landing-opening') {
      triggerSceneBurst('GRAND', 'landing-opening');
    } else if (momentName === 'thousand-thank-yous') {
      triggerSceneBurst('GRAND', 'thousand-thank-yous');
    } else if (momentName === 'beyond-the-horizon') {
      triggerSceneBurst('GRAND', 'beyond-the-horizon');
    } else if (momentName === 'bird-flock-only' || momentName === 'slide3-horizon-flock') {
      triggerSceneBurst('GRAND', 'bird-flock');
    } else if (momentName === 'particle-wave-only') {
      triggerSceneBurst('GRAND', 'particle-wave');
    } else if (momentName === 'floral-storm-only') {
      triggerSceneBurst('GRAND', 'floral-storm');
    } else if (momentName === 'floral-bloom') {
      triggerSceneBurst('GRAND', 'floral-bloom');
    } else if (momentName === 'soft-burst') {
      triggerSceneBurst('SOFT');
    } else if (momentName === 'medium-burst') {
      triggerSceneBurst('MEDIUM');
    } else {
      triggerSceneBurst('GRAND');
    }
  }

  // ===========================================================================
  // 6. DRAWING HELPERS: BLOOMING FLOWERS, ARTICULATED BIRDS & SAFE-ZONE MASKS
  // ===========================================================================
  function getForegroundCorridorAlpha(nx, ny, elapsedInBurst) {
    const profile = getActiveProfile();
    // Protect central poster on Landing & Finale [x: 0.34..0.66, y: 0.18..0.84]
    if (profile.protectCenterPoster && nx > 0.34 && nx < 0.66 && ny > 0.18 && ny < 0.84) {
      if (profile.isFinalHold) return 0.0;
      return elapsedInBurst < 0.9 ? 0.32 * (1 - elapsedInBurst / 0.9) : 0.0;
    }
    // Protect real photo faces on Slide 05 gallery [x: 0.12..0.88, y: 0.24..0.82]
    if (profile.isPhotoGallery && nx > 0.12 && nx < 0.88 && ny > 0.24 && ny < 0.82) {
      return elapsedInBurst < 0.8 ? 0.28 * (1 - elapsedInBurst / 0.8) : 0.0;
    }
    return 1.0;
  }

  // Draw a 6-Stage Blooming Flower (Bud -> Outer Ring -> Inner Ring -> Full Bloom + Pollen -> Petal Release)
  function drawBloomingFlower(ctx, bf, elapsed, dt, masterEnv) {
    if (grandMomentCheckElapsed(bf) < 0) return;
    bf.life += dt;
    const p = Math.min(1, bf.life / Math.max(0.2, bf.maxLife));
    if (p >= 1) return;

    const corridorAlpha = getForegroundCorridorAlpha(bf.nx, bf.ny, burstElapsed);
    if (corridorAlpha <= 0.02) return;

    // 6-Stage Lifecycle Curves:
    // Stage 1 (0..0.18): Bud emergence
    // Stage 2 (0.18..0.52): Outer & inner petals unfurl
    // Stage 3 (0.52..0.78): Full radiant bloom + orbiting pollen sparkles
    // Stage 4 (0.78..1.00): Petal detachment & gentle fade
    const outerScale =
      p < 0.18
        ? 0.18 + (p / 0.18) * 0.22
        : p < 0.52
          ? 0.40 + ((p - 0.18) / 0.34) * 0.60
          : 1.0 + (p - 0.52) * 0.12;

    const innerScale =
      p < 0.22
        ? 0.10
        : p < 0.58
          ? 0.10 + ((p - 0.22) / 0.36) * 0.90
          : 1.0;

    const alpha =
      (p < 0.15 ? p / 0.15 : p > 0.74 ? Math.max(0, 1 - (p - 0.74) / 0.26) : 1.0) *
      0.88 *
      masterEnv *
      corridorAlpha;

    if (alpha <= 0.02) return;

    // Release 2 drifting petals into floralStormPetals when reaching Stage 4 (p >= 0.72)
    if (!bf.releasedPetals && p >= 0.72 && floralStormPetals.length < 110) {
      bf.releasedPetals = true;
      for (let k = 0; k < 2; k++) {
        floralStormPetals.push({
          nx: bf.nx,
          ny: bf.ny,
          vx: (bf.nx < 0.5 ? 1 : -1) * (0.12 + k * 0.06),
          vy: -0.08 - k * 0.05,
          rot: bf.rot + k,
          rotSpeed: 1.8,
          roll: k * 1.2,
          rollSpeed: 2.2,
          scale: 0.56,
          spriteIdx: bf.themeIdx % petalSprites.length,
          delay: 0,
          life: 0,
          maxLife: 1.8,
          phase: bf.phase + k
        });
      }
    }

    const fx = bf.nx * width;
    const fy = bf.ny * height;
    const d = Math.round(bf.maxRadius * 2.0 * outerScale);
    const outerSprite = flowerOuterSprites[bf.themeIdx % flowerOuterSprites.length];
    if (outerSprite && d > 4) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(outerSprite, fx - d * 0.5, fy - d * 0.5, d, d);
    }
  }

  function grandMomentCheckElapsed(item) {
    return burstElapsed - (item.delay || 0);
  }

  function drawArticulatedBird(ctx, x, y, scale, wingAngle, tier, alpha, vx = 1, vy = -0.12) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    const heading = Math.atan2(vy, vx);
    ctx.rotate(Math.max(-0.32, Math.min(0.18, heading * 0.65)));
    ctx.scale(scale, scale);

    const flap = Math.sin(wingAngle);
    const wrist = Math.sin(wingAngle - 0.55);
    const shoulderY = -4.5 - flap * 4.2;
    const tipY = -2.0 - flap * 8.5 - wrist * 3.2;

    if (tier !== 'far' && starHaloSprite) {
      ctx.globalAlpha = alpha * 0.28;
      ctx.drawImage(starHaloSprite, -22, -22, 44, 44);
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = tier === 'far' ? '#F0CC85' : '#FFFDF7';
    ctx.strokeStyle = 'rgba(240, 204, 133, 0.85)';
    ctx.lineWidth = tier === 'near' ? 1.1 : 0.7;

    ctx.beginPath();
    ctx.moveTo(-21, tipY);
    ctx.quadraticCurveTo(-10, shoulderY, -1.5, -1.2);
    ctx.lineTo(0, -2.8);
    ctx.lineTo(1.5, -1.2);
    ctx.quadraticCurveTo(10, shoulderY, 21, tipY);
    ctx.quadraticCurveTo(10, shoulderY + 3.4, 2.2, 2.0);
    ctx.lineTo(0, 4.2);
    ctx.lineTo(-2.2, 2.0);
    ctx.quadraticCurveTo(-10, shoulderY + 3.4, -21, tipY);
    ctx.closePath();
    ctx.fill();
    if (tier !== 'far') ctx.stroke();

    ctx.restore();
  }

  // ===========================================================================
  // 7. RENDER BACKGROUND SKY CANVAS (#ambient-sky-canvas, z-index: 1)
  // ===========================================================================
  function renderAmbientSkyCanvas(elapsed, dt) {
    if (!skyCtx || !skyCanvas) return;

    const profile = getActiveProfile();

    // Update Central 4–7s Recurring Burst Scheduler (Section X)
    if (!isReducedMotion) {
      if (transitionHoldTimer > 0) {
        transitionHoldTimer = Math.max(0, transitionHoldTimer - dt);
      } else {
        timeSinceLastBurstStart += dt;
        burstElapsed += dt;

        if (burstElapsed >= burstDuration && currentBurstLevel !== 'RESTING') {
          currentBurstLevel = 'RESTING';
          const skyLayer = document.getElementById('living-sky-layer');
          skyLayer?.setAttribute('data-ambient-state', `resting-${profile.sceneId}`);
        }

        // Automatically trigger next recurring burst when 4.6s..6.2s interval elapses!
        if (timeSinceLastBurstStart >= nextBurstInterval) {
          burstCycleIndex = (burstCycleIndex + 1) % BURST_CYCLE_PATTERN.length;
          const nextLevel = BURST_CYCLE_PATTERN[burstCycleIndex];
          triggerSceneBurst(nextLevel);
        }
      }
    }

    // Interleave ambient sky canvas redraw on odd frames when foreground burst is active to halve CPU canvas compositing cost
    if (currentBurstLevel !== 'RESTING' && frameCounter % 2 === 1) {
      return;
    }

    skyCtx.clearRect(0, 0, width, height);

    const isBurstActive = currentBurstLevel !== 'RESTING';

    // 1A. Far Clouds
    if (farCloudSprite) {
      for (let i = 0; i < farClouds.length; i++) {
        const fc = farClouds[i];
        if (!isReducedMotion) {
          fc.nx += fc.speedX * dt;
          if (fc.nx > 1.2) fc.nx = -0.2;
        }
        const cw = 360 * fc.scaleX;
        const ch = 160 * fc.scaleY;
        skyCtx.globalAlpha = fc.alpha * profile.dawnGlow;
        skyCtx.drawImage(farCloudSprite, fc.nx * width - cw * 0.5, fc.ny * height - ch * 0.5, cw, ch);
      }
    }

    // 1B. Near Dawn-Lit Clouds
    if (nearCloudSprite) {
      for (let i = 0; i < nearClouds.length; i++) {
        const nc = nearClouds[i];
        if (!isReducedMotion) {
          nc.nx += nc.speedX * dt;
          if (nc.nx > 1.2) nc.nx = -0.2;
        }
        const cw = 360 * nc.scaleX;
        const ch = 160 * nc.scaleY;
        skyCtx.globalAlpha = nc.alpha * profile.dawnGlow;
        skyCtx.drawImage(nearCloudSprite, nc.nx * width - cw * 0.5, nc.ny * height - ch * 0.5, cw, ch);
      }
    }

    // 2A. Far Stars (110)
    const ambStride = rollingFrameMs > 23 ? 2 : 1;
    skyCtx.fillStyle = '#F8F1E3';
    for (let i = 0; i < farStars.length; i += ambStride) {
      const st = farStars[i];
      const sx = st.nx * width + (isReducedMotion ? 0 : -mouseX * st.parallax);
      const sy = st.ny * height + (isReducedMotion ? 0 : -mouseY * st.parallax * 0.6);
      const twinkle = isReducedMotion ? 1 : 0.68 + 0.32 * Math.sin(elapsed * st.twinkleSpeed + st.twinklePhase);
      skyCtx.globalAlpha = Math.min(0.95, st.baseAlpha * twinkle * (isBurstActive ? 1.15 : 1.0));
      skyCtx.beginPath();
      skyCtx.arc(sx, sy, st.radius, 0, Math.PI * 2);
      skyCtx.fill();
    }

    // 2B. Mid Stars & Golden Dust (55)
    if (starHaloSprite) {
      for (let i = 0; i < midStars.length; i += ambStride) {
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
        skyCtx.globalAlpha = Math.min(0.95, ms.baseAlpha * twinkle * (isBurstActive ? 1.2 : 1.0));
        skyCtx.drawImage(starHaloSprite, sx - ms.size * 0.5, sy - ms.size * 0.5, ms.size, ms.size);
      }
    }

    // 2C. Near Bokeh Orbs (18)
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
        skyCtx.globalAlpha = bk.baseAlpha * pulse * (isBurstActive ? 1.25 : 0.95);
        skyCtx.drawImage(bokehOrbSprite, bk.nx * width - bk.size * 0.5, bk.ny * height - bk.size * 0.5, bk.size, bk.size);
      }
    }

    // 3. Ambient Birds
    if (profile.allowBirds) {
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

    // 4. Ambient Outer Petals
    if (petalSprites.length > 0 && profile.petalDensity > 0.18) {
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
        skyCtx.globalAlpha = 0.78 * profile.petalDensity;
        skyCtx.translate(pt.nx * width, pt.ny * height);
        skyCtx.rotate(pt.rot);
        const flip3D = 0.35 + 0.65 * Math.abs(Math.cos(pt.roll));
        skyCtx.scale(pt.scale * flip3D, pt.scale);
        skyCtx.drawImage(sprite, -18, -18, 36, 36);
        skyCtx.restore();
      }
    }

    skyCtx.globalAlpha = 1;
  }

  // ===========================================================================
  // 8. RENDER FOREGROUND GRAND & RECURRING VFX CANVAS (#grand-vfx-canvas, z-index: 265)
  // ===========================================================================
  function renderGrandVfxCanvas(elapsed, dt) {
    if (!grandCtx || !grandCanvas) return;
    grandCtx.clearRect(0, 0, width, height);

    // Optional Safe-Zone Debug Overlay for VFX Debug Studio
    if (showSafeZonesDebug) {
      const profile = getActiveProfile();
      grandCtx.save();
      grandCtx.strokeStyle = 'rgba(240, 204, 133, 0.75)';
      grandCtx.lineWidth = 2;
      grandCtx.setLineDash([8, 6]);
      if (profile.protectCenterPoster) {
        grandCtx.strokeRect(0.34 * width, 0.18 * height, 0.32 * width, 0.66 * height);
      } else if (profile.isPhotoGallery) {
        grandCtx.strokeRect(0.12 * width, 0.24 * height, 0.76 * width, 0.58 * height);
      }
      grandCtx.restore();
    }

    if (isReducedMotion || !grandOverlayEnabled || currentBurstLevel === 'RESTING') return;

    const normT = Math.min(1, burstElapsed / Math.max(0.1, burstDuration));
    const masterEnvelope =
      normT < 0.14
        ? normT / 0.14
        : normT > 0.64
          ? Math.max(0, 1 - (normT - 0.64) / 0.36)
          : 1.0;

    if (masterEnvelope <= 0.01) return;

    // Adaptive stride governor (PerformanceController): keeps FPS >= 45 even on software SwiftShader
    const stride = rollingFrameMs > 22 ? 2 : 1;

    // 1. Render Multi-Stage Blooming Flowers (FloralBloomSystem — Section VII.B)
    if (bloomFlowers.length > 0) {
      for (let i = 0; i < bloomFlowers.length; i += stride) {
        drawBloomingFlower(grandCtx, bloomFlowers[i], elapsed, dt, masterEnvelope);
      }
    }

    // 2. Render Golden Particle Wave ("A Thousand Lights of Gratitude" — Single Batched Path + Sprite Blit)
    if (waveParticles.length > 0 && starHaloSprite) {
      grandCtx.strokeStyle = `rgba(247, 224, 174, ${(0.32 * masterEnvelope).toFixed(3)})`;
      grandCtx.lineWidth = 1.4;
      grandCtx.beginPath();
      for (let i = 0; i < waveParticles.length; i += stride) {
        const wp = waveParticles[i];
        if (burstElapsed < wp.delay) continue;
        wp.life += dt;

        const curlAngle = Math.sin(wp.nx * 5.2 + elapsed * 1.4 + wp.phase) * 0.42;
        const speedMult = performanceTier === 'Lite' ? 0.55 : 1.0;
        const vx = wp.vx * Math.cos(curlAngle) * speedMult;
        const vy = (wp.vy + Math.sin(curlAngle) * 0.14) * speedMult;

        wp.nx += vx * dt;
        wp.ny += vy * dt;
        if (wp.nx > 1.04) wp.nx = -0.04;
        if (wp.ny < -0.04) wp.ny = 0.96;

        const corridorAlpha = getForegroundCorridorAlpha(wp.nx, wp.ny, burstElapsed);
        const pAlpha = wp.alpha * masterEnvelope * corridorAlpha;
        if (pAlpha <= 0.03) continue;

        const px = wp.nx * width;
        const py = wp.ny * height;

        if (i % 3 === 0) {
          grandCtx.moveTo(px, py);
          grandCtx.lineTo(px - vx * width * 0.042, py - vy * height * 0.042);
        }

        grandCtx.globalAlpha = pAlpha;
        grandCtx.drawImage(starHaloSprite, px - wp.size * 0.5, py - wp.size * 0.5, wp.size, wp.size);
      }
      grandCtx.globalAlpha = 1;
      grandCtx.stroke();
    }

    // 3. Render Floral Storm ("Hoa Tri Ân Ngập Trời")
    if (floralStormPetals.length > 0 && petalSprites.length > 0) {
      for (let i = 0; i < floralStormPetals.length; i += stride) {
        const fp = floralStormPetals[i];
        if (burstElapsed < fp.delay) continue;
        fp.life += dt;

        const sway = Math.sin(elapsed * 2.1 + fp.phase) * 0.08;
        fp.nx += (fp.vx + sway) * dt;
        fp.ny += (fp.vy + Math.cos(elapsed * 1.6 + fp.phase) * 0.05) * dt;
        fp.rot += fp.rotSpeed * dt;
        fp.roll += fp.rollSpeed * dt;

        if (fp.nx > 1.05) fp.nx = -0.04;
        if (fp.nx < -0.05) fp.nx = 1.04;
        if (fp.ny < -0.05) fp.ny = 0.96;

        const corridorAlpha = getForegroundCorridorAlpha(fp.nx, fp.ny, burstElapsed);
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
        grandCtx.drawImage(sprite, -18, -18, 36, 36);
        grandCtx.restore();
      }
    }

    // 4. Render Grand Bird Flock
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
  // 9. THREE.JS WEBGL DEPTH BACKGROUND & UNIFIED ANIMATION LOOP
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
          uIntensity: { value: 0.65 },
          uDawnGlow: { value: 0.62 },
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

            float dawnBand = smoothstep(0.48, 0.92, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y)) * uDawnGlow * 0.48;
            float verticalFade = smoothstep(0.0, 0.85, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
            float radialVignette = max(0.0, 1.0 - dot(uv, uv) * 2.2);

            float alpha = ((beam1 + beam2) * verticalFade * radialVignette * 0.15 * uIntensity) + dawnBand * 0.16;
            vec3 col = mix(uColorNavy, mix(uColorGold, uColorIvory, 0.34), 0.82);
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
    if (now - fpsLastCheck >= 450) {
      currentFps = Math.min(60, Math.round((frameCounter * 1000) / (now - fpsLastCheck)));
      frameCounter = 0;
      fpsLastCheck = now;

      if (document.body.classList.contains('vfx-showcase-active')) {
        const telemetryEl = document.getElementById('vfx-telemetry-readout');
        const countsEl = document.getElementById('vfx-telemetry-counts');
        const profile = getActiveProfile();
        const nextIn = Math.max(0, nextBurstInterval - timeSinceLastBurstStart).toFixed(1);
        if (telemetryEl) {
          telemetryEl.textContent = `Scene: ${currentSceneId} | Mood: ${profile.moodKey} | Burst: ${currentBurstLevel} | Next: ${nextIn}s | FPS: ${currentFps} | Tier: ${performanceTier}`;
        }
        if (countsEl) {
          const totalStars = farStars.length + midStars.length + nearBokeh.length;
          const activeBlooms = currentBurstLevel !== 'RESTING' ? bloomFlowers.length : 0;
          const activeWave = currentBurstLevel !== 'RESTING' ? waveParticles.length : 0;
          const activePetals = (currentBurstLevel !== 'RESTING' ? floralStormPetals.length : 0) + ambientPetals.length;
          const activeBirds = (currentBurstLevel !== 'RESTING' ? grandFlockBirds.length : 0) + (profile.allowBirds ? ambientBirds.length : 0);
          countsEl.textContent = `Last Burst: ${lastBurstDescription} | Blooms: ${activeBlooms} | Petals: ${activePetals} | Wave: ${activeWave} | Stars: ${totalStars} | Birds: ${activeBirds}`;
        }
      }
    }

    const elapsed = clock.getElapsedTime();
    const rawMs = (elapsed - lastTime) * 1000;
    if (rawMs > 4 && rawMs < 120) {
      rollingFrameMs = rollingFrameMs * 0.72 + rawMs * 0.28;
    }
    const dt = Math.min(0.05, Math.max(0.008, elapsed - lastTime));
    lastTime = elapsed;

    // 1. Render Background Sky Canvas (#ambient-sky-canvas, z-index: 1)
    renderAmbientSkyCanvas(elapsed, dt);

    // 2. Render Foreground Spectacular Grand & Recurring VFX Canvas (#grand-vfx-canvas, z-index: 265)
    renderGrandVfxCanvas(elapsed, dt);

    // 3. Render Three.js WebGL Volumetric Depth Plane (#webgl-canvas, z-index: 0)
    if (!renderer) return;
    const profile = getActiveProfile();

    targetCameraX = profile.camX + (isReducedMotion ? 0 : mouseX * 7);
    targetCameraY = profile.camY + (isReducedMotion ? 0 : -mouseY * 5.5);
    targetCameraZ = profile.camZ;
    targetRayIntensity = profile.rayIntensity;
    targetDawnGlow = profile.dawnGlow;

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
      lightRaysMaterial.uniforms.uAngle.value += (profile.rayAngle - lightRaysMaterial.uniforms.uAngle.value) * 0.03;
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
      particles.rotation.y += profile.speed * 0.5;
    }

    renderer.render(scene, camera);
  }

  // Subscene-aware state update (Section III.1 & Section XI)
  function setSlideMood(slideIdx, isFinale = false, prevSlideIdx = null, stepIdx = 0, stepId = null) {
    currentSlideIndex = slideIdx;
    currentStepIndex = stepIdx;

    if (stepId && SCENE_PROFILES[stepId]) {
      currentSceneId = stepId;
    } else if (slideIdx === -1) {
      currentSceneId = 'landing-main';
    } else if (slideIdx === 0) {
      currentSceneId = 's1-main';
    } else if (slideIdx === 1) {
      currentSceneId = 's2-main';
    } else if (slideIdx === 2) {
      currentSceneId = `s3-step-${stepIdx + 1}`;
    } else if (slideIdx === 3) {
      currentSceneId = 's4-main';
    } else if (slideIdx === 4) {
      currentSceneId = `s5-stage-${stepIdx + 1}`;
    } else if (slideIdx === 5) {
      currentSceneId = isFinale || stepIdx === 1 ? 's6-finale-poster' : 's6-tribute';
    }

    const profile = getActiveProfile();
    const skyEl = document.getElementById('living-sky-layer');
    if (skyEl) {
      if (currentSceneId === 's6-finale-poster') {
        skyEl.setAttribute('data-sky-mood', 'finale');
      } else if (currentSceneId === 'landing-main') {
        skyEl.setAttribute('data-sky-mood', 'landing');
      } else {
        skyEl.setAttribute('data-sky-mood', `slide-${slideIdx + 1}`);
      }
      skyEl.setAttribute('data-scene-id', currentSceneId);
    }

    // Trigger immediate scene-entry burst tailored to the active subscene, then start the 4–7s recurring loop!
    triggerSceneBurst(profile.entryBurstLevel);
  }

  function notifyTransitionStart(holdSeconds = 0.25) {
    transitionHoldTimer = holdSeconds;
  }

  function setReducedMotion(reduced) {
    isReducedMotion = reduced;
    performanceTier = reduced ? 'Reduced Motion' : isLowEnd ? 'Balanced' : 'High';
    if (reduced && grandCtx) {
      grandCtx.clearRect(0, 0, width, height);
    }
  }

  function setLiteMode(lite) {
    performanceTier = lite ? 'Lite' : isLowEnd ? 'Balanced' : 'High';
  }

  function toggleSafeZonesDebug() {
    showSafeZonesDebug = !showSafeZonesDebug;
    return showSafeZonesDebug;
  }

  function toggleGrandOverlay() {
    grandOverlayEnabled = !grandOverlayEnabled;
    if (!grandOverlayEnabled && grandCtx) {
      grandCtx.clearRect(0, 0, width, height);
    }
    return grandOverlayEnabled;
  }

  function getVfxStats() {
    const profile = getActiveProfile();
    return {
      fps: currentFps,
      sceneId: currentSceneId,
      moodKey: profile.moodKey,
      performanceTier,
      orchestratorState: currentBurstLevel === 'RESTING' ? 'resting' : 'grand',
      currentBurstLevel,
      lastBurstDescription,
      nextBurstInSec: Number(Math.max(0, nextBurstInterval - timeSinceLastBurstStart).toFixed(2)),
      nextBurstInterval: Number(nextBurstInterval.toFixed(2)),
      totalBurstsTriggered,
      burstHistory: [...burstHistory],
      starsTotal: farStars.length + midStars.length + nearBokeh.length,
      bloomCount: currentBurstLevel !== 'RESTING' ? bloomFlowers.length : 0,
      waveCount: currentBurstLevel !== 'RESTING' ? waveParticles.length : 0,
      floralStormCount: currentBurstLevel !== 'RESTING' ? floralStormPetals.length : 0,
      grandBirdCount: currentBurstLevel !== 'RESTING' ? grandFlockBirds.length : 0,
      ambientBirdCount: ambientBirds.length,
      ambientPetalCount: ambientPetals.length,
      showSafeZonesDebug,
      grandOverlayEnabled
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
    triggerSceneBurst,
    notifyTransitionStart,
    setReducedMotion,
    setLiteMode,
    toggleSafeZonesDebug,
    toggleGrandOverlay,
    getVfxStats,
    destroy
  };
}
