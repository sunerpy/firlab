# FirLab — Design System

Bilingual (Chinese-default) umbrella site for a solo developer's tool portfolio.
Zero client-side framework, zero web fonts, static output. This file is the
implementation contract: no component may introduce a colour, size, spacing step,
or motion rule that is not named here.

**Locales.** `zh-cn` owns the bare root (`/`); `en` lives at `/en/`. Chinese is the
primary audience and the apex URL was already indexed, so `prefixDefaultLocale` is
`false` — `/` is never redirected. Both locales render from ONE component
(`HomePage.astro`), which is what keeps them structurally identical: a section
added to Chinese cannot silently go missing from English.

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

No web fonts. This is not only a performance preference now that the site is
Chinese-first — it is a hard constraint: a single CJK weight is 5–15 MB even
subsetted, which would spend the entire LCP budget on one typeface. Contrast comes
from the serif display against sans body against mono detail, not from a
downloaded face.

Each stack is **Latin-first, CJK-tail**. Font fallback is per-glyph, so Latin
characters resolve from Charter / system-ui and hanzi fall through to the CJK face.
The CJK tail is named explicitly rather than left to the `serif` / `sans-serif`
generic, so the pairing is a decision instead of a UA default:

| Token | CJK tail | Rationale |
| --- | --- | --- |
| `--font-display` | `Songti SC`, `Source Han Serif SC`, `Noto Serif CJK SC` | The CJK counterpart of a transitional serif. A CJK *sans* display would break voice mid-line every time a Latin product name appears inside a Chinese heading — and every heading on this site does. |
| `--font-sans` | `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans SC` | Standard modern CJK UI stack, macOS → Windows → Linux order. |
| `--font-mono` | same CJK tail | Chinese inside a mono label has no monospace CJK face worth requiring; the sans tail keeps the glyphs from falling back to a serif mid-label. |

### Script-dependent metrics

Latin-tuned leading and tracking are wrong for hanzi, so the metrics are tokens
switched by `html:lang(zh-CN)`, and every prose/display rule reads the token rather
than a literal. Hanzi are full-height square boxes with no ascender/descender
rhythm to create optical space, so Latin values read cramped; the tight negative
Latin tracking actively jams them together.

| Token | Latin | Chinese | Applies to |
| --- | --- | --- | --- |
| `--lh-prose` | `1.65` | `1.8` | `body`, all running copy |
| `--ls-prose` | `0em` | `0.012em` | ditto |
| `--lh-display` | `1.05` | `1.22` | `.u-display` — at 1.05 two lines of hanzi physically collide |
| `--ls-display` | `-0.021em` | `0.006em` | ditto |
| `--lh-lede` | `1.6` | `1.85` | `.u-lede` |

Four supporting rules, each fixing a specific CJK failure:

- `.u-display-latin` re-tightens known-Latin display text (product names, the
  wordmark) back to Latin metrics, so a Chinese page's opened-up display tokens
  do not loosen `CodeGraph`.
- `code, kbd, samp, pre { letter-spacing: normal }` — inherited CJK tracking
  destroys command-block column alignment and double-spaces already-tracked labels.
- `text-wrap: pretty` on `p, dd, li` — the loose CJK measure produces
  single-*character* orphans often; `pretty` removes them at no cost.
- Chinese display headings omit the trailing `。`: a full-width period at display
  size opens a visible hole at the end of the line. Enforced in the copy, not CSS.
- `.u-lat` adds `0.14em` inline margin for Latin runs where a real space would be
  wrong (beside full-width punctuation). Chinese body copy is otherwise authored
  with real spaces around Latin runs, per the standard CJK convention.

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

- **Header** — a **floating sticky nav** (`FloatingNav`), inset from the top edge
  so it reads as an object on the page rather than a browser chrome strip. It
  replaces the former static `SiteHeader`, which is deleted.
- **Hero** — headline occupies columns 1–8 (left-biased, never centred). Columns
  9–12 hold a compact mono *ledger* listing the three products with version and
  status — the page announces itself as an index in the first viewport.
- **Products** — stacked full-width bands separated by hairlines. Each band:
  narrow left rail (index number + mark), wide main column (name, status, one
  paragraph, spec grid, install block), right meta column (version, links). Bands
  are *not* equal weight — see §4.
- **Footer** — two-line, left/right split.

**The 12-column split activates at `lg` (1024px), not `md`.** This was measured,
not guessed: at 768px the `md` split gave `SpecGrid` a 145px value column — about
nine hanzi per line, running to 8 lines. Moving the breakpoint to `lg` takes that
to 497px / 2 lines. `md` still drives padding and the footer, whose content is
short labels rather than prose.

Responsive: single column below `1024px`; the ledger moves under the hero
headline; the left rail becomes a horizontal row above the product name. Every
multi-column rule is declared at the component that owns it.

### Navigation and footer

The nav reduces by **progressive disclosure**, never by squashing:

| Width | Contents |
| --- | --- |
| under 640px | wordmark + language switch |
| 640px+ | + social icon row |
| 900px+ | + product anchors |

Nothing becomes unreachable at any width: the product anchors are also the hero
ledger, and the socials repeat *with text labels* in the footer. The icon row's
cutoff is measured — it needs 357px of the 332px available at 390px, and only
clears around 430px, so `sm` is the correct threshold.

The footer is three columns: identity · product index · contact. It is where the
social marks get **text labels**, which the icon-only nav depends on (see §3).

## 3. Primitives

| Primitive | Contract |
| --- | --- |
| `FloatingNav` | sticky floating bar. Wordmark · product anchors · socials · language switch. Ground is 92% opaque *on its own* — see §5. |
| `LangSwitch` | both locales always rendered; current one is a non-link with `aria-current`. Target is built from the current page's slug with its locale prefix stripped (`stripLocale` + `getRelativeLocaleUrl`), so `/en/x/` switches to `/x/`, never to the home page. |
| `SocialIcon` | five **authored** geometric marks (github · bilibili · zhihu · x · wechat), one visual language: 24px grid, 1.8px stroke, `currentColor` only. Legible at 20px. NOT vendor logos — see §7. |
| `SocialRow` | the five real destinations, nothing invented (there is no Facebook). External links carry `target="_blank" rel="noopener noreferrer"`. WeChat is a `<details>` disclosure holding the QR, not an anchor. |
| `Principles` | sticky section heading + hanging-numeral list. A distinct layout family from the product bands — deliberately not three cards. |
| `Hero` | one `h1`, one lede, one ledger. Exactly three text elements: eyebrow, headline, lede. No trust strip, no sub-tagline, no CTA pair — the ledger *is* the call to action. No image, no gradient, no blob. |
| `ProductMark` | inline SVG, `role="img"` + `<title>`, fixed 40/48px box, uses `--accent-mark`. |
| `StatusTag` | mono uppercase, 3 states only: `live`, `early`, `wip`. Colour + label, never colour alone. |
| `SpecGrid` | definition list; `dt` mono meta, `dd` sans small. Used for stack/platform/scope. |
| `InstallBlock` | mono, `--color-block` ground, `--radius-sm`. Renders only when a real command exists. |
| `ProductEntry` | composes the five above. `weight` prop drives §4. |
| `SiteFooter` | three columns + a full-width copyright rule. Social marks with text labels, WeChat QR, product index. |

## 4. Hierarchy by maturity

Maturity is expressed structurally, so the layout carries information:

| Product | Weight | Treatment |
| --- | --- | --- |
| CodeGraph | `lead` | largest title, full spec grid, install block, language-coverage detail, both links |
| AgentLens | `standard` | title one step down, spec grid, release link, no install block |
| Voxera | `pending` | `--color-ink-mute` body, dashed top rule, no link, no version, no install block, `aria-disabled` absent (nothing is interactive to disable) |

A visitor scanning only the left rail can tell which tool is real today.

## 5. Motion

`--ease-brand` `cubic-bezier(0.2, 0, 0, 1)`, `160ms` for the two link transitions
(colour, `text-decoration-color`) that were already here.

Two scroll-driven mechanisms were added, both **CSS-only** — no scroll listener, no
`IntersectionObserver`, no `rAF` loop:

| Mechanism | Driver | What it does |
| --- | --- | --- |
| `.u-reveal` | `animation-timeline: view()`, range `entry 8% cover 26%` | Product bands and the principles section fade + rise 1.5rem as they enter. `opacity` and `transform` only. |
| `.u-nav-settle` | `animation-timeline: scroll(root block)`, range `0 6rem` | Deepens the nav ground and brings in its hairline + shadow over the first 6rem of scroll. |

Plus `@view-transition { navigation: auto }` — cross-document, so the product
detail pages land under it with no router.

**Legibility must not depend on motion, and does not.** Both mechanisms sit inside
`@media (prefers-reduced-motion: no-preference)` *and* an `@supports` gate, so an
unsupporting or motion-averse browser gets the final state statically rather than an
unrevealed blank page. Concretely, the nav's readable ground is its own 92% base
colour, not the settle animation — measured worst case (92% paper composited over
the darkest body text that can scroll beneath it):

| Theme | Nav mute text on worst-case ground | Accent on worst-case ground |
| --- | --- | --- |
| Light | **4.80:1** | 5.09:1 |
| Dark | **4.88:1** | 7.39:1 |

Both clear AA with the blur and the animation entirely absent. The `backdrop-filter`
is a pure enhancement.

The `reduce` block neutralises transitions and animations rather than shortening
them; because the scroll-driven rules never apply under `reduce`, nothing is left
mid-animation:

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
- **i18n a11y**: `<html lang>` carries the real BCP 47 tag (`zh-CN`), not the Astro
  locale id (`zh-cn`) — the CSS script metrics key off `:lang(zh-CN)`. The language
  switch is a `role="group"` with `aria-label`; the active locale is
  `aria-current="true"` and each option carries its own `lang` + `hreflang`.
- A skip link precedes the sticky nav; `[id] { scroll-margin-top: 6.5rem }` keeps
  anchor targets from landing underneath it.
- `html`/`body` use `overflow-x: clip`, never `hidden` — `hidden` on the root turns
  the document into a scroll container and silently kills `position: sticky`.
- Every authored social mark has an accessible name; the icon-only nav row relies on
  `aria-label` + `title`, and the footer repeats all five with visible text.
- Measured at 390 / 768 / 1440px, both themes: zero horizontal overflow, zero
  elements wider than the viewport, and no clickable text wrapping to two lines.

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
   inline JS + `localStorage` and a blocking inline script to avoid a wrong-theme
   flash; deferred. The language switch is a real navigation, so it needs neither.
4. **Naive UI not used.** The session default asks for Naive UI components; Naive UI
   is Vue-only and the task forbids adding a client framework. Tailwind 4 + Astro
   components only. Recorded here rather than silently dropped.

5. ~~**`pnpm build` needs `verifyDepsBeforeRun: false`.**~~ **Superseded.** pnpm is
   now pinned to `10.25.0` via `package.json`'s `packageManager`, which predates the
   `minimumReleaseAge` default change and accepts the lockfile with every integrity
   check intact. No policy override remains in the repository. Just run `pnpm build`.

6. **One inline script ships (~40 lines), where the previous build shipped zero.**
   `<details>` already gives the WeChat QR a working, keyboard-accessible
   open/close with scripting off; the script only adds the two behaviours the
   element has no native equivalent for — Escape to dismiss (returning focus to the
   trigger) and click-outside to dismiss. It is inline, so it costs no request, and
   `<script src>` count in the output is still **0**.

7. **The social marks are authored abstractions, not vendor logos.** Five real
   vendor logos arrive in five visual languages and read as a sticker sheet on a
   page built from hairlines. The cost is lower instant recognisability; it is paid
   for twice — every icon has an accessible name, and the footer renders all five
   *with* text labels. Bilibili and WeChat keep their vendors' actual silhouettes
   (antenna'd screen, paired bubbles) since those are already geometric; Zhihu's
   wordmark is not reducible to this grid, so it is drawn as what Zhihu *is* — a
   question inside a discussion bubble.

8. **Product detail pages do not exist yet.** `/codegraph/`, `/agentlens/`,
   `/voxera/` (and `/en/…`) are linked from every product band and from the footer,
   and are owned by a separate task. Until then those links 404.

## 8. Verified

Measured in Chrome 151 at 390 / 768 / 1440px, both colour schemes, both locales,
against the built `dist/` served over HTTP:

- `pnpm check` **0 errors / 0 warnings / 0 hints** (21 files); `pnpm build` exit 0
  from a clean `dist/`, both `/index.html` and `/en/index.html` emitted.
- **Zero occurrences** of the previous owner's real name in `src/`, `public/` or
  `dist/` — it had been rendered 11 times, including inside indexed schema.org data.
- Both locales carry their content in the raw HTML (SSG confirmed, not hydrated).
- `hreflang` emits `zh-CN` · `en` · `x-default` on both pages; each page is
  self-canonical; `og:locale` is `zh_CN` / `en_US` with the other as
  `og:locale:alternate`. The sitemap carries `xhtml:link` alternates for both.
- Voxera's band contains **zero** external links and **zero** version strings in
  both locales, and no `github.com/…voxera…` URL exists anywhere in the output.
- `dist/CNAME` is exactly `firlab.app`; `og.png`, `favicon.png`, `og.svg`,
  `favicon.svg`, `robots.txt` all still emit; `wechat-qr.jpg` ships at 41,647 bytes
  and loads at its native 430×430.
- All four social URLs appear verbatim in both pages. No Facebook, Mastodon,
  LinkedIn or `twitter.com` reference exists.
- No `http://` asset or link URL anywhere — `.app` is HSTS-preloaded, so mixed
  content would be fatal.
- `<script src>` count is **0**.
- No horizontal overflow and zero over-wide elements at 390 / 768 / 1440px; no
  clickable text wraps to two lines.
- Console clean (no errors, warnings or issues) after load and interaction.
- Editorial guide rules land exactly on the text column (measured 145 / 1281 at
  1440px, matching `h1` and the ledger edge).

### Four defects found by measuring, and fixed

1. **`backdrop-filter` was dead in the shipped CSS.** Hand-writing both the
   standard and `-webkit-` properties made Lightning CSS deduplicate the pair down
   to the *prefixed form alone*, and Chrome 151 ignores `-webkit-backdrop-filter`
   entirely — `getComputedStyle().backdropFilter` returned `none`, so nav text was
   bleeding through over scrolled content. Fix: write only the standard property and
   let the build prefix; separately, raise the base ground to 92% so legibility
   never depended on the filter in the first place.
2. **The 12-column split at `md` crushed Chinese spec copy** — 145px value column,
   ~9 hanzi per line, 8 lines. Moved to `lg`; now 497px / 2 lines at 768px.
3. **The guide rules aligned to nothing**, sitting at the container padding box
   (105px) while text started at 145px. Now derived as `71rem` / `100% - 10rem`.
4. **The footer QR popover covered the links above it** in the single-column mobile
   footer. It now expands *in-flow* below `sm` and only overlays where there is room.

## 9. Reference fidelity

No screenshot or mockup reference was supplied, so there is no pixel contract. The
binding constraints are this file plus the anti-pattern list: no purple/violet
gradient, no equal three-card grid, no centred `text-4xl font-bold` + grey subtitle,
no glassmorphism or blur orbs, no emoji icons, no unsubstantiated metrics or
"trusted by" logos.
