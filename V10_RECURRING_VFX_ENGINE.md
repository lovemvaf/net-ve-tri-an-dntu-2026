# V10 RECURRING VFX ENGINE — NÉT VẼ TRI ÂN DNTU 2026
## Bộ Lập Lịch Trung Tâm Chu Kỳ 4–7 Giây (`RecurringCinematicVFX` / `AmbientBurstDirector`)

---

## 1. Nguyên Tắc Thiết Kế Chu Kỳ 4–7 Giây

Trong `src/scripts/webgl-background.js` (`L309–321`, `L425–496`, `L645–667`), toàn bộ các đợt hiệu ứng lặp lại trên mọi slide và mọi cảnh con được điều khiển bởi **duy nhất một bộ lập lịch trung tâm (`AmbientBurstDirector`)** tích hợp trực tiếp vào vòng lặp `requestAnimationFrame`:

- **Không dùng `setInterval` hoặc `setTimeout` lặp độc lập:** Loại bỏ 100% nguy cơ rò rỉ bộ nhớ, trùng timer khi chuyển slide hoặc dồn burst khi chuyển tab trình duyệt.
- **Khoảng cách giữa các đợt hiệu ứng (`nextBurstInterval`):**
  $$\text{nextBurstInterval} = 4.6 + (\text{totalBurstsTriggered} \bmod 3) \times 0.55 \in \{4.60\text{s}, 5.15\text{s}, 5.70\text{s}\}$$
  Luôn nằm chính xác trong khoảng **4–7 giây** theo yêu cầu Mục X.

---

## 2. Ba Cấp Độ Burst & Chuỗi Nhịp Điệu Tự Nhiên

Bộ lập lịch vận hành theo chuỗi nhịp điệu cân bằng (80% êm dịu – 20% cao trào):
$$\texttt{SOFT} \rightarrow \texttt{MEDIUM} \rightarrow \texttt{SOFT} \rightarrow \texttt{GRAND} \rightarrow \texttt{SOFT} \rightarrow \texttt{MEDIUM} \rightarrow \texttt{SOFT} \rightarrow \texttt{GRAND}$$

| Cấp độ Burst | Thời lượng (`burstDuration`) | Cấu trúc hiệu ứng (Tự động nhân hệ số theo `PerformanceTier`) | Khoảng nghỉ trước đợt kế tiếp |
| :--- | :--- | :--- | :--- |
| **`SOFT`** | `3,1 giây` | **5 bông hoa nở** ở vùng rìa + **26 cánh hoa** bay nhẹ + **58 hạt bụi vàng** + **6 cánh chim xa** (nếu cảnh có chim). | `1,5 – 2,6 giây` |
| **`MEDIUM`** | `3,5 giây` | **9 bông hoa nở** + **50 cánh hoa** lướt theo gió + **115 hạt sáng dòng chảy** + **10 cánh chim**. | `1,1 – 2,2 giây` |
| **`GRAND`** | `3,9 giây` | **14 bông hoa nở rộ** + **68–92 cánh hoa 3D (`Floral Storm`)** + **175–220 hạt sáng (`Golden Wave`)** + **15 cánh chim chân trời**. | `0,8 – 1,8 giây` |

---

## 3. Cơ Chế Chống Chồng Chéo & Xử Lý Ngoại Lệ

1. **Khi chuyển slide hoặc chuyển cảnh con (`setSlideMood`):** Hệ thống lập tức kích hoạt đợt hiệu ứng đặc trưng của cảnh mới (`entryBurstLevel`) và đặt lại đồng hồ `timeSinceLastBurstStart = 0` để chu kỳ 4–7 giây mới bắt đầu mượt mà.
2. **Khi tab trình duyệt ẩn (`document.hidden`):** Vòng lặp `animate()` tạm dừng hoàn toàn và giới hạn `dt <= 0.05s` khi quay lại, đảm bảo không bao giờ phát dồn nhiều burst cùng lúc.
3. **Khi bật `Reduced Motion`:** Bộ lập lịch tự động tắt các đợt burst chuyển động mạnh, giữ không gian tĩnh lặng và an toàn tuyệt đối.
