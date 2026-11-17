# ANIMATION PERFORMANCE & QA REPORT V6 — NÉT VẼ TRI ÂN DNTU 2026

## 1. Mục Tiêu Kiểm Thử Hiệu Năng & Điều Hướng

Phiên bản V6 bổ sung **Bầu Trời Sống Động (`#living-sky-layer` + `Three.js WebGL`)**, **7 Đại Cảnh Chuyển Tiếp Liên Slide (`#scene-transition-overlay`)** và thay thế ảnh thật trên **Slide 05 – Chặng 01 (`curated-20-clb-cntt-dntu-project.jpg`)** trong khi giữ nguyên cấu trúc **13 trạng thái (12 lần bấm Tiếp)**.

## 2. Kết Quả Kiểm Thử Автоматическое (Playwright Chromium — 8/8 PASS)

| Bài kiểm thử | Nội dung kiểm chứng | Kết quả |
| :--- | :--- | :--- |
| **Test 1 & Test 5** | Đi qua toàn bộ 13 trạng thái từ Landing 20/11 đến Cảnh kết Toàn bộ Poster đúng **12 lần bấm Tiếp**, kiểm tra 7 hiệu ứng chuyển cảnh (`floral-light-gateway`, `the-first-light`, `book-of-knowledge`, `stairway-to-tomorrow`, `memories-in-motion`, `bouquet-of-gratitude`, `grand-tribute-reveal`), kiểm tra `#living-sky-layer` (đàn chim xa/gần, dải sáng bình minh, cánh hoa 20/11), xác minh ảnh mới `curated-20-clb-cntt-dntu-project.jpg` tại Slide 05 Chặng 01 và xác minh `POSTER_FULLY_VISIBLE = TRUE` | **PASS** |
| **Test 2** | Điều hướng lùi từ Cảnh kết Toàn bộ Poster về Landing 20/11 bằng phím `ArrowLeft` đúng **12 lần bấm** | **PASS** |
| **Test 3** | Đồng bộ tất cả phương thức điều khiển (`Space`, `PageDown`, `PageUp`, menu công cụ `⋯`, Lời thuyết trình `N`, phóng to ảnh Lightbox và đóng bằng `ESC`) | **PASS** |
| **Test 4** | Kiểm thử bấm nhanh liên tiếp (`15 lần bấm ArrowRight` liên tục) không làm kẹt hay lệch trạng thái; đo tốc độ khung hình đạt **60 FPS** (`>= 30 FPS`) với `0` lỗi Console / PageError | **PASS** |
| **Test 6** | Kiểm thử đa độ phân giải (`1920×1080`, `1600×900`, `1440×900`, `1366×768`, `768×1024`) đảm bảo không tràn khung, không cắt poster (`object-fit: contain`) | **PASS** |
| **Preflight 1–3** | Kiểm tra bảo toàn 3 ảnh gốc, các ảnh tối ưu hóa, 32 repository nghiên cứu tại `.research/repos/` và tài liệu kiến trúc | **PASS** |

## 3. Các Giải Pháp Tối Ưu Hóa GPU & 60 FPS

1. **Không sử dụng `backdrop-filter: blur()` toàn màn hình** đè lên `<canvas id="webgl-canvas">`, giúp GPU duy trì tốc độ khung hình ổn định **60 FPS** ngay cả trên trình duyệt Headless Chromium và máy tính phổ thông.
2. **Giới hạn hạt sáng thông minh (`175 hạt` trên máy tiêu chuẩn, `95 hạt` trên thiết bị cấu hình thấp)** kết hợp `pixelRatio = 1` và `powerPreference: 'high-performance'`.
3. **Đặt toàn bộ cánh chim bay và cánh hoa 20/11 ở vùng trời cao (`y = 16px..36px`) và rìa ngoài (`x < 65px` hoặc `x > 1850px`)** với `pointer-events: none`, vừa tạo chiều sâu điện ảnh vừa đảm bảo **0% chồng lấn lên chữ, khuôn mặt thầy cô, logo và poster**.
4. **Chuyển cảnh không chặn thao tác (Non-blocking Interruptible Transitions):** Nếu người thuyết trình bấm nhanh liên tiếp, timeline chuyển cảnh trước đó tự động hủy (`transitionTimeline.kill()`) và cập nhật ngay sang trạng thái mới.
