import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DESIGN_DIR = path.join(ROOT, 'DESIGN_CHUDE1_DRAFT', '02_ThietKe');
const PUBLIC_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');
const CONFIG_PATH = path.join(DESIGN_DIR, 'campaign.config.json');

const EXPECTED_W = 1080;
const EXPECTED_H = 1350;
const MIN_BYTES = 100 * 1024;

const FORBIDDEN_PATTERNS = [
  { label: '{{', regex: /\{\{/ },
  { label: '}}', regex: /\}\}/ },
  { label: '[TBD]', regex: /\[TBD\]/i },
  { label: 'Lorem', regex: /\bLorem\b/i },
  { label: '20/11', regex: /20\/11/ },
  { label: 'Nhà giáo', regex: /Nh[àa]\s+gi[áa]o/i },
  { label: 'Tri ân', regex: /Tri\s+[âa]n/i },
  { label: 'Sinh viên 5 tốt', regex: /Sinh\s+vi[êe]n\s+5\s+t[ốo]t/i },
];

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractSvgTextContent(svgContent) {
  // Collapse <text>...</text> including child <tspan> tags into normalized searchable text
  const textBlocks = [];
  const textRegex = /<text\b[^>]*>([\s\S]*?)<\/text>/gi;
  let m;
  while ((m = textRegex.exec(svgContent)) !== null) {
    const plain = decodeEntities(m[1].replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim();
    if (plain) textBlocks.push(plain);
  }
  return {
    blocks: textBlocks,
    joined: textBlocks.join('\n'),
  };
}

function readPngHeader(filePath) {
  const buf = fs.readFileSync(filePath);
  const sig = buf.subarray(0, 8).toString('hex');
  if (sig !== '89504e470d0a1a0a') {
    throw new Error(`Invalid PNG signature in ${filePath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bytes: buf.length,
    buffer: buf,
  };
}

function inspectPngsWithPythonPil(filePaths) {
  const pyCode = `
import json, sys
from PIL import Image
out = []
for p in sys.argv[1:]:
    with Image.open(p) as im:
        out.append({
            "path": p,
            "width": im.width,
            "height": im.height,
            "mode": im.mode,
            "format": im.format,
        })
print(json.dumps(out))
`;
  const stdout = execFileSync('python', ['-c', pyCode, ...filePaths], {
    encoding: 'utf8',
    cwd: ROOT,
  });
  return JSON.parse(stdout);
}

function decodeQrFromPngPixels(pngPath, expectedW, expectedH) {
  const rgbaBuf = execFileSync(
    'python',
    [
      '-c',
      'import sys; from PIL import Image; im = Image.open(sys.argv[1]).convert("RGBA"); sys.stdout.buffer.write(im.tobytes())',
      pngPath,
    ],
    { maxBuffer: 16 * 1024 * 1024, cwd: ROOT }
  );
  const clamped = new Uint8ClampedArray(rgbaBuf.buffer, rgbaBuf.byteOffset, rgbaBuf.byteLength);
  return jsQR(clamped, expectedW, expectedH, {
    inversionAttempts: 'dontInvert',
  });
}

async function main() {
  const allowPartial = process.argv.includes('--partial');
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const failures = [];
  const passed = [];

  const check = (condition, label) => {
    if (condition) {
      passed.push(label);
      console.log(`[PASS] ${label}`);
    } else {
      failures.push(label);
      console.error(`[FAIL] ${label}`);
    }
  };

  // 1. Check required files for all 5 posters (unless --partial explicitly set)
  const targetPosters = allowPartial
    ? config.posters.filter((p) => fs.existsSync(path.join(DESIGN_DIR, p.filename)))
    : config.posters;

  if (!allowPartial) {
    check(targetPosters.length === 5, 'Campaign config defines all 5 posters');
  }

  const pngPathsToVerify = [];
  for (const poster of targetPosters) {
    const pngPath = path.join(DESIGN_DIR, poster.filename);
    const publicPngPath = path.join(PUBLIC_POSTERS_DIR, poster.filename);
    const svgPath = path.join(DESIGN_DIR, poster.editableSvg);

    const pngExists = fs.existsSync(pngPath);
    check(pngExists, `Exists: ${poster.filename}`);
    if (pngExists) {
      const hdr = readPngHeader(pngPath);
      check(
        hdr.width === EXPECTED_W && hdr.height === EXPECTED_H,
        `Exact header dimensions ${EXPECTED_W}x${EXPECTED_H} for ${poster.filename} (got ${hdr.width}x${hdr.height})`
      );
      check(
        hdr.bytes > MIN_BYTES,
        `File size > 100KB for ${poster.filename} (${hdr.bytes.toLocaleString()} bytes)`
      );
      pngPathsToVerify.push(pngPath);

      const pubExists = fs.existsSync(publicPngPath);
      const pubMatches = pubExists && Buffer.compare(hdr.buffer, fs.readFileSync(publicPngPath)) === 0;
      check(pubMatches, `Public sync matches byte-for-byte: public/assets/posters/${poster.filename}`);
    }

    const svgExists = fs.existsSync(svgPath);
    check(svgExists, `Exists editable SVG: ${poster.editableSvg}`);
    if (svgExists) {
      const svgRaw = fs.readFileSync(svgPath, 'utf8');
      check(
        svgRaw.includes(`viewBox="0 0 ${EXPECTED_W} ${EXPECTED_H}"`),
        `${poster.editableSvg} has viewBox="0 0 ${EXPECTED_W} ${EXPECTED_H}"`
      );
      for (const layerId of [
        'layer-background',
        'layer-illustration',
        'layer-header',
        'layer-typography',
        'layer-footer',
      ]) {
        check(svgRaw.includes(`id="${layerId}"`), `${poster.editableSvg} contains <g id="${layerId}">`);
      }
      if (poster.hasQr) {
        check(svgRaw.includes('id="layer-cta-qr"'), `${poster.editableSvg} contains <g id="layer-cta-qr">`);
      }

      const { joined } = extractSvgTextContent(svgRaw);
      const requiredStrings = [
        config.sharedCopy.headerLabel,
        poster.index,
        poster.title,
        poster.subtitle,
        config.sharedCopy.footerEvent,
        config.sharedCopy.sourceLine,
      ];
      if (poster.microNote) requiredStrings.push(poster.microNote);
      if (poster.cta) requiredStrings.push(poster.cta);

      for (const required of requiredStrings) {
        check(
          joined.includes(required),
          `${poster.editableSvg} editable text contains "${required}"`
        );
      }

      for (const pat of FORBIDDEN_PATTERNS) {
        check(
          !pat.regex.test(svgRaw),
          `${poster.editableSvg} free of forbidden token "${pat.label}"`
        );
      }
    }
  }

  // 2. Python PIL independent dimension & color mode verification
  if (pngPathsToVerify.length > 0) {
    const pilResults = inspectPngsWithPythonPil(pngPathsToVerify);
    for (const info of pilResults) {
      const name = path.basename(info.path);
      check(
        info.width === EXPECTED_W && info.height === EXPECTED_H && (info.mode === 'RGB' || info.mode === 'RGBA'),
        `Python PIL verifies ${name}: ${info.width}x${info.height} mode=${info.mode}`
      );
    }
  }

  // 3. Contact sheet check (required when running full QA)
  const contactSheetPath = path.join(DESIGN_DIR, 'CONTACT_SHEET.png');
  if (!allowPartial) {
    const csExists = fs.existsSync(contactSheetPath);
    check(csExists, 'Exists: DESIGN_CHUDE1_DRAFT/02_ThietKe/CONTACT_SHEET.png');
    if (csExists) {
      const csHdr = readPngHeader(contactSheetPath);
      check(
        csHdr.width >= 1080 && csHdr.bytes > MIN_BYTES,
        `CONTACT_SHEET.png valid (${csHdr.width}x${csHdr.height}, ${csHdr.bytes.toLocaleString()} bytes)`
      );
    }
  }

  // 4. Pixel-level QR decode on Poster 05 using jsqr
  const poster05 = config.posters.find((p) => p.id === 5);
  const poster05Path = path.join(DESIGN_DIR, poster05.filename);
  if (!allowPartial || fs.existsSync(poster05Path)) {
    const exists05 = fs.existsSync(poster05Path);
    if (exists05) {
      const hdr05 = readPngHeader(poster05Path);
      const qrDecoded = decodeQrFromPngPixels(poster05Path, hdr05.width, hdr05.height);
      check(
        Boolean(qrDecoded && qrDecoded.data === config.officialResolutionUrl),
        `jsQR pixel decode of ${poster05.filename} matches config.officialResolutionUrl byte-for-byte${qrDecoded ? '' : ' (DECODE RETURNED NULL)'}`
      );
    }
  }

  console.log(`\nQA Summary: ${passed.length} passed, ${failures.length} failed.`);
  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
