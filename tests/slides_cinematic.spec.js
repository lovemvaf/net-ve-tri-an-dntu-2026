import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test-results/v4-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Expected 34 sequential V4 states from Landing Step 0 to Slide 06 Step 5 (Final Hold)
const EXPECTED_SEQUENCE = [
  // Landing (-1): 5 steps (0..4)
  { slideIndex: -1, stepIndex: 0, label: 'MỞ ĐẦU 20/11 · BƯỚC 01 / 05' },
  { slideIndex: -1, stepIndex: 1, label: 'MỞ ĐẦU 20/11 · BƯỚC 02 / 05' },
  { slideIndex: -1, stepIndex: 2, label: 'MỞ ĐẦU 20/11 · BƯỚC 03 / 05' },
  { slideIndex: -1, stepIndex: 3, label: 'MỞ ĐẦU 20/11 · BƯỚC 04 / 05' },
  { slideIndex: -1, stepIndex: 4, label: 'MỞ ĐẦU 20/11 · BƯỚC 05 / 05' },
  // Slide 01 (0): 3 steps (0..2)
  { slideIndex: 0, stepIndex: 0, label: 'SLIDE 01 / 06 · BƯỚC 01 / 03' },
  { slideIndex: 0, stepIndex: 1, label: 'SLIDE 01 / 06 · BƯỚC 02 / 03' },
  { slideIndex: 0, stepIndex: 2, label: 'SLIDE 01 / 06 · BƯỚC 03 / 03' },
  // Slide 02 (1): 4 steps (0..3)
  { slideIndex: 1, stepIndex: 0, label: 'SLIDE 02 / 06 · BƯỚC 01 / 04' },
  { slideIndex: 1, stepIndex: 1, label: 'SLIDE 02 / 06 · BƯỚC 02 / 04' },
  { slideIndex: 1, stepIndex: 2, label: 'SLIDE 02 / 06 · BƯỚC 03 / 04' },
  { slideIndex: 1, stepIndex: 3, label: 'SLIDE 02 / 06 · BƯỚC 04 / 04' },
  // Slide 03 (2): 4 camera scenes (0..3)
  { slideIndex: 2, stepIndex: 0, label: 'SLIDE 03 / 06 · CẢNH 01 / 04' },
  { slideIndex: 2, stepIndex: 1, label: 'SLIDE 03 / 06 · CẢNH 02 / 04' },
  { slideIndex: 2, stepIndex: 2, label: 'SLIDE 03 / 06 · CẢNH 03 / 04' },
  { slideIndex: 2, stepIndex: 3, label: 'SLIDE 03 / 06 · CẢNH 04 / 04' },
  // Slide 04 (3): 7 steps (0..6)
  { slideIndex: 3, stepIndex: 0, label: 'SLIDE 04 / 06 · BƯỚC 01 / 07' },
  { slideIndex: 3, stepIndex: 1, label: 'SLIDE 04 / 06 · BƯỚC 02 / 07' },
  { slideIndex: 3, stepIndex: 2, label: 'SLIDE 04 / 06 · BƯỚC 03 / 07' },
  { slideIndex: 3, stepIndex: 3, label: 'SLIDE 04 / 06 · BƯỚC 04 / 07' },
  { slideIndex: 3, stepIndex: 4, label: 'SLIDE 04 / 06 · BƯỚC 05 / 07' },
  { slideIndex: 3, stepIndex: 5, label: 'SLIDE 04 / 06 · BƯỚC 06 / 07' },
  { slideIndex: 3, stepIndex: 6, label: 'SLIDE 04 / 06 · BƯỚC 07 / 07' },
  // Slide 05 (4): 5 real photo scenes (0..4)
  { slideIndex: 4, stepIndex: 0, label: 'SLIDE 05 / 06 · CẢNH 01 / 05' },
  { slideIndex: 4, stepIndex: 1, label: 'SLIDE 05 / 06 · CẢNH 02 / 05' },
  { slideIndex: 4, stepIndex: 2, label: 'SLIDE 05 / 06 · CẢNH 03 / 05' },
  { slideIndex: 4, stepIndex: 3, label: 'SLIDE 05 / 06 · CẢNH 04 / 05' },
  { slideIndex: 4, stepIndex: 4, label: 'SLIDE 05 / 06 · CẢNH 05 / 05' },
  // Slide 06 (5): 6 teacher-centered finale steps (0..5)
  { slideIndex: 5, stepIndex: 0, label: 'SLIDE 06 / 06 · BƯỚC 01 / 06' },
  { slideIndex: 5, stepIndex: 1, label: 'SLIDE 06 / 06 · BƯỚC 02 / 06' },
  { slideIndex: 5, stepIndex: 2, label: 'SLIDE 06 / 06 · BƯỚC 03 / 06' },
  { slideIndex: 5, stepIndex: 3, label: 'SLIDE 06 / 06 · BƯỚC 04 / 06' },
  { slideIndex: 5, stepIndex: 4, label: 'SLIDE 06 / 06 · BƯỚC 05 / 06' },
  { slideIndex: 5, stepIndex: 5, label: 'SLIDE 06 / 06 · BƯỚC 06 / 06' }
];

test.describe('NÉT VẼ TRI ÂN V4 — FINAL CINEMATIC REDESIGN & POWERPOINT STEP ENGINE QA', () => {
  test('Test 1 & Test 5: Full 34-Step Walk (Landing -> Slide 06 Final Hold) via Single Next Control & Teacher-Centered Finale', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.waitForTimeout(300);

    // Ensure no personal studio portrait exists on Slide 06
    const hasPersonalStudioPortrait = await page.locator('.author-portrait-img').count();
    expect(hasPersonalStudioPortrait).toBe(0);

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

      // Capture & verify Landing Step 5 (Complete Landing State)
      if (expected.slideIndex === -1 && expected.stepIndex === 4) {
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
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-01-landing-complete.png') });
      }

      if (expected.slideIndex === 0 && expected.stepIndex === 2) {
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-02-slide1-complete.png') });
      }

      if (expected.slideIndex === 1 && expected.stepIndex === 3) {
        await expect(page.locator('.slide2-floral-badge')).toBeVisible();
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-03-slide2-complete.png') });
      }

      if (expected.slideIndex === 2) {
        await expect(page.locator(`.zone-tab-btn[data-slide3-zone="${expected.stepIndex}"]`)).toHaveClass(/active/);
        if (expected.stepIndex === 0 || expected.stepIndex === 3) {
          await page.waitForTimeout(250);
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `v4-04-slide3-scene${expected.stepIndex + 1}.png`)
          });
        }
      }

      if (expected.slideIndex === 3 && expected.stepIndex === 6) {
        await expect(page.locator('.milestone-culmination-bar')).toContainText('02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT');
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-05-slide4-complete.png') });
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
        if (expected.stepIndex === 0 || expected.stepIndex === 1 || expected.stepIndex === 4) {
          await page.waitForTimeout(220);
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `v4-06-slide5-scene${expected.stepIndex + 1}.png`)
          });
        }
      }

      if (expected.slideIndex === 5 && expected.stepIndex === 3) {
        await expect(page.locator('#slide6-tribute-view')).toBeVisible();
        await expect(page.locator('#slide6-teacher-visual-stage')).toBeVisible();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-07-slide6-teacher-tribute.png') });
      }

      if (expected.slideIndex === 5 && expected.stepIndex === 5) {
        // Verify that Next automatically transitioned to Full Poster Finale without clicking any separate button
        await expect(page.locator('#slide6-finale-view')).toHaveClass(/active/);
        await expect(page.locator('.finale-2011-greeting')).toContainText(
          'CẢM ƠN QUÝ THẦY CÔ – CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11.'
        );
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
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-08-slide6-finale-hold.png') });
      }

      if (i < EXPECTED_SEQUENCE.length - 1) {
        await page.click('#hud-next');
      }
    }

    // At Final Hold (slideIndex: 5, stepIndex: 5), Next is disabled and does not loop
    await expect(page.locator('#hud-next')).toBeDisabled();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    const finalState = await page.evaluate(() => ({
      slideIndex: window.PresentationState.slideIndex,
      stepIndex: window.PresentationState.stepIndex
    }));
    expect(finalState).toEqual({ slideIndex: 5, stepIndex: 5 });
    expect(errors).toEqual([]);
  });

  test('Test 2: Reverse Step-by-Step Navigation from Final Hold Back to Landing Step 1', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.click('#hud-motion'); // Lite Mode for fast reverse traversal

    await page.keyboard.press('End');
    await page.waitForFunction(
      () =>
        window.PresentationState &&
        !window.PresentationState.isTransitioning &&
        window.PresentationState.slideIndex === 5 &&
        window.PresentationState.stepIndex === 5
    );

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

  test('Test 3: Input Consistency (Buttons, Space, Arrows, PageUp/PageDown, Enter, Lightbox ESC & Speaker Notes)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('');
    await page.waitForSelector('#landing-page', { state: 'visible' });
    await page.click('#hud-motion');

    // Open Speaker Notes (N)
    await page.keyboard.press('n');
    await expect(page.locator('#notes-drawer')).toHaveClass(/active/);
    await expect(page.locator('#notes-slide-title')).toHaveText('MỞ ĐẦU 20/11 · Khai mở nét vẽ tri thức');

    // 1. Space advances to Landing Step 2
    await page.keyboard.press('Space');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 02 / 05');
    await expect(page.locator('#notes-slide-title')).toHaveText('MỞ ĐẦU 20/11 · Ngày Nhà giáo Việt Nam 20/11');

    // 2. PageDown advances to Landing Step 3
    await page.keyboard.press('PageDown');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 03 / 05');

    // 3. Enter advances to Landing Step 4
    await page.keyboard.press('Enter');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 04 / 05');

    // 4. Open Lightbox on Poster & close with ESC
    await page.click('#landing-poster-container');
    await expect(page.locator('#lightbox-modal')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox-modal')).not.toHaveClass(/active/);

    // 5. PageUp reverses to Landing Step 3
    await page.keyboard.press('PageUp');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 03 / 05');

    // 6. #hud-prev reverses to Landing Step 2
    await page.click('#hud-prev');
    await expect(page.locator('#hud-indicator')).toHaveText('MỞ ĐẦU 20/11 · BƯỚC 02 / 05');
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

    for (let k = 0; k < 15; k++) {
      await page.keyboard.press('ArrowRight', { delay: 10 });
    }
    await page.waitForTimeout(600);
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
    await page.click('#hud-motion');

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.evaluate(() => window.goToState(-1, 4));
      await page.waitForTimeout(200);

      const landingVisible = await page.evaluate(() => {
        const img = document.getElementById('landing-full-poster-img');
        const rect = img.getBoundingClientRect();
        return img.complete && img.naturalWidth > 0 && rect.width > 100 && rect.height > 180;
      });
      expect(landingVisible).toBe(true);

      if (vp.name === '1366x768') {
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-09-1366x768-landing.png') });
      }

      await page.evaluate(() => window.goToState(5, 5));
      await page.waitForTimeout(250);

      if (vp.name === '1366x768') {
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v4-10-1366x768-finale.png') });
      }

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
