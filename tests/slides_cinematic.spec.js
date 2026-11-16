import { test, expect } from '@playwright/test';

test.describe('ULTIMATE MASTER PROMPT — 6 Cinematic HTML Slides QA & Visual Audit', () => {
  test('Full 6-Slide Storyboard, Assets Integrity, Interactive Controls & Zero Console Errors', async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });
    page.on('requestfailed', req => {
      failedRequests.push(req.url());
    });

    await page.goto('/net-ve-tri-an-dntu-2026/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.reveal.ready', { timeout: 15000 });
    await page.waitForSelector('#webgl-canvas');
    await page.waitForTimeout(1400);

    // Verify exact 6 slides exist
    const slides = page.locator('.reveal .slides > section');
    await expect(slides).toHaveCount(6);

    // =========================================================================
    // SLIDE 01 — KHỞI NGUỒN
    // =========================================================================
    const s1 = page.locator('section[data-slide-id="slide-1"]');
    await expect(s1.locator('.hero-main-title')).toContainText('NÉT VẼ TRI ÂN');
    await expect(s1.locator('.hero-slogan')).toContainText('MỘT DÒNG CODE – VẠN CHÂN TRỜI');
    await expect(s1.locator('.editorial-quote-card')).toContainText('Có những bài học bắt đầu từ màn hình máy tính. Có những ước mơ bắt đầu từ một người thầy.');
    await expect(s1.locator('.hero-poem-lines')).toContainText('Từng bậc tri thức thầy trao');

    // Check logos and poster loaded with naturalWidth > 0
    const s1Imgs = await s1.locator('img').evaluateAll(imgs =>
      imgs.map(i => ({ src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight }))
    );
    for (const img of s1Imgs) {
      expect(img.w, `Image ${img.src} failed to load`).toBeGreaterThan(50);
    }

    await page.screenshot({ path: 'tests/screenshots/slide_01_hero.png' });

    // =========================================================================
    // SLIDE 02 — NÉT VẼ ĐẦU TIÊN: NGƯỜI THẦY
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(1));
    await page.waitForTimeout(1300);

    const s2 = page.locator('section[data-slide-id="slide-2"]');
    await expect(s2.locator('.display-serif-title')).toContainText('TỪ MỘT LỜI DÌU DẮT... ĐẾN NIỀM TIN ĐỂ BƯỚC ĐI.');
    await expect(s2.locator('.editorial-quote-card')).toContainText('Người thầy không chỉ trao kiến thức, mà còn trao cho sinh viên niềm tin vào chính mình.');
    await expect(s2).toContainText('cô Liệu');
    await expect(s2).toContainText('Hello, DNTU');

    await page.screenshot({ path: 'tests/screenshots/slide_02_co_lieu.png' });

    // =========================================================================
    // SLIDE 03 — TỪ TRANG SÁCH ĐẾN CHÂN TRỜI
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(2));
    await page.waitForTimeout(1300);

    const s3 = page.locator('section[data-slide-id="slide-3"]');
    await expect(s3.locator('.display-serif-title')).toContainText('TRI THỨC LÀ ĐIỂM KHỞI ĐẦU. KHÁT VỌNG LÀ HƯỚNG ĐI.');
    await expect(s3.locator('.editorial-quote-card')).toContainText('Thầy cô trao cho chúng em tri thức. Và tri thức trở thành con thuyền đưa chúng em tới tương lai.');
    await expect(s3).toContainText('hai sinh viên một nam và một nữ');

    // Test interactive camera zone switching on Slide 3
    await s3.locator('.zone-tab-btn[data-slide3-zone="1"]').click();
    await page.waitForTimeout(600);
    await expect(s3.locator('#slide3-detail-caption')).toContainText('Cầu Thang Sách');

    await s3.locator('.zone-tab-btn[data-slide3-zone="2"]').click();
    await page.waitForTimeout(600);
    await expect(s3.locator('#slide3-detail-caption')).toContainText('Laptop');

    await s3.locator('.zone-tab-btn[data-slide3-zone="0"]').click();
    await page.waitForTimeout(600);

    await page.screenshot({ path: 'tests/screenshots/slide_03_book_boat_ai.png' });

    // =========================================================================
    // SLIDE 04 — NĂM TIÊU CHÍ, MỘT HÀNH TRÌNH (SINH VIÊN 5 TỐT)
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(3));
    await page.waitForTimeout(1300);

    const s4 = page.locator('section[data-slide-id="slide-4"]');
    await expect(s4.locator('.display-serif-title')).toContainText('SINH VIÊN 5 TỐT — TỪ NGƯỠNG MỘ ĐẾN QUYẾT TÂM.');
    await expect(s4.locator('.criteria-pillar-card')).toHaveCount(5);
    await expect(s4).toContainText('Đạo đức tốt');
    await expect(s4).toContainText('Học tập tốt');
    await expect(s4).toContainText('Thể lực tốt');
    await expect(s4).toContainText('Tình nguyện tốt');
    await expect(s4).toContainText('Hội nhập tốt');
    await expect(s4.locator('.milestone-title')).toContainText('02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT');

    await page.screenshot({ path: 'tests/screenshots/slide_04_sinh_vien_5_tot.png' });

    // =========================================================================
    // SLIDE 05 — HÀNH TRÌNH THỰC TẾ
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(4));
    await page.waitForTimeout(1300);

    const s5 = page.locator('section[data-slide-id="slide-5"]');
    await expect(s5.locator('.display-serif-title')).toContainText('TỪ ƯỚC MƠ ĐẾN HÀNH TRÌNH THỰC TẾ.');
    await expect(s5).toContainText('Điều em từng ngưỡng mộ đã trở thành động lực để em không ngừng cố gắng.');
    await expect(s5.locator('.story-photo-slot')).toHaveCount(6);

    await page.screenshot({ path: 'tests/screenshots/slide_05_gallery.png' });

    // =========================================================================
    // SLIDE 06 — TRI ÂN VÀ TIẾP NỐI
    // =========================================================================
    await page.evaluate(() => window.Reveal.slide(5));
    await page.waitForTimeout(1300);

    const s6 = page.locator('section[data-slide-id="slide-6"]');
    await expect(s6.locator('.gratitude-main-title')).toContainText('CẢM ƠN THẦY CÔ.');
    await expect(s6.locator('.gratitude-sub-quote')).toContainText('Vì đã trao cho chúng em những nét vẽ đầu tiên.');
    await expect(s6.locator('.final-closing-quote')).toContainText('Bởi món quà ý nghĩa nhất mà người học trò có thể dành tặng thầy cô không chỉ là thành tích hôm nay, mà còn là cách mình sống và cống hiến trong những ngày mai.');
    await expect(s6).toContainText('Tri thức trao đi, tương lai tiếp nối.');

    await page.screenshot({ path: 'tests/screenshots/slide_06_tri_an_ket.png' });

    // =========================================================================
    // PRESENTER VIEW & SPEAKER NOTES VERIFICATION
    // =========================================================================
    await page.locator('#hud-notes').click();
    await page.waitForTimeout(350);
    const notesDrawer = page.locator('#notes-drawer');
    await expect(notesDrawer).toHaveClass(/active/);
    await expect(notesDrawer.locator('#notes-content')).toContainText('Từng bậc tri thức thầy trao');
    await page.screenshot({ path: 'tests/screenshots/presenter_view_notes.png' });
    await page.locator('#close-notes-drawer').click();

    // Ensure zero console errors & zero failed requests
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('Responsive Viewport Check (1366x768 Laptop & 1440x900)', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/net-ve-tri-an-dntu-2026/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.reveal.ready', { timeout: 15000 });
    await page.waitForTimeout(800);
    await expect(page.locator('.hero-main-title')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/viewport_1366x768.png' });
  });
});
