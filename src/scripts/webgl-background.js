import * as THREE from 'three';

export function createWebGLBackground(canvasElement) {
  let renderer, scene, camera;
  let particles, particlePositions, particleVelocities;
  let lightRaysMesh, lightRaysMaterial;
  let constellationLines;
  let skyBirdsGroup = null;
  const skyBirdMeshes = [];

  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  // V6 Living Sky Optimization: 175 shimmering particles + 3D distant horizon birds at locked 60fps
  const pointCount = isLowEnd ? 95 : 175;

  let mouseX = 0, mouseY = 0;
  let targetCameraX = 0, currentCameraX = 0;
  let targetCameraY = 0, currentCameraY = 0;
  let targetCameraZ = 115, currentCameraZ = 115;
  let targetRayIntensity = 0.62, currentRayIntensity = 0.62;
  let targetDawnGlow = 0.55, currentDawnGlow = 0.55;
  let currentMoodIndex = 0;
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let isTabHidden = false;
  let animFrameId = null;
  const clock = new THREE.Clock();

  // Slide Camera, Dawn Cloud & Horizon Sky Moods matching the emotional arc:
  // 0: Landing/Slide 01 | 1: Slide 02 (Người thầy) | 2: Slide 03 (Con thuyền & Chân trời)
  // 3: Slide 04 (Sinh viên 5 tốt) | 4: Slide 05 (Hành trình thực tế) | 5: Slide 06 (Tri ân) | 6: Finale Poster
  const moods = [
    { key: 'slide-1', camX: 0,   camY: 0,   camZ: 112, speed: 0.0009, rayIntensity: 0.66, dawnGlow: 0.58, rayAngle: 0.25 },
    { key: 'slide-2', camX: -22, camY: 10,  camZ: 98,  speed: 0.0006, rayIntensity: 0.78, dawnGlow: 0.72, rayAngle: 0.45 },
    { key: 'slide-3', camX: 18,  camY: 16,  camZ: 92,  speed: 0.0014, rayIntensity: 0.88, dawnGlow: 0.85, rayAngle: -0.2 },
    { key: 'slide-4', camX: 8,   camY: 24,  camZ: 96,  speed: 0.0011, rayIntensity: 0.74, dawnGlow: 0.76, rayAngle: 0.1  },
    { key: 'slide-5', camX: -12, camY: -8,  camZ: 118, speed: 0.0007, rayIntensity: 0.48, dawnGlow: 0.45, rayAngle: 0.3  },
    { key: 'slide-6', camX: 0,   camY: 6,   camZ: 102, speed: 0.0007, rayIntensity: 0.82, dawnGlow: 0.82, rayAngle: 0.0  },
    { key: 'finale',  camX: 0,   camY: 12,  camZ: 96,  speed: 0.0008, rayIntensity: 0.92, dawnGlow: 0.95, rayAngle: -0.12 }
  ];

  function createBirdChevronGeometry() {
    const geom = new THREE.BufferGeometry();
    // Stylized V-wing bird geometry (left wing tip, center body, right wing tip)
    const vertices = new Float32Array([
      -2.2,  0.5,  0.0,
      -0.6,  0.15, 0.2,
       0.0, -0.2,  0.0,

       0.0, -0.2,  0.0,
      -0.6,  0.15, 0.2,
       0.0,  0.25, 0.35,

       0.0, -0.2,  0.0,
       0.0,  0.25, 0.35,
       0.6,  0.15, 0.2,

       0.0, -0.2,  0.0,
       0.6,  0.15, 0.2,
       2.2,  0.5,  0.0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geom;
  }

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x091526, 0.0038);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 900);
    camera.position.set(0, 0, 112);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(1);
    } catch (e) {
      console.warn('WebGL fallback to CSS atmosphere:', e);
      return;
    }

    // 1. Volumetric Golden Light Shafts + Soft Dawn Cloud Bands Shader Plane
    const rayGeo = new THREE.PlaneGeometry(390, 250, 1, 1);
    lightRaysMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.66 },
        uDawnGlow: { value: 0.58 },
        uAngle: { value: 0.25 },
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

          // Ultra-fast GPU/SwiftShader volumetric light beams + dawn horizon glow (no heavy exp/pow per pixel)
          float d1 = (rotX - 0.12 + sin(uTime * 0.24) * 0.04) * 3.2;
          float beam1 = max(0.0, 1.0 - d1 * d1);
          float d2 = (rotX + 0.22) * 4.2;
          float beam2 = max(0.0, 1.0 - d2 * d2) * 0.65;

          float dawnBand = smoothstep(0.55, 0.92, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y)) * uDawnGlow * 0.45;
          float verticalFade = smoothstep(0.0, 0.85, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
          float radialVignette = max(0.0, 1.0 - dot(uv, uv) * 2.2);

          float alpha = ((beam1 + beam2) * verticalFade * radialVignette * 0.16 * uIntensity) + dawnBand * 0.14;
          vec3 col = mix(uColorNavy, mix(uColorGold, uColorIvory, 0.3), 0.8);
          gl_FragColor = vec4(col, alpha);
        }
      `
    });
    lightRaysMesh = new THREE.Mesh(rayGeo, lightRaysMaterial);
    lightRaysMesh.position.set(0, 0, -45);
    scene.add(lightRaysMesh);

    // 2. Champagne Gold, Warm Ivory & 20/11 Blush Rose Shimmering Particles
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(pointCount * 3);
    const particleColors = new Float32Array(pointCount * 3);
    particleVelocities = new Float32Array(pointCount * 3);

    const champagneGold = new THREE.Color('#F0CC85');
    const warmIvory = new THREE.Color('#F8F1E3');
    const blushRose = new THREE.Color('#F4B8C4');
    const academicBlue = new THREE.Color('#4B7BEC');

    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      particlePositions[i3]     = (Math.random() - 0.5) * 320;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 190;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 210;

      particleVelocities[i3]     = (Math.random() - 0.42) * 0.032; // Gentle breeze drift toward right horizon
      particleVelocities[i3 + 1] = (Math.random() * 0.026) + 0.007; // Gentle upward ascent
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.024;

      const r = Math.random();
      let col;
      if (r < 0.54) col = champagneGold;
      else if (r < 0.80) col = warmIvory;
      else if (r < 0.92) col = blushRose;
      else col = academicBlue;

      particleColors[i3]     = col.r;
      particleColors[i3 + 1] = col.g;
      particleColors[i3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 250, 235, 1)');
    grad.addColorStop(0.28, 'rgba(240, 204, 133, 0.78)');
    grad.addColorStop(0.7, 'rgba(240, 204, 133, 0.16)');
    grad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(particleCanvas);

    const material = new THREE.PointsMaterial({
      size: 3.0,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Distant 3D Sky Bird Flock (Upper Sky Horizon Only: y = +44..+68 so they never touch central content)
    skyBirdsGroup = new THREE.Group();
    const birdGeom = createBirdChevronGeometry();
    const birdCount = isLowEnd ? 5 : 8;
    for (let i = 0; i < birdCount; i++) {
      const isFar = i % 2 === 0;
      const birdMat = new THREE.MeshBasicMaterial({
        color: isFar ? 0xF0CC85 : 0xF8F1E3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isFar ? 0.28 : 0.42,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(birdGeom, birdMat);
      const scale = isFar ? 0.65 + (i % 3) * 0.12 : 0.95 + (i % 2) * 0.18;
      mesh.scale.set(scale, scale, scale);
      const startX = -140 + i * 36 + (i % 3) * 8;
      const baseY = 46 + (i % 4) * 5.5;
      const baseZ = isFar ? -38 - (i % 3) * 6 : -22 - (i % 2) * 5;
      mesh.position.set(startX, baseY, baseZ);
      mesh.userData = {
        baseY,
        speedX: isFar ? 0.085 : 0.125,
        wingPhase: i * 1.15,
        wingSpeed: isFar ? 3.2 : 4.1,
        scaleBase: scale
      };
      skyBirdMeshes.push(mesh);
      skyBirdsGroup.add(mesh);
    }
    scene.add(skyBirdsGroup);

    // 4. Subtle Horizon / Knowledge Path Arc in 3D space
    const curvePoints = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = (t - 0.5) * 240;
      const y = -45 + Math.sin(t * Math.PI * 1.3) * 32 + t * 48;
      const z = -30 + Math.cos(t * Math.PI) * 18;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xF0CC85,
      transparent: true,
      opacity: 0.17,
      blending: THREE.AdditiveBlending
    });
    constellationLines = new THREE.Line(lineGeo, lineMat);
    scene.add(constellationLines);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    animate();
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onVisibilityChange() {
    isTabHidden = document.hidden;
  }

  function onWindowResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    if (isTabHidden || !renderer) return;

    const elapsed = clock.getElapsedTime();
    const mood = moods[currentMoodIndex] || moods[0];

    targetCameraX = mood.camX + (isReducedMotion ? 0 : mouseX * 8.5);
    targetCameraY = mood.camY + (isReducedMotion ? 0 : -mouseY * 6.5);
    targetCameraZ = mood.camZ;
    targetRayIntensity = mood.rayIntensity;
    targetDawnGlow = mood.dawnGlow;

    const lerp = isReducedMotion ? 0.12 : 0.035;
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
      particles.rotation.y += mood.speed * 0.6;
      particles.material.opacity = 0.74 + Math.sin(elapsed * 1.4) * 0.08;
    }

    // Animate 3D Upper-Horizon Bird Flock
    if (skyBirdMeshes.length > 0 && !isReducedMotion) {
      for (let i = 0; i < skyBirdMeshes.length; i++) {
        const b = skyBirdMeshes[i];
        const ud = b.userData;
        b.position.x += ud.speedX;
        if (b.position.x > 165) b.position.x = -165;
        b.position.y = ud.baseY + Math.sin(elapsed * 1.2 + ud.wingPhase) * 2.2;
        // Subtle wing-beat scale modulation on Y
        const flap = 0.65 + Math.sin(elapsed * ud.wingSpeed + ud.wingPhase) * 0.35;
        b.scale.y = ud.scaleBase * flap;
      }
    }

    renderer.render(scene, camera);
  }

  function setSlideMood(index, isFinale = false) {
    if (isFinale) {
      currentMoodIndex = 6;
    } else {
      currentMoodIndex = Math.max(0, Math.min(index, 5));
    }
    const skyEl = document.getElementById('living-sky-layer');
    if (skyEl) {
      if (isFinale) {
        skyEl.setAttribute('data-sky-mood', 'finale');
      } else {
        skyEl.setAttribute('data-sky-mood', `slide-${currentMoodIndex + 1}`);
      }
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
    setReducedMotion,
    destroy
  };
}
