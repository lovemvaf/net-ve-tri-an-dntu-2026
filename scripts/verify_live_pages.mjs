import { chromium } from '@playwright/test';

async function verifyPoster(page, selector) {
  return page.locator(selector).evaluate(img => {
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
      rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), width: Math.round(rect.width), height: Math.round(rect.height) },
      objectFit: style.objectFit
    };
  });
}

async function verifyLiveGitHubPages() {
  const url = 'https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/';
  console.log('Launching Chromium to verify live V2 URL:', url);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));

  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('HTTP Status:', res.status());
  if (res.status() !== 200) throw new Error('Expected HTTP 200, got ' + res.status());

  await page.waitForSelector('#landing-page', { timeout: 15000 });
  await page.waitForSelector('.reveal.ready', { timeout: 15000 });
  await page.waitForTimeout(1400);

  // 1. Check Landing Page & POSTER_FULLY_VISIBLE
  const landingCheck = await verifyPoster(page, '#landing-full-poster-img');
  console.log('Live Landing Page Poster Check:', JSON.stringify(landingCheck));
  if (!landingCheck.POSTER_FULLY_VISIBLE) {
    throw new Error('Landing page poster not fully visible on live site!');
  }
  await page.screenshot({ path: 'tests/screenshots/live_v2_landing.png' });

  // 2. Click "KHÁM PHÁ HÀNH TRÌNH TRI ÂN" to enter Slide 01
  await page.locator('#btn-enter-journey').click();
  await page.waitForTimeout(1000);
  const indicatorText = await page.locator('#hud-indicator').textContent();
  console.log('Entered Slide 01 -> Indicator:', indicatorText?.trim());

  // 3. Navigate through Slides 02, 03, 04, 05
  for (let s = 1; s <= 4; s++) {
    await page.evaluate(idx => window.Reveal.slide(idx), s);
    await page.waitForTimeout(800);
    const activeId = await page.locator('section.present').getAttribute('data-slide-id');
    console.log('Navigated live slide:', s + 1, '-> active ID:', activeId);
  }

  // Verify Slide 05 Curated Photos on Live Site
  for (let sc = 0; sc < 5; sc++) {
    await page.locator(`[data-slide5-scene="${sc}"]`).click();
    await page.waitForTimeout(300);
    await page.waitForFunction(
      () => {
        const img = document.getElementById('s5-hero-img');
        return img && img.complete && img.naturalWidth > 500;
      },
      { timeout: 15000 }
    );
    await page.waitForTimeout(300);
    const heroW = await page.locator('#s5-hero-img').evaluate(i => i.naturalWidth);
    console.log(`  Live Slide 05 Scene ${sc + 1} hero naturalWidth:`, heroW);
    if (heroW < 500) throw new Error(`Slide 05 Scene ${sc + 1} hero photo failed on live site`);
  }
  await page.screenshot({ path: 'tests/screenshots/live_v2_slide5_exhibition.png' });

  // 4. Navigate to Slide 06 -> Verify Portrait & Trigger Final Full Poster Reveal
  await page.evaluate(() => window.Reveal.slide(5));
  await page.waitForTimeout(900);
  const portraitW = await page.locator('.author-portrait-img').evaluate(i => i.naturalWidth);
  console.log('Live Slide 06 Author Portrait naturalWidth:', portraitW);

  await page.locator('#btn-trigger-finale').click();
  await page.waitForTimeout(1000);
  const finaleCheck = await verifyPoster(page, '#finale-full-poster-img');
  console.log('Live Slide 06 Finale Full Poster Check:', JSON.stringify(finaleCheck));
  if (!finaleCheck.POSTER_FULLY_VISIBLE) {
    throw new Error('Slide 06 finale full poster not fully visible on live site!');
  }
  await page.screenshot({ path: 'tests/screenshots/live_v2_slide6_finale_poster.png' });

  console.log('Console/Page errors on live URL:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors);
  await browser.close();
}

verifyLiveGitHubPages().catch(err => {
  console.error(err);
  process.exit(1);
});
