# FirLab — Design System

Bilingual (Chinese-default) site for FirLab's open-source apps at firlab.app. Zero
client-side framework, zero web fonts on the main site, static output. This file is the
implementation contract: no component may introduce a colour, size, spacing step or
motion rule that is not named here.

**Locales.** `zh-cn` owns the bare root (`/`); `en` lives at `/en/`. Chinese is the
primary audience and the apex URL was already indexed, so `prefixDefaultLocale` is
`false` — `/` is never redirected. Both locales render from ONE component per page
(`HomePage.astro`, `VoltipPage.astro`, …), which keeps them structurally identical:
a section added to Chinese cannot silently go missing from English.

## 0. Direction

**The 2026-10-02 redesign is an app catalog.** The previous build was a technical-editorial
index: a serif display face, a product index in a plate, and one hand-made band shape per
product ("lead", "major", "standard", "pending", chosen by maturity). The owner rejected it on
two counts: its copy read as AI-written ("五个工具，数据都留在你自己的机器上", "工程取向"), and
it did not scale — the headline counted the products, the nav carried one link per product
with widths re-measured at every breakpoint, and every new product needed a band designed for
it. The owner then chose, from two directions, the app catalog over a registry-style list, and
asked that the site speak as FirLab (firlab.app) rather than describe a person.

So the site is now built around one rule: **a new app is one entry in `src/i18n/products.ts`**
(plus its icon and version constants, §4). The home page's grid, the release list, the header's
app menu, the footer, the pager on a product page and the ItemList JSON-LD all render from that
list, and no sentence anywhere names or counts the products.

**Kept from the previous system,** because they were measured and are still right: the colour
ramp read off the product marks (the pt-tools and Lockra documentation sites cite it), the
per-script metrics, the dark-ramp corrections, the theme control, the version provenance check,
the structured-data IRIs, and the CSS-only motion mechanics.

**Sources.** Palette: the shipped product marks — `#0B1220` ink, `#E7EDF5` pale slate,
`#F97316` orange, `#14B8A6` teal, `#64748B` slate. App icons: the shipped icons' own geometry
(`AppIcon.astro` names each source file). Layout reference: app directories, where each app is
one card with its icon, one sentence, its platforms and its current version. Rejected: the
maturity-shaped bands, the product-index plate, a principles/manifesto section, and any copy
that counts the products.

## 1. Design tokens

Defined in `src/styles/global.css`. Semantic aliases go through `@theme inline` so one class
set serves both themes; the raw values swap for the dark theme.

### Colour — raw ramp

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--ink-900` | `#0B1220` | `#ECEFF3` | strongest text, primary button ground |
| `--ink-700` | `#1E293B` | `#D4D8DD` | headings at the second step |
| `--ink-500` | `#475569` | `#ABB0B7` | body |
| `--ink-400` | `#5B6779` | `#9499A0` | meta, captions |
| `--paper-0` | `#FBFCFE` | `#101317` | (kept for the sub-sites; the main site no longer paints it) |
| `--paper-1` | `#F3F6FA` | `#0C0F13` | the page ground |
| `--paper-2` | `#E7EDF5` | `#2A2F35` | code blocks, chips, hover fills |
| `--rule` | `#DCE4EE` | `#353B43` | hairline |
| `--accent` | `#B03A09` | `#FB923C` | links, emphasis text |
| `--accent-mark` | `#F97316` | `#F97316` | marks, dots, rules — never text on paper |
| `--live` | `#0D6B64` | `#2DD4BF` | "actively maintained" status |

`--accent` is deliberately *not* `#F97316` for text: orange-500 on paper is 2.9:1 and fails AA.
The mark keeps the brand orange; text uses the darker/lighter step so both themes clear 4.5:1.

### Surfaces

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--surface-page` | `--paper-1` | `--paper-1` | `html`, `body`, the header's ground (86% with blur) |
| `--surface-card` | `#FFFFFF` | `#14181D` | cards, popovers, the footer |
| `--tile` | `#0B1220` | `#0B1220` | an app icon's tile — the shipped icons' own navy, not themed |
| `--tile-edge` | `rgb(255 255 255 / 0.04)` | `rgb(255 255 255 / 0.1)` | the tile's rim, so it keeps its silhouette on the dark page |

The page is the soft paper step and a card is a whiter sheet on it, so a card reads as an
object without a heavy shadow. In the dark theme the card is lifted to `#14181D` (L ≈ 19.6,
+2.9 over the page) and carried mostly by the lit `--rule`, which is the dark-ramp lesson below.

### The dark ramp, measured in OKLCH

The dark ramp was rebuilt in an earlier pass after "the background and content area feel
oppressive", and the fix still holds: low chroma on the ground (C ≈ 0.0095, rising up the ramp
to 0.0162 at `--rule`, the way Radix slate does), ink chroma cut to ≈ 0.011 with lightness held,
`--rule` lit to +16.5 L above the page's neighbour step, and near-white capped at L 95.1 to avoid
halation. Elevation in dark mode is carried by light — a faint white top edge on cards and
popovers — because a dark shadow has nothing left to darken.

### Theme selection — system is the default, not the only option

Three states, exposed as a segmented control in the header: `system` · `light` · `dark`.

| State | `<html>` | Ramp source |
| --- | --- | --- |
| `system` (default) | no `data-theme` | `prefers-color-scheme` |
| `light` | `data-theme="light"` | base `:root` |
| `dark` | `data-theme="dark"` | dark override |

- Absence of `data-theme` is load-bearing: `system` removes the stored key rather than storing
  a third value, so a visitor who never touches the control keeps tracking the OS.
- The dark ramp is written **twice** in `global.css` — under the media query and under
  `:root[data-theme="dark"]` — because CSS cannot OR a media query with a selector. One ramp:
  change both or neither.
- `color-scheme` follows the pinned theme, so scrollbars and form controls match it.
- `theme-color` is handled by inserting a media-less `<meta>` first in `<head>`.
- Persistence is `localStorage['firlab-theme']`, the only thing the site stores, wrapped in
  `try/catch`. A parser-blocking inline script applies it before first paint; the control ships
  `display: none` and is revealed by `html[data-js]`.

### Semantic aliases

`--color-ink`, `--color-ink-soft`, `--color-ink-body`, `--color-ink-mute`, `--color-paper`
(page), `--color-panel` (card), `--color-block`, `--color-rule`, `--color-accent`,
`--color-mark`, `--color-live`, `--color-tile`. Components use only these.

### Type

| Token | Stack |
| --- | --- |
| `--font-sans`, `--font-display` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif` |
| `--font-mono` | `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, "Liberation Mono"`, then the same CJK tail |

No web fonts: a single CJK weight is 5 MB+ even subsetted well, which would spend the whole
LCP budget on a typeface. Headings and body share the sans stack — hierarchy comes from weight
(650 for display, 600 for labels) and size; mono is for versions, commands and metadata. The
serif display of the previous build is gone: in Chinese it fell back to a heavy Song face that
read as dated next to the app icons.

| Token | Value | Use |
| --- | --- | --- |
| `--text-hero` | `clamp(3.25rem, 2rem + 5vw, 5.5rem)` | the home page's brand line, "FirLab" — the one word set larger than an h1 |
| `--text-display` | `clamp(2.125rem, 1.55rem + 2.3vw, 3.25rem)` | a product page's h1 |
| `--text-title` | `clamp(1.5rem, 1.3rem + 0.9vw, 2rem)` | section titles; the home h1's second line from `sm` |
| `--text-title-sm` | `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)` | product-page sections, contact cards |
| `--text-lede` | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | ledes |
| `--text-meta` | `0.75rem` | mono labels, counts |

### Script-dependent metrics

Latin-tuned leading and tracking are wrong for hanzi, so the metrics are tokens switched by
`html:lang(zh-CN)`, unlayered on purpose (an unlayered declaration outranks every layered one):

| Token | Latin | Chinese | Applies to |
| --- | --- | --- | --- |
| `--lh-prose` | `1.65` | `1.8` | `body`, running copy |
| `--ls-prose` | `0em` | `0.012em` | ditto |
| `--lh-display` | `1.12` | `1.3` | `.u-display` |
| `--ls-display` | `-0.022em` | `0.01em` | ditto |
| `--lh-lede` | `1.6` | `1.85` | `.u-lede` |
| `--measure-prose` | `36em` | `29em` | `.u-measure` (~66 Latin characters, ~29 hanzi) |
| `--measure-lede` | `34em` | `32em` | `.u-lede` |

- `.u-display-latin` re-tightens known-Latin display text (product names) on a Chinese page.
- `code, kbd, samp, pre { letter-spacing: normal }` — inherited CJK tracking breaks command
  columns.
- `text-wrap: pretty` on `p, dd, li` removes single-character orphans.
- Chinese display headings omit the trailing `。`.
- **Phrases and sentences that must not break inside are inline-block runs.** Browsers break
  hanzi anywhere, so the home h1's second line is written as phrases
  (`开源的桌面应用、` + `命令行工具与自部署服务`) and the lede as sentences, each rendered as
  `inline-block`: a run that fits its line stays whole, one that does not still wraps inside its
  own box. Measured: the subtitle breaks after `、` at 375 and 414 px and sets on one line from
  768 px; the lede breaks between its two sentences at every width from 414 px.

### Spacing

8px base, Tailwind's default numeric scale. The one fluid value is the gutter (§2).

### Radius — three steps and the icon

| Token | Value | Use |
| --- | --- | --- |
| `--radius-chip` | `6px` | chips, code blocks, small rows |
| `--radius-control` | `10px` | buttons, segmented controls, filter chips, menu rows |
| `--radius-card` | `16px` | cards, popovers, figures |
| (icon) | 22% of its size | an app icon, as the shipped icons draw it |

No pill buttons on the main site.

### Depth

`--shadow-card` (resting card), `--shadow-lift` (hovered card), `--shadow-pop` (popovers) —
a hairline plus one tightly spread shadow, mixed from `--shade`, which stays dark in both
themes. Dark mode adds a white top edge instead (above).

## 2. Layout

### The column

`.u-shell` is the only container: `max-width: calc(72rem + 2 × gutter)`, centred,
`padding-inline: var(--gutter)` with `--gutter: clamp(1.25rem, 3.2vw + 0.35rem, 2.5rem)` —
20px on a phone, 40px from ~1140px. The previous build's two nested boxes (a bordered sheet on
an inset desk) and the nav scrim they required are gone: a catalog reads best on one full-bleed
ground, and the floating pill they existed for is gone too.

### Header

`SiteHeader.astro`, sticky, 64px tall, the page ground at 86% with `backdrop-filter` blur as
an enhancement (write the standard property only — Lightning CSS collapses a hand-written
`-webkit-` twin into the prefixed form alone, which Chrome ignores), and a bottom hairline.
Left to right: the wordmark (its letters drop below 420px, the glyph stays — measured, the
English bar needs 355px of column with them shown), the **app menu**,
then GitHub (from 640px), the theme control and the language switch.

The products are reached through one menu, never one link each, so the bar's width does not
depend on how many products exist. The menu is a `<details data-popover>` disclosure — it works
with scripting off and announces its state natively; the layout's script adds Escape (focus
returns to the summary), outside-click and one-open-at-a-time. The `<details>` itself is not
positioned: the panel is placed against the bar's column (`left: var(--gutter)`, width
`min(22rem, 100% − 2 × gutter)`), so on a phone it uses the column instead of starting under the
summary and running off the screen. On a product page that product's row is
`aria-current="page"` and not a link.

### Home page

1. **Hero** — an h1 in two lines: the brand at `--text-hero`, then what FirLab offers at
   `--text-title` (`1.375rem` below 640px); the lede; two buttons, GitHub (primary) and the
   WeChat Official Account (a QR disclosure; anchored to the button row on phones, to its own
   button from `sm`). No visual, no count, no tagline beyond the h1's second line.
2. **Apps** — `AppCatalog`: the title, the category filter, and the grid:
   `grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr))` — three columns at
   1024px and up, two at 768, one on a phone, and a new app is one more card.
3. **Latest releases** — `ReleaseList`: every released product, newest first, capped at six, each
   row linking to that tag's release notes.
4. **Bugs and requests / WeChat Official Account** — two cards, the second showing the QR inline.
5. **Footer.**

At 1440 × 900 the first row of cards starts inside the first viewport.

### Product pages

`ProductHeader` (breadcrumb FirLab / 应用 / name; the 72px icon and the h1; category ·
platforms; the mono role line; the lede; actions — Install when the page has an install section,
the GitHub repository, the product's website if it has one; and a fact card with status,
version, release date, licence, extra facts, the releases link and the page's section index).
Then the page's own sections, unchanged in structure, on the band rhythm: `.u-band-open` draws a
rule and opens a movement (96px above from 768px), `.u-band-next` continues one (64px),
`.u-band-tight` binds to the section above (32px). Then `NextProduct` and the footer.

### Footer

One shape on every page: identity and a one-line blurb, the app list from the catalog, and every
contact with its text label (GitHub, Bilibili, Zhihu, X, the personal WeChat QR, the Official
Account QR). Three columns from 1024px; between 640 and 1023 the identity spans the top and the
two lists sit side by side — at 768px a 3-of-12 column was 146px and "WeChat Official Account"
wrapped inside its link.

## 3. Components

| Component | Contract |
| --- | --- |
| `SiteHeader` | §2. Wordmark · app menu · GitHub · theme · language. |
| `AppIcon` | Each product's shipped icon on the 100-unit grid, tile included, inline SVG (no request). Decorative (`aria-hidden`) beside a visible name; pass `label` where it stands alone. Takes a `view-transition-name`. |
| `AppCard` | One per product, identical for all: icon, name (the stretched link), category with a status badge for non-mature products only, tagline, platform chips, version · date, GitHub link above the stretch. Hover lifts 2px; focus rings the card. |
| `AppCatalog` | Title, filter, grid. Radio inputs plus `:has()`, no script; the hiding rules are generated per category present; the filter is hidden without `:has()` support and absent with one category. Cards sit in `<li>`s and the stagger animates the `<li>` (see §6). |
| `ReleaseList` | §2. Built from `versions.ts` through the catalog. |
| `ContactSection` | Feedback (GitHub) and the Official Account with its QR inline on a white plate. |
| `ProductHeader` | §2. All facts from the catalog entry, so a page cannot disagree with its card. |
| `NextProduct` | A card linking to the next product in catalog order; wraps and says so. A `<nav>` outside `<main>`. |
| `SiteFooter` | §2. |
| `SocialRow` | The real destinations with labels; WeChat entries are `<details>` QR panels (white plate in both themes — a scanner needs a light ground). |
| `StatusTag` | Text plus a dot, never colour alone: `live` 持续更新, `early` 早期版本, `wip` 开发中. |
| `ThemeSwitch`, `LangSwitch` | Segmented controls, 32px tall. The language switch keeps the current page's slug. |
| `InstallBlock` | Selectable commands; long commands wrap rather than scroll; the copy button appears only when `navigator.clipboard.writeText` exists. |
| `SpecGrid`, `DefRows`, `DetailSection`, `ScreenFigure` | Product-page primitives, restyled through the tokens. |
| `Wordmark` | The bracket glyph plus FIRLAB in mono; `compact` drops the letters below 420px. |

Cards use the stretched-link pattern: the name's link carries `.u-stretch`, whose `::after`
covers the card; secondary links carry `.u-above`. One anchor per destination, no link inside a
link, and the accessible name is the product name.

## 4. The catalog

`src/i18n/products.ts` is the single list. Each entry: `id`, `name`, `category` (`service` |
`cli` | `desktop`), `platforms`, `status`, `version` / `released` (imported from `versions.ts`),
`license`, `repo`, `page` (`{ slug }` for an in-site page, `{ href }` per locale for a
documentation site under firlab.app), optional `site` (a website on its own domain), and a
one-sentence `tagline` per locale. Array order is display order.

**Adding an app:**

1. An entry in `products.ts`.
2. Two constants in `src/i18n/versions.ts` (the tag and its UTC release date) and a row in
   `scripts/check-versions.mjs`.
3. Its icon in `AppIcon.astro`, lifted from the app's shipped icon.
4. Where its name leads: an in-site page under `src/pages/` (`page.slug`, built on
   `ProductHeader`), or the paths of its documentation site (`page.href`).

Nothing else: the grid, filter counts, release list, header menu, footer, pager and JSON-LD
follow. A new category needs its two labels in `ui.ts` (`category.*`, `filter.*`) and, if the
home page's description names the categories, that sentence.

**Taglines** state what the app does in one plain sentence. They inherit the factual constraints
listed at the top of `products.ts` (pt-tools downloads free torrents unless a filter rule widens
it; CodeGraph has no model; Voltip's cloud paths send audio or text out; Lockra goes online for
updates and opt-in sync).

### Version provenance — one constant per fact, checked against the tag

`versions.ts` owns every version and release date, one exported constant each, and every surface
reads it through the catalog. **The source of truth is the GitHub release tag**, never a product
manifest (manifests trail their tags) and never the release title (titles are not one format);
dates come from `published_at` in UTC.

**The build does not fetch.** `scripts/check-versions.mjs` does, and its three-way exit code is
the contract: `0` matches the latest stable release, `1` is proven drift (and may open or update
the drift issue naming the constant), `2` means the API could not give a verdict
(`VERSION CHECK INCOMPLETE`, never reported as drift). `ci.yml` runs it on pull requests;
`version-drift.yml` runs it daily and keeps one marker-tagged issue. It never auto-commits a fix:
a commit to `main` publishes, and a bot must not publish a version claim no human reviewed.

### Structured data

`schema.ts` mints every entity IRI: `WebSite` per locale, `Person` once (the publisher and
author), `SoftwareApplication` per product page with `FREE_OFFER` only where a release exists,
and no `aggregateRating` or `review` anywhere — there are no real ratings, and inventing them is
a policy violation. The home page's ItemList nodes carry no `@id` (they are summaries, not the
authoritative record). The social card is one image for the whole site, so every page's
`og:image:alt` is the home page's `ogAlt`.

## 5. Copy

- **Speak as FirLab.** The site is firlab.app, not a personal homepage: no "sunerpy 的…" in
  headings, titles, descriptions or blurbs. The author still appears where it is a fact — the
  JSON-LD `Person`, the `author` meta, the copyright line and the GitHub account the links lead to.
- **Name and count nothing in shared copy.** The hero, the description, the footer and the
  section titles must survive a new app unchanged.
- **Plain statements, no slogans or manifestos.** If a line would read as well on any other
  site, cut it. Section headings say what the section holds (安装, 技术栈, 当前状态), not a
  rhetorical promise.
- **Facts come from the product's README and release tags**, with the constraints in
  `products.ts`. Unknown means "say nothing", never a guess.
- Chinese copy quotes with 「」 and sets real spaces around Latin runs.

## 6. Motion

CSS only, all of it inside `prefers-reduced-motion: no-preference` plus an `@supports` gate, so
an unsupporting or motion-averse browser renders the final state.

| Mechanism | Where |
| --- | --- |
| `u-enter` — time-based, staggered by child | the home hero and a product header, which are on screen at first paint |
| `u-reveal` — `animation-timeline: view()` | each home section, the pager |
| `u-stagger` — `view()` with offset ranges per child | the card grid's `<li>`s, spec lists |
| `u-progress` — `scroll(root)` | the 2px reading rule at the top edge |
| Hover | cards lift 2px and gain `--shadow-lift`; arrows advance 0.3em |
| `@view-transition { navigation: auto }` | a card's icon and name morph into the product page header (`mark-<id>`, `title-<id>`) |

Two rules that are not style preferences:

- **Every timeline is assigned through `var(--u-timeline)`.** Given `animation: X linear both`
  next to `animation-timeline: view()`, Lightning CSS folds them into a shorthand Chrome
  rejects, and the animation silently never runs.
- **A scroll-driven animation and a hover transform cannot share an element.** A finished
  animation with `fill-mode: both` holds `transform: none` and overrides the hover lift, so the
  stagger animates the `<li>` and the card inside it lifts.

## 7. Accessibility

Contrast, WCAG 2.x, every text pair on the surface it sits on:

| Text | Light page / card / block | Dark page / card / block |
| --- | --- | --- |
| `--ink-900` | 17.27 / 18.72 / 15.90 | 16.65 / 15.45 / 11.70 |
| `--ink-700` | 13.50 / 14.63 / 12.42 | 13.41 / 12.45 / 9.42 |
| `--ink-500` | 6.99 / 7.58 / 6.43 | 8.80 / 8.17 / 6.18 |
| `--ink-400` | 5.29 / 5.74 / **4.87** | 6.70 / 6.22 / **4.71** |
| `--accent` | 5.61 / 6.08 / 5.16 | 8.49 / 7.88 / 5.96 |
| `--live` | 5.86 / 6.36 / 5.40 | 10.32 / 9.58 / 7.25 |

The primary button and a checked filter chip (page colour on ink) are 17.27 light and 16.65
dark. Nothing is below 4.5:1.

- Landmarks: one `banner` (the header), `main`, `contentinfo`; navs are labelled (主导航,
  页脚导航, the breadcrumb, the pager, the page index). Exactly one `h1` per page.
- Every interactive element shows `:focus-visible` (2px accent ring); a card shows it on the
  card. Buttons are 40px tall, header controls 32–36px, filter chips 36px. Below 420px the header's
  home link is an 18px glyph, so a pseudo-element grows its hit area to 34 × 45px without widening
  the bar. Links stacked in lists (breadcrumb, a product page's closing links) are at least 24px
  apart, which meets WCAG 2.5.8 through its spacing exception.
- Status is text plus a dot, never colour alone. Icons beside a visible name are hidden from
  assistive tech; the icon-only GitHub link carries a name and a title, and the footer repeats
  every destination with a text label.
- The filter is a `fieldset` with a visually hidden legend and native radios: one tab stop,
  arrow keys move, the checked state is announced. Each input covers its chip, so a click never
  scrolls the page to a hidden control.
- Disclosures are native `<details>`; Escape closes and returns focus to the summary.
- The QR images carry descriptive `alt` text; the Official Account's name is also written out.
- `overflow-x: clip` (never `hidden`) on `html` and `body`, which keeps `position: sticky`.

## 8. Verified (2026-10-02)

Local build served statically, Chrome via CDP.

- `astro check`: 0 errors, 0 warnings. `astro build`: 8 pages; `dist/CNAME` is `firlab.app`.
- 64 route × width combinations — `/`, `/en/`, `/codegraph/`, `/en/codegraph/`, `/agentlens/`,
  `/en/agentlens/`, `/voltip/`, `/en/voltip/` at 320, 360, 375, 414, 768, 1024, 1280 and 1440px,
  with every popover forced open: no horizontal overflow, no element past the viewport outside a
  horizontal scroller, the header 64px on one line with nothing past the gutter, no clickable
  text (buttons, header and footer links, breadcrumbs, filter chips, card names) on two lines,
  no app-menu name wrapped, exactly one `h1`. Product-page h1s are one line at every width.
- The filter shows 3 / 1 / 1 / 5 cards for desktop / CLI / service / all, without scrolling the
  page. The app menu opens with every product, closes on Escape (focus back on the summary) and
  on an outside click, and only one popover is open at a time. The theme control switches the
  page ground and cards to the dark ramp and back to the system.
- Light and dark at 1440 × 900 and 375 × 812 were checked by screenshot. Target sizes were
  measured at 320, 360, 375, 399 and 414px: the only controls under 24px were the header's glyph
  link, the footer's wordmark link (20px tall) and the breadcrumb links (18px tall); all three were
  enlarged.

Defects found by measuring in this pass, and fixed before the numbers above: the hero's QR panel
ran 23px past the right edge at 375px (now anchored to the button row on phones); the English
header pushed its controls into the gutter at 360–399px (the wordmark letters now drop below
400px); a long mono URL on the AgentLens page overflowed at 320px (now `overflow-wrap: anywhere`);
a card's status badge beside the name broke "AgentLens" mid-word at 320px (moved to the category
line); the footer's social column wrapped "WeChat Official Account" at 768px (two columns below
1024px); the Chinese subtitle broke inside 「命令行工具」 on phones (phrase runs, §1); and a
36px home link widened the English header past its gutter at 320px, so the hit area now grows
through a pseudo-element instead.

## 9. Accepted debt

- The Chinese h1 subtitle takes three lines at 320px (it breaks between words); the English
  one takes four at 320–360px, and "self-hosted" may break at its hyphen.
- Without `:has()` support the filter is hidden and every card shows.
- Motion was not observed in this pass: the verifying browser had reduced motion on, so only the
  static final state (which is what reduced motion gets) was checked. The timelines in §6 are the
  previous build's mechanics with new ranges, and the stagger moved onto the grid's `<li>`s.
- `public/og.png` is a 1200 × 630 browser render of `public/og.svg`; re-render it when the SVG
  changes. It names no product, so a new app does not stale it.
- The `/voxera/` and `/en/pt-tools/` redirects stay: both URLs were indexed.

## 10. Product documentation sub-site: voltip.firlab.app

`voltip/` is a VitePress 1.6.4 site: the default theme without its fonts
(`vitepress/theme-without-fonts`) plus `voltip/src/.vitepress/theme/`. It inherits the §1
ramp, the §1 per-script metrics and the §6 contrast floor. This section records what it adds
and where it departs from the umbrella site, each with its reason; `voltip/README.md` covers
ownership and deployment.

**Palette.** `theme/styles/tokens.css` maps the §1 ramp onto VitePress's `--vp-c-*`
variables. Light: paper `#FBFCFE` / desk `#F3F6FA` / blocks `#E7EDF5`, ink `#0B1220` /
`#1E293B` / `#475569` / `#5B6779`, rule `#DCE4EE`. Dark: `#101317` / `#0C0F13` / `#2A2F35`,
plus two surfaces VitePress needs, soft `#181C21` and elevated `#1F2329`, on the §1 OKLCH
curve (H ≈ 255, C ≈ 0.011); ink `#ECEFF3` / `#D4D8DD` / `#ABB0B7` / `#9499A0`, rule
`#353B43`. VitePress's indigo brand, purple "important" blocks, sponsor pink and hero
gradient are all remapped: nothing on the site is purple. Every text colour is at least
4.5:1 on the surfaces it sits on (the lowest, light `#5B6779` on `#E7EDF5`, is 4.87:1).
`#F97316` measures 2.73:1 on paper, so it only marks (the logo, the status dots) and never
carries text. Code is highlighted with vitesse-light and vitesse-dark, except that every token
colour under 4.5:1 on the code background is moved to the nearest colour of the same hue
that reaches 4.6:1 (`CODE_CONTRAST` in `config/shared.ts`).

**Buttons and links, after OpenAI's developer documentation (user decision 2026-09-29).**
The first build used the §1 text accent `#B03A09` for links and the primary button; the owner
found the brown button and brown links unattractive and asked for OpenAI's docs style, which
was measured on developers.openai.com (solid and soft pill buttons, 36 px, 14 px / 500;
prose links in the body colour at 500 with an underline). So:

| Element | Light | Dark |
| --- | --- | --- |
| Primary button | `#0B1220` fill, white text | `#ECEFF3` fill, `#0C0F13` text |
| Other buttons | ink at 6 % (hover 10 %) | ink at 9 % (hover 14 %) |
| Link | body ink, 500, 1 px underline at ink 30 %, full ink on hover | the same on the dark ink |
| Current nav item, current sidebar row | the soft fill | the soft fill |

Buttons are pills (`999px`): the one exception to §1's "no pill buttons", made on the owner's
request and limited to buttons. Everything else keeps the 4 / 8 / 12 steps. Status tags are
text, never colour alone: available is teal text (`#0D6B64` / `#2DD4BF`), in development is
ink text behind an orange dot, planned is grey text behind a ring.

**Type: the one departure from "no web fonts".** Latin text is Instrument Sans Variable, the
app's own face, and code is JetBrains Mono Variable, both self-hosted from
`@fontsource-variable` 5.3.0 and loaded by `unicode-range`: an English page fetches the 29 KB
Latin Instrument Sans file and, where code appears, the 39 KB Latin JetBrains Mono file; a
Chinese page fetches the same Latin files for its Latin runs and no CJK font at all. Hanzi
use the system stack (PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Noto Sans SC) with
VitePress's Punctuation SC compression. The umbrella site's reason for no web fonts (a CJK
face would cost megabytes) does not apply to Latin-only files of this size, and matching the
app's face is what makes the screenshots and the page read as one product. Prose leading is
1.7 for Latin and 1.85 for Chinese; display leading 1.08 / 1.22, the umbrella site's values
when this site was built (§1 has since moved to 1.12 / 1.3 for its sans headings).

**Layout.** The home page answers four questions above the fold, at 1280 × 800 and at
375 × 812: what it does (name, headline, tagline), where it runs and where the audio goes
(two fact rows), how to get it (the Download button). The hero puts the words left and a real
capture of the app's home page right, with the overlay pill below it cycling through its
three states. Then: the feature index (two columns of groups, each row with its status), one
dictation in four steps, three text-and-evidence splits that alternate sides (local and
cloud recognition with the model table, AI polish with a before-and-after, the phone with its
pairing methods), the platform table (rows become cards under 768 px), what leaves the
computer in each mode, the install commands and the roadmap with what is deliberately not
built. No gradients, glows or blur; no drawn window or phone frames; every screenshot is a
real capture of the app on its mock backend, framed by a hairline.

**Motion.** One animation: the pill cross-fade, opacity only, 2.6 s per state. With
`prefers-reduced-motion: reduce` the last state shows, still.

**Video and QR codes (2026-10-03).** `VideoFigure` frames the tutorial video like a screenshot:
the same hairline, radius and plate shadow, `preload="metadata"` and a poster, so a page costs no
video bytes until the reader presses play; the captions are burned into the picture. `QrCode` is
the pt-tools component on this site's tokens, with its white plate in both themes
(`--vt-qr-plate`) because a scanner needs a light ground.

**Structure.** The home page's root is a `<main>`: `theme/components/HomeMain.vue` replaces
VitePress's `VPHome`, which has no main landmark, through the alias VitePress documents for
overriding its components. Compare the two when VitePress is upgraded.

**Verified 2026-09-29 (local preview, Chrome).** At 1280 × 800, 1440 × 900 and 375 × 812, in
both languages and both themes, the headline, both fact rows and the Download button end above
the fold (the lowest, English at 1280 × 800, ends at 638 of 800 px). Nothing overflows
horizontally at 320 (mobile emulation), 375, 768, 1280 or 1440 px on the two home pages, a
guide page, a reference page and a design document; the nav bar fits at every width from 768
to 1280 px since the search button shows its icon alone from 768 to 959 px (to 1099 px beside
a sidebar; before that the English bar measured 820 px in 753). No computed colour on seven
pages in either theme falls in OKLCH hue 270–330 with chroma above 0.04. Lighthouse:
accessibility 100 and SEO 100 on the English home page (mobile) and a Chinese reference page
(desktop, dark); best practices scored 78 only for HTTPS, which the local preview does not
serve. Chinese search finds 快捷键, 本地识别 and 词典 on their pages, and all 503 in-site
anchors resolve.

**Hallmark slop test, 2026-09-29 (home page, both languages).** Pre-emit critique P4 H4 E4 S4
R4 V4, stamped at the top of `theme/styles/home.css`. Eight gates failed on the first build and
were fixed: 18 (the overlay cross-fade now pauses while the pointer rests on it), 20 (the stamp
itself), 24 (31 spacing values off the 4 px scale moved onto it), 35 (link underlines sit 2 px
below the text, not 0.22 em), 44 (the hero had less padding below than above; now 64 px above
the content and 88 px below from 640 px up), 48 (the pill's drop shadow was a literal colour;
now `--vt-pill-drop`), 51 (headings wrap long words) and 25, which already held — VitePress's
688 px column is under 72 ch of Instrument Sans — and now has an explicit 72 ch cap for Latin
prose. Two gates pass only by justification: 42, the nav is VitePress's own docs bar because the
brief asked for a site modelled on zuno.firlab.app, and 7, pure white is used only for raised
surfaces (menus, the search box), never as the page ground. Every other gate passes: no
gradient, no card grid with icons, no nested cards, no side stripes, no centred hero, no
redrawn chrome, no invented number, at most two families (Instrument Sans for display and body,
JetBrains Mono for labels and code), no italic heading, contrast at least 4.5:1, and no
horizontal scroll or wrapped button from 320 to 1440 px.

## 11. Product documentation inside firlab.app: firlab.app/lockra

`lockra/` is the §10 site for a second product, published under a path of this site instead of
on a subdomain: VitePress builds it with `base: '/lockra/'` and `deploy.yml` copies it to
`dist/lockra/`. It keeps everything §10 records — palette, code contrast, buttons and links,
type, the `<main>` home root — through the same files with an `lk-` prefix
(`lockra/src/.vitepress/theme/styles/`). This section records only what differs, with the
reason; `lockra/README.md` covers ownership and deployment.

**A path, not a subdomain (user decision 2026-10-01).** The owner asked for the site to live at
a route of firlab.app rather than on a domain of its own. A path needs no DNS record, no
certificate and no second Pages project, and GitHub Pages serves the whole of firlab.app from
one artifact. The cost is that the sub-site's links must carry the base: pages link without it
and VitePress adds it, the theme's components wrap every path in `withBase`, the `head` paths
carry it by hand, and `lockra/scripts/check-dist.sh` fails the build if any root-relative link,
asset or sitemap entry leaves `/lockra/` (a missing base would land on firlab.app's own pages,
which exist, so nothing else would notice).

**Lockra's mark has the same three values.** Lockra's icon is the §1 ink `#0B1220` square with
a pale `#E7EDF5` lock and an orange `#F97316` countdown arc, so the §10 palette applies as it is
and the orange keeps its role: the arc in the logo, the status dots, never text.

**Layout.** The hero has one capture, the app's codes page in the site's theme, and no motion:
Lockra has no overlay to cycle through. The home bands after the hero are the feature index,
moving accounts in four steps, three text-and-evidence splits (moving accounts with a table of
each app's way in and way back, backups and protection with short points), the platform table,
what is kept where, the install paragraph, and what is deliberately left out (a dashed plate,
as §10's "not built" list). The screenshots are real captures of the app with made-up accounts,
taken by lockra's `scripts/capture-site-screens.sh`.

**On the home page.** Lockra is a catalog entry (§4) whose `page.href` is this sub-site in each
language, so its card's name leads here and the card's own link is the repository. Its `AppIcon`
is the shipped app icon, plate included: the pale lock on the navy tile inside the three-quarter
ring in the mark orange.

## 12. Product documentation inside firlab.app: firlab.app/pt-tools

`pt-tools/` is the §10 site for a third product, published like Lockra's (§11) under a path of
this site: VitePress builds it with `base: '/pt-tools/'` and `deploy.yml` copies it to
`dist/pt-tools/`, after `pt-tools/scripts/check-dist.sh` has confirmed that every root-relative
link, asset and sitemap entry stays under `/pt-tools/`. It keeps the same VitePress 1.6.4 setup,
palette mapping, button and link treatment, contrast table for code, `<main>` landmark,
home-page frontmatter contract and page structure, through the same files with a `pt-` prefix.
This section records only where it departs from §10 and §11, each with its reason;
`pt-tools/README.md` covers ownership and deployment.

**It took the product page's path (user decision 2026-10-01).** `/pt-tools/` was this site's
detail page for pt-tools. The owner chose to let the documentation site replace it rather than
sit beside it under another path, so the detail pages in both languages are gone, the catalog
entry's `page.href` (§4) leads to the documentation site in each language, and `/en/pt-tools/`,
which was indexed, redirects to `/pt-tools/en/` (`redirects` in `astro.config.mjs`). The
Chinese URL did not change. Because the main site emitted `dist/pt-tools/` until then,
`deploy.yml` refuses to copy the sub-site over one: a restored page fails the deploy instead of
being replaced without notice. The site was first built for a `pt-tools.firlab.app` subdomain on
Cloudflare Pages and moved here before it was published, for §11's reasons. Two things the
subdomain had do not carry over: its `_headers` security headers, which GitHub Pages does not
serve, as for every other page of firlab.app, and its own `robots.txt`, whose sitemap line moved
into this site's `public/robots.txt`.

**Chinese is the root locale.** pt-tools' users and its web UI are Chinese, so `/pt-tools/` is
Chinese and English sits under `/pt-tools/en/`, the reverse of Voltip and Lockra. `x-default`
points at the Chinese page. Pages that exist only in Chinese (the contributor guide and the
design documents) get a generated English placeholder at the same path, marked `noindex` and
left out of the sitemap, because VitePress's language switch maps the current path onto the
other locale unchanged and would otherwise lead to a 404.

**Type: system faces, as in the app.** The web UI uses the system stack
(`web/frontend/src/styles/theme.scss`: Noto Sans SC, -apple-system, Segoe UI, PingFang SC,
Microsoft YaHei UI and so on), and the screenshots on the home page are that UI. Using the same
stack for the text, rather than Voltip's Instrument Sans, keeps the page and the captures one
product and downloads no text face at all. Code is JetBrains Mono Variable, self-hosted
(40 KB Latin file, loaded only where code appears). VitePress's Punctuation SC compression is
applied on Chinese pages only (`:root:lang(zh-CN)`); on an English page the same rule would set
quotes and dashes at full width.

**Status: four values.** pt-tools ships two outbound channels that exist in the release but
have not been verified end to end (WeCom, generic webhook), so `StatusTag` adds `experimental`
to Voltip's three: available, experimental (orange ring and text label), in development,
planned. Status is always text, never colour alone.

**Hero: desktop and phone, no animation.** pt-tools has no overlay to show, so the hero's
evidence is the user statistics page captured at 1440 × 900 with the same page on a 375 × 812
phone laid over its lower right corner (86 % / 27 % of the column), both real captures of the
web UI on its acceptance fixtures, framed by a hairline. Nothing moves, so there is no motion
to reduce.

**Splits: rules, commands, a capture.** The three text-and-evidence splits show what pt-tools
decides with: filter-rule examples as a table (pattern, type, what it matches), chat commands
as a command list, and the site list as a capture.

**Alerts in the page's language.** The pages use GitHub's alert syntax so they read on GitHub;
VitePress titles alerts with one site-wide label set, so a `markdown.config` hook gives Chinese
pages Chinese titles (提示, 说明, 注意, 警告, 重要) and leaves English pages VitePress's. A `---`
directly before an `h2` is hidden, because VitePress already rules every `h2`.

**Verified 2026-10-01.** On the build for the subdomain (local preview, headless Chrome): at
1280 × 800, 1440 × 900 and 375 × 812, in both languages and both themes, the headline, both fact
rows and the Install button end above the fold (the lowest, English at 375 × 812, ends at 703 of
812 px); nothing overflows horizontally at 320, 375, 768, 1024, 1280 or 1440 px on twelve pages;
no computed colour on seven pages in either theme falls in OKLCH hue 270–330 with chroma above
0.04; the theme choice survives a reload. Again on the `/pt-tools/` build, assembled the way
`deploy.yml` assembles it (main site, `dist/lockra/`, `dist/pt-tools/`) and served with GitHub
Pages' lookup rules: all 4,243 root-relative links and assets in the 109 pages resolve; seven
pages (both home pages, guide, reference and design pages, an English placeholder) at 1440 × 900
and 375 × 812 log no console error or failed request, show no broken image and do not overflow; the
language menu maps every page, the placeholder included, onto the same path under the other
locale; Chinese search for 过滤规则 and English search for "secret key" return results under
`/pt-tools/`; `/en/pt-tools/` lands on `/pt-tools/en/`; the catalog entry leads to `/pt-tools/` and
`/pt-tools/en/`; canonical and hreflang links are absolute under `https://firlab.app/pt-tools/`,
and the placeholders carry `noindex` and no hreflang. Lighthouse on that build: accessibility
100 and SEO 100 on the Chinese home page (mobile) and an English guide page (desktop); best
practices 78 only for HTTPS, which the local server does not serve. The one failing experimental
rule, `label-content-name-mismatch`, is VitePress's own search button, shared with the Voltip
site.

## 13. Product documentation inside firlab.app: firlab.app/codegraph

`codegraph/` is the §10 site for a fourth product, published like pt-tools' (§12) under a path of
this site: VitePress builds it with `base: '/codegraph/'` and `deploy.yml` copies it to
`dist/codegraph/` after `codegraph/scripts/check-dist.sh` has passed. It keeps the VitePress 1.6.4
setup, the palette mapping, the button and link treatment, the code contrast table, the `<main>`
home root and the home-page frontmatter contract, through the same files with a `cg-` prefix.
This section records only where it departs from §10–§12, each with its reason;
`codegraph/README.md` covers ownership and deployment.

**It took the product page's path (user decision 2026-10-03).** The owner chose the pt-tools
arrangement over Voltip's subdomain: the documentation site replaces this site's CodeGraph page
at `/codegraph/`, the page's introduction moves into the site's home page, and `/en/codegraph/`,
which was indexed, redirects to `/codegraph/en/`. A path needs no DNS record or second host (§11).
`CodeGraphPage.astro` and `i18n/codegraph.ts` are gone, the catalog entry's `page.href` leads to
the site in each language, and `deploy.yml` refuses to copy the sub-site over a
`dist/codegraph/` the main site emits. Chinese is the root locale, as on the pt-tools site.

**English-only references with Chinese pointers.** CodeGraph's canonical technical references
(`docs/<name>.md` in codegraph-rust) are English, and that repository's rules keep them so. The
sync publishes them unchanged under `/en/reference/` and `/en/dev/` and gives each a generated
Chinese page at the same path without `/en/`, marked `noindex`, left out of the sitemap and with
no edit link — pt-tools' Chinese-only pages (§12) the other way round. The guide pages link the
references by their real path in codegraph-rust, so GitHub and its `docs-check.py` follow them;
the sync rewrites those links to the site's paths, and any other link that leaves the synced
tree to a GitHub link. Heading ids are GitHub's (`githubSlug` in `config/shared.ts`), not
VitePress's, so an anchor written and checked in codegraph-rust lands on the same heading here.
The edit link maps each page back to `docs/site/…` or `docs/<name>.md`.

**Type: the viewer's faces.** Latin text is Inter Variable and code JetBrains Mono Variable, the
faces of CodeGraph's browser viewer, whose captures fill the home page and the viewer guide —
§10's reason for Instrument Sans on the Voltip site. Both are self-hosted from
`@fontsource-variable` 5.3.0 and loaded by `unicode-range`; hanzi stay on the system faces.

**Status: `available` and `preview`.** The browser viewer ships switched off behind
`CODEGRAPH_UI=1` and may still change, so it is `preview`, drawn like pt-tools' `experimental`:
orange text behind an orange ring. Everything else is `available`.

**Hero and bands.** The hero has one capture, the viewer's Symbol view, and no motion. The bands
after it: the feature index, four steps from install to the first answer, three
text-and-evidence splits (coding agents with a question → command → MCP tool table, the viewer
with its Flow capture, languages with an extraction-depth table), the platform table, what stays
on the machine, the install commands and what CodeGraph does not do (a dashed plate). The
Chinese headline is set with `word-break: keep-all` and `text-wrap: balance`, so it breaks at
its comma instead of inside a word (§1 "Script-dependent metrics").

**Screenshots: the real viewer on CodeGraph's own index.** Every capture is the browser viewer
reading codegraph-rust indexed at a fixed commit, taken by that repository's
`docs/site/tools/capture-screens.sh` at 1440 × 900 in both themes. The viewer's interface is
English only, so one set serves both languages. The viewer's own brand is violet; it appears
only inside the captures, never in the site's CSS, so the no-purple rule (§10) still holds.

**Mark.** CodeGraph's mark is the viewer's BrandMark (two linked nodes on a 36 grid), drawn here
on the navy app tile with a pale outline and an orange node instead of the viewer's violet
gradient. The same drawing is the site's logo (`codegraph-logo.svg`, owned by codegraph-rust) and
the catalog's `AppIcon`, which until now drew three placeholder nodes.

**Checks beyond §12.** `check-dist.sh` also resolves every root-relative link and asset to a file
the build emitted, which covers the frontmatter links VitePress's dead-link check does not see.
The sync additionally rejects a screenshot a page names that does not exist, CodeGraph's crate
names on user pages, and an unversioned "sub-millisecond" claim.

**A copied defect, fixed here only.** pt-tools' `home.css` lacks the base `display: grid` rule
for its privacy band, so its three cards stack at every width; this site adds the rule. The
pt-tools site is left as it is.
