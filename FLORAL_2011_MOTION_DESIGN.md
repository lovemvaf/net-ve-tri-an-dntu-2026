# FLORAL 20/11 MOTION DESIGN — NGHỆ THUẬT HOA TRI ÂN & NÉT SÁNG TRI THỨC

**Chủ đề nghệ thuật:** *“Những đóa hoa của tri thức”* (Flowers of Knowledge & Gratitude)  
**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI

---

## 1. TRIẾT LÝ THIẾT KẾ HOA TRI ÂN 20/11

Thay vì sử dụng ảnh clipart hoa rời rạc hoặc hiệu ứng pháo hoa/confetti gây rối mắt, hệ thống hoa tri ân 20/11 trong phiên bản V3 được chế tác hoàn toàn bằng **Vector SVG nhiều lớp (Multi-Layered Bezier SVG)** kết hợp **GSAP Stroke-Dashoffset & Organic Scale/Rotation**:

1. **Sự giao thoa giữa Tôn sư trọng đạo và Khoa Công nghệ thông tin:**
   - Những đóa hoa hồng nhung đỏ DNTU (`#AD1F29`), hoa hồng phấn (`#F4B8C4`) và hoa hướng dương vàng champagne (`#F0CC85`, `#F7E0AE`) vươn lên từ những **nhánh thân cây mang hình dáng đường mạch điện tử vàng (IT Circuit Traces)** với các nút vi mạch tỏa sáng.
   - Phía dưới bó hoa là **dải ruy băng lụa đỏ – vàng** uốn lượn mềm mại như nét bút của người thầy.
2. **Tôn vinh tuyệt đối tác phẩm gốc ở trung tâm:**
   - Toàn bộ hoạt ảnh hoa và cánh hoa bay (`8 cánh hoa SVG` với chuyển động `gentlePetalFloat` biên độ nhỏ) được bố trí ở hai cánh trái/phải và viền không gian, **không bao giờ che khuất mặt nhân vật, dòng code hay chữ trên bức poster gốc**.

---

## 2. BA ĐIỂM XUẤT HIỆN XUYÊN SUỐT MẠCH KỂ CHUYỆN

| Vị trí xuất hiện | Vai trò thị giác & cảm xúc | Kỹ thuật chuyển động |
|---|---|---|
| **1. Landing Page 20/11 (`Bước 01 → 03`)** | Mở màn lễ kỷ niệm 20/11: Nét bút vàng vẽ đường sáng khai mở, cánh hoa bay nhẹ và bó hoa *“Những đóa hoa của tri thức”* nở rộ bên cánh trái. | `strokeDashoffset` 1800 → 0, `scale(0.92 → 1)`, `gentlePetalFloat` CSS GPU transform. |
| **2. Slide 02 — Người thầy & Cô Liệu (`Bước 04`)** | Huy hiệu hoa tri ân `.slide2-floral-badge` kết nối hình ảnh bó hoa trên tay người giảng viên trong poster với lời cảm ơn gửi tới cô Liệu và Khoa CNTT. | Fade-in & subtle upward lift (`y: 12 → 0`). |
| **3. Slide 06 — Lời tri ân & Cảnh kết (`Bước 03 → 05`)** | Đóa hoa tri ân trưởng thành (`#slide6-floral-tribute`) xuất hiện trang trọng sau 3 cột tri ân, dẫn dắt ánh nhìn sang màn hé lộ toàn bộ poster nguyên bản. | Layered bloom + golden aura transition sang `#slide6-finale-view`. |
