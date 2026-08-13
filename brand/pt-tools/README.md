# pt-tools — brand assets

> 中文版本：[README.zh.md](./README.zh.md)

The pt-tools identity: a primary mark, a single-colour variant, a horizontal
lockup, and a favicon/app icon ladder.

Everything here is generated from `build.py` by one parametric definition of the
mark, so the vector sources and the rasters cannot drift apart. To change the
mark, edit the parameters and re-run:

```sh
uv run --with fonttools --with cairosvg --with pillow python3 build.py
```

Do not hand-edit the generated SVGs — the next build overwrites them.

## What the mark means

<!-- This section describes the semantics of the CURRENT mark only. If the mark
     changes shape, replace this section and nothing else. -->

A shell prompt caret, and the cursor block waiting after it:

| Element | Colour | Means |
| --- | --- | --- |
| The caret | teal | a prompt — the tool is waiting for you |
| The block after it | orange | the cursor, where your command goes |
| Both on one axis, a gap between | — | two tokens on a command line, not one glued shape |

**pt-tools is a Go command-line tool, and the mark says only that.** It is the
two things you actually see on a terminal line before you have typed anything.
Of 69 drawn candidates it is the only one whose naive reading matched its intent:
shown it cold, viewers name it as a terminal or CLI icon.

It is deliberately **not** a chart, and deliberately **not** a download arrow.
An earlier direction rose left to right and everyone read it as a bar chart;
pt-tools reports numbers but it is not a dashboard, and it routes and filters but
it is not a downloader.

### Why it is a caret and not something cleverer

Sixty-eight alternatives were drawn and measured first. Three findings are worth
keeping, because they will otherwise be rediscovered:

- **Flat block mosaics (24 drawn) all got named as something else** — staircase,
  bar chart, fork, fence. They also hit a hard contradiction: a filled grid needs
  visible cell separation to read as a grid, but same-coloured adjacent cells
  fuse into one mass while a gap between them fills in with antialiasing at 16 px.
- **Node-on-ring variants (12 drawn) read as atoms**, and the three-node version
  collided with the sibling CodeGraph mark, which is literally a three-node graph.
- **The letterform `pt` cannot be made to work at icon size.** Inside a 48-unit
  box the p's bowl and the t's crossbar collide, and opening them far enough to
  separate leaves both strokes too thin to survive a favicon.

One late candidate carried its meaning in an opacity-faded return segment. At
16 px the faded segment measured as simply gone — which is why the no-opacity
rule below is not a stylistic preference.

## Files

| File | Use it for |
| --- | --- |
| `logo.svg` | The primary mark. Plated, so it works on any background with no theme handling. Start here unless you have a reason not to. |
| `logo-mono.svg` | Single colour via `currentColor`. Inline it in HTML/Markdown and it inherits the surrounding text colour — light on dark, dark on light, automatically. Use where the plate would be wrong. |
| `wordmark.svg` | Mark + name lockup, 1241 × 320. README headers, docs banners, slide titles. Type is converted outlines, so it renders identically on machines with no fonts installed. |
| `icon-512.png` | GitHub repo social preview, Docker Hub avatar, app icon source, README header image. |
| `icon-256.png` | Desktop app icon, package registry avatar. |
| `icon-128.png` | Docs sidebar, medium UI. |
| `icon-64.png` | Small UI, list rows. |
| `icon-32.png` | Standard favicon. |
| `icon-16.png` | Browser tab favicon, tightest legible size. |

All PNGs are RGBA with real transparency, rendered natively at each size from
`logo.svg` rather than downscaled from the largest, so each one is sharp at its
own pixel budget.

`build.py` also writes `fonts.conf`. That file exists because cairo inherits LCD
subpixel antialiasing from the host's fontconfig, which bakes coloured fringes
into a raster and makes the output depend on whose machine built it. Greyscale
antialiasing is forced before cairo loads, so the ladder is reproducible
anywhere. Verified by rendering `logo.svg` under both `rgba=none` and `rgba=rgb`
and diffing: the outputs are byte-identical at every size.

### Suggested mapping

| Destination | File |
| --- | --- |
| GitHub social preview (1280 × 640 canvas) | `icon-512.png`, centred |
| GitHub README header | `wordmark.svg` |
| Favicon | `logo.svg`, with `icon-32.png` / `icon-16.png` as fallbacks |
| Docker Hub / registry avatar | `icon-512.png` |
| Desktop app icon | `icon-512.png` → platform icon tooling |
| Inline in prose, badges, terminal docs | `logo-mono.svg` |

## Colour

Four values. Nothing else belongs in the mark.

| Name | Hex | Role |
| --- | --- | --- |
| Ink | `#0B1220` | Plate, wordmark slab |
| Paper | `#E7EDF5` | Wordmark type — and nothing in the icon |
| Brand orange | `#F97316` | The cursor block, and nothing else |
| Teal | `#14B8A6` | The prompt caret |

**Paper no longer appears in the icon.** The mark is two colours on the plate,
not three. That is a deliberate simplification rather than an oversight: the
caret and the cursor are the only two elements, so a third hue would have to be
invented a job. Paper's remaining role is the wordmark type, which is the one
place in this palette that has to be *read* rather than seen.

**Orange measures 2.7:1 on paper.** It fails text contrast, so it is restricted
to graphic mass — never body text, never a thin line, never a detail that has to
be read. Ink on paper is the only pairing in this set that clears text contrast,
which is why the wordmark sets paper type on an ink slab instead of ink type on
transparency: the slab keeps the lockup inside the palette and readable on every
background, including dark ones where bare ink type would vanish.

## Clear space

Minimum padding on all four sides is **25% of the mark's height**. Nothing —
text, rules, other logos, container edges — enters that band.

`logo.svg` already carries its own margin inside the plate (12.5% of the canvas),
so the 25% rule is measured from the plate edge, not the glyph.

## Minimum size

| Asset | Minimum |
| --- | --- |
| `logo.svg` / `logo-mono.svg` | 16 px |
| `wordmark.svg` | 96 px wide (below this the type closes up) |

The mark is built on a 64-unit grid inside a 1024 canvas. 1024 ÷ 64 = 16, so at
a 16 px favicon every *orthogonal* edge lands on a whole pixel — the cursor block
rasterises to exactly 5 × 4 whole pixels. **The grid must be respected**: moving
an edge off a 64-unit multiple reintroduces sub-pixel blur at small sizes.

The caret is a 45° stroke with round caps, so unlike the previous mark it *is*
antialiased by construction. That is the price of the diagonal and it is paid
knowingly; the old "zero antialiased pixels" property does not survive a stroked
design, so it has been retired rather than quietly restated.

Measured on `icon-16.png`, not asserted: **22 fully-opaque caret pixels and 20
fully-opaque cursor pixels, with zero washed-out pixels and a clean 2 px gap
between them.** The stroke weight was chosen on this evidence — at 1.5 units the
caret degrades to 8 opaque and 12 washed-out pixels, a grey smear rather than a
caret, and at 2.5 units the 16 px raster is identical to 2, so 2 units is both the
floor and the answer. For reference, the candidate sketch this mark came from used
a stroke of 2.6 in a 48-unit box, which works out to 0.87 px at a 16 px favicon
and would not have survived.

Honest limit: at 16 px a viewer shown the icon cold will see a teal wedge and an
orange block rather than name a `>` — true of essentially every favicon. The
mark's job at that size is a distinct two-element signature, which it does. The
semantic read starts at 32 px, where the chevron measures 72 solid pixels and is
unambiguous.

## Do not

- **Do not recolour** outside the values above. In particular, keep orange on the
  cursor: orange is graphic mass here, never a detail that has to be read, and a
  2.7:1 hue cannot carry the caret.
- **Do not thin the caret below 2 units** (2 px at a 16 px favicon). This is the
  single measurement the mark's legibility rests on; see Minimum size.
- **Do not use opacity** to add depth or hierarchy. A faded element degrades into
  a ghost at 16 px and changes what the mark says. A late candidate was rejected
  for exactly this. Hierarchy here comes from mass and position only.
- **Do not close the gap between the caret and the cursor.** It is 2 units, and it
  is the meaning — they are two separate tokens on a command line. At 1 unit the
  gap fills in with antialiasing at 16 px and the two elements read as one shape.
  Note that this inverts the sibling rule that parts must *touch*: that rule was
  derived for flat mosaics, where a gap is the only failure mode.
- **Do not widen the cursor past 5 units.** It is flush with the right ink edge, so
  widening it eats the gap. Narrowing it to buy a longer caret was measured and
  rejected — it inverts the mark's proportion and worsens its balance.
- **Do not stretch.** Scale uniformly. The mark is square; the wordmark is
  1241 × 320 and holds that ratio.
- **Do not add effects** — no drop shadows, glows, gradients, bevels or outlines.
  The caret's stroke is geometry, not an effect; nothing else gets one.
- **Do not square the caret's caps.** Round caps and a round join are what make it
  read as a typed glyph rather than as an arrowhead or a chevron cut from plate.
- **Do not set the wordmark with a live font.** Use `wordmark.svg`, whose type is
  already outlines. Re-typing "pt-tools" in a `<text>` element makes it render
  differently on every machine.
- **Do not rotate or reflect.** The caret points right, the way a prompt does.
- **Do not put `logo-mono.svg` on a mid-tone background** without checking
  contrast — it is one colour, so it has no built-in separation from its ground.

## Naming

The product is **`pt-tools`** — lowercase, hyphenated. That is the package name.
Not "PT-Tools", not "PT Tools", not "pttools".

## Family

pt-tools is one of four product marks sharing a construction language: a 1024
canvas, hard angles, no gradients, no opacity, and this palette. The siblings are
AgentLens (faceted hexagon), Voxera (split chevron), and CodeGraph (three-node
graph). Keep new assets inside that language so the set stays coherent.

The shared rule is **a small number of large masses, and no interior fussiness** —
two elements here, three in each sibling. Adding a third element to pt-tools, or
introducing an interior detail that a single colour would erase, breaks both the
family resemblance and the 16 px floor at once.

One deliberate divergence: the siblings divide their masses by a colour boundary
with the parts touching, whereas pt-tools has a real 2-unit gap. That rule was
derived for flat mosaics, where a gap is the only failure mode. Here the gap
carries meaning — two tokens on a command line — so it is sized to survive
antialiasing instead of being removed. Everything else about the language holds,
including the constraint the gap rule was protecting: **no interior negative space
that a single colour erases**, which is why `logo-mono.svg` still works.

## Licence

These assets are part of the pt-tools project and carry the same licence
(MIT) unless stated otherwise.
