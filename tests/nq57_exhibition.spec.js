import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const OFFICIAL_URL =
  'https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm';

const EXPECTED_SCENES = [
  { index: 0, badge: '01 / 05', file: '01_NghiQuyet57_GanBan.png' },
  { index: 1, badge: '02 / 05', file: '02_HieuDung_DeBatDau.png' },
  { index: 2, badge: '03 / 05', file: '03_CongNghe_ViConNguoi.png' },
  { index: 3, badge: '04 / 05', file: '04_ThanhNienDongNai_HanhDong.png' },
  { index: 4, badge: '05 / 05', file: '05_HieuDung_LamThat_LanToa.png' }
];

const BANNED_STRINGS = [
  'Nét vẽ tri ân',
  'Nhà giáo',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
  '20/11'
];

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-results', 'nq57-screenshots');

function attachNetworkAndErrorGuards(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      httpErrors.push(`${res.status()} ${res.url()}`);
    }
  });

  return {
    assertClean() {
      expect(consoleErrors, 'Zero console errors').toEqual([]);
      expect(pageErrors, 'Zero uncaught page errors').toEqual([]);
      expect(failedRequests, 'Zero failed network requests').toEqual([]);
      expect(httpErrors, 'Zero >=400 HTTP responses').toEqual([]);
    }
  };
}

async function waitForPosterSettled(page, expectedFile) {
  await expect(page.locator('#poster-stage-img')).toHaveAttribute('src', new RegExp(`${expectedFile}$`));
  await page.waitForFunction(
    (file) => {
      const img = document.getElementById('poster-stage-img');
      const emblem = document.querySelector('.rail-emblem-img');
      const frame = document.getElementById('poster-museum-frame');
      const posterReady =
        img &&
        img.src.endsWith(file) &&
        img.complete &&
        img.naturalWidth === 1080 &&
        img.naturalHeight === 1350;
      const emblemReady = emblem && emblem.complete && emblem.naturalWidth > 0;
      const style = frame ? window.getComputedStyle(frame) : null;
      const settled = style && style.opacity === '1' && style.transform === 'none';
      return Boolean(posterReady && emblemReady && settled);
    },
    expectedFile,
    { timeout: 6000 }
  );
  // Small settle tick for fonts & layout repaint
  await page.waitForTimeout(120);
}

async function assertZero2011Strings(page) {
  const { bodyText, bodyHtml } = await page.evaluate(() => ({
    bodyText: document.body.innerText,
    bodyHtml: document.body.innerHTML
  }));
  for (const term of BANNED_STRINGS) {
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    expect(bodyText, `Rendered innerText must not contain "${term}"`).not.toMatch(rx);
    expect(bodyHtml, `Rendered innerHTML must not contain "${term}"`).not.toMatch(rx);
  }
}

async function assertPosterContainedInViewport(page) {
  const viewport = page.viewportSize();
  const metrics = await page.evaluate(() => {
    const img = document.getElementById('poster-stage-img');
    const emblem = document.querySelector('.rail-emblem-img');
    const frame = document.getElementById('poster-museum-frame');
    const hud = document.getElementById('hud-bar');
    const imgRect = img.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const hudRect = hud.getBoundingClientRect();
    const imgStyle = window.getComputedStyle(img);
    return {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      objectFit: imgStyle.objectFit,
      emblemComplete: emblem.complete,
      emblemNaturalWidth: emblem.naturalWidth,
      imgRect: {
        top: imgRect.top,
        bottom: imgRect.bottom,
        left: imgRect.left,
        right: imgRect.right,
        width: imgRect.width,
        height: imgRect.height
      },
      frameRect: {
        top: frameRect.top,
        bottom: frameRect.bottom,
        left: frameRect.left,
        right: frameRect.right
      },
      hudTop: hudRect.top
    };
  });

  expect(metrics.naturalWidth).toBe(1080);
  expect(metrics.naturalHeight).toBe(1350);
  expect(metrics.objectFit).toBe('contain');
  expect(metrics.emblemComplete).toBe(true);
  expect(metrics.emblemNaturalWidth).toBeGreaterThan(0);

  expect(metrics.imgRect.top).toBeGreaterThanOrEqual(0);
  expect(metrics.imgRect.left).toBeGreaterThanOrEqual(0);
  expect(metrics.imgRect.right).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(metrics.imgRect.bottom).toBeLessThanOrEqual(viewport.height + 0.5);

  // Also ensure frame itself is uncropped inside desktop/laptop viewport and does not collide with bottom HUD
  expect(metrics.frameRect.top).toBeGreaterThanOrEqual(0);
  expect(metrics.frameRect.bottom).toBeLessThanOrEqual(metrics.hudTop + 0.5);
}

test.describe('NQ57 5-Scene Exhibition E2E QA', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test('opens immediately on Scene 01/05, navigates 4 Next clicks to 05/05 without wrap, and 4 Prev clicks back to 01/05', async ({ page }) => {
    const guard = attachNetworkAndErrorGuards(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('./', { waitUntil: 'networkidle' });

    // Opens immediately on 01/05 with NO landing screen
    await expect(page.getByTestId('hud-progress')).toHaveText('01 / 05');
    await expect(page.locator('#rail-step-badge')).toHaveText('01 / 05');
    await expect(page.getByTestId('btn-prev')).toBeDisabled();
    await expect(page.getByTestId('btn-next')).toBeEnabled();
    await expect(page.locator('#scene-05-actions')).toBeHidden();
    await waitForPosterSettled(page, EXPECTED_SCENES[0].file);
    await assertZero2011Strings(page);

    // 4 clicks on #btn-next advance 01 -> 02 -> 03 -> 04 -> 05
    for (let step = 1; step <= 4; step++) {
      await page.getByTestId('btn-next').click();
      await expect(page.getByTestId('hud-progress')).toHaveText(EXPECTED_SCENES[step].badge);
      await waitForPosterSettled(page, EXPECTED_SCENES[step].file);
    }

    // At 05/05: #btn-next is disabled, 5th click (force) must NOT wrap around
    await expect(page.getByTestId('btn-next')).toBeDisabled();
    await page.getByTestId('btn-next').click({ force: true });
    await expect(page.getByTestId('hud-progress')).toHaveText('05 / 05');
    await expect(page.getByTestId('poster-stage-img')).toHaveAttribute('src', /05_HieuDung_LamThat_LanToa\.png$/);

    // Verify official mst.gov.vn CTA link on Scene 05/05
    const officialLink = page.locator('#btn-official-link');
    await expect(officialLink).toBeVisible();
    await expect(officialLink).toHaveAttribute('href', OFFICIAL_URL);

    // 4 clicks on #btn-prev return 05 -> 04 -> 03 -> 02 -> 01
    for (let step = 3; step >= 0; step--) {
      await page.getByTestId('btn-prev').click();
      await expect(page.getByTestId('hud-progress')).toHaveText(EXPECTED_SCENES[step].badge);
      await waitForPosterSettled(page, EXPECTED_SCENES[step].file);
    }

    await expect(page.getByTestId('btn-prev')).toBeDisabled();
    guard.assertClean();
  });

  test('supports all keyboard shortcuts: ArrowRight, ArrowLeft, Space, End, Home, N, L, Z, Escape, R', async ({ page }) => {
    const guard = attachNetworkAndErrorGuards(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('./', { waitUntil: 'networkidle' });
    await waitForPosterSettled(page, EXPECTED_SCENES[0].file);

    // ArrowRight -> 02/05
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('hud-progress')).toHaveText('02 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[1].file);

    // Space -> 03/05
    await page.keyboard.press('Space');
    await expect(page.getByTestId('hud-progress')).toHaveText('03 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[2].file);

    // ArrowLeft -> 02/05
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('hud-progress')).toHaveText('02 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[1].file);

    // End -> 05/05
    await page.keyboard.press('End');
    await expect(page.getByTestId('hud-progress')).toHaveText('05 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[4].file);
    await expect(page.locator('#btn-official-link')).toHaveAttribute('href', OFFICIAL_URL);

    // Home -> 01/05
    await page.keyboard.press('Home');
    await expect(page.getByTestId('hud-progress')).toHaveText('01 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[0].file);

    // N -> toggle speaker-cue-panel closed then open
    const cuePanel = page.getByTestId('speaker-cue-panel');
    await expect(cuePanel).toBeVisible();
    await page.keyboard.press('n');
    await expect(cuePanel).toHaveClass(/is-collapsed/);
    await expect(cuePanel).toBeHidden();
    await page.keyboard.press('N');
    await expect(cuePanel).not.toHaveClass(/is-collapsed/);
    await expect(cuePanel).toBeVisible();

    // L -> toggle body.lite-mode on then off
    await expect(page.locator('body')).not.toHaveClass(/lite-mode/);
    await page.keyboard.press('l');
    await expect(page.locator('body')).toHaveClass(/lite-mode/);
    await page.keyboard.press('L');
    await expect(page.locator('body')).not.toHaveClass(/lite-mode/);

    // Z & Escape -> open and close #lightbox-modal
    const lightbox = page.locator('#lightbox-modal');
    await expect(lightbox).not.toHaveClass(/active/);
    await page.keyboard.press('z');
    await expect(lightbox).toHaveClass(/active/);
    await expect(page.locator('#lightbox-img')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/active/);

    // Advance to 04/05 via pill and test R -> restart to 01/05
    await page.locator('[data-scene-pill="3"]').click();
    await expect(page.getByTestId('hud-progress')).toHaveText('04 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[3].file);
    await page.keyboard.press('r');
    await expect(page.getByTestId('hud-progress')).toHaveText('01 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[0].file);

    guard.assertClean();
  });

  test('verifies all 5 scenes geometry, contain framing, emblem, zero 20/11 strings & captures 1920x1080 screenshots', async ({ page }) => {
    const guard = attachNetworkAndErrorGuards(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('./', { waitUntil: 'networkidle' });

    for (const scene of EXPECTED_SCENES) {
      if (scene.index > 0) {
        await page.getByTestId('btn-next').click();
      }
      await expect(page.getByTestId('hud-progress')).toHaveText(scene.badge);
      await waitForPosterSettled(page, scene.file);
      await assertPosterContainedInViewport(page);
      await assertZero2011Strings(page);

      if (scene.index === 4) {
        await expect(page.locator('#btn-official-link')).toHaveAttribute('href', OFFICIAL_URL);
      }

      const fileNum = String(scene.index + 1).padStart(2, '0');
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `1920x1080_scene_${fileNum}.png`),
        fullPage: false
      });
    }

    guard.assertClean();
  });

  test('verifies all 5 scenes geometry at 1366x768 & captures scenes 01 and 05 screenshots', async ({ page }) => {
    const guard = attachNetworkAndErrorGuards(page);
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('./', { waitUntil: 'networkidle' });

    for (const scene of EXPECTED_SCENES) {
      if (scene.index > 0) {
        await page.getByTestId('btn-next').click();
      }
      await expect(page.getByTestId('hud-progress')).toHaveText(scene.badge);
      await waitForPosterSettled(page, scene.file);
      await assertPosterContainedInViewport(page);
      await assertZero2011Strings(page);

      if (scene.index === 0 || scene.index === 4) {
        const fileNum = String(scene.index + 1).padStart(2, '0');
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `1366x768_scene_${fileNum}.png`),
          fullPage: false
        });
      }
    }

    await expect(page.locator('#btn-official-link')).toHaveAttribute('href', OFFICIAL_URL);
    guard.assertClean();
  });

  test('verifies mobile 390x844 layout & captures scenes 01 and 05 screenshots', async ({ page }) => {
    const guard = attachNetworkAndErrorGuards(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./', { waitUntil: 'networkidle' });

    await expect(page.getByTestId('hud-progress')).toHaveText('01 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[0].file);
    await assertZero2011Strings(page);

    const mobileMetrics01 = await page.evaluate(() => {
      const img = document.getElementById('poster-stage-img');
      const emblem = document.querySelector('.rail-emblem-img');
      const rect = img.getBoundingClientRect();
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        objectFit: window.getComputedStyle(img).objectFit,
        emblemLoaded: emblem.complete && emblem.naturalWidth > 0,
        imgLeft: rect.left,
        imgRight: rect.right,
        imgTop: rect.top,
        docOverflowX: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    expect(mobileMetrics01.naturalWidth).toBe(1080);
    expect(mobileMetrics01.naturalHeight).toBe(1350);
    expect(mobileMetrics01.objectFit).toBe('contain');
    expect(mobileMetrics01.emblemLoaded).toBe(true);
    expect(mobileMetrics01.imgLeft).toBeGreaterThanOrEqual(0);
    expect(mobileMetrics01.imgRight).toBeLessThanOrEqual(390.5);
    expect(mobileMetrics01.docOverflowX).toBe(false);

    // Ensure mobile vertical scrolling works cleanly (not trapped by reveal.css overflow:hidden)
    const canScrollY = await page.evaluate(() => {
      const rootStyle = window.getComputedStyle(document.documentElement);
      const bodyStyle = window.getComputedStyle(document.body);
      return {
        scrollHeight: document.documentElement.scrollHeight,
        rootOverflowY: rootStyle.overflowY,
        bodyOverflowY: bodyStyle.overflowY
      };
    });
    expect(canScrollY.scrollHeight).toBeGreaterThan(844);
    expect(canScrollY.bodyOverflowY).not.toBe('hidden');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '390x844_scene_01.png'),
      fullPage: true
    });

    await page.keyboard.press('End');
    await expect(page.getByTestId('hud-progress')).toHaveText('05 / 05');
    await waitForPosterSettled(page, EXPECTED_SCENES[4].file);
    await expect(page.locator('#btn-official-link')).toHaveAttribute('href', OFFICIAL_URL);
    await assertZero2011Strings(page);

    // Verify scrolling to bottom on mobile brings official link cleanly above bottom HUD bar
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(150);
    const linkClearance = await page.evaluate(() => {
      const link = document.getElementById('btn-official-link').getBoundingClientRect();
      const hud = document.getElementById('hud-bar').getBoundingClientRect();
      return { linkBottom: link.bottom, hudTop: hud.top };
    });
    expect(linkClearance.linkBottom).toBeLessThanOrEqual(linkClearance.hudTop);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '390x844_scene_05.png'),
      fullPage: true
    });

    guard.assertClean();
  });
});
