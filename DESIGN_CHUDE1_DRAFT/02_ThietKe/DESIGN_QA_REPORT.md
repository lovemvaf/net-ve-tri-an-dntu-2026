# BÁO CÁO NGHIỆM THU CHẤT LƯỢNG (DESIGN QA REPORT) — BỘ 05 ẤN PHẨM NGHỊ QUYẾT 57-NQ/TW

**Trạng thái bàn giao hiện tại:** `DRAFT_PENDING_OFFICIAL_METADATA`  
**Cuộc thi:** Trại Thanh niên số thành phố Đồng Nai năm 2026 — Vòng thực chiến  
**Phạm vi công việc:** **Mục 2 — Thiết kế** (05 ấn phẩm `1080 × 1350 px` + mã nguồn chỉnh sửa + website trình chiếu bổ trợ) thuộc **Chủ đề 1 — Nghị quyết đến gần thanh niên**  
**Ngày kiểm định:** 26/11/2026  

> **CẢNH BÁO TRẠNG THÁI HỒ SƠ (`STOP-SHIP METADATA NOTICE`):**  
> - **Các trường metadata đội thi hiện còn trống (`null`):** `doiSo` (`Đội số`), `cumDonVi` (`Cụm`), `diaBanCuThe` (`Xã/Phường cụ thể`), `doiTruong` (`Đội trưởng`). Kiểm tra trực tiếp `DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx` và `TRẠI THANH NIÊN SỐ.xlsx` xác nhận các tệp đầu vào không chứa thông tin này. Tuyệt đối **không tự điền đoán mò**; thư mục nộp chính thức `Doi<SO_DOI>_ChuDe1/02_ThietKe` được giữ tên làm việc `DESIGN_CHUDE1_DRAFT/02_ThietKe` cho tới khi đội cung cấp Phiếu đăng ký chính thức.  
> - **Phân định trách nhiệm 04 hạng mục của toàn đội (theo Đề thi Mục II):**  
>   - **Hạng mục 1 — Video (60–120 giây, dọc 9:16):** Thuộc trách nhiệm thành viên khác của đội (**CHƯA CÓ FILE TRONG GÓI NÀY**).  
>   - **Hạng mục 2 — Thiết kế (05 ấn phẩm `1080 × 1350 px`):** **Đạt chuẩn kỹ thuật & nội dung (chờ điền metadata đội nếu cần).**  
>   - **Hạng mục 3 — Bài đăng (01 tệp Word):** Thuộc trách nhiệm thành viên khác (**CHƯA CÓ FILE TRONG GÓI NÀY**).  
>   - **Hạng mục 4 — Thuyết minh (tối đa 03 trang Word/PDF):** Thuộc trách nhiệm thành viên khác (**CHƯA CÓ FILE TRONG GÓI NÀY**).  
> - **Nhắc lịch nộp & trình bày bắt buộc:** Hạn nộp toàn đội theo đề là **21:00 ngày 26/11/2026** qua đường dẫn do Ban Tổ chức cung cấp (báo cáo này **không** tự nhận đã upload lên cổng BTC). Lịch trình bày dự kiến: **sáng 27/11/2026** (tối đa 10 phút: 06 phút trình bày + 04 phút phản biện).

---

## 1. Bảng tổng hợp kiểm định theo QUY CHUẨN BẮT BUỘC (Gate 0 → Gate 6)

### Gate 0 — Source & Scope (`I1`)
| Hạng mục kiểm định | Trạng thái | Bằng chứng & Ghi chú trung thực |
|---|---|---|
| Đọc toàn văn đề thi chính thức và ghi đúng Mục 2, Chủ đề 1, thời gian, tiêu chí | **PASS** | Đã đối chiếu `DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx` và ghi vào `campaign.config.json`, `SOURCES.md`. |
| Nhận diện đúng file Huy hiệu Đoàn gốc người dùng cung cấp | **PASS** | Lưu nguyên bản 925×1024 JPEG (`huy-hieu-doan-original.jpg`) và bản tách nền sạch 941×1042 RGBA (`huy-hieu-doan-clean.png`, `0` sai lệch RGB nội dung). |
| Phân biệt 05 PNG là sản phẩm nộp chính; web chỉ là bản trình chiếu bổ trợ | **PASS** | Đã tách riêng thư mục `DESIGN_CHUDE1_DRAFT/02_ThietKe/` (05 PNG + `editable/01..05.svg` + `CONTACT_SHEET.png`) khỏi `Website_TrinhChieu/` và `src/`. |
| Có nguồn chính thống của Nghị quyết 57-NQ/TW | **PASS** | `mst.gov.vn` (HTTP 200 live) làm nguồn chính & đích QR; `xaydungchinhsach.chinhphu.vn` (HTTP 200 gzip) đối chiếu chéo. Ghi nhận trung thực `dangcongsan.vn` PDF bị 302→404/refused. |
| Kiểm tra tên Cụm / Đơn vị / Đội số / Địa bàn | **PENDING_METADATA** | Giữ `null` trong `campaign.config.json` (`status: "DRAFT_PENDING_OFFICIAL_METADATA"`). Chờ đội bổ sung trước khi đổi tên sang `Doi<SO_DOI>_ChuDe1`. |

### Gate 1 — Nội dung Nghị quyết (`I2`)
| Hạng mục kiểm định | Trạng thái | Bằng chứng & Ghi chú trung thực |
|---|---|---|
| Số hiệu chính xác `57-NQ/TW`, ngày `22/12/2024`, Bộ Chính trị | **PASS** | Xuất hiện nhất quán trên header (`NGHỊ QUYẾT 57-NQ/TW`) và chân cả 05 ảnh (`Nguồn: Nghị quyết 57-NQ/TW, Bộ Chính trị (22/12/2024).`). |
| Giữ đủ 4 thành tố: khoa học, công nghệ, đổi mới sáng tạo, chuyển đổi số | **PASS** | Thể hiện rõ ở Poster 02 (`Khoa học, công nghệ · Đổi mới sáng tạo · Chuyển đổi số`) kèm micro-note `Ba nội dung gợi nhớ để dễ hiểu`, không gán là "ba trụ cột duy nhất". |
| Thông điệp người dân là trung tâm & phần việc thanh niên thực tế | **PASS** | Poster 03 (`CÔNG NGHỆ VÌ CON NGƯỜI`) & Poster 04 (`THANH NIÊN ĐỒNG NAI HÀNH ĐỘNG` kèm micro-note `Gợi ý phần việc thanh niên tại cơ sở`). |
| Không có claim thiếu nguồn, số liệu %, chỉ tiêu bịa đặt hoặc diễn giải sai | **PASS** | 0 số liệu định lượng bịa đặt; mô tả rõ toàn bộ khung cảnh là minh họa 2D hư cấu và phần việc đề xuất. |
| `FACT_CHECK_NQ57.md` đối chiếu từng câu và speaker cue với văn bản gốc | **PASS** | Đã kiểm chứng 100% câu chốt & 5 lời dẫn thuyết trình (`0` claim `UNVERIFIED`). |

### Gate 2 — 05 tác phẩm thật (`I3`)
| Hạng mục kiểm định | Trạng thái | Bằng chứng & Ghi chú trung thực |
|---|---|---|
| Chính xác 05 file PNG độc lập với naming rõ ràng | **PASS** | `01_NghiQuyet57_GanBan.png` (`1,376,819 B`), `02_HieuDung_DeBatDau.png` (`1,541,310 B`), `03_CongNghe_ViConNguoi.png` (`1,582,620 B`), `04_ThanhNienDongNai_HanhDong.png` (`1,572,863 B`), `05_HieuDung_LamThat_LanToa.png` (`1,460,081 B`). |
| Mỗi file đúng `1080 × 1350 px` (tỷ lệ 4:5, sRGB) | **PASS** | Kiểm chứng độc lập bởi cả header PNG (`scripts/qa-posters.mjs`) và Python `PIL` (`1080×1350`, `mode=RGB`). |
| Có 05 nguồn chỉnh sửa được (`editable/`) tương ứng | **PASS** | `editable/01.svg`..`05.svg` (`viewBox="0 0 1080 1350"`) có các lớp `<g>` tách bạch (`layer-background`, `layer-illustration`, `layer-header`, `layer-typography`, `layer-cta-qr` ở 05, `layer-footer`) và thẻ `<text>` chỉnh sửa được trực tiếp. |
| Hình minh họa 2D bán hiện thực, không photoreal/3D/CGI | **PASS** | Kiểm định trực quan `character-style-sheet.png` và `01_raw.png`..`05_raw.png`: nét mực + màu gouache lì đồng nhất; loại bỏ hoàn toàn `Nghi_Quyet_57_Poster_01_1080x1350.png`. |
| Đồng bộ nhân vật, bảng màu, vật kể chuyện & mạch truyện 01→05 | **PASS** | 3 nhân vật hư cấu + smartphone tối màu + sổ navy dây đỏ xuyên suốt; bản dựng đầu `05_raw.png` từng bị reject do lỗi giải phẫu 3 tay và đã vẽ lại đạt chuẩn ở lần 2 (`ILLUSTRATION_NOTES.md`). |
| Không dùng placeholder hay tranh mẫu chưa hoàn thiện | **PASS** | `qa:posters` xác nhận 0 token `{{`, `}}`, `[TBD]`, `Lorem`. |
| Không giả mạo hình ảnh/giọng nói người thật hoặc lãnh đạo | **PASS** | 100% nhân vật hư cấu 2D; không dùng ảnh chụp hay chân dung cá nhân có thật. |
| Ảnh 05 giải quyết kết truyện "người được giúp giờ tự giúp người khác" | **PASS** | Bác gái từng học ở 03, tự thực hành ở 04, nay chủ động hướng dẫn bác hàng xóm ở 05; hai bạn trẻ đứng nền sau quan sát tự nhiên. |

### Gate 3 — Nhận diện & Typography (`I4`)
| Hạng mục kiểm định | Trạng thái | Bằng chứng & Ghi chú trung thực |
|---|---|---|
| Huy hiệu Đoàn gốc không méo, không thiếu chữ/bàn tay/lá cờ, không đổi màu | **PASS** | Nhúng nguyên mẫu `huy-hieu-doan-clean.png` trong vùng bảo vệ sáng trên góc trái header của cả 05 ảnh. |
| Font tiếng Việt đầy đủ dấu, nét rõ và độ tương phản tốt | **PASS** | Dùng `@fontsource/be-vietnam-pro@5.3.0` (`OFL-1.1`), nhúng WOFF2 cục bộ lúc export; kiểm tra mắt trên 05 PNG và `CONTACT_SHEET.png` không lỗi glyph. |
| Khớp chính xác 05 tiêu đề, 05 dòng phụ và micro-notes đã khóa | **PASS** | `qa:posters` xác minh toàn bộ text node trong `editable/01.svg`..`05.svg` và rendered PNGs. |
| Nhãn `NGHỊ QUYẾT 57-NQ/TW` và dòng nguồn đầy đủ trên cả 05 ảnh | **PASS** | Hiện diện rõ ràng trên mọi ảnh đơn (`Trại Thanh niên số thành phố Đồng Nai 2026` + `Nguồn: Nghị quyết 57-NQ/TW, Bộ Chính trị (22/12/2024).`). |
| Không chữ AI rác, không mã QR giả, không logo do AI tự vẽ | **PASS** | Đã kiểm định trực quan toàn bộ 05 ảnh gốc `01_raw.png`..`05_raw.png` và 05 PNG hoàn chỉnh. |
| Đồng bộ hệ nhận diện nhưng đa dạng bố cục (không rập khuôn 5 khung giống hệt) | **PASS** | Kiểm chứng qua `CONTACT_SHEET.png`: 01/03/05 căn trái với thanh nhấn dọc khác nhịp; 02/04 căn giữa/mở rộng với micro-pill; footer xen kẽ Warm Ivory & Academic Navy hài hòa sắc độ tranh; card QR 05 nằm gọn vùng bàn trống bên trái. |

### Gate 4 — Trình chiếu Website (`I5`)
| Hạng mục kiểm định | Trạng thái | Bằng chứng & Ghi chú trung thực |
|---|---|---|
| Website mở trực tiếp ngay Cảnh `01 / 05` (không landing screen) | **PASS** | `tests/nq57_exhibition.spec.js` test #1 xác nhận vừa tải trang là `hud-progress = "01 / 05"` và `#poster-stage-img` hiển thị `01_NghiQuyet57_GanBan.png`. |
| Đúng 05 cảnh theo thứ tự `01→05`, **04 lần bấm `Tiếp`** (không auto-loop) | **PASS** | 4 click `#btn-next` tới `05 / 05`; click lần 5 `#btn-next` (disabled) giữ nguyên `05 / 05`; 4 click `#btn-prev` quay về `01 / 05`. |
| Phím tắt & nút điều khiển đồng bộ (`→`, `←`, `Space`, `Home`, `End`, `N`, `L`, `Z`, `Esc`, `R`) | **PASS** | `tests/nq57_exhibition.spec.js` test #2 kiểm tra trọn bộ phím tắt và nút UI (`speaker-cue-panel`, `body.lite-mode`, `#lightbox-modal`). |
| Poster 4:5 hiển thị `object-fit: contain`, không crop chữ/logo/footer/QR | **PASS** | Kiểm tra DOM geometry toàn bộ 5 cảnh ở `1920×1080` và `1366×768`: `naturalWidth=1080`, `naturalHeight=1350`, `objectFit='contain'`, khung ảnh nằm hoàn toàn trong viewport phía trên thanh HUD. |
| Rõ nét ở `1920×1080`, `1366×768` và tương thích mobile `390×844` | **PASS** | Kiểm tra trực quan cả 9 screenshot (`1920×1080` 01..05, `1366×768` 01 & 05, `390×844` 01 & 05). Đã phát hiện và sửa lỗi `reveal.css` khóa `overflow: hidden` / nền `#fff` trên `390×844` trong `src/styles/main.css` để cuộn dọc mượt và nút `mst.gov.vn` hiển thị trọn vẹn phía trên HUD. |
| Hiệu ứng Canvas 2D & GSAP êm (0.55–0.82s), có `Lite Mode` (`L`) & `prefers-reduced-motion`, không autoplay audio | **PASS** | Đã gỡ bỏ hoàn toàn `three`, `canvas-confetti`, thẻ `<audio>`/chime và Google Fonts CDN. |
| Không rò nội dung 20/11 từ dự án cũ | **PASS** | Đã xóa `src/content/photo-manifest.json`, di dời asset cũ ra `.research/archive-20-11-public/`, di dời test cũ ra `.research/archive-20-11-tests/`; Playwright kiểm tra `0` chuỗi cấm (`Nét vẽ tri ân`, `Nhà giáo`, `Cô Liệu`, `Cô Ngọc`, `Sinh viên 5 tốt`, `20/11`) trong `innerText` và `innerHTML`. |
| Source web 20/11 cũ có bản backup khôi phục được | **PASS** | Bảo toàn nguyên vẹn tại commit `5ecd4c1` trên nhánh `backup/net-ve-tri-an-20-11-v10` và tag `archive-net-ve-tri-an-20-11-v10` (không force-push). |

### Gate 5 — Kiểm thử kỹ thuật (`I6`)
| Hạng mục kiểm định | Trạng thái | Kết quả đo thực tế |
|---|---|---|
| Build production (`pnpm run build` / `vite build`) | **PASS** | Exit `0`, built in `199ms`, `dist/assets/` chỉ gồm 5 poster NQ57, Huy hiệu Đoàn (`original` + `derived`), WOFF/WOFF2 `Be Vietnam Pro` cục bộ, JS & CSS bundle. |
| Script export posters (`npm run export:posters`) | **PASS** | Xuất đồng bộ 05 PNG `1080×1350`, 05 SVG `editable/`, `CONTACT_SHEET.png`, và đồng bộ `public/assets/posters/`. |
| Script QA posters (`npm run qa:posters`) | **PASS** | **`138 passed, 0 failed`** (kiểm kích thước header PNG + Python PIL, dung lượng >100KB, byte-sync `public/assets/posters/`, cấu trúc layer SVG, chuỗi khóa, `0` chuỗi cấm). |
| QR Poster 05 decode bằng thư viện độc lập | **PASS** | `jsQR` giải mã trực tiếp từ pixel của `05_HieuDung_LamThat_LanToa.png` trả về chính xác `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm`. |
| Ảnh hiển thị đầy đủ trên web, không broken image / 404 | **PASS** | `0` failed requests, `0` HTTP `>=400`, toàn bộ `poster-stage-img` và `.rail-emblem-img` đều `complete && naturalWidth > 0`. |
| Không có lỗi console / uncaught page error | **PASS** | `0` console error, `0` pageerror xuyên suốt 5/5 test Playwright. |
| Playwright E2E suite (`pnpm test`) | **PASS** | `tests/nq57_exhibition.spec.js`: **`5 passed (37.1s)`** (0 failed, 0 skipped). |
| Kiểm tra trực quan screenshots & `CONTACT_SHEET.png` | **PASS** | Đã xem bằng mắt qua `read_file` cả 05 PNG xuất, `CONTACT_SHEET.png`, và 09 screenshot trình duyệt (`1920×1080`, `1366×768`, `390×844`). |
| Kiểm tra quyền sử dụng repo/assets (`REPO_AUDIT_213.md`) | **PASS** | Chỉ dùng thư viện permissive/cho phép (`GSAP`, `reveal.js` MIT, `vite` MIT, `playwright` Apache-2.0, `@fontsource/be-vietnam-pro` OFL-1.1, `qrcode` MIT, `jsqr` Apache-2.0, `Pillow`/`NumPy`); loại trừ `fullPage.js` (GPL-3.0) & `react-bits` (Commons Clause). |
| Kiểm tra triển khai URL production thật (`https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`) | **PASS** | Đã đẩy nhánh backup (`backup/net-ve-tri-an-20-11-v10`), tag (`archive-net-ve-tri-an-20-11-v10`) và nhánh `main` (`ff711d5f47dc4ed696a14982fc610b2c565dcc3d`); GitHub Actions run `45842969000` đạt `completed/success` (`2026-11-26T14:50:48Z`); `node scripts/verify_live_nq57.mjs` PASS (HTTP 200, 5/5 cảnh `1080×1350 contain`, QR + link `mst.gov.vn`, `0` console/page/404 errors, `0` chuỗi 20/11). |

### Gate 6 — Bài thi & bàn giao trung thực (`I7`)
| Hạng mục kiểm định | Trạng thái | Ghi chú trung thực |
|---|---|---|
| 05 file PNG nằm đúng vị trí thiết kế, naming rõ | **PENDING_METADATA** | Hiện nằm tại `DESIGN_CHUDE1_DRAFT/02_ThietKe/`; cần đổi tên thư mục cha thành `Doi<SO_DOI>_ChuDe1` sau khi xác nhận `Đội số` từ Phiếu đăng ký. |
| Không bịa đặt `Đội số`, `Cụm`, `Xã/Phường`, `Đội trưởng` | **PASS** | Tất cả giữ `null` trong `campaign.config.json`. |
| Minh họa AI được công bố trung thực | **PASS** | Ghi nhận đầy đủ trong `ILLUSTRATION_NOTES.md`, `SOURCES.md`, `FACT_CHECK_NQ57.md` và trực tiếp dưới nút nguồn ở Cảnh `05/05` trên website. |
| Đầy đủ tài liệu nguồn, fact-check, audit repo & QA report | **PASS** | `SOURCES.md`, `FACT_CHECK_NQ57.md`, `REPO_AUDIT_213.md`, `ILLUSTRATION_NOTES.md`, `DESIGN_QA_REPORT.md`, `Website_TrinhChieu/README.md`. |
| Không báo cáo nhầm Video / Bài đăng / Thuyết minh đã xong | **PASS** | Đã tách bạch rõ Hạng mục 1, 3, 4 là việc của thành viên khác trước hạn nộp. |
| Nhắc hạn nộp `21:00 ngày 26/11/2026` & không giả mạo upload BTC | **PASS** | Ghi rõ ở phần đầu và cuối báo cáo. |

---

## 2. Những điểm cần lưu ý trước khi nộp chính thức (`Action Items for Team`)

1. **Điền metadata đội thi (nếu cập nhật lên ấn phẩm/thư mục nộp):** Xác nhận `Đội số`, `Cụm`, `Xã/Phường`, `Đội trưởng` từ Phiếu đăng ký, cập nhật `DESIGN_CHUDE1_DRAFT/02_ThietKe/campaign.config.json`, đổi tên thư mục gốc từ `DESIGN_CHUDE1_DRAFT/` sang `Doi<SO_DOI>_ChuDe1/`, và chạy lại `npm run export:posters && npm run qa:posters` nếu cần chèn tên cụm/đội vào footer.
2. **Hoàn thành 03 hạng mục còn lại của toàn đội trước `21:00 ngày 26/11/2026`:**
   - **Mục 1 (Video):** 01 video 60–120s dọc `9:16`, 3 giây đầu thu hút, có phụ đề và nhạc bản quyền hợp lệ.
   - **Mục 3 (Bài đăng):** 01 file Word có tiêu đề, nội dung, CTA, hashtag, kênh/giờ đăng dự kiến và ghi rõ bộ 05 ảnh/video đính kèm.
   - **Mục 4 (Thuyết minh):** Tối đa 03 trang Word/PDF trình bày vấn đề, đối tượng, thông điệp, gợi ý triển khai cơ sở, công cụ số/AI và nguồn tư liệu.
3. **Chuẩn bị phần trình bày sáng 27/11/2026:** Mở website trình chiếu `01 / 05` → `05 / 05` (hoặc dùng chế độ Toàn màn hình `F`, Lời dẫn `N`, Phóng to `Z`) kết hợp `speakerCue` có sẵn (tổng thời lượng phần thi của cả đội tối đa 10 phút: 06 phút trình bày + 04 phút phản biện).

---

## 3. Nhật ký triển khai & kiểm chứng Production Live (GitHub Pages)

- **Backup dự án cũ 20/11 (không force-push):**
  - Branch: `backup/net-ve-tri-an-20-11-v10` → `5ecd4c1` (đã đẩy lên `origin`)
  - Tag: `archive-net-ve-tri-an-20-11-v10` → `5ecd4c1` (đã đẩy lên `origin`)
- **Production Deploy trên `main`:**
  - Verified Live Build Commit SHA: `ff711d5f47dc4ed696a14982fc610b2c565dcc3d`
  - GitHub Actions Workflow Run: `45842969000` (`Deploy Cinematic Presentation to GitHub Pages`) → `completed / success` (`2026-11-26T14:50:48Z`)
  - Live URL: `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`
  - Thời điểm kiểm chứng live (`scripts/verify_live_nq57.mjs`): `2026-11-26 21:51:44 GMT+7` (`2026-11-26T14:51:44Z`)
- **Kết quả thực tế `node scripts/verify_live_nq57.mjs`:**
  ```text
  [INFO] Live URL HTTP status: 200
  [PASS] Live site opens directly on 01 / 05 with 1080x1350 poster & Đoàn emblem
  [PASS] Scene 02 / 05 (02_HieuDung_DeBatDau.png) verified 1080x1350 contain
  [PASS] Scene 03 / 05 (03_CongNghe_ViConNguoi.png) verified 1080x1350 contain
  [PASS] Scene 04 / 05 (04_ThanhNienDongNai_HanhDong.png) verified 1080x1350 contain
  [PASS] Scene 05 / 05 (05_HieuDung_LamThat_LanToa.png) verified 1080x1350 contain
  [PASS] Scene 05/05 #btn-next disabled and #btn-official-link matches mst.gov.vn URL
  [PASS] LIVE VERIFICATION COMPLETE (https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/) — 0 console errors, 0 page errors, 0 failed/404 requests, 0 20/11 strings.
  ```
- **Ảnh chụp màn hình production live đã kiểm định trực quan:**
  - `test-results/nq57-screenshots/live_1920x1080_scene_01.png`
  - `test-results/nq57-screenshots/live_1920x1080_scene_05.png`

---

## 4. Tóm tắt tuân thủ chuẩn bàn giao (`COMPLIANCE SUMMARY`)

```text
COMPLIANCE SUMMARY
[x] BTC-01 Chủ đề/đối tượng/địa bàn (Chủ đề 1 NQ 57-NQ/TW; địa bàn cụm chờ Phiếu đăng ký)
[x] BTC-02 05 ảnh 1080x1350 PNG/JPG (Mục 2 hoàn tất: 01..05 PNG sRGB 1080x1350)
[x] BTC-04 Nội dung Nghị quyết 57 chính xác (đối chiếu mst.gov.vn HTTP 200)
[x] BTC-06 Logo/bản quyền/AI minh bạch (Huy hiệu Đoàn nguyên bản; OFL-1.1/MIT/Apache-2.0)
[x] FACT-03 Fact check toàn bộ chữ (FACT_CHECK_NQ57.md — 0 UNVERIFIED)
[x] ART-01 2D tự nhiên, không photoreal/3D (character-style-sheet + 01..05_raw.png)
[x] STORY-01 05 ảnh liên kết (03 học -> 04 thực hành -> 05 hướng dẫn lại)
[x] PROD-01 05 file export + editable (editable/01.svg..05.svg + CONTACT_SHEET.png)
[x] PROD-03 QR hợp lệ + source (jsQR decode pixel Poster 05 khớp 100% mst.gov.vn)
[x] WEB-02 Web 05 cảnh / 04 lần Next (Playwright local 5/5 PASS + live GitHub Pages PASS)
[ ] QA-GATES 0–6 PASS (Gate 1–5 PASS; Gate 0 & Gate 6 ở trạng thái DRAFT_PENDING_OFFICIAL_METADATA chờ Đội số/Cụm/Xã-phường/Đội trưởng)

FILES: DESIGN_CHUDE1_DRAFT/02_ThietKe/01_NghiQuyet57_GanBan.png .. 05_HieuDung_LamThat_LanToa.png, CONTACT_SHEET.png, editable/01.svg..05.svg, campaign.config.json, FACT_CHECK_NQ57.md, SOURCES.md, REPO_AUDIT_213.md, ILLUSTRATION_NOTES.md, DESIGN_QA_REPORT.md, DESIGN_CHUDE1_DRAFT/Website_TrinhChieu/README.md, tests/nq57_exhibition.spec.js, scripts/verify_live_nq57.mjs
DEPLOYED_URL: https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/ (Verified commit ff711d5f47dc4ed696a14982fc610b2c565dcc3d)
MISSING_INPUT: doiSo (Đội số), cumDonVi (Cụm), diaBanCuThe (xã/phường), doiTruong (Đội trưởng); cùng 03 sản phẩm của thành viên khác (Mục 1 Video, Mục 3 Bài đăng Word, Mục 4 Thuyết minh) trước hạn nộp 21:00 ngày 26/11/2026.
BLOCKERS: Không có blocker kỹ thuật cho Mục 2 & Website bổ trợ.
```
