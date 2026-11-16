# VISUAL AUDIT REPORT V2 — NÉT VẼ TRI ÂN DNTU 2026

**Website kiểm toán:** `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`  
**Độ phân giải đã kiểm tra:** `1920×1080` (Full HD), `1440×900`, `1366×768` (Laptop), `768×1024` (Tablet), `390×844` (Mobile)  

---

## 1. Đánh giá tổng quan bản V1 (Điểm tốt cần giữ & Vấn đề cần khắc phục)

### A. Những điểm đã tốt cần giữ nguyên
- **Hạt nhân kỹ thuật ổn định:** Kiến trúc `Reveal.js + GSAP 3.15 + Three.js + Vite` hoạt động mượt, tải nhanh, không có lỗi Console hay lỗi đường dẫn tài nguyên trên GitHub Pages.
- **Bảo toàn tài sản gốc:** Poster gốc (`3000×5333`) và hai logo (`DNTU` & `Khoa CNTT`) được giữ đúng tỷ lệ, cụm huy hiệu nền kem ấm (`#F8F1E3`) giúp logo Khoa CNTT hiển thị rõ nét.
- **Kịch bản thuyết trình (Speaker Notes) & Đồng hồ bấm giờ:** Nội dung thuyết trình 6–8 phút bám sát câu chuyện thật, tự nhiên và giàu cảm xúc.

### B. Những vấn đề thị giác thực tế phát hiện từ Screenshots V1

1. **Thiếu màn hình mở đầu (Landing Page 20/11) độc lập:**
   - Khi mở trang web, người xem đi thẳng vào Slide 01 chứa nhiều chữ thuyết minh, làm giảm ấn tượng thị giác đầu tiên đối với bức poster nghệ thuật nhân Ngày Nhà giáo Việt Nam 20/11.
2. **Màu sắc toàn bộ 6 slide quá đồng nhất (nền tối suốt 6 slide):**
   - Cả 6 slide trong bản V1 đều dùng nền xanh đen đậm (`#091526` – `#19365F`) và các hộp viền tương tự nhau, tạo cảm giác hơi nặng và lặp lại cấu trúc `Title + Cards + Image`.
   - **Giải pháp V2:** Tạo nhịp điệu ánh sáng theo mạch cảm xúc — kết hợp **Nền sáng Kem ấm học thuật (`#F8F1E3` / `#F3E9D7`)** cho những phân cảnh ấm áp, gần gũi (Slide 02 — Người thầy, Slide 05 — Triển lãm ảnh thực tế) và **Nền Xanh Navy điện ảnh (`#13294B` / `#19365F`)** kết hợp ánh vàng champagne (`#F0CC85`) cho Landing Page, Slide 01, Slide 03, Slide 04 và Cảnh kết Full Poster ở Slide 06.
3. **Slide 01 & Slide 02 còn nhiều chữ giải thích dài:**
   - Slide 01 lặp lại nhiều thông tin sẽ có trên Landing Page.
   - Slide 02 có 3 hộp văn bản dày đặc khiến mắt người xem phải đọc nhiều thay vì cảm nhận hình tượng người giảng viên trong tà áo dài trắng, nét sáng khai mở dòng lệnh `1 print("Hello, DNTU")` và bó hoa tri ân.
4. **Slide 03 cần không gian hình ảnh lớn hơn:**
   - Các nút tab chuyển vùng và 3 hộp mô tả ở cột phải chiếm nhiều diện tích. Cần tinh gọn điều khiển để tôn vinh hình ảnh **hai sinh viên (nam và nữ) ngồi trên con thuyền sách**, cầu thang sách với bàn tay nâng đỡ nhau, và chiếc laptop `def future()` cùng biểu tượng AI.
5. **Slide 04 cần trang trọng hơn, loại bỏ nút bắn pháo hoa ăn mừng:**
   - 5 thẻ tiêu chí trong V1 xếp ngang giống bảng thông số (dashboard), và nút bắn confetti chưa thật sự phù hợp với tông giọng biết ơn, khiêm nhường.
   - **Giải pháp V2:** Thiết kế 5 tiêu chí thành một hành trình kết nối bằng đường dẫn sáng nghệ thuật từ sự ngưỡng mộ các anh chị khóa trước đến dấu mốc **“02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT”**, bỏ hiệu ứng pháo hoa confetti.
6. **Slide 05 trong V1 dùng lưới 6 ô bằng nhau với ảnh placeholder và hiện nút chỉnh sửa:**
   - Lưới 6 khung bằng nhau làm các ảnh thành tích bị nhỏ như thumbnail thương mại; đồng thời các nút “Thay ảnh” / “Khôi phục khung” hiển thị trực tiếp trên màn hình trình chiếu trước Ban Giám khảo.
   - **Giải pháp V2:** Sử dụng bộ ảnh thật tuyển chọn từ thư mục `anhchoslide5va6`, thiết kế thành **Không gian Triển lãm Ảnh 5 Cảnh (5-Scene Cinematic Photo Exhibition)** gồm 1 ảnh Hero lớn + các ảnh phụ bất đối xứng cân đối, và ẩn toàn bộ công cụ chỉnh sửa khi ở **Presentation Mode**.
7. **Slide 06 trong V1 thiếu khoảnh khắc kết thúc bằng TOÀN BỘ POSTER GỐC:**
   - Bản V1 chỉ hiển thị một dải crop nhỏ chứa hai câu thơ ở góc dưới phải (`crop-poem.jpg`) và khung chân dung placeholder.
   - **Giải pháp V2:** Đưa ảnh chân dung thật của tác giả **Quách Khoa Đức** (`IMG_5524.JPG`) vào Phần A (Lời tri ân), và xây dựng **Phần B — FINAL FULL POSTER REVEAL (`POSTER_FULLY_VISIBLE = TRUE`)**: toàn bộ bức poster gốc hiện lên nguyên vẹn 100% ở trung tâm bằng `object-fit: contain`, reset mọi phép zoom/crop về trạng thái nghỉ hoàn hảo (**Final Hold State**) cùng thông điệp **“TRI THỨC TRAO ĐI, TƯƠNG LAI TIẾP NỐI.”**
