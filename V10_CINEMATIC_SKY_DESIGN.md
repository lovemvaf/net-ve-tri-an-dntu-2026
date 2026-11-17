# V10 CINEMATIC SKY DESIGN — NÉT VẼ TRI ÂN DNTU 2026
## Thiết Kế Không Gian Bầu Trời Đa Tầng (`SkyWorld` & `StarfieldSystem`)

---

## 1. Bảng Màu Nghệ Thuật Lấy Cảm Hứng Từ Poster Gốc

Bầu trời trong `CinematicEnvironment` (`src/scripts/webgl-background.js`) được thiết kế đồng bộ với bảng màu của bức poster **“Nét vẽ tri ân — Một dòng code, vạn chân trời”**:
- **Deep Academic Navy (`#0B192E` – `#112645`):** Chiều sâu học thuật nơi bảng xanh và dòng lệnh `1 print("Hello, DNTU")` bắt đầu.
- **Soft Midnight Blue (`#19365F` – `#1F4272`):** Không gian bầu trời đêm nâng đỡ con thuyền sách.
- **Champagne Gold (`#F0CC85`) & Golden Sunrise (`#F7E0AE`):** Ánh sáng từ tay người thầy nối liền tới mặt trời bình minh trên đỉnh cầu thang tri thức.
- **Warm Ivory (`#F8F1E3`) & Soft Blush (`#F4B8C4`):** Sắc hoa tri ân Ngày Nhà giáo Việt Nam 20/11.

---

## 2. Cấu Trúc 4 Tầng Bầu Trời (`SkyWorld`)

1. **Tầng 1 — Deep Volumetric Sky & Golden Horizon Shader (`#webgl-canvas`, `z-index: 0`):**
   - Mặt phẳng shader 3D (`lightRaysMaterial`) kết hợp hai luồng sáng chéo mềm (`beam1`, `beam2`) và dải sáng bình minh phía chân trời (`dawnBand`), tự động biến thiên góc chiếu (`uAngle`) và cường độ bình minh (`uDawnGlow` từ `0.58` tại Slide 01 lên `0.95` tại Cảnh kết Toàn bộ Poster).
2. **Tầng 2 — Hai Lớp Mây Chiều Sâu (`Far Clouds` & `Near Illuminated Clouds`):**
   - **`Far Clouds` (4 dải mây xa, `farCloudSprite` `360×160px`):** Mờ dịu (`rgba(194, 208, 227, 0.15)`), trôi rất chậm ở tầng chân trời phía trên (`speedX = 0.0014..0.0020`).
   - **`Near Clouds` (5 dải mây gần, `nearCloudSprite` `360×160px`):** Được nhuộm ánh vàng bình minh (`rgba(247, 224, 174, 0.28)`), tạo cảm giác ánh nắng xuyên qua tầng mây.
3. **Tầng 3 — Deep Starfield 3 Lớp (`183 điểm sáng`):**
   - **`Far Stars` (`110 sao`):** Điểm sáng nhỏ (`0.7px–1.65px`), parallax `3px`, nhịp thở hàm sin chậm.
   - **`Mid Stars & Golden Dust` (`55 sao`):** Halo vàng ấm (`10px–24px`), parallax `8px`, trôi nhẹ theo hướng gió.
   - **`Near Bokeh` (`18 đốm sáng bokeh`):** Quầng sáng mềm (`28px–56px`) tạo chiều sâu tiền cảnh điện ảnh.
4. **Tầng 4 — Translucent Exhibition Stage Glass (`.slide-frame`):**
   - Khung slide sử dụng lớp kính xanh navy bán trong suốt (`rgba(22, 48, 86, 0.68)` → `rgba(10, 22, 42, 0.84)`) giúp người xem cảm nhận rõ bầu trời sao, mây bình minh và cánh chim chuyển động phía sau mà vẫn giữ độ tương phản chữ đạt chuẩn AAA.
