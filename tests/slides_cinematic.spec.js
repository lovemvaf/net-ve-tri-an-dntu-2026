import { test, expect } from '@playwright/test';

async function verifyPosterFullyVisible(page, imgSelector) {
  const result = await page.locator(imgSelector).evaluate(img => {
    const rect = img.getBoundingClientRect();
    const style = window.getComputedStyle(img);
    const parentStyle = img.parentElement ? window.getComputedStyle(img.parentElement) : {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = rect.width / rect.height;

    const withinViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= vh + 2 &&
      rect.right <= vw + 2 &&
      rect.height > 200 &&
      rect.width > 100;

    const isContain = style.objectFit === 'contain';
    const ratioMatches = Math.abs(naturalRatio - boxRatio) < 0.035;

    return {
      POSTER_FULLY_VISIBLE: withinViewport && isContain && ratioMatches && img.naturalWidth > 500,
      withinViewport,
      isContain,
      ratioMatches,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), width: Math.round(rect.width), height: Math.round(rect.height) },
      viewport: { vw, vh },
      transform: style.transform,
      parentTransform: parentStyle.transform
    };
  });
  return result;
}

test.describe('ULTIMATE MASTER PROMPT V2 — Complete Visual & Functional Verification', () => {
  test('Landing Page 20/11 -> All 6 Slides -> 5 Curated Photo Scenes -> Final Full Poster Reveal', async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });
    page.on('requestfailed', req => {
      failedRequests.push(req.url());
    });

    await page.goto('/net-ve-tri-an-dntu-2026/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.reveal.ready', { timeout: 15000 });
    await page.waitForTimeout(1500);

    // =========================================================================
    // 1. VERIFY 20/11 GRAND OPENING LANDING PAGE & POSTER_FULLY_VISIBLE = TRUE
    // =========================================================================
    const landing = page.locator('#landing-page');
    await expect(landing).toBeVisible();
    await expect(landing).toContainText('NÉT VẼ TRI ÂN');
    await expect(landing).toContainText('CHÀO MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11');
    await expect(landing).toContainText('MỘT DÒNG CODE – VẠN CHÂN TRỜI');
    await expect(landing).toContainText('Có những bài học bắt đầu từ màn hình máy tính. Có những ước mơ bắt đầu từ một người thầy.');
    await expect(landing).toContainText('KHOA CÔNG NGHỆ THÔNG TIN – TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI');
    await expect(landing).toContainText('QUÁCH KHOA ĐỨC');
    await expect(landing.locator('#btn-enter-journey')).toContainText('KHÁM PHÁ HÀNH TRÌNH TRI ÂN');

    const landingPosterCheck = await verifyPosterFullyVisible(page, '#landing-full-poster-img');
    expect(landingPosterCheck.POSTER_FULLY_VISIBLE, JSON.stringify(landingPosterCheck)).toBe(true);

    await page.screenshot({ path: 'tests/screenshots/v2_00_landing_20_11.png' });

    // =========================================================================
    // 2. ENTER SLIDE 01 (01 / 06) FROM LANDING PAGE
    // =========================================================================
    await page.locator('#btn-enter-journey').click();
    await page.waitForTimeout(1200);

    await expect(page.locator('#hud-indicator')).toHaveText('01 / 06');
    const s1 = page.locator('section[data-slide-id="slide-1"]');
    await expect(s1).toContainText('NÉT VẼ TRI ÂN – MỘT DÒNG CODE, VẠN CHÂN TRỜI');
    await page.screenshot({ path: 'tests/screenshots/v2_01_slide1_khoi_nguon.png' });

    // =========================================================================
    // 3. SLIDE 02 — NGƯỜI THẦY & CÔ LIỆU (WARM IVORY THEME)
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(1));
    await page.waitForTimeout(1200);

    await expect(page.locator('#hud-indicator')).toHaveText('02 / 06');
    const s2 = page.locator('section[data-slide-id="slide-2"]');
    await expect(s2).toContainText('TỪ MỘT LỜI DÌU DẮT... ĐẾN NIỀM TIN ĐỂ BƯỚC ĐI.');
    await expect(s2).toContainText('Người thầy không chỉ trao kiến thức, mà còn trao cho sinh viên niềm tin vào chính mình.');
    await expect(s2).toContainText('cô Liệu');
    await page.screenshot({ path: 'tests/screenshots/v2_02_slide2_nguoi_thay.png' });

    // =========================================================================
    // 4. SLIDE 03 — CON THUYỀN TRI THỨC & HAI SINH VIÊN
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(2));
    await page.waitForTimeout(1200);

    await expect(page.locator('#hud-indicator')).toHaveText('03 / 06');
    const s3 = page.locator('section[data-slide-id="slide-3"]');
    await expect(s3).toContainText('TRI THỨC LÀ ĐIỂM KHỞI ĐẦU. KHÁT VỌNG LÀ HƯỚNG ĐI.');
    await expect(s3).toContainText('hai sinh viên một nam và một nữ');

    await s3.locator('.zone-tab-btn[data-slide3-zone="1"]').click();
    await page.waitForTimeout(500);
    await s3.locator('.zone-tab-btn[data-slide3-zone="0"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/v2_03_slide3_con_thuyen_sach.png' });

    // =========================================================================
    // 5. SLIDE 04 — NĂM TIÊU CHÍ SINH VIÊN 5 TỐT
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(3));
    await page.waitForTimeout(1200);

    await expect(page.locator('#hud-indicator')).toHaveText('04 / 06');
    const s4 = page.locator('section[data-slide-id="slide-4"]');
    await expect(s4.locator('.criteria-pillar-card')).toHaveCount(5);
    await expect(s4).toContainText('02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT');
    await page.screenshot({ path: 'tests/screenshots/v2_04_slide4_sinh_vien_5_tot.png' });

    // =========================================================================
    // 6. SLIDE 05 — 5-SCENE CURATED REAL PHOTO EXHIBITION
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(4));
    await page.waitForTimeout(1200);

    await expect(page.locator('#hud-indicator')).toHaveText('05 / 06');
    const s5 = page.locator('section[data-slide-id="slide-5"]');
    await expect(s5).toContainText('TỪ ƯỚC MƠ ĐẾN HÀNH TRÌNH THỰC TẾ');
    await expect(s5).toContainText('Điều em từng ngưỡng mộ đã trở thành động lực để em không ngừng cố gắng.');

    // Verify edit buttons are hidden in Presentation Mode
    await expect(s5.locator('.slot-replace-btn').first()).toBeHidden();

    // Capture Scene 1 (Ngày đầu)
    await page.screenshot({ path: 'tests/screenshots/v2_05_slide5_scene1_ngay_dau.png' });

    // Switch through Scenes 2, 3, 4, 5 and verify real images load
    for (let sc = 1; sc < 5; sc++) {
      await s5.locator(`[data-slide5-scene="${sc}"]`).click();
      await page.waitForTimeout(650);
      const heroW = await s5.locator('#s5-hero-img').evaluate(i => i.naturalWidth);
      expect(heroW, `Slide 5 Scene ${sc + 1} hero image failed to load`).toBeGreaterThan(500);
      if (sc === 3) {
        await page.screenshot({ path: 'tests/screenshots/v2_05_slide5_scene4_sv5tot.png' });
      }
      if (sc === 4) {
        await page.screenshot({ path: 'tests/screenshots/v2_05_slide5_scene5_20_11.png' });
      }
    }

    // =========================================================================
    // 7. SLIDE 06 — PART A (TRIBUTE + REAL PORTRAIT) & PART B (FULL POSTER FINALE)
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(5));
    await page.waitForTimeout(1200);

    await expect(page.locator('#hud-indicator')).toHaveText('06 / 06');
    const s6 = page.locator('section[data-slide-id="slide-6"]');
    await expect(s6).toContainText('CẢM ƠN THẦY CÔ');
    await expect(s6).toContainText('Vì đã trao cho chúng em những nét vẽ đầu tiên.');

    const portraitW = await s6.locator('.author-portrait-img').evaluate(i => i.naturalWidth);
    expect(portraitW).toBeGreaterThan(500);

    await page.screenshot({ path: 'tests/screenshots/v2_06a_slide6_tribute_portrait.png' });

    // Trigger Part B: FINAL FULL POSTER REVEAL
    await page.locator('#btn-trigger-finale').click();
    await page.waitForTimeout(1000);

    await expect(page.locator('#slide6-finale-view')).toBeVisible();
    await expect(page.locator('#slide6-finale-view')).toContainText('TRI THỨC TRAO ĐI,');
    await expect(page.locator('#slide6-finale-view')).toContainText('TƯƠNG LAI TIẾP NỐI.');

    const finalePosterCheck = await verifyPosterFullyVisible(page, '#finale-full-poster-img');
    expect(finalePosterCheck.POSTER_FULLY_VISIBLE, JSON.stringify(finalePosterCheck)).toBe(true);

    await page.screenshot({ path: 'tests/screenshots/v2_06b_slide6_finale_full_poster.png' });

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('Multi-Viewport Verification (1366x768 & 1440x900) — POSTER_FULLY_VISIBLE = TRUE', async ({ page }) => {
    for (const vp of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(vp);
      await page.goto('/net-ve-tri-an-dntu-2026/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.reveal.ready', { timeout: 15000 });
      await page.waitForTimeout(900);

      const checkLanding = await verifyPosterFullyVisible(page, '#landing-full-poster-img');
      expect(checkLanding.POSTER_FULLY_VISIBLE, `Landing @ ${vp.width}x${vp.height}: ${JSON.stringify(checkLanding)}`).toBe(true);
      await page.screenshot({ path: `tests/screenshots/v2_viewport_${vp.width}x${vp.height}_landing.png` });

      await page.locator('#btn-enter-journey').click();
      await page.waitForTimeout(700);
      await page.evaluate(() => {
        window.Reveal.slide(5);
        window.setSlide6Mode('finale');
      });
      await page.waitForTimeout(800);

      const checkFinale = await verifyPosterFullyVisible(page, '#finale-full-poster-img');
      expect(checkFinale.POSTER_FULLY_VISIBLE, `Finale @ ${vp.width}x${vp.height}: ${JSON.stringify(checkFinale)}`).toBe(true);
      await page.screenshot({ path: `tests/screenshots/v2_viewport_${vp.width}x${vp.height}_finale.png` });
    }
  });
});
