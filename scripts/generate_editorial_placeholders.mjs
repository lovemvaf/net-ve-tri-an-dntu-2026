import fs from 'node:fs';
import path from 'node:path';

const persDir = path.resolve('public/assets/personal');
fs.mkdirSync(persDir, { recursive: true });

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createEditorialPlaceholder({ badge, title, subtitle, hint, accent = '#F0CC85', bg1 = '#152F54', bg2 = '#091526' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="520" fill="url(#bgGrad)"/>
  <rect width="800" height="520" fill="url(#glow)"/>
  <rect x="22" y="22" width="756" height="476" rx="16" fill="none" stroke="${accent}" stroke-opacity="0.32" stroke-width="1.5" stroke-dasharray="7 5"/>
  <rect x="34" y="34" width="732" height="452" rx="12" fill="none" stroke="#F8F1E3" stroke-opacity="0.08" stroke-width="1"/>
  
  <!-- Minimalist Camera / Frame Emblem -->
  <g transform="translate(400, 165)">
    <circle cx="0" cy="0" r="44" fill="${accent}" fill-opacity="0.1" stroke="${accent}" stroke-opacity="0.48" stroke-width="1.5"/>
    <rect x="-20" y="-13" width="40" height="28" rx="5" fill="none" stroke="#F8F1E3" stroke-width="2"/>
    <circle cx="0" cy="1" r="7" fill="none" stroke="${accent}" stroke-width="2"/>
    <path d="M-8 -13 L-4 -19 L4 -19 L8 -13" fill="none" stroke="#F8F1E3" stroke-width="1.8"/>
  </g>

  <rect x="275" y="58" width="250" height="28" rx="14" fill="${accent}" fill-opacity="0.14" stroke="${accent}" stroke-opacity="0.42" stroke-width="1"/>
  <text x="400" y="77" font-family="Segoe UI, Arial, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.2" text-anchor="middle" fill="${accent}">${escapeXml(badge)}</text>

  <text x="400" y="262" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#F8F1E3">${escapeXml(title)}</text>
  <text x="400" y="298" font-family="Segoe UI, Arial, sans-serif" font-size="14.5" text-anchor="middle" fill="#CBD5E1">${escapeXml(subtitle)}</text>
  
  <rect x="200" y="340" width="400" height="36" rx="18" fill="#091526" fill-opacity="0.82" stroke="${accent}" stroke-opacity="0.38" stroke-width="1"/>
  <text x="400" y="363" font-family="Segoe UI, Arial, sans-serif" font-size="12.5" font-weight="600" text-anchor="middle" fill="${accent}">${escapeXml(hint)}</text>
</svg>`;
}

const slots = [
  {
    file: 'slot-01-khoa-cntt.svg',
    badge: 'KHOẢNH KHẮC 01 · KHỞI ĐẦU',
    title: 'Những Ngày Đầu & Sự Kiện Khoa CNTT',
    subtitle: 'Ký ức giảng đường, hội thảo học thuật và ngày hội Khoa CNTT – DNTU',
    hint: 'Kéo thả ảnh thật vào khung hoặc bấm “Thay ảnh”',
    accent: '#F0CC85',
    bg1: '#19365F',
    bg2: '#0B192E'
  },
  {
    file: 'slot-02-hoc-tap.svg',
    badge: 'KHOẢNH KHẮC 02 · HỌC TẬP',
    title: 'Học Tập, Thực Hành & Rèn Luyện Chuyên Môn',
    subtitle: 'Những giờ lập trình, nghiên cứu đồ án và làm việc nhóm tại phòng Lab',
    hint: 'Kéo thả ảnh thật vào khung hoặc bấm “Thay ảnh”',
    accent: '#F0CC85',
    bg1: '#163056',
    bg2: '#091526'
  },
  {
    file: 'slot-03-tinh-nguyen.svg',
    badge: 'KHOẢNH KHẮC 03 · HOẠT ĐỘNG',
    title: 'Hoạt Động Phong Trào, Tình Nguyện & Rèn Luyện',
    subtitle: 'Sẻ chia vì cộng đồng, hoạt động Đoàn – Hội và rèn luyện thể chất',
    hint: 'Kéo thả ảnh thật vào khung hoặc bấm “Thay ảnh”',
    accent: '#F0CC85',
    bg1: '#1B355A',
    bg2: '#0B182B'
  },
  {
    file: 'slot-04-sv5tot-nam1.svg',
    badge: 'KHOẢNH KHẮC 04 · VINH DANH',
    title: 'Danh Hiệu Sinh Viên 5 Tốt (Năm Thứ Nhất)',
    subtitle: 'Dấu mốc trưởng thành từ sự ngưỡng mộ các anh chị khóa trước',
    hint: 'Kéo thả ảnh thật vào khung hoặc bấm “Thay ảnh”',
    accent: '#F0CC85',
    bg1: '#233253',
    bg2: '#0E1729'
  },
  {
    file: 'slot-05-sv5tot-nam2.svg',
    badge: 'KHOẢNH KHẮC 05 · BỀN BỈ',
    title: '02 Năm Liên Tiếp Đạt Danh Hiệu Sinh Viên 5 Tốt',
    subtitle: 'Trái ngọt của hành trình kiên trì rèn luyện và lòng biết ơn thầy cô',
    hint: 'Kéo thả ảnh thật vào khung hoặc bấm “Thay ảnh”',
    accent: '#F0CC85',
    bg1: '#2A2845',
    bg2: '#111626'
  },
  {
    file: 'slot-06-tri-an.svg',
    badge: 'KHOẢNH KHẮC 06 · TRI ÂN',
    title: 'Kỷ Niệm Đáng Nhớ Cùng Thầy Cô & Bạn Bè DNTU',
    subtitle: 'Những khoảnh khắc ấm áp dưới mái trường Đại học Công nghệ Đồng Nai',
    hint: 'Kéo thả ảnh thật vào khung hoặc bấm “Thay ảnh”',
    accent: '#F0CC85',
    bg1: '#19365F',
    bg2: '#0A1628'
  }
];

for (const s of slots) {
  fs.writeFileSync(path.join(persDir, s.file), createEditorialPlaceholder(s), 'utf8');
}

const portraitSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 680" width="600" height="680">
  <defs>
    <linearGradient id="pBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#19365F"/>
      <stop offset="100%" stop-color="#091526"/>
    </linearGradient>
    <radialGradient id="pGlow" cx="50%" cy="38%" r="50%">
      <stop offset="0%" stop-color="#F0CC85" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#F0CC85" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="680" fill="url(#pBg)"/>
  <rect width="600" height="680" fill="url(#pGlow)"/>
  <rect x="22" y="22" width="556" height="636" rx="20" fill="none" stroke="#F0CC85" stroke-opacity="0.38" stroke-width="1.5" stroke-dasharray="8 6"/>
  <rect x="36" y="36" width="528" height="608" rx="14" fill="none" stroke="#F8F1E3" stroke-opacity="0.1" stroke-width="1"/>

  <rect x="165" y="62" width="270" height="30" rx="15" fill="#F0CC85" fill-opacity="0.14" stroke="#F0CC85" stroke-opacity="0.4"/>
  <text x="300" y="82" font-family="Segoe UI, Arial, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.2" text-anchor="middle" fill="#F0CC85">KHUNG ẢNH CHÂN DUNG CÁ NHÂN</text>

  <!-- Minimalist Silhouette Outline -->
  <g transform="translate(300, 235)">
    <circle cx="0" cy="0" r="80" fill="#F0CC85" fill-opacity="0.08" stroke="#F0CC85" stroke-opacity="0.48" stroke-width="1.8"/>
    <circle cx="0" cy="-16" r="27" fill="none" stroke="#F8F1E3" stroke-opacity="0.8" stroke-width="2.2"/>
    <path d="M-46 52 C-46 18, 46 18, 46 52" fill="none" stroke="#F8F1E3" stroke-opacity="0.8" stroke-width="2.2" stroke-linecap="round"/>
  </g>

  <text x="300" y="385" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="#F8F1E3">Quách Khoa Đức</text>
  <text x="300" y="420" font-family="Segoe UI, Arial, sans-serif" font-size="15.5" font-weight="600" text-anchor="middle" fill="#F0CC85">Sinh viên Khoa Công nghệ thông tin – DNTU</text>
  <text x="300" y="450" font-family="Segoe UI, Arial, sans-serif" font-size="14" text-anchor="middle" fill="#CBD5E1">02 năm liên tiếp đạt danh hiệu Sinh viên 5 tốt</text>

  <line x1="160" y1="485" x2="440" y2="485" stroke="#F0CC85" stroke-opacity="0.25" stroke-width="1"/>

  <text x="300" y="522" font-family="Segoe UI, Arial, sans-serif" font-style="italic" font-size="16.5" text-anchor="middle" fill="#F8F1E3">“Tri thức trao đi, tương lai tiếp nối.”</text>

  <rect x="130" y="558" width="340" height="40" rx="20" fill="#091526" fill-opacity="0.85" stroke="#F0CC85" stroke-opacity="0.4" stroke-width="1"/>
  <text x="300" y="583" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="#F0CC85">Bấm “Thay ảnh chân dung” hoặc kéo thả ảnh vào đây</text>
</svg>`;

fs.writeFileSync(path.join(persDir, 'portrait-placeholder.svg'), portraitSvg, 'utf8');
console.log('[OK] Regenerated clean XML-escaped editorial SVG placeholders');
