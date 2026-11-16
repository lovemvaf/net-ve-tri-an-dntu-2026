# SCREENSHOT & VISUAL QA REPORT V4 — MULTI-RESOLUTION VERIFICATION

**Thư mục lưu trữ ảnh chụp kiểm thử V4:** `test-results/v4-screenshots/`  
**Công cụ kiểm thử:** Playwright Headless Chromium (`tests/slides_cinematic.spec.js`)

---

## 1. DANH SÁCH ẢNH CHỤP KIỂM TRA BỐ CỤC & THỊ GIÁC V4

1. `v4-01-landing-complete.png` (`1920×1080`): Trang mở đầu 20/11 ở Bước 05/05 — hiển thị trọn vẹn nét bút vàng, bó hoa *“Những đóa hoa của tri thức”*, poster nguyên bản ở giữa (`POSTER_FULLY_VISIBLE = TRUE`) và thông điệp dẫn chuyện.
2. `v4-02-slide1-complete.png` (`1920×1080`): Slide 01 ở Bước 03/03 — dòng code `1 print("Hello, DNTU")`, 4 chương hành trình và hai câu thơ chủ đạo.
3. `v4-03-slide2-complete.png` (`1920×1080`): Slide 02 trên nền kem ấm (`Warm Ivory`) — hình tượng người giảng viên áo dài trắng, câu chuyện về sự dìu dắt của cô Liệu và huy hiệu hoa 20/11.
4. `v4-04-slide3-scene1.png` & `v4-04-slide3-scene4.png` (`1920×1080`): Slide 03 với bố cục mới **Single Master Art Canvas + Focal Lens Inset** và thẻ tiêu điểm động (`Active Scene Spotlight`) bên phải.
5. `v4-05-slide4-complete.png` (`1920×1080`): Slide 04 ở Bước 07/07 — 5 cột mốc tiêu chí *Sinh viên 5 tốt* được nối liền bằng đường sáng vàng và thanh vinh danh 2 năm liên tiếp.
6. `v4-06-slide5-scene1.png`, `v4-06-slide5-scene2.png` & `v4-06-slide5-scene5.png` (`1920×1080`): Slide 05 với bố cục mới cao `575px` (xóa hoàn toàn khoảng trắng thừa phía trên) và bộ ảnh thật chụp cùng **Cô Liệu & Quý thầy cô Khoa CNTT – DNTU**.
7. `v4-07-slide6-teacher-tribute.png` (`1920×1080`): Slide 06 ở Bước 04/06 — bố cục tôn vinh Người thầy (hình tượng giảng viên từ poster gốc + ảnh thật trao hoa tri ân cô Liệu tại giảng đường và AIBOT Center), hoàn toàn không còn ảnh chân dung cá nhân lớn.
8. `v4-08-slide6-finale-hold.png` (`1920×1080`): Slide 06 ở Bước 06/06 (`Final Hold`) — toàn bộ poster nguyên bản hiển thị trọn vẹn 100% cùng thông điệp *“TRI THỨC TRAO ĐI, TƯƠNG LAI TIẾP NỐI. · CẢM ƠN QUÝ THẦY CÔ – CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11.”*
9. `v4-09-1366x768-landing.png` & `v4-10-1366x768-finale.png` (`1366×768`): Xác minh khả năng hiển thị trên màn hình laptop phổ thông `1366×768` không bị tràn chữ hay cắt poster.

---

## 2. KẾT QUẢ ĐÁNH GIÁ CHẤT LƯỢNG THỊ GIÁC & HIỆU NĂNG

- **Không tràn chữ / Không chồng lấp:** 100% các khung chữ và hình ảnh nằm gọn trong vùng an toàn của từng slide ở cả 5 độ phân giải (`1920×1080`, `1600×900`, `1440×900`, `1366×768`, `768×1024`).
- **Không cắt mặt người:** Tất cả ảnh thật của cô Liệu, quý thầy cô Khoa CNTT và sinh viên đều được căn chỉnh `object-position: center 20%` để hiển thị rõ nét gương mặt và nụ cười.
- **Tốc độ phản hồi chuyển bước:** Nhờ cơ chế preload toàn bộ ảnh của Slide 03, Slide 05 và Slide 06 ngay khi khởi tạo, thao tác chuyển cảnh diễn ra mượt mà, không giật hình hay chớp trắng.
