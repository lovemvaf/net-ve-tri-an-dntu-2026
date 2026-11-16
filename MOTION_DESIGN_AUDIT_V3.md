# MOTION DESIGN AUDIT V3 — CINEMATIC STORYTELLING & POWERPOINT STEP ENGINE

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Tác giả & Người trình bày:** Quách Khoa Đức — Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)  
**Phiên bản:** V3.0 (Cinematic Motion Masterpiece · Global Step-by-Step Navigation · 20/11 Floral Art)

---

## 1. TỔNG QUAN NÂNG CẤP CHUYỂN ĐỘNG TRONG PHIÊN BẢN V3

Phiên bản V3 giải quyết triệt để hai bài toán cốt lõi của trình chiếu tương tác chuyên nghiệp:
1. **Điều khiển tuần tự từng bước chuẩn PowerPoint (`Global Step-by-Step Navigation`):** Thống nhất toàn bộ trang mở đầu 20/11 và 6 slide vào một bộ máy trạng thái duy nhất gồm **34 bước kể chuyện tuần tự**. Mỗi lần bấm `Tiếp ›` (`→`, `Space`, `PageDown`, `Enter`) chỉ tiến đúng 1 bước kể chuyện, đi hết tất cả cảnh con trong slide rồi mới chuyển sang slide kế tiếp.
2. **Ngôn ngữ chuyển động nghệ thuật phục vụ câu chuyện (`Story-Driven Motion Design`):** Mọi hoạt ảnh từ nét bút vàng vẽ đường cong ánh sáng, bó hoa tri ân 20/11 đan xen mạch điện tử CNTT, camera pan/zoom khám phá poster gốc, cho đến hiệu ứng thắp sáng tuần tự 5 tiêu chí *Sinh viên 5 tốt* đều gắn chặt với nội dung thuyết trình của Quách Khoa Đức.

---

## 2. KIẾN TRÚC CÔNG NGHỆ CHUYỂN ĐỘNG (MOTION STACK)

| Thành phần | Công nghệ sử dụng | Vai trò trong V3 |
|---|---|---|
| **Timeline & Step Choreography** | **GSAP 3.14** (`gsap.timeline`, `overwrite: 'auto'`) | Điều phối hoạt ảnh từng bước (`applyLandingStep`, `applySlide1Step`..`applySlide6Step`), hủy sạch timeline cũ khi chuyển bước nhanh (`killActiveTimeline`). |
| **Inter-Slide Light Sweep** | **SVG Path + GSAP Directional Sweep** (`#scene-transition-overlay`) | Tạo dải ánh sáng vàng champagne quét ngang màn hình kèm 2 cánh hoa bay nhẹ mỗi khi chuyển giữa các slide lớn. |
| **20/11 Floral Vector Art** | **Custom Bezier SVG + Stroke-Dashoffset Draw** | Vẽ nét bút vàng khai mở, bó hoa hồng nhung đỏ DNTU – hồng phấn – hướng dương vàng kết hợp nhánh mạch điện tử CNTT và dải ruy băng lụa. |
| **Ambient WebGL Stage** | **Three.js (`src/scripts/webgl-scene.js`)** | Không gian 3D hạt ánh sáng vàng – kem dịu nhẹ phía sau, tự động điều chỉnh mật độ và tốc độ theo từng chương cảm xúc, tạm dừng khi tab ẩn (`visibilitychange`). |
| **Stage Layout & Overview** | **Reveal.js 5 (`1920×1080` Canvas)** | Giữ tỷ lệ khung hình 16:9 chuẩn sân khấu hội trường; các handler phím mặc định của Reveal được vô hiệu hóa để nhường quyền điều khiển tuyệt đối cho `PresentationState`. |

---

## 3. NGUYÊN TẮC CHỐNG XUNG ĐỘT & ĐẢM BẢO 60FPS

- **Chỉ biến đổi các thuộc tính GPU-friendly:** `transform` (`translate3d`, `scale`, `rotate`), `opacity`, và `stroke-dashoffset`. Tuyệt đối không animate `top`, `left`, `width`, `height` hay `filter: blur()` nặng trên phần tử lớn.
- **Cơ chế `killActiveTimeline()` & `overwrite: 'auto'`:** Khi người thuyết trình bấm liên tiếp qua nhiều bước, hệ thống lập tức kết thúc timeline đang chạy, đưa các bước trước về trạng thái hoàn tất (`opacity: 1, x: 0, y: 0, scale: 1`) và chỉ chạy hoạt ảnh cho bước hiện tại.
- **Chế độ `Lite Mode` (`Phím L` / `prefers-reduced-motion`):** Rút ngắn thời lượng chuyển cảnh về tức thì, tắt hạt nổi phụ trợ nhưng vẫn bảo toàn 100% bố cục, hình ảnh và thứ tự 34 bước trình chiếu.
