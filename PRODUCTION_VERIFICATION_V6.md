# PRODUCTION VERIFICATION V6 — NÉT VẼ TRI ÂN DNTU 2026

## 1. Thông Tin Triển Khai Chính Thức

- **Tác phẩm:** *Nét vẽ tri ân — Một dòng code, vạn chân trời*
- **Tác giả & Người trình bày:** **Quách Khoa Đức** — Sinh viên Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)
- **Website trực tuyến (GitHub Pages):** https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/
- **GitHub Repository:** https://github.com/lovemvaf/net-ve-tri-an-dntu-2026
- **Nhánh triển khai:** `main` (tự động build & deploy qua `.github/workflows/deploy.yml`)

## 2. Danh Mục Kiểm Chứng Sản Xuất (Production Verification Checklist)

1. **HTTP & Tài nguyên mạng:**
   - Website trả về `HTTP 200 OK`, tất cả tài nguyên CSS/JS/Font/Ảnh đều tải thành công (`0` lỗi 404, `0` lỗi Console/PageError).
2. **Bảo toàn cấu trúc điều hướng 13 trạng thái (12 lần bấm Tiếp):**
   - `Landing 20/11` (1 trạng thái) → `Slide 01` (1 trạng thái) → `Slide 02` (1 trạng thái) → `Slide 03` (4 góc nhìn) → `Slide 04` (1 trạng thái) → `Slide 05` (3 chặng) → `Slide 06` (2 trạng thái: Lời tri ân & Toàn bộ Poster kết) = **13 trạng thái / 12 lần bấm Tiếp**.
3. **Bầu trời sống động (`#living-sky-layer` + `#webgl-canvas`):**
   - Đàn chim cách điệu bay ở tầng trời cao (`#sky-birds-far`, `#sky-birds-near` + đàn chim 3D WebGL), hạt sáng vàng champagne lấp lánh, dải mây bình minh và cánh hoa tri ân 20/11 hoạt động mượt mà ở tốc độ **60 FPS** mà không che chữ, mặt người hay poster.
4. **7 Đại cảnh chuyển tiếp liên slide (`#scene-transition-overlay`):**
   - Xác minh trực tiếp 7 chủ đề chuyển cảnh: `floral-light-gateway`, `the-first-light`, `book-of-knowledge`, `stairway-to-tomorrow`, `memories-in-motion`, `bouquet-of-gratitude`, và `grand-tribute-reveal`.
5. **Thay ảnh mới tại Slide 05 – Chặng 01 (`#s5-side3-img`):**
   - Hiển thị chính xác ảnh thật `curated-20-clb-cntt-dntu-project.jpg` (*"KHOA CNTT · CLB KHOA HỌC MÁY TÍNH DNTU — Thực Hành & Trưng Bày Dự Án Phần Mềm Cùng CLB Khoa Học Máy Tính DNTU"*).
6. **Hiển thị trọn vẹn Poster nguyên bản (`POSTER_FULLY_VISIBLE = TRUE`):**
   - Cả tại **Landing 20/11** (`#landing-full-poster-img`) và **Slide 06 – Cảnh kết** (`#finale-full-poster-img`) đều hiển thị 100% poster gốc (`object-fit: contain`, không bị cắt xén).
