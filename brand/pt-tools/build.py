#!/usr/bin/env python3
"""
pt-tools brand asset generator: the 1.0 seed badge.

Writes every file in this directory from one definition of the mark, so the
SVGs, the lockups and the PNG ladder cannot drift apart. Change a value here
and re-run; do not hand-edit the outputs.

    uv run --with fonttools==4.65.0 --with shapely==2.2.0 --with cairosvg==2.7.1 python3 build.py

The versions are pinned because the outputs were checked byte for byte against
the approved design files: another shapely release (it bundles its own GEOS) or
another fontTools release can move the last digit of a coordinate.

THE MARK
--------
A seed, round except for one corner at the top right, with a lowercase p cut
through it so the plate shows through. Chinese PT users call a torrent a 种子
(seed); the p is for pt. It sits on a superellipse badge in two palettes:

    ink    white seed on a near-black badge   light surfaces, and every place
                                              that takes a single image
    paper  near-black seed on a white badge   dark surfaces

Chosen on 2026-11-18 from the third 1.0 design round: concept 23 "种子徽标",
palettes A "墨黑" (ink) and C "纯白" (paper). The SVG ids keep that round's names
(pt-23-seed-ink-t, ...) so the outputs stay byte-identical to the approved
files. Each output file has its own id prefix, so different files can be
inlined on one page; inlining the same file twice needs per-instance ids.

CONSTRUCTION (canvas 1024 x 1024)
---------------------------------
plate    superellipse |x|^5 + |y|^5 = 1 scaled to the canvas, 360 points.
         ink:   vertical gradient #31353C -> #131518, a white radial glow at
                (300, 150) r 820 (10% -> 0), and a top-edge highlight: the
                outline stroked 10 wide and clipped to the plate, white 22% at
                the top, gone by half height.
         paper: vertical gradient #FFFFFF -> #EEF1F5 and an 8-wide #DCE1E8 rim,
                clipped to the plate.
seed     a 640 disc united with its top-right quadrant square, minus the p.
         Diagonal gradient from the bottom-left corner of its box to the
         top-right one: ink #C9D2DE -> #FFFFFF at 55%, paper #3D424C -> #1B1D22.
p        stroke 96. Bowl: ring of centre-line radius 104. Stem: round-ended,
         its left edge in line with the bowl's leftmost point, its right edge
         touching the counter. Wholly inside the seed, so the outline never
         opens; the counter stays as an island of seed.
ink box  (184, 200)-(824, 840) at scale 1: 640 x 640, shifted 8 left and 8
         down from the canvas centre as an optical correction for the corner.
scale    0.86 about the centre in the logo, the app icon and the lockups;
         1.0 in the favicons, which only render at 16 and 32 px, so the cut
         stays 1.5 px wide at 16 px instead of 1.3 px.
app icon full-bleed square for iOS, Android adaptive and PWA maskable icons
         (the platform applies its own mask): plate gradient and glow only.
         The farthest ink, the seed's corner, is 379.5 from the centre, inside
         the 440 safe radius.
lockup   the badge at 256 px, a 72 px gap, then "pt-tools" in Instrument Sans
         SemiBold (fonts/, SIL OFL 1.1) at 196 px, converted to outlines, its
         x-height band centred on the badge.

PNGs are rendered natively at every size, never downscaled: 16 and 32 from
favicon.svg, 64 and up from logo.svg.
"""

from __future__ import annotations

import math
from pathlib import Path

import cairosvg
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from shapely import affinity
from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

HERE = Path(__file__).resolve().parent
FONT = HERE / "fonts" / "InstrumentSans-600.ttf"

DESIGN_ID = "23-seed"  # concept id from the design round, kept in the SVG ids; see the docstring

# --- palettes ----------------------------------------------------------------
# plate: vertical gradient, top -> bottom. glow / edge: white opacity at the
# centre of the radial glow / at the top of the edge highlight (0 = not drawn).
# rim: solid edge colour (None = not drawn). seed: diagonal gradient, far end
# (bottom left) -> main colour, which holds from 55% to the top-right corner.
PALETTES = {
    "ink": dict(plate=("#31353C", "#131518"), glow=0.1, edge=0.22, rim=None, seed=("#C9D2DE", "#FFFFFF")),
    "paper": dict(plate=("#FFFFFF", "#EEF1F5"), glow=0, edge=0, rim="#DCE1E8", seed=("#3D424C", "#1B1D22")),
}
TYPE = {"light": "#1B1D22", "dark": "#F1F2F4"}  # lockup type on light / dark surfaces

# --- geometry ----------------------------------------------------------------
SEED_R = 640 / 2
P_STROKE = 96
P_BOWL_R = 104  # centre line; ink from 56 to 152
P_BOWL = (-6, -52)  # bowl centre, relative to the seed centre
P_STEM_X = P_BOWL[0] - P_BOWL_R  # stem centre line; its left edge meets the bowl's leftmost point
P_DESCENDER = 150  # stem centre line runs this far below the bowl
OPTICAL = (-8, 8)  # shift of the ink box from the canvas centre

GLYPH_SCALE = 0.86  # logo, app icon, lockups
SAFE_R = 440  # app icon: no ink beyond this radius after scaling
INK_BOX = (184, 200, 824, 840)

LOCKUP_TILE, LOCKUP_GAP, LOCKUP_TYPE = 256, 72, 196


def f(v: float) -> str:
    """One decimal, trailing zeros dropped: 184.0 -> 184, 613.40 -> 613.4."""
    return f"{v:.1f}".rstrip("0").rstrip(".")


def superellipse(n: float = 5.0, steps: int = 360, a: float = 512.0, c: float = 512.0) -> str:
    pts = []
    for i in range(steps):
        t = 2 * math.pi * i / steps
        cos, sin = math.cos(t), math.sin(t)
        x = c + a * math.copysign(abs(cos) ** (2 / n), cos)
        y = c + a * math.copysign(abs(sin) ** (2 / n), sin)
        pts.append(f"{f(x)} {f(y)}")
    return "M" + " L".join(pts) + " Z"


PLATE = superellipse()
BLEED = "M0 0 H1024 V1024 H0 Z"


def disc(cx: float, cy: float, r: float):
    return Point(cx, cy).buffer(r, quad_segs=64)


def ring(cx: float, cy: float, r: float, w: float):
    return disc(cx, cy, r + w / 2).difference(disc(cx, cy, r - w / 2))


def stroke(pts, w: float):
    return LineString(pts).buffer(w / 2, cap_style="round", join_style="round", quad_segs=32)


def seed_geometry():
    """The seed with the p cut out, placed on the canvas; returns (geometry,
    offset of the seed centre)."""
    r = SEED_R
    leaf = unary_union([disc(0, 0, r), Polygon([(0, -r), (r, -r), (r, 0), (0, 0)])])
    bx, by = P_BOWL
    p = unary_union([
        ring(bx, by, P_BOWL_R, P_STROKE),
        stroke([(P_STEM_X, by - P_BOWL_R), (P_STEM_X, by + P_BOWL_R + P_DESCENDER)], P_STROKE),
    ])
    assert leaf.contains(p), "the p must stay inside the seed, or the outline opens"
    badge = leaf.difference(p)
    x0, y0, x1, y1 = badge.bounds
    ox, oy = 512 - (x0 + x1) / 2 + OPTICAL[0], 512 - (y0 + y1) / 2 + OPTICAL[1]
    return affinity.translate(badge, ox, oy), (ox, oy)


def svg_path(geom) -> str:
    polys = [geom] if geom.geom_type == "Polygon" else [g for g in geom.geoms if g.geom_type == "Polygon"]
    out = []
    for poly in polys:
        for line in [poly.exterior, *poly.interiors]:
            pts = list(line.coords)[:-1]
            out.append("M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts) + " Z")
    return " ".join(out)


SEED, (SEED_X, SEED_Y) = seed_geometry()
SEED_D = svg_path(SEED)


# --- svg ---------------------------------------------------------------------

def defs(uid: str, pal: str) -> str:
    p = PALETTES[pal]
    top, bot = p["plate"]
    far, main = p["seed"]
    glow = ""
    if p["glow"]:
        glow = (f'<radialGradient id="{uid}-s" gradientUnits="userSpaceOnUse" cx="300" cy="150" r="820">'
                f'<stop offset="0" stop-color="#FFFFFF" stop-opacity="{p["glow"]}"/>'
                f'<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>')
    edge = ""
    if p["edge"]:
        edge = (f'<linearGradient id="{uid}-e" x1="0" y1="0" x2="0" y2="1">'
                f'<stop offset="0" stop-color="#FFFFFF" stop-opacity="{p["edge"]}"/>'
                f'<stop offset=".5" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>')
    r = SEED_R
    seed = (f'<linearGradient id="{uid}-leaf" gradientUnits="userSpaceOnUse" x1="{f(SEED_X - r)}" y1="{f(SEED_Y + r)}" '
            f'x2="{f(SEED_X + r)}" y2="{f(SEED_Y - r)}"><stop offset="0" stop-color="{far}" stop-opacity="1"/>'
            f'<stop offset="0.55" stop-color="{main}" stop-opacity="1"/>'
            f'<stop offset="1" stop-color="{main}" stop-opacity="1"/></linearGradient>')
    return (f'<defs><linearGradient id="{uid}-t" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient>{glow}{edge}'
            f'<clipPath id="{uid}-c"><path d="{PLATE}"/></clipPath>{seed}</defs>')


def plate(uid: str, pal: str, indent: str = "  ", bleed: bool = False) -> str:
    """bleed=True: a full square for platforms that apply their own mask; no
    edge highlight and no rim, the platform draws the edge."""
    p = PALETTES[pal]
    shape = BLEED if bleed else PLATE
    out = [f'{indent}<path d="{shape}" fill="url(#{uid}-t)"/>']
    if p["glow"]:
        out.append(f'{indent}<path d="{shape}" fill="url(#{uid}-s)"/>')
    if not bleed:
        if p["edge"]:
            out.append(f'{indent}<path d="{PLATE}" fill="none" stroke="url(#{uid}-e)" stroke-width="10" clip-path="url(#{uid}-c)"/>')
        if p["rim"]:
            out.append(f'{indent}<path d="{PLATE}" fill="none" stroke="{p["rim"]}" stroke-width="8" clip-path="url(#{uid}-c)"/>')
    return "\n".join(out)


def glyph(uid: str, scale: float, indent: str) -> str:
    tr = f' transform="translate(512 512) scale({scale:.4f}) translate(-512 -512)"' if scale < 1 else ""
    return (f'{indent}<g{tr}>\n{indent}  <path d="{SEED_D}" fill="url(#{uid}-leaf)" fill-rule="evenodd"/>\n'
            f'{indent}</g>')


def badge_svg(pal: str, scale: float, tag: str = "", bleed: bool = False) -> str:
    uid = f"pt-{DESIGN_ID}-{pal}{tag}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" '
            f'role="img" aria-label="pt-tools">\n  <title>pt-tools</title>\n  {defs(uid, pal)}\n'
            f'{plate(uid, pal, bleed=bleed)}\n{glyph(uid, scale, "  ")}\n</svg>\n')


def mono_svg() -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" '
            f'fill="none" role="img" aria-label="pt-tools">\n  <title>pt-tools</title>\n'
            f'  <path d="{SEED_D}" fill="currentColor" fill-rule="evenodd"/>\n</svg>\n')


def text_outline(s: str, size: float):
    """(path data, right edge of the ink) for s at font size `size`, baseline at
    y=0, y down. The font is only read here; no output embeds it."""
    font = TTFont(FONT)
    gs, cmap = font.getGlyphSet(), font.getBestCmap()
    k = size / font["head"].unitsPerEm
    x, parts, right = 0.0, [], 0.0
    for ch in s:
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (k, 0, 0, -k, x, 0)))
        parts.append(pen.getCommands())
        bounds = BoundsPen(gs)
        gs[name].draw(TransformPen(bounds, (k, 0, 0, -k, x, 0)))
        if bounds.bounds:
            right = max(right, bounds.bounds[2])
        x += font["hmtx"][name][0] * k
    x_height = font["OS/2"].sxHeight * size / font["head"].unitsPerEm
    return " ".join(parts), right, x_height


def lockup_svg(pal: str, surface: str) -> str:
    """Badge at LOCKUP_TILE px, then the name in outlines. `surface` is the
    background the lockup is meant for, which sets the type colour."""
    tile, gap = LOCKUP_TILE, LOCKUP_GAP
    fill = TYPE[surface]
    d, right, x_height = text_outline("pt-tools", LOCKUP_TYPE)
    base = tile / 2 + x_height / 2  # centre the x-height band on the badge
    width = math.ceil(tile + gap + right)
    uid = f"lk-{DESIGN_ID}-{pal}-{fill.strip('#').lower()}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{tile}" viewBox="0 0 {width} {tile}" '
            f'role="img" aria-label="pt-tools">\n  <title>pt-tools</title>\n  <g transform="scale({tile / 1024:g})">\n'
            f'  {defs(uid, pal)}\n{plate(uid, pal, indent="    ")}\n{glyph(uid, GLYPH_SCALE, "    ")}\n  </g>\n'
            f'  <path transform="translate({tile + gap} {base:.1f})" fill="{fill}" d="{d}"/>\n</svg>\n')


# --- android adaptive icon --------------------------------------------------
# 108dp layers; the launcher shows the middle 72dp through its mask. VIEW maps the
# 1024 badge onto that 72dp window, so foreground + background, cropped to it,
# match app-icon.svg. The plate gradient is in user space over the 72dp window and
# keeps its end colours outside it.
VIEW = "translate(512 512) scale(0.666667) translate(-512 -512)"
FULL = "M-256 -256 H1280 V1280 H-256 Z"


def adaptive_svg(layer: str) -> str:
    uid = f"ad-{DESIGN_ID}-ink"
    head = '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">\n'
    tr = f'translate(512 512) scale({GLYPH_SCALE:.4f}) translate(-512 -512)'
    if layer == "foreground":
        body = (f'  {defs(uid, "ink")}\n  <g transform="{VIEW}"><g transform="{tr}">'
                f'<path d="{SEED_D}" fill="url(#{uid}-leaf)" fill-rule="evenodd"/></g></g>\n')
    elif layer == "monochrome":
        body = (f'  <g transform="{VIEW}"><g transform="{tr}">'
                f'<path d="{SEED_D}" fill="#FFFFFF" fill-rule="evenodd"/></g></g>\n')
    else:
        p = PALETTES["ink"]
        top, bot = p["plate"]
        glow = (f'<radialGradient id="{uid}-s" gradientUnits="userSpaceOnUse" cx="300" cy="150" r="820">'
                f'<stop offset="0" stop-color="#FFFFFF" stop-opacity="{p["glow"]}"/>'
                f'<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>')
        body = (f'  <defs><linearGradient id="{uid}-t" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1024">'
                f'<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient>{glow}</defs>\n'
                f'  <g transform="{VIEW}"><path d="{FULL}" fill="url(#{uid}-t)"/><path d="{FULL}" fill="url(#{uid}-s)"/></g>\n')
    return head + body + "</svg>\n"


OUTPUTS = {
    "logo.svg": lambda: badge_svg("ink", GLYPH_SCALE),
    "logo-dark.svg": lambda: badge_svg("paper", GLYPH_SCALE),
    "logo-mono.svg": mono_svg,
    "favicon.svg": lambda: badge_svg("ink", 1.0, tag="-fav"),
    "favicon-dark.svg": lambda: badge_svg("paper", 1.0, tag="-fav"),
    "app-icon.svg": lambda: badge_svg("ink", GLYPH_SCALE, tag="-app", bleed=True),
    "wordmark.svg": lambda: lockup_svg("paper", "dark"),
    "wordmark-light.svg": lambda: lockup_svg("ink", "light"),
    "adaptive-foreground.svg": lambda: adaptive_svg("foreground"),
    "adaptive-background.svg": lambda: adaptive_svg("background"),
    "adaptive-monochrome.svg": lambda: adaptive_svg("monochrome"),
}
PNG_SIZES = (16, 32, 64, 128, 256, 512)
FAVICON_MAX = 32  # sizes up to this render from favicon.svg, the rest from logo.svg


def main() -> None:
    box = tuple(round(v, 6) for v in SEED.bounds)
    assert box == INK_BOX, f"ink box moved: {box}"
    far = max(math.hypot(x - 512, y - 512) for g in SEED.geoms for line in [g.exterior, *g.interiors] for x, y in line.coords)
    assert far * GLYPH_SCALE <= SAFE_R, f"app icon ink reaches {far * GLYPH_SCALE:.1f}, past the {SAFE_R} safe radius"
    print(f"ink box {box}  farthest ink at {GLYPH_SCALE}: {far * GLYPH_SCALE:.1f} (safe {SAFE_R})")

    svgs = {}
    for name, make in OUTPUTS.items():
        svgs[name] = make().encode("ascii")
        (HERE / name).write_bytes(svgs[name])
        print(f"{name:20} {len(svgs[name]):6} bytes")
    for s in PNG_SIZES:
        src = svgs["favicon.svg" if s <= FAVICON_MAX else "logo.svg"]
        out = HERE / f"icon-{s}.png"
        cairosvg.svg2png(bytestring=src, write_to=str(out), output_width=s, output_height=s)
        print(f"{out.name:20} {out.stat().st_size:6} bytes")


if __name__ == "__main__":
    main()
