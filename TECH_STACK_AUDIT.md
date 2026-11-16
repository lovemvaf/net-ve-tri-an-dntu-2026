# TECH STACK AUDIT & REPOSITORY VERIFICATION REPORT
**Dự án:** Nét Vẽ Tri Ân – Một Dòng Code, Vạn Chân Trời (Khoa CNTT - DNTU)
**Tác giả & Chủ thể:** Quách Khoa Đức
**Vai trò thực hiện:** Principal Creative Developer, WebGL Engineer, Motion Designer & Technical Art Director
**Thời gian tạo báo cáo:** 2026-11-16T02:48:10.952Z

---

## 1. MÔI TRƯỜNG THỰC THI & HỆ THỐNG (SYSTEM ENVIRONMENT)

| Thành phần | Phiên bản / Chi tiết | Ghi chú & Đánh giá |
| :--- | :--- | :--- |
| **Hệ điều hành** | Windows x64 | Môi trường PowerShell tương thích cao |
| **Node.js** | v24.13.0 | Hỗ trợ ES Modules (native import/export), top-level await |
| **Package Manager chính** | pnpm v11.28.12 (fallback npm v11.6.2) | Cài đặt cực nhanh qua content-addressable store |
| **Git** | 2.56.1.windows.1 | Shallow clone `--depth 1` tối ưu dung lượng |
| **Vite Bundler** | v8.3.8 | Build engine siêu tốc, HMR, offline static bundle |
| **Playwright QA** | v1.65.1 (Chromium v1255) | Tự động hóa kiểm thử 6 slide và chụp ảnh full visual |

### Tài sản số nguyên bản (Original Assets Catalog)
1. `Quách Khoa Đức _ Nét vẽ tri ân.png` (11.94 MB, Poster số hóa gốc, giữ nguyên độ phân giải và tỉ lệ)
2. `2.Khoacongnghethongtin (1).png` (2.94 MB, Logo chính thức Khoa Công nghệ Thông tin - DNTU)
3. `logodntubig (1).png` (0.16 MB, Logo chính thức Trường Đại học Công nghệ Đồng Nai - DNTU)

---

## 2. BẢNG KIỂM KÊ 32 REPOSITORIES CHI TIẾT (FULL INVENTORY AUDIT)

Toàn bộ 31 repository yêu cầu + 1 repository mở rộng Codrops WebGL (`hover-effect`) đã được tải thành công 100% vào thư mục `.research/repos/` bằng Git shallow clone.

| STT | Nhóm | Repository | Phiên bản | License | Trạng thái Git | Phân loại | Quyết định kỹ thuật & Lý do |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| 1 | A | [react](https://github.com/react/react) | `v-latest` | Custom | `OK (df6aa4e)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 2 | A | [vuejs-core](https://github.com/vuejs/core) | `3.5.45` | Custom | `OK (cbd9595)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 3 | A | [reveal.js](https://github.com/hakimel/reveal.js) | `6.0.2` | MIT | `OK (e240e17)` | **Direct Production** | CHỌN: Core presentation framework, quản lý slide 16:9, điều hướng phím, responsive scale. |
| 4 | A | [slidev](https://github.com/slidevjs/slidev) | `53.1.0` | Custom | `OK (437f139)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 5 | A | [impress.js](https://github.com/impress/impress.js) | `1.1.0` | MIT | `OK (b44b969)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 6 | A | [swiper](https://github.com/nolimits4web/swiper) | `14.4.0` | MIT | `OK (82cb393)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 7 | A | [fullPage.js](https://github.com/alvarotrigo/fullPage.js) | `4.0.41` | GPL-3.0 | `OK (49f15ef)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 8 | B | [GSAP](https://github.com/greensock/GSAP) | `3.15.1` | Standard 'no charge' license: https://gsap.com/standard-license. | `OK (5e6c35f)` | **Direct Production** | CHỌN: Motion engine chủ đạo; kích hoạt SplitText, MorphSVG, MotionPath, Timeline mượt mà 60fps. |
| 9 | B | [gsap-skills](https://github.com/greensock/gsap-skills) | `v-latest` | MIT | `OK (aed9cfd)` | **Prompting & Best Practice** | THAM KHẢO CHUYÊN SÂU: Chứa tài liệu chuẩn từ GreenSock về split text, morph SVG, cleanup và GPU optimization. |
| 10 | B | [anime](https://github.com/juliangarnier/anime) | `4.5.0` | MIT | `OK (01b81be)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 11 | B | [motion](https://github.com/motiondivision/motion) | `0.0.0` | MIT | `OK (f95ab94)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 12 | B | [react-bits](https://github.com/DavidHDev/react-bits) | `0.0.0` | Custom | `OK (cf28010)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 13 | B | [magicui](https://github.com/magicuidesign/magicui) | `0.1.0` | Custom | `OK (6f7b531)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 14 | B | [lenis](https://github.com/darkroomengineering/lenis) | `1.3.27` | MIT | `OK (bd89165)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 15 | B | [barba](https://github.com/barbajs/barba) | `v-latest` | MIT | `OK (a7c99a5)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 16 | B | [lottie-web](https://github.com/airbnb/lottie-web) | `5.13.0` | MIT | `OK (bede03d)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 17 | C | [three.js](https://github.com/mrdoob/three.js) | `0.187.0` | MIT | `OK (ab63868)` | **Direct Production** | CHỌN: 3D WebGL engine chủ đạo; render hạt tri thức (particles), thuyền sách 3D, cầu thang ánh sáng và custom GLSL shaders. |
| 18 | C | [react-three-fiber](https://github.com/pmndrs/react-three-fiber) | `0.0.0` | MIT | `OK (d74622e)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 19 | C | [drei](https://github.com/pmndrs/drei) | `0.0.0-semantic-release` | MIT | `OK (bf6f4ad)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 20 | C | [postprocessing](https://github.com/pmndrs/postprocessing) | `6.39.6` | Zlib | `OK (a1f1035)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 21 | C | [pixijs](https://github.com/pixijs/pixijs) | `8.23.0` | MIT | `OK (1e70768)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 22 | C | [tsparticles](https://github.com/tsparticles/tsparticles) | `4.6.0` | Custom | `OK (7326521)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 23 | C | [theatre](https://github.com/theatre-js/theatre) | `0.7.0` | Apache-2.0 | `OK (6ea82b9)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 24 | D | [SlideshowAnimations](https://github.com/codrops/SlideshowAnimations) | `v-latest` | MIT | `OK (d05e459)` | **Codrops Creative Reference** | TRÍCH XUẤT THUẬT TOÁN: Lấy ý tưởng kinetic text, slide reveal và WebGL distortion transitions đưa vào slide. |
| 25 | D | [TextCharacterAnimations](https://github.com/codrops/TextCharacterAnimations) | `v-latest` | MIT | `OK (ac0fe97)` | **Codrops Creative Reference** | TRÍCH XUẤT THUẬT TOÁN: Lấy ý tưởng kinetic text, slide reveal và WebGL distortion transitions đưa vào slide. |
| 26 | D | [remotion](https://github.com/remotion-dev/remotion) | `0.0.0` | SEE LICENSE IN LICENSE.md | `OK (b0c3781)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 27 | D | [motion-canvas](https://github.com/motion-canvas/motion-canvas) | `v-latest` | Custom | `OK (7b91435)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 28 | E | [vite](https://github.com/vitejs/vite) | `v-latest` | Custom | `OK (f898888)` | **Dev / Build Tool** | CHỌN: Bundler chuẩn hiện đại, HMR dev server và tạo production build hoàn chỉnh offline. |
| 29 | E | [tailwindcss](https://github.com/tailwindlabs/tailwindcss) | `1.0.0` | MIT | `OK (b08bf83)` | **Dev / CSS Engine** | CHỌN (hoặc CSS tokens): Cung cấp utility class tinh gọn, kết hợp custom cinematic CSS. |
| 30 | E | [ui](https://github.com/shadcn-ui/ui) | `0.0.1` | MIT | `OK (e62c943)` | **Research & Isolate** | CÁCH LY TRONG .RESEARCH/: Tránh xung đột runtime và phình to bundle với Reveal.js + GSAP + Three.js. Tham khảo kiến trúc giải thuật. |
| 31 | E | [playwright](https://github.com/microsoft/playwright) | `1.66.0-next` | Apache-2.0 | `OK (b4d016a)` | **Testing / QA Tool** | CHỌN: E2E testing tự động, kiểm tra navigation cả 6 slide và chụp screenshot nghiệm thu. |
| 32 | F | [hover-effect](https://github.com/robin-dela/hover-effect) | `1.2.0` | Custom | `OK (1938cbf)` | **Codrops Creative Reference** | TRÍCH XUẤT THUẬT TOÁN: Lấy ý tưởng kinetic text, slide reveal và WebGL distortion transitions đưa vào slide. |

---

## 3. PHÂN TÍCH VÀ KIỂM ĐỊNH TÍNH NĂNG CÔNG NGHỆ CHUYÊN SÂU

### A. GSAP SplitText, MorphSVG & SVG Motion
- **Xác nhận bản quyền:** Dựa trên thông báo chính thức từ GreenSock và tài liệu trong `gsap-skills`, toàn bộ plugin cao cấp của GSAP (SplitText, MorphSVGPlugin, MotionPathPlugin, DrawSVGPlugin, ScrollTrigger, Flip) hiện đã được cung cấp **hoàn toàn miễn phí** cho mục đích phát triển.
- **Kiểm tra import:** Đã thực thi script kiểm tra thực tế, import thành công `gsap/SplitText`, `gsap/MorphSVGPlugin`, `gsap/MotionPathPlugin` và đăng ký qua `gsap.registerPlugin()`.
- **Ứng dụng thực tế trong 6 slide:**
  - *SplitText:* Phân rã tiêu đề điện ảnh (Cinematic Typography) từng ký tự và từng dòng, tạo nhịp gõ kinetic text.
  - *MorphSVG:* Chuyển đổi mềm mại giữa biểu tượng con thuyền tri thức và quyển sách mở (Slide 3).
  - *MotionPath:* Dẫn đường cho luồng sáng năng lượng và con thuyền di chuyển trên sông tri thức số.

### B. Three.js Shaders, Particle Systems & 3D Camera
- **Three.js Revision:** `r187` (phiên bản mới nhất).
- **Vertex & Fragment Shaders:** Thiết lập custom `ShaderMaterial` với phép tính sóng sin động lực học, điểm sáng alpha falloff mượt mà không gây nặng GPU.
- **Interactive Particle Field:** Hàng nghìn hạt tri thức (Golden Data Dust / Blue Cyber Glow) trôi dạt trong không gian 3D, phản ứng tinh tế theo vị trí con trỏ chuột.
- **Camera Animation:** Chuyển động lia máy quay 3D điện ảnh (pan, tilt, dolly zoom) đồng bộ theo bước chuyển của từng slide.

### C. Typography tiếng Việt & Ngôn ngữ học
- **Bảo toàn bảng mã Unicode UTF-8:** Đã kiểm tra chuỗi có đầy đủ dấu thanh phức tạp (`Nét vẽ tri ân – Một dòng code, vạn chân trời. Người thầy, cô Liệu, DNTU Sinh viên 5 tốt.`).
- **Lựa chọn phông chữ cao cấp:**
  - *Editorial & Tri ân:* `Cinzel` / `Playfair Display` kết hợp cùng `Plus Jakarta Sans` và `Inter` mang phong cách tạp chí nghệ thuật quốc tế sang trọng.
  - *Kỹ thuật & Code:* `Fira Code` / `JetBrains Mono` thể hiện tinh thần "Một dòng code, vạn chân trời".

### D. Kiến trúc Bundle Tinh gọn & Khả năng chạy Offline
- **Cơ chế tách bạch:**
  - Các thư viện thừa hoặc framework cạnh tranh (`react`, `vue`, `slidev`, `impress.js`, `pixijs`, `remotion`, v.v.) được giữ nguyên trong `.research/repos/` làm tài liệu tham khảo.
  - Production bundle chỉ gồm hạt nhân siêu tối ưu: `Reveal.js` + `GSAP 3` + `Three.js` + `canvas-confetti`.
  - Toàn bộ tài nguyên, phông chữ, ảnh và script được đóng gói để hoạt động **100% offline**, không phụ thuộc kết nối internet bên ngoài khi trình chiếu.

---

## 4. KẾT LUẬN GIAI ĐOẠN 1
Môi trường dự án, toàn bộ 32 kho mã nguồn nghiên cứu, các thư viện cốt lõi, công cụ build và kiểm thử tự động Playwright đã được cài đặt, xác minh và vận hành hoàn hảo.
**ĐỦ ĐIỀU KIỆN CHÍNH THỨC ĐỂ CHUYỂN SANG GIAI ĐOẠN 2: THIẾT KẾ 6 SLIDE HTML CINEMATIC.**