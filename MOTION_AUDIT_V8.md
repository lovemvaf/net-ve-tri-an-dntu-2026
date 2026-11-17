# MOTION AUDIT V8 — NÉT VẼ TRI ÂN DNTU 2026
## Kiểm Kê Toàn Bộ Hệ Thống Hoạt Ảnh & Kế Hoạch Tinh Gọn Nghệ Thuật (Calm Foreground — Rich Background)

---

## 1. Mục Tiêu Kiểm Kê (Phase 1)

Trước khi nâng cấp lên **V8 (Ultimate Cinematic Ambient Masterpiece)**, toàn bộ mã nguồn hiện tại (`index.html`, `src/styles/main.css`, `src/scripts/webgl-background.js`, `src/scripts/motion-controller.js`, `src/scripts/slides-app.js`) đã được rà soát chi tiết để phân loại từng hiệu ứng theo nguyên tắc:

- **Lớp 1 — Content Layer (Ưu tiên tuyệt đối):** Poster nguyên bản, hình tượng người thầy, ảnh thật Cô Liệu & Khoa CNTT – DNTU, tiêu đề, 5 tiêu chí Sinh viên 5 tốt, logo DNTU & Khoa CNTT. Luôn sắc nét, rõ ràng, không bao giờ bị dây sáng, hạt sáng hay cánh hoa bay đè lên.
- **Lớp 2 — Atmospheric Layer (Nền sống động, có chiều sâu & khoảng nghỉ):** Bầu trời đêm học thuật chuyển bình minh vàng ấm, cụm sao đa tầng, bụi vàng theo cụm, mây mờ chân trời, chim bay xa và cánh hoa ở vùng rìa an toàn.
- **Lớp 3 — Cinematic Accent Layer (Chỉ bùng nổ đúng thời điểm):** Ba khoảnh khắc **Grand Cinematic Moments** (*Landing Opening*, *Slide 05 → Slide 06: A Thousand Thank-Yous*, và *Full Poster Finale: Beyond the Horizon*).

---

## 2. Bảng Kiểm Kê Chi Tiết Các Hiệu Ứng Hiện Tại

| Thành phần / Hiệu ứng | Vị trí trong mã nguồn | Đánh giá vấn đề hiện tại | Quyết định V8 | Lý do nghệ thuật & kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| **`#landing-pen-stroke` (Đường dây vàng cắt ngang Landing)** | `index.html` (`L106`) + `motion-controller.js` | Đường cong SVG dài cắt ngang qua tiêu đề `NÉT VẼ TRI ÂN` và câu slogan, gây rối mắt ngay trang mở đầu. | **LOẠI BỎ** | Giải phóng hoàn toàn vùng chữ bên trái và trung tâm poster trên Landing Page. |
| **`#sky-horizon-ribbons` (`r1` liền & `r2` nét đứt)** | `index.html` (`L44-47`) | Hai đường dây chạy ngang toàn bộ phần đầu trang (`1920px`), cắt qua phía trên header gây cảm giác như đường kẻ kỹ thuật. | **LOẠI BỎ** | Thay bằng dải mây mờ (soft horizon mist) và ánh bình minh khuếch tán mềm mại không có viền cứng. |
| **`constellationLines` (`THREE.Line` 3D)** | `webgl-background.js` (`L219-236`) | Đường dây 3D chạy chéo qua không gian nền phía sau slide, không đóng góp ý nghĩa rõ ràng và gây nhiễu thị giác. | **LOẠI BỎ** | Giữ không gian 3D sạch sẽ cho sao, bụi vàng và ánh sáng chân trời. |
| **`#transition-light-path`, `#transition-secondary-path`, `#transition-stair-steps`, `#transition-silk-ribbon`** | `index.html` (`L101-136`) + `motion-controller.js` | Khi chuyển cảnh, nhiều đường dây nét liền, nét đứt và các thanh ngang cắt qua giữa màn hình và đè lên mặt poster/chữ (như thấy rõ trong ảnh chụp mid-transition V6). | **THAY THẾ HOÀN TOÀN** | Thay bằng hệ thống **Smooth Atmospheric Transition Director**: lớp ánh sáng lụa mềm (`soft radial/linear veil`), sóng mở trang sách dịu và cánh hoa/hạt sáng hội tụ tinh tế, tuyệt đối không dùng dây cắt ngang màn hình. |
| **`#slide3-camera-svg` (Đường nét đứt + 3 chấm tròn đè lên Poster)** | `index.html` (`L485-490`) | Vẽ đường nét đứt màu vàng đè trực tiếp lên bức poster gốc tại Slide 03, làm giảm vẻ đẹp nguyên bản của tác phẩm. | **LOẠI BỎ** | Để bức poster nguyên bản hiển thị trong trẻo 100% khi camera pan/zoom qua 4 góc nhìn. |
| **`.criteria-connector-svg` (Đường nét đứt nối 5 tiêu chí)** | `index.html` (`L595-597`) | Đường kẻ nét đứt chạy ngang phía sau 5 thẻ tiêu chí Sinh viên 5 tốt, tạo cảm giác sơ đồ kỹ thuật cứng nhắc. | **LOẠI BỎ** | Thay bằng hiệu ứng ánh sáng lan tỏa nhẹ nhàng qua 5 thẻ tiêu chí. |
| **`#landing-floating-petals` & `#sky-tribute-petals` (Cánh hoa SVG hình bầu dục tĩnh)** | `index.html` (`L68-75`, `L108-115`) | Các hình oval SVG đơn giản đứng yên hoặc trôi cứng, có vị trí rơi vào vùng nội dung chữ ở hai cánh trái/phải. | **THAY THẾ BẰNG `FloralSystem` CANVAS** | Vẽ cánh hoa hồng/cúc nghệ thuật có độ chuyển sắc mềm, xoay nghiêng tự nhiên và khóa chặt trong **Vùng Rìa An Toàn (Safe Margin)** ở trạng thái thường. |
| **`#sky-birds-far` & `#sky-birds-near` (Chim SVG tĩnh trên DOM)** | `index.html` (`L51-66`) | Sau khi tắt CSS keyframes để tránh nghẽn CPU SVG, các cánh chim SVG bị đứng yên trên nền trời. | **THAY THẾ BẰNG `BirdSystem` CANVAS** | Chim cách điệu thanh lịch bay theo quỹ đạo cong Bezier với nhịp vỗ cánh mượt mà trên tầng Canvas nền (`< 0.3ms/frame`), có chu kỳ bay và khoảng nghỉ tự nhiên. |
| **Đường sáng từ tay Người thầy (`Slide 02`) & Nét gạch chân tiêu đề** | `index.html` (`L207`, `L292`, `L392`) | Có ý nghĩa trực tiếp (ánh sáng khai mở `1 print("Hello, DNTU")` và điểm nhấn dưới tiêu đề chính). | **GIỮ & LÀM DỊU** | Giữ lại với độ mờ tinh tế (`opacity: 0.65`), nét vẽ mượt, không nhấp nháy. |
| **Hệ thống điều hướng 13 trạng thái (12 lần bấm Tiếp)** | `slides-app.js` + `presentation-data.js` | Đã tối ưu hoàn hảo ở V5/V6, chính xác như PowerPoint. | **GIỮ NGUYÊN 100%** | Không tăng thêm bất kỳ lần bấm nào; mọi hiệu ứng nền và 3 Grand Moments đều tự chạy theo timeline. |
| **Ảnh thật Slide 05 Chặng 01 (`curated-20-clb-cntt-dntu-project.jpg`) & Ảnh Cô Liệu** | `presentation-data.js` + `index.html` | Đã thay thế bằng ảnh thật sắc nét của Quách Khoa Đức cùng CLB Khoa học Máy tính – Khoa CNTT DNTU và các ảnh thật bên Cô Liệu. | **GIỮ NGUYÊN 100%** | Bảo toàn trọn vẹn giá trị chân thực và cảm xúc tri ân thầy cô. |

---

## 3. Kiến Trúc Chuyển Động Mới Trong V8

1. **`AmbientEnvironment` + `Starfield` + `GoldenDust`:**
   - Nền trời đa tầng kết hợp WebGL volumetric glow + Canvas 2D sprite pass độ phân giải chuẩn (`dpr = 1`), tạo bầu trời đêm xanh học thuật chuyển sắc bình minh vàng ấm.
   - **65 ngôi sao đa tầng** (kích thước `0.8px–2.5px`, độ sáng khác nhau, một vài sao lớn có quầng sáng dịu, nhịp thở rất chậm).
   - **38 hạt bụi vàng (`Golden Dust`)** phân bố theo cụm tự nhiên ở vùng rìa sân khấu, tự động mờ dần (`safe-zone masking`) khi tiến gần trung tâm để **không bao giờ bay qua mặt người, chữ hay poster**.
2. **`BirdSystem` (Cánh chim khát vọng):**
   - Chim cách điệu thanh lịch bay theo đường cong Bezier ở tầng trời cao (`y = 3%..13%`), chỉ xuất hiện tại **Landing Opening**, **Slide 03 (Con thuyền tri thức)**, **Chuyển cảnh Slide 03 → 04**, và **Grand Finale** (cùng các đợt *Ambient Accent* nhẹ nhàng cách quãng).
3. **`FloralSystem` (Hoa tri ân 20/11):**
   - Cánh hoa hồng phấn, kem ngà và vàng ấm có hình dáng cánh hoa tự nhiên, bay rất thưa ở vùng rìa trong trạng thái thường và hội tụ ấm áp trong **Grand Moment 02 (`Slide 05 → Slide 06`: *A Thousand Thank-Yous*)**.
4. **`MotionOrchestrator` (Nhịp thở khi đang thuyết trình):**
   - Luân chuyển tự nhiên giữa **State 1 — Resting Atmosphere** và **State 2 — Ambient Accent** (mỗi thời điểm chỉ kích hoạt **duy nhất 1 nhóm hiệu ứng nhẹ** rồi nghỉ `6–8 giây`), giúp không gian luôn có sức sống khi người thuyết trình đang nói mà không gây mỏi mắt.
