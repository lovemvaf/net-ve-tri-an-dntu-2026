# QA & VISUAL SCREENSHOT VERIFICATION REPORT (V2)

**Dự án:** Nét Vẽ Tri Ân — Một Dòng Code, Vạn Chân Trời (DNTU 2026)  
**Công cụ kiểm thử:** Playwright (`@playwright/test 1.65.1` · Chromium Headless)  
**Kết quả kiểm thử tự động:** `5 / 5 Test Suites PASSED (100%)` · `0 Console Errors` · `0 Broken Images`

---

## 1. Kiểm định `POSTER_FULLY_VISIBLE = TRUE` (Landing Page & Slide 06 Finale)

Hàm kiểm định tự động `verifyPosterFullyVisible(page, selector)` trong [`tests/slides_cinematic.spec.js`](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/slides_cinematic.spec.js) đo đạc trực tiếp trên trình duyệt thật các thông số:
- `computedStyle.objectFit === 'contain'`
- `boundingClientRect.top >= 0`, `left >= 0`, `bottom <= window.innerHeight`, `right <= window.innerWidth`
- Tỷ lệ khung hiển thị khớp với tỷ lệ ảnh gốc `3000 / 5333` (`0.5625` ± `0.035`), đảm bảo **0% bị cắt xén hay biến dạng**.

| Màn hình kiểm tra | Độ phân giải | Selector | `object-fit` | `POSTER_FULLY_VISIBLE` | Ảnh chụp xác thực |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **Landing Page 20/11** | `1920×1080` | `#landing-full-poster-img` | `contain` | **`TRUE`** | [v2_00_landing_20_11.png](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/v2_00_landing_20_11.png) |
| **Slide 06 Finale (Part B)** | `1920×1080` | `#finale-full-poster-img` | `contain` | **`TRUE`** | [v2_06b_slide6_finale_full_poster.png](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/v2_06b_slide6_finale_full_poster.png) |
| **Landing Page 20/11** | `1440×900` | `#landing-full-poster-img` | `contain` | **`TRUE`** | [v2_viewport_1440x900_landing.png](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/v2_viewport_1440x900_landing.png) |
| **Slide 06 Finale (Part B)** | `1440×900` | `#finale-full-poster-img` | `contain` | **`TRUE`** | [v2_viewport_1440x900_finale.png](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/v2_viewport_1440x900_finale.png) |
| **Landing Page 20/11** | `1366×768` | `#landing-full-poster-img` | `contain` | **`TRUE`** | [v2_viewport_1366x768_landing.png](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/v2_viewport_1366x768_landing.png) |
| **Slide 06 Finale (Part B)** | `1366×768` | `#finale-full-poster-img` | `contain` | **`TRUE`** | [v2_viewport_1366x768_finale.png](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/tests/screenshots/v2_viewport_1366x768_finale.png) |

---

## 2. Đối chiếu trực quan Bản V1 và Bản nâng cấp V2

1. **Màn hình mở đầu 20/11 (`v2_00_landing_20_11.png`):**
   - **V1:** Không có màn hình mở đầu độc lập, vào thẳng Slide 01.
   - **V2:** Có Landing Page độc lập tôn vinh Ngày Nhà giáo Việt Nam 20/11 với poster gốc nguyên vẹn ở trung tâm, hào quang ánh sáng vàng dịu phía sau và nút **“KHÁM PHÁ HÀNH TRÌNH TRI ÂN”**.
2. **Slide 01 — Khởi nguồn (`v2_01_slide1_khoi_nguon.png`):**
   - **V1:** Lặp lại câu chữ giới thiệu dài.
   - **V2:** Chuyển tiếp mượt từ Landing Page vào lộ trình 4 chương cảm xúc (*Biết ơn → Khát vọng → Trưởng thành → Tiếp nối*), kết hợp dải câu thơ nền kem sáng dễ đọc từ xa.
3. **Slide 02 — Người thầy & Cô Liệu (`v2_02_slide2_nguoi_thay.png`):**
   - **V1:** Nền tối đen xanh giống các slide khác.
   - **V2:** Chuyển sang **Nền Sáng Kem Ấm (`#FBF7EF` – `#EFE3CC`)** làm nổi bật hình tượng tà áo dài trắng, bó hoa tri ân, nét sáng `1 print("Hello, DNTU")` và thẻ điểm nhấn về **cô Liệu**.
4. **Slide 03 — Con thuyền tri thức (`v2_03_slide3_con_thuyen_sach.png`):**
   - **V1:** Các nút điều khiển và thẻ chữ chiếm nhiều diện tích.
   - **V2:** Mở rộng khung hình ảnh lên 58% chiều ngang, làm nổi bật rõ hình ảnh **hai sinh viên (nam và nữ) ngồi trên con thuyền sách**, cầu thang sách có bàn tay nâng đỡ nhau và laptop `def future()` cùng biểu tượng AI.
5. **Slide 04 — Sinh viên 5 tốt (`v2_04_slide4_sinh_vien_5_tot.png`):**
   - **V1:** 5 thẻ tối màu và nút bắn pháo hoa ăn mừng.
   - **V2:** 5 trụ cột nền kem sáng nối liền bằng đường dẫn sáng vàng champagne, trang trọng và rõ chữ; loại bỏ hoàn toàn pháo hoa confetti, thay bằng nút dẫn sang triển lãm ảnh thật ở Slide 05.
6. **Slide 05 — Hành trình thực tế (`v2_05_slide5_scene1_ngay_dau.png`, `scene4_sv5tot.png`, `scene5_20_11.png`):**
   - **V1:** 6 ô placeholder bằng nhau kèm nút “Thay ảnh” hiện trên màn hình.
   - **V2:** Không gian Triển lãm 5 Cảnh bằng **13 bức ảnh thật từ `anhchoslide5va6`** (1 ảnh Hero lớn + 2 ảnh phụ bất đối xứng), ẩn hoàn toàn các nút chỉnh sửa trong Presentation Mode.
7. **Slide 06 — Tri ân & Cảnh kết Full Poster (`v2_06a_slide6_tribute_portrait.png` & `v2_06b_slide6_finale_full_poster.png`):**
   - **V1:** Dùng khung chân dung placeholder và chỉ hiển thị một dải crop nhỏ ở góc dưới.
   - **V2:** Phần A hiển thị ảnh chân dung thật của **Quách Khoa Đức** (`IMG_5524.JPG`) cùng lời cảm ơn cô Liệu, Khoa CNTT và DNTU; Phần B mở ra **Cảnh kết Toàn bộ Poster nguyên bản (`POSTER_FULLY_VISIBLE = TRUE`)** ở trạng thái nghỉ tĩnh lặng (**Final Hold State**).
