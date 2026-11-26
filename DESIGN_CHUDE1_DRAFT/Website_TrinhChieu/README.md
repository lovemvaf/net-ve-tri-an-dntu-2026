# Website Trình Chiếu — Bộ 05 Ấn Phẩm Nghị Quyết 57-NQ/TW

**Cuộc thi:** Trại Thanh niên số thành phố Đồng Nai năm 2026 (Vòng thực chiến)  
**Chủ đề:** Chủ đề 1 – Nghị quyết đến gần thanh niên (*Mục 2 – Bộ 05 ấn phẩm 1080 × 1350 px*)  
**Trạng thái hồ sơ:** `DRAFT_PENDING_OFFICIAL_METADATA` (giữ nguyên cho tới khi có Phiếu đăng ký đội chính thức)

---

## 1. Kiến trúc & Điểm nổi bật

- **Mở trực tiếp ở Cảnh `01/05`:** Không có màn hình chờ tách biệt; trình duyệt mở ra hiển thị ngay Ấn phẩm 01 (`01_NghiQuyet57_GanBan.png`).
- **Đúng 05 cảnh (`01/05` → `05/05`):** Bấm `Tiếp` (`→` / `Space`) đúng **04 lần** đi trọn mạch truyện `01 → 02 → 03 → 04 → 05` (dừng gọn tại `05/05`, không tự vòng lại `01`).
- **Khung trưng bày 4:5 nguyên vẹn (`object-fit: contain`):** Ấn phẩm đặt lớn ở trung tâm-trái với nền Warm Ivory (`#F6F4ED`), bảo toàn 100% Huy hiệu Đoàn, tiêu đề, chú thích nguồn và mã QR ở cảnh `05/05`.
- **Thanh biên tập bên phải:**
  - Huy hiệu Đoàn TNCS Hồ Chí Minh tách nền sạch (`public/assets/identity/derived/huy-hieu-doan-clean.png`), không biến tấu hay tô màu lại.
  - Thanh 5 nhịp truyện bấm nhảy trực tiếp (`01 Đặt câu hỏi` … `05 Lan tỏa`).
  - Bảng **Lời dẫn thuyết trình (`N`)** thu gọn/mở rộng hiển thị nguyên văn lời dẫn chuẩn trong `DESIGN_CHUDE1_DRAFT/02_ThietKe/campaign.config.json`.
  - Tại Cảnh `05/05`: liên kết trực tiếp tới [Toàn văn Nghị quyết 57-NQ/TW trên mst.gov.vn](https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm) và ghi chú minh bạch *"Hình ảnh minh họa 2D được tạo với sự hỗ trợ của AI."*
- **100% chạy offline:** Nhúng font `@fontsource/be-vietnam-pro` (400–800, giấy phép `OFL-1.1`) trực tiếp trong bundle Vite, không phụ thuộc Google Fonts hay CDN ngoài; không có âm thanh tự phát; nền Canvas 2D nhẹ (hỗ trợ `Chế độ nhẹ` phím `L` và `prefers-reduced-motion`).

---

## 2. Cách chạy & Build kiểm thử

Chạy trong thư mục gốc repo `c:\Users\asus\Desktop\Netvetrian_QKD_KhoaCNTT-DNTU`:

```bash
# Chạy máy chủ phát triển cục bộ (http://127.0.0.1:5173/net-ve-tri-an-dntu-2026/)
pnpm dev

# Build bản tĩnh production vào thư mục dist/
pnpm run build

# Xem thử bản production từ dist/ (http://127.0.0.1:4173/net-ve-tri-an-dntu-2026/)
pnpm preview
```

> Lưu ý cấu hình `vite.config.js`: `base: '/net-ve-tri-an-dntu-2026/'` được giữ nguyên để tương thích cấu trúc deploy hiện có của repo; toàn bộ tài nguyên tĩnh trong `index.html` và `src/` dùng đường dẫn tương đối `./assets/...`.

---

## 3. Phím tắt trình chiếu

| Phím | Chức năng |
|---|---|
| `→` / `Space` / `PageDown` | Chuyển tới cảnh tiếp theo |
| `←` / `PageUp` | Quay lại cảnh trước |
| `Home` / `R` | Quay về cảnh đầu `01/05` |
| `End` | Tới cảnh kết `05/05` |
| `N` | Bật / Tắt bảng Lời dẫn thuyết trình |
| `Z` | Bật / Tắt chế độ phóng to ấn phẩm (Lightbox) |
| `L` | Bật / Tắt Chế độ nhẹ (giảm hiệu ứng chuyển cảnh & nền động) |
| `F` | Bật / Tắt Toàn màn hình |
| `O` | Bật / Tắt lưới xem tổng quan 05 ấn phẩm |
| `Esc` | Đóng phóng to hoặc thoát lưới tổng quan |

---

## 4. Điểm khôi phục bản cũ (Restore Point)

Phiên bản website trình chiếu 20/11 trước đây đã được sao lưu đầy đủ trước khi chuyển đổi tại:
- Nhánh Git cục bộ: `backup/net-ve-tri-an-20-11-v10`
- Tag Git: `archive-net-ve-tri-an-20-11-v10`

Để xem hoặc khôi phục lại trạng thái trước chuyển đổi (khi cần đối chiếu lịch sử):

```bash
git checkout backup/net-ve-tri-an-20-11-v10
```
