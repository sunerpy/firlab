# pt-tools — brand assets

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

Three columns, rising, sharing one base. Read left to right:

| Element | Colour | Means |
| --- | --- | --- |
| First column | paper | where a tracker starts |
| Second column | teal | another tracker, further along |
| Tallest column | orange | the one you have pushed furthest |
| One shared base, no gaps | — | one view over all of them, not three dashboards |

**Three columns because cross-site aggregation is the tool's most distinctive
job** — one place to see upload, download, ratio, bonus and level across every
tracker you are on. **Rising because those are the figures pt-tools exists to
move.** The rise is 4 → 7 → 12, so the deltas are 3 then 5 and the climb
accelerates rather than stepping evenly; that is a decision, not a default.

It reads secondarily as signal strength, which is also true: pt-tools probes
each site and tells you whether the session is still alive.

It is deliberately **not** a download arrow — pt-tools routes, filters and
reports; it is not a downloader.

### Why the mark is not a funnel

An earlier version was three notched feeds → a converging funnel → an orange
engine block → a teal dispatch stub. The data path was accurate, but asked to
name the shape cold, viewers said *funnel*, then *fork*, then *three-pin plug* —
never "feeds being filtered". Six shapes, and the funnel was a solid mass
directly beneath the feeds, so the gaps between the feeds closed visually and
the top half read as one white lump. It failed on meaning rather than on pixels;
its feeds do measurably survive at 16 px. Eight further concepts were drawn and
measured before this one — a ledger, squared RSS brackets, a merge gate, a
broken loop, a pinwheel, a ring-and-beam, a closed ring, and a node-and-bracket.
Every one of them got named as something unrelated. This is the only mark whose
naive reading matched its intent.

## Files

| File | Use it for |
| --- | --- |
| `logo.svg` | The primary mark. Plated, so it works on any background with no theme handling. Start here unless you have a reason not to. |
| `logo-mono.svg` | Single colour via `currentColor`. Inline it in HTML/Markdown and it inherits the surrounding text colour — light on dark, dark on light, automatically. Use where the plate would be wrong. |
| `wordmark.svg` | Mark + name lockup, 1149 × 320. README headers, docs banners, slide titles. Type is converted outlines, so it renders identically on machines with no fonts installed. |
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
| Paper | `#E7EDF5` | First column, wordmark type |
| Brand orange | `#F97316` | The tallest column, and nothing else |
| Teal | `#14B8A6` | The middle column |

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
a 16 px favicon every edge lands on a whole pixel and the mark stays crisp
instead of blurring. This is why 16 px is a real floor and not an optimistic one
— but it is also why **the grid must be respected**: moving any edge off a
64-unit multiple reintroduces sub-pixel blur at small sizes.

Measured on `icon-16.png`, not asserted: the three columns land as 4 × 4, 4 × 7
and 4 × 12 whole pixels, with **zero antialiased pixels anywhere in the glyph**.
The only partially-transparent pixels in the file are the two that form the
plate's corner radius.

## Do not

- **Do not recolour** outside the four values above. In particular, keep orange
  on the tallest column: the brand accent belongs on the outcome, and orange is
  graphic mass here, never a detail that has to be read.
- **Do not use opacity** to add depth or hierarchy. A faded element degrades into
  a ghost at 16 px and changes what the mark says. Hierarchy here comes from
  mass, length and position only.
- **Do not stretch.** Scale uniformly. The mark is square; the wordmark is
  1149 × 320 and holds that ratio.
- **Do not add effects** — no drop shadows, glows, gradients, bevels, strokes or
  outlines.
- **Do not put gaps between the columns.** They touch, and only a colour edge
  divides them. A gap fills in with antialiasing at small sizes; a colour edge
  between two opaque fills cannot. Two rejected concepts died precisely here, and
  a hole drawn in the plate colour dissolves into the plate for the same reason.
  This is also how the sibling Voxera mark is built.
- **Do not give the columns unequal widths.** 3 / 4 / 5 was tried; it reads as
  inconsistent thickness rather than as rhythm — a mistake rather than a
  decision. The rhythm lives in the heights.
- **Do not shorten the first column below 4 units.** It is the quietest element in
  the mark; it does not also need to be the thinnest.
- **Do not set the wordmark with a live font.** Use `wordmark.svg`, whose type is
  already outlines. Re-typing "pt-tools" in a `<text>` element makes it render
  differently on every machine.
- **Do not rotate or reflect.** The columns rise left to right.
- **Do not put `logo-mono.svg` on a mid-tone background** without checking
  contrast — it is one colour, so it has no built-in separation from its ground.

## Naming

The product is **`pt-tools`** — lowercase, hyphenated. That is the package name.
Not "PT-Tools", not "PT Tools", not "pttools".

## Family

pt-tools is one of four product marks sharing a construction language: a 1024
canvas, flat fills, hard angles, no gradients, no opacity, and this palette. The
siblings are AgentLens (faceted hexagon), Voxera (split chevron), and CodeGraph
(three-node graph). Keep new assets inside that language so the set stays
coherent.

The rule the siblings share, and the one that matters most when editing this
mark: **each of them is a small number of large masses divided by a colour
boundary, never by a gap.** Voxera is two polygons meeting on a shared edge;
AgentLens is one silhouette split into three facets. pt-tools is three flush
columns. Adding a fourth element, or separating the existing three, breaks both
the family resemblance and the 16 px floor at the same time.

## Licence

These assets are part of the pt-tools project and carry the same licence
(MIT) unless stated otherwise.
