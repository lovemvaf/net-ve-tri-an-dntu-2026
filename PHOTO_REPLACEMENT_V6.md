# PHOTO REPLACEMENT V6 — SLIDE 05 (CHẶNG 01: KHỞI ĐẦU & ĐƯỢC DÌU DẮT)

## 1. Lý Do Thay Thế Ảnh Cũ

Ở phiên bản trước, ô ảnh phụ thứ 3 (`#s5-side3-img`) tại **Slide 05 – Chặng 01** sử dụng ảnh `curated-02-hoc-tap-nhom.jpg` (*"HỌC TẬP & SẺ CHIA – Cùng Bạn Bè Thảo Luận Chuyên Môn Bên Chiếc Laptop"* — nguồn: `anhchoslide5va6/584157806_122097685053127890_62662325217752284_n.jpg`). Bức ảnh cũ chụp góc nghiêng trong hội trường Đoàn – Hội, chưa thể hiện trực tiếp bản sắc học tập, thực hành công nghệ và làm dự án phần mềm của sinh viên **Khoa Công nghệ thông tin – Trường Đại học Công nghệ Đồng Nai (DNTU)**.

## 2. Ảnh Mới Được Tuyển Chọn Từ `anhchoslide5va6`

Sau khi rà soát toàn bộ kho ảnh gốc trong `anhchoslide5va6`, hệ thống đã chọn bức ảnh độ phân giải cao `4032 × 2268`:

- **File gốc:** `anhchoslide5va6/20240711_111216.jpg` (`IMG_018`)
- **File tối ưu đưa vào trình chiếu:** `public/assets/curated/curated-20-clb-cntt-dntu-project.jpg` (`1400 × 934`, tỷ lệ `3:2`, JPEG chất lượng cao)
- **Nội dung hình ảnh:**
  - Tác giả **Quách Khoa Đức** đeo dây đeo thẻ sinh viên **Trường Đại học Công nghệ Đồng Nai (DNTU)** ngồi trước 2 chiếc laptop và màn hình lớn, trực tiếp giới thiệu sản phẩm phần mềm **“Fruits Collect”** cùng các bạn sinh viên tại không gian học thuật & đổi mới sáng tạo (`Learn · Innovation · Development`).
  - Trên bảng trưng bày dự án bên trái và trên màn hình máy tính bên phải hiển thị rõ ràng dòng chữ **“Khoa Công nghệ Thông tin – CLB Khoa học Máy tính (Computer Science Club) – Trường ĐH Công nghệ Đồng Nai (DNTU) – IT”** cùng biểu trưng nhà trường.
- **Nhãn & Chú thích mới trên Slide 05 (Chặng 01):**
  - **Badge (`#s5-side3-badge`):** `KHOA CNTT · CLB KHOA HỌC MÁY TÍNH DNTU`
  - **Tiêu đề (`#s5-side3-title`):** `Thực Hành & Trưng Bày Dự Án Phần Mềm Cùng CLB Khoa Học Máy Tính DNTU`
  - **Chú thích (`#s5-side3-caption`):** `Cùng bạn bè Khoa CNTT giới thiệu dự án phần mềm “Fruits Collect” tại không gian học thuật và đổi mới sáng tạo DNTU.`

## 3. Đồng Bộ Dữ Liệu & Kiểm Chứng

- Đã cập nhật đồng bộ tại:
  1. `src/content/photo-manifest.json`
  2. `src/content/presentation-data.js` (`SLIDE5_SCENES[0].sidePhotos[2]` và kịch bản thuyết trình Chặng 1)
  3. `index.html` (`#s5-side3-img`, `#s5-side3-badge`, `#s5-side3-title`, `#s5-side3-caption`)
- Được kiểm thử tự động trong `tests/slides_cinematic.spec.js` (xác nhận `#s5-side3-img` tải thành công `curated-20-clb-cntt-dntu-project.jpg` với `naturalWidth > 0` và không còn tham chiếu tới `curated-02-hoc-tap-nhom.jpg`).
