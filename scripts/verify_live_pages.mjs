import { chromium } from '@playwright/test';

async function verifyLiveGitHubPages() {
  const url = 'https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/';
  console.log('Launching Chromium to verify live URL:', url);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));

  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('HTTP Status:', res.status());
  if (res.status() !== 200) throw new Error('Expected HTTP 200, got ' + res.status());

  await page.waitForSelector('.reveal.ready', { timeout: 15000 });
  await page.waitForTimeout(1500);

  const slideCount = await page.locator('.reveal .slides > section').count();
  console.log('Live Slide Count:', slideCount);

  const imgStats = await page.locator('img').evaluateAll(imgs =>
    imgs.map(i => ({ src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight }))
  );
  const broken = imgStats.filter(i => i.src && i.src.length > 0 && i.w === 0);
  console.log('Total active img elements:', imgStats.filter(i => i.src).length, '| Broken images:', broken.length);
  if (broken.length > 0) console.log('Broken list:', broken);

  await page.screenshot({ path: 'tests/screenshots/live_github_pages_slide1.png' });

  for (let s = 1; s < 6; s++) {
    await page.evaluate(idx => window.Reveal.slide(idx), s);
    await page.waitForTimeout(900);
    const activeId = await page.locator('section.present').getAttribute('data-slide-id');
    console.log('Navigated live slide:', s + 1, '-> active ID:', activeId);
  }
  await page.screenshot({ path: 'tests/screenshots/live_github_pages_slide6.png' });

  console.log('Console/Page errors on live URL:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors);
  await browser.close();
}

verifyLiveGitHubPages().catch(err => {
  console.error(err);
  process.exit(1);
});
