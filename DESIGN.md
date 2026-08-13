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

### Theme selection — system is the default, not the only option

Three states, exposed as a segmented control in the nav next to `LangSwitch`:
`system` · `light` · `dark`.

| State | `<html>` | Ramp source |
| --- | --- | --- |
| `system` (default) | no `data-theme` | `prefers-color-scheme` |
| `light` | `data-theme="light"` | base `:root` |
| `dark` | `data-theme="dark"` | dark override |

- **Absence of `data-theme` is load-bearing.** `system` removes the stored key
  rather than storing a third value, so a visitor who never touches the control
  keeps tracking the OS exactly as the site always did. Dropping `system` for a
  two-state toggle would be a regression, not a simplification.
- The dark ramp is written **twice** in `global.css` — once under
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and once
  under `:root[data-theme="dark"]` — because CSS cannot OR a media query with a
  plain selector. They are one ramp: change both or neither.
- `color-scheme` follows the pinned theme (`light` / `dark`), not just
  `light dark`. Left alone, a page pinned light on a dark OS gets dark scrollbars
  and dark form controls.
- `theme-color` is handled by inserting a **media-less** `<meta>` first in `<head>`,
  which outranks the two media-scoped ones already there. Choosing `system` removes
  it and hands the decision back to them.
- Persistence is `localStorage['firlab-theme']`, and it is the only thing the site
  stores. Reads and writes are wrapped in `try/catch` — `localStorage` throws
  outright in a storage-blocked context, and a theme control must not take the page
  down with it. This is a preference, not analytics; the footer's "no analytics, no
  cookies" claim still holds.
- **No flash.** A parser-blocking inline script in `<head>` applies the stored
  theme before the first paint. This is the one legitimate reason to run script in
  `<head>` on this site; it is inline, so `<script src>` stays at zero.
- The control ships `display: none` and is revealed by `html[data-js]`, set by that
  same script — the `.u-copy` rule, applied again: an affordance that cannot work
  must not be drawn.

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

**A product name is a link to that product's page. Everywhere.** Nav, hero index,
band heading — one destination, one rule. The site shipped with those three all
pointing at in-page anchors (`/#codegraph`), so clicking a product name scrolled
the home page to its band and left the reader to keep scrolling through the other
three; the detail page was reachable only from a secondary "详细介绍" link buried
in the band's meta column. The name was the primary affordance pointing at the
wrong destination, and the secondary link taught readers the name was not the way
in. Both are fixed: the name links to the page, the "详细介绍" item is gone.

The distinction the reader now learns:

| Surface | Reads as | Affordance |
| --- | --- | --- |
| a product **name** | a door | link to `/<product>/`, marked with the trailing `→` |
| a product **band** | the summary | read where it stands; no in-site link |
| band **meta column** | outward | external links only (repo, releases) |

The homepage bands stay. They give the index substance and they are the summary
layer between the hero and a full page — but they are now unambiguously content,
not a competing route.

Locale is respected: links are built with `getRelativeLocaleUrl(lang, product.detail)`,
so `/en/` leads to `/en/codegraph/` and never drops the reader onto the Chinese
page. On a detail page the entry for the product being read is **not a link to
itself** — it is `aria-current="page"` with the marked dot, the same treatment the
detail-page footer strip uses.

The nav reduces by **progressive disclosure**, never by squashing:

| Width | Contents |
| --- | --- |
| under 640px | wordmark + theme switch + language switch |
| 640px+ | + social icon row |
| 900px+ | + product links |

Nothing becomes unreachable at any width: the product links are also the hero
index, and the socials repeat *with text labels* in the footer. The icon row's
cutoff is measured — it needs 357px of the 332px available at 390px, and only
clears around 430px, so `sm` is the correct threshold.

The footer is three columns: identity · product index · contact. It is where the
social marks get **text labels**, which the icon-only nav depends on (see §3).

## 3. Primitives

| Primitive | Contract |
| --- | --- |
| `FloatingNav` | sticky floating bar. Wordmark · product anchors · socials · language switch. Ground is 92% opaque *on its own* — see §5. |
| `LangSwitch` | both locales always rendered; current one is a non-link with `aria-current`. Target is built from the current page's slug with its locale prefix stripped (`stripLocale` + `getRelativeLocaleUrl`), so `/en/x/` switches to `/x/`, never to the home page. |
| `ThemeSwitch` | three `<button>`s — `system` · `light` · `dark` — in a `role="group"`, sharing `LangSwitch`'s hairline segmented shape because both answer "which of these am I in". `aria-pressed` is the state; each segment carries its own icon **and** its own visually hidden label, so the icon is never the only name. Buttons rather than `role="radio"`: `aria-pressed` needs no roving-focus implementation to be correct. Ships hidden, revealed by `html[data-js]`. See §1. |
| `SocialIcon` | five marks on one 24px grid, `currentColor` only, legible at 20px. **GitHub is the official vendor mark** — Primer `mark-github-24`, one filled path, unmodified. The other four (bilibili · zhihu · x · wechat) stay authored geometric abstractions at 1.8px stroke — see §7. |
| `SocialRow` | the five real destinations, nothing invented (there is no Facebook). External links carry `target="_blank" rel="noopener noreferrer"`. WeChat is a `<details>` disclosure holding the QR, not an anchor. |
| `Principles` | sticky section heading + hanging-numeral list. A distinct layout family from the product bands — deliberately not three cards. |
| `Hero` | one `h1`, one lede, one ledger. Exactly three text elements: eyebrow, headline, lede. No trust strip, no sub-tagline, no CTA pair — the ledger *is* the call to action. No image, no gradient, no blob. |
| `ProductMark` | inline SVG, `role="img"` + `<title>`, fixed 40/48px box, uses `--accent-mark`. |
| `StatusTag` | mono uppercase, 3 states only: `live`, `early`, `wip`. Colour + label, never colour alone. |
| `SpecGrid` | definition list; `dt` mono meta, `dd` sans small. Used for stack/platform/scope. |
| `InstallBlock` | mono, `--color-block` ground, `--radius-sm`. Renders only when a real command exists. |
| `ProductEntry` | composes the five above. `weight` prop drives §4. |
| `SiteFooter` | **two variants.** `index`: three columns — identity + positioning blurb, product index, contact. `detail`: the blurb and the stacked product list are **dropped**; the wordmark becomes the labelled way back, and the products become a one-line inline jump strip with the current entry marked `aria-current="page"` and not a link. See §4a. |
| `NextProduct` | the page-ending pager. A `<nav>` **outside `<main>`**, so it reads as chrome-level "advance" rather than one more product pitch. Wraps from the last product to the first, and says so when it does. Asks for nothing, so it works unchanged on Voxera, which has nothing to download. |
| `SpecGrid` | hairline-divided rows (`divide-y`), not gap-separated `display: contents` cells. Two reasons: the spec tables are the trust-building content and without a rule per row they read as prose in a smaller size; and `display: contents` children cannot be transformed, so `.u-stagger` had nothing to animate. |

## 4. Hierarchy by maturity

Maturity is expressed structurally, so the layout carries information:

| Product | Weight | Treatment |
| --- | --- | --- |
| pt-tools | `lead` | largest title (`--text-title`), 46px mark, full spec grid, install block, all links |
| CodeGraph | `major` | title one rung down (`--text-title-md`), 42px mark, full spec grid, install block, both links |
| AgentLens | `standard` | `--text-title-sm`, 38px mark, spec grid, release link, no install block |
| Voxera | `pending` | `--color-ink-mute` body, dashed top rule, no link, no version, no install block, `aria-disabled` absent (nothing is interactive to disable) |

A visitor scanning only the left rail can tell which tool is real today.

**The order is by maturity, not by age, and it is load-bearing.** pt-tools leads
because it is the most released thing here — v0.46.0, 136 stars, published Docker
images — so it takes the index's `01` and the largest title. That forced a
**fourth** weight rung (`major` / `--text-title-md`): with four products, dropping
CodeGraph (v0.42.10) onto the same size as AgentLens (v0.0.5) would have thrown
away information the ladder exists to carry. `content.ts`'s array order, each
product's `index`, and each detail page's `eyebrow` are three copies of the same
fact — changing one without the others leaves the site contradicting itself, so
the ordering rule is stated at the top of `content.ts` as well.

## 4a. Page endings and lateral movement

A detail page used to end by re-stating the site's premise and re-listing its
siblings — the footer carried the FirLab positioning blurb and the full product
index on *every* page. Scrolling to the bottom of `/codegraph/` therefore landed the
reader back in home-page-shaped content, and the page lost its own identity at
exactly the moment it should have concluded.

Three distinct jobs, now three distinct components, ordered by how committed the
reader is:

| Position | Component | Job | Voice |
| --- | --- | --- | --- |
| last band in `<main>` | the page's own closing section | conclude the argument; restate the repository / release links as the final action | content |
| after `</main>` | `NextProduct` | one obvious next move, in index order | chrome, display-sized |
| `<footer>` | `SiteFooter variant="detail"` | random access to any sibling, and the way back to the index | chrome, mono, one line |

The blurb appears on the home page only, where the site's premise is the page's own
subject. The social row and the copyright line stay in both variants: the labelled
social row is the accessible-name redundancy the icon-only nav row depends on (§6).

## 5. Motion

`--ease-brand` `cubic-bezier(0.2, 0, 0, 1)`, `160ms` for the two link transitions
(colour, `text-decoration-color`) that were already here.

### Scroll-driven, CSS-only

Four mechanisms, no scroll listener, no `IntersectionObserver`, no `rAF` loop:

| Mechanism | Driver | What it does |
| --- | --- | --- |
| `.u-reveal` | `view()`, range `entry 8% cover 26%` | Section bands fade + rise 1.5rem as they enter. `opacity` and `transform` only. |
| `.u-stagger > *` | `view()`, range offset per `nth-child` | Sequences the rows *within* a band: 6/12/18/24% entry offsets, 5th and later share 28%. Travel is 0.85rem, shorter than `.u-reveal`, because the two compose — 1.5rem inside 1.5rem reads as a slide. |
| `.u-nav-settle` | `scroll(root block)`, range `0 6rem` | Deepens the nav ground, brings in its hairline + shadow over the first 6rem. |
| `.u-progress` | `scroll(root block)`, full document | 2px reading-progress hairline at the top edge, `scaleX(0 → 1)`. |

Scroll-driven animations ignore `animation-delay`, which is why the stagger is built
from per-child `animation-range` offsets rather than delays.

Plus `@view-transition { navigation: auto }` — cross-document, so index → detail
needs no router. Each product's mark and title carry
`view-transition-name: mark-<id>` / `title-<id>` on **both** the index band and the
detail masthead, so the shared element morphs instead of the two documents
cross-fading. Voxera pairs only the mark: its `h1` is a sentence, not the product
name, so pairing the titles would cross-fade two boxes of very different size.

> **Every timeline is assigned through `var(--u-timeline)`, never as a literal.**
> This is not style preference — it is the only form that survives the build.
> Given `animation: X linear both` beside `animation-timeline: view()`, Lightning
> CSS folds the pair into `animation: linear both X view()`, and **Chrome rejects
> that shorthand outright**: measured, `el.style.cssText` comes back empty and
> `getComputedStyle().animationTimeline` reads `auto`. Lightning CSS cannot fold a
> longhand whose value is a `var()`, so the indirection keeps it intact. See §8.

### Transitions and interaction

`--ease-brand` `cubic-bezier(0.2, 0, 0, 1)` throughout; no bounce or elastic easing
anywhere — this is a publication, not a consumer app.

| Helper | Property | Duration | Where |
| --- | --- | --- | --- |
| `a` (base) | `color`, `text-decoration-color` | 160ms | every link |
| `.u-link-draw` | `transform: scaleX()` on `::after` | 220ms | links in an identifier row, where five static underlines would read as a stack of rules |
| `.u-arrow` | `transform: translateX(0.3em)` | 240ms | trailing `→`, advanced by `.u-arrow-host:hover` / `:focus-visible` |
| `.u-pager` | `background-color`; mark `color` | 260ms | the whole page-ending band |
| `.u-copy` | `color`, `border-color`, `background-color`, `transform` | 160 / 120ms | command copy button |

The full transition surface is **six declarations, all on `color`,
`background-color`, `border-color`, `text-decoration-color` or `transform`**. Zero
animate a layout property; there is no `transition: all`. Verified against the built
CSS, not the source.

### Depth

Drawn with a hairline plus one tightly-spread shadow — never a blurred glass panel.
`--shadow-plate` (command blocks, the premise callout) and `--shadow-recess` (the
detail-page footer, so it reads as chrome the content sits on). Both mix from
`--shade`, which is a **separate token from `--ink-900`**: the ink ramp inverts in
dark mode, so a shadow mixed from it becomes a white glow. `--shade` stays dark in
both themes. Both live on `:root`, not in `@theme` — Tailwind prunes theme variables
it sees no utility for, and these are consumed through `var()`.

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
mid-animation. Measured under emulated `reduce` on `/codegraph/`: **12 `.u-reveal`
bands and 33 `.u-stagger` children, zero of them stuck below `opacity: 1` or holding
a transform** — i.e. no content is hidden when the motion never runs. The progress
hairline rests at `scaleX(0)` and is therefore invisible rather than permanently
full.

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
- The theme control's selected segment is `aria-pressed="true"` plus a filled
  ground plus a distinct icon per segment — three signals, none of them colour
  alone. Each button holds a visually hidden label (`跟随系统` / `浅色` / `深色`),
  so an icon-only control still has a real accessible name.
- Both themes are now *chosen*, not just inherited, so contrast holds in both by
  construction: the pinned ramps are byte-identical to the `prefers-color-scheme`
  ones, which are the measured pairs above.
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

7. **Four of the five social marks are authored abstractions; GitHub is the real
   logo.** Five vendor logos arrive in five visual languages and read as a sticker
   sheet on a page built from hairlines, so bilibili, zhihu, x and wechat are drawn
   to one grid instead. GitHub is the deliberate exception: it is where every
   product on this site actually lives, so it is the one destination that must be
   recognised without reading a label, and it now ships the **official Primer
   `mark-github-24` path verbatim** — one filled `currentColor` path, geometry
   untouched. It replaced an authored "commit spine" abstraction that was not
   readable as GitHub. The rule this sets: use the real mark or an honest
   abstraction, never a hand-approximated logo.

   The cost of the four abstractions is lower instant recognisability, paid for
   twice — every icon has an accessible name, and the footer renders all five
   *with* text labels. Bilibili and WeChat keep their vendors' actual silhouettes
   (antenna'd screen, paired bubbles) since those are already geometric; Zhihu's
   wordmark is not reducible to this grid, so it is drawn as what Zhihu *is* — a
   question inside a discussion bubble.

   `SocialIcon`'s root keeps `fill="none"` for the stroked marks, so the GitHub
   path sets `fill="currentColor"` on itself rather than on the `<svg>`.

8. ~~**Product detail pages do not exist yet.**~~ **Superseded.** All four ship in
   both locales: `/pt-tools/`, `/codegraph/`, `/agentlens/`, `/voxera/` and their
   `/en/…` counterparts. 10 pages total.

9. **pt-tools has no shipped application icon, so its mark is authored.** The other
   three marks are lifted from real icon sources; pt-tools has none, so it is drawn
   to the same language as CodeGraph's: three feed arcs rising from an origin node
   onto a baseline — the subscriptions, and where they land. The arc radii decrease
   toward the origin because equal-radius arcs merged into a smudge below 40px when
   measured, and the mark renders at 38–46px in the index. If pt-tools ever ships an
   icon, this should be replaced by it rather than kept.

10. **The pt-tools page states what is *not* verified, and gives it structure.** Its
    ChatOps section carries four transports, of which only QQ (OneBot/NapCat) and
    Telegram are verified end to end upstream; WeCom group bot and the custom
    HMAC-SHA256 webhook are shipped but unverified. Rather than a footnote, the two
    unverified rows get the dashed rule and `--color-ink-mute` body that the index
    uses for unreleased work, plus a per-row status in words — colour never carries
    it alone. Same reasoning as AgentLens declaring its own verification gap: a page
    that quietly promotes an experimental transport to "feature" costs the reader an
    outage. The RSS free-only default gets a full callout for the same reason —
    misreading it costs real download volume.

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

### Verified after the endings + motion pass

Chrome 151, `dist/` over HTTP, measured at 390 / 1440px in both schemes:

- `pnpm check` **0 / 0 / 0** (43 files); `pnpm build` exit 0, 10 pages.
- Lighthouse on `/codegraph/` (desktop, navigation): **accessibility 100 · SEO 100 ·
  agentic-browsing 100**. Best-practices 78 is the local HTTP server alone
  (`is-on-https`, `redirects-http`); production is HTTPS-enforced and `.app` is
  HSTS-preloaded. Console clean — no errors, warnings or issues.
- `<script src>` count is still **0** on all six sampled pages; no `@font-face`,
  no `fonts.googleapis`, no `fonts.gstatic` anywhere in `src/` or `dist/`.
- Footer variant per page: `/` and `/en/` carry the blurb and no pager; all six
  product pages carry `u-footer-slim`, **zero** blurb occurrences, and one pager.
- All four scroll mechanisms register real timelines — `ViewTimeline` for
  `u-reveal` / `u-rise`, `ScrollTimeline` for `u-nav-settle` / `u-progress` — each
  `playState: running`. The stagger offsets resolve to 6 / 12 / 18 / 24 / 28 %
  across an 8-child list.
- Under emulated `reduce`: **0 of 12 `.u-reveal` bands and 0 of 33 `.u-stagger`
  children** left below `opacity: 1` or holding a transform, on every page checked.
- Zero horizontal scroll, zero over-wide elements, zero clickable text wrapping to
  two lines, at 390 and 1440 in both schemes.
- Contrast on the new surfaces, measured against their own grounds: detail footer
  min **5.29:1**, pager min **5.59:1**, copy button idle **4.87** / done **5.40** /
  failed **5.16** — all AA at 11px.
- The copy affordance, driven end-to-end against a stubbed clipboard: hidden until
  `navigator.clipboard.writeText` is confirmed, copies the command **byte-exact**,
  announces through the `role="status"` region, reverts after 2.2 s, reports
  failure, and takes a visible 2px focus ring.
- CSS **33,338 → 38,945 bytes** (+5,607, +16.8 %) for two extra keyframes, three
  extra transitions, the stagger cascade, the progress rail, the pager, the copy
  button and the two footer variants.

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

### Four more defects found by measuring, and fixed

5. **Every scroll-driven animation on the shipped site was dead — including the two
   that predate this pass.** Lightning CSS folds `animation: X linear both` plus
   `animation-timeline: view()` into the single shorthand
   `animation: linear both X view()`, and Chrome rejects that form outright:
   `el.style.cssText` came back **empty** and
   `getComputedStyle().animationTimeline` read `auto` on `.u-reveal`,
   `.u-nav-shell` and every new rule. Nothing was animating; the site only looked
   correct because the final state is also the static state. Fixed by routing every
   timeline through `var(--u-timeline)`, which Lightning CSS cannot fold into a
   shorthand — measured afterwards as real `ViewTimeline` / `ScrollTimeline`
   objects in `running` state.
6. **`.u-social-inline ul` in `@layer components` lost to a plain `flex-col`.**
   Layer order beats specificity, and `components` sits below `utilities`, so the
   more specific rule still measured `flexDirection: column`. Moved to
   `@layer utilities`, where 0,1,1 beats 0,1,0 as expected. Same family of trap as
   the `@layer base` note in §1.
7. **A concurrency race left `/pt-tools/` on the index footer variant.** The
   footer rework and the task adding pt-tools as a fourth product landed together,
   so the newest page rendered `<SiteFooter>` with no `variant` — measured as **1**
   occurrence of the positioning blurb and **0** pagers, i.e. exactly the defect
   this pass exists to remove, on the one page nobody had looked at. `astro check`
   could not catch it: both props are optional, which is correct for the home page.
   Note the id is `pttools` (the `ProductId` union) while the route slug is
   `pt-tools`; passing the slug would have silently left the current entry unmarked.
   The pager needed no sequence change — `NextProduct` derives order from
   `content.ts`, so inserting pt-tools at `01` rewired the chain to
   01 → 02 → 03 → 04 → 01 by itself.
8. **Nine identically-spaced sections made a 9,000px page read as one run.** Every
   numbered band measured `margin-top: 96px; padding-top: 64px` — the gap carried
   no information. Replaced with a three-level scale (open / next / tight → 160 /
   96 / 56px at 1440) grouped by movement, and `DetailSection` gained a `rhythm`
   prop so AgentLens and Voxera share the same vocabulary.

## 9. Reference fidelity

No screenshot or mockup reference was supplied, so there is no pixel contract. The
binding constraints are this file plus the anti-pattern list: no purple/violet
gradient, no equal three-card grid, no centred `text-4xl font-bold` + grey subtitle,
no glassmorphism or blur orbs, no emoji icons, no unsubstantiated metrics or
"trusted by" logos.
