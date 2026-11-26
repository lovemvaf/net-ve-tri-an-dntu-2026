# ILLUSTRATION NOTES — BỘ 05 ẤN PHẨM NGHỊ QUYẾT 57-NQ/TW

> **Trạng thái sản xuất:** Hoàn tất Phase P1A (`source_illustrations/` gồm đủ `character-style-sheet.png` + `01_raw.png`..`05_raw.png`, đã kiểm định trực quan `[ART-01]`/`[ART-05]`/`[STORY-02]`).
> **Tuyên bố minh bạch AI:** Toàn bộ hình minh họa 2D bán hiện thực trong thư mục `source_illustrations/` là **tác phẩm hư cấu do AI hỗ trợ tạo sinh** dưới sự chỉ đạo art direction, kiểm định liên tục nhân vật (`[STORY-02]`) và kiểm định chất lượng (`[ART-01]`, `[ART-05]`) bởi nhóm thiết kế. Các nhân vật không mô phỏng người thật, không sử dụng ảnh chụp thật, và các tình huống cộng đồng là **minh họa giả định / gợi ý phần việc thanh niên**, không phải ảnh tư liệu hoạt động đã diễn ra.

---

## 1. Quy chuẩn khóa phong cách & nhận vật (`[ART-01]`, `[STORY-02]`)

- **Phong cách khóa:** `Vietnamese 2D semi-realistic editorial illustration × modern public-information campaign × handcrafted graphic-design feeling` — nét mực mảnh sắc sảo, mảng màu gouache lì ấm áp, bề mặt giấy mịn, tỷ lệ giải phẫu Việt Nam tự nhiên; **tuyệt đối không** photorealism, 3D/CGI, anime/cartoon, da bóng nhựa AI, neon, hologram hay robot.
- **Tách lớp chữ & nhận diện (`[ART-03]`, `[ART-04]`):** 100% tranh nền không chứa chữ, số, ký tự, huy hiệu Đoàn tự vẽ, logo hay mã QR giả. Toàn bộ typography tiếng Việt (`Be Vietnam Pro`), huy hiệu Đoàn gốc (`huy-hieu-doan-clean.png`), nguồn văn bản và mã QR thật được ghép ở lớp vector/HTML/SVG bước sau.
- **Bộ nhân vật hư cấu xuyên suốt:**
  1. **Nữ sinh viên (~21 tuổi):** Tóc đen ngang vai mái thưa nhẹ, áo sơ mi kem/trắng ngà xắn nhẹ tay áo, túi đeo chéo vải canvas xanh navy, quần tối màu.
  2. **Nam đoàn viên (~22 tuổi):** Tóc đen ngắn gọn gàng, áo polo xanh thanh niên trơn (`#1764B0`, không logo/huy hiệu giả), quần tối màu.
  3. **Người phụ nữ lớn tuổi (~65 tuổi):** Tóc hoa râm búi gọn gàng phía sau, áo bà ba/sơ mi cổ tròn hoa văn dệt nhã nhặn tông xanh xám–kem vàng ấm, quần tối màu; biểu cảm điềm đạm, cởi mở (xuất hiện từ ảnh 03 → thực hành ở 04 → tự tin chia sẻ lại cho hàng xóm ở 05).
- **Vật kể chuyện lặp lại:** Smartphone tối màu (màn hình trung tính, không giao diện chữ giả) + quyển sổ tay bìa cứng màu xanh navy có dây đai và dây đánh dấu đỏ nhỏ.

---

## 2. Nhật ký sinh ảnh & kiểm định từng tệp (`[ART-05]`)

### 00. `character-style-sheet.png` (Tham chiếu nhân vật & phong cách gốc)

- **Kích thước / Định dạng thực tế:** `1376 × 768 px`, RGB PNG (`1,241,327 bytes`).
- **Công cụ thực tế:** `image-generator` (do `@coordinator` điều phối vì worker không có công cụ `invoke_subagent`/`generate_image`).
- **Prompt chỉ đạo:**
  > Create a clean, cohesive Vietnamese 2D semi-realistic editorial illustration character and style reference sheet on a plain warm ivory (`#F6F4ED`) paper-textured background, 16:9 landscape. Pure 2D hand-painted editorial public-information illustration with delicate clean dark-ink linework, matte gouache-like warm shading, and natural Vietnamese anatomical proportions. Strictly NO photorealism, NO 3D/CGI, NO anime/cartoon, NO glossy AI skin, NO text, NO letters, NO numbers, NO character labels, NO badges or logos. Arrange three fictional Vietnamese characters standing side-by-side (three-quarter to full view, calm natural poses) plus two props on the right: (1) Left: female Vietnamese university student (~21), straight shoulder-length black hair, simple warm ivory-cream short-sleeve blouse, navy canvas crossbody bag strap, dark trousers, natural genuine Vietnamese face; (2) Center: male Vietnamese Youth Union volunteer (~22), neat short black hair, plain youth-blue (`#1764B0`) collared polo shirt with ZERO chest logo/badge, dark trousers, friendly expression; (3) Right-center: dignified elderly Vietnamese woman (~65), neat tied-back graying dark hair, modest softly patterned Vietnamese blouse, dark pants, warm attentive expression; (4) Far right: a plain dark smartphone (blank dark screen, no readable UI) and a small plain navy hardcover notebook. Unified matte gouache brushwork and warm ivory/youth-blue/navy/champagne-gold/restrained-red harmony.
- **Kết quả kiểm tra trực quan (`read_file`):** **PASS**
  - Nét vẽ 2D bán hiện thực chuẩn mực, nền kem giấy `#F6F4ED` sạch, hoàn toàn không có chữ/số/nhãn tên/huy hiệu giả.
  - Cả 3 nhân vật có tỷ lệ giải phẫu cân đối, bàn tay đủ ngón tự nhiên, gương mặt thuần Việt chân thực, trang phục đúng tuyệt đối đặc tả (`áo kem + túi navy`, `áo polo xanh thanh niên trơn`, `áo hoa văn nhã nhặn + tóc búi hoa râm`).
  - Smartphone tối màu và sổ navy rõ nét, sẵn sàng làm ảnh tham chiếu cố định cho chuỗi `01_raw.png` → `05_raw.png`.

---

### 01. `01_raw.png` — Scene 01: ĐẶT CÂU HỎI

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ 3:4, `0.7467`), RGB PNG (`1,385,386 bytes`).
- **Đề xuất crop `4:5` (`1080 × 1350 px`) cho bước dàn trang (`editable/01.svg`):** Crop khung `(0, 40, 896, 1160)` rồi scale lên `1080 × 1350` — giữ nguyên **33.5% vùng tường sáng phía trên đỉnh đầu** (>24% chuẩn header/tiêu đề) và **~15% mặt bàn gỗ sạch phía dưới** (>14% chuẩn footer/nguồn) mà không cắt quyển sổ hay dây đánh dấu đỏ.
- **Prompt chỉ đạo (tham chiếu `character-style-sheet.png`):**
  > Vietnamese 2D semi-realistic editorial illustration, vertical portrait, no text. Female university student (shoulder-length black hair, ivory blouse, navy crossbody bag) sits at a modest Vietnamese university common-room table curiously looking at her dark smartphone; male Youth Union friend (short black hair, plain youth-blue polo without badges) sits beside her gesturing gently toward the small navy hardcover notebook between them; morning sunlight on warm ivory wall; clean upper 24% wall and lower 14% table zones for later typography; zero text, numbers, logos, fake UI.
- **Kết quả kiểm tra trực quan (`read_file` + zoom tay + giả lập 4:5):** **PASS**
  - **Nhất quán nhân vật (`[STORY-02]`):** Nữ sinh viên khớp hoàn toàn với `character-style-sheet.png` (tóc ngang vai mái thưa, áo sơ mi kem xắn tay, túi chéo navy); nam đoàn viên áo polo xanh trơn hoàn toàn không có logo giả; sổ tay navy có đai + dây đỏ nằm ngay trung tâm bàn.
  - **Giải phẫu & bàn tay (`[ART-05]`):** Cả 2 bàn tay cầm smartphone và bàn tay mở chỉ hướng của bạn nam đều cân đối, đủ ngón tự nhiên, không biến dạng.
  - **Bố cục & vùng an toàn:** 100% không chữ, không số, không giao diện giả trên màn hình điện thoại, không cắt đầu, vùng trên/dưới rộng thoáng.

---

### 02. `02_raw.png` — Scene 02: HIỂU ĐÚNG ĐỂ BẮT ĐẦU

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ 3:4, `0.7467`), RGB PNG (`1,548,410 bytes`).
- **Đề xuất crop `4:5` (`1080 × 1350 px`) cho bước dàn trang (`editable/02.svg`):** Crop khung `(0, 80, 896, 1200)` (giữ nguyên toàn bộ phần bàn dưới) hoặc `(0, 60, 896, 1180)` rồi scale lên `1080 × 1350`:
  - Đỉnh đầu bạn nam ở khoảng `y ≈ 390` trong ảnh gốc → với crop `y0=80`, còn **~27.7% tường sáng trống phía trên** (>24% chuẩn tiêu đề).
  - Đáy smartphone nằm ở `y ≈ 1082` trong ảnh gốc → với crop `y0=80`, phần cạnh gỗ mặt trước bàn từ `y = 1100..1200` tạo vùng footer sạch ~10.5–12% (nên đặt dải footer dưới `y = 1205/1350` để không chạm góc smartphone).
- **Prompt chỉ đạo (tham chiếu `character-style-sheet.png` + `01_raw.png`):**
  > Vietnamese 2D semi-realistic editorial illustration continuing Scene 01 with the same two characters in a bright Vietnamese university innovation corner. Female student (ivory rolled-sleeve blouse, shoulder-length black hair, navy bag draped on chair) leans forward with an inspired, understanding smile; male volunteer (plain youth-blue polo without badges) points to a small white breadboard electronics prototype beside a plain silver laptop, the open navy notebook (abstract wireframe sketches, no letters), and the dark smartphone placed ready at bottom-right. Two muted student silhouettes in background, warm daylight, matte gouache + ink linework, zero text/numbers/logos/robots/holograms.
- **Kết quả kiểm tra trực quan (`read_file` + zoom bàn/tay + giả lập 4:5):** **PASS**
  - **Nhất quán nhân vật & chuyển biến cảm xúc (`[STORY-01]`, `[STORY-02]`):** Biểu cảm nữ sinh chuyển rõ từ tò mò (`01`) sang sáng tỏ, hứng khởi (`02`); trang phục, kiểu tóc, túi đeo chéo navy (treo trên thành ghế), sổ tay navy có dây đánh dấu đỏ và smartphone lặp lại đầy đủ.
  - **Ba gợi ý nội dung tự nhiên (`[ART-01]`):** Laptop (công nghệ/chuyển đổi số), bo mạch mẫu thử (khoa học/kỹ thuật), sổ tay phác thảo ý tưởng (đổi mới sáng tạo) hòa vào bối cảnh mà không cần 3 thẻ chữ cứng hay hologram/robot.
  - **Giải phẫu & độ sạch:** Zoom cận cảnh xác nhận bàn tay chỉ trỏ, bàn tay tựa bàn của hai bạn đều đúng số ngón tự nhiên; trang sổ chỉ có nét phác hình học trừu tượng, **0 chữ/số/logo**.

---

### 03. `03_raw.png` — Scene 03: CÔNG NGHỆ VÌ CON NGƯỜI

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ 3:4, `0.7467`), RGB PNG (`1,561,768 bytes`).
- **Đề xuất crop `4:5` (`1080 × 1350 px`) cho bước dàn trang (`editable/03.svg`):** Crop khung `(0, 80, 896, 1200)` rồi scale lên `1080 × 1350` — cả **vùng trên 24% (`y ≤ 324`)** lẫn **vùng dưới 14% (`y ≥ 1161`)** đều sạch hoàn toàn, không cắt bất kỳ đỉnh đầu hay chạm vào quyển sổ navy/dây đánh dấu đỏ!
- **Prompt chỉ đạo (tham chiếu `character-style-sheet.png` + `02_raw.png`):**
  > Vietnamese 2D semi-realistic editorial illustration, vertical portrait, no text. In a modest warm Vietnamese community room with soft afternoon sunlight, the same female student (shoulder-length black hair, ivory rolled-sleeve blouse, navy crossbody bag) gently points to help the dignified ~65yo elderly Vietnamese woman (tied graying hair bun, modest soft sage-gold floral patterned Vietnamese blouse from the style sheet) hold and learn a dark smartphone. The elderly woman smiles warmly with growing confidence; the male Youth Union volunteer (plain youth-blue polo without logos) stands supportively beside the table; the small navy hardcover notebook with red bookmark sits on the table, teapot in quiet background. Generous clean upper 24% and lower 14% safe zones; zero text, fake UI, logos, or distorted fingers.
- **Kết quả kiểm tra trực quan (`read_file` + zoom tay + giả lập 4:5):** **PASS**
  - **Nhất quán nhân vật (`[STORY-02]`):** Người phụ nữ lớn tuổi khớp tuyệt đối với `character-style-sheet.png` (búi tóc hoa râm gọn gàng, áo bà ba/sơ mi cổ tròn hoa văn xanh xám–kem vàng); nữ sinh và nam đoàn viên giữ nguyên trang phục, gương mặt và túi chéo navy.
  - **Cảm xúc & mạch truyện (`[STORY-01]`, `[ART-05]`):** Thể hiện trọn vẹn tinh thần “người dân là trung tâm”, người lớn tuổi chủ động cầm điện thoại và mỉm cười tự tin khi tự thao tác được (không thụ động), tạo điểm tựa tự nhiên để chuyển sang bước tự thực hành ở `04` và tự hướng dẫn hàng xóm ở `05`.
  - **Giải phẫu & độ sạch:** Bốn bàn tay có hành động (tay chống bàn bạn nam, tay chỉ của bạn nữ, hai tay cầm điện thoại của bác gái) đều tự nhiên, đúng số ngón; màn hình/mặt lưng điện thoại sạch không chứa UI chữ giả, 0 chữ/số/logo.

---

### 04. `04_raw.png` — Scene 04: THANH NIÊN ĐỒNG NAI HÀNH ĐỘNG

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ 3:4, `0.7467`), RGB PNG (`1,608,076 bytes`).
- **Đề xuất crop `4:5` (`1080 × 1350 px`) cho bước dàn trang (`editable/04.svg`):** Crop khung `(0, 80, 896, 1200)` rồi scale lên `1080 × 1350` — giữ trọn **~30% vùng tường sáng sạch phía trên** đỉnh đầu cao nhất và **~14% vùng mặt gỗ bàn trống phía dưới** quyển sổ navy/bút đỏ.
- **Prompt chỉ đạo (tham chiếu `character-style-sheet.png` + `03_raw.png`):**
  > Vietnamese 2D semi-realistic editorial illustration, wider Vietnamese community learning room scene in warm daylight, vertical portrait, no text or logos. Same female student (ivory blouse, shoulder-length black hair, navy crossbody bag) at focal center guiding a smiling resident with a smartphone; same male Youth Union volunteer (plain youth-blue polo without badges) at left station helping a young resident on a plain silver laptop; same elderly Vietnamese woman from 03 (tied graying hair bun, sage-gold floral blouse) sitting comfortably at foreground right practicing with her own smartphone; one additional volunteer-resident pair calmly studying in right background (not overcrowded). Small navy notebook with red bookmark and blank notepad on foreground table. Generous clean upper 24% wall and lower 14% safe zones; zero commune banners, zero signs, zero text, zero logos.
- **Kết quả kiểm tra trực quan (`read_file` + zoom tay cận/trung cảnh + giả lập 4:5):** **PASS**
  - **Nhất quán nhân vật (`[STORY-02]`):** Cả 3 nhân vật chủ đạo đều nhận diện ngay lập tức (nữ sinh áo kem + túi chéo navy ở trung tâm; nam đoàn viên áo xanh trơn ở trạm laptop bên trái; bác gái áo hoa văn xanh xám–vàng + tóc búi hoa râm ngồi thực hành độc lập ở góc phải).
  - **Nhịp cảnh & thông điệp (`[STORY-01]`, `[BTC-06]`):** Bố cục 1 cảnh chính + 3 hoạt động phụ ngăn nắp, không rối mắt; gợi ý hình thức hỗ trợ kỹ năng số tại cộng đồng rõ ràng nhưng hoàn toàn không gắn biển tên xã/phường hay băng-rôn bịa đặt.
  - **Giải phẫu & độ sạch (`[ART-05]`):** Kiểm tra cận cảnh tất cả bàn tay (tay chỉ của bạn nữ, tay cầm điện thoại của chú trung niên và bác gái, tay đặt trên laptop của bạn nam) đều chuẩn xác; **0 chữ/số/biển hiệu/logo**.

---

### 05. `05_raw.png` — Scene 05: HIỂU ĐÚNG. LÀM THẬT. LAN TỎA.

#### Lần kiểm định 1 (REJECTED — Lỗi giải phẫu `[ART-05]`)
- **Kết quả kiểm tra trực quan (`read_file` + zoom cận cảnh tay):** **FAIL — Cần vẽ lại (`[ART-05]`)**
  - Phát hiện lỗi nghiêm trọng ở nhân vật bác gái áo hoa xanh xám: có tới **3 cánh tay/bàn tay** (một tay áo hoa đưa sang trái giữ điện thoại, một tay áo hoa chỉ vào màn hình, và thêm một bàn tay đeo nhẫn đặt trên mặt bàn dưới khuỷu tay áo hoa của chính bác gái), trong khi tay trái của bác hàng xóm áo hồng cam bị mất hút phía sau.
  - Ngoài ra, ở crop `4:5` `(0, 80, 896, 1200)`, đỉnh đầu bạn nam đứng phía sau hơi chạm nhẹ vào vùng an toàn trên 24%.
- **Yêu cầu tái sinh:** Tách rõ tư thế hai tay của mỗi nhân vật (bác hàng xóm giữ điện thoại bằng **cả hai tay** trước mặt; bác gái áo hoa chỉ vào màn hình bằng **tay phải** và đặt **tay trái** rõ ràng lên bàn; hai bạn trẻ đứng lùi sâu hơn với đầu nằm hoàn toàn dưới vạch 28% từ mép trên; giữ sạch hoàn toàn 24% trên và 22% dưới).

#### Lần kiểm định 2 (FINAL ACCEPTED — PASS)
- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ 3:4, `0.7467`), RGB PNG (`1,577,206 bytes`).
- **Đề xuất crop `4:5` (`1080 × 1350 px`) & vùng đặt QR cho bước dàn trang (`editable/05.svg`):**
  - Crop khung `(0, 80, 896, 1200)` rồi scale lên `1080 × 1350`.
  - **Vùng an toàn trên (`y ≤ 324`, ~24%–27%):** Tường sáng sạch hoàn toàn, toàn bộ 4 đỉnh đầu (kể cả nam đoàn viên đứng bên phải) nằm dưới vạch 24%.
  - **Vùng đặt thẻ CTA + QR thật (`x = 56..545, y = 1045..1245`):** Nằm trọn trên mặt bàn gỗ trống góc dưới bên trái — không che mặt, không che tay, không chạm smartphone và giữ nguyên cả quyển sổ navy + dây đánh dấu đỏ bên phải (`x ≈ 555..820`). Dải footer Academic Navy đặt gọn dưới `y ≥ 1255`.
- **Prompt chỉ đạo (tham chiếu `character-style-sheet.png` + `03_raw.png` + `04_raw.png`):**
  > Vietnamese 2D semi-realistic editorial illustration, vertical portrait, NO text, NO logos, NO fake QR. Warm Vietnamese community room/veranda in golden afternoon sunlight, wider framing so ALL heads stay comfortably below top 28% sunlit wall and bottom 24% wooden tabletop stays empty for QR card and footer. Foreground left: friendly Vietnamese neighbor (~58yo, warm peach collared blouse, tied dark hair) holds dark smartphone steadily with BOTH hands; foreground center-right: SAME dignified elderly woman (~65yo, tied graying hair bun, sage-gold floral blouse from character-style-sheet and 03_raw) points one right index finger toward the phone screen while her left hand rests calmly on the wooden table beside the small navy notebook (strictly two arms and two natural hands per woman). Mid-background right: same female student (ivory blouse, shoulder-length black hair, navy bag) and male volunteer (plain youth-blue polo without badges) watch quietly with genuine warm smiles. Matte gouache shading, clean ink linework, zero photorealism/3D/raised-hand propaganda posing/text/fake QR/logos.
- **Kết quả kiểm tra trực quan (`read_file` + zoom tay + giả lập vùng QR 4:5):** **PASS**
  - **Sửa triệt để lỗi giải phẫu (`[ART-05]`):** Cả hai người phụ nữ ngồi bàn đều có **đúng 2 cánh tay và 2 bàn tay** phân tách rành mạch (bác hàng xóm áo hồng cam dùng 2 tay giữ smartphone; bác gái áo hoa xanh xám–vàng dùng tay phải trỏ màn hình và tay trái đặt nhẹ trên mặt bàn); bạn nữ và bạn nam đứng nền sau đều đúng tỷ lệ, tự nhiên.
  - **Phân biệt tâm lý `03` → `05` (`[STORY-01]`, `[ART-05]`):** Ở `03`, bác gái là người được hướng dẫn; ở `05`, bác gái chuyển sang vai trò chủ động chỉ dẫn lại cho hàng xóm với nụ cười tự tin, hai thanh niên đứng sau quan sát đầy trân trọng, không tạo dáng hô khẩu hiệu sáo rỗng.
  - **Độ sạch:** 0 chữ, 0 số, 0 mã QR giả, 0 huy hiệu/logo giả.

---

## 3. Bảng tổng hợp kiểm tra liên hoàn 05 ấn phẩm (`[ART-05]` / `[STORY-02]`)

| Tệp | Kích thước gốc | Crop `4:5` đề xuất (`1080×1350`) | Nữ sinh viên | Nam đoàn viên | Bác gái (~65) | Smartphone & Sổ navy | Vùng chữ/QR | Kết luận |
|---|---|---|---|---|---|---|---|---|
| `character-style-sheet.png` | `1376×768` | Tham chiếu gốc | Đạt | Đạt | Đạt | Đạt | Nền `#F6F4ED` sạch | **PASS** |
| `01_raw.png` | `896×1200` | `(0, 40, 896, 1160)` | Tò mò, cầm phone | Áo xanh trơn, chỉ sổ | — | Cả 2 hiện diện | Trên >33%, dưới ~15% | **PASS** |
| `02_raw.png` | `896×1200` | `(0, 80, 896, 1200)` | Sáng tỏ, túi trên ghế | Chỉ bo mạch & laptop | — | Sổ mở + phone sẵn | Trên ~27.7%, dưới `y≥1205` | **PASS** |
| `03_raw.png` | `896×1200` | `(0, 80, 896, 1200)` | Kiên nhẫn hướng dẫn | Hỗ trợ bên cạnh | Tự cầm phone, tự tin | Cả 2 trên bàn/tay | Trên >27%, dưới >14% | **PASS** |
| `04_raw.png` | `896×1200` | `(0, 80, 896, 1200)` | Trung tâm hướng dẫn | Trạm laptop trái | Ngồi phải tự thực hành | Sổ navy + 2 phone | Trên >30%, dưới ~14% | **PASS** |
| `05_raw.png` | `896×1200` | `(0, 80, 896, 1200)` | Đứng nền sau mỉm cười | Đứng nền sau mỉm cười | Chỉ dẫn hàng xóm | Phone tay bạn + sổ bàn | Trên >24%, bàn trái QR trống | **PASS (Lần 2)** |

---

## 4. Ghi chú công cụ & minh bạch sử dụng AI (`[BTC-06]`)

- **Phân công tạo sinh:** Do worker môi trường swarm không có quyền gọi trực tiếp công cụ tạo ảnh `invoke_subagent` / `image-generator` (đã ghi nhận rõ khi kiểm tra công cụ), `@coordinator` đã chạy `image-generator` tuần tự theo từng prompt chuỗi tham chiếu (`character-style-sheet.png` → `01_raw.png` → `02_raw.png` → `03_raw.png` → `04_raw.png` → `05_raw.png`) và chuyển cho `@illustrator` kiểm tra trực quan từng tệp qua `read_file` và zoom cận cảnh bàn tay/vùng an toàn bằng Python Pillow.
- **Quyết định từ chối & tái sinh:** Bản dựng đầu của `05_raw.png` bị từ chối theo `[ART-05]` vì lỗi giải phẫu 3 cánh tay trên nhân vật bác gái; ảnh đã được vẽ lại từ đầu với tư thế 2 tay tách bạch rõ ràng trước khi nghiệm thu.
- **Giới hạn tư liệu:** Không sử dụng ảnh chụp `Nghi_Quyet_57_Poster_01_1080x1350.png` (vi phạm `[ART-01]` photorealism). Mọi nội dung chữ tiếng Việt, huy hiệu Đoàn nguyên bản (`huy-hieu-doan-clean.png`), nguồn văn bản và mã QR hợp lệ (`mst.gov.vn`) được dàn trang riêng ở bước Phase P1B (`editable/01.svg`..`05.svg`).
