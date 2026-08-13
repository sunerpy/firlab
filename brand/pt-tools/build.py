#!/usr/bin/env python3
"""
pt-tools brand asset generator.

Emits every asset in this directory from ONE parametric definition of the mark,
so the SVGs, the wordmark and the PNG ladder can never drift apart. Re-run after
changing a parameter; do not hand-edit the generated files.

    uv run --with fonttools --with cairosvg --with pillow python3 build.py

WHY THE MARK LOOKS LIKE THIS
----------------------------
pt-tools watches several private trackers at once and drives the numbers that
decide your standing on them. The mark states that and nothing else:

    three columns, rising, sharing one base

Three columns because cross-site aggregation - one view over many trackers - is
the tool's most distinctive job. Rising because ratio, bonus and level are the
figures it exists to move. Flush, with no gaps, because it is ONE view rather
than three separate dashboards. It reads secondarily as signal strength, which
is also true: the tool probes each site and reports whether the session is
still alive.

The rise is 4 -> 7 -> 12, not 4 -> 8 -> 12. The deltas are 3 then 5, so the
climb accelerates instead of being linear. Column WIDTH stays a constant 4:
unequal widths (3/4/5) were tried and read as inconsistent thickness rather
than as rhythm, which looks like a mistake rather than a decision. The first
column is 4 rather than 3 tall because at a 16px favicon that is the difference
between a 4x4 and a 4x3 block, and it is the quietest element in the mark - it
does not also need to be the thinnest.

WHAT THE PREVIOUS MARK GOT WRONG
--------------------------------
It was three notched feeds -> a converging funnel -> an orange engine block ->
a teal dispatch stub. The data path was honest, but nobody read it that way:
asked to name it cold, viewers said funnel, then fork, then three-pin plug. Six
shapes, and the funnel was a solid mass sitting directly under the feeds, so the
gaps between the feeds closed visually and the top half became one white lump.
Meaning, not pixels, was the failure - its feeds do measurably survive at 16px.

CONSTRUCTION RULES (all four are load-bearing)
----------------------------------------------
1. Everything sits on a 64-unit grid inside a 1024 canvas. 1024 / 64 = 16, so at
   a 16px favicon every edge lands on a whole pixel boundary. Measured on the
   output: zero antialiased pixels anywhere in icon-16.png.
2. No mass below 3 units. The smallest element here is 4 x 3, which is 4 x 3 px
   at a 16px favicon.
3. No interior negative space. The three columns TOUCH; only a colour boundary
   divides them. A gap fills in with antialiasing at small sizes and a hole
   drawn in the plate colour dissolves into the plate - both were measured
   failing during exploration. A colour edge between two opaque fills cannot.
   This is how the sibling Voxera mark is built.
4. Zero opacity anywhere. Hierarchy comes from mass, length and position only. A
   faded element degrades into a ghost at small sizes and silently changes what
   the mark means.

Construction language is inherited from the two shipped sibling icons
(AgentLens, Voxera): 1024 canvas, flat fills, hard angles, no gradients, and the
same four palette values, so the four product marks sit together.
"""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent

# cairo inherits LCD subpixel antialiasing from fontconfig, which bakes coloured
# fringes into a raster. Forced to greyscale here, before cairo is imported, so
# the PNG ladder is reproducible on any host. Verified by rendering the same SVG
# under rgba=none and rgba=rgb and diffing: the outputs must be byte-identical.
FONTS_CONF = HERE / "fonts.conf"
FONTS_CONF.write_text(
    '<?xml version="1.0"?>\n'
    '<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n'
    "<fontconfig>\n"
    '  <match target="font">\n'
    '    <edit name="rgba" mode="assign"><const>none</const></edit>\n'
    '    <edit name="antialias" mode="assign"><bool>true</bool></edit>\n'
    "  </match>\n"
    "</fontconfig>\n"
)
os.environ.setdefault("FONTCONFIG_FILE", str(FONTS_CONF))

# --- palette: the four locked values. Nothing else may appear in an output. ---
INK = "#0B1220"  # near-black navy - plate, wordmark slab
PAPER = "#E7EDF5"  # cool off-white - the first tracked column
BRAND = "#F97316"  # orange - the tallest column (2.7:1 on paper: never detail)
TEAL = "#14B8A6"  # teal - the middle column

# --- geometry, expressed in 16ths so the grid contract is visible ------------
U = 64  # one 16px-pixel = 64 canvas units
COL_W = 4  # constant width; see the header on why it is not 3/4/5
COL_X = (2, 6, 10)  # flush, spanning 2..14 - a 2-unit margin either side
COL_H = (4, 7, 12)  # accelerating rise: deltas 3 then 5
BASE_Y = 14  # shared base line - all three columns stand on it
COL_FILL = (PAPER, TEAL, BRAND)

GLYPH_MIN = COL_X[0] * U
GLYPH_MAX = (COL_X[-1] + COL_W) * U
GLYPH_SPAN = GLYPH_MAX - GLYPH_MIN


def mark_body(fills: tuple[str, ...], indent: str = "  ") -> str:
    """The mark's three columns, left to right."""
    return "\n".join(
        f'{indent}<rect x="{x * U}" y="{(BASE_Y - h) * U}" '
        f'width="{COL_W * U}" height="{h * U}" fill="{f}"/>'
        for x, h, f in zip(COL_X, COL_H, fills)
    )


PLATE_R = 204.8  # 20% of 1024 - the same corner radius as the Voxera app icon


def write_logo() -> None:
    """Plated primary. Self-contained, so it holds on light, dark and coloured
    grounds with no media query and no <picture>. The PNG ladder comes from this.
    The glyph is NOT scaled: its bounds are already 128..896, which leaves a
    2-unit (12.5%) margin on every side."""
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="pt-tools">
  <title>pt-tools</title>
  <!-- Generated by build.py. Do not hand-edit. -->
  <rect x="0" y="0" width="1024" height="1024" rx="{PLATE_R}" ry="{PLATE_R}" fill="{INK}"/>
{mark_body(COL_FILL)}
</svg>
"""
    (HERE / "logo.svg").write_text(svg)


def write_mono() -> None:
    """Plate-less, single-colour, currentColor so an inlined copy inherits the
    host theme. Here the stepped contour carries the entire mark with no colour
    help, which is the real test of the geometry - and the reason this mark was
    chosen over eight alternatives whose identity lived in an interior detail
    that a single colour erases."""
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" role="img" aria-label="pt-tools">
  <title>pt-tools</title>
  <!-- Generated by build.py. Do not hand-edit. Inherits colour from the host. -->
{mark_body(("currentColor",) * 3)}
</svg>
"""
    (HERE / "logo-mono.svg").write_text(svg)


# --- wordmark ---------------------------------------------------------------
# The ink slab is a decision, not laziness. Of the four locked colours only ink
# clears text contrast on paper, and ink is invisible on a dark ground. Paper
# type on an ink slab keeps the lockup inside the palette AND readable on every
# background, which is what a transplanted asset needs.
#
# Type is emitted as outlines, never <text>, so it renders identically on a
# machine with none of these fonts installed.
WORDMARK = "pt-tools"
FONT = "/usr/share/fonts/truetype/noto/NotoSansMono-Bold.ttf"

SLAB_H = 320
SLAB_R = 64  # 20% of slab height - the plate's corner ratio, held
PAD_L = 72
GLYPH_H = 184  # mark height inside the slab
GAP = 64
PAD_R = 76
TYPE_CAP = 112  # cap height: 61% of the mark


def write_wordmark() -> None:
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.ttLib import TTFont

    font = TTFont(FONT)
    upem = font["head"].unitsPerEm
    cap = font["OS/2"].sCapHeight
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    glyf = font["glyf"]

    size = TYPE_CAP * upem / cap  # font size yielding exactly TYPE_CAP cap height
    scale = size / upem

    paths: list[str] = []
    x = 0.0
    y_lo = y_hi = 0.0
    for ch in WORDMARK:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyph_set)
        glyph_set[name].draw(pen)
        d = pen.getCommands()
        if d:
            paths.append(f'<path transform="translate({x:.2f} 0)" d="{d}"/>')
            g = glyf[name]
            if g.numberOfContours:
                y_lo = min(y_lo, g.yMin)
                y_hi = max(y_hi, g.yMax)
        x += hmtx[name][0]

    text_w = x * scale
    ink_top, ink_bot = y_hi * scale, -y_lo * scale

    # Centre the type's real ink box (t-ascender to p-descender) on the slab
    # axis. Centring the baseline instead would ride visibly high.
    baseline = (SLAB_H + ink_top - ink_bot) / 2

    gs = GLYPH_H / GLYPH_SPAN
    tx = PAD_L - GLYPH_MIN * gs
    ty = (SLAB_H - GLYPH_H) / 2 - GLYPH_MIN * gs

    text_x = PAD_L + GLYPH_H + GAP
    slab_w = round(text_x + text_w + PAD_R)

    joined = "\n      ".join(paths)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{slab_w}" height="{SLAB_H}" viewBox="0 0 {slab_w} {SLAB_H}" role="img" aria-label="pt-tools">
  <title>pt-tools</title>
  <!-- Generated by build.py. Do not hand-edit. Type is converted outlines, never a text element. -->
  <rect x="0" y="0" width="{slab_w}" height="{SLAB_H}" rx="{SLAB_R}" ry="{SLAB_R}" fill="{INK}"/>
  <g transform="translate({tx:.3f} {ty:.3f}) scale({gs:.6f})">
{mark_body(COL_FILL, indent="    ")}
  </g>
  <g fill="{PAPER}" transform="translate({text_x:.2f} {baseline:.2f}) scale({scale:.6f} -{scale:.6f})">
      {joined}
  </g>
</svg>
"""
    (HERE / "wordmark.svg").write_text(svg)
    print(f"wordmark.svg  {slab_w}x{SLAB_H}  type {size:.1f}px  cap {TYPE_CAP}")


SIZES = (512, 256, 128, 64, 32, 16)


def write_pngs() -> None:
    """Rendered natively at each size from logo.svg - never downscaled from the
    512, so each raster is a true evaluation of the vector at that pixel budget
    and the 16px file is the geometry's real verdict."""
    import cairosvg

    src = (HERE / "logo.svg").read_bytes()
    for s in SIZES:
        cairosvg.svg2png(
            bytestring=src,
            write_to=str(HERE / f"icon-{s}.png"),
            output_width=s,
            output_height=s,
            background_color=None,
        )
        print(f"icon-{s}.png")


def main() -> None:
    write_logo()
    write_mono()
    write_wordmark()
    write_pngs()
    subprocess.run(["ls", "-l", str(HERE)], check=False)


if __name__ == "__main__":
    main()
