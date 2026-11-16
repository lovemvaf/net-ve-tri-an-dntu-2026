# VISUAL QA & PERFORMANCE REPORT V5

**Thư mục ảnh chụp kiểm thử V5:** `test-results/v5-screenshots/` (`v5-01-landing.png` .. `v5-13-slide6-finale.png`)  
**Độ phân giải kiểm thử:** `1920×1080`, `1600×900`, `1440×900`, `1366×768`, `768×1024`

---

## 1. KẾT QUẢ KIỂM THỬ TRỰC QUAN 13 TRẠNG THÁI (12 LẦN BẤM)

1. **`v5-01-landing.png` (Landing 20/11):** Toàn bộ bố cục mở đầu (Logo DNTU & Khoa CNTT, quốc hiệu 20/11, bó hoa *“Những đóa hoa của tri thức”*, poster nguyên bản ở trung tâm `POSTER_FULLY_VISIBLE = TRUE` và thông điệp dẫn chuyện) tự động hiển thị đầy đủ ngay khi mở trang, không cần bấm 5 bước phụ.
2. **`v5-02-slide1.png` (Slide 01 — Khởi nguồn):** Hiển thị trọn vẹn tiêu đề, dòng lệnh `1 print("Hello, DNTU")`, 4 chương hành trình, hai câu thơ chủ đạo và poster nguyên bản trong 1 trạng thái duy nhất.
3. **`v5-03-slide2.png` (Slide 02 — Người thầy):** Nền kem ấm (`Warm Ivory`) tôn vinh hình tượng người giảng viên áo dài trắng, nét sáng khai mở, câu chuyện về sự dìu dắt của cô Liệu và đóa hoa tri ân 20/11.
4. **`v5-04-slide3-scene1.png` .. `v5-07-slide3-scene4.png` (Slide 03 — 4 Cảnh khám phá Poster):** Khung Master Art Canvas lớn bên trái kết hợp ống kính cận cảnh và thẻ tiêu điểm động bên phải giúp hình ảnh hai sinh viên trên con thuyền sách, cầu thang tri thức và laptop AI hiện lên rõ nét, dễ đọc từ xa.
5. **`v5-08-slide4.png` (Slide 04 — Sinh viên 5 tốt):** Cả 5 tiêu chí (*Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt, Hội nhập tốt*) cùng câu chuyện ngưỡng mộ đàn anh đi trước và dấu mốc *“02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT”* hiện lên đầy đủ trong 1 lần nhìn.
6. **`v5-09-slide5-stage1.png` .. `v5-11-slide5-stage3.png` (Slide 05 — 3 Chặng Bento Gallery 4 ảnh/chặng):**
   - Mỗi chặng hiển thị đồng thời **1 ảnh Hero lớn bên trái + 3 ảnh bổ trợ bên phải** (tổng cộng 12 ảnh thật qua 3 chặng), giữ trọn vẹn mọi bức ảnh chụp cùng cô Liệu, quý thầy cô Khoa CNTT và các hoạt động học thuật, tình nguyện, Sinh viên 5 tốt.
7. **`v5-12-slide6-tribute.png` & `v5-13-slide6-finale.png` (Slide 06 — 2 Trạng thái):**
   - Trạng thái 1 (`v5-12-slide6-tribute.png`): Tự động hiển thị đầy đủ lời cảm ơn thầy cô, bó hoa 20/11 và 3 khung hình tôn vinh người thầy (poster gốc + ảnh thật trao hoa 20/11 tặng cô Liệu tại phòng học và AIBOT Center).
   - Trạng thái 2 (`v5-13-slide6-finale.png`): Bấm `Tiếp ›` 1 lần chuyển thẳng sang toàn bộ poster nguyên bản (`object-fit: contain`, `POSTER_FULLY_VISIBLE = TRUE`) và tự động giữ ổn định ở Final Hold.

---

## 2. KẾT QUẢ ĐO LƯỜNG HIỆU NĂNG & KIỂM THỬ TỰ ĐỘNG

- **Playwright E2E Suite (`8/8 passed`):**
  - Xác nhận chính xác **12 lần bấm `Tiếp ›`** đi qua 13 trạng thái từ Landing tới Finale.
  - Xác nhận chính xác **12 lần bấm `‹ Trước`** lùi từ Finale về Landing không bỏ sót trạng thái nào.
  - Đo tốc độ khung hình thực tế (`requestAnimationFrame` benchmark): đạt `60 FPS` ổn định trên Chromium Headless.
  - Kiểm tra trên trang Production GitHub Pages: `HTTP 200 OK`, `0` lỗi Console, `0` lỗi tải tài nguyên.
