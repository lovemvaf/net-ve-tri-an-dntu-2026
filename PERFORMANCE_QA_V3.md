# PERFORMANCE & QA REPORT V3 — PLAYWRIGHT AUTOMATED VERIFICATION

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Công cụ kiểm thử:** Playwright Chromium Headless (`tests/preflight.spec.js` & `tests/slides_cinematic.spec.js`) + Live Production Script (`scripts/verify_live_pages.mjs`)

---

## 1. KẾT QUẢ 7 BỘ KIỂM THỬ BẮT BUỘC (SECTION IX)

| Mã Test | Hạng mục kiểm thử | Kịch bản thực thi tự động | Kết quả |
|---|---|---|---|
| **Test 1** | **Landing to Finale Full Step-by-Step Walk** | Đi từng bước một (`#hud-next`) từ `MỞ ĐẦU 20/11 · BƯỚC 01 / 06` qua toàn bộ **34 bước tuần tự** của Landing và 6 Slide đến `SLIDE 06 / 06 · BƯỚC 05 / 05`. Không có mục con nào bị bỏ qua. | **PASS (100%)** |
| **Test 2** | **Reverse Step-by-Step Navigation** | Từ bước cuối cùng của Slide 06 (`slideIndex: 5, stepIndex: 4`), bấm `ArrowLeft` 33 lần lùi qua từng bước con của Slide 06 → 05 → 04 → 03 → 02 → 01 → Landing Bước 01 theo đúng thứ tự ngược lại. | **PASS (100%)** |
| **Test 3** | **Input Consistency & Speaker Notes Sync** | Kiểm tra đồng nhất giữa nút `Tiếp ›` / `‹ Trước`, phím `Space`, `ArrowRight`, `ArrowLeft`, `PageDown`, `PageUp`, `Enter` và đồng bộ tức thời với bảng Lời thuyết trình (`Phím N`). | **PASS (100%)** |
| **Test 4** | **Rapid Input / Spam Click Protection** | Bắn liên tiếp 15 sự kiện chuyển bước trong 150ms; xác minh `killActiveTimeline()` và khóa `isTransitioning` giữ bố cục ổn định, không phát sinh lỗi console hay kẹt trạng thái. | **PASS (100%)** |
| **Test 5** | **Motion Quality & `POSTER_FULLY_VISIBLE`** | Xác minh `POSTER_FULLY_VISIBLE = TRUE` (`object-fit: contain`, không cắt xén, 100% nằm gọn trong viewport) trên cả Landing Page và Slide 06 Finale; kiểm tra 0 console error, 0 request lỗi. | **PASS (`POSTER_FULLY_VISIBLE = TRUE`)** |
| **Test 6** | **Multi-Resolution Verification** | Kiểm thử tự động trên 5 độ phân giải: `1920×1080` (Full HD), `1600×900`, `1440×900`, `1366×768` (Laptop phổ thông) và `768×1024` (Tablet/Mobile). | **PASS (5/5 Viewports)** |
| **Test 7** | **Live Production Verification** | Kiểm thử trực tiếp trên URL công khai `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`. | **PASS (HTTP 200 OK)** |

---

## 2. TỐI ƯU HÓA HIỆU NĂNG & TÀI NGUYÊN (PERFORMANCE METRICS)

- **Thời gian build Production (`vite build`):** `~360 ms`.
- **Preload hình ảnh Slide 05 & Slide 06:** Toàn bộ 14 ảnh thật đã biên tập trong `public/assets/curated/` được khởi tạo bộ đệm `new Image()` ngay sau khi tải trang, giúp chuyển đổi giữa 5 cảnh trên Slide 05 diễn ra tức thì (0ms trễ mạng).
- **Bảo toàn 100% tài nguyên gốc:**
  - `Quách Khoa Đức _ Nét vẽ tri ân.png` (`3000×5333`)
  - `2.Khoacongnghethongtin (1).png` (`23622×18711`)
  - `logodntubig (1).png` (`2480×3508`)
  - Thư mục `anhchoslide5va6/` (269 tệp gốc được bảo toàn nguyên trạng và cấu hình `.gitignore` để giữ kho lưu trữ Git gọn nhẹ).
