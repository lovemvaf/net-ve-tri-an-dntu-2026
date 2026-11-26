# SOURCES & PROVENANCE — BỘ 05 ẤN PHẨM NGHỊ QUYẾT 57-NQ/TW

**Cập nhật kiểm chứng:** 26/11/2026  
**Trạng thái hồ sơ:** `DRAFT_PENDING_OFFICIAL_METADATA`

---

## 1. Nguồn văn bản chính thống Nghị quyết số 57-NQ/TW (ngày 22/12/2024)

| Nguồn | URL đầy đủ | Trạng thái kiểm tra thực tế (26/11/2026) | Vai trò sử dụng |
|---|---|---|---|
| **Cổng TTĐT Bộ Khoa học và Công nghệ (MST)** — *Nguồn chính* | `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm` | **LIVE HTTP 200** (`urllib`: 214,593 bytes HTML; `curl.exe`: `200 214623`). Truy cập trực tiếp, không yêu cầu giải mã/chống bot; chứa đầy đủ toàn văn Phần Mở đầu, Mục I–IV. | **URL chính thức (`officialResolutionUrl`) & đích mã QR thật trên Ấn phẩm 05.** |
| **Cổng TTĐT Chính phủ — Xây dựng chính sách** — *Nguồn đối chiếu* | `https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm` | **HTTP 200 (Gzip / OpenResty CDN)**. Trả về luồng nén `gzip` 88,490 bytes (`server: openresty`, `x-cache-status: HIT`); các client không tự giải nén `gzip` hoặc thiếu header trình duyệt chỉ đọc được dữ liệu nén/shell thô. Khi giải nén đầy đủ (547,617 bytes HTML), toàn văn trùng khớp với `mst.gov.vn`. | Dùng đối chiếu chéo văn bản; **không** chọn làm link QR vì rủi ro client/trình quét hoặc bộ lọc CDN. |
| **Tư liệu Văn kiện — Báo điện tử Đảng Cộng sản Việt Nam** | `https://tulieuvankien.dangcongsan.vn/Uploads/2024/12/7/27/NQ-57-TW.pdf` | **KHÔNG KHẢ DỤNG (302 → 404 / Connection Refused)**. `curl.exe -sI` trả `HTTP/1.1 302 Found` chuyển hướng sang `http://tulieuvankien.dangcongsan.vn/page/404`; khi client `urllib` đi theo chuyển hướng sang HTTP cổng 80 bị từ chối kết nối (`ConnectionRefusedError: WinError 10061`). | **Không sử dụng** làm nguồn truy cập trực tiếp hay mã QR. |

---

## 2. Nguồn quy định cuộc thi & dữ liệu đội thi

1. **Đề thi chính thức:** `c:\Users\asus\Downloads\DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx`
   - Cuộc thi: Trại Thanh niên số thành phố Đồng Nai năm 2026 — Vòng thực chiến.
   - Hạn nộp: `21:00 ngày 26/11/2026`.
   - Quy định Mục 2 — Thiết kế: 03–05 ấn phẩm PNG/JPG, `1080 × 1350 px`, đúng nhận diện của Đoàn, màu sắc và kiểu chữ thống nhất.
2. **Bảng ghi chú tập huấn & kịch bản tham khảo nội bộ đội:** `c:\Users\asus\Downloads\TRẠI THANH NIÊN SỐ.xlsx` (sheet `STUDY`, `SCRIPT`).
3. **Trạng thái thông tin đội/địa bàn:** Cả hai tệp trên **không có** `Đội số`, `Cụm`, tên xã/phường cụ thể hay tên `Đội trưởng`. Mọi trường này được giữ `null` trong `campaign.config.json` dưới trạng thái `DRAFT_PENDING_OFFICIAL_METADATA`.

---

## 3. Nguồn tài nguyên nhận diện (Huy hiệu Đoàn TNCS Hồ Chí Minh)

- **Nguồn cung cấp gốc từ người dùng:** `C:/Users/asus/.gemini/antigravity/brain/4160b934-787e-4101-962a-4601f5f1f8ca/.user_uploaded/media_1795700405456_84ed6ac6.jpg` (`925 × 1024 px`, RGB JPEG).
- **Bản lưu nguyên vẹn (không chỉnh sửa):**
  - `DESIGN_CHUDE1_DRAFT/02_ThietKe/identity/original/huy-hieu-doan-original.jpg`
  - `public/assets/identity/original/huy-hieu-doan-original.jpg`
- **Bản tách nền sử dụng trong dàn trang (`scripts/prepare_doan_emblem.py`):**
  - `DESIGN_CHUDE1_DRAFT/02_ThietKe/identity/derived/huy-hieu-doan-clean.png`
  - `public/assets/identity/derived/huy-hieu-doan-clean.png`
  - Kích thước đầu ra: `941 × 1042 px` RGBA PNG (bảo toàn tỷ lệ gốc với lề trong suốt đối xứng tối thiểu 8 px; chỉ loại bỏ 223,203 pixel nền đen ngoài viền trắng bằng 4-connected BFS từ 4 góc với ngưỡng `max(R,G,B) < 42`, xử lý khử viền đen 1–2 px ngoài rìa trắng; **0 sai lệch RGB** trên toàn bộ 717,851 pixel nội dung bên trong gồm vòng trắng, chữ đỏ *“ĐOÀN THANH NIÊN CỘNG SẢN HỒ CHÍ MINH”*, nền xanh lá, các sọc trắng, bàn tay, lá cờ đỏ và ngôi sao vàng).
  - Ảnh kiểm định trực quan trên nền sáng `#F6F4ED` và nền tối `#10294B`: `.research/emblem_check.png`.
- **Tuân thủ:** Không dùng AI vẽ lại, không tách rời hoặc đổi màu Huy hiệu Đoàn; không tự ý ghép thêm logo đơn vị khác khi chưa có asset chính thức.

---

## 4. Kiểu chữ (Typography) & thư viện mã QR

- **Font chính:** **Be Vietnam Pro** (thiết kế bởi Gabriel Lam, Vietanh Nguyen, Tony Le; hỗ trợ đầy đủ dấu tiếng Việt).
  - Gói phân phối chuẩn: `@fontsource/be-vietnam-pro` (npm `5.3.0`), giấy phép **SIL Open Font License 1.1 (`OFL-1.1`)** — cho phép sử dụng, nhúng và xuất ấn phẩm công khai miễn phí, không sử dụng font lậu/bản quyền hạn chế.
- **Mã QR:** Tạo bằng thư viện mã nguồn mở có kiểm thử giải mã thực tế (`qrcode` — MIT; `jsqr` — Apache-2.0), trỏ chính xác về URL `mst.gov.vn` đã kiểm chứng ở Mục 1. Không dùng hình QR do AI sinh ra.

---

## 5. Minh bạch công cụ số và AI hỗ trợ (AI Transparency Disclosure)

- **Hình minh họa 2D (trong `source_illustrations/`):** Sử dụng công cụ tạo ảnh hỗ trợ bằng AI để vẽ **05 bối cảnh minh họa 2D bán hiện thực và bảng tham chiếu nhân vật hư cấu** (nữ sinh viên, nam đoàn viên áo xanh trơn, người phụ nữ lớn tuổi, smartphone, quyển sổ navy), **không chứa chữ viết, số, logo hay QR do AI sinh ra**.
- **Cam kết đạo đức & quy định BTC:**
  - Không dùng AI tạo ảnh hoặc giọng nói của lãnh đạo hay bất kỳ cá nhân có thật nào.
  - Không đưa thông tin cá nhân thật của đoàn viên hoặc người dân vào công cụ AI công cộng.
  - Toàn bộ chữ tiếng Việt, Huy hiệu Đoàn chuẩn và mã QR thật được ghép độc lập bằng mã nguồn (SVG/HTML/PNG compositor) ở bước sản xuất chính thức.
  - Các khung cảnh cộng đồng trong bộ 05 ảnh là **tình huống truyền thông giả định / gợi ý phần việc thanh niên**, không phải tư liệu chứng minh sự kiện đã diễn ra.
