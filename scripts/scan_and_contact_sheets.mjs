import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const SRC_DIR = path.resolve('anhchoslide5va6');
const OUT_DIR = path.resolve('tests/screenshots/contact_sheets');

async function walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files = files.concat(await walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.resolve('.research'), { recursive: true });

  const allFiles = await walkDir(SRC_DIR);
  console.log(`Found ${allFiles.length} total files in anhchoslide5va6`);

  const inventory = [];
  const hashMap = new Map();

  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const name = path.basename(filePath);
    const ext = path.extname(name).toLowerCase();
    const stat = await fs.stat(filePath);
    const buf = await fs.readFile(filePath);
    const hash = crypto.createHash('md5').update(buf).digest('hex');

    const isImg = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].includes(ext);
    let meta = {};
    if (isImg) {
      try {
        const m = await sharp(buf, { limitInputPixels: false }).metadata();
        // Account for EXIF orientation 5,6,7,8 swapping width/height
        const swapped = m.orientation && m.orientation >= 5 && m.orientation <= 8;
        const w = swapped ? m.height : m.width;
        const h = swapped ? m.width : m.height;
        meta = {
          width: w,
          height: h,
          format: m.format,
          orientation: m.orientation || 1,
          aspectRatio: w && h ? +(w / h).toFixed(2) : null,
          layoutType: w > h ? 'landscape' : (w < h ? 'portrait' : 'square')
        };
      } catch (err) {
        meta = { error: err.message };
      }
    }

    const duplicateOf = hashMap.has(hash) ? hashMap.get(hash) : null;
    const id = `IMG_${String(i + 1).padStart(3, '0')}`;
    if (!duplicateOf) {
      hashMap.set(hash, id);
    }

    inventory.push({
      id,
      name,
      relPath,
      ext,
      sizeBytes: stat.size,
      mtime: stat.mtime.toISOString(),
      hash,
      duplicateOf,
      isImage: isImg,
      ...meta
    });
  }

  await fs.writeFile('.research/photo_inventory.json', JSON.stringify(inventory, null, 2), 'utf8');

  const uniqueImages = inventory.filter(item => item.isImage && !item.duplicateOf && !item.error);
  const duplicates = inventory.filter(item => item.duplicateOf);
  const nonImages = inventory.filter(item => !item.isImage);

  console.log(`Total files: ${inventory.length}`);
  console.log(`Unique valid images: ${uniqueImages.length}`);
  console.log(`Exact duplicates: ${duplicates.length}`);
  console.log(`Non-image files (e.g. video): ${nonImages.length}`);

  // Generate Contact Sheets: 20 unique images per sheet (4 cols x 5 rows)
  const COLS = 4;
  const ROWS = 5;
  const CELL_W = 460;
  const CELL_H = 360;
  const PER_SHEET = COLS * ROWS;
  const totalSheets = Math.ceil(uniqueImages.length / PER_SHEET);

  for (let s = 0; s < totalSheets; s++) {
    const slice = uniqueImages.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const composites = [];

    for (let idx = 0; idx < slice.length; idx++) {
      const item = slice[idx];
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x = col * CELL_W;
      const y = row * CELL_H;

      // Render auto-oriented thumbnail inside 444 x 304
      let thumbBuf;
      try {
        thumbBuf = await sharp(item.relPath)
          .rotate() // auto-orient via EXIF
          .resize(CELL_W - 16, CELL_H - 52, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
          .jpeg({ quality: 86 })
          .toBuffer();
      } catch (decodeErr) {
        item.decodeError = decodeErr.message;
        thumbBuf = await sharp({
          create: { width: CELL_W - 16, height: CELL_H - 52, channels: 3, background: { r: 30, g: 41, b: 59 } }
        }).jpeg().toBuffer();
      }

      const shortName = item.name.length > 34 ? item.name.slice(0, 31) + '...' : item.name;
      const labelSvg = Buffer.from(`<svg width="${CELL_W}" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect width="${CELL_W}" height="44" fill="#091526"/>
        <text x="10" y="18" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#F0CC85">${escapeXml(item.id)} (${item.width}x${item.height} ${item.layoutType})</text>
        <text x="10" y="36" font-family="Segoe UI, sans-serif" font-size="11.5" fill="#CBD5E1">${escapeXml(shortName)}</text>
      </svg>`);

      composites.push({ input: labelSvg, left: x, top: y });
      composites.push({ input: thumbBuf, left: x + 8, top: y + 44 });
    }

    const sheetPath = path.join(OUT_DIR, `contact_sheet_${s + 1}.jpg`);
    await sharp({
      create: {
        width: COLS * CELL_W,
        height: ROWS * CELL_H,
        channels: 3,
        background: { r: 9, g: 21, b: 38 }
      }
    })
      .composite(composites)
      .jpeg({ quality: 88 })
      .toFile(sheetPath);

    console.log(`[OK] Generated ${sheetPath} (${slice.length} images)`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
