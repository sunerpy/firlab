#!/usr/bin/env python3
"""
pt-tools brand asset generator.

Emits every asset in this directory from ONE parametric definition of the mark,
so the SVGs, the wordmark and the PNG ladder can never drift apart. Re-run after
changing a parameter; do not hand-edit the generated files.

    uv run --with fonttools --with cairosvg --with pillow python3 build.py

WHY THE MARK LOOKS LIKE THIS
----------------------------
pt-tools is a Go command-line tool. The mark says exactly that:

    a shell prompt caret, and the cursor block waiting after it

A teal caret pointing right, then a solid orange block on the same axis - the
two things you actually see on a terminal line before you have typed anything.
It is the most literal available statement of what the product is, and of 69
drawn candidates it is the only one whose naive reading matched its intent.

WHAT THE 68 REJECTED CANDIDATES TAUGHT
--------------------------------------
Flat block mosaics (24 drawn) all got named as something else: staircase, bar
chart, fork, fence. They also hit a hard contradiction - a filled grid needs
visible cell separation to read as a grid, but same-coloured adjacent cells fuse
into one mass and a gap between them fills in with antialiasing at 16px.

Node-on-ring variants (12 drawn) read as atoms, and the three-node version
collided with the sibling CodeGraph mark, which is literally a three-node graph.

Letterform "pt" cannot be made to work at icon size: inside a 48-unit box the
p's bowl and the t's crossbar collide, and opening them far enough to separate
leaves both strokes too thin to survive a favicon.

One late candidate carried its meaning in an opacity-faded return segment.
Measured at 16px the faded segment was simply gone. That is rule 4 below,
learned the expensive way.

CONSTRUCTION RULES
------------------
1. Everything sits on a 64-unit grid inside a 1024 canvas. 1024 / 64 = 16, so at
   a 16px favicon every ORTHOGONAL edge lands on a whole pixel boundary; the
   cursor block rasterises to exactly 5 x 4 whole pixels. The caret is a
   45-degree stroke with round caps, so it is antialiased by construction. That
   is the price of the diagonal and it is paid knowingly - the previous mark's
   "zero antialiased pixels" property does not survive a stroked design and the
   claim has been retired rather than quietly kept.
2. Minimum WEIGHT, not minimum mass. The old rule ("no mass below 3 units") was
   written for flat rectangles; for a stroked mark the binding constraint is the
   stroke. It is 2 units, i.e. 2px at a 16px favicon. Measured on the raster,
   2 units yields 22 fully-opaque teal pixels and zero washed-out ones, while
   1.5 units yields 8 opaque and 12 washed-out - a grey smear, not a caret. The
   candidate as originally drawn used 2.6 of a 48-unit box, which works out to
   0.87px at a 16px favicon and would not have survived. 2.5 units rasterises
   identically to 2 at 16px, so 2 units is both the floor and the answer.
3. The caret and the cursor are divided by a 2-unit gap, not a hairline. 1 unit
   closes up under antialiasing at 16px; 2 units is two plate-dark pixels
   between two bright masses and it holds. The sibling rule that parts must
   TOUCH was derived for flat mosaics, where a gap is the only failure mode;
   here the two elements are separate tokens on a command line and the gap is
   the meaning, so it is sized to survive instead of being removed.
4. Zero opacity anywhere. A faded element degrades into a ghost at small sizes
   and silently changes what the mark means. See the late candidate above.

COMPOSITION
-----------
The combined ink box is x 2..14, y 4..12 in 16ths - 12 x 8 units - so its centre
is exactly (8, 8), the canvas centre. The caret and the cursor share the y=8
axis, which is the optical baseline they read off.

Measured mass centroid: (7.88, 7.99). The 0.12-unit bias to the left is the
residual of a light stroke balanced against a solid block. Of every whole-unit
arrangement that fills x 2..14 it is the smallest bias available, and closing it
completely would push the caret past the 2-unit margin.

The caret's ARM LENGTH was the one genuinely contested number, and it is a
three-way trade between three measured quantities. What makes a caret read as an
angle rather than a wedge is the dark notch between its arms, and the notch's
depth is set by the arm's HORIZONTAL reach only - steepening the arms lengthens
the chevron without deepening the notch at all (measured: dy 3, 4 and 5 all give
a 2px notch, and dy 5 also brings back 4 washed-out pixels). Deepening it
therefore means widening the caret, which means narrowing the cursor:

    arm 3, cursor 5x4   notch 2px   chevron  8px   centroid 7.88   <- shipped
    arm 4, cursor 4x4   notch 3px   chevron 10px   centroid 7.53
    arm 4, cursor 4x6   notch 3px   chevron 10px   centroid 8.25

arm 3 ships because the 16px favicon is not where this mark is read. At 16px its
job is to be a distinct two-element signature, and it is: 22 fully-opaque caret
pixels, 20 fully-opaque cursor pixels, a 2px gap, nothing washed out. The
semantic read happens at 32px and up, where the chevron is unambiguous (72 solid
pixels at 32px), and at the 46-52px sizes the site actually uses. arm 3 is also
the only option that keeps the candidate's proportion - a cursor at least as wide
as the caret and about half its height - and it has the best balance of the
three. A naive viewer cannot name the shape at 16px; that is true of every
favicon and is not worth buying with the cursor.

For the record, the candidate as drawn was NOT off-centre to the right and was
NOT top-heavy, however much it looks that way. Measured on its 48-unit field the
ink box is x 9.70..37.00, y 14.70..33.30: vertically centred to the pixel (the
round caps extend symmetrically up AND down), and 0.65 units LEFT of centre
horizontally. What reads as imbalance is mass rather than geometry - the solid
block outweighs the thin stroke - and that is what the layout above corrects.

Construction language is inherited from the shipped sibling icons (AgentLens,
Voxera, CodeGraph): 1024 canvas, hard angles, no gradients, and the same
palette, so the four product marks sit together.

Paper is no longer used in the icon - the mark is two colours on the plate. That
is a deliberate simplification, not an oversight; paper's remaining job is the
wordmark type, which is the one place in this palette that has to be READ.
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
PAPER = "#E7EDF5"  # cool off-white - wordmark type ONLY; absent from the icon
BRAND = "#F97316"  # orange - the cursor block (2.7:1 on paper: mass, never detail)
TEAL = "#14B8A6"  # teal - the prompt caret

# --- geometry, expressed in 16ths so the grid contract is visible ------------
# The ink box is the contract: x INK_X0..INK_X1, y centred on CENTRE with height
# CARET_H. Everything else is derived from it, so changing the stroke weight
# cannot silently move the margins.
U = 64  # one 16px-pixel = 64 canvas units
CENTRE = 8  # the canvas axis both elements sit on
INK_X0, INK_X1 = 2, 14  # 12.5% margin either side; 128..896 in canvas units

SW = 2  # caret stroke weight - the floor; see rule 2 in the header
CARET_H = 8  # caret ink height, cap to cap
ARM = (CARET_H - SW) / 2  # 45-degree arms, so arm length == half the ink height
APEX_X = INK_X0 + ARM + SW / 2  # places the caret's LEFT ink edge exactly on INK_X0
TAIL_X = APEX_X - ARM

CUR_W, CUR_H = 5, 4  # cursor block: landscape, as on a terminal line
CUR_X = INK_X1 - CUR_W  # flush with the right ink edge
CUR_Y = CENTRE - CUR_H / 2  # centred on the shared axis
GAP = CUR_X - (APEX_X + SW / 2)  # measured, not asserted; rule 3 wants >= 2

# Ink bounds in canvas units. The glyph is landscape (12 x 8), so x and y bounds
# differ - the wordmark scales on the y span and places on both.
GLYPH_X0, GLYPH_X1 = INK_X0 * U, INK_X1 * U
GLYPH_Y0, GLYPH_Y1 = (CENTRE - CARET_H / 2) * U, (CENTRE + CARET_H / 2) * U
GLYPH_W, GLYPH_SPAN = GLYPH_X1 - GLYPH_X0, GLYPH_Y1 - GLYPH_Y0


def mark_body(caret: str, cursor: str, indent: str = "  ") -> str:
    """The prompt caret, then the cursor block, on one shared axis."""
    return (
        f'{indent}<path d="M{TAIL_X * U:g} {(CENTRE - ARM) * U:g}'
        f" L{APEX_X * U:g} {CENTRE * U:g}"
        f' L{TAIL_X * U:g} {(CENTRE + ARM) * U:g}"'
        f' fill="none" stroke="{caret}" stroke-width="{SW * U:g}"'
        f' stroke-linecap="round" stroke-linejoin="round"/>\n'
        f'{indent}<rect x="{CUR_X * U:g}" y="{CUR_Y * U:g}"'
        f' width="{CUR_W * U:g}" height="{CUR_H * U:g}" fill="{cursor}"/>'
    )


PLATE_R = 204.8  # 20% of 1024 - the same corner radius as the Voxera app icon


def write_logo() -> None:
    """Plated primary. Self-contained, so it holds on light, dark and coloured
    grounds with no media query and no <picture>. The PNG ladder comes from this.
    The glyph is NOT scaled: its bounds are already 128..896 across, which leaves
    a 2-unit (12.5%) margin either side. It is landscape, so the vertical margin
    is larger - a command line is a horizontal object and the mark is allowed to
    say so."""
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="pt-tools">
  <title>pt-tools</title>
  <!-- Generated by build.py. Do not hand-edit. -->
  <rect x="0" y="0" width="1024" height="1024" rx="{PLATE_R}" ry="{PLATE_R}" fill="{INK}"/>
{mark_body(TEAL, BRAND)}
</svg>
"""
    (HERE / "logo.svg").write_text(svg)


def write_mono() -> None:
    """Plate-less, single-colour, currentColor so an inlined copy inherits the
    host theme. This is the real test of the geometry, and this mark passes it for
    a structural reason: its identity is carried by two shapes of DIFFERENT
    CHARACTER - an open stroked angle and a closed filled rectangle - so one
    colour cannot collapse them into each other. Several rejected candidates
    lived on colour separation between two shapes of the same character and
    became unreadable here."""
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" role="img" aria-label="pt-tools">
  <title>pt-tools</title>
  <!-- Generated by build.py. Do not hand-edit. Inherits colour from the host. -->
{mark_body("currentColor", "currentColor")}
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
TYPE_GAP = 64  # mark-to-type gap; distinct from GAP, the caret-to-cursor gap
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

    # The glyph is landscape, so it is scaled on its HEIGHT (keeping the
    # documented mark-height-to-cap-height ratio) and its width follows.
    gs = GLYPH_H / GLYPH_SPAN
    glyph_w = GLYPH_W * gs
    tx = PAD_L - GLYPH_X0 * gs
    ty = (SLAB_H - GLYPH_H) / 2 - GLYPH_Y0 * gs

    text_x = PAD_L + glyph_w + TYPE_GAP
    slab_w = round(text_x + text_w + PAD_R)

    joined = "\n      ".join(paths)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{slab_w}" height="{SLAB_H}" viewBox="0 0 {slab_w} {SLAB_H}" role="img" aria-label="pt-tools">
  <title>pt-tools</title>
  <!-- Generated by build.py. Do not hand-edit. Type is converted outlines, never a text element. -->
  <rect x="0" y="0" width="{slab_w}" height="{SLAB_H}" rx="{SLAB_R}" ry="{SLAB_R}" fill="{INK}"/>
  <g transform="translate({tx:.3f} {ty:.3f}) scale({gs:.6f})">
{mark_body(TEAL, BRAND, indent="    ")}
  </g>
  <g fill="{PAPER}" transform="translate({text_x:.2f} {baseline:.2f}) scale({scale:.6f} -{scale:.6f})">
      {joined}
  </g>
</svg>
"""
    (HERE / "wordmark.svg").write_text(svg)
    print(
        f"wordmark.svg  {slab_w}x{SLAB_H}  mark {glyph_w:.1f}x{GLYPH_H}  "
        f"type {size:.1f}px  cap {TYPE_CAP}"
    )


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
    assert GLYPH_X0 == 128 and GLYPH_X1 == 896, "12.5% horizontal margin broken"
    assert GLYPH_Y0 + GLYPH_Y1 == 1024, "glyph not vertically centred"
    assert GAP >= 2, f"caret-to-cursor gap {GAP} closes up at 16px (rule 3)"
    print(f"glyph ink  x {GLYPH_X0:g}..{GLYPH_X1:g}  y {GLYPH_Y0:g}..{GLYPH_Y1:g}  gap {GAP:g}u")
    write_logo()
    write_mono()
    write_wordmark()
    write_pngs()
    subprocess.run(["ls", "-l", str(HERE)], check=False)


if __name__ == "__main__":
    main()
