# TEACHER TRIBUTE FINALE V4 — SLIDE 06 GRAND EMOTIONAL REDESIGN

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Định hướng nghệ thuật:** *Thầy cô và tác phẩm tri ân là trung tâm — Không dùng ảnh cá nhân lớn ở màn kết*

---

## 1. LOẠI BỎ ẢNH CHÂN DUNG CÁ NHÂN — ĐẶT NGƯỜI THẦY LÀM TRUNG TÂM

Trong bản V4, khung ảnh chân dung studio cá nhân ở phía phải Slide 06 đã được **loại bỏ hoàn toàn**. Thay vào đó, khu vực thị giác chính của Slide 06 (`#slide6-teacher-visual-stage`) là một **Bố cục Tôn vinh Người thầy 3 khung (Triple Teacher Tribute Composition)** kết hợp giữa nghệ thuật hội họa gốc và khoảnh khắc tri ân thực tế:

1. **Khung Nghệ thuật Chính (Bên trái):** Hình tượng người giảng viên trong tà áo dài trắng cầm bó hoa tri ân trên bục giảng và khai mở dòng lệnh `1 print("Hello, DNTU")` từ bức poster nguyên bản (`./assets/optimized/crop-teacher.jpg`).
2. **Khung Nhiếp ảnh Thực tế 1 (Góc trên bên phải):** Khoảnh khắc thật đầy xúc động khi **Cô Liệu trong tà áo dài ôm bó hoa 20/11 bên cạnh Quách Khoa Đức và tập thể sinh viên ngay tại lớp học DNTU** (`./assets/curated/curated-16-co-lieu-20-11-flowers.jpg`).
3. **Khung Nhiếp ảnh Thực tế 2 (Góc dưới bên phải):** Hình ảnh **Cô Liệu trong tà áo dài cầm cành hoa hồng 20/11 trước biểu trưng TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI — AIBOT CENTER** (`./assets/curated/curated-18-co-lieu-aibot-rose.jpg`).

---

## 2. KỊCH BẢN 6 BƯỚC LIỀN MẠCH CỦA SLIDE 06 (TỰ ĐỘNG MỞ POSTER BẰNG NÚT `TIẾP ›`)

Người thuyết trình **không cần bấm bất kỳ nút riêng nào** để mở toàn cảnh poster. Mọi chuyển đổi diễn ra tuần tự qua 6 bước khi bấm `Tiếp ›` (`→`, `Space`, `PageDown`):

- **Bước 01 / 06 (`stepIndex: 0` — Cảnh A: Tri ân):** Hiển thị tiêu đề lớn **“CẢM ƠN THẦY CÔ”**, thông điệp *“Vì đã trao cho chúng em những nét vẽ đầu tiên.”* và cụm 3 khung hình tôn vinh người thầy.
- **Bước 02 / 06 (`stepIndex: 1` — Cảnh B: Lời cảm ơn gửi Cô Liệu, Khoa CNTT & DNTU):** Lần lượt thắp sáng 3 lời tri ân sâu sắc gửi tới **Cô Liệu**, **Quý thầy cô Khoa Công nghệ thông tin**, và **Mái trường Đại học Công nghệ Đồng Nai**, cùng câu kết *“Bởi món quà ý nghĩa nhất mà người học trò có thể dành tặng thầy cô không chỉ là thành tích hôm nay, mà còn là cách mình sống và cống hiến trong những ngày mai.”*
- **Bước 03 / 06 (`stepIndex: 2` — Cảnh B/C: Trao hoa 20/11):** Hoạt ảnh nghệ thuật **Những đóa hoa tri ân 20/11** (`#slide6-floral-tribute`): nét sáng vàng và dải ruy băng đỏ kết nối những đóa hoa nở rộ như món quà dâng tặng thầy cô.
- **Bước 04 / 06 (`stepIndex: 3` — Cảnh C/D: Tri thức tiếp nối):** Dải ánh sáng vàng ấm (`#slide6-light-bridge`) lan tỏa từ hình tượng người thầy qua quyển sách, con thuyền và bậc thang, chuẩn bị mở khung triển lãm trung tâm.
- **Bước 05 / 06 (`stepIndex: 4` — Cảnh E: Toàn bộ Poster nguyên bản được hé lộ):** Màn hình tự động chuyển sang không gian triển lãm trung tâm (`#slide6-finale-view`), hiển thị **100% bức poster nguyên bản không cắt xén** (`object-fit: contain`, `POSTER_FULLY_VISIBLE = TRUE`) từ dòng chữ *“NÉT VẼ TRI ÂN”* trên cùng tới hai câu thơ cuối.
- **Bước 06 / 06 (`stepIndex: 5` — Cảnh F: Final Hold):** Giữ nguyên toàn bộ poster ở trung tâm và làm sáng bảng thông điệp kết tinh trang trọng:
  - **TRI THỨC TRAO ĐI, TƯƠNG LAI TIẾP NỐI.**
  - **CẢM ƠN QUÝ THẦY CÔ – CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11.**
