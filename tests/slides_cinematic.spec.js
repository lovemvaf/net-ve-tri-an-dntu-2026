import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test-results/v3-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Expected 34 sequential states from Landing Step 0 to Slide 06 Step 4
const EXPECTED_SEQUENCE = [
  // Landing (-1): 6 steps (0..5)
  { slideIndex: -1, stepIndex: 0, label: 'MỞ ĐẦU 20/11 · BƯỚC 01 / 06' },
  { slideIndex: -1, stepIndex: 1, label: 'MỞ ĐẦU 20/11 · BƯỚC 02 / 06' },
  { slideIndex: -1, stepIndex: 2, label: 'MỞ ĐẦU 20/11 · BƯỚC 03 / 06' },
  { slideIndex: -1, stepIndex: 3, label: 'MỞ ĐẦU 20/11 · BƯỚC 04 / 06' },
  { slideIndex: -1, stepIndex: 4, label: 'MỞ ĐẦU 20/11 · BƯỚC 05 / 06' },
  { slideIndex: -1, stepIndex: 5, label: 'MỞ ĐẦU 20/11 · BƯỚC 06 / 06' },
  // Slide 01 (0): 3 steps (0..2)
  { slideIndex: 0, stepIndex: 0, label: 'SLIDE 01 / 06 · BƯỚC 01 / 03' },
  { slideIndex: 0, stepIndex: 1, label: 'SLIDE 01 / 06 · BƯỚC 02 / 03' },
  { slideIndex: 0, stepIndex: 2, label: 'SLIDE 01 / 06 · BƯỚC 03 / 03' },
  // Slide 02 (1): 4 steps (0..3)
  { slideIndex: 1, stepIndex: 0, label: 'SLIDE 02 / 06 · BƯỚC 01 / 04' },
  { slideIndex: 1, stepIndex: 1, label: 'SLIDE 02 / 06 · BƯỚC 02 / 04' },
  { slideIndex: 1, stepIndex: 2, label: 'SLIDE 02 / 06 · BƯỚC 03 / 04' },
  { slideIndex: 1, stepIndex: 3, label: 'SLIDE 02 / 06 · BƯỚC 04 / 04' },
  // Slide 03 (2): 4 steps (0..3)
  { slideIndex: 2, stepIndex: 0, label: 'SLIDE 03 / 06 · BƯỚC 01 / 04' },
  { slideIndex: 2, stepIndex: 1, label: 'SLIDE 03 / 06 · BƯỚC 02 / 04' },
  { slideIndex: 2, stepIndex: 2, label: 'SLIDE 03 / 06 · BƯỚC 03 / 04' },
  { slideIndex: 2, stepIndex: 3, label: 'SLIDE 03 / 06 · BƯỚC 04 / 04' },
  // Slide 04 (3): 7 steps (0..6)
  { slideIndex: 3, stepIndex: 0, label: 'SLIDE 04 / 06 · BƯỚC 01 / 07' },
  { slideIndex: 3, stepIndex: 1, label: 'SLIDE 04 / 06 · BƯỚC 02 / 07' },
  { slideIndex: 3, stepIndex: 2, label: 'SLIDE 04 / 06 · BƯỚC 03 / 07' },
  { slideIndex: 3, stepIndex: 3, label: 'SLIDE 04 / 06 · BƯỚC 04 / 07' },
  { slideIndex: 3, stepIndex: 4, label: 'SLIDE 04 / 06 · BƯỚC 05 / 07' },
  { slideIndex: 3, stepIndex: 5, label: 'SLIDE 04 / 06 · BƯỚC 06 / 07' },
  { slideIndex: 3, stepIndex: 6, label: 'SLIDE 04 / 06 · BƯỚC 07 / 07' },
  // Slide 05 (4): 5 scenes (0..4)
  { slideIndex: 4, stepIndex: 0, label: 'SLIDE 05 / 06 · CẢNH 01 / 05' },
  { slideIndex: 4, stepIndex: 1, label: 'SLIDE 05 / 06 · CẢNH 02 / 05' },
  { slideIndex: 4, stepIndex: 2, label: 'SLIDE 05 / 06 · CẢNH 03 / 05' },
  { slideIndex: 4, stepIndex: 3, label: 'SLIDE 05 / 06 · CẢNH 04 / 05' },
  { slideIndex: 4, stepIndex: 4, label: 'SLIDE 05 / 06 · CẢNH 05 / 05' },
  // Slide 06 (5): 5 steps (0..4)
  { slideIndex: 5, stepIndex: 0, label: 'SLIDE 06 / 06 · BƯỚC 01 / 05' },
  { slideIndex: 5, stepIndex: 1, label: 'SLIDE 06 / 06 · BƯỚC 02 / 05' },
  { slideIndex: 5, stepIndex: 2, label: 'SLIDE 06 / 06 · BƯỚC 03 / 05' },
  { slideIndex: 5, stepIndex: 3, label: 'SLIDE 06 / 06 · BƯỚC 04 / 05' },
  { slideIndex: 5, stepIndex: 4, label: 'SLIDE 06 / 06 · BƯỚC 05 / 05' }
];

test.describe('NÉT VẼ TRI ÂN V3 — GLOBAL STEP-BY-STEP NAVIGATION & FLORAL MOTION MASTERPIECE QA', () => {
  test('Test 1 & Test 5: Landing to Finale Full 34-Step Walk & POSTER_FULLY_VISIBLE = TRUE', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.waitForTimeout(350);

    // Enable Lite mode after initial landing check or wait cleanly per step
    // First capture Landing Step 1
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-00-landing-step1.png') });

    for (let i = 0; i < EXPECTED_SEQUENCE.length; i++) {
      const expected = EXPECTED_SEQUENCE[i];

      // Wait until any inter-slide transition settles
      await page.waitForFunction(
        ({ sIdx, stIdx }) =>
          window.PresentationState &&
          !window.PresentationState.isTransitioning &&
          window.PresentationState.slideIndex === sIdx &&
          window.PresentationState.stepIndex === stIdx,
        { sIdx: expected.slideIndex, stIdx: expected.stepIndex },
        { timeout: 5000 }
      );

      await expect(page.locator('#hud-indicator')).toHaveText(expected.label);

      // Specific milestone checks & screenshots
      if (expected.slideIndex === -1 && expected.stepIndex === 5) {
        // Verify Landing full poster is 100% visible & uncropped
        const landingPosterCheck = await page.evaluate(() => {
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
        expect(landingPosterCheck.loaded).toBe(true);
        expect(landingPosterCheck.objectFit).toBe('contain');
        expect(landingPosterCheck.fullyInsideViewport).toBe(true);

        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-01-landing-step6-full.png') });
      }

      if (expected.slideIndex === 0 && expected.stepIndex === 2) {
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-02-slide1-step3.png') });
      }

      if (expected.slideIndex === 1 && expected.stepIndex === 3) {
        await expect(page.locator('.slide2-floral-badge')).toBeVisible();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-03-slide2-step4.png') });
      }

      if (expected.slideIndex === 2) {
        // Verify active zone button matches stepIndex
        await expect(page.locator(`.zone-tab-btn[data-slide3-zone="${expected.stepIndex}"]`)).toHaveClass(/active/);
        if (expected.stepIndex === 0 || expected.stepIndex === 3) {
          await page.waitForTimeout(250);
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `v3-04-slide3-step${expected.stepIndex + 1}.png`)
          });
        }
      }

      if (expected.slideIndex === 3 && expected.stepIndex === 6) {
        await expect(page.locator('.milestone-culmination-bar')).toContainText('02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT');
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-05-slide4-step7.png') });
      }

      if (expected.slideIndex === 4) {
        await expect(page.locator(`.scene-step-btn[data-slide5-scene="${expected.stepIndex}"]`)).toHaveClass(/active/);
        await page.waitForFunction(
          () =>
            ['s5-hero-img', 's5-side1-img', 's5-side2-img'].every((id) => {
              const el = document.getElementById(id);
              return Boolean(el && el.complete && el.naturalWidth > 0);
            }),
          null,
          { timeout: 5000 }
        );
        if (expected.stepIndex === 0 || expected.stepIndex === 3 || expected.stepIndex === 4) {
          await page.waitForTimeout(250);
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `v3-06-slide5-scene${expected.stepIndex + 1}.png`)
          });
        }
      }

      if (expected.slideIndex === 5 && expected.stepIndex === 2) {
        await expect(page.locator('#slide6-tribute-view')).toBeVisible();
        await expect(page.locator('#slide6-floral-tribute')).toBeVisible();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-07-slide6-step3-floral.png') });
      }

      if (expected.slideIndex === 5 && expected.stepIndex === 4) {
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
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v3-08-slide6-step5-finale-hold.png') });
      }

      // Advance to next step unless at the very last step
      if (i < EXPECTED_SEQUENCE.length - 1) {
        await page.click('#hud-next');
      }
    }

    // At the final step (slideIndex: 5, stepIndex: 4), verify pressing ArrowRight holds steady and never loops
    await expect(page.locator('#hud-next')).toBeDisabled();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    const finalState = await page.evaluate(() => ({
      slideIndex: window.PresentationState.slideIndex,
      stepIndex: window.PresentationState.stepIndex
    }));
    expect(finalState).toEqual({ slideIndex: 5, stepIndex: 4 });
    expect(errors).toEqual([]);
  });

  test('Test 2: Reverse Step-by-Step Navigation from Finale Back to Landing Step 1', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });

    // Turn on Lite Mode for fast deterministic state machine traversal
    await page.click('#hud-motion');

    // Jump to the final state (Slide 06, Step 4) via End key
    await page.keyboard.press('End');
    await page.waitForFunction(
      () =>
        window.PresentationState &&
        !window.PresentationState.isTransitioning &&
        window.PresentationState.slideIndex === 5 &&
        window.PresentationState.stepIndex === 4
    );

    // Walk backward through all 34 steps in exact reverse order
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
      }
    }

    await expect(page.locator('#hud-prev')).toBeDisabled();
    await expect(page.locator('#landing-page')).toBeVisible();
  });

  test('Test 3: Input Consistency (Buttons, Space, Arrows, PageUp/PageDown, Enter) & Speaker Notes Sync', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.click('#hud-motion'); // Lite mode for crisp assertions

    // Open Speaker Notes (N)
    await page.keyboard.press('n');
    await expect(page.locator('#notes-drawer')).toHaveClass(/active/);
    await expect(page.locator('#notes-slide-title')).toHaveText('MỞ ĐẦU 20/11 · Khai mở nét vẽ tri thức');

    // 1. Space advances to Landing Step 2
    await page.keyboard.press('Space');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 02 / 06');
    await expect(page.locator('#notes-slide-title')).toHaveText('MỞ ĐẦU 20/11 · Chào mừng Ngày Nhà giáo Việt Nam 20/11');

    // 2. PageDown advances to Landing Step 3
    await page.keyboard.press('PageDown');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 03 / 06');

    // 3. Enter advances to Landing Step 4
    await page.keyboard.press('Enter');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 04 / 06');

    // 4. PageUp reverses to Landing Step 3
    await page.keyboard.press('PageUp');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 03 / 06');

    // 5. #hud-prev reverses to Landing Step 2
    await page.click('#hud-prev');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 02 / 06');
  });

  test('Test 4: Rapid Input / Spam Click Protection Without Breaking Layout or State', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });

    // Rapidly fire 15 keyboard presses and clicks
    for (let k = 0; k < 15; k++) {
      await page.keyboard.press('ArrowRight', { delay: 10 });
    }
    await page.waitForTimeout(800);

    // Wait for any active transition to finish
    await page.waitForFunction(() => window.PresentationState && !window.PresentationState.isTransitioning);

    const state = await page.evaluate(() => ({
      slideIndex: window.PresentationState.slideIndex,
      stepIndex: window.PresentationState.stepIndex,
      indicator: document.getElementById('hud-indicator')?.textContent
    }));

    expect(state.slideIndex).toBeGreaterThanOrEqual(-1);
    expect(state.slideIndex).toBeLessThanOrEqual(5);
    expect(state.stepIndex).toBeGreaterThanOrEqual(0);
    expect(state.indicator.length).toBeGreaterThan(5);
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
    await page.click('#hud-motion'); // Lite mode

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.keyboard.press('Home');
      await page.waitForTimeout(200);

      // Step to Landing Step 6 so all landing elements are visible
      await page.evaluate(() => window.goToState(-1, 5));
      await page.waitForTimeout(200);

      const landingVisible = await page.evaluate(() => {
        const img = document.getElementById('landing-full-poster-img');
        const rect = img.getBoundingClientRect();
        return img.complete && img.naturalWidth > 0 && rect.width > 100 && rect.height > 180;
      });
      expect(landingVisible).toBe(true);

      // Jump to Slide 06 Finale Step 5 and verify full poster is visible
      await page.evaluate(() => window.goToState(5, 4));
      await page.waitForTimeout(250);

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
