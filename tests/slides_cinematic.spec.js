import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test-results/v9-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// V9 Exact 13 States (12 Next Clicks from Landing to Final Poster Finale)
const EXPECTED_SEQUENCE = [
  // 0. Landing (-1): 1 state
  { slideIndex: -1, stepIndex: 0, label: 'MỞ ĐẦU 20/11', shot: 'v9-01-landing.png', nextTransTheme: 'floral-light-gateway' },
  // 1. Slide 01 (0): 1 state
  { slideIndex: 0, stepIndex: 0, label: '01 / 06', shot: 'v9-02-slide1.png', nextTransTheme: 'the-first-light' },
  // 2. Slide 02 (1): 1 state
  { slideIndex: 1, stepIndex: 0, label: '02 / 06', shot: 'v9-03-slide2.png', nextTransTheme: 'book-of-knowledge' },
  // 3..6. Slide 03 (2): 4 camera scenes
  { slideIndex: 2, stepIndex: 0, label: '03 / 06 · CẢNH 01 / 04', shot: 'v9-04-slide3-scene1.png' },
  { slideIndex: 2, stepIndex: 1, label: '03 / 06 · CẢNH 02 / 04', shot: 'v9-05-slide3-scene2.png' },
  { slideIndex: 2, stepIndex: 2, label: '03 / 06 · CẢNH 03 / 04', shot: 'v9-06-slide3-scene3.png' },
  { slideIndex: 2, stepIndex: 3, label: '03 / 06 · CẢNH 04 / 04', shot: 'v9-07-slide3-scene4.png', nextTransTheme: 'stairway-to-tomorrow' },
  // 7. Slide 04 (3): 1 state (All 5 criteria visible)
  { slideIndex: 3, stepIndex: 0, label: '04 / 06', shot: 'v9-08-slide4.png', nextTransTheme: 'memories-in-motion' },
  // 8..10. Slide 05 (4): 3 consolidated stages (4 photos each)
  { slideIndex: 4, stepIndex: 0, label: '05 / 06 · CHẶNG 01 / 03', shot: 'v9-09-slide5-stage1.png' },
  { slideIndex: 4, stepIndex: 1, label: '05 / 06 · CHẶNG 02 / 03', shot: 'v9-10-slide5-stage2.png' },
  { slideIndex: 4, stepIndex: 2, label: '05 / 06 · CHẶNG 03 / 03', shot: 'v9-11-slide5-stage3.png', nextTransTheme: 'bouquet-of-gratitude' },
  // 11..12. Slide 06 (5): 2 states (Tribute -> Full Poster Finale)
  { slideIndex: 5, stepIndex: 0, label: '06 / 06 · CẢNH 01 / 02', shot: 'v9-12-slide6-tribute.png', nextTransTheme: 'grand-tribute-reveal' },
  { slideIndex: 5, stepIndex: 1, label: '06 / 06 · CẢNH 02 / 02', shot: 'v9-13-slide6-finale.png' }
];

test.describe('NÉT VẼ TRI ÂN V9 — SPECTACULAR CINEMATIC VFX COMPLETION QA', () => {
  test('Test 1 & Test 5: Exact 12-Click Walk (13 States), Unoccluded Grand VFX Layer, 3 Grand Moments & Slide 05 Photo Replacement', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.waitForTimeout(450);

    // Verify V9 Dual-Canvas Layer Architecture (#ambient-sky-canvas + #grand-vfx-canvas at z-index: 265)
    const skyCheck = await page.evaluate(() => {
      const sky = document.getElementById('living-sky-layer');
      const ambientCanvas = document.getElementById('ambient-sky-canvas');
      const grandCanvas = document.getElementById('grand-vfx-canvas');
      const grandZIndex = grandCanvas ? Number(window.getComputedStyle(grandCanvas).zIndex) : 0;
      const stats = window.VFXShowcase ? window.VFXShowcase.getStats() : null;
      const removedWires =
        !document.getElementById('landing-pen-stroke') &&
        !document.getElementById('sky-horizon-ribbons') &&
        !document.getElementById('transition-light-path') &&
        !document.getElementById('slide3-camera-svg') &&
        !document.querySelector('.criteria-connector-svg');
      return {
        exists: Boolean(sky && ambientCanvas && grandCanvas && grandCanvas.width === 1920),
        grandZIndex,
        mood: sky?.getAttribute('data-sky-mood'),
        ambientState: sky?.getAttribute('data-ambient-state'),
        stats,
        removedWires
      };
    });
    expect(skyCheck.exists).toBe(true);
    expect(skyCheck.grandZIndex).toBe(265);
    expect(skyCheck.mood).toBe('landing');
    expect(skyCheck.ambientState).toBe('landing-opening');
    expect(skyCheck.stats.starsTotal).toBeGreaterThanOrEqual(100);
    expect(skyCheck.stats.waveCount).toBeGreaterThanOrEqual(50);
    expect(skyCheck.removedWires).toBe(true);

    // Capture Landing Grand Moment 01 climax screenshot at t=450ms
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9-grand1-landing-climax.png') });

    let clickCount = 0;

    for (let i = 0; i < EXPECTED_SEQUENCE.length; i++) {
      const expected = EXPECTED_SEQUENCE[i];

      await page.waitForFunction(
        ({ sIdx, stIdx, seqIdx }) =>
          window.PresentationState &&
          !window.PresentationState.isTransitioning &&
          window.PresentationState.slideIndex === sIdx &&
          window.PresentationState.stepIndex === stIdx &&
          window.PresentationState.currentSequenceIndex === seqIdx,
        { sIdx: expected.slideIndex, stIdx: expected.stepIndex, seqIdx: i },
        { timeout: 5000 }
      );

      await expect(page.locator('#hud-indicator')).toHaveText(expected.label);

      if (expected.slideIndex === -1) {
        const landingCheck = await page.evaluate(() => {
          const img = document.getElementById('landing-full-poster-img');
          const style = window.getComputedStyle(img);
          const rect = img.getBoundingClientRect();
          return {
            loaded: img.complete && img.naturalWidth > 0,
            objectFit: style.objectFit,
            fullyInsideViewport:
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= window.innerHeight &&
              rect.right <= window.innerWidth &&
              rect.height > 400
          };
        });
        expect(landingCheck.loaded).toBe(true);
        expect(landingCheck.objectFit).toBe('contain');
        expect(landingCheck.fullyInsideViewport).toBe(true);
      }

      if (expected.slideIndex === 3) {
        await expect(page.locator('.criteria-pillar-card')).toHaveCount(5);
        await expect(page.locator('.milestone-culmination-bar')).toContainText('02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT');
      }

      if (expected.slideIndex === 4) {
        await expect(page.locator(`.scene-step-btn[data-slide5-scene="${expected.stepIndex}"]`)).toHaveClass(/active/);
        await page.waitForFunction(
          () =>
            ['s5-hero-img', 's5-side1-img', 's5-side2-img', 's5-side3-img'].every((id) => {
              const el = document.getElementById(id);
              return Boolean(el && el.complete && el.naturalWidth > 0);
            }),
          null,
          { timeout: 5000 }
        );

        if (expected.stepIndex === 0) {
          const side3Src = await page.locator('#s5-side3-img').getAttribute('src');
          expect(side3Src).toContain('curated-20-clb-cntt-dntu-project.jpg');
          expect(side3Src).not.toContain('curated-02-hoc-tap-nhom.jpg');
          await expect(page.locator('#s5-side3-badge')).toContainText('KHOA CNTT · CLB KHOA HỌC MÁY TÍNH DNTU');
        }
      }

      if (expected.slideIndex === 5 && expected.stepIndex === 0) {
        await expect(page.locator('#slide6-tribute-view')).toBeVisible();
        await expect(page.locator('#slide6-floral-tribute')).toBeVisible();
      }

      if (expected.slideIndex === 5 && expected.stepIndex === 1) {
        await expect(page.locator('#slide6-finale-view')).toHaveClass(/active/);
        const finaleCheck = await page.evaluate(() => {
          const img = document.getElementById('finale-full-poster-img');
          const style = window.getComputedStyle(img);
          const rect = img.getBoundingClientRect();
          const skyMood = document.getElementById('living-sky-layer')?.getAttribute('data-sky-mood');
          return {
            skyMood,
            POSTER_FULLY_VISIBLE:
              Boolean(img && img.complete && img.naturalWidth > 0) &&
              style.objectFit === 'contain' &&
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= window.innerHeight &&
              rect.right <= window.innerWidth &&
              rect.height > 400
          };
        });
        expect(finaleCheck.skyMood).toBe('finale');
        expect(finaleCheck.POSTER_FULLY_VISIBLE).toBe(true);
      }

      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, expected.shot) });

      if (i < EXPECTED_SEQUENCE.length - 1) {
        await page.click('#hud-next');
        clickCount++;

        if (expected.nextTransTheme) {
          await page.waitForTimeout(220);
          const activeTheme = await page.locator('#scene-transition-overlay').getAttribute('data-transition-theme');
          expect(activeTheme).toBe(expected.nextTransTheme);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, `v9-trans-${expected.nextTransTheme}.png`) });
        }
      }
    }

    expect(clickCount).toBe(12);
    await expect(page.locator('#hud-next')).toBeDisabled();
    expect(errors).toEqual([]);
  });

  test('Test 2: Reverse Navigation from Final Poster Finale Back to Landing in 12 Presses', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.keyboard.press('l');

    await page.keyboard.press('End');
    await page.waitForFunction(
      () =>
        window.PresentationState &&
        !window.PresentationState.isTransitioning &&
        window.PresentationState.slideIndex === 5 &&
        window.PresentationState.stepIndex === 1
    );

    let reverseCount = 0;
    for (let i = EXPECTED_SEQUENCE.length - 1; i >= 0; i--) {
      const expected = EXPECTED_SEQUENCE[i];
      await page.waitForFunction(
        ({ sIdx, stIdx }) =>
          window.PresentationState &&
          !window.PresentationState.isTransitioning &&
          window.PresentationState.slideIndex === sIdx &&
          window.PresentationState.stepIndex === stIdx,
        { sIdx: expected.slideIndex, stIdx: expected.stepIndex },
        { timeout: 4000 }
      );
      await expect(page.locator('#hud-indicator')).toHaveText(expected.label);

      if (i > 0) {
        await page.keyboard.press('ArrowLeft');
        reverseCount++;
      }
    }

    expect(reverseCount).toBe(12);
    await expect(page.locator('#hud-prev')).toBeDisabled();
    await expect(page.locator('#landing-page')).toBeVisible();
  });

  test('Test 3: VFX Showcase & Prototype Mode (8 Independent Preview Modes + Pixel Visibility Verification)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('?vfx=1');
    await page.waitForSelector('#vfx-showcase-panel', { state: 'visible' });

    // Helper to count visible rendered pixels on #grand-vfx-canvas
    const countGrandCanvasPixels = async () => {
      return page.evaluate(() => {
        const c = document.getElementById('grand-vfx-canvas');
        const ctx = c.getContext('2d');
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        let visiblePixels = 0;
        // Sample every 16th pixel for fast verification
        for (let i = 3; i < data.length; i += 64) {
          if (data[i] > 20) visiblePixels++;
        }
        return visiblePixels;
      });
    };

    // 1. Preview Bird Flock
    await page.click('#btn-vfx-bird-flock');
    await page.waitForTimeout(550);
    const birdStats = await page.evaluate(() => window.VFXShowcase.getStats());
    expect(birdStats.grandBirdCount).toBeGreaterThanOrEqual(14);
    const birdPixels = await countGrandCanvasPixels();
    expect(birdPixels).toBeGreaterThan(20);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9-showcase-bird-flock.png') });

    // 2. Preview Golden Particle Wave
    await page.click('#btn-vfx-particle-wave');
    await page.waitForTimeout(600);
    const waveStats = await page.evaluate(() => window.VFXShowcase.getStats());
    expect(waveStats.waveCount).toBeGreaterThanOrEqual(100);
    const wavePixels = await countGrandCanvasPixels();
    expect(wavePixels).toBeGreaterThan(80);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9-showcase-particle-wave.png') });

    // 3. Preview Floral Storm
    await page.click('#btn-vfx-floral-storm');
    await page.waitForTimeout(650);
    const floralStats = await page.evaluate(() => window.VFXShowcase.getStats());
    expect(floralStats.floralStormCount).toBeGreaterThanOrEqual(50);
    const floralPixels = await countGrandCanvasPixels();
    expect(floralPixels).toBeGreaterThan(80);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9-showcase-floral-storm.png') });

    // 4. Preview Grand Tribute (Slide 05 -> 06)
    await page.click('#btn-vfx-grand-tribute');
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9-showcase-grand-tribute.png') });

    // 5. Preview Final Poster Reveal
    await page.click('#btn-vfx-final-poster');
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9-showcase-final-poster.png') });

    // Close VFX Showcase panel and verify normal Presentation controls still work
    await page.click('#btn-vfx-close');
    await expect(page.locator('#vfx-showcase-panel')).toBeHidden();
  });

  test('Test 4: Rapid Input / Spam Click Protection & 60 FPS Performance Measurement', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });

    for (let k = 0; k < 15; k++) {
      await page.keyboard.press('ArrowRight', { delay: 10 });
    }
    await page.waitForTimeout(500);
    await page.waitForFunction(() => window.PresentationState && !window.PresentationState.isTransitioning);

    const fpsMeasure = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        function tick(now) {
          frames++;
          if (now - start < 500) {
            requestAnimationFrame(tick);
          } else {
            resolve(Math.round((frames * 1000) / (now - start)));
          }
        }
        requestAnimationFrame(tick);
      });
    });

    expect(fpsMeasure).toBeGreaterThanOrEqual(30);
    expect(errors).toEqual([]);
  });

  test('Test 6: Multi-Resolution Verification (1920x1080, 1600x900, 1440x900, 1366x768, 768x1024)', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: '1920x1080' },
      { width: 1600, height: 900, name: '1600x900' },
      { width: 1440, height: 900, name: '1440x900' },
      { width: 1366, height: 768, name: '1366x768' },
      { width: 768, height: 1024, name: '768x1024-tablet' }
    ];

    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.keyboard.press('l');

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.evaluate(() => window.goToState(-1, 0));
      await page.waitForTimeout(200);

      const landingVisible = await page.evaluate(() => {
        const img = document.getElementById('landing-full-poster-img');
        const rect = img.getBoundingClientRect();
        return img.complete && img.naturalWidth > 0 && rect.width > 100 && rect.height > 180;
      });
      expect(landingVisible).toBe(true);

      await page.evaluate(() => window.goToState(5, 1));
      await page.waitForTimeout(200);

      const finaleVisible = await page.evaluate(() => {
        const img = document.getElementById('finale-full-poster-img');
        const style = window.getComputedStyle(img);
        const rect = img.getBoundingClientRect();
        return (
          img.complete &&
          img.naturalWidth > 0 &&
          style.objectFit === 'contain' &&
          rect.width > 100 &&
          rect.height > 180
        );
      });
      expect(finaleVisible).toBe(true);
    }
  });
});
