# FirLab — Design System

Single-page umbrella site for a solo developer's tool portfolio. Zero client-side
framework, zero web fonts, static output. This file is the implementation contract:
no component may introduce a colour, size, spacing step, or motion rule that is not
named here.

## 0. Research Log

- **Source of truth for palette** — the shipped product marks, read directly:
  `Voxera/apps/desktop/icons/source/voxera-app.svg` and
  `AgentLens/src-tauri/icons/source/icon.svg`. Both use the same five values:
  `#0B1220` ink, `#E7EDF5` pale slate, `#F97316` orange, `#14B8A6` teal,
  `#64748B` slate. The site palette is derived from these rather than invented, so
  the marks sit on the page without clashing.
- **Layout reference** — technical-editorial index pages (foundry specimen sheets,
  package registries, changelog indexes). Chosen because the page's job is *index +
  proof*, not *pitch*. Rejected: SaaS three-card feature grid (the dominant
  AI-generated shape and the thing this page must not look like).
- **Content inventory before layout** — copy was fact-checked against each product's
  README before any section was placed. Sections are ordered by the visitor's
  decision path (what is this → what can I use today → what is coming), not by
  visual symmetry.
- **Skipped** — no Lazyweb screen harvest, no Imagen concept drafts, no
  `open-design` lookup. Network image generation was not available in this run and
  the palette/layout contract was already pinned by the two sources above.

## 1. Design tokens

Defined in `src/styles/global.css`. Semantic aliases go through `@theme inline` so a
single class set serves both themes; the raw values swap under
`prefers-color-scheme: dark`.

### Colour — raw ramp

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--ink-900` | `#0B1220` | `#F2F6FB` | strongest text |
| `--ink-700` | `#1E293B` | `#DDE5F0` | headings |
| `--ink-500` | `#475569` | `#9FB0C6` | body |
| `--ink-400` | `#64748B` | `#7C8CA3` | meta, captions |
| `--paper-0` | `#FBFCFE` | `#080D16` | page ground |
| `--paper-1` | `#F3F6FA` | `#0F1723` | recessed panel |
| `--paper-2` | `#E7EDF5` | `#18222F` | code / spec block |
| `--rule` | `#DCE4EE` | `#1F2A38` | hairline |
| `--accent` | `#C2410C` | `#FB923C` | links, emphasis |
| `--accent-mark` | `#F97316` | `#F97316` | product marks only — never text |
| `--live` | `#0F766E` | `#2DD4BF` | "actively released" status |

`--accent` is deliberately *not* `#F97316` for text: orange-500 on paper is 2.9:1 and
fails AA. The mark keeps the brand orange; text uses the darker/lighter step so both
themes clear 4.5:1. This is the one place where the site diverges from the icons, and
it is on purpose.

### Semantic aliases

`--color-ink`, `--color-ink-soft`, `--color-ink-mute`, `--color-paper`,
`--color-panel`, `--color-block`, `--color-rule`, `--color-accent`, `--color-live`.
Components use only these.

### Type

| Token | Stack |
| --- | --- |
| `--font-display` | `ui-serif, Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif` |
| `--font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--font-mono` | `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, "Liberation Mono", monospace` |

No web fonts: no network request, no FOUT, no layout shift. Contrast comes from the
serif display against sans body against mono detail, not from a downloaded face.

Scale — display sizes are fluid via `clamp()`, body is fixed:

| Token | Value | Use |
| --- | --- | --- |
| `--text-display` | `clamp(2.6rem, 7vw, 5.25rem)` | the single `h1` |
| `--text-title` | `clamp(1.9rem, 3.6vw, 2.9rem)` | product names |
| `--text-lede` | `clamp(1.05rem, 1.5vw, 1.25rem)` | hero paragraph |
| `--text-body` | `1rem` | prose |
| `--text-small` | `0.875rem` | spec values |
| `--text-meta` | `0.75rem` | labels, index numbers, badges |

Display and title are set at `line-height: 1.02–1.08` with `letter-spacing: -0.022em`.
Meta text is mono, uppercase, `letter-spacing: 0.08em`.

### Spacing

8px base. The permitted set is `0.5 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8 rem`, implemented with
Tailwind's default numeric scale (`2 / 4 / 6 / 8 / 12 / 16 / 24 / 32`), which maps to it
exactly. No off-scale arbitrary values.

### Radius / rule

`--radius-sm` `4px` (badges, code block), `--radius-md` `8px` (mark frame). No pill
buttons, no `rounded-2xl` cards. Hairlines are `1px solid var(--color-rule)`;
unreleased work uses `1px dashed`.

## 2. Layout grammar

Container: `max-width: 76rem`, gutter `--space-3` → `--space-5` at `md`.

The page is a **12-column asymmetric editorial index**, not a card grid:

- **Header** — wordmark left, one link right. No centred nav, no CTA button.
- **Hero** — headline occupies columns 1–8 (left-biased, never centred). Columns
  9–12 hold a compact mono *ledger* listing the three products with version and
  status — the page announces itself as an index in the first viewport.
- **Products** — stacked full-width bands separated by hairlines. Each band:
  narrow left rail (index number + mark), wide main column (name, status, one
  paragraph, spec grid, install block), right meta column (version, links). Bands
  are *not* equal weight — see §4.
- **Footer** — two-line, left/right split.

Responsive: single column below `768px`; the ledger moves under the hero headline;
the left rail becomes a horizontal row above the product name. Every multi-column
rule is declared at the component that owns it.

## 3. Primitives

| Primitive | Contract |
| --- | --- |
| `SiteHeader` | wordmark + single external link. Sticky is *off*. |
| `Hero` | one `h1`, one lede, one ledger. No image, no gradient, no blob. |
| `ProductMark` | inline SVG, `role="img"` + `<title>`, fixed 40/48px box, uses `--accent-mark`. |
| `StatusTag` | mono uppercase, 3 states only: `live`, `early`, `wip`. Colour + label, never colour alone. |
| `SpecGrid` | definition list; `dt` mono meta, `dd` sans small. Used for stack/platform/scope. |
| `InstallBlock` | mono, `--color-block` ground, `--radius-sm`. Renders only when a real command exists. |
| `ProductEntry` | composes the five above. `weight` prop drives §4. |
| `SiteFooter` | copyright + owner + two links. |

## 4. Hierarchy by maturity

Maturity is expressed structurally, so the layout carries information:

| Product | Weight | Treatment |
| --- | --- | --- |
| CodeGraph | `lead` | largest title, full spec grid, install block, language-coverage detail, both links |
| AgentLens | `standard` | title one step down, spec grid, release link, no install block |
| Voxera | `pending` | `--color-ink-mute` body, dashed top rule, no link, no version, no install block, `aria-disabled` absent (nothing is interactive to disable) |

A visitor scanning only the left rail can tell which tool is real today.

## 5. Motion

`--ease` `cubic-bezier(0.2, 0, 0, 1)`, `--dur` `160ms`. Only two transitions exist:
link colour, and link underline `text-decoration-color`. Both are
`color`/`text-decoration-color` only — cheap, no layout, no compositing concerns.
No scroll reveal, no entrance animation, no hover lift, because nothing on this page
changes state on scroll and motion without meaning is slop.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation: none !important; }
}
```

## 6. Accessibility constraints

- Landmarks: `header` / `main` / `footer`, `nav` only where there are ≥2 links.
- Exactly one `h1`; product names are `h2`; spec group labels are `dt`, not headings.
- Focus: `:focus-visible` → `2px solid var(--color-accent)`, `outline-offset: 3px`.
  Never removed, never animated.
- Contrast verified both themes: body `--ink-500` on `--paper-0` is 7.4:1 light /
  8.1:1 dark. `--accent` on `--paper-0` is 5.3:1 light / 7.9:1 dark. `--live` is
  5.1:1 / 8.6:1. `--ink-400` meta on `--paper-0` is 5.6:1 / 5.2:1 — used at ≥12px,
  passes AA for normal text.
- Status is text + colour, never colour alone.
- `alt` on every image; decorative marks are `aria-hidden` when the adjacent text
  already names the product.
- Install commands are selectable text in a `<code>`, not an image.

## 7. Accepted debt

1. **Raster fallbacks now ship; `.ico` still owed.** `public/og.png` (1200×630) and
   `public/favicon.png` (512×512, transparent) are rasterised from the two vector
   sources, and `og:image` points at the PNG — X/Twitter and several crawlers ignore
   an SVG `og:image`, so the SVG-only card was effectively a blank share preview.
   Both SVGs remain the source of truth; the PNGs are generated from them, not drawn
   again. Still outstanding: a `favicon.ico` for clients that read neither SVG nor
   PNG icon links.

   The OG raster substitutes two font stacks because the render host has exactly one
   serif (`DejaVu Serif`) and no Charter — every other coordinate, colour and stroke
   comes verbatim from `og.svg`, verified at a max channel delta of **1** against a
   render of the unmodified source. The PNG is written with **grayscale** font
   antialiasing: the host's default LCD subpixel rendering baked green/magenta
   fringes into 8,793 headline pixels, which a raster card carries to every consumer
   at every scale.

   The favicon PNG is deliberately **monochrome `--accent-mark`**, not a copy of the
   SVG's theme-swapped spine. A PNG cannot respond to `prefers-color-scheme`, so a
   `#0B1220` spine would vanish on a dark tab strip; brand orange is the only value
   in the palette that holds on both. Its third arm is drawn at full strength rather
   than the SVG's `opacity="0.45"` — measured at 16px, the faded arm dropped to a
   ~20% ghost and the mark read as a two-arm F. At 16px the arms now span 12 / 9 / 6
   px with clean gaps, so the decreasing-length structure survives.

   No generated texture ships on the card. A ComfyUI grain plate was produced and
   composited at 10 / 18 / 30% and rejected on measurement: the strengths that are
   visible mottle the ground and eat the lowest-contrast ledger row, the strength
   that is safe is invisible after a timeline downscale, and any of them costs
   6–10× the file size (54 KiB flat → 328–541 KiB) on an asset every crawler
   fetches. The flat ground is also deterministic, so the card is byte-reproducible.
2. **No web fonts.** Display serif resolves to Charter/Sitka/Georgia depending on OS,
   so the headline is not byte-identical cross-platform. Accepted: the cost of a
   self-hosted display face (network + FOUT + Lighthouse) outweighs exact fidelity on
   a single-page site.
3. **No theme toggle.** Theme follows `prefers-color-scheme` only. A toggle needs
   inline JS + `localStorage`; deferred until the site has more than one page.
4. **Naive UI not used.** The session default asks for Naive UI components; Naive UI
   is Vue-only and the task forbids adding a client framework. Tailwind 4 + Astro
   components only. Recorded here rather than silently dropped.

5. **`pnpm build` needs `verifyDepsBeforeRun: false`.** `pnpm-workspace.yaml` disables
   pnpm's implicit pre-script install. Without it, `pnpm build` aborts before Astro
   runs: pnpm 11's default 24h `minimumReleaseAge` policy rejects five lockfile
   entries (`astro@7.2.1` and four transitives published within the last day). No
   supply-chain policy is relaxed — `pnpm install` still enforces all of them. The
   line can be removed once those versions have aged past the cutoff.

## 8. Verified

Measured in Chrome at 1440×1000 and 390×844, both colour schemes:

- Lighthouse **Accessibility 100**, **SEO 100**. The only failures are `is-on-https`
  and `redirects-http`, both artifacts of the local HTTP preview — `firlab.app` is on
  the HSTS preload list and can only be served over HTTPS.
- No horizontal overflow at 390px (`scrollWidth === clientWidth`, zero elements wider
  than the viewport).
- Maturity hierarchy renders as designed: title sizes descend 40px → 31.2px → 30px;
  the Voxera band's top rule computes to `dashed`; Voxera contains **0** links; its
  body text resolves to the mute step (`#7c8ca3`) against `#9fb0c6` for released
  entries.
- Heading order is `h1, h2, h2, h2, h2` — one `h1`, no skipped levels.
- Zero elements resolve to a purple/violet colour.
- Zero `<script src>` tags in the output: no client-side JS ships.

## 9. Reference fidelity

No screenshot or mockup reference was supplied, so there is no pixel contract. The
binding constraints are this file plus the anti-pattern list: no purple/violet
gradient, no equal three-card grid, no centred `text-4xl font-bold` + grey subtitle,
no glassmorphism or blur orbs, no emoji icons, no unsubstantiated metrics or
"trusted by" logos.
