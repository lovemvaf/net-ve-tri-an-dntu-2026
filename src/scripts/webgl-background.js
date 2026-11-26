/**
 * EDITORIAL 2D CANVAS BACKDROP — NGHỊ QUYẾT 57-NQ/TW
 * Lightweight vector-inspired 2D Canvas backdrop (pure Canvas 2D, zero 3D runtime).
 * Renders Academic Navy (#10294B) -> Youth Blue (#1764B0) soft wash,
 * subtle paper grain, and 5 scene-tailored knowledge curves on a ~5.5s calm pulse.
 * Strictly behind UI (z-index: 1). Honors prefers-reduced-motion & Lite Mode.
 */

const PULSE_PERIOD_SEC = 5.5;

const COMMUNITY_NODES = [
  { x: 0.12, y: 0.22, r: 3.2 },
  { x: 0.28, y: 0.16, r: 2.6 },
  { x: 0.44, y: 0.28, r: 3.0 },
  { x: 0.18, y: 0.56, r: 2.8 },
  { x: 0.36, y: 0.68, r: 3.4 },
  { x: 0.56, y: 0.48, r: 2.5 },
  { x: 0.64, y: 0.22, r: 2.7 },
  { x: 0.22, y: 0.84, r: 3.0 },
  { x: 0.50, y: 0.82, r: 2.6 }
];

const COMMUNITY_LINKS = [
  [0, 1],
  [1, 2],
  [0, 3],
  [2, 5],
  [3, 4],
  [4, 5],
  [2, 6],
  [3, 7],
  [4, 8],
  [5, 8]
];

export function createWebGLBackground(canvasElement) {
  if (!canvasElement) {
    return {
      setScene: () => {},
      setReducedMotion: () => {},
      setLiteMode: () => {},
      destroy: () => {}
    };
  }

  const ctx = canvasElement.getContext('2d', { alpha: false });
  if (!ctx) {
    return {
      setScene: () => {},
      setReducedMotion: () => {},
      setLiteMode: () => {},
      destroy: () => {}
    };
  }

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let targetScene = 0;
  const sceneWeights = [1, 0, 0, 0, 0];

  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let isLiteMode = false;
  let isTabHidden = document.hidden;
  let rafId = null;
  let startTime = performance.now();

  // Pre-rendered subtle paper grain pattern (256x256)
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext('2d');
  if (gCtx) {
    for (let i = 0; i < 1100; i += 1) {
      const gx = (i * 73) % 256;
      const gy = (i * 137 + ((i * 19) % 41)) % 256;
      const warm = i % 3 === 0;
      gCtx.fillStyle = warm ? 'rgba(246, 244, 237, 0.028)' : 'rgba(240, 199, 109, 0.02)';
      gCtx.fillRect(gx, gy, 1.4, 1.4);
    }
  }
  const grainPattern = ctx.createPattern(grainCanvas, 'repeat');

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasElement.width = Math.max(1, Math.floor(width * dpr));
    canvasElement.height = Math.max(1, Math.floor(height * dpr));
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (isLiteMode || isReducedMotion) {
      drawFrame(0);
    }
  }

  function drawBaseWash(pulse) {
    // Deep Academic Navy -> Youth Blue soft diagonal editorial wash
    const bgGrad = ctx.createLinearGradient(0, 0, width * 0.9, height);
    bgGrad.addColorStop(0, '#0B1D36');
    bgGrad.addColorStop(0.5, '#10294B');
    bgGrad.addColorStop(1, '#143B6E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const blueWash = ctx.createRadialGradient(
      width * (0.28 + pulse * 0.015),
      height * 0.22,
      width * 0.04,
      width * 0.34,
      height * 0.32,
      Math.max(width, height) * 0.72
    );
    blueWash.addColorStop(0, `rgba(23, 100, 176, ${0.26 + pulse * 0.04})`);
    blueWash.addColorStop(0.55, 'rgba(23, 100, 176, 0.09)');
    blueWash.addColorStop(1, 'rgba(16, 41, 75, 0)');
    ctx.fillStyle = blueWash;
    ctx.fillRect(0, 0, width, height);

    if (grainPattern) {
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Scene 01: Single gentle question arc
  function drawQuestionArc(weight, pulse, phase) {
    if (weight < 0.01) return;
    ctx.save();
    ctx.globalAlpha = weight;

    const startX = width * 0.05;
    const startY = height * 0.78;
    const cp1X = width * 0.08;
    const cp1Y = height * (0.14 + pulse * 0.02);
    const cp2X = width * 0.56;
    const cp2Y = height * (0.06 - pulse * 0.015);
    const endX = width * 0.42;
    const endY = height * 0.44;

    ctx.strokeStyle = `rgba(240, 199, 109, ${0.18 + pulse * 0.05})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    ctx.stroke();

    // Soft secondary Youth Blue echo curve
    ctx.strokeStyle = 'rgba(246, 244, 237, 0.09)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX + 24, startY + 18);
    ctx.bezierCurveTo(cp1X + 30, cp1Y + 28, cp2X + 12, cp2Y + 34, endX + 12, endY + 20);
    ctx.stroke();

    // Soft glowing focal dot near the arc endpoint
    const nodeGlow = ctx.createRadialGradient(endX, endY, 2, endX, endY, 36 + pulse * 10);
    nodeGlow.addColorStop(0, `rgba(240, 199, 109, ${0.28 + Math.sin(phase) * 0.06})`);
    nodeGlow.addColorStop(1, 'rgba(240, 199, 109, 0)');
    ctx.fillStyle = nodeGlow;
    ctx.beginPath();
    ctx.arc(endX, endY, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Scene 02: Three balanced subtle harmonics
  function drawThreeHarmonics(weight, pulse, phase) {
    if (weight < 0.01) return;
    ctx.save();
    ctx.globalAlpha = weight;

    const colors = [
      `rgba(240, 199, 109, ${0.17 + pulse * 0.04})`,
      `rgba(246, 244, 237, ${0.11 + pulse * 0.03})`,
      `rgba(74, 152, 232, ${0.18 + pulse * 0.04})`
    ];

    colors.forEach((strokeColor, idx) => {
      const yBase = height * (0.28 + idx * 0.21);
      const amp = height * (0.045 + idx * 0.008);
      const offset = phase + idx * 0.95;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = idx === 0 ? 1.5 : 1.15;
      ctx.beginPath();
      for (let x = -20; x <= width * 0.78; x += 24) {
        const normX = x / Math.max(width, 1);
        const y = yBase + Math.sin(normX * Math.PI * 2.2 + offset) * amp;
        if (x === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ctx.restore();
  }

  // Scene 03: Warm gold human glow & embracing arcs
  function drawWarmHumanGlow(weight, pulse) {
    if (weight < 0.01) return;
    ctx.save();
    ctx.globalAlpha = weight;

    const cx = width * 0.36;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * (0.48 + pulse * 0.04);

    const warmGlow = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius);
    warmGlow.addColorStop(0, `rgba(240, 199, 109, ${0.16 + pulse * 0.04})`);
    warmGlow.addColorStop(0.5, 'rgba(240, 199, 109, 0.055)');
    warmGlow.addColorStop(1, 'rgba(16, 41, 75, 0)');
    ctx.fillStyle = warmGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(240, 199, 109, 0.14)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.56, Math.PI * 0.18, Math.PI * 0.92);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(246, 244, 237, 0.09)';
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.72, Math.PI * 1.12, Math.PI * 1.84);
    ctx.stroke();

    ctx.restore();
  }

  // Scene 04: Interconnected community lines & subtle nodes
  function drawCommunityNetwork(weight, pulse, phase) {
    if (weight < 0.01) return;
    ctx.save();
    ctx.globalAlpha = weight;

    const pts = COMMUNITY_NODES.map((n, idx) => ({
      x: (n.x + Math.sin(phase + idx * 1.1) * 0.008) * width,
      y: (n.y + Math.cos(phase + idx * 0.85) * 0.009) * height,
      r: n.r
    }));

    ctx.strokeStyle = `rgba(92, 166, 236, ${0.18 + pulse * 0.04})`;
    ctx.lineWidth = 1.1;
    COMMUNITY_LINKS.forEach(([a, b]) => {
      const p1 = pts[a];
      const p2 = pts[b];
      const midX = (p1.x + p2.x) * 0.5;
      const midY = (p1.y + p2.y) * 0.5 - 18;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.stroke();
    });

    pts.forEach((p, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(240, 199, 109, 0.34)' : 'rgba(246, 244, 237, 0.24)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Scene 05: Outward concentric ripple circles
  function drawOutwardRipples(weight, pulse, elapsedSec) {
    if (weight < 0.01) return;
    ctx.save();
    ctx.globalAlpha = weight;

    const cx = width * 0.36;
    const cy = height * 0.52;
    const maxR = Math.min(width, height) * 0.62;

    const cycle = (elapsedSec / PULSE_PERIOD_SEC) % 1;
    for (let i = 0; i < 4; i += 1) {
      const progress = (cycle + i * 0.25) % 1;
      const r = 48 + progress * maxR;
      const alpha = (1 - progress) * (0.2 + pulse * 0.04);

      ctx.strokeStyle = i % 2 === 0 ? `rgba(240, 199, 109, ${alpha})` : `rgba(246, 244, 237, ${alpha * 0.65})`;
      ctx.lineWidth = i % 2 === 0 ? 1.4 : 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawFrame(elapsedSec) {
    const phase = (elapsedSec / PULSE_PERIOD_SEC) * Math.PI * 2;
    const pulse = (Math.sin(phase) + 1) * 0.5;

    // Smoothly blend weights toward active scene
    for (let i = 0; i < sceneWeights.length; i += 1) {
      const target = i === targetScene ? 1 : 0;
      sceneWeights[i] += (target - sceneWeights[i]) * (isLiteMode || isReducedMotion ? 1 : 0.08);
    }

    drawBaseWash(pulse);
    drawQuestionArc(sceneWeights[0], pulse, phase);
    drawThreeHarmonics(sceneWeights[1], pulse, phase);
    drawWarmHumanGlow(sceneWeights[2], pulse);
    drawCommunityNetwork(sceneWeights[3], pulse, phase);
    drawOutwardRipples(sceneWeights[4], pulse, elapsedSec);
  }

  function tick(now) {
    if (isLiteMode || isReducedMotion || isTabHidden) {
      rafId = null;
      return;
    }
    const elapsedSec = (now - startTime) * 0.001;
    drawFrame(elapsedSec);
    rafId = requestAnimationFrame(tick);
  }

  function ensureLoop() {
    if (isLiteMode || isReducedMotion || isTabHidden) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawFrame(0);
      return;
    }
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function onVisibilityChange() {
    isTabHidden = document.hidden;
    ensureLoop();
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  resize();
  ensureLoop();

  return {
    setScene(index) {
      const clamped = Math.max(0, Math.min(4, Number(index) || 0));
      targetScene = clamped;
      if (isLiteMode || isReducedMotion) {
        for (let i = 0; i < sceneWeights.length; i += 1) {
          sceneWeights[i] = i === clamped ? 1 : 0;
        }
        drawFrame(0);
      }
    },
    setReducedMotion(reduced) {
      isReducedMotion = Boolean(reduced);
      ensureLoop();
    },
    setLiteMode(lite) {
      isLiteMode = Boolean(lite);
      ensureLoop();
    },
    destroy() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }
  };
}
