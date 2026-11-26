import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test-results/v10-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// V10 Exact 13 States (12 Next Clicks from Landing to Final Poster Finale — Each with its own sceneId!)
const EXPECTED_SEQUENCE = [
  { slideIndex: -1, stepIndex: 0, sceneId: 'landing-main', label: 'MỞ ĐẦU 20/11', shot: 'v10-01-landing.png', nextTransTheme: 'floral-light-gateway' },
  { slideIndex: 0, stepIndex: 0, sceneId: 's1-main', label: '01 / 06', shot: 'v10-02-slide1.png', nextTransTheme: 'the-first-light' },
  { slideIndex: 1, stepIndex: 0, sceneId: 's2-main', label: '02 / 06', shot: 'v10-03-slide2.png', nextTransTheme: 'book-of-knowledge' },
  { slideIndex: 2, stepIndex: 0, sceneId: 's3-step-1', label: '03 / 06 · CẢNH 01 / 04', shot: 'v10-04-slide3-scene1.png' },
  { slideIndex: 2, stepIndex: 1, sceneId: 's3-step-2', label: '03 / 06 · CẢNH 02 / 04', shot: 'v10-05-slide3-scene2.png' },
  { slideIndex: 2, stepIndex: 2, sceneId: 's3-step-3', label: '03 / 06 · CẢNH 03 / 04', shot: 'v10-06-slide3-scene3.png' },
  { slideIndex: 2, stepIndex: 3, sceneId: 's3-step-4', label: '03 / 06 · CẢNH 04 / 04', shot: 'v10-07-slide3-scene4.png', nextTransTheme: 'stairway-to-tomorrow' },
  { slideIndex: 3, stepIndex: 0, sceneId: 's4-main', label: '04 / 06', shot: 'v10-08-slide4.png', nextTransTheme: 'memories-in-motion' },
  { slideIndex: 4, stepIndex: 0, sceneId: 's5-stage-1', label: '05 / 06 · CHẶNG 01 / 03', shot: 'v10-09-slide5-stage1.png' },
  { slideIndex: 4, stepIndex: 1, sceneId: 's5-stage-2', label: '05 / 06 · CHẶNG 02 / 03', shot: 'v10-10-slide5-stage2.png' },
  { slideIndex: 4, stepIndex: 2, sceneId: 's5-stage-3', label: '05 / 06 · CHẶNG 03 / 03', shot: 'v10-11-slide5-stage3.png', nextTransTheme: 'bouquet-of-gratitude' },
  { slideIndex: 5, stepIndex: 0, sceneId: 's6-tribute', label: '06 / 06 · CẢNH 01 / 02', shot: 'v10-12-slide6-tribute.png', nextTransTheme: 'grand-tribute-reveal' },
  { slideIndex: 5, stepIndex: 1, sceneId: 's6-finale-poster', label: '06 / 06 · CẢNH 02 / 02', shot: 'v10-13-slide6-finale.png' }
];

test.describe('NÉT VẼ TRI ÂN V10 — CINEMATIC FLORAL UNIVERSE & 4–7s RECURRING VFX ENGINE QA', () => {
  test('Test 1 & Test 5: Exact 12-Click Walk Across All 13 Subscenes (sceneId), Floral Bloom & Photo Verification', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.waitForTimeout(450);

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
        sceneIdAttr: sky?.getAttribute('data-scene-id'),
        stats,
        removedWires
      };
    });
    expect(skyCheck.exists).toBe(true);
    expect(skyCheck.grandZIndex).toBe(265);
    expect(skyCheck.sceneIdAttr).toBe('landing-main');
    expect(skyCheck.stats.sceneId).toBe('landing-main');
    expect(skyCheck.stats.bloomCount).toBeGreaterThanOrEqual(8);
    expect(skyCheck.stats.nextBurstInterval).toBeGreaterThanOrEqual(4.0);
    expect(skyCheck.stats.nextBurstInterval).toBeLessThanOrEqual(7.0);
    expect(skyCheck.removedWires).toBe(true);

    let clickCount = 0;

    for (let i = 0; i < EXPECTED_SEQUENCE.length; i++) {
      const expected = EXPECTED_SEQUENCE[i];

      await page.waitForFunction(
        ({ sIdx, stIdx, seqIdx }) =>
          window.PresentationState &&
          window.PresentationState.slideIndex === sIdx &&
          window.PresentationState.stepIndex === stIdx &&
          window.PresentationState.currentSequenceIndex === seqIdx,
        { sIdx: expected.slideIndex, stIdx: expected.stepIndex, seqIdx: i },
        { timeout: 5000 }
      );

      await expect(page.locator('#hud-indicator')).toHaveText(expected.label);

      // Verify subscene-aware SceneMoodManager updated to exact sceneId
      const currentSceneId = await page.evaluate(() => window.VFXShowcase.getStats().sceneId);
      expect(currentSceneId).toBe(expected.sceneId);

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
          await page.waitForTimeout(180);
          const activeTheme = await page.locator('#scene-transition-overlay').getAttribute('data-transition-theme');
          expect(activeTheme).toBe(expected.nextTransTheme);
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
        window.PresentationState.slideIndex === 5 &&
        window.PresentationState.stepIndex === 1
    );

    let reverseCount = 0;
    for (let i = EXPECTED_SEQUENCE.length - 1; i >= 0; i--) {
      const expected = EXPECTED_SEQUENCE[i];
      await page.waitForFunction(
        ({ sIdx, stIdx }) =>
          window.PresentationState &&
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

  test('Test 3: 4–7s RecurringCinematicVFX Cycle & V10 VFX Debug Studio (10 Preview Modes + Floral Bloom Verification)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('?vfx=1');
    await page.waitForSelector('#vfx-showcase-panel', { state: 'visible' });

    // 1. Verify automatic 4–7s recurring burst triggers on a stationary scene without user clicks!
    const initialStats = await page.evaluate(() => window.VFXShowcase.getStats());
    expect(initialStats.nextBurstInterval).toBeGreaterThanOrEqual(4.0);
    expect(initialStats.nextBurstInterval).toBeLessThanOrEqual(7.0);

    // Wait 5.5s to witness the automatic recurring burst fire on the same scene
    await page.waitForTimeout(5500);
    const afterWaitStats = await page.evaluate(() => window.VFXShowcase.getStats());
    expect(afterWaitStats.totalBurstsTriggered).toBeGreaterThan(initialStats.totalBurstsTriggered);

    // 2. Test Floral Bloom preview button & verify blooming flowers are drawn on #grand-vfx-canvas
    await page.click('#btn-vfx-floral-bloom');
    await page.waitForTimeout(550);
    const bloomStats = await page.evaluate(() => window.VFXShowcase.getStats());
    expect(bloomStats.bloomCount).toBeGreaterThanOrEqual(10);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v10-debug-floral-bloom.png') });

    // 3. Test Soft, Medium & Grand Burst preview buttons
    await page.click('#btn-vfx-soft-burst');
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.VFXShowcase.getStats().currentBurstLevel)).toBe('SOFT');

    await page.click('#btn-vfx-medium-burst');
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.VFXShowcase.getStats().currentBurstLevel)).toBe('MEDIUM');

    await page.click('#btn-vfx-grand-burst');
    await page.waitForTimeout(450);
    expect(await page.evaluate(() => window.VFXShowcase.getStats().currentBurstLevel)).toBe('GRAND');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v10-debug-grand-burst.png') });

    // 4. Test Safe Zones toggle & Close Debug Studio
    await page.click('#btn-vfx-toggle-safezone');
    expect(await page.evaluate(() => window.VFXShowcase.getStats().showSafeZonesDebug)).toBe(true);
    await page.click('#btn-vfx-toggle-safezone');
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
    await page.waitForTimeout(600);
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
