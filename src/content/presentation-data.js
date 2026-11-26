/**
 * BỘ DỮ LIỆU TRÌNH CHIẾU 5 CẢNH — NGHỊ QUYẾT 57-NQ/TW
 * Cuộc thi: Trại Thanh niên số thành phố Đồng Nai năm 2026
 * Chủ đề 1 – Nghị quyết đến gần thanh niên | Mục 2 – Bộ 05 ấn phẩm
 *
 * Lưu ý kiểm chứng (FACT_CHECK_NQ57.md):
 * - Toàn bộ lời dẫn thuyết trình (speakerCue) khớp nguyên văn campaign.config.json (Section G5).
 * - Các khung cảnh minh họa 2D là tình huống truyền thông giả định và phần việc thanh niên đề xuất.
 * - Đường dẫn toàn văn chính thức: mst.gov.vn (đã kiểm chứng HTTP 200).
 */

export const EXHIBITION_META = {
  competitionName: 'TRẠI THANH NIÊN SỐ TP. ĐỒNG NAI 2026',
  topicLabel: 'CHỦ ĐỀ 1 · NGHỊ QUYẾT 57-NQ/TW',
  resolutionCode: '57-NQ/TW',
  issuedLabel: 'Bộ Chính trị (22/12/2024)',
  emblemSrc: './assets/identity/derived/huy-hieu-doan-clean.png',
  emblemAlt: 'Huy hiệu Đoàn Thanh niên Cộng sản Hồ Chí Minh',
  officialResolutionUrl:
    'https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm',
  officialLinkLabel: 'Mở toàn văn Nghị quyết 57-NQ/TW (mst.gov.vn)',
  aiDisclosure: 'Hình ảnh minh họa 2D được tạo với sự hỗ trợ của AI.'
};

export const SCENES = [
  {
    index: 0,
    sceneId: 'scene-01',
    badge: '01 / 05',
    posterIndex: '01/05',
    pillLabel: '01 Đặt câu hỏi',
    phaseTag: 'NHỊP MỞ · THU HÚT & ĐẶT VẤN ĐỀ',
    beatHeading: 'Đưa văn kiện lớn về góc nhìn gần gũi',
    narrativePurpose:
      'Mở đầu bằng một câu hỏi tự nhiên giữa hai bạn trẻ: thay vì trích dẫn điều khoản dày chữ, ấn phẩm khơi gợi để đoàn viên nhận ra Nghị quyết số 57-NQ/TW (22/12/2024) liên quan trực tiếp đến học tập và cuộc sống hằng ngày.',
    transitionNote: 'Chuyển mạch sang 02: từ thắc mắc ban đầu mở sang nhu cầu tìm hiểu đúng trọng tâm.',
    speakerCue:
      'Có những nghị quyết nghe rất lớn và nhiều thuật ngữ. Nhưng với người trẻ, câu hỏi gần nhất lại là: điều đó liên quan gì đến mình?',
    posterSrc: './assets/posters/01_NghiQuyet57_GanBan.png',
    posterAlt: 'Ấn phẩm 01/05: Nghị quyết 57 gần bạn thế nào? — Từ một câu hỏi nhỏ, mở ra hành trình lớn.',
    zoomCaption: '01/05 · Nghị quyết 57 gần bạn thế nào? (1080 × 1350 px)',
    canvasMood: 'question-arc',
    isFinal: false
  },
  {
    index: 1,
    sceneId: 'scene-02',
    badge: '02 / 05',
    posterIndex: '02/05',
    pillLabel: '02 Hiểu đúng',
    phaseTag: 'NHỊP GIẢI MÃ · TÓM TẮT DỄ NHỚ',
    beatHeading: 'Chuyển hóa khái niệm thành nhận thức đúng',
    narrativePurpose:
      'Hai nhân vật cùng mở máy tính và sổ tay để nắm bắt tinh thần đột phá về khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số theo ba cụm gợi nhớ súc tích, trọng tâm vào việc hiểu bản chất và cách ứng dụng phù hợp.',
    transitionNote: 'Chuyển mạch sang 03: khi đã hiểu đúng, câu hỏi tiếp theo là công nghệ phục vụ ai.',
    speakerCue:
      'Khi bắt đầu tìm hiểu, chúng em nhận ra khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số không chỉ là những khái niệm. Quan trọng hơn là biết học và ứng dụng chúng đúng cách.',
    posterSrc: './assets/posters/02_HieuDung_DeBatDau.png',
    posterAlt: 'Ấn phẩm 02/05: Hiểu đúng để bắt đầu — Khoa học, công nghệ · Đổi mới sáng tạo · Chuyển đổi số.',
    zoomCaption: '02/05 · Hiểu đúng để bắt đầu (1080 × 1350 px)',
    canvasMood: 'three-harmonics',
    isFinal: false
  },
  {
    index: 2,
    sceneId: 'scene-03',
    badge: '03 / 05',
    posterIndex: '03/05',
    pillLabel: '03 Vì con người',
    phaseTag: 'NHỊP GIÁ TRỊ · HƯỚNG VỀ NGƯỜI DÂN',
    beatHeading: 'Lấy người dân làm trung tâm của chuyển đổi số',
    narrativePurpose:
      'Tình huống minh họa giả định nhấn mạnh giá trị nhân văn: tri thức công nghệ chỉ thật sự có ích khi giúp người dân lớn tuổi bớt e ngại trước màn hình điện thoại và xử lý công việc hằng ngày thuận tiện hơn.',
    transitionNote: 'Chuyển mạch sang 04: nhân rộng từ một cuộc hướng dẫn nhỏ thành phần việc của tuổi trẻ.',
    speakerCue:
      'Đôi khi sự thay đổi bắt đầu rất nhỏ: thêm một người tự tin sử dụng chiếc điện thoại, thêm một việc được thực hiện thuận tiện hơn.',
    posterSrc: './assets/posters/03_CongNghe_ViConNguoi.png',
    posterAlt: 'Ấn phẩm 03/05: Công nghệ vì con người — Thêm một kỹ năng số, thêm một người tự tin.',
    zoomCaption: '03/05 · Công nghệ vì con người (1080 × 1350 px)',
    canvasMood: 'warm-human-glow',
    isFinal: false
  },
  {
    index: 3,
    sceneId: 'scene-04',
    badge: '04 / 05',
    posterIndex: '04/05',
    pillLabel: '04 Hành động',
    phaseTag: 'NHỊP THỰC HÀNH · ĐỀ XUẤT PHẦN VIỆC',
    beatHeading: 'Gợi ý việc làm vừa sức tại cơ sở',
    narrativePurpose:
      'Không gian sinh hoạt cộng đồng giả định phác họa các phần việc đề xuất cho đoàn viên tại cơ sở: tự rèn kỹ năng số, kiên nhẫn đồng hành hỗ trợ người dân thao tác thiết yếu và đóng góp sáng kiến phục vụ địa phương.',
    transitionNote: 'Chuyển mạch sang 05: khi người được hỗ trợ đủ tự tin tiếp tục chia sẻ lại.',
    speakerCue:
      'Và khi nhiều bạn trẻ cùng chung tay, việc nhỏ có thể trở thành hoạt động thiết thực ở cơ sở: học kỹ năng số, hỗ trợ người dân, chia sẻ điều mình biết.',
    posterSrc: './assets/posters/04_ThanhNienDongNai_HanhDong.png',
    posterAlt: 'Ấn phẩm 04/05: Thanh niên Đồng Nai hành động — Học kỹ năng số · Hỗ trợ người dân · Sáng tạo.',
    zoomCaption: '04/05 · Thanh niên Đồng Nai hành động (1080 × 1350 px)',
    canvasMood: 'community-network',
    isFinal: false
  },
  {
    index: 4,
    sceneId: 'scene-05',
    badge: '05 / 05',
    posterIndex: '05/05',
    pillLabel: '05 Lan tỏa',
    phaseTag: 'NHỊP KẾT · LAN TỎA & ĐỐI CHIẾU NGUỒN',
    beatHeading: 'Khép vòng tròn sẻ chia và dẫn nguồn gốc',
    narrativePurpose:
      'Điểm lắng đọng của mạch truyện 05 phần: bác gái từng làm quen điện thoại ở cảnh 03 nay chủ động hướng dẫn lại cho người hàng xóm, trong khi hai bạn trẻ mỉm cười phía sau. Mã QR thật trên ấn phẩm mở thẳng tới văn bản chính thức.',
    transitionNote: 'Kết thúc mạch 05 ấn phẩm — mời quét mã QR trên tranh hoặc bấm liên kết toàn văn bên dưới.',
    speakerCue:
      'Đến khi người được giúp có thể tự chia sẻ lại cho người khác, chúng ta thấy kiến thức thật sự được lan tỏa. Đó là tinh thần mà bộ ấn phẩm muốn gửi gắm.',
    posterSrc: './assets/posters/05_HieuDung_LamThat_LanToa.png',
    posterAlt: 'Ấn phẩm 05/05: Hiểu đúng. Làm thật. Lan tỏa. — Quét mã đọc Nghị quyết gốc.',
    zoomCaption: '05/05 · Hiểu đúng. Làm thật. Lan tỏa. — Mã QR tới mst.gov.vn (1080 × 1350 px)',
    canvasMood: 'outward-ripples',
    isFinal: true
  }
];
