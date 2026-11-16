# DESIGN SYSTEM V2 — CINEMATIC EDITORIAL & ACADEMIC LUXURY

**Dự án:** Nét Vẽ Tri Ân — Một Dòng Code, Vạn Chân Trời (DNTU 2026)

---

## 1. Hệ Màu Sắc Cân Bằng Sáng – Tối (Light & Dark Emotional Rhythm)

Để khắc phục cảm giác tối và nặng nề khi tất cả các màn hình đều dùng nền đen/xanh đậm, Design System V2 thiết lập nhịp điệu ánh sáng theo từng chương cảm xúc:

### Bảng mã màu chuẩn (Core Tokens)
- **Academic Navy (`--navy-academic`):** `#19365F` — Màu xanh học thuật chủ đạo từ poster và logo Khoa CNTT.
- **Deep Cinema Navy (`--navy-deep`):** `#0E213D` — Nền chiều sâu cho Landing Page 20/11, Slide 03 (Con thuyền tri thức) và Cảnh kết Full Poster.
- **Warm Ivory Light (`--ivory-warm`):** `#F8F1E3` / `#F4EBDC` — Nền kem sáng sang trọng, ấm áp cho Slide 02 (Người thầy) và khu vực trưng bày ảnh của Slide 05.
- **Champagne Gold (`--gold-champagne`):** `#F0CC85` (Dark text variant: `#9A6B16`) — Ánh sáng tri thức, đường dẫn SVG và viền khung triển lãm.
- **DNTU Crimson Red (`--dntu-red`):** `#AD1F29` — Điểm nhấn thương hiệu DNTU và huy hiệu 20/11 (dùng tiết chế, có chủ đích).

### Phân bổ nền theo từng màn hình
1. **Landing Page (20/11 Grand Opening):** Nền Xanh Navy Triển lãm (`#122747` kết hợp hào quang Vàng Champagne `#F0CC85` lấy từ poster gốc) — tôn vinh trọn vẹn bức tranh ở trung tâm.
2. **Slide 01 (Khởi nguồn):** Nền Xanh Navy Học thuật sáng dịu (`#163056` → `#19365F`) với bố cục thoáng.
3. **Slide 02 (Người thầy & Cô Liệu):** **Nền Sáng Kem Ấm (`#F8F1E3` → `#EFE4CE`)** với chữ Xanh Navy (`#19365F`) và Đỏ DNTU (`#AD1F29`) — mang lại cảm giác gần gũi, trong trẻo như tà áo dài trắng và trang vở ngày đầu nhập học.
4. **Slide 03 (Con thuyền tri thức & Chân trời AI):** Nền Xanh Navy Điện ảnh (`#112645` → `#19365F`) kết hợp ánh bình minh vàng ấm để làm nổi bật các đường dẫn sáng SVG và hiệu ứng pan/zoom.
5. **Slide 04 (Sinh viên 5 tốt):** Nền Xanh Navy Hoàng gia kết hợp 5 thẻ ngà sáng (`#F8F1E3`) nối liền bằng đường sáng vàng champagne — trang trọng, rõ ràng từ khoảng cách xa.
6. **Slide 05 (Hành trình thực tế — Photo Exhibition):** Không gian Triển lãm sáng sủa kết hợp khung trưng bày Kem ấm (`#F8F1E3`) giúp các bức ảnh thật từ `anhchoslide5va6` hiển thị rực rỡ, trung thực.
7. **Slide 06 (Tri ân & Final Full Poster Reveal):**
   - *Phần A (Lời tri ân):* Bố cục sáng ấm trang trọng tôn vinh chân dung thật của tác giả và lời cảm ơn thầy cô.
   - *Phần B (Final Full Poster Reveal):* Chuyển mượt sang không gian trưng bày toàn cảnh poster gốc (`object-fit: contain`, `POSTER_FULLY_VISIBLE = TRUE`) ở trạng thái nghỉ tĩnh lặng (**Final Hold State**).

---

## 2. Hệ Thống Typography Tiếng Việt

- **Display & Tiêu đề lớn (`--font-serif`):** `'Cormorant Garamond'`, Georgia, serif — Thanh lịch, giàu chất văn chương và nghệ thuật, hiển thị dấu tiếng Việt sắc nét.
- **Nội dung & Giao diện (`--font-sans`):** `'Be Vietnam Pro'`, system-ui, sans-serif — Thiết kế chuyên biệt cho tiếng Việt, tối ưu độ dễ đọc trên máy chiếu hội trường.
- **Đoạn mã lập trình (`--font-mono`):** `'JetBrains Mono'`, monospace — Dành riêng cho `1 print("Hello, DNTU")` và `def future(): ...`.

---

## 3. Quy Chuẩn Hiển Thị Poster Nguyên Bản (`POSTER_FULLY_VISIBLE`)

Tại **Landing Page** và **Cảnh kết Slide 06 (Final Full Poster Reveal)**:
- Sử dụng `object-fit: contain` tuyệt đối, không dùng `object-fit: cover` hay `background-size: cover`.
- Khung chứa poster có `max-height: calc(100vh - 150px)` và `aspect-ratio: 3000 / 5333`, đảm bảo toàn bộ bức tranh từ dòng chữ `"NÉT VẼ TRI ÂN"` ở đỉnh đến `"Tri thức trao đi, tương lai tiếp nối"` ở đáy luôn nằm gọn 100% trong viewport trên mọi màn hình (`1920×1080`, `1440×900`, `1366×768`, Tablet/Mobile).
