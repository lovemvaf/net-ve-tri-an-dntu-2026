# V10 VIDEO & VISUAL QA REPORT — NÉT VẼ TRI ÂN DNTU 2026
## Nghiệm Thu Hình Ảnh & Video Chu Kỳ Lặp 4–7 Giây Trên Toàn Bộ 13 Trạng Thái (`Slide` & `Subscene`)

---

## 1. Kiểm Thử Trực Quan Hệ Thống Hoa Nở Rộ (`FloralBloomSystem`) & Chu Kỳ 4–7 Giây

Các ảnh chụp thực tế tại `test-results/v10-screenshots/` và chuỗi frame video tại `test-results/v10-video-frames/` xác nhận:

1. **Hoa thực sự nở rộ (`v10-debug-floral-bloom.png`, `v10-01-landing.png`, `v10-12-slide6-tribute.png`):**
   - Những đóa hoa hồng phấn, cúc vàng champagne và hướng dương tri thức (`đường kính 68px–112px`) xuất hiện từ nụ, mở dần hai tầng cánh (`outer ring` & `inner ring`), tỏa 2 đốm phấn sáng vàng xoay quanh đài nhụy rồi tách cánh bay vào làn gió.
2. **Chu kỳ lặp 4–7 giây hoạt động tự động trên mọi cảnh (`Test 3` trong `tests/slides_cinematic.spec.js`):**
   - Khi giữ nguyên một cảnh trong `5,5 giây` mà không thao tác chuột/bàn phím, bộ đếm `totalBurstsTriggered` tự động tăng lên, phát đợt hiệu ứng mới theo chuỗi `SOFT → MEDIUM → SOFT → GRAND`.
3. **Nhận diện chính xác từng cảnh con (`sceneId`):**
   - Bốn cảnh con của **Slide 03** (`s3-step-1` Con thuyền, `s3-step-2` Cầu thang, `s3-step-3` AI & Bình minh, `s3-step-4` Toàn cảnh) và ba chặng của **Slide 05** (`s5-stage-1`, `s5-stage-2`, `s5-stage-3`) đều chuyển đổi đúng hồ sơ hiệu ứng (`data-scene-id`).
4. **Bảo vệ tuyệt đối nội dung (`Safe Corridor Masking`):**
   - Không có bất kỳ bông hoa, cánh chim hay hạt sáng nào che chữ, che logo, che khuôn mặt cô Liệu / sinh viên tại Slide 05 hay che bức Poster nguyên bản tại Landing và Cảnh kết (`POSTER_FULLY_VISIBLE = TRUE`).

---

## 2. Danh Sách Video Kiểm Thử V10 (`test-results/v10-videos/`)

- `video1-v10-landing-floral-bloom.webm`: Ghi lại cảnh mở đầu Landing 20/11 qua 2 chu kỳ lặp liên tiếp (Opening Grand Burst → khoảng nghỉ dịu → đợt Soft/Medium Burst tự động kích hoạt sau ~5,1 giây).
- `video2-v10-slide3-subscenes.webm`: Ghi lại 4 cảnh con của Slide 03 (Con thuyền sách với đàn chim → Cầu thang với bụi vàng bay lên → AI & Bình minh → Toàn cảnh tác phẩm).
- `video3-v10-slide5-to-6-tribute.webm`: Ghi lại 3 chặng ảnh thật Slide 05 (với ảnh dự án CLB Khoa học Máy tính – Khoa CNTT DNTU và ảnh trao hoa tặng cô Liệu) chuyển sang Đại cảnh Hoa Nở Tri Ân tại Slide 06.
- `video4-v10-finale-recurring-hold.webm`: Ghi lại Cảnh kết Toàn bộ Poster qua nhiều chu kỳ 4–7 giây liên tiếp trong trạng thái **Final Hold** an toàn.
