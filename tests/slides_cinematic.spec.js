import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test-results/v5-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// V5 Exact 13 States (12 Next Clicks from Landing to Final Poster Finale)
const EXPECTED_SEQUENCE = [
  // 0. Landing (-1): 1 state
  { slideIndex: -1, stepIndex: 0, label: 'MỞ ĐẦU 20/11', shot: 'v5-01-landing.png' },
  // 1. Slide 01 (0): 1 state
  { slideIndex: 0, stepIndex: 0, label: '01 / 06', shot: 'v5-02-slide1.png' },
  // 2. Slide 02 (1): 1 state
  { slideIndex: 1, stepIndex: 0, label: '02 / 06', shot: 'v5-03-slide2.png' },
  // 3..6. Slide 03 (2): 4 camera scenes
  { slideIndex: 2, stepIndex: 0, label: '03 / 06 · CẢNH 01 / 04', shot: 'v5-04-slide3-scene1.png' },
  { slideIndex: 2, stepIndex: 1, label: '03 / 06 · CẢNH 02 / 04', shot: 'v5-05-slide3-scene2.png' },
  { slideIndex: 2, stepIndex: 2, label: '03 / 06 · CẢNH 03 / 04', shot: 'v5-06-slide3-scene3.png' },
  { slideIndex: 2, stepIndex: 3, label: '03 / 06 · CẢNH 04 / 04', shot: 'v5-07-slide3-scene4.png' },
  // 7. Slide 04 (3): 1 state (All 5 criteria visible)
  { slideIndex: 3, stepIndex: 0, label: '04 / 06', shot: 'v5-08-slide4.png' },
  // 8..10. Slide 05 (4): 3 consolidated stages (4 photos each)
  { slideIndex: 4, stepIndex: 0, label: '05 / 06 · CHẶNG 01 / 03', shot: 'v5-09-slide5-stage1.png' },
  { slideIndex: 4, stepIndex: 1, label: '05 / 06 · CHẶNG 02 / 03', shot: 'v5-10-slide5-stage2.png' },
  { slideIndex: 4, stepIndex: 2, label: '05 / 06 · CHẶNG 03 / 03', shot: 'v5-11-slide5-stage3.png' },
  // 11..12. Slide 06 (5): 2 states (Tribute -> Full Poster Finale)
  { slideIndex: 5, stepIndex: 0, label: '06 / 06 · CẢNH 01 / 02', shot: 'v5-12-slide6-tribute.png' },
  { slideIndex: 5, stepIndex: 1, label: '06 / 06 · CẢNH 02 / 02', shot: 'v5-13-slide6-finale.png' }
];

test.describe('NÉT VẼ TRI ÂN V5 — PREMIUM 13-STATE (12-CLICK) PRESENTATION OPTIMIZATION QA', () => {
  test('Test 1 & Test 5: Exact 12-Click Walk (13 States) from Landing to Full Poster Finale & Visual Verification', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.waitForTimeout(450);

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

      // State 0: Landing Page auto-shows full poster & all key elements immediately
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

      // State 7: Slide 04 auto-shows all 5 criteria without extra clicks
      if (expected.slideIndex === 3) {
        await expect(page.locator('.criteria-pillar-card')).toHaveCount(5);
        await expect(page.locator('.milestone-culmination-bar')).toContainText('02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT');
      }

      // States 8..10: Slide 05 3 consolidated stages with 4 real photos each
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
      }

      // State 11: Slide 06 Tribute auto-shows teacher art, real Cô Liệu photos, gratitude & 20/11 flowers
      if (expected.slideIndex === 5 && expected.stepIndex === 0) {
        await expect(page.locator('#slide6-tribute-view')).toBeVisible();
        await expect(page.locator('#slide6-floral-tribute')).toBeVisible();
      }

      // State 12: Slide 06 Finale auto-settles with Full Poster & Final Hold message
      if (expected.slideIndex === 5 && expected.stepIndex === 1) {
        await expect(page.locator('#slide6-finale-view')).toHaveClass(/active/);
        const finaleCheck = await page.evaluate(() => {
          const img = document.getElementById('finale-full-poster-img');
          const style = window.getComputedStyle(img);
          const rect = img.getBoundingClientRect();
          return {
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
        expect(finaleCheck.POSTER_FULLY_VISIBLE).toBe(true);
      }

      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, expected.shot) });

      if (i < EXPECTED_SEQUENCE.length - 1) {
        await page.click('#hud-next');
        clickCount++;
      }
    }

    // Verify exact 12 clicks from Landing to Final Poster Finale
    expect(clickCount).toBe(12);
    await expect(page.locator('#hud-next')).toBeDisabled();
    expect(errors).toEqual([]);
  });

  test('Test 2: Reverse Navigation from Final Poster Finale Back to Landing in 12 Presses', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.keyboard.press('l'); // Lite mode

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

  test('Test 3: Input Consistency (Buttons, Space, PageDown, PageUp, Tools Menu, Speaker Notes & Lightbox ESC)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.keyboard.press('l');

    // Open Tools Popover & Speaker Notes
    await page.click('#hud-tools-toggle');
    await expect(page.locator('#hud-tools-popover')).toHaveClass(/active/);
    await page.click('#hud-notes');
    await expect(page.locator('#notes-drawer')).toHaveClass(/active/);

    // 1. Space advances from Landing -> Slide 01
    await page.keyboard.press('Space');
    await expect(page.locator('#hud-indicator')).toHaveText('01 / 06');

    // 2. PageDown advances from Slide 01 -> Slide 02
    await page.keyboard.press('PageDown');
    await expect(page.locator('#hud-indicator')).toHaveText('02 / 06');

    // 3. PageUp reverses from Slide 02 -> Slide 01
    await page.keyboard.press('PageUp');
    await expect(page.locator('#hud-indicator')).toHaveText('01 / 06');

    // 4. Close Speaker Notes (N), then Open Lightbox on Slide 01 Poster & close with ESC
    await page.keyboard.press('n');
    await expect(page.locator('#notes-drawer')).not.toHaveClass(/active/);
    await page.click('.poster-museum-frame');
    await expect(page.locator('#lightbox-modal')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox-modal')).not.toHaveClass(/active/);
  });

  test('Test 4: Rapid Input / Spam Click Protection & FPS Measurement', async ({ page }) => {
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
