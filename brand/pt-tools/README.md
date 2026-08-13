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

Read it top to bottom:

| Element | Colour | Means |
| --- | --- | --- |
| Three feeds | paper | RSS feeds from multiple trackers |
| Converging funnel | paper | they gather into one pipeline |
| Solid block | orange | the filter/rule engine |
| Single trunk out | teal | one dispatch to the downloader |

That is the tool's actual data path, not decoration. It is deliberately **not** a
download arrow — pt-tools routes and filters, it is not a downloader.

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
| Paper | `#E7EDF5` | Feeds, funnel, wordmark type |
| Brand orange | `#F97316` | The filter engine, and nothing else |
| Teal | `#14B8A6` | The dispatch |

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

## Do not

- **Do not recolour** outside the four values above. In particular, do not swap
  the orange and teal roles; the orange block is the filter engine and the teal
  trunk is the output.
- **Do not use opacity** to add depth or hierarchy. A faded element degrades into
  a ghost at 16 px and changes what the mark says. Hierarchy here comes from
  mass, length and position only.
- **Do not stretch.** Scale uniformly. The mark is square; the wordmark is
  1149 × 320 and holds that ratio.
- **Do not add effects** — no drop shadows, glows, gradients, bevels, strokes or
  outlines.
- **Do not rebuild the feeds thicker.** The gaps between the three feeds are
  wider than the feeds themselves on purpose; that ratio is what makes them read
  as three separate streams rather than one notched slab.
- **Do not set the wordmark with a live font.** Use `wordmark.svg`, whose type is
  already outlines. Re-typing "pt-tools" in a `<text>` element makes it render
  differently on every machine.
- **Do not rotate or reflect.** The flow reads top-to-bottom.
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

## Licence

These assets are part of the pt-tools project and carry the same licence
(MIT) unless stated otherwise.
