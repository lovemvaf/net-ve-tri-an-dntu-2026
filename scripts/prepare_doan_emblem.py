#!/usr/bin/env python3
"""Prepare clean RGBA Đoàn Thanh niên Cộng sản Hồ Chí Minh emblem from untouched original.

Uses 4-connected BFS flood-fill from all 4 outer corners to remove ONLY dark
exterior background pixels (max(R, G, B) < 42) outside the white outer ring,
applies gentle 1px exterior alpha feathering with black-matte decontamination on
the neutral white outer boundary edge (zero halo on light or dark surfaces),
preserves 100% of interior pixels unchanged, and saves symmetrically padded
RGBA PNGs with an >=8px transparent margin matching the source aspect ratio.
"""

from __future__ import annotations

import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SOURCE_EMBLEM = Path(
    "C:/Users/asus/.gemini/antigravity/brain/4160b934-787e-4101-962a-4601f5f1f8ca"
    "/.user_uploaded/media_1795700405456_84ed6ac6.jpg"
)

ORIGINAL_OUTPUTS = [
    ROOT / "DESIGN_CHUDE1_DRAFT" / "02_ThietKe" / "identity" / "original" / "huy-hieu-doan-original.jpg",
    ROOT / "public" / "assets" / "identity" / "original" / "huy-hieu-doan-original.jpg",
]
DERIVED_OUTPUTS = [
    ROOT / "DESIGN_CHUDE1_DRAFT" / "02_ThietKe" / "identity" / "derived" / "huy-hieu-doan-clean.png",
    ROOT / "public" / "assets" / "identity" / "derived" / "huy-hieu-doan-clean.png",
]
CHECK_OUTPUT = ROOT / ".research" / "emblem_check.png"

DARK_THRESHOLD = 42
MARGIN_X = 8


def flood_exterior(rgb: np.ndarray, threshold: int = DARK_THRESHOLD) -> np.ndarray:
    """Return boolean mask of exterior dark background via 4-connected BFS from 4 corners."""
    h, w, _ = rgb.shape
    mx = rgb.max(axis=2)
    exterior = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for cy, cx in ((0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)):
        if mx[cy, cx] < threshold and not exterior[cy, cx]:
            exterior[cy, cx] = True
            queue.append((cy, cx))

    while queue:
        y, x = queue.popleft()
        if y > 0 and not exterior[y - 1, x] and mx[y - 1, x] < threshold:
            exterior[y - 1, x] = True
            queue.append((y - 1, x))
        if y + 1 < h and not exterior[y + 1, x] and mx[y + 1, x] < threshold:
            exterior[y + 1, x] = True
            queue.append((y + 1, x))
        if x > 0 and not exterior[y, x - 1] and mx[y, x - 1] < threshold:
            exterior[y, x - 1] = True
            queue.append((y, x - 1))
        if x + 1 < w and not exterior[y, x + 1] and mx[y, x + 1] < threshold:
            exterior[y, x + 1] = True
            queue.append((y, x + 1))

    return exterior


def dilate_4(mask: np.ndarray) -> np.ndarray:
    """4-connected 1px dilation."""
    out = mask.copy()
    out[1:, :] |= mask[:-1, :]
    out[:-1, :] |= mask[1:, :]
    out[:, 1:] |= mask[:, :-1]
    out[:, :-1] |= mask[:, 1:]
    return out


def build_clean_emblem(rgb: np.ndarray) -> tuple[Image.Image, dict[str, int | float]]:
    """Extract transparent RGBA emblem keeping interior pixels completely intact."""
    h, w, _ = rgb.shape
    exterior = flood_exterior(rgb, DARK_THRESHOLD)

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., :3] = rgb
    rgba[..., 3] = np.where(exterior, 0, 255).astype(np.uint8)
    rgba[exterior, :3] = 0

    # Identify the outermost boundary edge of the white outer rim (1px 4-adjacent
    # to exterior, plus 2px JPEG anti-aliased neutral fringe and canvas-edge rim).
    fg = ~exterior
    boundary_4 = fg & dilate_4(exterior)
    boundary_2px = fg & dilate_4(boundary_4 | exterior)

    canvas_edge = np.zeros((h, w), dtype=bool)
    canvas_edge[0, :] = True
    canvas_edge[-1, :] = True
    canvas_edge[:, 0] = True
    canvas_edge[:, -1] = True

    sat = rgb.max(axis=2).astype(np.int16) - rgb.min(axis=2).astype(np.int16)
    lum = rgb.mean(axis=2)

    # Outer rim anti-aliased neutral pixels (<246, low saturation) get black-matte
    # un-premultiplication to pure white (255,255,255) and gentle 1px exterior
    # alpha feathering so there is zero dark halo on light or dark backgrounds.
    outer_feather_mask = (
        boundary_4 | ((boundary_2px | (fg & canvas_edge)) & (lum < 246))
    ) & (sat <= 25)

    alpha_ramp = np.clip((lum - 36.0) / (244.0 - 36.0), 0.0, 1.0)
    soft_alpha = np.where(boundary_4, alpha_ramp * 0.90, alpha_ramp)
    feathered_a = np.clip(np.round(soft_alpha * 255.0), 0, 255).astype(np.uint8)

    # Un-premultiply dark background contamination on the white outer edge -> pure white RGB
    rgba[outer_feather_mask, 0] = 255
    rgba[outer_feather_mask, 1] = 255
    rgba[outer_feather_mask, 2] = 255
    rgba[outer_feather_mask, 3] = feathered_a[outer_feather_mask]

    # Symmetric trim & >=8px transparent margin keeping source aspect ratio
    alpha_pos = rgba[..., 3] > 0
    ys, xs = np.where(alpha_pos)
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    cropped = rgba[y0:y1, x0:x1]
    ch, cw = cropped.shape[:2]

    pad_x = MARGIN_X
    target_w = cw + 2 * pad_x
    # Match original aspect ratio (w / h) symmetrically
    target_h_exact = round(target_w * h / w)
    # Ensure symmetric top/bottom padding and same parity as ch
    diff_h = target_h_exact - ch
    if diff_h % 2 != 0:
        diff_h += 1
    pad_y = max(MARGIN_X, diff_h // 2)
    target_h = ch + 2 * pad_y

    canvas = np.zeros((target_h, target_w, 4), dtype=np.uint8)
    canvas[pad_y : pad_y + ch, pad_x : pad_x + cw] = cropped

    # Verify interior pixels (all foreground pixels outside outer_feather_mask) are 100% unchanged
    interior_mask = fg & (~outer_feather_mask)
    interior_diff = int(np.abs(canvas[pad_y : pad_y + ch, pad_x : pad_x + cw, :3][interior_mask[y0:y1, x0:x1]].astype(np.int16) - rgb[y0:y1, x0:x1][interior_mask[y0:y1, x0:x1]].astype(np.int16)).max())

    stats = {
        "src_w": w,
        "src_h": h,
        "exterior_removed": int(exterior.sum()),
        "feathered_edge_px": int(outer_feather_mask.sum()),
        "interior_px_untouched": int(interior_mask.sum()),
        "interior_max_rgb_diff": interior_diff,
        "out_w": target_w,
        "out_h": target_h,
        "pad_x": pad_x,
        "pad_y": pad_y,
        "src_aspect": round(w / h, 6),
        "out_aspect": round(target_w / target_h, 6),
    }
    return Image.fromarray(canvas, mode="RGBA"), stats


def create_verification_sheet(emblem: Image.Image, out_path: Path) -> None:
    """Render side-by-side light (#F6F4ED) & dark (#10294B) strips + 4x edge zoom crops."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    panel_w, panel_h = 520, 580
    zoom_h = 260
    sheet = Image.new("RGB", (panel_w * 2, panel_h + zoom_h), (235, 235, 235))

    light_bg = Image.new("RGBA", (panel_w, panel_h), (0xF6, 0xF4, 0xED, 255))
    dark_bg = Image.new("RGBA", (panel_w, panel_h), (0x10, 0x29, 0x4B, 255))

    thumb = emblem.copy()
    thumb.thumbnail((440, 490), Image.Resampling.LANCZOS)
    ox = (panel_w - thumb.width) // 2
    oy = (panel_h - thumb.height) // 2 + 12

    light_bg.alpha_composite(thumb, (ox, oy))
    dark_bg.alpha_composite(thumb, (ox, oy))
    sheet.paste(light_bg.convert("RGB"), (0, 0))
    sheet.paste(dark_bg.convert("RGB"), (panel_w, 0))

    # 3x zoomed edge crops on light & dark to inspect zero black halo & intact text
    ew, eh = emblem.size
    crop_box_edge = (0, eh // 2 - 45, 90, eh // 2 + 45)
    crop_box_text = (ew // 2 - 120, eh - 130, ew // 2 + 120, eh - 40)

    for idx, (bg_rgb, x_off) in enumerate([((0xF6, 0xF4, 0xED), 0), ((0x10, 0x29, 0x4B), panel_w)]):
        strip = Image.new("RGBA", (panel_w, zoom_h), (*bg_rgb, 255))
        edge_crop = emblem.crop(crop_box_edge).resize((200, 200), Image.Resampling.NEAREST)
        text_crop = emblem.crop(crop_box_text).resize((280, 105), Image.Resampling.LANCZOS)
        strip.alpha_composite(edge_crop, (16, 40))
        strip.alpha_composite(text_crop, (228, 88))
        sheet.paste(strip.convert("RGB"), (x_off, panel_h))

    draw = ImageDraw.Draw(sheet)
    draw.text((18, 14), "LIGHT STRIP #F6F4ED (Warm Ivory)", fill=(16, 41, 75))
    draw.text((panel_w + 18, 14), "DARK STRIP #10294B (Academic Navy)", fill=(246, 244, 237))
    draw.text((18, panel_h + 12), "Edge Zoom + Text Check on #F6F4ED", fill=(16, 41, 75))
    draw.text((panel_w + 18, panel_h + 12), "Edge Zoom + Text Check on #10294B", fill=(246, 244, 237))
    sheet.save(out_path, format="PNG")


def main() -> None:
    if not SOURCE_EMBLEM.exists():
        raise FileNotFoundError(f"Missing source emblem: {SOURCE_EMBLEM}")

    for dest in ORIGINAL_OUTPUTS:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(SOURCE_EMBLEM, dest)

    src_img = Image.open(SOURCE_EMBLEM).convert("RGB")
    rgb = np.array(src_img)
    clean_img, stats = build_clean_emblem(rgb)

    for dest in DERIVED_OUTPUTS:
        dest.parent.mkdir(parents=True, exist_ok=True)
        clean_img.save(dest, format="PNG", optimize=True)

    create_verification_sheet(clean_img, CHECK_OUTPUT)
    print("Doan emblem processed successfully:")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
