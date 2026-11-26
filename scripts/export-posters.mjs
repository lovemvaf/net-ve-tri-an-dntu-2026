import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DESIGN_DIR = path.join(ROOT, 'DESIGN_CHUDE1_DRAFT', '02_ThietKe');
const EDITABLE_DIR = path.join(DESIGN_DIR, 'editable');
const PUBLIC_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');
const CONFIG_PATH = path.join(DESIGN_DIR, 'campaign.config.json');
const EMBLEM_PATH = path.join(DESIGN_DIR, 'identity', 'derived', 'huy-hieu-doan-clean.png');

const CANVAS_W = 1080;
const CANVAS_H = 1350;
const SAFE_MIN = 56;
const PAD_X = 64; // Inside 56px safe margin

const PALETTE = {
  youthBlue: '#1764B0',
  academicNavy: '#10294B',
  navyBody: '#1E3A5F',
  redAccent: '#E52E37',
  warmIvory: '#F6F4ED',
  pureWhite: '#FFFFFF',
  champagneGold: '#F0C76D',
  softGoldBg: '#FCF5E1',
  deepGreen: '#075837',
  softGreenBg: '#EAF4EE',
  softBlueBg: '#EBF3FB',
};

/**
 * Per-poster art direction & crop tuning so all 5 posters belong to one cohesive
 * Vietnamese editorial system while varying alignment, framing, accents, and footer rhythm.
 */
const POSTER_ART_DIRECTION = {
  1: {
    variant: 'editorial-left',
    cropTopSrc: 40, // 896x1200 -> (0,40,896,1160) exact 4:5
    topScrimHeight: 430,
    topScrimSolidStop: 0.56,
    bottomScrimHeight: 220,
    headerPillBg: PALETTE.academicNavy,
    headerPillText: PALETTE.warmIvory,
    indexAccent: PALETTE.redAccent,
    titleLines: ['NGHỊ QUYẾT 57', 'GẦN BẠN THẾ NÀO?'],
    titleFontSize: 52,
    titleLineHeight: 62,
    subtitleColor: PALETTE.youthBlue,
    footerStyle: 'ivory-hairline',
  },
  2: {
    variant: 'centered-band',
    cropTopSrc: 80, // 896x1200 -> (0,80,896,1200) exact 4:5
    topScrimHeight: 385,
    topScrimSolidStop: 0.62,
    bottomScrimHeight: 136, // aligns cleanly with navy footer band at y=1214
    headerPillBg: PALETTE.youthBlue,
    headerPillText: PALETTE.pureWhite,
    indexAccent: PALETTE.champagneGold,
    microPillStyle: 'gold',
    titleLines: ['HIỂU ĐÚNG ĐỂ BẮT ĐẦU'],
    titleFontSize: 52,
    titleLineHeight: 60,
    subtitleColor: PALETTE.youthBlue,
    footerStyle: 'navy-band',
  },
  3: {
    variant: 'framed-warm',
    cropTopSrc: 80, // matches illustrator 4:5 recommendation (0,80,896,1200)
    topScrimHeight: 390,
    topScrimSolidStop: 0.56,
    bottomScrimHeight: 220,
    headerPillBg: PALETTE.pureWhite,
    headerPillText: PALETTE.academicNavy,
    headerPillStroke: PALETTE.youthBlue,
    indexAccent: PALETTE.redAccent,
    titleLines: ['CÔNG NGHỆ VÌ CON NGƯỜI'],
    titleFontSize: 50,
    titleLineHeight: 58,
    subtitleColor: PALETTE.navyBody,
    footerStyle: 'ivory-hairline',
  },
  4: {
    variant: 'action-split',
    cropTopSrc: 80, // matches illustrator 4:5 recommendation (0,80,896,1200)
    topScrimHeight: 435,
    topScrimSolidStop: 0.58,
    bottomScrimHeight: 136,
    headerPillBg: PALETTE.academicNavy,
    headerPillText: PALETTE.warmIvory,
    indexAccent: PALETTE.deepGreen,
    microPillStyle: 'green',
    titleLines: ['THANH NIÊN ĐỒNG NAI', 'HÀNH ĐỘNG'],
    titleFontSize: 50,
    titleLineHeight: 58,
    subtitleColor: PALETTE.youthBlue,
    footerStyle: 'navy-band',
  },
  5: {
    variant: 'climax-qr',
    cropTopSrc: 80, // matches illustrator 4:5 recommendation (0,80,896,1200)
    topScrimHeight: 355,
    topScrimSolidStop: 0.60,
    bottomScrimHeight: 136,
    headerPillBg: PALETTE.academicNavy,
    headerPillText: PALETTE.warmIvory,
    indexAccent: PALETTE.champagneGold,
    titleLines: ['HIỂU ĐÚNG. LÀM THẬT.', 'LAN TỎA.'],
    titleFontSize: 46,
    titleLineHeight: 54,
    subtitleColor: PALETTE.youthBlue,
    qrSide: 'left',
    footerStyle: 'navy-band',
  },
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`Not a valid PNG file: ${filePath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    dataUri: `data:image/png;base64,${buf.toString('base64')}`,
  };
}

function loadFontFaceCss() {
  const fontDir = path.join(ROOT, 'node_modules', '@fontsource', 'be-vietnam-pro', 'files');
  const weights = [400, 500, 600, 700, 800];
  const subsets = [
    {
      name: 'vietnamese',
      unicodeRange:
        'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB',
    },
    {
      name: 'latin-ext',
      unicodeRange:
        'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D1, U+02D7-02D8, U+02DA-02DB, U+02DD, U+02DF, U+02E0-02E4, U+02E5-02FF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
    },
    {
      name: 'latin',
      unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD',
    },
  ];

  const rules = [];
  for (const weight of weights) {
    for (const subset of subsets) {
      const file = `be-vietnam-pro-${subset.name}-${weight}-normal.woff2`;
      const fullPath = path.join(fontDir, file);
      if (!fs.existsSync(fullPath)) continue;
      const b64 = fs.readFileSync(fullPath).toString('base64');
      rules.push(`
@font-face {
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: ${weight};
  font-display: block;
  src: url(data:font/woff2;base64,${b64}) format('woff2');
  unicode-range: ${subset.unicodeRange};
}`);
    }
  }
  return rules.join('\n');
}

function buildHeaderLayer({ poster, sharedCopy, emblemInfo, art }) {
  // Emblem aspect preserved cleanly: 84 x 93.02 px inside a 100 x 108 card at (64, 56)
  const cardX = PAD_X;
  const cardY = SAFE_MIN;
  const cardW = 100;
  const cardH = 108;
  const embW = 84;
  const embH = Number(((embW * emblemInfo.height) / emblemInfo.width).toFixed(2));
  const embX = Number((cardX + (cardW - embW) / 2).toFixed(2));
  const embY = Number((cardY + (cardH - embH) / 2).toFixed(2));

  const badgeX = cardX + cardW + 20;
  const badgeY = cardY + 12;
  const badgeW = 304;
  const badgeH = 42;
  const badgeStroke = art.headerPillStroke
    ? ` stroke="${art.headerPillStroke}" stroke-width="2"`
    : '';

  const idxPillW = 112;
  const idxPillH = 42;
  const idxPillX = CANVAS_W - PAD_X - idxPillW;
  const idxPillY = badgeY;

  return `  <g id="layer-header">
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="20" fill="${PALETTE.pureWhite}" fill-opacity="0.96" stroke="${PALETTE.academicNavy}" stroke-opacity="0.14" stroke-width="1.5" filter="url(#soft-shadow)" />
    <image id="doan-emblem" href="../identity/derived/huy-hieu-doan-clean.png" x="${embX}" y="${embY}" width="${embW}" height="${embH}" preserveAspectRatio="xMidYMid meet" />

    <g id="header-resolution-badge">
      <rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="21" fill="${art.headerPillBg}"${badgeStroke} />
      <circle cx="${badgeX + 24}" cy="${badgeY + badgeH / 2}" r="5.5" fill="${PALETTE.redAccent}" />
      <text x="${badgeX + 40}" y="${badgeY + 27}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.1" fill="${art.headerPillText}">${escapeXml(sharedCopy.headerLabel)}</text>
    </g>

    <g id="header-index-pill">
      <rect x="${idxPillX}" y="${idxPillY}" width="${idxPillW}" height="${idxPillH}" rx="21" fill="${PALETTE.pureWhite}" fill-opacity="0.94" stroke="${PALETTE.academicNavy}" stroke-opacity="0.18" stroke-width="1.5" />
      <circle cx="${idxPillX + 24}" cy="${idxPillY + idxPillH / 2}" r="5" fill="${art.indexAccent}" />
      <text x="${idxPillX + 68}" y="${idxPillY + 28}" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="19" font-weight="800" letter-spacing="0.6" fill="${PALETTE.academicNavy}">${escapeXml(poster.index)}</text>
    </g>
  </g>`;
}

function buildIllustrationLayer({ poster, illInfo, art }) {
  // Scale raw illustration to fill canvas width cleanly and align cropTopSrc
  const scale = CANVAS_W / illInfo.width;
  const scaledW = CANVAS_W;
  const scaledH = Number((illInfo.height * scale).toFixed(2));
  const rawYOffset = Number((-art.cropTopSrc * scale).toFixed(2));
  // Clamp so image always covers full vertical canvas without gaps
  const minY = CANVAS_H - scaledH;
  const imgY = Math.max(minY, Math.min(0, rawYOffset));

  const frameInset = art.variant === 'framed-warm' ? 22 : 0;

  return `  <g id="layer-illustration">
    <g clip-path="url(#canvas-clip)">
      <image id="source-artwork" href="../${poster.sourceIllustration}" x="0" y="${imgY}" width="${scaledW}" height="${scaledH}" preserveAspectRatio="xMidYMid slice" />
      <rect x="0" y="0" width="${CANVAS_W}" height="${art.topScrimHeight}" fill="url(#top-scrim)" />
      <rect x="0" y="${CANVAS_H - art.bottomScrimHeight}" width="${CANVAS_W}" height="${art.bottomScrimHeight}" fill="url(#bottom-scrim)" />
    </g>
    ${frameInset > 0 ? `<rect x="${frameInset}" y="${frameInset}" width="${CANVAS_W - frameInset * 2}" height="${CANVAS_H - frameInset * 2}" rx="24" fill="none" stroke="${PALETTE.champagneGold}" stroke-opacity="0.45" stroke-width="2" />` : ''}
  </g>`;
}

function buildTypographyLayer({ poster, art }) {
  const usableW = CANVAS_W - PAD_X * 2;
  const centerX = CANVAS_W / 2;

  if (art.variant === 'centered-band') {
    let cursorY = 170;
    let microNode = '';
    if (poster.microNote) {
      const pillW = Math.min(usableW, Math.ceil(poster.microNote.length * 18 * 0.51) + 48);
      const pillX = Number((centerX - pillW / 2).toFixed(1));
      microNode = `
    <g id="micro-note-pill">
      <rect x="${pillX}" y="${cursorY}" width="${pillW}" height="34" rx="17" fill="${PALETTE.softGoldBg}" stroke="${PALETTE.champagneGold}" stroke-width="1.5" />
      <text x="${centerX}" y="${cursorY + 23}" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="18" font-weight="700" fill="${PALETTE.academicNavy}">${escapeXml(poster.microNote)}</text>
    </g>`;
      cursorY += 56;
    }

    const titleTspans = art.titleLines
      .map(
        (line, idx) =>
          `<tspan x="${centerX}" dy="${idx === 0 ? 0 : art.titleLineHeight}">${escapeXml(line)}</tspan>`
      )
      .join('');
    const titleBaseline = cursorY + 42;
    const ruleY = titleBaseline + (art.titleLines.length - 1) * art.titleLineHeight + 18;
    const subY = ruleY + 34;

    return `  <g id="layer-typography">
    ${microNode}
    <text id="poster-title" x="${centerX}" y="${titleBaseline}" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="${art.titleFontSize}" font-weight="800" letter-spacing="-0.6" fill="${PALETTE.academicNavy}">${titleTspans}</text>
    <rect x="${centerX - 68}" y="${ruleY}" width="88" height="5" rx="2.5" fill="${PALETTE.redAccent}" />
    <rect x="${centerX + 26}" y="${ruleY}" width="42" height="5" rx="2.5" fill="${PALETTE.champagneGold}" />
    <text id="poster-subtitle" x="${centerX}" y="${subY}" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="24" font-weight="600" fill="${art.subtitleColor}">${escapeXml(poster.subtitle)}</text>
  </g>`;
  }

  // Left-aligned editorial variants (01, 03, 04, 05)
  let cursorY = art.variant === 'climax-qr' ? 176 : 188;
  let microNode = '';
  if (poster.microNote) {
    const isGreen = art.microPillStyle === 'green';
    const bg = isGreen ? PALETTE.softGreenBg : PALETTE.softBlueBg;
    const stroke = isGreen ? PALETTE.deepGreen : PALETTE.youthBlue;
    const textFill = isGreen ? PALETTE.deepGreen : PALETTE.academicNavy;
    const pillW = Math.min(usableW, Math.ceil(poster.microNote.length * 18 * 0.52) + 72);
    microNode = `
    <g id="micro-note-pill">
      <rect x="${PAD_X}" y="${cursorY - 6}" width="${pillW}" height="34" rx="17" fill="${bg}" stroke="${stroke}" stroke-opacity="0.45" stroke-width="1.5" />
      <circle cx="${PAD_X + 20}" cy="${cursorY + 11}" r="4.5" fill="${stroke}" />
      <text x="${PAD_X + 34}" y="${cursorY + 17}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="18" font-weight="700" fill="${textFill}">${escapeXml(poster.microNote)}</text>
    </g>`;
    cursorY += 48;
  }

  const textX = PAD_X + 24;
  const titleBaseline = cursorY + 44;
  const subtitleY = titleBaseline + (art.titleLines.length - 1) * art.titleLineHeight + 44;
  const barY = cursorY + 4;
  const barHeight = subtitleY + 7 - barY;
  const barColor =
    art.variant === 'action-split'
      ? PALETTE.youthBlue
      : art.variant === 'framed-warm'
        ? PALETTE.champagneGold
        : PALETTE.redAccent;

  const titleTspans = art.titleLines
    .map((line, idx) => {
      const isFinalHighlight = art.variant === 'climax-qr' && idx === art.titleLines.length - 1;
      const lineFill = isFinalHighlight ? PALETTE.redAccent : PALETTE.academicNavy;
      return `<tspan x="${textX}" dy="${idx === 0 ? 0 : art.titleLineHeight}" fill="${lineFill}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  const subFontSize = poster.subtitle.length > 48 ? 24 : 26;

  return `  <g id="layer-typography">
    ${microNode}
    <rect x="${PAD_X}" y="${barY}" width="7" height="${barHeight}" rx="3.5" fill="${barColor}" />
    <text id="poster-title" x="${textX}" y="${titleBaseline}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="${art.titleFontSize}" font-weight="800" letter-spacing="-0.6" fill="${PALETTE.academicNavy}">${titleTspans}</text>
    <text id="poster-subtitle" x="${textX}" y="${subtitleY}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="${subFontSize}" font-weight="600" fill="${art.subtitleColor}">${escapeXml(poster.subtitle)}</text>
  </g>`;
}

async function buildQrLayer({ poster, config }) {
  if (!poster.hasQr) return '';
  const qrUrl = poster.qrTargetUrl || config.officialResolutionUrl;
  const qrSvgRaw = await QRCode.toString(qrUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: PALETTE.academicNavy,
      light: PALETTE.pureWhite,
    },
  });

  const viewBoxMatch = qrSvgRaw.match(/viewBox="([^"]+)"/);
  const qrViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 69 69';
  const qrModules = Number(qrViewBox.trim().split(/\s+/)[2]) || 69;
  const innerQr = qrSvgRaw
    .replace(/^<\?xml[\s\S]*?\?>/i, '')
    .replace(/^<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();

  // Render QR at an exact integer multiple of module count (3px/module -> 207px for 69x69)
  // so crispEdges preserves exact 1:1:3:1:1 finder-pattern ratios for camera/jsQR scanners.
  // Place card in lower-left wooden table safe area (x=60..552), keeping navy notebook (x>=567)
  // and all faces/hands/phone cleanly unobstructed above navy footer band (y=1214).
  const qrSize = qrModules * 3;
  const quietPad = 10; // 6px SVG margin (2*3) + 10px white pad = 16px pure white quiet zone
  const whiteFrameSize = qrSize + quietPad * 2;
  const cardW = 492;
  const cardH = whiteFrameSize + 18;
  const cardX = 60;
  const cardY = 1214 - 12 - cardH;

  const qrBoxX = cardX + cardW - qrSize - quietPad - 12;
  const qrBoxY = cardY + (cardH - qrSize) / 2;

  const copyX = cardX + 24;

  return `  <g id="layer-cta-qr">
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="22" fill="${PALETTE.warmIvory}" fill-opacity="0.98" stroke="${PALETTE.academicNavy}" stroke-opacity="0.18" stroke-width="2" filter="url(#soft-shadow)" />
    <rect x="${copyX}" y="${cardY + 32}" width="52" height="5" rx="2.5" fill="${PALETTE.redAccent}" />
    <text id="poster-cta" x="${copyX}" y="${cardY + 70}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="20" font-weight="800" fill="${PALETTE.academicNavy}">
      <tspan x="${copyX}" dy="0">QUÉT MÃ ĐỌC</tspan>
      <tspan x="${copyX}" dy="28">NGHỊ QUYẾT GỐC</tspan>
    </text>
    <text id="qr-domain-note" x="${copyX}" y="${cardY + 146}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="15.5" font-weight="700" fill="${PALETTE.youthBlue}">
      <tspan x="${copyX}" dy="0">mst.gov.vn · Toàn văn</tspan>
      <tspan x="${copyX}" dy="22" font-weight="600" fill="${PALETTE.navyBody}">57-NQ/TW (22/12/2024)</tspan>
    </text>
    <rect x="${qrBoxX - quietPad}" y="${qrBoxY - quietPad}" width="${whiteFrameSize}" height="${whiteFrameSize}" rx="12" fill="${PALETTE.pureWhite}" stroke="${PALETTE.academicNavy}" stroke-opacity="0.12" stroke-width="1" />
    <svg id="qr-code-svg" x="${qrBoxX}" y="${qrBoxY}" width="${qrSize}" height="${qrSize}" viewBox="${qrViewBox}" shape-rendering="crispEdges">
      ${innerQr}
    </svg>
  </g>`;
}

function buildFooterLayer({ sharedCopy, art }) {
  const isNavy = art.footerStyle === 'navy-band';
  if (isNavy) {
    const bandY = 1214;
    const bandH = CANVAS_H - bandY;
    return `  <g id="layer-footer">
    <rect x="0" y="${bandY}" width="${CANVAS_W}" height="${bandH}" fill="${PALETTE.academicNavy}" />
    <rect x="0" y="${bandY}" width="${CANVAS_W}" height="4" fill="${PALETTE.champagneGold}" />
    <text id="footer-event" x="${PAD_X}" y="${bandY + 42}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="19" font-weight="700" fill="${PALETTE.warmIvory}">${escapeXml(sharedCopy.footerEvent)}</text>
    <text id="footer-source" x="${PAD_X}" y="${bandY + 72}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="18" font-weight="500" fill="${PALETTE.champagneGold}">${escapeXml(sharedCopy.sourceLine)}</text>
  </g>`;
  }

  const lineY = 1220;
  return `  <g id="layer-footer">
    <line x1="${PAD_X}" y1="${lineY}" x2="${CANVAS_W - PAD_X}" y2="${lineY}" stroke="${PALETTE.academicNavy}" stroke-opacity="0.22" stroke-width="1.5" />
    <rect x="${PAD_X}" y="${lineY - 1.5}" width="88" height="3" rx="1.5" fill="${PALETTE.redAccent}" />
    <text id="footer-event" x="${PAD_X}" y="${lineY + 34}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="19" font-weight="700" fill="${PALETTE.academicNavy}">${escapeXml(sharedCopy.footerEvent)}</text>
    <text id="footer-source" x="${PAD_X}" y="${lineY + 64}" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="18" font-weight="500" fill="${PALETTE.navyBody}">${escapeXml(sharedCopy.sourceLine)}</text>
  </g>`;
}

async function generatePosterSvg({ poster, config, emblemInfo, illInfo }) {
  const art = POSTER_ART_DIRECTION[poster.id];
  if (!art) throw new Error(`Missing art direction for poster id ${poster.id}`);

  const topSolidPct = Math.round(art.topScrimSolidStop * 100);
  const topMidPct = Math.min(92, topSolidPct + 24);
  const isNavyFooter = art.footerStyle === 'navy-band';
  const bottomFadeColor = isNavyFooter ? PALETTE.academicNavy : PALETTE.warmIvory;
  const bottomStartOpacity = isNavyFooter ? '0.0' : '0.0';
  const bottomEndOpacity = isNavyFooter ? '0.90' : '0.96';

  const illustrationLayer = buildIllustrationLayer({ poster, illInfo, art });
  const headerLayer = buildHeaderLayer({ poster, sharedCopy: config.sharedCopy, emblemInfo, art });
  const typographyLayer = buildTypographyLayer({ poster, art });
  const qrLayer = await buildQrLayer({ poster, config });
  const footerLayer = buildFooterLayer({ sharedCopy: config.sharedCopy, art });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" width="${CANVAS_W}" height="${CANVAS_H}">
  <defs>
    <clipPath id="canvas-clip">
      <rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" />
    </clipPath>
    <linearGradient id="top-scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${PALETTE.warmIvory}" stop-opacity="0.98" />
      <stop offset="${topSolidPct}%" stop-color="${PALETTE.warmIvory}" stop-opacity="0.93" />
      <stop offset="${topMidPct}%" stop-color="${PALETTE.warmIvory}" stop-opacity="0.62" />
      <stop offset="100%" stop-color="${PALETTE.warmIvory}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="bottom-scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bottomFadeColor}" stop-opacity="${bottomStartOpacity}" />
      <stop offset="32%" stop-color="${bottomFadeColor}" stop-opacity="0.82" />
      <stop offset="44%" stop-color="${bottomFadeColor}" stop-opacity="0.97" />
      <stop offset="64%" stop-color="${bottomFadeColor}" stop-opacity="0.99" />
      <stop offset="100%" stop-color="${bottomFadeColor}" stop-opacity="1" />
    </linearGradient>
    <filter id="soft-shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${PALETTE.academicNavy}" flood-opacity="0.12" />
    </filter>
  </defs>

  <g id="layer-background">
    <rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="${PALETTE.warmIvory}" />
  </g>

${illustrationLayer}

${headerLayer}

${typographyLayer}

${qrLayer}

${footerLayer}
</svg>
`;
}

function inlineAssetsForRender(svgMarkup, assetMap) {
  let rendered = svgMarkup.replace(/^\s*<\?xml[\s\S]*?\?>\s*/i, '');
  for (const [relHref, dataUri] of Object.entries(assetMap)) {
    rendered = rendered.split(`href="${relHref}"`).join(`href="${dataUri}"`);
  }
  return rendered;
}

async function renderSvgToPng({ page, svgMarkup, fontCss, assetMap, outPath }) {
  const inlineSvg = inlineAssetsForRender(svgMarkup, assetMap);
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<style>
${fontCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: ${CANVAS_W}px;
  height: ${CANVAS_H}px;
  overflow: hidden;
  background: ${PALETTE.warmIvory};
  font-family: 'Be Vietnam Pro', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}
svg { display: block; width: ${CANVAS_W}px; height: ${CANVAS_H}px; }
</style>
</head>
<body>${inlineSvg}</body>
</html>`;

  await page.setViewportSize({ width: CANVAS_W, height: CANVAS_H });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = Array.from(document.querySelectorAll('image, img'));
    await Promise.all(
      imgs.map((el) => {
        if (el instanceof HTMLImageElement && el.decode) {
          return el.decode().catch(() => {});
        }
        return Promise.resolve();
      })
    );
  });
  await page.screenshot({ path: outPath, type: 'png' });
}

async function buildContactSheet({ page, fontCss, exportedPosters }) {
  const sheetW = 1920;
  const sheetH = 1080;
  const cols = exportedPosters.map((p) => {
    const b64 = fs.readFileSync(p.outPath).toString('base64');
    return `
      <div class="card">
        <div class="frame">
          <img src="data:image/png;base64,${b64}" alt="${escapeXml(p.filename)}" />
        </div>
        <div class="meta">
          <div class="idx">${escapeXml(p.index)} · ${escapeXml(p.storyBeat)}</div>
          <div class="fname">${escapeXml(p.filename)}</div>
        </div>
      </div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<style>
${fontCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: ${sheetW}px;
  height: ${sheetH}px;
  background: ${PALETTE.warmIvory};
  color: ${PALETTE.academicNavy};
  font-family: 'Be Vietnam Pro', Arial, sans-serif;
  padding: 44px 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid rgba(16, 41, 75, 0.16);
  padding-bottom: 18px;
}
h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.4px; }
.sub { font-size: 18px; font-weight: 600; color: ${PALETTE.youthBlue}; }
.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  align-items: center;
  margin: 28px 0;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.frame {
  background: #fff;
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 10px 28px rgba(16, 41, 75, 0.12);
  border: 1px solid rgba(16, 41, 75, 0.12);
}
.frame img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 8px;
}
.idx { font-size: 14px; font-weight: 800; color: ${PALETTE.redAccent}; }
.fname { font-size: 13px; font-weight: 600; color: ${PALETTE.academicNavy}; word-break: break-all; }
footer {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  color: ${PALETTE.navyBody};
  border-top: 1px solid rgba(16, 41, 75, 0.14);
  padding-top: 14px;
}
</style>
</head>
<body>
  <header>
    <div>
      <h1>CONTACT SHEET — BỘ 05 ẤN PHẨM NGHỊ QUYẾT 57-NQ/TW (1080 × 1350 px)</h1>
      <div class="sub">Trại Thanh niên số thành phố Đồng Nai 2026 · Chủ đề 1: Nghị quyết đến gần thanh niên</div>
    </div>
    <div class="sub">Tỷ lệ 4:5 · sRGB · Editable SVG + PNG</div>
  </header>
  <div class="grid">${cols}</div>
  <footer>
    <span>Nguồn: Nghị quyết 57-NQ/TW, Bộ Chính trị (22/12/2024).</span>
    <span>Trạng thái: DRAFT_PENDING_OFFICIAL_METADATA · Hình minh họa 2D hỗ trợ bởi AI</span>
  </footer>
</body>
</html>`;

  const contactPath = path.join(DESIGN_DIR, 'CONTACT_SHEET.png');
  await page.setViewportSize({ width: sheetW, height: sheetH });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.querySelectorAll('img')).map((img) => img.decode().catch(() => {}))
    );
  });
  await page.screenshot({ path: contactPath, type: 'png' });
  return contactPath;
}

async function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Missing config: ${CONFIG_PATH}`);
  }
  if (!fs.existsSync(EMBLEM_PATH)) {
    throw new Error(`Missing clean emblem: ${EMBLEM_PATH}`);
  }

  fs.mkdirSync(EDITABLE_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_POSTERS_DIR, { recursive: true });

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const emblemInfo = readPngDimensions(EMBLEM_PATH);
  const fontCss = loadFontFaceCss();

  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const onlyIds = onlyArg
    ? new Set(onlyArg.replace('--only=', '').split(',').map((s) => Number(s.trim())))
    : null;

  const availablePosters = config.posters.filter((p) => {
    if (onlyIds && !onlyIds.has(p.id)) return false;
    const rawPath = path.join(DESIGN_DIR, p.sourceIllustration);
    return fs.existsSync(rawPath);
  });

  if (availablePosters.length === 0) {
    throw new Error('No source illustrations found in DESIGN_CHUDE1_DRAFT/02_ThietKe/source_illustrations/');
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: CANVAS_W, height: CANVAS_H },
    deviceScaleFactor: 1,
  });

  const exported = [];
  try {
    for (const poster of availablePosters) {
      const rawPath = path.join(DESIGN_DIR, poster.sourceIllustration);
      const illInfo = readPngDimensions(rawPath);
      const svgMarkup = await generatePosterSvg({ poster, config, emblemInfo, illInfo });

      const svgPath = path.join(DESIGN_DIR, poster.editableSvg);
      fs.mkdirSync(path.dirname(svgPath), { recursive: true });
      fs.writeFileSync(svgPath, svgMarkup, 'utf8');

      const outPath = path.join(DESIGN_DIR, poster.filename);
      const assetMap = {
        '../identity/derived/huy-hieu-doan-clean.png': emblemInfo.dataUri,
        [`../${poster.sourceIllustration}`]: illInfo.dataUri,
      };
      await renderSvgToPng({ page, svgMarkup, fontCss, assetMap, outPath });

      const publicCopyPath = path.join(PUBLIC_POSTERS_DIR, poster.filename);
      fs.copyFileSync(outPath, publicCopyPath);

      const bytes = fs.statSync(outPath).size;
      console.log(`Exported ${poster.filename} (${bytes.toLocaleString()} bytes) + ${poster.editableSvg}`);
      exported.push({ ...poster, outPath, svgPath, publicCopyPath, bytes });
    }

    // Build CONTACT_SHEET.png once all 5 PNGs exist
    const allFive = config.posters.map((p) => ({
      ...p,
      outPath: path.join(DESIGN_DIR, p.filename),
    }));
    if (allFive.every((p) => fs.existsSync(p.outPath))) {
      const contactPath = await buildContactSheet({ page, fontCss, exportedPosters: allFive });
      console.log(`Generated ${path.relative(ROOT, contactPath)}`);
    } else {
      const missing = allFive.filter((p) => !fs.existsSync(p.outPath)).map((p) => p.filename);
      console.log(`Skipped CONTACT_SHEET.png (waiting for: ${missing.join(', ')})`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
