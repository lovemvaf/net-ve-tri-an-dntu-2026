import fs from 'node:fs';

const svgCard = (title, subtitle, icon, color1, color2) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="grad_${color1.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#grad_${color1.replace('#','')})"/>
  <circle cx="300" cy="160" r="60" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <text x="300" y="180" font-size="52" text-anchor="middle" fill="#ffffff">${icon}</text>
  <text x="300" y="270" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#ffffff">${title}</text>
  <text x="300" y="300" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.7)">${subtitle}</text>
</svg>`;

fs.writeFileSync('public/assets/gallery-1.svg', svgCard('Giảng Đường & Lab Máy CNTT', 'Khoa Công nghệ Thông tin - DNTU', '💻', '#0f172a', '#1e3a8a'));
fs.writeFileSync('public/assets/gallery-2.svg', svgCard('Hackathon & Nghiên Cứu AI', 'Sáng tạo Công nghệ Trẻ DNTU', '🚀', '#0f172a', '#0369a1'));
fs.writeFileSync('public/assets/gallery-3.svg', svgCard('Chiến Dịch Mùa Hè Xanh', 'Tình nguyện vì cộng đồng sinh viên DNTU', '🤝', '#0f172a', '#15803d'));
fs.writeFileSync('public/assets/gallery-4.svg', svgCard('Vinh Danh Sinh Viên 5 Tốt', 'Hai năm liên tiếp Cấp Trường & Tỉnh', '🏆', '#0f172a', '#b45309'));
fs.writeFileSync('public/assets/gallery-5.svg', svgCard('Hội Thảo Công Nghệ Tương Lai', 'Chuyển đổi số & AI Workshop', '🌐', '#0f172a', '#4338ca'));
fs.writeFileSync('public/assets/gallery-6.svg', svgCard('Tri Ân Cô Liệu & Thầy Cô', 'Tình thầy trò cao quý DNTU', '💐', '#0f172a', '#be185d'));

// Author avatar
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="avaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#avaGrad)"/>
  <circle cx="200" cy="150" r="70" fill="#f59e0b" opacity="0.2"/>
  <circle cx="200" cy="150" r="55" fill="#38bdf8" opacity="0.3"/>
  <text x="200" y="170" font-size="64" text-anchor="middle" fill="#ffffff">👨‍💻</text>
  <text x="200" y="260" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="bold" font-size="22" text-anchor="middle" fill="#ffffff">Quách Khoa Đức</text>
  <text x="200" y="290" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" text-anchor="middle" fill="#facc15">Sinh viên 5 Tốt 2 năm liên tiếp</text>
  <text x="200" y="315" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" text-anchor="middle" fill="#94a3b8">Khoa CNTT - DNTU</text>
</svg>`;
fs.writeFileSync('public/assets/avatar-author.svg', avatarSvg);

console.log('Sample gallery SVGs created successfully in public/assets/');

