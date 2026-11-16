import fs from 'node:fs/promises';
import path from 'node:path';
import convert from 'heic-convert';
import sharp from 'sharp';

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function decodeHeics() {
  const inv = JSON.parse(await fs.readFile('.research/photo_inventory.json', 'utf8'));
  const heics = inv.filter(i => i.ext === '.heic' && !i.duplicateOf);
  console.log(`Decoding ${heics.length} unique HEIC files...`);

  const heicOutDir = path.resolve('.research/heic_decoded');
  await fs.mkdir(heicOutDir, { recursive: true });

  const decodedItems = [];
  for (const item of heics) {
    try {
      const inputBuffer = await fs.readFile(item.relPath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.9
      });
      const outPath = path.join(heicOutDir, `${item.id}_${item.name.replace(/\.heic$/i, '.jpg')}`);
      await fs.writeFile(outPath, Buffer.from(outputBuffer));
      decodedItems.push({ ...item, decodedPath: outPath });
      console.log(`[OK] Decoded ${item.id}: ${item.name}`);
    } catch (e) {
      console.warn(`[WARN] Failed ${item.name}:`, e.message);
    }
  }

  // Build Contact Sheets for Decoded HEICs
  const COLS = 4;
  const ROWS = 5;
  const CELL_W = 460;
  const CELL_H = 360;
  const PER_SHEET = COLS * ROWS;
  const totalSheets = Math.ceil(decodedItems.length / PER_SHEET);
  const sheetDir = path.resolve('tests/screenshots/contact_sheets');

  for (let s = 0; s < totalSheets; s++) {
    const slice = decodedItems.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const composites = [];
    for (let idx = 0; idx < slice.length; idx++) {
      const item = slice[idx];
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x = col * CELL_W;
      const y = row * CELL_H;

      const thumbBuf = await sharp(item.decodedPath)
        .rotate()
        .resize(CELL_W - 16, CELL_H - 52, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
        .jpeg({ quality: 86 })
        .toBuffer();

      const labelSvg = Buffer.from(`<svg width="${CELL_W}" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect width="${CELL_W}" height="44" fill="#091526"/>
        <text x="10" y="18" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#F0CC85">${escapeXml(item.id)} (${item.width}x${item.height})</text>
        <text x="10" y="36" font-family="Segoe UI, sans-serif" font-size="11.5" fill="#CBD5E1">${escapeXml(item.name)}</text>
      </svg>`);

      composites.push({ input: labelSvg, left: x, top: y });
      composites.push({ input: thumbBuf, left: x + 8, top: y + 44 });
    }

    const sheetPath = path.join(sheetDir, `contact_sheet_heic_${s + 1}.jpg`);
    await sharp({
      create: { width: COLS * CELL_W, height: ROWS * CELL_H, channels: 3, background: { r: 9, g: 21, b: 38 } }
    })
      .composite(composites)
      .jpeg({ quality: 88 })
      .toFile(sheetPath);
    console.log(`[OK] Generated HEIC contact sheet: ${sheetPath}`);
  }
}

decodeHeics();
