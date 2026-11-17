# CINEMATIC MOTION UPGRADE V6 — NÉT VẼ TRI ÂN DNTU 2026

## 1. Tổng Quan Kiến Trúc Chuyển Động V6

Phiên bản **V6 (Cinematic Sky & Grand Transitions)** nâng cấp toàn diện hệ thống thị giác và chuyển động của bài thuyết trình **“Nét vẽ tri ân — Một dòng code, vạn chân trời”** (tác giả **Quách Khoa Đức**, Khoa Công nghệ thông tin – Trường Đại học Công nghệ Đồng Nai / DNTU) mà **không làm tăng số lần bấm chuyển cảnh** (giữ nguyên cấu trúc **13 trạng thái / 12 lần bấm Tiếp** đã tối ưu ở V5).

Hệ thống chuyển động V6 được thiết kế trên 3 tầng đồng bộ:

1. **Tầng 1 — Bầu Trời Sống Động (`#webgl-canvas` + `#living-sky-layer`):**
   - **Những cánh chim bay (`#sky-birds-far` & `#sky-birds-near` + 3D WebGL Flock):** Hai tầng đàn chim cách điệu bay theo đường cong Bezier ở vùng bầu trời phía trên (`y = 34px..108px`), có sự khác biệt về độ sâu (đàn chim xa nhỏ và mờ dịu `opacity: 0.48`, đàn chim gần sắc nét hơn `opacity: 0.72` kèm nhịp vỗ cánh nhẹ theo hàm sin). Vị trí đường bay được khóa chặt ở vùng trời cao và rìa ngoài để **không bao giờ che chữ, khuôn mặt thầy cô/sinh viên, logo hay poster**.
   - **Hạt sáng vàng và bụi kim tuyến (`Three.js Points`):** 175 hạt ánh sáng màu vàng champagne (`#F0CC85`), trắng ngà (`#F8F1E3`), hồng phấn 20/11 (`#F4B8C4`) và xanh học thuật (`#4B7BEC`) trôi nhẹ theo chiều gió về phía chân trời bình minh.
   - **Dải mây mềm & Hào quang bình minh (`GLSL Fragment Shader` + `#sky-horizon-ribbons`):** Hai dải sóng mây bình minh kết hợp vệt nắng chéo chuyển màu mượt mà theo tâm trạng từng slide.
   - **Hoa tri ân 20/11 (`#sky-tribute-petals`):** Những cánh hoa hồng và hoa cúc vàng bay nhẹ kèm chuyển động nghiêng 3D ở rìa khung hình, nổi bật tại **Landing 20/11**, **Slide 02 (Người thầy)** và **Slide 06 (Lời tri ân & Cảnh kết)**, đồng thời tự động dịu xuống (`opacity: 0.22`) ở các slide nội dung học thuật để giữ sự tập trung tuyệt đối.

2. **Tầng 2 — 7 Đại Cảnh Chuyển Tiếp Liên Slide (`#scene-transition-overlay`):**
   - Mỗi lần chuyển giữa các slide (và khi mở Cảnh kết Toàn bộ Poster tại Slide 06) đều kích hoạt một kịch bản chuyển cảnh riêng biệt (`0.58s–0.65s`, không khóa thao tác bấm nhanh):

| Thứ tự | Chuyển cảnh | Tên hiệu ứng (`data-transition-theme`) | Mô tả nghệ thuật chuyển động |
| :--- | :--- | :--- | :--- |
| **01** | `Landing 20/11 → Slide 01` | `floral-light-gateway` (*Floral Light Gateway*) | Cánh hoa 20/11 và dải lụa vàng – đỏ uốn theo đường cong ánh sáng, mở cổng triển lãm vào chương *Khởi nguồn*. |
| **02** | `Slide 01 → Slide 02` | `the-first-light` (*The First Light*) | Luồng sáng vàng ấm quét chéo từ vùng poster sang hình tượng Người thầy bên bục giảng cùng các hạt bụi sáng. |
| **03** | `Slide 02 → Slide 03` | `book-of-knowledge` (*Book of Knowledge*) | Ánh sáng từ tay người thầy mở ra làn sóng trang sách cong vút và đàn chim bay lên, dẫn vào con thuyền tri thức. |
| **04** | `Slide 03 → Slide 04` | `stairway-to-tomorrow` (*Stairway to Tomorrow*) | 5 bậc sáng vàng nâng dần từ thấp lên cao kết hợp đàn chim bay ngang đường chân trời, hội tụ thành 5 tiêu chí *Sinh viên 5 tốt*. |
| **05** | `Slide 04 → Slide 05` | `memories-in-motion` (*Memories in Motion*) | 5 điểm sáng tiêu chí chuyển hóa thành làn sóng mở khung triển lãm Bento ảnh thật dưới mái trường DNTU. |
| **06** | `Slide 05 → Slide 06 (Cảnh 1)` | `bouquet-of-gratitude` (*A Bouquet of Gratitude*) | Dải ruy-băng lụa đỏ – vàng cùng cánh hoa 20/11 hội tụ về bó hoa tri ân, mở ra thông điệp *“CẢM ƠN THẦY CÔ”*. |
| **07** | `Slide 06 (Cảnh 1 → Cảnh 2)` | `grand-tribute-reveal` (*Grand Tribute Reveal*) | Đôi rèm ánh sáng triển lãm mở sang hai bên, đàn chim bay về phía bình minh và cánh hoa 20/11 tỏa sáng quanh **toàn bộ bức poster nguyên bản (`POSTER_FULLY_VISIBLE = TRUE`)**. |

3. **Tầng 3 — Tinh Chỉnh Hoạt Ảnh Nội Slide (Không Tăng Số Click):**
   - Mọi hiệu ứng xuất hiện tiêu đề, vẽ đường dẫn SVG (`strokeDashoffset`), thắp sáng đồng bộ 5 tiêu chí *Sinh viên 5 tốt*, chuyển vùng camera 4 góc nhìn trên Slide 03 và mở khung ảnh thật trên Slide 05 đều tự động hoàn tất mượt mà trong `0.45s–0.68s`.
