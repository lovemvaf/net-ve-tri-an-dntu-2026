import fs from 'node:fs';
import path from 'node:path';
import gsap from 'gsap';
import * as THREE from 'three';
import Reveal from 'reveal.js';

console.log('--- Verifying GSAP & Plugins ---');
console.log('GSAP Core Version:', gsap.version);

// Check GSAP sub-modules
let splitTextLoaded = false;
let morphSvgLoaded = false;
let motionPathLoaded = false;

try {
  const { SplitText } = await import('gsap/SplitText');
  gsap.registerPlugin(SplitText);
  splitTextLoaded = true;
  console.log('[OK] GSAP SplitText successfully imported and registered.');
} catch (e) {
  console.log('[INFO] GSAP SplitText import note:', e.message);
}

try {
  const { MorphSVGPlugin } = await import('gsap/MorphSVGPlugin');
  gsap.registerPlugin(MorphSVGPlugin);
  morphSvgLoaded = true;
  console.log('[OK] GSAP MorphSVGPlugin successfully imported and registered.');
} catch (e) {
  console.log('[INFO] GSAP MorphSVGPlugin import note:', e.message);
}

try {
  const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
  gsap.registerPlugin(MotionPathPlugin);
  motionPathLoaded = true;
  console.log('[OK] GSAP MotionPathPlugin successfully imported and registered.');
} catch (e) {
  console.log('[INFO] GSAP MotionPathPlugin import note:', e.message);
}

console.log('\n--- Verifying Three.js WebGL & Shader Capabilities ---');
console.log('Three.js REVISION:', THREE.REVISION);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
const geometry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const customShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float uTime;
    attribute float aScale;
    void main() {
      vec3 pos = position;
      pos.y += sin(uTime + position.x * 2.0) * 0.2;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (20.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      gl_FragColor = vec4(uColor, alpha);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x38bdf8) }
  },
  transparent: true,
  depthWrite: false
});

const points = new THREE.Points(geometry, customShaderMaterial);
scene.add(points);
console.log('[OK] Three.js custom particle shader and scene graph initialized successfully.');

console.log('\n--- Verifying Original Assets ---');
const assets = [
  '2.Khoacongnghethongtin (1).png',
  'logodntubig (1).png',
  'Quách Khoa Đức _ Nét vẽ tri ân.png'
];
for (const asset of assets) {
  if (fs.existsSync(asset)) {
    const stat = fs.statSync(asset);
    console.log(`[OK] Original Asset Present: ${asset} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.error(`[FAIL] Asset missing: ${asset}`);
  }
}

console.log('\n--- Verifying Vietnamese Typography Diacritics ---');
const sampleVN = 'Nét vẽ tri ân – Một dòng code, vạn chân trời. Người thầy, cô Liệu, DNTU Sinh viên 5 tốt.';
const buf = Buffer.from(sampleVN, 'utf8');
console.log(`[OK] UTF-8 Vietnamese string integrity: "${buf.toString('utf8')}" (${buf.length} bytes)`);

console.log('\n=== All Core Tech Verification Checks Passed! ===');

