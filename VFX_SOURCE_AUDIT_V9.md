# VFX SOURCE AUDIT V9 — NÉT VẼ TRI ÂN DNTU 2026
## Phân Tích Kỹ Thuật Nguyên Nhân Hiệu Ứng Chưa Nhìn Thấy Rõ & Giải Pháp Compositing V9

---

## 1. Các Tệp Mã Nguồn Đã Kiểm Tra Trực Tiếp

Đã kiểm tra toàn bộ các tệp cốt lõi của dự án:
- `src/scripts/webgl-background.js`
- `src/scripts/motion-controller.js`
- `src/scripts/slides-app.js`
- `src/styles/main.css`
- `src/content/presentation-data.js`
- `index.html`
- `package.json` & `vite.config.js`
- `MOTION_AUDIT_V8.md` và bộ kiểm thử `tests/slides_cinematic.spec.js`

---

## 2. Năm Nguyên Nhân Kỹ Thuật Khiến Hiệu Ứng Ở Bản V8 Chưa Đạt Độ Hoành Tráng Trên Màn Hình

### Nguyên nhân 1 — Lỗi Layer & Compositing Occlusion (`z-index` bị lớp nội dung che khuất 92% diện tích)
- Trong `src/styles/main.css` (`L73–81`), `#living-sky-layer` (chứa `#ambient-sky-canvas`) được đặt ở `z-index: 1`.
- Trong khi đó:
  - Trên **Landing Page**, `#landing-page` ở `z-index: 250` có lớp nền `radial-gradient(..., rgba(25, 54, 95, 0.45) 52%, rgba(11, 25, 46, 0.72) 100%)` phủ đè lên trên `#ambient-sky-canvas`, làm giảm độ sáng của sao, bụi vàng và chim bay tới **50%–72%**.
  - Trên **Slide 01–06**, `.reveal` ở `z-index: 2` chứa khung `.slide-frame` chiếm tới **92% diện tích màn hình 1920×1080** (`1780px × 940px`) với nền đục gần như hoàn toàn (`rgba(16, 36, 66, 0.94)` hoặc `rgba(248, 241, 227, 0.97)`).
  - Do đó, mọi hiệu ứng được vẽ trên `#ambient-sky-canvas` và `#webgl-canvas` thực chất **bị tấm thẻ `.slide-frame` che khuất 92%**, chỉ lộ ra ở viền mép ngoài rộng 40–60px!

### Nguyên nhân 2 — Hàm `getSafeZoneAlpha` Cắt Bỏ Hoàn Toàn Hiệu Ứng Trong Vùng `[0.09..0.91] × [0.11..0.89]`
- Trong `src/scripts/webgl-background.js` (`L248–257`), hàm `getSafeZoneAlpha(nx, ny)` triệt tiêu độ mờ (`alpha -> 0`) của toàn bộ hạt sáng và cánh hoa nằm trong vùng `x: 9%..91%`, `y: 11%..89%`.
- Kết hợp với việc vẽ ở `z-index: 1`, ngay cả khi kích hoạt **Grand Moment**, người xem không thể nhìn thấy làn sóng hạt sáng hay mưa hoa bay qua không gian sân khấu.

### Nguyên nhân 3 — Hệ Thống Chim Bay (`BirdSystem`) Quá Nhỏ Và Bị Nhốt Ở Mép Trên Cùng (`y = 3.2%..5.2%`)
- Trong `src/scripts/webgl-background.js` (`L165–176`), chỉ có **7 cá thể chim** với hệ số thu nhỏ `scale: 0.44..0.82` (kích thước thực tế chỉ `13px–24px`), bay trong dải hẹp `ny = 0.032..0.052` (`y = 34px..56px` sát mép trên màn hình) với tốc độ rất chậm (`speed = 0.018`).
- Tại `y = 34px..56px`, đàn chim còn bị thanh `.landing-top-bar` (logo DNTU, tiêu đề Khoa CNTT, huy hiệu 20/11) đè lên trên Landing Page.

### Nguyên nhân 4 — Hệ Thống Hoa (`FloralSystem`) Có Số Lượng Quá Ít & Bị Che Khi Chuyển Slide 05 → 06
- Trong trạng thái thường chỉ có **8 cánh hoa** kích thước nhỏ (`18px`) ở sát mép trái/phải (`nx < 0.07` hoặc `nx > 0.93`).
- Trong **Grand Moment 02 (`Slide 05 → Slide 06`)**, mảng `grandBurstPetals` chỉ có **16 cánh hoa** và lại được vẽ trên `#ambient-sky-canvas` (`z-index: 1`) — tức là nằm **phía sau** khung `.slide-frame` của Slide 05 và Slide 06! Kết quả là khi chuyển từ Slide 05 sang Slide 06, người xem hầu như không nhìn thấy đợt hoa tri ân nào.

### Nguyên nhân 5 — Thiếu Hiệu Ứng **Golden Particle Wave (*A Thousand Lights of Gratitude*)** Có Quỹ Đạo Rõ Ràng
- Hệ thống hạt hiện tại chỉ gồm các hạt tĩnh trôi chậm tại chỗ (`38 hạt Golden Dust` ở rìa ngoài), chưa có hệ thống **Particle Wave / Flow Field** tạo thành làn sóng hàng trăm đốm sáng tri thức lướt theo đường cong mềm mại qua không gian trong các khoảnh khắc cao trào.

---

## 3. Giải Pháp Kiến Trúc Layer & VFX Trong Bản V9

1. **Thiết kế hệ thống Compositing 2 Tầng Canvas Độc Lập (Zero Occlusion, Safe Foreground):**
   - **Tầng Nền — `#webgl-canvas` (`z-index: 0`) & `#ambient-sky-canvas` (`z-index: 1`):**
     - Render bầu trời đêm học thuật & ánh bình minh sâu thẳm, **Multi-Layer Starfield 3 lớp** (`Far Field` 110 sao nhỏ, `Middle Field` 55 sao vừa & hạt bụi vàng ấm, `Near Field` 18 đốm bokeh dịu), dải mây mờ và đàn chim bay xa (`Ambient Flock`).
     - Trên `#landing-page`, loại bỏ lớp phủ tối ở giữa để bầu trời sao, ánh bình minh và chim bay hiển thị rực rỡ 100% quanh bức poster trung tâm và hai cánh bên.
   - **Tầng Cao Trào & Chuyển Cảnh — `#grand-vfx-canvas` (`z-index: 265`, nằm TRÊN `.reveal` và `#landing-page`, `pointer-events: none`):**
     - Render trực tiếp **Golden Particle Wave (*A Thousand Lights of Gratitude* — 180–240 hạt sáng bay theo dòng chảy cong Bezier + Perlin-like curl)**, **Floral Storm (*Hoa Tri Ân Ngập Trời* — 65–85 cánh hoa đa kích thước, đa chiều sâu, xoay 3D hai mặt màu)** và **Grand Bird Flock (14–18 cánh chim bay thành đàn có chiều sâu gần/trung/xa)**.
     - Áp dụng **Smart Content-Safe Masking (Mặt nạ bảo vệ vùng chữ, khuôn mặt và poster)** ngay trên `#grand-vfx-canvas`: các làn hoa, đàn chim và dòng hạt sáng bay ngập tràn vùng trời phía trên (`y: 4%..24%`), hai hành lang sân khấu trái/phải, vùng chân trời và lướt qua không gian chuyển cảnh, đồng thời tự động làm dịu nhẹ khi đi qua vùng khuôn mặt/chữ chính và lắng xuống êm ái sau khi cao trào kết thúc (`3.2s–3.8s`)!
2. **Tích hợp `VFX Showcase & Debug Mode` (`Phím V` hoặc `?vfx=1`):**
   - Cho phép lập trình viên và QA kích hoạt độc lập từng hiệu ứng (`Preview Landing Sky`, `Preview Bird Flock`, `Preview Golden Particle Wave`, `Preview Floral Storm`, `Preview Grand Tribute`, `Preview Final Poster Reveal`, `Preview Reduced Motion`, `Preview Lite Mode`) để kiểm tra trực quan và quay video nghiệm thu.
