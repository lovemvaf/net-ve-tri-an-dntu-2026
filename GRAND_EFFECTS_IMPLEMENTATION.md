# GRAND EFFECTS IMPLEMENTATION V9 — NÉT VẼ TRI ÂN DNTU 2026
## Chi Tiết Kỹ Thuật Triển Khai Starfield Đa Tầng, Golden Particle Wave, Bird Flock & Floral Storm

---

## 1. Multi-Layer Cinematic Starfield (`#ambient-sky-canvas`)

Hệ thống sao và ánh sáng nền được chia thành 3 tầng chiều sâu rõ rệt:
1. **Far Field (`110 sao nhỏ`):** Kích thước `0.7px–1.6px`, parallax thấp (`3px`), nhịp lấp lánh chậm theo hàm sin với pha ngẫu nhiên.
2. **Middle Field (`55 sao sáng & hạt bụi vàng`):** Kích thước halo `10px–24px`, trôi nhẹ theo gió từ trái sang phải và nâng dần lên cao (`vx = 0.00012..0.00030`, `vy = -0.00008..-0.00022`).
3. **Near Field (`18 đốm sáng Bokeh mềm`):** Sử dụng `bokehOrbSprite` (`96×96px` radial gradient mềm với tâm vàng ấm `#F7E0AE` và viền hồng phấn `#F4B8C4`), kích thước hiển thị `26px–54px`, tạo chiều sâu ống kính điện ảnh ở vùng rìa và bầu trời phía trên.

---

## 2. Golden Particle Wave — *A Thousand Lights of Gratitude* (`#grand-vfx-canvas`)

Được xây dựng dựa trên thuật toán **Curl-Noise Flow Field** (`PSCactux/fluid-particles`):
- Khi kích hoạt tại **Landing Opening (`170 hạt`)**, **Slide 03 (`95 hạt`)**, **Slide 05 → 06 (`135 hạt`)** và **Final Poster Reveal (`220 hạt`)**, các hạt sáng vàng champagne và trắng ấm được sinh ra theo 3 dải dòng chảy S-curve (`streamIdx = 0, 1, 2`).
- Góc xoáy vận tốc được tính theo trường thế mượt:
  $$\theta_{\text{curl}}(x, t) = 0.42 \sin(5.2 x + 1.4 t + \phi_i)$$
- Mỗi hạt vẽ kèm một đuôi sáng lụa ngắn (`motion trail`) dọc theo vector vận tốc $(v_x, v_y)$ cùng quầng sáng `starHaloSprite` (`9px–36px`), tạo thành một làn sóng đốm sáng tri thức lướt qua bầu trời rồi tan dần khi kết thúc cao trào.

---

## 3. Cinematic Bird Flock System (`Ambient Flock` & `Grand Flock`)

Kết hợp quy tắc định hướng vận tốc của `murmurations` / `gpu-flock` với hoạt ảnh cánh 2 khớp (`drawArticulatedBird`):
- **Hình dáng & Tương phản:** Thân chim thanh lịch màu trắng ngà ấm (`#FFFDF7`) viền vàng champagne (`rgba(240, 204, 133, 0.85)`) kèm hào quang dịu phía sau giúp đàn chim nổi bật rõ ràng trên nền trời xanh navy đậm.
- **Chuyển động cánh 2 khớp:** Khớp vai (`shoulderY`) và đầu cánh (`tipY`) lệch pha `0.55 rad`, tạo nhịp vỗ cánh mềm mại như chim thật.
- **Hai chế độ hoạt động:**
  1. `Ambient Flock (8 cá thể)`: Bay nhẹ ở vùng trời cao (`y = 5.2%..8.2%`) tại Landing, Slide 03 và Cảnh kết.
  2. `Grand Flock (12–18 cá thể, sải cánh 32px–62px)`: Kích hoạt trên `#grand-vfx-canvas` (`z-index: 265`) tại **Landing Opening**, **Slide 03 (Con thuyền tri thức)** và **Final Poster**, bay thành 3 nhóm có chiều sâu `near / mid / far` hướng về phía ánh bình minh.

---

## 4. Floral Storm — *Hoa Tri Ân Ngập Trời* (`#grand-vfx-canvas`)

- **4 Sprite Cánh Hoa Độ Phân Giải Cao (`56×56px`):** Hồng phấn (`#FFE5EC → #E08A9D`), Vàng champagne (`#FFFDF5 → #D9AE5F`), Trắng kem (`#FFFFFF → #E5D4B8`) và Đỏ dịu DNTU (`#FAD2D8 → #B82937`), có khía cánh tự nhiên và 3 đường gân lá mảnh.
- **Xoay 3D Hai Mặt:** Mô phỏng góc lật 3D qua phép biến đổi `scaleX = fp.scale * (0.32 + 0.68 * |cos(roll)|)` kết hợp góc xoay `rot` và dao động gió ngang `sway`.
- **Cao trào tại Slide 05 → Slide 06 (*A Thousand Thank-Yous*):** **88 cánh hoa đa kích thước** (`20px–50px`) cùng **135 đốm sáng vàng** bay lên từ hai bên và mép dưới trên tầng `#grand-vfx-canvas` (`z-index: 265`), tạo thành một làn hoa tri ân ngập tràn không gian khi mở ra dòng chữ **“CẢM ƠN THẦY CÔ”**, sau đó tự động lắng xuống để người xem tập trung vào hình tượng người thầy và ảnh thật bên cô Liệu.
