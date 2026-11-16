import { chromium } from '@playwright/test';

async function verifyPoster(page, selector) {
  return page.locator(selector).evaluate((img) => {
    const rect = img.getBoundingClientRect();
    const style = window.getComputedStyle(img);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = rect.width / rect.height;
    const withinViewport =
      rect.top >= 0 && rect.left >= 0 && rect.bottom <= vh + 2 && rect.right <= vw + 2 && rect.height > 200;
    const isContain = style.objectFit === 'contain';
    const ratioMatches = Math.abs(naturalRatio - boxRatio) < 0.035;
    return {
      POSTER_FULLY_VISIBLE: withinViewport && isContain && ratioMatches && img.naturalWidth > 500,
      rect: {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      objectFit: style.objectFit
    };
  });
}

async function verifyLiveGitHubPages() {
  const url = 'https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/';
  console.log('Launching Chromium to verify live V4 URL:', url);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));

  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('HTTP Status:', res.status());
  if (res.status() !== 200) throw new Error('Expected HTTP 200, got ' + res.status());

  await page.waitForSelector('#landing-page', { timeout: 15000 });
  await page.waitForSelector('.reveal.ready', { timeout: 15000 });
  await page.waitForTimeout(400);

  // Verify V4 Initial HUD indicator (5 steps on Landing)
  const initHud = await page.locator('#hud-indicator').textContent();
  console.log('Live V4 Initial HUD Indicator:', initHud?.trim());
  if (initHud?.trim() !== 'MỞ ĐẦU 20/11 · BƯỚC 01 / 05') {
    throw new Error('Expected MỞ ĐẦU 20/11 · BƯỚC 01 / 05, got: ' + initHud);
  }

  // Walk through all 5 steps of Landing Page (0..4)
  for (let st = 0; st < 4; st++) {
    await page.click('#hud-next');
    await page.waitForTimeout(300);
  }
  const landingStep5Hud = await page.locator('#hud-indicator').textContent();
  console.log('Live V4 Landing Step 5 HUD:', landingStep5Hud?.trim());

  // Check Landing Page & POSTER_FULLY_VISIBLE
  const landingCheck = await verifyPoster(page, '#landing-full-poster-img');
  console.log('Live V4 Landing Page Poster Check:', JSON.stringify(landingCheck));
  if (!landingCheck.POSTER_FULLY_VISIBLE) {
    throw new Error('Landing page poster not fully visible on live site!');
  }
  await page.screenshot({ path: 'test-results/v4-screenshots/live_v4_landing_complete.png' });

  // Step through the remaining 29 steps across Slides 01..06 (3 + 4 + 4 + 7 + 5 + 6 = 29 steps)
  await page.click('#hud-motion'); // Enable Lite Mode for fast live verification walk
  for (let k = 0; k < 29; k++) {
    await page.click('#hud-next');
    await page.waitForFunction(() => window.PresentationState && !window.PresentationState.isTransitioning);
  }

  const finalHud = await page.locator('#hud-indicator').textContent();
  console.log('Live V4 Final Step 34 HUD:', finalHud?.trim());
  if (finalHud?.trim() !== 'SLIDE 06 / 06 · BƯỚC 06 / 06') {
    throw new Error('Did not reach SLIDE 06 / 06 · BƯỚC 06 / 06 on live site; got: ' + finalHud);
  }

  const finaleCheck = await verifyPoster(page, '#finale-full-poster-img');
  console.log('Live V4 Slide 06 Finale Full Poster Check:', JSON.stringify(finaleCheck));
  if (!finaleCheck.POSTER_FULLY_VISIBLE) {
    throw new Error('Slide 06 finale full poster not fully visible on live site!');
  }
  await page.screenshot({ path: 'test-results/v4-screenshots/live_v4_slide6_finale_hold.png' });

  // Verify Reverse Step Navigation on Live Site
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  const revHud = await page.locator('#hud-indicator').textContent();
  console.log('Live V4 Reverse 2 Steps HUD (Teacher Tribute Stage):', revHud?.trim());
  await page.screenshot({ path: 'test-results/v4-screenshots/live_v4_slide6_teacher_tribute.png' });

  console.log('Console/Page errors on live URL:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors);
  await browser.close();
}

verifyLiveGitHubPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
