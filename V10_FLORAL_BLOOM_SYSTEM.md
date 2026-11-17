# V10 FLORAL BLOOM SYSTEM — NÉT VẼ TRI ÂN DNTU 2026
## Hệ Thống Hoa Nở Rộ 6 Giai Đoạn (`FloralBloomSystem`) & Làn Sóng Hoa Tri Ân 20/11

---

## 1. Định Hướng Mỹ Thuật Hoa Tri Ân 20/11

Thay vì chỉ dùng các cánh hoa đơn lẻ bay qua màn hình, phiên bản V10 xây dựng hệ thống **`FloralBloomSystem`** trong `src/scripts/webgl-background.js` (`L217–296` và `L504–605`) tái hiện **3 loài hoa biểu trưng của Ngày Nhà giáo Việt Nam 20/11**:
1. **Hoa Hồng Tri Ân (`themeIdx = 0` — Blush Pink & Warm Ivory):** 8 cánh ngoài mềm mại (`#FFF8FA → #F4B8C4 → #D96B82`), 6 cánh trong và nhụy vàng ấm.
2. **Hoa Cúc Vàng / Hướng Dương Tri Thức (`themeIdx = 1` — Champagne Gold & Amber):** 12 cánh ngoài rực rỡ (`#FFFFF8 → #F7E0AE → #D4A853`), gợi nhắc bó hoa trên bục giảng của người thầy trong poster.
3. **Đóa Hoa Tâm Huyết (`themeIdx = 2` — Warm Ivory, Soft Blush & Golden Crown):** 10 cánh thanh tao kết hợp vòng nhụy vàng kim.

---

## 2. Chu Trình Hoa Nở 6 Giai Đoạn (`drawBloomingFlower`)

Mỗi bông hoa trong mảng `bloomFlowers[]` có đường kính khi nở hoàn chỉnh từ **`68px` đến `112px`** và trải qua 6 giai đoạn mượt mà trong vòng đời `3,1–3,9 giây`:

1. **Giai đoạn 1 (`p = 0.00 → 0.18` — Nụ Hoa Xuất Hiện):** Nụ hoa nhỏ (`outerScale = 0.18 → 0.40`) hiện dần cùng quầng sáng vàng ấm phía sau.
2. **Giai đoạn 2 (`p = 0.18 → 0.52` — Lớp Cánh Ngoài Bung Mở):** Vòng cánh ngoài (`flowerOuterSprites`) mở rộng tới kích thước cực đại (`outerScale -> 1.0`) kèm chuyển động xoay nhẹ.
3. **Giai đoạn 3 (`p = 0.22 → 0.58` — Lớp Cánh Trong & Đài Nhụy Vàng Nở Rộ):** Vòng cánh trong (`flowerInnerSprites`) và 10 nhụy vàng kim nở bung theo chiều xoay ngược nhẹ, tạo chiều sâu 3D nhiều lớp cánh.
4. **Giai đoạn 4 (`p = 0.38 → 0.88` — Hạt Phấn Sáng Vàng Tỏa Quanh Hoa):** 5 đốm sáng vàng (`starHaloSprite`) xoay quanh nhụy hoa và lan dần ra ngoài như hương sắc tri ân.
5. **Giai đoạn 5 (`p >= 0.72` — Tách Cánh Hoa Theo Gió):** Khi hoa đạt độ mãn khai, 2 cánh hoa thực sự tách khỏi bông hoa và bay hòa vào dòng chảy `floralStormPetals`.
6. **Giai đoạn 6 (`p = 0.74 → 1.00` — Tan Nhẹ Vào Không Gian):** Đóa hoa mờ dần êm ái vào ánh sáng nền, nhường chỗ cho khoảng nghỉ dịu mắt trước đợt nở tiếp theo.
