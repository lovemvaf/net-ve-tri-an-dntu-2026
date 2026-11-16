/**
 * CENTRAL CONTENT & SPEAKER SCRIPT CONFIGURATION
 * Tác phẩm: NÉT VẼ TRI ÂN — MỘT DÒNG CODE, VẠN CHÂN TRỜI
 * Tác giả: Quách Khoa Đức | Khoa Công nghệ thông tin – Trường Đại học Công nghệ Đồng Nai (DNTU)
 */

export const PRESENTATION_META = {
  title: 'NÉT VẼ TRI ÂN',
  subtitle: 'MỘT DÒNG CODE – VẠN CHÂN TRỜI',
  occasion: 'Chào mừng Ngày Nhà giáo Việt Nam 20/11',
  contest: 'Cuộc thi “Nét vẽ tri ân” – Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đồng Nai (DNTU)',
  author: 'Quách Khoa Đức',
  faculty: 'Khoa Công nghệ thông tin',
  university: 'Trường Đại học Công nghệ Đồng Nai (DNTU)',
  targetDurationMinutes: '6 – 8 phút',
  poem: {
    line1: 'Từng bậc tri thức thầy trao,',
    line2: 'Thành đường em bước vươn cao chân trời.',
    closing: 'Tri thức trao đi, tương lai tiếp nối.'
  }
};

export const SPEAKER_NOTES = [
  {
    slideIndex: 0,
    slideTitle: 'SLIDE 01 — KHỞI NGUỒN: NÉT VẼ TRI ÂN',
    estimatedTime: '01:00 – 01:15',
    nextSlideTitle: 'Slide 02: Nét vẽ đầu tiên – Người thầy & Cô Liệu',
    cues: [
      'Mở đầu chậm rãi, trang trọng, ánh mắt hướng về Ban Giám khảo và quý thầy cô.',
      'Nhấn giọng ở câu thông điệp: “Có những bài học bắt đầu từ màn hình máy tính. Có những ước mơ bắt đầu từ một người thầy.”'
    ],
    script: `Kính thưa quý thầy cô, kính thưa Ban Giám khảo cùng toàn thể các bạn sinh viên thân mến.

Em tên là Quách Khoa Đức, sinh viên Khoa Công nghệ thông tin – Trường Đại học Công nghệ Đồng Nai. Hôm nay, đến với cuộc thi “Nét vẽ tri ân” nhân kỷ niệm Ngày Nhà giáo Việt Nam 20/11, em xin phép được mang đến tác phẩm mang tên: “Nét vẽ tri ân — Một dòng code, vạn chân trời”.

[Ngừng 2 giây — Hướng tay về poster trung tâm]

Thưa thầy cô, với một sinh viên ngành Công nghệ thông tin như chúng em, thế giới thường bắt đầu từ những ký tự trên màn hình máy tính. Nhưng để một dòng code nhỏ bé có thể chạy được, để một sinh viên rụt rè ngày đầu nhập học có thể nhìn thấy bầu trời rộng mở phía trước — tất cả đều bắt đầu từ sự dìu dắt của người thầy.

Tác phẩm này không chỉ là tấm lòng biết ơn của em gửi đến quý thầy cô nhân ngày 20/11, mà còn là câu chuyện thật về hành trình trưởng thành của chính em dưới mái trường DNTU: từ một lời động viên thuở ban đầu, đến khát vọng rèn luyện và hai năm liên tiếp chạm tới danh hiệu Sinh viên 5 tốt.`
  },
  {
    slideIndex: 1,
    slideTitle: 'SLIDE 02 — NÉT VẼ ĐẦU TIÊN: NGƯỜI THẦY',
    estimatedTime: '01:15 – 01:30',
    nextSlideTitle: 'Slide 03: Từ trang sách đến chân trời',
    cues: [
      'Giọng kể trầm ấm, chân thành khi nhắc về những ngày đầu bỡ ngỡ và sự dìu dắt của cô Liệu.',
      'Chỉ vào chi tiết nét sáng từ tay giảng viên nối tới dòng lệnh print("Hello, DNTU").'
    ],
    script: `Khi nhìn vào góc trái của tác phẩm, quý thầy cô sẽ thấy hình tượng người giảng viên trong tà áo dài trắng thanh cao, bên cạnh là bó hoa tươi thắm và nét sáng lan tỏa từ đầu ngón tay chạm vào màn hình lập trình với dòng chữ quen thuộc: print("Hello, DNTU").

Hình tượng nghệ thuật ấy gợi nhắc trong em ký ức sâu sắc về những ngày đầu tiên bước chân vào giảng đường Đại học Công nghệ Đồng Nai. Khi ấy, mọi thứ với em đều mới mẻ và không ít bỡ ngỡ. Em từng tự hỏi liệu mình có đủ khả năng để theo đuổi con đường công nghệ đầy thử thách này hay không.

[Ngừng 1.5 giây — Giọng xúc động, chân thành]

Chính trong khoảng thời gian đó, em đã may mắn nhận được sự dìu dắt, hướng dẫn và hỗ trợ tận tình từ cô Liệu, cùng sự đồng hành ấm áp của quý thầy cô trong Khoa Công nghệ thông tin. Cô và các thầy cô không chỉ dạy chúng em kiến thức chuyên môn, mà còn mở ra cho chúng em những chương trình, những hoạt động học thuật và cơ hội trải nghiệm thực tế để chúng em từng bước vượt qua sự tự ti.

Đúng như tâm niệm mà em luôn khắc ghi: “Người thầy không chỉ trao kiến thức, mà còn trao cho sinh viên niềm tin vào chính mình.” Chính dòng lệnh Hello, DNTU đầu tiên được thắp sáng bởi niềm tin ấy đã trở thành nét vẽ khởi đầu cho cả hành trình phía sau.`
  },
  {
    slideIndex: 2,
    slideTitle: 'SLIDE 03 — TỪ TRANG SÁCH ĐẾN CHÂN TRỜI',
    estimatedTime: '01:30 – 01:45',
    nextSlideTitle: 'Slide 04: Năm tiêu chí, một hành trình (Sinh viên 5 tốt)',
    cues: [
      'Bấm chọn lần lượt 3 vùng điểm sáng (Con thuyền sách -> Cầu thang & bàn tay nâng đỡ -> Laptop, AI & Bình minh) theo nhịp nói.',
      'Nhấn mạnh hình ảnh hai sinh viên nam – nữ ngồi trên con thuyền sách và đoạn code def future().'
    ],
    script: `Từ ánh sáng khai mở của người thầy, mạch cảm xúc của bức tranh dẫn chúng ta đến trung tâm của tác phẩm — nơi chứa đựng thông điệp: “Thầy cô trao cho chúng em tri thức. Và tri thức trở thành con thuyền đưa chúng em tới tương lai.”

Ở đây, quyển sách mở rộng vừa mang dáng dấp của một con thuyền đang rẽ mây vươn khơi, vừa gợi liên tưởng đến đôi cánh của khát vọng. Ngồi trên con thuyền sách ấy là hai bạn sinh viên — một nam và một nữ với chiếc ba lô hành trang tuổi trẻ và dải khăn đỏ nhiệt huyết — cùng hướng ánh mắt về phía chân trời phía trước.

[Bấm chuyển sang Điểm sáng 02: Cầu thang sách & Bàn tay sẻ chia]

Từ trang sách mở ra là những bậc thang tri thức được tạo nên từ từng chồng sách vững chãi. Trên hành trình đi lên ấy, chúng em không hề đơn độc. Hình ảnh người sinh viên đi trước ngoảnh lại, đưa bàn tay kéo người bạn phía sau cùng bước lên chính là vẻ đẹp của tình bạn, của truyền thống dìu dắt nhau giữa các thế hệ sinh viên Khoa CNTT DNTU.

[Bấm chuyển sang Điểm sáng 03: Công nghệ, AI & Ánh bình minh]

Và ở phía bên phải của con thuyền sách là chiếc laptop với hàm lập trình def future(): learn(), create(), contribute(), return better_world() — cùng các biểu tượng Trí tuệ nhân tạo AI, vi mạch số và điện toán đám mây hướng về ánh bình minh đô thị. Với em, thầy cô đã dạy rằng học công nghệ không chỉ để viết ra những đoạn mã chạy đúng, mà là để học hỏi, sáng tạo và đóng góp cho một thế giới tốt đẹp hơn.`
  },
  {
    slideIndex: 3,
    slideTitle: 'SLIDE 04 — NĂM TIÊU CHÍ, MỘT HÀNH TRÌNH',
    estimatedTime: '01:15 – 01:30',
    nextSlideTitle: 'Slide 05: Hành trình thực tế (Photo Storytelling)',
    cues: [
      'Kể câu chuyện từ sự ngưỡng mộ các anh chị đi trước đến quyết tâm rèn luyện.',
      'Giữ thái độ khiêm nhường, biết ơn khi nhắc đến dấu mốc 02 năm liên tiếp đạt Sinh viên 5 tốt.'
    ],
    script: `Thưa quý thầy cô và Ban Giám khảo, dọc theo những bậc thang sách trong poster là năm biển chỉ dẫn tỏa sáng: Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt và Hội nhập tốt. Đây không phải là năm nấc thang phân cấp cao thấp, mà là năm mảnh ghép toàn diện của danh hiệu Sinh viên 5 tốt.

Hình ảnh này gắn liền với một kỷ niệm rất thật của bản thân em. Khi mới vào trường, trong những lần tham dự các sự kiện của Khoa Công nghệ thông tin và của Nhà trường, em đã được tận mắt chứng kiến các anh chị sinh viên khóa trên bước lên sân khấu nhận những giải thưởng cao quý, đặc biệt là danh hiệu Sinh viên 5 tốt.

Khoảnh khắc nhìn các anh chị tỏa sáng đã gieo vào lòng em một sự ngưỡng mộ lớn lao, đồng thời đánh thức trong em câu hỏi: “Liệu mình có thể cố gắng để trưởng thành được như các anh chị hay không?”

[Ngừng 1.5 giây — Nhấn giọng vừa quyết tâm vừa biết ơn]

Từ sự ngưỡng mộ ấy, được sự động viên của cô Liệu và các thầy cô trong Khoa, em bắt đầu lập kế hoạch cho chính mình: nghiêm túc hơn trong từng môn học, rèn luyện đạo đức, giữ gìn thể lực, tích cực tham gia các hoạt động tình nguyện vì cộng đồng và chủ động mở rộng kỹ năng hội nhập. Và sự nỗ lực bền bỉ ấy đã mang lại cho em niềm vinh dự vô cùng trân quý: hai năm liên tiếp đạt danh hiệu Sinh viên 5 tốt ở các cấp. Với em, danh hiệu ấy trước hết là lời báo công đầy biết ơn gửi đến thầy cô và các anh chị đã truyền lửa.`
  },
  {
    slideIndex: 4,
    slideTitle: 'SLIDE 05 — HÀNH TRÌNH THỰC TẾ',
    estimatedTime: '01:00 – 01:15',
    nextSlideTitle: 'Slide 06: Tri ân và Tiếp nối (Lời kết)',
    cues: [
      'Điểm qua 4 nhóm hình ảnh minh chứng cho quá trình học tập, hoạt động và trưởng thành.',
      'Nhấn mạnh câu thông điệp: “Điều em từng ngưỡng mộ đã trở thành động lực để em không ngừng cố gắng.”'
    ],
    script: `Bước sang Slide thứ năm — “Từ ước mơ đến hành trình thực tế”, đây là không gian lưu giữ những khoảnh khắc thật trên chặng đường đại học của em tại Khoa Công nghệ thông tin DNTU.

Từ những ngày đầu tham gia các buổi sinh hoạt, hội thảo học thuật của Khoa; những giờ miệt mài bên bàn phím cùng bạn bè nghiên cứu chuyên môn; những ngày khoác lên mình màu áo tình nguyện sẻ chia cùng cộng đồng; cho đến khoảnh khắc vinh dự được xướng tên nhận danh hiệu Sinh viên 5 tốt trong hai năm liên tiếp.

Mỗi bức ảnh ở đây đều nhắc em nhớ rằng: không có sự trưởng thành nào tự nhiên mà có. Điều em từng ngưỡng mộ ở các anh chị đi trước, nhờ có môi trường DNTU và sự dìu dắt của thầy cô, đã thực sự trở thành động lực để em kiên trì bước tiếp mỗi ngày.`
  },
  {
    slideIndex: 5,
    slideTitle: 'SLIDE 06 — TRI ÂN VÀ TIẾP NỐI',
    estimatedTime: '01:00 – 01:15',
    nextSlideTitle: 'Hoàn tất bài thuyết trình',
    cues: [
      'Đọc chậm rãi hai câu thơ trong poster gốc.',
      'Gửi lời cảm ơn trực tiếp đến cô Liệu, thầy cô Khoa CNTT và thầy cô Trường Đại học Công nghệ Đồng Nai.',
      'Kết thúc sâu lắng bằng câu nói cuối cùng trên màn hình.'
    ],
    script: `Để khép lại bài thuyết trình hôm nay, em xin được mượn hai câu thơ ở phần cuối của bức poster:

“Từng bậc tri thức thầy trao,
Thành đường em bước vươn cao chân trời.”

[Ngừng 2 giây — Giọng lắng đọng, trang trọng]

Từ tận đáy lòng mình, em xin gửi lời cảm ơn sâu sắc nhất đến cô Liệu — người đã kiên nhẫn dìu dắt và trao cho em niềm tin từ những ngày đầu bỡ ngỡ. Em xin trân trọng cảm ơn quý thầy cô Khoa Công nghệ thông tin cùng quý thầy cô Trường Đại học Công nghệ Đồng Nai đã tạo nên một môi trường học tập nhân văn, giàu cơ hội để chúng em được ước mơ, được thử sức và được trưởng thành.

Chặng đường phía trước vẫn còn rất dài, và em xin hứa sẽ tiếp tục học hỏi không ngừng, giữ vững tinh thần của một Sinh viên 5 tốt để sống có ích và đóng góp nhiều hơn cho xã hội.

Bởi em luôn tin rằng: “Món quà ý nghĩa nhất mà người học trò có thể dành tặng thầy cô không chỉ là thành tích hôm nay, mà còn là cách mình sống và cống hiến trong những ngày mai.”

Tri thức trao đi, tương lai tiếp nối. Em xin kính chúc quý thầy cô và Ban Giám khảo thật nhiều sức khỏe, hạnh phúc nhân Ngày Nhà giáo Việt Nam 20/11. Em xin trân trọng cảm ơn!`
  }
];

