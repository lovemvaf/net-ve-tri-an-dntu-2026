# NAVIGATION STATE MACHINE V3 — POWERPOINT-LIKE GLOBAL STEP ENGINE

**Tệp thực thi chính:**
- `src/content/presentation-data.js` (`PRESENTATION_STEPS_CONFIG`)
- `src/scripts/slides-app.js` (`window.PresentationState`, `window.nextStep`, `window.prevStep`, `window.goToState`)
- `src/scripts/motion-controller.js` (`applyLandingStep`, `applySlide1Step`..`applySlide6Step`)

---

## 1. CẤU TRÚC TRẠNG THÁI TOÀN CỤC (`window.PresentationState`)

```javascript
window.PresentationState = {
  slideIndex: -1,          // -1 = Landing 20/11, 0..5 = Slide 01..Slide 06
  stepIndex: 0,            // Bước con hiện tại bên trong slideIndex
  isTransitioning: false,  // Khóa chuyển tiếp ngắn khi đổi giữa 2 slide lớn
  mode: 'presentation',    // 'presentation' | 'overview' | 'notes'
  overlay: null            // null | 'lightbox' | 'help'
};
```

---

## 2. BẢNG PHân BỔ 34 BƯỚC TRÌNH CHIẾU TUẦN TỰ

| `slideIndex` | Màn hình / Slide | Tổng số bước (`totalSteps`) | Chỉ số `stepIndex` | Định dạng hiển thị trên HUD |
|---|---|---|---|---|
| `-1` | **Landing Page 20/11** | `6` | `0 → 5` | `MỞ ĐẦU 20/11 · BƯỚC 01 / 06` .. `06 / 06` |
| `0` | **Slide 01 — Khởi nguồn** | `3` | `0 → 2` | `SLIDE 01 / 06 · BƯỚC 01 / 03` .. `03 / 03` |
| `1` | **Slide 02 — Người thầy & Cô Liệu** | `4` | `0 → 3` | `SLIDE 02 / 06 · BƯỚC 01 / 04` .. `04 / 04` |
| `2` | **Slide 03 — Con thuyền tri thức** | `4` | `0 → 3` | `SLIDE 03 / 06 · BƯỚC 01 / 04` .. `04 / 04` |
| `3` | **Slide 04 — Sinh viên 5 tốt** | `7` | `0 → 6` | `SLIDE 04 / 06 · BƯỚC 01 / 07` .. `07 / 07` |
| `4` | **Slide 05 — Hành trình thực tế** | `5` | `0 → 4` | `SLIDE 05 / 06 · CẢNH 01 / 05` .. `05 / 05` |
| `5` | **Slide 06 — Lời tri ân & Cảnh kết** | `5` | `0 → 4` | `SLIDE 06 / 06 · BƯỚC 01 / 05` .. `05 / 05` |
| **Tổng cộng** | **Toàn bộ bài thuyết trình** | **34 bước** | **Tuần tự 100%** | Thanh tiến trình `#global-progress-fill` (`2.9% → 100%`) |

---

## 3. LOGIC ĐIỀU HƯỚNG TIẾN (`nextStep`) & LÙI (`prevStep`)

### Hàm `nextStep()` (Kích hoạt bởi `#hud-next`, `ArrowRight`, `Space`, `PageDown`, `Enter`)
1. Nếu đang mở hộp thoại (`lightbox` hoặc `help`) hoặc đang ở chế độ `overview`, bỏ qua lệnh chuyển bước.
2. Nếu `stepIndex < currentSlide.totalSteps - 1`:
   - Tăng `stepIndex + 1` ngay trong cùng `slideIndex`.
   - Gọi hàm hoạt ảnh bước tương ứng (`applyLandingStep` hoặc `applySlideXStep`).
3. Nếu `stepIndex === currentSlide.totalSteps - 1`:
   - Nếu `slideIndex < 5`: Chuyển sang `slideIndex + 1` với `stepIndex = 0`, kích hoạt hiệu ứng quét sáng chuyển chương (`playInterSlideTransition`).
   - Nếu đang ở bước cuối cùng của toàn bài (`slideIndex === 5, stepIndex === 4`): **Giữ nguyên trạng thái Final Hold State**, tuyệt đối không quay vòng về đầu.

### Hàm `prevStep()` (Kích hoạt bởi `#hud-prev`, `ArrowLeft`, `PageUp`)
1. Nếu `stepIndex > 0`:
   - Giảm `stepIndex - 1` ngay trong cùng `slideIndex` và phục hồi chính xác cảnh con trước đó.
2. Nếu `stepIndex === 0` và `slideIndex > -1`:
   - Lùi về `slideIndex - 1` tại **bước cuối cùng của slide trước đó** (`prevSlide.totalSteps - 1`), đảm bảo thứ tự lùi khớp hoàn toàn 1:1 với thứ tự tiến.

---

## 4. CƠ CHẾ LOẠI BỎ XUNG ĐỘT SỰ KIỆN (ZERO DOUBLE-TRIGGER)

- Khởi tạo Reveal.js với `keyboard: false`, `touch: false` để Reveal không tự ý nhảy slide khi người dùng bấm phím mũi tên hoặc `Space`.
- Mọi nút tab con trên Slide 03 (`[data-slide3-zone]`), Slide 05 (`[data-slide5-scene]`), và nút chuyển cảnh trên Slide 06 (`#btn-trigger-finale`, `#btn-back-tribute`) đều gọi trực tiếp `goToState(slideIndex, stepIndex)` để đồng bộ tuyệt đối với bộ máy trạng thái.
