import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const VIDEO_DIR = path.resolve('test-results/v9-videos');
const FRAMES_DIR = path.resolve('test-results/v9-video-frames');

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
    console.log(`Saved video: ${destPath} (${Math.round(fs.statSync(destPath).size / 1024)} KB)`);
  }
}

async function main() {
  const port = 4179;
  const server = spawn('npx', ['vite', '--port', String(port)], {
    shell: true,
    stdio: 'ignore'
  });

  await new Promise((r) => setTimeout(r, 2200));
  const baseUrl = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch();

  try {
    // VIDEO 1 — LANDING ("The Sky of Gratitude")
    await recordScenario(browser, baseUrl, 'video1-landing-sky', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-t0300ms.png') });
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-t1000ms.png') });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-t2200ms.png') });
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v1-landing-t3800ms-settled.png') });
    });

    // VIDEO 2 — BIRDS & SKY ("Cinematic Bird Flock on Slide 03")
    await recordScenario(browser, baseUrl, 'video2-birds-and-sky', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.evaluate(() => window.goToState(2, 0));
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v2-birds-slide3-t0350ms.png') });
      await page.waitForTimeout(850);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v2-birds-slide3-t1200ms.png') });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v2-birds-slide3-t2400ms.png') });
    });

    // VIDEO 3 — FLORAL STORM ("Slide 05 -> Slide 06: A Thousand Thank-Yous")
    await recordScenario(browser, baseUrl, 'video3-floral-storm-05-to-06', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.evaluate(() => window.goToState(4, 2)); // Slide 05 Stage 3
      await page.waitForTimeout(500);
      await page.click('#hud-next'); // Transition Slide 05 -> Slide 06 (Grand Moment 02)
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-floral-storm-t0350ms.png') });
      await page.waitForTimeout(650);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-floral-storm-t1000ms.png') });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-floral-storm-t2000ms.png') });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v3-floral-storm-t3800ms-settled.png') });
    });

    // VIDEO 4 — FINAL POSTER ("Slide 06 Tribute -> Full Poster Finale: Beyond the Horizon")
    await recordScenario(browser, baseUrl, 'video4-final-poster-horizon', async (page, url) => {
      await page.goto(url);
      await page.waitForSelector('#landing-page', { state: 'visible' });
      await page.evaluate(() => window.goToState(5, 0)); // Slide 06 Tribute
      await page.waitForTimeout(500);
      await page.click('#hud-next'); // Transition to Full Poster Finale (Grand Moment 03)
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-t0350ms.png') });
      await page.waitForTimeout(750);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-t1100ms.png') });
      await page.waitForTimeout(1100);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-t2200ms.png') });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: path.join(FRAMES_DIR, 'v4-finale-t4000ms-final-hold.png') });
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
