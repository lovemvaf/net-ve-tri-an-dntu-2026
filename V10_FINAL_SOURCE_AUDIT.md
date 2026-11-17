# V10 FINAL SOURCE AUDIT — NÉT VẼ TRI ÂN DNTU 2026
## Kiểm Kê Toàn Diện Mã Nguồn V9 & Giải Pháp Kiến Trúc Cho Hệ Thống Vũ Trụ Hoa Tri Ân Lặp Chu Kỳ 4–7 Giây

---

## 1. Các Tệp Mã Nguồn Đã Kiểm Tra Trực Tiếp (Phase 01)

Đã rà soát chi tiết toàn bộ mã nguồn hiện có trong dự án:
- `src/scripts/webgl-background.js` (Hệ thống render nền WebGL + 2 lớp Canvas `#ambient-sky-canvas` và `#grand-vfx-canvas`)
- `src/scripts/motion-controller.js` (Điều phối chuyển cảnh GSAP và hoạt ảnh nội slide)
- `src/scripts/slides-app.js` (State machine 13 trạng thái / 12 lần bấm Tiếp, bàn phím, HUD và ghi chú diễn giả)
- `src/content/presentation-data.js` (Dữ liệu 13 trạng thái, 4 góc nhìn Slide 03, 3 chặng ảnh thật Slide 05, 2 trạng thái Slide 06)
- `src/styles/main.css` (Hệ thống stacking context, z-index, bố cục 16:9 và responsive)
- `index.html`, `package.json`, `vite.config.js` và `tests/slides_cinematic.spec.js`

---

## 2. Bốn Vấn Đề Kỹ Thuật Cốt Lõi Được Phát Hiện Trong Mã Nguồn V9

### Vấn đề 1 — `setSlideMood()` Chỉ Phụ Thuộc Vào `slideIndex`, Chưa Nhận Diện Từng Cảnh Con (`sceneId`)
- Trong `src/scripts/webgl-background.js` (`L557–596`), hàm `setSlideMood(slideIdx, isFinale)` chỉ nhận chỉ số slide (`-1..5`).
- Hệ quả:
  - Bốn cảnh con của **Slide 03** (`s3-step-1` Con thuyền sách, `s3-step-2` Cầu thang & bàn tay, `s3-step-3` AI & bình minh, `s3-step-4` Toàn cảnh tác phẩm) dùng chung một cấu hình nền, không thay đổi hướng hạt sáng hay đàn chim khi người thuyết trình chuyển giữa con thuyền, cầu thang và bình minh AI.
  - Ba chặng của **Slide 05** (`s5-stage-1` Khởi đầu, `s5-stage-2` Nỗ lực, `s5-stage-3` Thành quả & Biết ơn) dùng chung một cấu hình tĩnh.
  - Các slide **Slide 01**, **Slide 02**, **Slide 04** và **Slide 05** khi vừa mở chỉ ở trạng thái `resting` (`waveParticles.length = 0`, `floralStormPetals.length = 0`), thiếu hiệu ứng chủ đạo riêng.

### Vấn đề 2 — Hiệu Ứng Lớn Chỉ Chạy Một Lần Khi Mở Cảnh, Chưa Có Bộ Lập Lịch Lặp Chu Kỳ 4–7 Giây (`RecurringCinematicVFX`)
- Trong `webgl-background.js` (`L372–383`), khi `grandMomentElapsed >= grandMomentDuration` (`3,6–3,8 giây`), toàn bộ `waveParticles`, `floralStormPetals` và `grandFlockBirds` bị xóa trắng và hệ thống chuyển sang `resting` vĩnh viễn cho tới khi người dùng bấm sang slide khác.
- Nếu người thuyết trình dừng lại nói 45–90 giây trên một slide hoặc một cảnh con, màn hình không có thêm bất kỳ đợt hoa nở, làn sóng hạt sáng hay đàn chim mới nào.

### Vấn đề 3 — Chưa Có Hiệu Ứng **Hoa Nở Rộ Đa Giai Đoạn (`FloralBloomSystem`)**
- Phiên bản V9 đã có cánh hoa rơi (`Floral Storm`), nhưng chưa có hiệu ứng **những bông hoa thật sự nở rộ từ nụ → mở từng lớp cánh → tỏa nhụy sáng vàng → tách cánh bay theo gió** (`Flower Bloom Animation` theo yêu cầu Mục VII.B).

### Vấn đề 4 — Đồng Bộ Trạng Thái Chuyển Cảnh Trong `goToState()`
- Trong `src/scripts/slides-app.js` (`L165–173`), cờ `state.isTransitioning` và `state.isAnimating` trước đây được đặt lại bằng một `setTimeout` ngắn (`45ms`), tách rời khỏi Promise của `motion.playInterSlideTransition()`.
- Cần đồng bộ trực tiếp với lifecycle Promise của `TransitionDirector` (kèm cơ chế hủy an toàn `cancelCurrentTransition` khi người dùng bấm nhanh liên tiếp) và thông báo cho `AmbientBurstDirector` tạm hoãn đợt burst nền trong `0,45 giây` chuyển cảnh để không bao giờ chồng chéo hiệu ứng.

---

## 3. Giải Pháp Kiến Trúc Toàn Diện Trong Bản V10 (`CinematicEnvironment`)

1. **`SceneMoodManager` Theo Từng `sceneId` (13 Hồ Sơ Cảnh Độc Lập):**
   - Mỗi trạng thái trong 13 trạng thái (`landing-main`, `s1-main`, `s2-main`, `s3-step-1`, `s3-step-2`, `s3-step-3`, `s3-step-4`, `s4-main`, `s5-stage-1`, `s5-stage-2`, `s5-stage-3`, `s6-tribute`, `s6-finale-poster`) có cấu hình riêng về sắc độ bình minh, hướng dòng chảy hạt vàng, kiểu hoa nở (Hoa hồng, Hoa cúc, Hoa hướng dương tri thức) và quỹ đạo đàn chim.
2. **`FloralBloomSystem` (Hoa Nở Rộ 6 Giai Đoạn + Cánh Hoa Bay + Bụi Phấn Vàng):**
   - Vẽ những đóa hoa nghệ thuật đa lớp cánh (`outer petals`, `inner petals`, `golden pistil & stamen crown`) nở bung mượt mà từ nụ hoa, tỏa hạt phấn sáng rồi tách cánh hòa vào làn gió.
3. **`RecurringCinematicVFX` (`AmbientBurstDirector` — Chu Kỳ Lặp 4–7 Giây):**
   - Bộ lập lịch trung tâm duy nhất chạy ngay trong vòng lặp `requestAnimationFrame` (không dùng `setInterval` rời rạc), tự động kích hoạt một đợt hiệu ứng mới sau mỗi **4,5 – 6,5 giây** theo chuỗi nhịp điệu tự nhiên:
     $$\texttt{SOFT} \rightarrow \texttt{MEDIUM} \rightarrow \texttt{SOFT} \rightarrow \texttt{GRAND} \rightarrow \texttt{SOFT} \rightarrow \texttt{MEDIUM} \rightarrow \texttt{SOFT} \rightarrow \texttt{GRAND}$$
4. **Bảo Toàn Tuyệt Đối Nội Dung & Điều Hướng 13 Trạng Thái (12 Lần Bấm Tiếp):**
   - Giữ nguyên 100% nội dung, ảnh thật, poster nguyên bản, 2 logo và cấu trúc 12 lần bấm Tiếp đã tối ưu.
