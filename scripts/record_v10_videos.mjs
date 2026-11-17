import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const VIDEO_DIR = path.resolve('test-results/v10-videos');
const FRAMES_DIR = path.resolve('test-results/v10-video-frames');

if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });
if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

async function recordScenario(browser, baseUrl, name, runFn) {
  const scenarioDir = path.join(VIDEO_DIR, name);
  if (!fs.existsSync(scenarioDir)) fs.mkdirSync(scenarioDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: scenarioDir,
      size: { width: 1920, height: 1080 }
    }
  });
  const page = await context.newPage();
  await runFn(page, baseUrl);
  const video = page.video();
  await context.close();
  if (video) {
    const srcPath = await video.path();
    const destPath = path.join(VIDEO_DIR, `${name}.webm`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Saved V10 video: ${destPath} (${Math.round(fs.statSync(destPath).size / 1024)} KB)`);
  }
}

async function main() {
  const port = 4180;
  const server = spawn('npx', ['vite', '--port', String(port)], {
    shell: true,
    stdio: 'ignore'
  });

  await new Promise((r) => setTimeout(r, 2200));
  const baseUrl = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch();

  try {
    // VIDEO 1 — LANDING + 4–7s RECURRING BURST CYCLE
    await recordScenario(browser, baseUrl, 'video1-v10-landing-floral-bloom', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-burst1-t0450ms.png') });
      await page.waitForTimeout(3400);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-rest-t3850ms.png') });
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-burst2-t5450ms.png') });
    });

    // VIDEO 2 — SLIDE 03 ALL 4 SUBSCENES (s3-step-1..4)
    await recordScenario(browser, baseUrl, 'video2-v10-slide3-subscenes', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      for (let step = 0; step < 4; step++) {
        await page.evaluate((st) => window.goToState(2, st), step);
        await page.waitForTimeout(550);
        await page.screenshot({ path: path.join(FRAMES_DIR, `v2-slide3-step${step + 1}-t0550ms.png`) });
      }
    });

    // VIDEO 3 — SLIDE 05 3 STAGES -> SLIDE 06 TEACHER TRIBUTE FLORAL BLOOM
    await recordScenario(browser, baseUrl, 'video3-v10-slide5-to-6-tribute', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.evaluate(() => window.goToState(4, 2)); // Slide 05 Stage 3
      await page.waitForTimeout(550);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-slide5-stage3-t0550ms.png') });
      await page.click('#hud-next'); // Slide 06 Tribute
      await page.waitForTimeout(550);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-slide6-tribute-bloom-t0550ms.png') });
      await page.waitForTimeout(4800);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-slide6-tribute-recurring-t5350ms.png') });
    });

    // VIDEO 4 — FULL POSTER FINALE & RECURRING SAFE HOLD
    await recordScenario(browser, baseUrl, 'video4-v10-finale-recurring-hold', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.evaluate(() => window.goToState(5, 1)); // Slide 06 Finale
      await page.waitForTimeout(550);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-burst1-t0550ms.png') });
      await page.waitForTimeout(3500);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-safe-hold-t4050ms.png') });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-burst2-t5550ms.png') });
    });
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
