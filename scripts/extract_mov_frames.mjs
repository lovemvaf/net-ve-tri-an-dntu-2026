import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const srcDir = 'c:/Users/asus/Downloads/drive-download-20261116T084927Z-1-001';
const outDir = path.resolve('public/assets/curated');

const server = http.createServer((req, res) => {
  const file = decodeURIComponent(req.url.slice(1));
  const fullPath = path.join(srcDir, file);
  if (!fs.existsSync(fullPath)) {
    res.statusCode = 404;
    return res.end();
  }
  const stat = fs.statSync(fullPath);
  res.writeHead(200, {
    'Content-Type': 'video/quicktime',
    'Content-Length': stat.size,
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(fullPath).pipe(res);
});

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const browser = await chromium.launch({ channel: 'msedge' }).catch(() => chromium.launch());
  const page = await browser.newPage();

  async function extractCroppedFrame(fileName, timeSec, cropTopRatio, outName) {
    await page.setContent('<video id="v" crossorigin="anonymous" muted playsinline></video>');
    const dataUrl = await page.evaluate(
      async ({ url, t, topRatio }) => {
        const v = document.getElementById('v');
        v.src = url;
        await new Promise((resolve, reject) => {
          v.onloadeddata = resolve;
          v.onerror = () => reject(new Error('Video load failed'));
        });
        v.currentTime = Math.min(t, v.duration - 0.15);
        await new Promise((r) => {
          v.onseeked = r;
        });
        const sw = v.videoWidth;
        const sh = v.videoHeight;
        const sy = Math.round(sh * topRatio);
        const ch = sh - sy;
        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(v, 0, sy, sw, ch, 0, 0, sw, ch);
        return canvas.toDataURL('image/jpeg', 0.92);
      },
      { url: `http://127.0.0.1:${port}/${encodeURIComponent(fileName)}`, t: timeSec, topRatio: cropTopRatio }
    );

    const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(path.join(outDir, outName), Buffer.from(base64, 'base64'));
    console.log('Saved cropped frame:', outName);
  }

  try {
    await extractCroppedFrame('Cô Liệu.MOV', 4.1, 0.28, 'curated-18-co-lieu-aibot-rose.jpg');
    await extractCroppedFrame('Phỏng vấn cô Ngọc AIBOT.MOV', 5.0, 0.30, 'curated-19-co-ngoc-aibot.jpg');
  } catch (e) {
    console.error('Frame extract error:', e.message);
  }
  await browser.close();
  server.close();
});
