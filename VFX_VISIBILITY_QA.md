# VFX VISIBILITY & VIDEO QA REPORT V9 — NÉT VẼ TRI ÂN DNTU 2026
## Nghiệm Thu Khả Năng Nhìn Thấy Bằng Mắt Thường, So Sánh Trước – Sau & Phân Tích Video Frame-by-Frame

---

## 1. Bảng So Sánh Trực Quan Trước (V8) & Sau (V9)

| Hạng mục VFX | Hiện trạng ở bản V8 | Kết quả thực tế ở bản V9 (`1920×1080`) |
| :--- | :--- | :--- |
| **Layer & Compositing** | Vẽ toàn bộ ở `z-index: 1` phía sau tấm nền đục `.slide-frame` (`opacity: 0.96`), bị che khuất tới 92% diện tích màn hình. | Bổ sung **`#grand-vfx-canvas` ở `z-index: 265`** (`pointer-events: none`) nằm trên `.slide-frame` kết hợp làm trong suốt nhẹ nền `.slide-frame` (`0.68..0.78`) và `#landing-page` (`0.18`). Hiệu ứng hiển thị **100% rõ ràng trước mắt người xem**. |
| **Đàn chim bay (`BirdSystem`)** | Chỉ có 7 cá thể kích thước rất nhỏ (`13px–24px`) ép sát mép trên `y = 34px..56px`, đè vào thanh header. | **8 chim nền (`Ambient Flock`) + 16 chim đại cảnh (`Grand Flock`, tổng 24–26 cánh chim)** với sải cánh `32px–62px`, hoạt ảnh vỗ cánh 2 khớp (`shoulder` + `wrist`) và hào quang vàng ấm, bay thành 3 cụm có chiều sâu rõ rệt. |
| **Làn sóng hạt sáng (`Golden Particle Wave`)** | Chỉ có 38 hạt bụi tĩnh ở sát rìa ngoài màn hình, không có làn sóng chuyển động lớn. | **170–240 đốm sáng dòng chảy Curl-Noise (`A Thousand Lights of Gratitude`)** có đuôi sáng lụa ngắn (`motion trail`) lướt thành 3 dải S-curve qua không gian rồi lắng xuống êm ái. |
| **Mưa hoa tri ân (`Floral Storm`)** | Khi chuyển từ Slide 05 sang Slide 06, 16 cánh hoa bị tấm nền `.slide-frame` che khuất hoàn toàn. | **88 cánh hoa 20/11 độ phân giải cao (`56×56px`, 4 sắc độ hồng phấn – vàng champagne – trắng kem – đỏ dịu DNTU)** xoay lật 3D hai mặt bay ngập không gian sân khấu trong `3,8 giây` rồi tự động rút êm về vùng rìa. |
| **Bảo vệ vùng nội dung (`Safe Corridor Masking`)** | Cắt cứng toàn bộ vùng `[0.09..0.91] × [0.11..0.89]` khiến không gian giữa màn hình trống rỗng. | Bảo vệ thông minh lõi Poster trung tâm (`[0.35..0.65] × [0.20..0.82]`) và khuôn mặt nhân vật, cho phép hiệu ứng lướt qua bầu trời phía trên, hai cánh sân khấu và toàn màn hình trong `1,1 giây` đầu của chuyển cảnh trước khi rút về trạng thái tĩnh dễ đọc. |

---

## 2. Nghiệm Thu 4 Video Kiểm Thử Tự Động (`test-results/v9-videos/`)

Hệ thống kịch bản `scripts/record_v9_videos.mjs` đã ghi hình trực tiếp trên trình duyệt Chromium ở độ phân giải chuẩn máy chiếu `1920×1080` và trích xuất chuỗi frame theo mốc thời gian (`test-results/v9-video-frames/`):

1. **Video 1 — `video1-landing-sky.webm` (*Grand Moment 01: The Sky of Gratitude*):**
   - Frame `t = 300ms` & `t = 1000ms` (`v1-landing-t0300ms.png`, `v1-landing-t1000ms.png`): Bầu trời 3 tầng sao (`183 ngôi sao & bokeh`), làn sóng `170 hạt sáng vàng`, `42 cánh hoa 20/11` và `12 cánh chim` bừng mở quanh bức Poster nguyên bản ở trung tâm.
   - Frame `t = 3800ms` (`v1-landing-t3800ms-settled.png`): Sau cao trào mở màn, làn sóng hạt và mưa hoa tự động lắng xuống, nhường chỗ hoàn toàn cho bố cục Landing Page trang trọng.
2. **Video 2 — `video2-birds-and-sky.webm` (*Cinematic Bird Flock trên Slide 03*):**
   - Frame `t = 350ms → 2400ms` (`v2-birds-slide3-t0350ms.png`..`t2400ms.png`): Đàn chim khát vọng bay qua vùng trời phía trên con thuyền sách với nhịp đập cánh tự nhiên và độ phân tầng xa – gần rõ nét.
3. **Video 3 — `video3-floral-storm-05-to-06.webm` (*Grand Moment 02: Floral Storm Slide 05 → Slide 06*):**
   - Frame `t = 350ms → 1000ms` (`v3-floral-storm-t0350ms.png`, `v3-floral-storm-t1000ms.png`): Làn sóng **88 cánh hoa tri ân + 135 đốm sáng vàng** bay qua không gian chuyển cảnh từ hành trình thực tế sang lời tri ân **“CẢM ƠN THẦY CÔ”**.
   - Frame `t = 3800ms` (`v3-floral-storm-t3800ms-settled.png`): Mật độ hoa giảm về trạng thái nghỉ nhẹ ở rìa ngoài, giữ trọn sự trang nghiêm cho hình tượng người thầy và ảnh thật bên cô Liệu.
4. **Video 4 — `video4-final-poster-horizon.webm` (*Grand Moment 03: Beyond the Horizon — Final Poster*):**
   - Frame `t = 350ms → 1100ms` (`v4-finale-t0350ms.png`, `v4-finale-t1100ms.png`): Đôi rèm ánh sáng bình minh mở sang hai bên, **220 hạt sáng dòng chảy** và **16 cánh chim** bay hướng về phía mặt trời bình minh khi toàn bộ bức Poster nguyên bản hiện ra ở trung tâm.
   - Frame `t = 4000ms` (`v4-finale-t4000ms-final-hold.png`): Trạng thái **Final Hold** giữ nguyên bức Poster nguyên vẹn (`POSTER_FULLY_VISIBLE = TRUE`), hoàn toàn không bị bất kỳ hạt sáng hay cánh hoa nào che khuất.
