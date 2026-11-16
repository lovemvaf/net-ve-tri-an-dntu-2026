# NAVIGATION FIX V4 — COMPLETE POWERPOINT-LIKE STEP ENGINE

**Tác phẩm:** NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI  
**Tác giả:** Quách Khoa Đức — Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)  
**Tệp thực thi:** `src/content/presentation-data.js`, `src/scripts/slides-app.js`, `src/scripts/motion-controller.js`

---

## 1. KIẾN TRÚC GLOBAL STEP ENGINE DUY NHẤT (`window.PresentationState`)

Toàn bộ bài thuyết trình V4 được quản lý bởi một bộ máy trạng thái duy nhất (`Single Source of Truth`) gồm **34 bước kể chuyện tuần tự (`currentSequenceIndex: 0..33`)**:

```javascript
window.PresentationState = {
  currentSequenceIndex: 0,           // 0..33 (34 bước toàn cục)
  currentSlideId: 'landing',         // 'landing' | 'slide-1' .. 'slide-6'
  currentStepId: 'landing-step-1',   // Định danh bước hiện tại
  slideIndex: -1,                    // -1 (Landing) | 0..5 (Slide 01..06)
  stepIndex: 0,                      // Chỉ số bước con trong slide hiện tại
  isAnimating: false,                // Khóa chuyển tiếp ngắn chống xung đột
  isTransitioning: false,
  isOverviewOpen: false,
  isLightboxOpen: false,
  presentationMode: 'presentation'   // 'presentation' | 'overview' | 'notes'
};
```

Mọi nút bấm trên giao diện (`#hud-next`, `#hud-prev`) và mọi phím điều khiển (`ArrowRight`, `ArrowLeft`, `Space`, `PageDown`, `PageUp`, `Enter`, `Home`, `End`, `R`) đều gọi trực tiếp vào 4 hàm điều phối trung tâm:
- `window.nextStep()`
- `window.previousStep()` (bí danh `window.prevStep()`)
- `window.goToStep(idOrIndex)` / `window.goToState(slideIndex, stepIndex)`
- `window.replayCurrentStep()`

---

## 2. SƠ ĐỒ 34 BƯỚC TUẦN TỰ (MỘT LẦN BẤM = MỘT BƯỚC KỂ CHUYỆN)

| Màn hình / Slide | Số bước | Chỉ số bước (`stepIndex`) | Mô tả chi tiết các bước khi bấm `Tiếp ›` |
|---|---|---|---|
| **Landing Page 20/11** (`slideIndex: -1`) | **5 bước** | `0 → 4` | **Bước 1:** Mở đầu nét sáng → **Bước 2:** Ngày Nhà giáo Việt Nam 20/11 → **Bước 3:** Hoa và lời tri ân → **Bước 4:** Poster chính nguyên bản → **Bước 5:** Thông điệp dẫn chuyện (Bấm tiếp vào Slide 01). |
| **Slide 01 — Khởi nguồn** (`slideIndex: 0`) | **3 bước** | `0 → 2` | **Bước 1:** Ánh sáng tri thức & `1 print("Hello, DNTU")` → **Bước 2:** 4 chương hành trình → **Bước 3:** Hai câu thơ chủ đạo & nét sáng dẫn tới người thầy. |
| **Slide 02 — Người thầy & Cô Liệu** (`slideIndex: 1`) | **4 bước** | `0 → 3` | **Bước 1:** Hình tượng người giảng viên & những ngày đầu bỡ ngỡ → **Bước 2:** Sự dìu dắt tận tình của cô Liệu → **Bước 3:** Điểm tựa quý thầy cô Khoa CNTT – DNTU → **Bước 4:** Đóa hoa tri ân 20/11. |
| **Slide 03 — Từ trang sách đến chân trời** (`slideIndex: 2`) | **4 cảnh** | `0 → 3` | **Cảnh 01:** Quyển sách mở hóa con thuyền & hai sinh viên → **Cảnh 02:** Cầu thang chồng sách & bàn tay nâng đỡ → **Cảnh 03:** Laptop `def future()`, AI & bình minh → **Cảnh 04:** Toàn cảnh tác phẩm. |
| **Slide 04 — Sinh viên 5 tốt** (`slideIndex: 3`) | **7 bước** | `0 → 6` | **Bước 1:** Động lực từ các anh chị đi trước → **Bước 2..6:** Lần lượt thắp sáng 5 tiêu chí (*Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt, Hội nhập tốt*) → **Bước 7:** Minh chứng 02 năm liên tiếp Sinh viên 5 tốt dâng tặng thầy cô. |
| **Slide 05 — Hành trình thực tế** (`slideIndex: 4`) | **5 cảnh** | `0 → 4` | **Cảnh 01:** Ngày đầu & Nụ cười khích lệ của cô Liệu → **Cảnh 02:** Học hỏi cùng quý thầy cô Khoa CNTT → **Cảnh 03:** Nỗ lực tình nguyện & hội nhập → **Cảnh 04:** Thành quả Sinh viên 5 tốt → **Cảnh 05:** Biết ơn & Trao hoa 20/11 tới cô Liệu. |
| **Slide 06 — Lời tri ân & Cảnh kết** (`slideIndex: 5`) | **6 bước** | `0 → 5` | **Bước 1:** Lời cảm ơn thầy cô → **Bước 2:** Hình tượng người thầy & 3 lời tri ân Cô Liệu / Khoa CNTT / DNTU → **Bước 3:** Những đóa hoa tri ân 20/11 → **Bước 4:** Chuyển cảnh nghệ thuật ánh sáng tiếp nối → **Bước 5:** Toàn bộ Poster nguyên bản → **Bước 6:** Final Hold. |

---

## 3. CAM KẾT CHẤT LƯỢNG ĐIỀU HƯỚNG V4

- **Không cần bấm tab hoặc nút mở poster riêng:** Tại Slide 03, Slide 05 và Slide 06, người thuyết trình chỉ cần bấm nút `Tiếp ›` hoặc phím `→` / `Space` để đi hết toàn bộ cảnh con và tự động mở toàn cảnh poster ở Bước 5 của Slide 06.
- **Lùi chính xác 100% (`previousStep`):** Khi đang ở `Final Hold` (`Slide 06 · Bước 06/06`), bấm `‹ Trước` hoặc phím `←` sẽ quay ngược từng bước một qua toàn bộ 34 bước về đúng trạng thái mở đầu của Landing Page.
