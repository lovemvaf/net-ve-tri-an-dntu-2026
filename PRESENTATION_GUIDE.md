# HƯỚNG DẪN VẬN HÀNH & BÁO CÁO KỸ THUẬT SLIDE CINEMATIC
**Dự án:** Nét Vẽ Tri Ân – Một Dòng Code, Vạn Chân Trời  
**Đơn vị:** Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Đồng Nai (DNTU)  
**Tác giả & Diễn giả:** Quách Khoa Đức  
**Bộ vai trò phụ trách:** Principal Creative Developer, WebGL Engineer, Motion Designer & Technical Art Director  

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG (TECH STACK ARCHITECTURE)

Hệ thống slide trình chiếu điện ảnh được phát triển theo tiêu chuẩn nghệ thuật quốc tế và kiến trúc web hiện đại nhất, kết hợp giữa 3 trụ cột công nghệ:

```
                  ┌──────────────────────────────────────────────┐
                  │           REVEAL.JS PRESENTATION             │
                  │   - Chuẩn khung hình 16:9 (1920x1080)        │
                  │   - Điều hướng phím, Overview, Speaker Notes │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
   ┌─────────────▼───────────────┐               ┌───────────────▼──────────────┐
   │     THREE.JS WEBGL CANVAS   │               │     GSAP 3 MOTION ENGINE     │
   │  - 2,200 hạt tri thức vàng  │               │  - Kinetic Typography        │
   │  - 3D Camera Pan & Dolly    │               │  - SVG Morphing & Path       │
   │  - Mood đổi theo từng slide │               │  - Staggered Entrances       │
   │  - Mouse Parallax mượt mà   │               │  - Pháo hoa chúc mừng 5 Tốt  │
   └─────────────────────────────┘               └──────────────────────────────┘
```

- **Framework trình chiếu cốt lõi:** `Reveal.js 6.0.2` — Đảm bảo responsive 16:9 hoàn hảo, mở rộng từ màn hình laptop đến màn chiếu hội trường lớn 4K.
- **Engine Đồ họa 3D Không gian:** `Three.js r187` — Hệ thống 2,200 hạt ánh sáng (Golden Knowledge Dust & Cyan Neural Field), chuyển đổi góc nhìn camera 3D (Camera Pan, Dolly, Orbit) mượt mà tương ứng với từng giai đoạn cảm xúc của bài phát biểu.
- **Engine Chuyển động Điện ảnh:** `GSAP 3.15.1` — Tích hợp SplitText kinetic reveals, SVG wave & sail animation, glassmorphism cards float, cùng module pháo hoa chúc mừng (`canvas-confetti`).
- **Hệ thống Kiểm thử & QA Thị giác:** `@playwright/test 1.65.1` — Tự động hóa 100% kiểm tra 6 slide, chụp screenshot visual verification độ phân giải cao.
- **Tài sản nguyên bản (Original Assets):** Bảo toàn 100% không qua AI tạo lại đối với Poster số hóa của Quách Khoa Đức, Logo chính thức DNTU và Logo Khoa Công nghệ Thông tin.

---

## 2. KHO REPOSITORIES NGHIÊN CỨU (.RESEARCH/REPOS/)

Toàn bộ **32 repositories** (31 repo yêu cầu + 1 repo mở rộng Codrops WebGL) đã được tải về bằng Git shallow clone tại thư mục [`.research/repos/`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/.research/repos):
- Chi tiết phiên bản, giấy phép, công dụng và phân loại kiến trúc được lưu trữ đầy đủ tại tệp [`TECH_STACK_AUDIT.md`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/TECH_STACK_AUDIT.md).

---

## 3. CẤU TRÚC CHI TIẾT 6 SLIDE CINEMATIC

### Slide 1: Nét vẽ tri ân – Một dòng code, vạn chân trời
- **Hình ảnh:** Logo DNTU & Khoa CNTT đặt trang trọng trên thanh định danh thương hiệu; Poster gốc `Quách Khoa Đức _ Nét vẽ tri ân` hiển thị trong khung viền ánh sáng vàng nghiêng 3D parallax.
- **Nội dung:** Giới thiệu tác phẩm nghệ thuật tri ân ngày 20/11; thông điệp tri thức bắt đầu từ tình thương của người thầy.
- **Điểm nhấn code:** Khối code hộp kính:
  ```c
  const gratitude = "Tri ân Thầy Cô Khoa CNTT - DNTU";
  function buildFuture() { return "Vạn chân trời cống hiến"; }
  ```

### Slide 2: Người thầy, cô Liệu & Ký ức những ngày đầu DNTU
- **Tâm điểm cảm xúc:** Khắc họa hình ảnh Cô Liệu — người thầy mẫu mực, tận tụy chỉ dạy từng dòng code "Hello World", kiên nhẫn sửa từng dấu chấm phẩy, giải tỏa những âu lo bỡ ngỡ của tân sinh viên.
- **Trích dẫn đắt giá:** *"Mỗi dấu chấm phẩy thầy cô kiên nhẫn sửa cho em là một viên gạch đắp bồi nên sự tự tin và bản lĩnh công nghệ hôm nay."*
- **3 Thẻ câu chuyện:** Bước chân đầu tiên (2022) ➔ Sự ân cần của Cô Liệu ➔ Ngọn lửa đam mê công nghệ.

### Slide 3: Quyển sách hóa con thuyền, hai sinh viên, bậc thang tri thức & AI
- **Giải mã biểu tượng nghệ thuật trên poster:**
  1. *Quyển sách hóa con thuyền:* Giáo trình lý thuyết tại DNTU uốn cong biến thành mạn thuyền buồm vững chãi vượt biển lớn nhị phân (0-1).
  2. *Hai sinh viên trên thuyền:* Biểu trưng cho tình bạn, sự gắn kết và tinh thần teamwork của sinh viên CNTT DNTU.
  3. *Bậc thang tri thức phát sáng:* Từng nấc thang dẫn thẳng lên bầu trời sao công nghệ.
  4. *Đỉnh cao Trí tuệ Nhân tạo (AI):* Tương lai số mà thầy cô Khoa CNTT đã trang bị hành trang cho sinh viên.
- **SVG Motion:** Cánh buồm và các nấc thang bậc sáng chuyển động đồng bộ theo sóng dữ liệu.

### Slide 4: Năm tiêu chí Sinh viên 5 tốt & Hành trình 2 năm liên tiếp
- **Thành tích nổi bật:** Huy hiệu vinh danh **2 năm liên tiếp đạt danh hiệu Sinh viên 5 Tốt Cấp Trường & Cấp Tỉnh** (2023 - 2024 & 2024 - 2025).
- **5 Tiêu chí rèn luyện toàn diện:** Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt, Hội nhập tốt.
- **Tương tác đặc biệt:** Nút **"Bắn Pháo Hoa Chúc Mừng"** kích hoạt hiệu ứng confetti hạt vàng và xanh lộng lẫy.

### Slide 5: Gallery ảnh thật — Dấu ấn trưởng thành cùng DNTU
- **Bộ 6 khung ảnh thực tế:**
  1. Phòng Lab Máy & Giảng Đường DNTU
  2. Hackathon & Sân Chơi Sáng Tạo Trẻ
  3. Chiến Dịch Tình Nguyện Mùa Hè Xanh
  4. Lễ Tuyên Dương Sinh Viên 5 Tốt
  5. Hội Thảo Công Nghệ Tương Lai & AI
  6. Khoảnh Khắc Tri Ân Cô Liệu & Thầy Cô
- **Tính năng thay ảnh trực tiếp (Replaceable Image System):** Giữ phím `Alt` hoặc `Shift` + click vào ảnh (hoặc click nút "Thay ảnh") để chọn ảnh thật từ máy tính. Ảnh tự động chuyển thành Base64 lưu vào `localStorage`, không mất khi F5 tải lại trang. Có nút hoàn tác ảnh gốc.
- **Lightbox phóng to:** Click bình thường để xem ảnh toàn màn hình với chú thích trang nhã.

### Slide 6: Tri ân sâu sắc & Tri thức tiếp nối
- **Chân dung tác giả:** Khung avatar tròn viền hào quang vàng của Quách Khoa Đức.
- **Bức tâm thư tri ân:** Lời cảm ơn trang trọng nhất gửi tới Cô Liệu kính yêu, Ban Lãnh đạo Khoa Công nghệ Thông tin và Ban Giám hiệu Trường Đại học Công nghệ Đồng Nai.
- **Lời hứa tương lai:** *"Một dòng code hôm nay gieo mầm từ lòng biết ơn, ngày mai sẽ hóa thành vạn chân trời cống hiến dựng xây đất nước."*

---

## 4. HỆ THỐNG PHÍM TẮT & ĐIỀU KHIỂN (HUD CONTROLS)

Hệ thống trang bị thanh công cụ điều khiển bán trong suốt (Glassmorphism HUD) ở đáy màn hình cùng bảng phím tắt tiện lợi:

| Phím tắt | Biểu tượng HUD | Chức năng chi tiết |
| :---: | :---: | :--- |
| `Space` hoặc `→` | `›` | Chuyển tới slide kế tiếp |
| `←` hoặc `PageUp` | `‹` | Quay lại slide trước |
| `F` | `⛶` | Bật / tắt chế độ toàn màn hình (Fullscreen) |
| `O` hoặc `Esc` | `⊞` | Bật / tắt chế độ xem tổng quan toàn bộ 6 slide (Overview Grid) |
| `S` | `📝` | Mở khay ghi chú diễn giả (Speaker Notes) với bài bình chi tiết |
| `M` | `♫` | Bật / tắt âm thanh sóng biển thư giãn (Ambient Web Audio API) |
| `R` | `⚡` | Bật / tắt chế độ giảm chuyển động (Reduced Motion Mode) |
| `?` | `?` | Mở bảng tra cứu phím tắt hướng dẫn |
| `Alt + Click` | `Thay ảnh` | Tải ảnh thật cá nhân lên Slide 5 và Slide 6 |

---

## 5. LỆNH VẬN HÀNH & KIỂM THỬ (SCRIPTS)

Tất cả các script đã được tích hợp chuẩn xác vào `package.json`:

1. **Khởi chạy môi trường phát triển (Dev Server):**
   ```bash
   pnpm run dev
   # Truy cập tại: http://127.0.0.1:5173
   ```

2. **Đóng gói sản phẩm thương mại (Production Build):**
   ```bash
   pnpm run build
   # Xuất bản phẩm tĩnh tự trị hoàn chỉnh tại thư mục dist/
   ```

3. **Xem trước bản đóng gói (Production Preview):**
   ```bash
   pnpm run preview
   ```

4. **Chạy kiểm thử tự động Playwright & Chụp ảnh màn hình:**
   ```bash
   pnpm run test
   ```

---

## 6. KẾT QUẢ KIỂM THỬ PLAYWRIGHT (10/10 PASSED)

Toàn bộ 10 ca kiểm thử E2E và giao diện trực quan đã vượt qua 100%:
- [`slide_01_hero.png`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/slide_01_hero.png)
- [`slide_02_co_lieu.png`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/slide_02_co_lieu.png)
- [`slide_03_book_boat_ai.png`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/slide_03_book_boat_ai.png)
- [`slide_04_sinh_vien_5_tot.png`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/slide_04_sinh_vien_5_tot.png)
- [`slide_05_gallery.png`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/slide_05_gallery.png)
- [`slide_06_tri_an_ket.png`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/slide_06_tri_an_ket.png)

