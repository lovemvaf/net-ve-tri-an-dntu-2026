import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const LIVE_URL = 'https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/';
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

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

async function waitForSettledScene(page, expectedBadge, expectedFile) {
  await page.waitForFunction(
    ({ badge, file }) => {
      const hud = document.getElementById('hud-progress');
      const img = document.getElementById('poster-stage-img');
      const emblem = document.querySelector('.rail-emblem-img');
      const frame = document.getElementById('poster-museum-frame');
      const style = frame ? window.getComputedStyle(frame) : null;
      return Boolean(
        hud &&
          hud.textContent?.trim() === badge &&
          img &&
          img.src.endsWith(file) &&
          img.complete &&
          img.naturalWidth === 1080 &&
          img.naturalHeight === 1350 &&
          emblem &&
          emblem.complete &&
          emblem.naturalWidth > 0 &&
          style &&
          style.opacity === '1' &&
          style.transform === 'none'
      );
    },
    { badge: expectedBadge, file: expectedFile },
    { timeout: 12000 }
  );
  await page.waitForTimeout(150);
}

async function main() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      httpErrors.push(`${res.status()} ${res.url()}`);
    }
  });

  try {
    const response = await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response?.status() ?? 0;
    console.log(`[INFO] Live URL HTTP status: ${status}`);
    if (status !== 200) {
      throw new Error(`Expected HTTP 200 on ${LIVE_URL}, got ${status}`);
    }

    // Wait for Scene 01/05 immediately on load
    await waitForSettledScene(page, EXPECTED_SCENES[0].badge, EXPECTED_SCENES[0].file);
    console.log('[PASS] Live site opens directly on 01 / 05 with 1080x1350 poster & Đoàn emblem');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'live_1920x1080_scene_01.png'),
      fullPage: false
    });

    // Check 4 Next clicks -> 05/05
    for (let i = 1; i < EXPECTED_SCENES.length; i++) {
      await page.click('#btn-next');
      await waitForSettledScene(page, EXPECTED_SCENES[i].badge, EXPECTED_SCENES[i].file);
      const metrics = await page.evaluate(() => {
        const img = document.getElementById('poster-stage-img');
        const emblem = document.querySelector('.rail-emblem-img');
        return {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          objectFit: window.getComputedStyle(img).objectFit,
          emblemLoaded: emblem.complete && emblem.naturalWidth > 0,
          bodyText: document.body.innerText,
          bodyHtml: document.body.innerHTML
        };
      });
      if (metrics.naturalWidth !== 1080 || metrics.naturalHeight !== 1350 || metrics.objectFit !== 'contain') {
        fail(`Scene ${EXPECTED_SCENES[i].badge} geometry invalid: ${JSON.stringify(metrics)}`);
      }
      if (!metrics.emblemLoaded) {
        fail(`Scene ${EXPECTED_SCENES[i].badge} Đoàn emblem failed to load`);
      }
      for (const term of BANNED_STRINGS) {
        const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        if (rx.test(metrics.bodyText) || rx.test(metrics.bodyHtml)) {
          fail(`Scene ${EXPECTED_SCENES[i].badge} leaked banned 20/11 term: ${term}`);
        }
      }
      console.log(`[PASS] Scene ${EXPECTED_SCENES[i].badge} (${EXPECTED_SCENES[i].file}) verified 1080x1350 contain`);
    }

    // Verify Scene 05 official link and disabled Next button
    const finalChecks = await page.evaluate(() => {
      const btnNext = document.getElementById('btn-next');
      const link = document.getElementById('btn-official-link');
      return {
        nextDisabled: btnNext?.disabled === true,
        href: link?.getAttribute('href'),
        visible: Boolean(link && link.offsetParent !== null)
      };
    });

    if (!finalChecks.nextDisabled) fail('Scene 05/05 #btn-next must be disabled');
    if (!finalChecks.visible || finalChecks.href !== OFFICIAL_URL) {
      fail(`Scene 05/05 #btn-official-link mismatch: ${JSON.stringify(finalChecks)}`);
    } else {
      console.log('[PASS] Scene 05/05 #btn-next disabled and #btn-official-link matches mst.gov.vn URL');
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'live_1920x1080_scene_05.png'),
      fullPage: false
    });

    // Check scene 01 banned strings too (already loaded, also check errors)
    const scene01TextCheck = await page.evaluate(() => ({
      title: document.title,
      sceneCount: document.querySelectorAll('#nq57-reveal section').length
    }));
    if (scene01TextCheck.sceneCount !== 5) {
      fail(`Expected 5 scenes in Reveal track, got ${scene01TextCheck.sceneCount}`);
    }

    if (consoleErrors.length > 0) fail(`Console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length > 0) fail(`Page errors: ${pageErrors.join(' | ')}`);
    if (failedRequests.length > 0) fail(`Failed requests: ${failedRequests.join(' | ')}`);
    if (httpErrors.length > 0) fail(`HTTP >=400 errors: ${httpErrors.join(' | ')}`);

    if (!process.exitCode) {
      console.log(
        `[PASS] LIVE VERIFICATION COMPLETE (${LIVE_URL}) — 0 console errors, 0 page errors, 0 failed/404 requests, 0 20/11 strings.`
      );
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
