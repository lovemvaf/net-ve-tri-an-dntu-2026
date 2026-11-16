# DEPLOYMENT VERIFICATION REPORT V4 — LIVE GITHUB PAGES

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Tác giả:** Quách Khoa Đức — Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)

---

## 1. THÔNG TIN TRIỂN KHAI PRODUCTION V4

- **Website công khai (GitHub Pages):**  
  👉 **`https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`**
- **GitHub Repository (`main`):**  
  👉 **`https://github.com/lovemvaf/net-ve-tri-an-dntu-2026`**
- **Kịch bản xác minh trực tiếp:** `scripts/verify_live_pages.mjs`

---

## 2. KẾT QUẢ XÁC MINH TRỰC TIẾP TRÊN WEBSITE CÔNG KHAI

1. **Trạng thái HTTP & Tài nguyên:** `HTTP 200 OK`, `0` lỗi Console, `0` lỗi tải ảnh (`404`).
2. **Điều hướng Tuần tự 34 Bước (`Next` / `Previous`):**
   - Khởi động tại `MỞ ĐẦU 20/11 · BƯỚC 01 / 05`.
   - Bấm `Tiếp ›` đi tuần tự qua 5 bước của Landing, 3 bước của Slide 01, 4 bước của Slide 02, 4 cảnh của Slide 03, 7 bước của Slide 04, 5 cảnh ảnh thật của Slide 05, và 6 bước của Slide 06 tới `SLIDE 06 / 06 · BƯỚC 06 / 06` (`Final Hold`).
   - Tại Slide 06, bấm `Tiếp ›` tự động mở toàn cảnh poster nguyên bản ở Bước 05 và dừng lại ở Bước 06 mà không cần bấm bất kỳ nút phụ nào.
   - Bấm `‹ Trước` (`ArrowLeft`) từ `Final Hold` quay lại chính xác từng bước trước đó.
3. **Kiểm tra Hình ảnh Thầy Cô & Poster Nguyên bản:**
   - Slide 05 hiển thị đầy đủ các cảnh ảnh thật gắn kết thầy trò (Cô Liệu mỉm cười khích lệ trên giảng đường, tập thể quý thầy cô Khoa CNTT tại DNTU Creative Fest 2026, khoảnh khắc trao hoa 20/11 tặng cô Liệu).
   - Slide 06 hiển thị bố cục lấy Người thầy làm trung tâm (không còn ảnh chân dung cá nhân lớn) và kết thúc bằng toàn bộ poster nguyên bản (`POSTER_FULLY_VISIBLE = TRUE`).
