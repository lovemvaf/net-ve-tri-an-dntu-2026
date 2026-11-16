# FINAL PRESENTATION OPTIMIZATION REPORT V5

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Tác giả & Người trình bày:** Quách Khoa Đức — Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)  
**Website công khai:** `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`

---

## 1. TỔNG QUAN NÂNG CẤP TỐI ƯU HÓA V5 (FEWER CLICKS · CLEANER DESIGN · SMARTER ANIMATION)

Phiên bản V5 thực hiện bước chuyển hóa quan trọng từ cơ chế bấm từng chi tiết nhỏ sang **trải nghiệm trình chiếu chuyên nghiệp, tinh gọn và giàu cảm xúc**:

1. **Giảm số lần bấm `Tiếp ›` từ 33 lần xuống đúng 12 lần bấm (13 trạng thái nội dung có ý nghĩa):**
   - Loại bỏ toàn bộ các cú bấm vụn vặt chỉ để hiện tiêu đề, từng dòng chữ, từng tiêu chí hay từng cánh hoa.
   - Mỗi lần bấm `Tiếp ›` (`ArrowRight`, `Space`, `PageDown`) giờ đây chỉ thực hiện **một bước chuyển nội dung thực sự có ý nghĩa**: sang slide tiếp theo, sang một góc nhìn mới trên poster (Slide 03), sang một chặng câu chuyện ảnh thật mới (Slide 05), hoặc chuyển từ Lời tri ân sang Toàn bộ Poster kết (Slide 06).
2. **Tự động hóa hoạt ảnh thông minh bằng GSAP Timeline (`0.5s – 0.85s`):**
   - **Landing Page (1 trạng thái):** Tự động chạy intro ngắn hiển thị đầy đủ Logo DNTU & Khoa CNTT, chào mừng 20/11, bó hoa tri ân, toàn bộ poster nguyên bản và thông điệp dẫn chuyện ngay khi mở trang. Chỉ cần bấm `Tiếp ›` **1 lần** để vào Slide 01.
   - **Slide 01 & Slide 02 (1 trạng thái mỗi slide):** Tự động xuất hiện đầy đủ mạch truyện 4 chương, hình tượng người giảng viên, dòng code `1 print("Hello, DNTU")`, ký ức về sự dìu dắt của cô Liệu và huy hiệu hoa 20/11.
   - **Slide 04 (1 trạng thái):** Tự động thắp sáng cả **5 tiêu chí Sinh viên 5 tốt** (*Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt, Hội nhập tốt*), câu chuyện ngưỡng mộ các anh chị đi trước và dấu mốc *“02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT”* trong một lần nhìn.
   - **Slide 05 (Gom 5 cảnh thành 3 chặng Bento Gallery 4 ảnh/chặng):** Giữ nguyên toàn bộ **12 bức ảnh thật quý giá** (cô Liệu trên giảng đường, tập thể thầy cô Khoa CNTT tại DNTU Creative Fest, trao hoa 20/11 tặng cô Liệu, cô Liệu tại AIBOT Center, nghiên cứu EdTech, ASEAN AI+ Hackathon, Tiếp sức mùa thi, Sinh viên 5 tốt...) nhưng trình bày trong **3 chặng cô đọng**: *Chặng 1: Khởi đầu & Được dìu dắt*, *Chặng 2: Nỗ lực & Trưởng thành*, *Chặng 3: Thành quả & Biết ơn*.
   - **Slide 06 (2 trạng thái):** Trạng thái 1 tự động hiển thị đầy đủ lời tri ân thầy cô, bó hoa 20/11 và cụm hình ảnh tôn vinh người thầy; bấm `Tiếp ›` **1 lần** chuyển thẳng sang Trạng thái 2 hiển thị trọn vẹn toàn bộ poster nguyên bản (`object-fit: contain`) và tự động giữ ổn định ở Final Hold.
3. **Tối giản hóa thanh điều khiển HUD & làm sạch giao diện:**
   - Thanh HUD chính chỉ giữ `‹ Trước`, chỉ báo slide hiện tại (`MỞ ĐẦU 20/11`, `01 / 06`, `03 / 06 · CẢNH 01 / 04`...) và `Tiếp ›`.
   - Các công cụ phụ trợ (`Phát lại`, `Lời thuyết trình`, `Tổng quan`, `Toàn màn hình`, `Lite Mode`, `Phím tắt`) được gom gọn vào nút menu `⋯` (`#hud-tools-toggle`) để không gây phân tâm cho Ban Giám khảo.
   - Xóa bỏ toàn bộ dòng hướng dẫn phím tắt lặp lại ở chân slide và nút chuyển tiếp dư thừa.
