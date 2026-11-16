# PRODUCTION DEPLOYMENT REPORT V3 — GITHUB PAGES LIVE VERIFICATION

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Tác giả:** Quách Khoa Đức — Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)

---

## 1. THÔNG TIN REPOSITORY & WEBSITE CÔNG KHAI

- **GitHub Repository:** `https://github.com/lovemvaf/net-ve-tri-an-dntu-2026`
- **Nhánh triển khai:** `main`
- **GitHub Actions Workflow:** `.github/workflows/deploy.yml` (Tự động cài đặt dependencies với `pnpm`, chạy `pnpm run build`, đóng gói `dist/` và triển khai lên GitHub Pages).
- **URL Website công khai (Live GitHub Pages):**  
  👉 **`https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`**

---

## 2. DANH MỤC KIỂM TRA SAU TRIỂN KHAI (POST-DEPLOYMENT VERIFICATION)

1. **HTTP Status:** `200 OK` trên `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`.
2. **Global Step-by-Step Navigation (34 bước):**
   - Hoạt động mượt mà từ `MỞ ĐẦU 20/11 · BƯỚC 01 / 06` qua toàn bộ các bước con của Landing và 6 Slide đến `SLIDE 06 / 06 · BƯỚC 05 / 05`.
   - Nút `‹ Trước` và phím `←` lùi chính xác từng bước kể chuyện.
   - Tại bước cuối cùng (`SLIDE 06 / 06 · BƯỚC 05 / 05`), màn hình giữ nguyên trạng thái kết (**Final Hold State**), không tự động quay lại đầu.
3. **20/11 Floral Art & Full Poster Reveal:**
   - Hoạt ảnh nét bút vàng, cánh hoa bay và bó hoa *“Những đóa hoa của tri thức”* hiển thị sắc nét.
   - `POSTER_FULLY_VISIBLE = TRUE` trên cả Landing Page và Slide 06 Finale (`object-fit: contain`, hiển thị trọn vẹn 100% poster gốc).
4. **Console & Network:** `0` lỗi Console, `0` lỗi tải tài nguyên (`404`).
