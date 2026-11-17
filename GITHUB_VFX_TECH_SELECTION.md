# GITHUB VFX TECH SELECTION V9 — NÉT VẼ TRI ÂN DNTU 2026
## Nghiên Cứu, Đánh Giá & Tuyển Chọn Giải Pháp Kỹ Thuật VFX Từ 15 Repository GitHub

---

## 1. Danh Sách Các Repository Đã Truy Xuất & Kiểm Tra Trực Tiếp Tại `.research/repos/`

Toàn bộ các repository yêu cầu trong Mục III của Master Prompt V9 đã được shallow-clone về `.research/repos/` (nâng tổng số repository nghiên cứu cục bộ lên **43 repo**) và kiểm tra mã nguồn, giấy phép, kiến trúc:

| Nhóm | Repository | Phiên bản / Kiến trúc | Đánh giá & Vai trò trong V9 |
| :--- | :--- | :--- | :--- |
| **A. Core Engine** | `mrdoob/three.js` | `^0.187.0` (MIT) | **Tích hợp trực tiếp:** Dựng không gian chiều sâu 3D, sương mù học thuật (`FogExp2`), mặt phẳng shader ánh sáng bình minh và trường hạt không gian. |
| **A. Core Engine** | `greensock/GSAP` | `^3.15.1` (Standard) | **Tích hợp trực tiếp:** Điều phối timeline chuyển cảnh, camera pan/zoom 4 góc nhìn Slide 03, hiệu ứng mở màn rèm bình minh và kịch bản nội slide. |
| **A. Core Engine** | `hakimel/reveal.js` | `^6.0.2` (MIT) | **Tích hợp trực tiếp:** Quản lý khung trình chiếu 16:9 (`1920×1080`) và chế độ Tổng quan (`Overview Mode`). |
| **A. Core Engine** | `catdad/canvas-confetti` | `^1.9.4` (ISC) | **Tham khảo vật lý rơi & lật 3D:** Áp dụng cơ chế góc lật 3 trục (`tiltAngle`, `wobble`, `decay`) cho hệ thống cánh hoa 20/11 xoay hai mặt màu tự nhiên. |
| **B. Advanced VFX** | `Alchemist0823/three.quarks` | Monorepo TypeScript (MIT) | **Áp dụng kiến trúc Emitter & Curve-Over-Lifetime:** Học hỏi mô hình `BezierCurve` cho `SizeOverLifetime`, `ColorOverLifetime` và `BurstEmitter` để tạo 3 cao trào Grand Moments có nhịp mở đầu – đạt đỉnh – lắng xuống. |
| **B. Advanced VFX** | `tsparticles/tsparticles` | Modular TS (MIT) | **Tham khảo cấu hình mật độ thích ứng:** Áp dụng cơ chế tự động co giãn số lượng hạt theo năng lực phần cứng (`PerformanceController`). |
| **B. Advanced VFX** | `pmndrs/postprocessing` | WebGL2 EffectComposer | **Chỉ tham khảo (Không gắn vào runtime):** Tránh dùng full-screen postprocessing bloom pass làm giảm FPS trên trình duyệt tích hợp / máy chiếu phổ thông; thay bằng **Pre-Rendered Radial Bokeh & Halo Sprites** đạt chất lượng tương đương ở `< 0.4ms/frame`. |
| **B. Advanced VFX** | `mustache-dev/Three-VFX` | Instanced Mesh VFX | **Tham khảo kỹ thuật Batching:** Sử dụng bộ đệm `Float32Array` và sprite pre-caching để vẽ hàng trăm hạt mà không cấp phát bộ nhớ rác (Zero GC). |
| **C. Flocking & Birds** | `omniharmonic/murmurations` | Three.js Boids (MIT) | **Áp dụng thuật toán Boids có chọn lọc:** Kết hợp 3 quy tắc *Cohesion – Alignment – Separation* với đường dẫn cong Bezier để đàn chim bay tự nhiên, không xếp hàng cứng nhắc. |
| **C. Flocking & Birds** | `parag-labs/gpu-flock` | WebGPU/WebGL2 Boids | **Tham khảo định hướng vận tốc (Velocity Orientation):** Xoay thân và sải cánh chim theo vector vận tốc thực tế $\text{atan2}(v_y, v_x)$ kèm độ nghiêng khi lượn. |
| **D. Transitions** | `codrops/interlude` | WebGL Camera Transition | **Tham khảo nhịp điệu chuyển cảnh:** Chuyển cảnh có một hướng chuyển động chủ đạo kết nối cảm xúc giữa hai cảnh. |
| **D. Transitions** | `codrops/ShapesSlideshow` | SVG / Clip-Path Wipe (MIT) | **Áp dụng kỹ thuật Soft Layered Veil & Curtain Reveal:** Dùng màn ánh sáng mở đôi và sóng lụa mềm mại khi chuyển cảnh. |
| **D. Transitions** | `codrops/SlideshowAnimations` | GSAP Scale & Parallax | **Áp dụng trực tiếp:** Hiệu ứng lùi nhẹ camera (`scale: 1.04 → 1.0`) khi hé lộ Toàn bộ Poster ở Cảnh kết. |
| **D. Transitions** | `codrops/LiquidDistortion` | Displacement Shader | **Không áp dụng lên ảnh người thật:** Tuân thủ nghiêm ngặt quy tắc không làm biến dạng khuôn mặt thầy cô, sinh viên hay poster gốc. |
| **E. Creative Coding** | `PSCactux/fluid-particles` | Curl-Noise Flow Field (MIT) | **Áp dụng trực tiếp thuật toán Curl-Noise Flow Field ($\mathbf{v} = (\partial\psi/\partial y, -\partial\psi/\partial x)$):** Tạo hiệu ứng **Golden Particle Wave (*A Thousand Lights of Gratitude*)** với hàng trăm đốm sáng bay thành dòng chảy uốn lượn mềm mại qua bầu trời. |
| **E. Creative Coding** | `mattdesl/canvas-sketch-util` | Toán học nội suy & easing | **Áp dụng các hàm nội suy mượt (`smoothstep`, `cubicBezier`, `damp`)** cho quỹ đạo chim bay, hoa bay và dòng hạt sáng. |

---

## 2. Quyết Định Kiến Trúc Engine Cho V9

Để đạt đồng thời **độ hoành tráng nhìn thấy rõ bằng mắt thường trên màn chiếu 1920×1080** VÀ **tốc độ khung hình 60 FPS ổn định trên laptop phổ thông**, bản V9 sử dụng kiến trúc **Dual-Canvas + WebGL Hybrid VFX Engine** được điều phối bởi một vòng lặp `requestAnimationFrame` duy nhất:

1. **Lớp 0 — `#webgl-canvas` (`z-index: 0`, Three.js WebGL):**
   - Mặt phẳng shader ánh sáng bình minh và các tia sáng khuếch tán mềm + hạt không gian chiều sâu.
2. **Lớp 1 — `#ambient-sky-canvas` (`z-index: 1`, 2D Pre-Cached Sprite Pass):**
   - **Multi-Layer Starfield 3 tầng:** `Far Field` (110 sao nhỏ lấp lánh dịu), `Middle Field` (55 sao vừa & bụi sáng vàng trôi theo gió), `Near Field` (18 đốm bokeh lớn mềm mại).
   - **Ambient Bird Flock:** Đàn chim bay ở tầng trời cao với kích thước nhìn thấy rõ (`26px–48px`), nhịp vỗ cánh 2 khớp tự nhiên.
   - **Ambient Floral Drift:** Những cánh hoa 20/11 xoay 3D hai mặt màu bay nhẹ ở vùng rìa sân khấu.
3. **Lớp 3 — `#grand-vfx-canvas` (`z-index: 265`, nằm TRÊN `.reveal` và `#landing-page`, `pointer-events: none`):**
   - Đây là đột phá quan trọng nhất của V9: vì `#grand-vfx-canvas` nằm ở `z-index: 265` (trên khung `.slide-frame`), các đại cảnh **Golden Particle Wave (220 hạt sáng dòng chảy Curl-Noise)**, **Floral Storm (80 cánh hoa 20/11 xoay 3D hai mặt màu bay thành làn sóng lớn)** và **Grand Bird Flock (16 cánh chim sải cánh `32px–64px` bay hướng về chân trời)** **KHÔNG CÒN BỊ TẤM NỀN `.slide-frame` CHE KHUẤT**!
   - Đồng thời, `#grand-vfx-canvas` áp dụng **Smart Content-Safe Corridor Masking**: dòng hạt, làn hoa và đàn chim lướt rực rỡ qua bầu trời phía trên, hai cánh sân khấu, viền hào quang quanh poster và toàn màn hình trong nhịp chuyển cảnh (`0.0s–1.8s`), nhưng tự động làm dịu độ mờ tại tâm vùng chữ/khuôn mặt và rút êm về nền nghỉ sau `3.2s–3.8s`.
