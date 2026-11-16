import * as THREE from 'three';

export function createWebGLBackground(canvasElement) {
  let renderer, scene, camera;
  let particles, particlePositions, particleVelocities;
  let lightRaysMesh, lightRaysMaterial;
  let constellationLines;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  // V5 Optimization: Subtle, tasteful ambient particle count (reduced from 1800 to 160 for cleaner visuals & 60fps performance)
  const pointCount = isLowEnd ? 80 : 160;

  let mouseX = 0, mouseY = 0;
  let targetCameraX = 0, currentCameraX = 0;
  let targetCameraY = 0, currentCameraY = 0;
  let targetCameraZ = 115, currentCameraZ = 115;
  let targetRayIntensity = 0.55, currentRayIntensity = 0.55;
  let currentMoodIndex = 0;
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let isTabHidden = false;
  let animFrameId = null;
  const clock = new THREE.Clock();

  // 6 Slide Camera & Lighting Moods matching emotional arc:
  // Khởi nguồn -> Biết ơn -> Khát vọng -> Trưởng thành -> Minh chứng -> Tiếp nối
  const moods = [
    { camX: 0,   camY: 0,   camZ: 112, speed: 0.0009, rayIntensity: 0.62, rayAngle: 0.25 }, // 01: Khởi nguồn
    { camX: -22, camY: 10,  camZ: 98,  speed: 0.0006, rayIntensity: 0.75, rayAngle: 0.45 }, // 02: Người thầy (ấm áp, hồi tưởng)
    { camX: 18,  camY: 16,  camZ: 92,  speed: 0.0014, rayIntensity: 0.85, rayAngle: -0.2 }, // 03: Trang sách đến chân trời (mãn nhãn)
    { camX: 8,   camY: 24,  camZ: 96,  speed: 0.0011, rayIntensity: 0.70, rayAngle: 0.1  }, // 04: Sinh viên 5 tốt (vươn cao)
    { camX: -12, camY: -8,  camZ: 118, speed: 0.0007, rayIntensity: 0.45, rayAngle: 0.3  }, // 05: Hành trình thực tế (tinh tế)
    { camX: 0,   camY: 6,   camZ: 102, speed: 0.0006, rayIntensity: 0.78, rayAngle: 0.0  }  // 06: Tri ân & Tiếp nối (lắng đọng)
  ];

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x091526, 0.0042);

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

    // 1. Volumetric-like Golden Light Shafts Shader Plane
    const rayGeo = new THREE.PlaneGeometry(380, 240, 1, 1);
    lightRaysMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.62 },
        uAngle: { value: 0.25 },
        uColorGold: { value: new THREE.Color('#F0CC85') },
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
        uniform float uAngle;
        uniform vec3 uColorGold;
        uniform vec3 uColorNavy;

        void main() {
          vec2 uv = vUv - 0.5;
          float c = cos(uAngle);
          float s = sin(uAngle);
          vec2 rotUv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);

          // Soft volumetric light beams
          float beam1 = exp(-pow((rotUv.x - 0.12 + sin(uTime * 0.25) * 0.05) * 3.8, 2.0));
          float beam2 = exp(-pow((rotUv.x + 0.22 - cos(uTime * 0.18) * 0.04) * 5.2, 2.0)) * 0.65;
          float verticalFade = smoothstep(-0.5, 0.45, vUv.y) * (1.0 - smoothstep(0.65, 1.0, vUv.y));
          float radialVignette = 1.0 - smoothstep(0.15, 0.72, length(uv));

          float alpha = (beam1 + beam2) * verticalFade * radialVignette * 0.16 * uIntensity;
          vec3 col = mix(uColorNavy, uColorGold, 0.78);
          gl_FragColor = vec4(col, alpha);
        }
      `
    });
    lightRaysMesh = new THREE.Mesh(rayGeo, lightRaysMaterial);
    lightRaysMesh.position.set(0, 0, -45);
    scene.add(lightRaysMesh);

    // 2. Champagne Gold & Warm Ivory Knowledge Particles
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(pointCount * 3);
    const particleColors = new Float32Array(pointCount * 3);
    particleVelocities = new Float32Array(pointCount * 3);

    const champagneGold = new THREE.Color('#F0CC85');
    const warmIvory = new THREE.Color('#F8F1E3');
    const academicBlue = new THREE.Color('#4B7BEC');
    const dntuCrimson = new THREE.Color('#D93843');

    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      particlePositions[i3]     = (Math.random() - 0.5) * 320;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 190;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 210;

      particleVelocities[i3]     = (Math.random() - 0.5) * 0.028;
      particleVelocities[i3 + 1] = (Math.random() * 0.025) + 0.006; // Gentle upward ascent
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.025;

      const r = Math.random();
      let col;
      if (r < 0.55) col = champagneGold;
      else if (r < 0.82) col = warmIvory;
      else if (r < 0.95) col = academicBlue;
      else col = dntuCrimson;

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
    grad.addColorStop(0.28, 'rgba(240, 204, 133, 0.75)');
    grad.addColorStop(0.7, 'rgba(240, 204, 133, 0.15)');
    grad.addColorStop(1, 'rgba(240, 204, 133, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(particleCanvas);

    const material = new THREE.PointsMaterial({
      size: 2.9,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Subtle Horizon / Knowledge Path Arc in 3D space
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
      opacity: 0.16,
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

    targetCameraX = mood.camX + (isReducedMotion ? 0 : mouseX * 9);
    targetCameraY = mood.camY + (isReducedMotion ? 0 : -mouseY * 7);
    targetCameraZ = mood.camZ;
    targetRayIntensity = mood.rayIntensity;

    const lerp = isReducedMotion ? 0.12 : 0.035;
    currentCameraX += (targetCameraX - currentCameraX) * lerp;
    currentCameraY += (targetCameraY - currentCameraY) * lerp;
    currentCameraZ += (targetCameraZ - currentCameraZ) * lerp;
    currentRayIntensity += (targetRayIntensity - currentRayIntensity) * lerp;

    camera.position.set(currentCameraX, currentCameraY, currentCameraZ);
    camera.lookAt(0, 0, 0);

    if (lightRaysMaterial) {
      lightRaysMaterial.uniforms.uTime.value = isReducedMotion ? 0 : elapsed;
      lightRaysMaterial.uniforms.uIntensity.value = currentRayIntensity;
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
      particles.rotation.y += mood.speed * 0.65;
    }

    renderer.render(scene, camera);
  }

  function setSlideMood(index) {
    currentMoodIndex = Math.max(0, Math.min(index, moods.length - 1));
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
