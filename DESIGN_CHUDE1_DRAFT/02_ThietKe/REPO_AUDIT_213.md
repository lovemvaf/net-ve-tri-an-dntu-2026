# KIỂM KÊ REPOSITORY & GIẤY PHÉP (ĐỐI CHIẾU MANIFEST 213 REPO)

**Tài liệu đối chiếu:** `c:\Users\asus\Downloads\danh_sach_repo_tong_hop_moi_nhat.md` (cập nhật 25/11/2026)  
**Ngày kiểm tra trực tiếp trên đĩa:** 26/11/2026  
**Nguyên tắc:** Không cài đặt dàn trải cả 213 repo; chỉ kiểm chứng tồn tại thực tế trên ổ đĩa, rà soát giấy phép (license) và chọn đúng tập tối giản có giấy phép mở tương thích cho **Mục 2 (05 ấn phẩm)** và **Website trình chiếu bổ trợ**.

---

## 1. Kết quả kiểm tra đường dẫn thực tế trên đĩa theo 6 nhóm Manifest

> Ghi chú phương pháp: Manifest tổng hợp ghi chú *"213 repos (C:, E:, G:)"* nhưng liệt kê 6 nhóm chính với con số tiêu đề cộng gộp là `44 + 32 + 33 + 25 + 19 + 28 = 181` (chưa tính các repo lẻ khác trên ổ C:, E:, G:). Ổ `G:\` có tồn tại trên máy. Bảng dưới đây ghi nhận **đúng số lượng thư mục và `.git` repo quan sát trực tiếp** tại các đường dẫn được manifest nêu tên:

| Nhóm trong Manifest | Đường dẫn gốc trên máy | Số ghi trong Manifest | Thực tế kiểm tra trên đĩa | Ghi chú xác minh chi tiết |
|---|---|---:|---:|---|
| **1. Dự án Netvetrian** (Web, 3D, Animation, Trình chiếu) | `C:\Users\asus\Desktop\Netvetrian_QKD_KhoaCNTT-DNTU\.research\repos` | 44 | **43 thư mục / 43 `.git` repos** | Toàn bộ 43 repo đều tồn tại đầy đủ (do tiêu đề ghi 44 trong khi danh sách thực có 43 repo duy nhất: `GSAP`, `reveal.js`, `vite`, `playwright`, `three.js`, `canvas-confetti`, `fullPage.js`, `react-bits`, v.v.). |
| **2. Antigravity Agent Skills & Frameworks** | `C:\Users\asus\.gemini\config\skills\_repos` | 32 | **33 thư mục con / 32 `.git` repos trực tiếp** (+ `_writing_repos`) | Đủ 31 tên liệt kê trong bảng (nhóm UI/UX, agent, memory, audit, workspace) cộng thêm `humanizer` là repo thứ 32 và thư mục lồng `_writing_repos`. |
| **3. Antigravity Writing & Humanizer** | `C:\Users\asus\.gemini\config\skills\_repos\_writing_repos` | 33 | **33 thư mục / 33 `.git` repos** | Khớp 100% (`01_blader_humanizer` đến `33_syntaf_vale_llm_slop`). |
| **4. Video Production Toolkit** | `C:\Users\asus\.gemini\antigravity\scratch\video-production-toolkit` | 25 | **25 `.git` repos** (nằm trong `01-capture-source` … `07-quality-check`) | Khớp 100% danh sách 25 repo (thuộc phạm vi sản xuất video Mục 1 của đội, không dùng để thay thế việc thiết kế Mục 2). |
| **5. Hackathon & Toolbox (Ổ E:)** | `E:\04_Projects\Group 8 - Hackathon Dong Nai`, `E:\04_Projects\Dong Nai Memory`, `E:\04_Projects\IoT Learning Workspace` | 19 | **19 `.git` repos** (nằm trong thư mục con thực tế) | `Group 8`: 8 repo (`naifarm` + 7 repo trong `.toolbox\repos\`); `Dong Nai Memory`: 2 repo (repo gốc + `presentation-production\_tools\diagram-pptx`); `IoT Learning Workspace`: 9 repo nằm trong `01_PHAN_MEM\05_Fritzing`, `02_THU_VIEN\Fritzing`, `90_REPOSITORIES\Electronics` & `Fritzing_Build` (không nằm trực tiếp ở cấp gốc thư mục). |
| **6. Dự án cá nhân** (`Documents`, `source\repos`, `Downloads`, `Desktop`, `scratch`) | `C:\Users\asus\Documents`, `source\repos`, `Downloads`, `Desktop`, `scratch` | 28 | **30 `.git` repos** quan sát tại 5 thư mục (12 `Documents` + 3 `source\repos` + 13 `Downloads` + 2 `Desktop`, không đếm trùng `NAIVERSE`/`video-production-toolkit` ở `scratch`) | Một số repo nằm trong thư mục con (ví dụ `Documents\antigravity\busy-carson`, `Downloads\QKD1923040025\MyApp|QKDApp`, `Downloads\XulyAnh\tools\...`, `Downloads\1923040025_QuachKhoaDuc_LTMobile\...`). Đều tồn tại thật trên đĩa. |

---

## 2. Danh sách thư viện ĐƯỢC CHỌN SỬ DỤNG (Đã kiểm tra giấy phép cho phép)

Chỉ các thư viện dưới đây được phép dùng trong dây chuyền **xử lý asset / dựng 05 ấn phẩm / website trình chiếu / kiểm thử kỹ thuật**:

| Thư viện / Công cụ | Phiên bản kiểm chứng | Giấy phép đã xác minh | Nguồn xác minh | Mục đích trong dự án |
|---|---|---|---|---|
| **GSAP** (`gsap`) | `3.15.1` | **Standard "No Charge" GreenSock License** (`gsap-skills`: `MIT`) | `node_modules/gsap/package.json`; `.research/repos/gsap-skills/LICENSE` | Điều phối chuyển cảnh êm (0.5–1.1s) và ambient nền nhẹ trên website trình chiếu |
| **reveal.js** | `6.0.2` | **MIT** | `node_modules/reveal.js/package.json`; `.research/repos/reveal.js/LICENSE` | Khung trình chiếu 05 cảnh (04 lượt bấm Tiếp, phím điều hướng chuẩn) |
| **Vite** (`vite`) | `8.3.8` | **MIT** | `node_modules/vite/package.json`; `.research/repos/vite/LICENSE` | Build production tĩnh, tối ưu tài nguyên cục bộ không phụ thuộc CDN mạng lúc thi |
| **Playwright** (`@playwright/test` / Python `playwright`) | `1.65.1` (npm) / `1.64.0` (Python) | **Apache-2.0** | `node_modules/@playwright/test/package.json`; `.research/repos/playwright/LICENSE`; `importlib.metadata` | Kiểm thử điều hướng `01→05→01`, chụp screenshot QA `1920×1080` & `1366×768`, render SVG/HTML → PNG `1080×1350` |
| **@fontsource/be-vietnam-pro** | `5.3.0` | **OFL-1.1** (font files; Fontsource distribution) | `npm view @fontsource/be-vietnam-pro` | Font tiếng Việt **Be Vietnam Pro** nhúng offline an toàn bản quyền *(chờ cài vào `package.json` ở P1/P2)* |
| **qrcode** | `1.5.4` | **MIT** | `npm view qrcode` | Sinh mã QR thật (tương phản cao, đủ quiet zone) trỏ tới `mst.gov.vn` trên Ấn phẩm 05 *(chờ cài ở P1)* |
| **jsqr** | `1.4.0` | **Apache-2.0** | `npm view jsqr` | Kiểm thử giải mã QR tự động từ PNG xuất cuối nhằm xác nhận quét được chính xác *(chờ cài ở P1/P3)* |
| **Python Pillow (`PIL`) & NumPy** | `Pillow 12.2.0` / `NumPy 2.4.6` | **MIT-CMU** (Pillow) / **BSD-3-Clause** (NumPy) | `importlib.metadata` trong môi trường Python hiện hành | Đã dùng trong `scripts/prepare_doan_emblem.py` (tách nền Huy hiệu Đoàn 4-connected BFS & xuất verification sheet), contact sheet và kiểm tra kích thước PNG |

*(Lưu ý về repo cũ: `package.json` hiện có `three@0.187.0` (MIT) và `canvas-confetti@1.9.4` (ISC) từ dự án “Nét vẽ tri ân” V10; bản V10 đã được sao lưu đầy đủ tại nhánh `backup/net-ve-tri-an-20-11-v10` và tag `archive-net-ve-tri-an-20-11-v10` trước khi chỉnh sửa.)*

---

## 3. Danh sách thư viện BỊ LOẠI TRỪ RÕ RÀNG (License / Scope Exclusion)

| Thư viện trong `.research/repos` | Giấy phép kiểm tra trực tiếp trên đĩa | Quyết định & Lý do loại trừ |
|---|---|---|
| **`fullPage.js`** (`4.0.41`) | **GNU GPL-3.0** (`LICENSE` dòng 1–4: `GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007`) | **LOẠI TRỪ TUYỆT ĐỐI.** GPL-3.0 là copyleft mạnh, xung đột với cấu trúc phân phối mở/dự án hiện hành; đã có `reveal.js` (MIT) thay thế. |
| **`react-bits`** | **MIT + Commons Clause License Condition v1.0** (`LICENSE.md` dòng 1) | **LOẠI TRỪ TUYỆT ĐỐI.** Có điều khoản Commons Clause hạn chế quyền sử dụng/thương mại; không cần thiết cho trình chiếu 05 ảnh. |
| `remotion`, `murmurations`, `LiquidDistortion` | Giấy phép doanh nghiệp / chưa xác minh quyền tái phân phối sạch | **KHÔNG SỬ DỤNG.** Dư thừa so với yêu cầu Mục 2 và trình chiếu web nhẹ. |
