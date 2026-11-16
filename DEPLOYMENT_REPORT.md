# DEPLOYMENT & PRODUCTION VERIFICATION REPORT (V2)

**Dự án:** Nét Vẽ Tri Ân — Một Dòng Code, Vạn Chân Trời (DNTU 2026)  
**Tài khoản & Repository đích:** [`https://github.com/lovemvaf/net-ve-tri-an-dntu-2026`](https://github.com/lovemvaf/net-ve-tri-an-dntu-2026)  
**Website công khai (GitHub Pages):** [`https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`](https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/)  

---

## 1. Quy trình CI/CD & Triển khai GitHub Pages

1. **Cấu hình Vite Base Path (`vite.config.js`):**
   - `base: '/net-ve-tri-an-dntu-2026/'` đảm bảo toàn bộ đường dẫn tài nguyên (`./assets/optimized/*`, `./assets/curated/*`, JS/CSS bundles) hoạt động chính xác 100% trên GitHub Pages.
2. **Bảo mật & Kiểm soát dung lượng Git (`.gitignore`):**
   - Loại trừ hoàn toàn `node_modules/`, `.research/`, `anhchoslide5va6/` (thư mục nguồn 269 tệp vẫn giữ nguyên trên máy cục bộ), `dist/`, `test-results/`, `.env*`.
   - Chỉ commit mã nguồn sạch, 3 ảnh gốc tại thư mục gốc, bộ lớp ảnh tối ưu từ poster (`public/assets/optimized/`) và 14 bức ảnh thật đã tuyển chọn (`public/assets/curated/`).
3. **GitHub Actions Workflow (`.github/workflows/deploy.yml`):**
   - Tự động chạy khi push lên nhánh `main`: cài đặt dependencies, chạy `npm run build` và xuất bản thư mục `./dist` lên `github-pages` environment.

---

## 2. Kết quả Xác minh Trực tiếp trên Website Production

Script kiểm định tự động [`scripts/verify_live_pages.mjs`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/scripts/verify_live_pages.mjs) đã mở trực tiếp URL `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` bằng trình duyệt Chromium thực tế và xác nhận:

- **HTTP Status:** `200 OK`
- **Landing Page 20/11 (`#landing-page`):**
  - Hiển thị đầy đủ tiêu đề `NÉT VẼ TRI ÂN`, `CHÀO MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11`, `MỘT DÒNG CODE – VẠN CHÂN TRỜI`, tên đơn vị, tên tác giả `QUÁCH KHOA ĐỨC` và nút `KHÁM PHÁ HÀNH TRÌNH TRI ÂN`.
  - Kiểm định hình học: `POSTER_FULLY_VISIBLE = true` (`objectFit: "contain"`, không bị cắt xén hay biến dạng).
- **Điều hướng 6 Slide (`01 / 06` → `06 / 06`):**
  - Chuyển cảnh mượt từ Landing Page vào Slide 01 (`01 / 06`).
  - Hoạt động đầy đủ cả 6 slide, các điểm sáng tương tác ở Slide 03, 5 tiêu chí ở Slide 04, 5 cảnh triển lãm ảnh thật ở Slide 05 và 2 trạng thái kết ở Slide 06.
- **Triển lãm ảnh thật Slide 05 (`public/assets/curated/`):**
  - Toàn bộ 5 cảnh (`Cảnh 1: Ngày đầu`, `Cảnh 2: Học hỏi`, `Cảnh 3: Nỗ lực`, `Cảnh 4: Thành quả`, `Cảnh 5: Biết ơn`) tải ảnh thật sắc nét (`naturalWidth: 1400px – 1600px`).
- **Cảnh kết Toàn bộ Poster tại Slide 06 (`#slide6-finale-view`):**
  - Chân dung thật của tác giả Quách Khoa Đức (`IMG_5524.JPG`) hiển thị rõ nét ở Phần A.
  - Khi chuyển sang Phần B (`Final Full Poster Reveal`), kiểm định hình học đạt `POSTER_FULLY_VISIBLE = true` (`objectFit: "contain"`, trạng thái nghỉ ổn định **Final Hold State**).
- **Lỗi Console / Runtime trên URL công khai:** `0` lỗi.
