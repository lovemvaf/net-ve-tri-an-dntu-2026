import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

async function prepareAssets() {
  const origDir = path.resolve('public/assets/originals');
  const optDir = path.resolve('public/assets/optimized');
  const persDir = path.resolve('public/assets/personal');

  await fs.mkdir(origDir, { recursive: true });
  await fs.mkdir(optDir, { recursive: true });
  await fs.mkdir(persDir, { recursive: true });

  // 1. Copy untouched originals to public/assets/originals/
  const posterOrig = 'Quách Khoa Đức _ Nét vẽ tri ân.png';
  const khoaOrig = '2.Khoacongnghethongtin (1).png';
  const dntuOrig = 'logodntubig (1).png';

  await fs.copyFile(posterOrig, path.join(origDir, posterOrig));
  await fs.copyFile(khoaOrig, path.join(origDir, khoaOrig));
  await fs.copyFile(dntuOrig, path.join(origDir, dntuOrig));
  console.log('[OK] Untouched originals preserved in public/assets/originals/');

  // 2. Optimize Logos (preserving exact aspect ratio and transparency)
  await sharp(khoaOrig, { limitInputPixels: false })
    .resize({ width: 900, withoutEnlargement: true })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(optDir, 'logo-khoa-cntt.png'));

  await sharp(dntuOrig)
    .resize({ width: 600, withoutEnlargement: true })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(optDir, 'logo-dntu.png'));

  // Also keep root public/assets/logo-*.png updated with optimized versions so no 441MP stall occurs
  await fs.copyFile(path.join(optDir, 'logo-khoa-cntt.png'), path.resolve('public/assets/logo-khoa-cntt.png'));
  await fs.copyFile(path.join(optDir, 'logo-dntu.png'), path.resolve('public/assets/logo-dntu.png'));
  console.log('[OK] Optimized high-DPI logos generated');

  // 3. Optimize Full Poster (Retina 1500x2667 WebP & JPEG)
  await sharp(posterOrig)
    .resize({ width: 1500, withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(optDir, 'poster-full.jpg'));

  await sharp(posterOrig)
    .resize({ width: 1500, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(path.join(optDir, 'poster-full.webp'));

  // Update root public/assets/poster-net-ve-tri-an.png with optimized 1500px PNG & remove duplicate raw copies in public/assets root
  await sharp(posterOrig)
    .resize({ width: 1350, withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(path.resolve('public/assets/poster-net-ve-tri-an.png'));

  for (const dup of [posterOrig, khoaOrig, dntuOrig]) {
    const dupPath = path.resolve('public/assets', dup);
    try { await fs.unlink(dupPath); } catch (_) {}
  }

  // 4. Generate High-Precision Focal Crops from the 3000x5333 Original Poster
  const crops = [
    {
      name: 'crop-teacher.jpg',
      extract: { left: 0, top: 1000, width: 1720, height: 3350 },
      resize: { width: 960 }
    },
    {
      name: 'crop-teacher-code.jpg',
      extract: { left: 0, top: 1150, width: 1350, height: 1750 },
      resize: { width: 900 }
    },
    {
      name: 'crop-book-boat.jpg',
      extract: { left: 620, top: 2380, width: 2300, height: 1750 },
      resize: { width: 1200 }
    },
    {
      name: 'crop-stairs-helping.jpg',
      extract: { left: 780, top: 950, width: 2220, height: 1920 },
      resize: { width: 1200 }
    },
    {
      name: 'crop-tech-ai.jpg',
      extract: { left: 1850, top: 1920, width: 1150, height: 1900 },
      resize: { width: 800 }
    },
    {
      name: 'crop-poem.jpg',
      extract: { left: 120, top: 4160, width: 2760, height: 1020 },
      resize: { width: 1200 }
    }
  ];

  for (const c of crops) {
    await sharp(posterOrig)
      .extract(c.extract)
      .resize(c.resize)
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(path.join(optDir, c.name));
    console.log(`[OK] Extracted focal crop: ${c.name}`);
  }
}

prepareAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
