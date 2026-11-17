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
  console.log('Launching Chromium to verify live V8 URL (Ultimate Cinematic Ambient Masterpiece + 12 Clicks):', url);
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
  await page.waitForSelector('#ambient-sky-canvas', { state: 'attached', timeout: 15000 });
  await page.waitForSelector('.reveal.ready', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(500);

  // 1. Verify V9 Initial HUD indicator, Dual-Canvas VFX Layer & Wire-Free Cleanliness
  const initHud = await page.locator('#hud-indicator').textContent();
  const v9Check = await page.evaluate(() => {
    const sky = document.getElementById('living-sky-layer');
    const canvas = document.getElementById('ambient-sky-canvas');
    const grandCanvas = document.getElementById('grand-vfx-canvas');
    const grandZ = grandCanvas ? Number(window.getComputedStyle(grandCanvas).zIndex) : 0;
    const stats = window.VFXShowcase ? window.VFXShowcase.getStats() : null;
    const wireFree =
      !document.getElementById('landing-pen-stroke') &&
      !document.getElementById('sky-horizon-ribbons') &&
      !document.getElementById('transition-light-path') &&
      !document.getElementById('slide3-camera-svg') &&
      !document.querySelector('.criteria-connector-svg');
    return {
      skyMood: sky?.getAttribute('data-sky-mood'),
      ambientState: sky?.getAttribute('data-ambient-state'),
      canvasReady: Boolean(canvas && canvas.width === 1920 && grandCanvas && grandCanvas.width === 1920),
      grandZ,
      stats,
      wireFree
    };
  });
  console.log('Live V10 Initial HUD Indicator:', initHud?.trim(), '| V10 VFX Check:', JSON.stringify(v9Check));
  if (initHud?.trim() !== 'MỞ ĐẦU 20/11') {
    throw new Error('Expected MỞ ĐẦU 20/11 on Landing, got: ' + initHud);
  }
  if (!v9Check.canvasReady || v9Check.grandZ !== 265 || !v9Check.wireFree || v9Check.stats?.sceneId !== 'landing-main') {
    throw new Error('Live V10 dual-canvas VFX check failed: ' + JSON.stringify(v9Check));
  }

  // Verify Landing Page Poster is immediately visible without extra clicks
  const landingCheck = await verifyPoster(page, '#landing-full-poster-img');
  console.log('Live V6 Landing Page Poster Check:', JSON.stringify(landingCheck));
  if (!landingCheck.POSTER_FULLY_VISIBLE) {
    throw new Error('Landing page poster not fully visible on live site!');
  }

  // 2. Step through all 12 clicks (from State 0 Landing to State 12 Slide 06 Finale)
  for (let click = 1; click <= 12; click++) {
    await page.click('#hud-next');
    await page.waitForFunction(() => window.PresentationState && !window.PresentationState.isTransitioning);
    const hud = await page.locator('#hud-indicator').textContent();
    const transTheme = await page.locator('#scene-transition-overlay').getAttribute('data-transition-theme');
    console.log(`  Click ${click}/12 -> HUD: ${hud?.trim()} | Transition Theme: ${transTheme}`);

    // On Click 8 (Slide 05 Stage 1), verify the new replacement photo curated-20-clb-cntt-dntu-project.jpg
    if (click === 8) {
      const side3Src = await page.locator('#s5-side3-img').getAttribute('src');
      console.log('  Live V6 Slide 05 Stage 1 s5-side3-img src:', side3Src);
      if (!side3Src?.includes('curated-20-clb-cntt-dntu-project.jpg')) {
        throw new Error('Expected curated-20-clb-cntt-dntu-project.jpg on live Slide 05 Stage 1, got: ' + side3Src);
      }
    }
  }

  const finalHud = await page.locator('#hud-indicator').textContent();
  if (finalHud?.trim() !== '06 / 06 · CẢNH 02 / 02') {
    throw new Error('Did not reach 06 / 06 · CẢNH 02 / 02 after 12 clicks; got: ' + finalHud);
  }

  const finaleCheck = await verifyPoster(page, '#finale-full-poster-img');
  console.log('Live V5 Slide 06 Finale Full Poster Check:', JSON.stringify(finaleCheck));
  if (!finaleCheck.POSTER_FULLY_VISIBLE) {
    throw new Error('Slide 06 finale full poster not fully visible on live site!');
  }

  // 3. Verify Reverse Step Navigation on Live Site
  await page.keyboard.press('ArrowLeft');
  const revHud = await page.locator('#hud-indicator').textContent();
  console.log('Live V5 Reverse 1 Step HUD (Slide 06 Tribute):', revHud?.trim());

  console.log('Console/Page errors on live URL:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors);
  await browser.close();
}

verifyLiveGitHubPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
