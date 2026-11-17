import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

async function main() {
  const inputPath = path.resolve('anhchoslide5va6/20240711_111216.jpg');
  const outPath = path.resolve('public/assets/curated/curated-20-clb-cntt-dntu-project.jpg');

  const inputBase64 = fs.readFileSync(inputPath).toString('base64');
  const dataUri = `data:image/jpeg;base64,${inputBase64}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const outDataUrl = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const sw = img.naturalWidth;
    const sh = img.naturalHeight;
    // Frame the IT project board ("Khoa Công nghệ Thông tin - CLB Khoa học Máy tính"), Quách Khoa Đức, laptops, and DNTU monitor cleanly in 3:2
    const sx = Math.round(sw * 0.015);
    const sy = Math.round(sh * 0.14);
    const cw = Math.round(sw * 0.82);
    const ch = Math.min(Math.round(cw / 1.5), sh - sy);

    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 934;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, cw, ch, 0, 0, 1400, 934);
    return canvas.toDataURL('image/jpeg', 0.90);
  }, dataUri);

  await browser.close();

  const outBase64 = outDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(outPath, Buffer.from(outBase64, 'base64'));
  console.log('Successfully generated:', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
