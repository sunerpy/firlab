# FirLab — Design System

Bilingual (Chinese-default) site for FirLab's open-source projects at firlab.app. Zero
client-side framework, static output, and web fonts for Latin text only. This file is the
implementation contract: no component may introduce a colour, size, spacing step or motion rule
that is not named here.

**Locales.** `zh-cn` owns the bare root (`/`); `en` lives at `/en/`. Chinese is the
primary audience and the apex URL was already indexed, so `prefixDefaultLocale` is
`false` — `/` is never redirected. Both locales render from ONE component per page
(`HomePage.astro`, `AgentLensPage.astro`, …), which keeps them structurally identical:
a section added to Chinese cannot silently go missing from English.

## 0. Direction

**The 2026-11-03 redesign draws the site the way voltip.firlab.app draws the brand** (「墨白」,
§10). The owner asked for the main site to be redesigned after the Voltip site, reviewed an HTML
draft built from the site's own data (`firlab-design/site-redesign-2026-11-03/`, outside the
repository), asked for a headline that no longer lists the categories and a more modern home
page, and approved the second draft as it stood. What it changed:

- **Ground and surfaces.** The page is the sheet tone `#FBFCFE`, cards and menus are white with a
  hairline, and the desk tone `#F3F6FA` is the ground of capture wells and command blocks. The
  previous build painted the page in the desk tone with white cards on it.
- **Ink is the accent.** The primary action is an ink pill, links are body ink with a soft
  underline, and the brand orange stays a mark (the wordmark's arm, status dots, the reading
  progress and one claim rule). The previous build's text accent `#B03A09` is gone.
- **Faces.** Instrument Sans and JetBrains Mono, the Voltip app's own, Latin subsets only; hanzi
  stay on the system faces (§1 "Type").
- **Shape.** Pill buttons, and corners of 4 / 8 / 12px (previously 6 / 10 / 16 with no pills).
- **The home page as one editorial sheet.** A hero with the brand set at 148px; then bands, each
  opening on a hairline, with the title in the wider left column and its words in the right; a
  catalog whose cards show each project itself — a real capture, or the lines of a real session
  for a project with no window; a release ledger; one closing band for feedback and every place
  to follow FirLab; and a footer with a column per category.
- **Words.** The headline says what FirLab makes without listing categories (「开源软件，从日常应用
  到开发者工具」), the catalog is 「项目」 rather than 「应用」, and the categories are named 应用 /
  开发者工具 / 服务与网关 (previously 桌面应用 / 命令行工具 / 自部署服务). The category ids did not
  change.

**Kept from the 2026-10-02 build,** which made the site a catalog: the one rule that **a new
project is one entry in `src/i18n/products.ts`** (§4) and every surface renders from that list;
the brand ramp read off the product marks; the dark ramp and its corrections; the three-state
theme control; the per-script metrics; version provenance; the structured-data IRIs; the
CSS-only filter and motion mechanics; and the AgentLens page's structure. Before that build the
site was a technical-editorial index with a serif face and one hand-made band per product, which
the owner rejected because its copy read as written by AI and it did not scale.

**Sources.** Palette: the shipped product marks — `#0B1220` ink, `#E7EDF5` pale slate, `#F97316`
orange, `#14B8A6` teal, `#64748B` slate. Faces, shapes, the nav, the band rhythm and the footer:
the Voltip site's theme (`voltip/src/.vitepress/theme/`, §10). App icons: the shipped icons' own
geometry (`AppIcon.astro` names each source file). Captures and sessions: each project's own
documentation site (`showcase.ts` names each source). Rejected: a hero visual of a drawn device or
window, copy that counts the projects, and a separate card for the Official Account.

## 1. Design tokens

Defined in `src/styles/global.css`. Semantic aliases go through `@theme inline` so one class
set serves both themes; the raw values swap for the dark theme.

### Colour — raw ramp

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--ink-900` | `#0B1220` | `#ECEFF3` | headings, strong text, the ink pill's ground |
| `--ink-700` | `#1E293B` | `#D4D8DD` | menu rows, an early release's status, facts |
| `--ink-500` | `#475569` | `#ABB0B7` | body |
| `--ink-400` | `#5B6779` | `#9499A0` | meta, captions, dates |
| `--paper-0` | `#FBFCFE` | `#101317` | the sheet: the page ground |
| `--paper-1` | `#F3F6FA` | `#0C0F13` | the desk: capture wells, command blocks |
| `--paper-soft` | `#EEF2F7` | `#181C21` | a hovered ledger row, chips |
| `--paper-elv` | `#FFFFFF` | `#1F2329` | cards, menus, the ledger, a session's plate |
| `--paper-2` | `#E7EDF5` | `#2A2F35` | kept for the sub-sites |
| `--rule` | `#DCE4EE` | `#353B43` | hairline |
| `--rule-strong` | `#CFD8E3` | `#4A515B` | an outlined pill, a hovered card, a version chip |
| `--accent` | `= --ink-900` | `= --ink-900` | the ink pill, focus rings |
| `--accent-ink` | `#FFFFFF` | `#0C0F13` | text on the ink pill |
| `--fill` | ink at 6 % | ink at 9 % | hover and open fills of icon controls and menu rows |
| `--link-line` | ink at 30 % | ink at 34 % | a link's underline; full ink on hover |
| `--mark` | `#F97316` | `#F97316` | marks only — never text |
| `--live` / `--live-mark` | `#0D6B64` / `#14B8A6` | `#2DD4BF` / `#2DD4BF` | "actively maintained": its text and its dot; a session's result line |

`#F97316` measures 2.73:1 on the sheet, so it never carries text. The previous text accent
`#B03A09` existed to make orange legible as text; with ink as the accent there is no orange text
to make legible.

### Surfaces

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--tile` | `#0B1220` | `#0B1220` | an app icon's tile — the shipped icons' own navy, not themed |
| `--tile-edge` | `rgb(255 255 255 / 0.04)` | `rgb(255 255 255 / 0.1)` | the tile's rim, so it keeps its silhouette on the dark page |
| `--qr-plate` | `#FFFFFF` | `#FFFFFF` | a QR code's plate: a scanner needs a light ground |

A card is a white sheet with a hairline lying on the sheet tone, so it reads as an object
without a heavy shadow; in the dark theme it is lifted to `#1F2329` and carried mostly by the lit
rule.

### The dark ramp, measured in OKLCH

The dark ramp was rebuilt in an earlier pass after "the background and content area feel
oppressive", and the fix still holds: low chroma on the ground (C ≈ 0.0095, rising up the ramp
to 0.0162 at `--rule`, the way Radix slate does), ink chroma cut to ≈ 0.011 with lightness held,
`--rule` lit to +16.5 L above the page's neighbour step, and near-white capped at L 95.1 to avoid
halation. `--paper-soft` and `--paper-elv` are the two steps the Voltip site added on the same
curve (§10). Elevation in dark mode is carried by light — a faint white top edge on cards and
menus — because a dark shadow has nothing left to darken.

### Theme selection — system is the default, not the only option

Three states, in an icon menu in the bar whose icon shows the state the page is in:
`system` (a monitor) · `light` (a sun) · `dark` (a moon).

| State | `<html>` | Ramp source |
| --- | --- | --- |
| `system` (default) | no `data-theme` | `prefers-color-scheme` |
| `light` | `data-theme="light"` | base `:root` |
| `dark` | `data-theme="dark"` | dark override |

- Absence of `data-theme` is load-bearing: `system` removes the stored key rather than storing
  a third value, so a visitor who never touches the control keeps tracking the OS. The summary's
  icon is picked by the same attribute in CSS (`.u-ti`), so it is right from the first paint.
- The dark ramp is written **twice** in `global.css` — under the media query and under
  `:root[data-theme="dark"]` — because CSS cannot OR a media query with a selector. One ramp:
  change both or neither.
- `color-scheme` follows the pinned theme, so scrollbars and form controls match it.
- `theme-color` is the page ground, `#FBFCFE` / `#101317`, written in three places that must
  agree byte for byte: the two media-scoped metas in `Layout.astro`, the pre-paint script, and
  `GROUND` in `ThemeSwitch.astro`. A pinned theme inserts a media-less `<meta>` first in `<head>`.
- Persistence is `localStorage['firlab-theme']`, the only thing the site stores, wrapped in
  `try/catch`. A parser-blocking inline script applies it before first paint; the control ships
  `display: none` and is revealed by `html[data-js]`. Choosing a state closes the menu and returns
  focus to its summary.

### Semantic aliases

`--color-ink`, `--color-ink-soft`, `--color-ink-body`, `--color-ink-mute`, `--color-paper`
(page), `--color-desk`, `--color-panel` (card), `--color-block` (soft), `--color-rule`,
`--color-rule-strong`, `--color-fill`, `--color-accent`, `--color-mark`, `--color-live`,
`--color-tile`; `--font-sans` and `--font-mono` alias `--font-text` and `--font-code`. Utilities
in components use only these.

### Type

| Token | Stack |
| --- | --- |
| `--font-text` | `"Instrument Sans Variable", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans SC", "Noto Sans CJK SC", system-ui, -apple-system, "Segoe UI", sans-serif`; the Chinese page puts `"Punctuation SC"` first |
| `--font-code` | `"JetBrains Mono Variable", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas`, then the CJK tail |

**Latin from the web, hanzi from the system.** Instrument Sans and JetBrains Mono are the
Voltip app's own faces, self-hosted from `@fontsource-variable` 5.3.0 (imported by
`Layout.astro`, so nothing is fetched from a third party) and loaded by `unicode-range`: a page
fetches the 30 KB Latin Instrument Sans file and, for its versions and dates, the 40 KB Latin
JetBrains Mono file; the other subsets are emitted but only fetched for text that needs them.
Instrument Sans's Latin file is preloaded, because it sets the brand line, the first thing
painted. The reason the site had no web fonts still holds for CJK — one CJK weight is several
megabytes even subset — and does not apply to Latin files of this size; matching the app's face
is what makes the captures and the page read as one product (the Voltip site's argument, §10).

`Punctuation SC` is VitePress's trick, as the Voltip site uses it: quotes, dashes, the ellipsis
and the middle dot come from the CJK face, so Chinese keeps full-width punctuation although the
Latin face comes first. Only the Chinese page's stack carries it; on the English page those
characters stay Latin.

Weights: 700 for display, 650 for the wordmark and card names, 600 for labels and menu names,
500 for links, buttons and tabs.

| Size | Use |
| --- | --- |
| `clamp(72px, 11vw, 148px)`, line 0.92, −0.048em | the home page's brand line, "FirLab" |
| `clamp(24px, 3.5vw, 42px)`, line 1.24 | the h1's second line, at most 13em wide |
| `clamp(30px, 5.4vw, 46px)` | a band's title; `clamp(34px, 6vw, 56px)` for the closing band |
| 17px, 18px from 640 / 768px | a hero or band lede |
| 18px / 14.5px / 13px | a card's name / text / kind and platforms |
| 12–12.5px mono | versions, dates, counts |
| `--text-display` `clamp(2.125rem, 1.55rem + 2.3vw, 3.25rem)` | a product page's h1 |
| `--text-title` / `--text-title-sm` | product-page sections |
| `--text-lede` `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | a product page's lede |
| `--text-meta` `0.75rem` | mono uppercase labels |

### Script-dependent metrics

Latin-tuned leading and tracking are wrong for hanzi, so the metrics are tokens switched by
`html:lang(zh-CN)`, unlayered on purpose (an unlayered declaration outranks every layered one):

| Token | Latin | Chinese | Applies to |
| --- | --- | --- | --- |
| `--lh-prose` | `1.7` | `1.85` | `body`, running copy (the Voltip site's values) |
| `--lh-display` | `1.12` | `1.3` | `.u-display` |
| `--ls-display` | `-0.022em` | `0.006em` | headings |
| `--lh-lede` | `1.6` | `1.85` | `.u-lede` |
| `--measure-prose` | `36em` | `29em` | `.u-measure` (~66 Latin characters, ~29 hanzi) |
| `--measure-lede` | `34em` | `32em` | `.u-lede` |

- Headings keep a CJK word whole (`word-break: keep-all`) and break a long Latin identifier
  (`overflow-wrap: anywhere`).
- `text-wrap: balance` on headings and on `p`, `li` and `dd`: `pretty` leaves one or two hanzi
  alone on a last line in Chrome (measured on the Voltip site, §10). Product-page prose
  (`.u-measure`, `.u-lede`) is the exception and stays `pretty`: balance narrowed a five-line
  paragraph to an even block a third short of its column.
- **Clauses that must not break inside are inline-block runs** (`.u-run`). The h1's second line
  is written as phrases (`开源软件，` + `从日常应用到开发者工具`), the ledes as clauses; a run that
  fits its line stays whole, one that does not still wraps inside its own box. English sets a
  space between runs; Chinese sets none after `，` or `。`. Because headings keep CJK words whole,
  the second phrase carries a zero-width space after 「应用」, its one break opportunity for a
  line narrower than the phrase.
- `code, kbd, samp, pre { letter-spacing: normal }` — inherited tracking breaks command columns.
- Chinese display headings omit the trailing `。`.

### Spacing

8px base, Tailwind's default numeric scale on product pages. The gutter steps with the viewport:
24px, 48px from 640px, 64px from 960px (`--gutter`), Voltip's values.

### Radius — three steps, the pill and the icon

| Token | Value | Use |
| --- | --- | --- |
| `--radius-chip` | `4px` | version chips, QR images, small rows |
| `--radius-control` | `8px` | icon controls, menu rows, a capture's plate |
| `--radius-card` | `12px` | cards, menus, the ledger, figures, tiles |
| `--radius-pill` | `999px` | buttons, and only buttons |
| (icon) | 22% of its size | an app icon, as the shipped icons draw it |

### Depth

`--shadow-card` (resting card), `--shadow-lift` (hovered card, a capture's plate),
`--shadow-pop` (menus) — a hairline plus one tightly spread shadow. Dark mode uses a white top
edge instead (above).

## 2. Layout

### The column

`.u-shell` is the only container: `max-width: calc(72rem + 2 × gutter)`, centred,
`padding-inline: var(--gutter)`. A band's hairline (`.u-section::before`) is the column's width,
`calc(100% − 2 × gutter)` up to 72rem.

### Header

`SiteHeader.astro`, sticky, 64px, the page ground (no blur) and a bottom hairline. Left to
right: the wordmark (the bracket glyph and "FirLab" in the text face, 19px / 650); the menu in
plain words — **项目** (a disclosure), **最近发布**, **问题与建议** — where a hovered word gets a
pale 2px line under it and the current one an ink line (on a product page, 项目); then the tools:
the language and theme icon menus, the Official Account from 1024px and the ink GitHub pill from
768px. Measured with both shown, the bar ran 19px into the gutter at 768px, so the Official
Account waits for 1024px; it stays reachable from the hero and the footer. Below 768px the words
give way to one menu button.

Every menu is a `<details data-popover>` disclosure — it works with scripting off and announces
its state natively; the layout's script adds Escape (focus returns to the summary),
outside-click, one-open-at-a-time, and closing a menu when one of its links is followed, which a
link to a section of the same page would otherwise leave open over it.

- **The projects menu** lists every project, a column per category, each with its icon, its name
  and `version · date`, and links to the catalog and the releases. From 1024px it opens under its
  word, 720px wide; between 768 and 1024px, where 720px from the word would run past the column,
  it is placed against the bar's column instead.
- **The phone sheet** holds the same columns and the three links (releases, feedback, GitHub). It
  is placed against the bar's column, so it uses the whole width of a 320px screen, and scrolls
  inside itself when the screen is shorter than the list.
- The icon menus open 6px under the bar, level with the projects menu, not 6px under their 36px
  control.
- On a product page that project's row is `aria-current="page"` and not a link.

### Home page

1. **Hero.** The h1 in two parts — "FirLab" at up to 148px, then what FirLab offers, at most
   13em wide — on the left; from 960px the right column holds the lede, the actions (the GitHub
   ink pill and 「关注公众号」, an outlined pill that opens the QR code) and three generated facts:
   the platforms the catalog ships for, the newest release with a link to the ledger, and that the
   site runs no analytics and sets no cookies. Below 640px the actions are full width.
2. **Projects** (`#projects`). The band head (title left, its words right from 960px); a row of
   underlined tabs — 全部 and a tab per category with its count; and the grid, one, two (640px) and
   three (1100px) columns. Each card opens with a well (§3 `AppCard`).
3. **Latest releases** (`#releases`). One ledger in a card: date, project, version chip, kind and
   「发布说明 ↗」 per row, newest first, capped at six, the whole row the link. Below 768px a row
   keeps the project with its date under it, the version and the arrow.
4. **Bugs and requests** (`#feedback`). The closing band: the title, the words, a 「前往 GitHub」
   ink pill, and six tiles — GitHub, Bilibili, Zhihu and X as links, the personal WeChat and the
   Official Account as QR disclosures. The two QR panels are placed against the tile grid, so the
   middle column's panel stays on a 320px screen.
5. **Footer.**

### Product pages

`ProductHeader` (breadcrumb FirLab / 项目 / name; the 72px icon and the h1; kind · platforms;
the mono role line; the lede; actions — 安装, an ink pill, when the page has an install section,
and the GitHub repository; and a fact card with status, version, release date, licence, extra
facts, the releases link and the page's section index). Then the page's own sections, unchanged
in structure, on the band rhythm: `.u-band-open` draws a rule and opens a movement (96px above
from 768px), `.u-band-next` continues one (64px), `.u-band-tight` binds to the section above
(32px). Then `NextProduct` and the footer.

### Footer

One shape on every page: the wordmark, a one-line blurb and the Official Account's QR code with
its name; a column per category listing its projects, and the profiles with their text labels;
then the line with the copyright, 「无统计代码，无 Cookie」 and the two languages. The four columns
are one `<nav>`: two columns from 360px, four from 768px, and beside the identity from 1100px.

## 3. Components

| Component | Contract |
| --- | --- |
| `SiteHeader` | §2. Wordmark · menu · language · theme · Official Account · GitHub · phone menu. |
| `ProjectGroups` | Every project, a column per category, icon, name and `version · date`; rendered in the projects menu and the phone sheet, with an id prefix per use. |
| `AppIcon` | Each product's shipped icon on the 100-unit grid, tile included, inline SVG (no request). Decorative beside a visible name; pass `label` where it stands alone. Takes a `view-transition-name`. |
| `AppCard` | One per project, identical for all: the well, then icon, name (the stretched link), kind and status, tagline, platforms, `version  date`, and the GitHub link and an arrow above the stretch. The status sits at the end of the title's row while both fit and wraps under the title when they do not. Hover lifts the card 2px and shifts its plate 4px toward its corner; focus rings the card. |
| The well | `showcase.ts`: a capture in its light and dark take (per language where the project took one per language), set at 205% of the well's width from 20px inside its top-left corner, so it keeps one real corner and runs off the other two; or a session in mono on a white plate — commands after `$`, the result in `--live`, an MCP call's tool name in ink. The take not shown is `display: none`, which a lazy image is never fetched for. Decorative: the name and tagline say what it shows. |
| `AppCatalog` | Band head, tabs, grid. Radio inputs plus `:has()`, no script; the hiding rules are generated per category present; the tabs are hidden without `:has()` support and absent with one category. The tabs' hairline is a background inside their scrollport, where the current tab's ink line can cover it. |
| `ReleaseList` | §2. Built from `versions.ts` through the catalog. |
| `ContactSection` | §2, the closing band. |
| `ProductHeader` | §2. All facts from the catalog entry, so a page cannot disagree with its card. |
| `NextProduct` | A card linking to the next project in catalog order; wraps and says so. A `<nav>` outside `<main>`. |
| `SiteFooter` | §2. |
| `StatusTag` | Text plus a dot, never colour alone: `live` 持续更新 in `--live` with a teal dot, `early` 早期版本 in `--ink-700` with an orange dot, `wip` 开发中 in `--ink-400`. |
| `ThemeSwitch`, `LangSwitch` | Icon menus, 36px. The theme menu's rows are buttons with `aria-pressed`; the language menu names each language in itself, marks the current one with `aria-current` and a check, and keeps the current page's slug. |
| `Icon` | The chrome's line icons, Lucide-style 24-grid paths, always decorative. |
| `InstallBlock` | Selectable commands; long commands wrap rather than scroll; the copy button appears only when `navigator.clipboard.writeText` exists. |
| `SpecGrid`, `DetailSection`, `ScreenFigure` | Product-page primitives, restyled through the tokens. |
| `Wordmark` | The bracket glyph, its top arm orange, and "FirLab" in the text face. |

Cards use the stretched-link pattern: the name's link carries a `::after` that covers the card;
secondary links sit above it. One anchor per destination, no link inside a link, and the
accessible name is the project's name. A ledger row does the same with its release-notes link.

## 4. The catalog

`src/i18n/products.ts` is the single list. Each entry: `id`, `name`, `category` (`service` |
`cli` | `desktop`), `platforms`, `status`, `version` / `released` (imported from `versions.ts`),
`license`, `repo`, `page` (`{ slug }` for an in-site page, `{ href }` per locale for a
documentation site under firlab.app, `{ site }` per locale for a website on the product's own
domain), and a one-sentence `tagline` per locale. Array order is the cards' order;
`CATEGORY_ORDER` (`desktop`, `cli`, `service`) is the order of the tabs, the menu's columns and
the footer's, everyday apps first as the headline reads. `productKind` names one project: its
category, or 「桌面与手机应用」 for a desktop app that also ships for Android.

**A product on its own domain is linked at that site's home page** — `/zh/` or `/` — from the
card, the projects menu, the footer, the pager and the ItemList JSON-LD alike (`productHref`),
never at a page here, and it has no page here (2026-10-03: Voltip, `voltip.firlab.app`). Its
former URLs stay in `redirects` in `astro.config.mjs`, pointing at the site's home page in one
hop: `/voltip/` and `/en/voltip/`, and Voxera's `/voxera/` and `/en/voxera/`.

**Adding a project:**

1. An entry in `products.ts`.
2. Two constants in `src/i18n/versions.ts` (the tag and its UTC release date) and a row in
   `scripts/check-versions.mjs`.
3. Its icon in `AppIcon.astro`, lifted from the project's shipped icon.
4. What its card shows, in `src/i18n/showcase.ts` — a capture copied from its documentation
   site into `public/screens/` (light and dark, 1440 × 900), or the session from its
   documentation home page. The `Record` type makes a missing entry a type error.
5. Where its name leads: an in-site page under `src/pages/` (`page.slug`, built on
   `ProductHeader`), the paths of its documentation site (`page.href`), or the home page of its
   website on its own domain (`page.site`).

Nothing else: the grid, tab counts, release list, projects menu, footer, pager and JSON-LD
follow. A new category needs its labels in `ui.ts` (`category.*` for one project, `filter.*`
for the group) and a place in `CATEGORY_ORDER`.

**Taglines** state what the project does in one plain sentence. They inherit the factual
constraints listed at the top of `products.ts` (pt-tools downloads free torrents unless a filter
rule widens it; CodeGraph has no model; Voltip's cloud paths send audio or text out; Lockra goes
online for updates and opt-in sync; and the rest listed there).

### Version provenance — one constant per fact, checked against the tag

`versions.ts` owns every version and release date, one exported constant each, and every surface
reads it through the catalog. **The source of truth is the GitHub release tag**, never a product
manifest (manifests trail their tags) and never the release title (titles are not one format);
dates come from `published_at` in UTC.

**The build does not fetch.** `scripts/check-versions.mjs` does, and its three-way exit code is
the contract: `0` matches the latest stable release, `1` is proven drift, `2` means the API could
not give a verdict (`VERSION CHECK INCOMPLETE`, never reported as drift). With `--write` it
rewrites the drifted constants instead and exits `0`; a tag whose prefix moved is still `1` and is
left to a person. `sync-versions.yml` runs it every half hour, commits `versions.ts` alone to
`main` as `chore(site): 同步 … 的发布版本` and dispatches `deploy.yml`, so a release reaches the
site within the hour. A failed run is the alarm; nothing is committed then.

This replaced a pull-request check and a daily drift issue (user decision 2026-10-07): every
release of any of the products turned every open pull request red until someone opened a
hand-made version pull request, fifteen of them in four days. The values the bot writes come
straight from the release API and are validated (stable, not a draft, a tag of version
characters), so there is nothing left for a reviewer to judge. Pull requests no longer run the
check: they build with the committed values.

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
- **Name and count nothing in shared prose.** The headline, the ledes, the description, the
  footer and the band titles must survive a new project unchanged. The headline says what FirLab
  makes without listing categories, because a list of categories goes stale the day a project
  does not fit it — which is what the owner found wrong with 「开源的桌面应用、命令行工具与自部署服务」.
  Counts and names that do appear (the tab counts, the newest release, the platform list) are
  generated from the catalog.
- **「项目」, not 「应用」, for what the catalog holds**: it holds developer tools and gateways as
  well as apps. 「应用」 remains the name of the desktop category.
- **Plain statements, no slogans or manifestos.** If a line would read as well on any other
  site, cut it. Section headings say what the section holds (项目, 最近发布, 问题与建议, 安装,
  技术栈).
- **Facts come from the product's README and release tags**, with the constraints in
  `products.ts`. Unknown means "say nothing", never a guess.
- Chinese copy quotes with 「」 and sets real spaces around Latin runs.

## 6. Motion

CSS only. The home page moves on hover alone; the product pages also reveal their bands on
scroll. Every scroll and entrance animation is inside `prefers-reduced-motion: no-preference`
plus an `@supports` gate, so an unsupporting or motion-averse browser renders the final state.

| Mechanism | Where |
| --- | --- |
| Hover | a card lifts 2px and gains `--shadow-lift`, and its plate shifts 4px toward its corner over 400ms; a tile lifts 2px; the projects menu's chevron turns |
| `u-enter` — time-based, staggered by child | a product page's header, which is on screen at first paint |
| `u-reveal` — `animation-timeline: view()` | each product-page section, the pager |
| `u-stagger` — `view()` with offset ranges per child | product-page spec lists |
| `u-progress` — `scroll(root)` | the 2px orange reading rule at the top edge |
| `@view-transition { navigation: auto }` | a card's icon and name morph into the product page header (`mark-<id>`, `title-<id>`) |

Under `prefers-reduced-motion: reduce` transitions are neutralised and nothing lifts or shifts on
hover.

Two rules that are not style preferences:

- **Every timeline is assigned through `var(--u-timeline)`.** Given `animation: X linear both`
  next to `animation-timeline: view()`, Lightning CSS folds them into a shorthand Chrome
  rejects, and the animation silently never runs.
- **A scroll-driven animation and a hover transform cannot share an element.** A finished
  animation with `fill-mode: both` holds `transform: none` and overrides a hover lift.

## 7. Accessibility

Contrast, WCAG 2.x, every text pair on the surface it sits on:

| Text | Light page / card / desk / soft | Dark page / card / desk / soft |
| --- | --- | --- |
| `--ink-900` | 18.24 / 18.72 / 17.27 / 16.65 | 16.15 / 13.68 / 16.65 / 14.84 |
| `--ink-700` | 14.25 / 14.63 / 13.50 / 13.01 | 13.01 / 11.02 / 13.41 / 11.95 |
| `--ink-500` | 7.38 / 7.58 / 6.99 / 6.74 | 8.54 / 7.23 / 8.80 / 7.85 |
| `--ink-400` | 5.59 / 5.74 / 5.29 / **5.10** | 6.49 / **5.50** / 6.70 / 5.97 |
| `--live` | 6.19 / 6.36 / 5.86 / 5.65 | 10.01 / 8.48 / 10.32 / 9.19 |

The ink pill's text is 18.72:1 light and 16.65:1 dark (14.63 and 13.41 on hover). Nothing is
below 4.5:1; `#F97316` (2.73:1) never carries text.

- Landmarks: one `banner` (the header), `main`, `contentinfo`; navs are labelled (主导航,
  页脚导航, the breadcrumb, the pager, the page index). Exactly one `h1` per page, and no id is
  repeated (the menus' group headings carry a prefix per use).
- Every interactive element shows `:focus-visible` (a 2px ink ring); a card and a ledger row show
  it on themselves. Buttons are 48px tall (36px in the bar), icon controls 36px (32px in a card),
  tabs 46px, tiles 64px. Links stacked in the footer's columns are 33px apart, which meets WCAG
  2.5.8 through its spacing exception.
- Status is text plus a dot, never colour alone. Icons beside a visible name are hidden from
  assistive tech; icon-only controls carry a name and a title, and the footer repeats every
  profile with a text label. A card's well is hidden from assistive tech: the name and tagline
  say what it shows.
- The filter is a `fieldset` with a visually hidden legend and native radios: one tab stop,
  arrow keys move, the checked state is announced.
- Disclosures are native `<details>`; Escape closes and returns focus to the summary.
- The QR images carry descriptive `alt` text; the Official Account's name is also written out.
- `overflow-x: clip` (never `hidden`) on `html` and `body`, which keeps `position: sticky`.

## 8. Verified (2026-11-03)

Local build served by `astro preview`, the owner's Chrome over CDP.

- `astro check`: 0 errors, 0 warnings (its hints are all in an ignored `docs/dist`). `astro build`:
  4 pages plus the redirect pages; `dist/CNAME` is `firlab.app`.
- `/` and `/en/` at 320, 360, 375, 414, 640, 768, 960, 1024, 1100, 1280 and 1440px in frames of
  that width with a classic scroll bar, and also in an emulated phone or window — the Chinese page
  at 320, 375, 768, 1024 and 1440px, the English at 320, 768, 1024 and 1440px: no horizontal
  overflow, no element past the viewport outside a horizontal scroller,
  the bar's last control on the column's edge, no clickable text (buttons, menu words, tabs, card
  names, ledger links, footer links) on two lines, and no line of one or two hanzi. `/agentlens/`
  and `/en/agentlens/` at the same widths: no overflow; the release page's mono URL wraps at 320
  and 360px, as it did before. Every page: one `h1`, no repeated id, every same-page anchor
  present.
- Screenshots: `/` 1440 light, `/en/` 1440 dark with the projects menu open, `/` 375 with the
  phone sheet open, `/en/` 320, `/agentlens/` 1440 light and 375 dark.
- The projects menu opens 720px wide under its word at 1440px and across the column at 800px;
  the phone sheet spans the column at 375px, scrolls inside itself, closes when a link is followed
  and lands the section 80px under the top. The theme menu pins dark (attribute, `theme-color`
  meta, storage, the moon icon, focus back on the summary) and `system` clears all three. The
  开发者工具 tab shows the two developer tools and 全部 all nine.

Defects found by measuring in this pass, and fixed before the numbers above: the Chinese h1's
second line left 「具」 alone at 320px (its smallest size is now 24px, and the zero-width space in
§1 covers a 320px window with a scroll bar); the English status
「Actively maintained」 ran into 「bedrock-gateway」 at 1440px (the status now wraps under the
title); the icon menus opened 8px inside the bar (now level with the projects menu); balance
narrowed the AgentLens page's paragraphs a third short of their measure (product-page prose is
`pretty`); and `astro preview` refuses the `code-server` host name, so the pages were reviewed
on the host's address.

## 9. Accepted debt

- The English h1's second line takes four lines at 320px ("Open-source" / "software," / …).
- A long paragraph on the AgentLens page can still end on one or two hanzi (「趋势。」, 「全过。」):
  Chrome's `pretty` does not prevent it for CJK, and `balance`, which does, narrowed the
  paragraphs (§1). The live site had the same endings before this pass.
- Without `:has()` support the tabs are hidden and every card shows.
- Motion was not observed on scroll in this pass; the product page's timelines are the previous
  build's mechanics, unchanged.
- The home page repeats each app icon's inline SVG in the projects menu, the phone sheet, the
  cards and the ledger: 90 KB of HTML, 14 KB gzipped.
- AgentLens's card shows a different screen in each theme: its page has one dark capture (the
  overview by model) and no light capture of that screen, so the light take is the usage
  drill-down.
- `public/og.png` is a 1200 × 630 browser render of `public/og.svg` (Chrome on Windows, the
  owner's browser, 2026-11-03); re-render it when the SVG changes. It names no project, so a new
  one does not stale it.
- The `/voxera/` and `/en/pt-tools/` redirects stay: both URLs were indexed.

## 10. Product documentation sub-site: voltip.firlab.app

`voltip/` is a VitePress 1.6.4 site: the default theme without its fonts
(`vitepress/theme-without-fonts`) plus `voltip/src/.vitepress/theme/`. It inherits the §1
ramp, the §1 per-script metrics and the §7 contrast floor. This section records what it adds
and where it departed from the umbrella site, each with its reason; `voltip/README.md` covers
ownership and deployment. Since 2026-11-03 the umbrella site itself is drawn this way (§0), so
the departures below — pill buttons, ink links, the Latin faces — are now shared; they are kept
as they were recorded.

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
| Other buttons | outlined: `#CFD8E3` hairline, no fill (hover ink at 6 %, `#5B6779` edge); ink at 6 % until 2026-10-23 | the same: `#4A515B` hairline, ink at 9 % on hover |
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

**Layout (2026-09, the first layout; replaced by design A below).** The home page answers four questions above the fold, at 1280 × 800 and at
375 × 812: what it does (name, headline, tagline), where it runs and where the audio goes
(two fact rows), how to get it (the Download button). The hero puts the words left and a real
capture of the app's home page right, with the overlay pill below it cycling through its
three states. Then: the band that leads to the try page (below), the feature index (two columns of groups, each row with its status), one
dictation in four steps, three text-and-evidence splits that alternate sides (local and
cloud recognition with the model table, AI polish with a before-and-after, the phone with its
pairing methods), the platform table (rows become cards under 768 px), what leaves the
computer in each mode, the install commands and the roadmap with what is deliberately not
built. No gradients, glows or blur; no drawn window or phone frames; every screenshot is a
real capture of the app on its mock backend, framed by a hairline.

**Motion (2026-09 layout).** One animation: the pill cross-fade, opacity only, 2.6 s per state. With
`prefers-reduced-motion: reduce` the last state shows, still.

**Video and QR codes (2026-10-03).** `VideoFigure` frames the tutorial video like a screenshot:
the same hairline, radius and plate shadow, `preload="metadata"` and a poster, so a page costs no
video bytes until the reader presses play; the captions are burned into the picture. `QrCode` is
the pt-tools component on this site's tokens, with its white plate in both themes
(`--vt-qr-plate`) because a scanner needs a light ground.

**The try page and the way in (2026-10-12, the owner's pick of three drawn directions).** The
owner found the try page buried: one grey button among five in the hero, and a documentation page
whose sidebar, outline, three prose sections and pager outweighed the tool on it. Of the three
directions drawn and rendered on this theme, the owner took the band (B) for the way in and the
single column (A) for the page:

- The hero keeps three buttons: Download, Try it online, Quick start. The video and GitHub
  buttons left it; the video stays on What is Voltip, GitHub in the nav bar.
- Under the hero, `HomeTryBand` draws `home.try` (optional in `home-schema.ts`, so the site
  builds before the pages carry it): a plate with a microphone, the offer, a heard → polished
  sample and its own button, the whole plate one link target. The sample hides below 1100 px.
- The nav bar's try item is the one item drawn as an outlined pill, with a microphone from 1200 px;
  below that the English bar has no room for the icon beside a sidebar (measured at 1100 px: the
  last item ended at the window's edge), so the item keeps the other items' width.
- `guide/try.md` is a `layout: page` with `pageClass: vt-try-page` and `sidebar: false`: one
  centred column, the Markdown's title and line, then `TryVoltip`. A tool page with one action,
  so the home page's "no centred hero" does not apply. The record button is 112 px of ink with a
  hairline ring at rest and, while it records, an orange ring that follows the input level (still
  under reduced motion). The settings are three native selects drawn as pills (`field-sizing:
  content` where the browser has it) and the polish switch; both texts share one card, the heard
  one above, the polished one below, the step marked on the rule between them. A one-line note
  (nothing is kept, the hourly limits, the privacy link) and the app's line with the Download
  button close the page. What is sent where stays on the privacy page.
- Turnstile renders with `appearance: 'interaction-only'`: the page no longer opens on a
  checkbox, the record button waits, disabled, until the check has passed, and the widget shows
  only when Cloudflare needs a click.

Checked 2026-10-12 on the local build with the API answered in the page: both languages, both
themes, 390 / 768 / 960 / 1100 / 1200 / 1440 px, a full take (record, recognise, polish) and the
states in between. Nothing new overflows; the English bar at 768 px with a scroll bar already ended
25 px past the window before this change (the same on the live site).

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

**The home page in design A, "墨白" (2026-10-23, the owner's go-ahead on three drafts).** The
owner asked for a better-looking site after sayitapp.site/zh. Three directions were drawn as
standalone pages on the real captures (A 墨白: the reference's structure on this ink-and-paper
system; B 澄空: the app's glass theme, which breaks this section's no-blur, no-gradient rules;
C 夜空: a dark editorial home, which breaks the theme-follows-system rule). The owner approved the
look and asked for it to be built; A was built because it keeps every rule above. What the
reference taught, and what it was not followed in: each band makes one claim and shows one piece
of evidence, and the bands alternate between the sheet and the desk colour; its drawn terminal and
app windows were not copied (no drawn window frames, above), so every picture here is a capture
or the page's own text.

- *Two layouts, one schema.* `theme/data/home-schema.ts` accepts the 2026-09 layout (`HomeV1`)
  and the new one (`HomeV2`), told apart by `home.scene`, each strict. The firlab change ships
  first and renders voltip's old pages unchanged; voltip's pages then move to the new fields,
  which the build checks the same way. The new page sets `markdownStyles: false`, so its bands
  are full-width sections outside `.vp-doc` (`theme/styles/bands.css`), and `HomeMain` marks it
  `vt-home-v2`. Links in the frontmatter, which VitePress does not check, fail the build when they
  lead nowhere (`buildEnd` in `config/shared.ts`).
- *Hero.* The claim in 40–64 px (`clamp`), the tagline, Download and Try it online (the third
  hero button, Quick start, left with design A; it is in the footer and the guide), three checks
  under the buttons in teal marks. On the right, one real dictation (`HeroScene`): the overlay
  while speaking and the overlay after insertion are frames of a screen recording (zh: 0.1.7,
  en: 0.1.3, built-in service, Proofread), and the inserted sentence is the page's own text in a
  plain card, not a drawn window. A caret after it blinks four times and stays (under five
  seconds, WCAG 2.2.2); with reduced motion it does not blink. This is the page's one animation.
- *Bands.* Said and inserted pairs (the said card is dark in both themes, what polish dropped
  is struck through in the mark orange as `<del>`, and every result says whether it is a
  recorded output or an example); one sentence through four presets with connector lines, then
  the built-in scenes; the three recognition modes, each with a small diagram of where the audio
  goes; the phone beside two panels of the computer's phone page (captures cut along the
  panel's own rounded edge, so they carry no second frame); platform cards with the install
  commands, which stay the page's Markdown in a `.vp-doc` card so VitePress's tabs and copy
  button work; common questions as native `<details>`; a centred closer. Headings are 30–46 px,
  700, balanced (`text-wrap: balance`), and Chinese ones break at punctuation (`word-break:
  keep-all`).
- *Vendor marks* (Lobe Icons, MIT, the ones the app's provider cards use) are drawn in the text
  colour, not their own: two of them are purple and one is a gradient. A mark made of coloured
  facets keeps them as steps of opacity.
- *Radius.* Cards and plates keep 12 px and chips and badges 4–8 px: the drafts used 16–20 px
  and pill chips, which this section's 4 / 8 / 12 steps do not allow.
- *Nav bar.* The menu is one pill group with the current page lifted on paper. On pages without
  a sidebar (home, try page) two pills follow it from 1100 px, Try it online outlined and
  Download in ink (`NavActions`), and the menu's own try item steps aside there; beside a sidebar
  and on narrower screens the bar keeps the try item as before. The search field shows its label
  from 1380 px and its icon alone from 768 to 1379 px, and the items sit closer at 768–959 px.
  Measured with every page type in both languages at 768, 820, 960, 1024, 1100, 1180, 1280, 1380,
  1440 and 1680 px: the bar fits at every width, including English at 768 px, which used to end
  25 px past the window.
- *Footer.* `SiteFooter` replaces VPFooter by the same alias as `HomeMain`: on the pages without
  a sidebar it draws the brand, the WeChat Official Account's code on its white plate and the
  documentation in five columns (`themeConfig.vtFooter` in each language), above VitePress's
  licence and source line. Two columns on a phone, so every link stays on one line from 360 px;
  one column below.

Checked 2026-10-23 on the local build, Chrome: both languages, both themes, 320 / 375 / 768 /
1280 / 1440 px. Above the fold at 1280 × 800 the headline, both buttons and the checks end by
602 px (English) and 528 px (Chinese); at 375 × 812 the checks end by 628 px. No horizontal scroll
on the home pages at any of those widths (a long install command scrolls inside its code block),
no clickable text on two lines, and every image loads. The 2026-09 layout still builds and renders
with the new theme (checked on the content at voltip@02e85d1).

Checked again on the live site after the deploy (2026-10-23, Chrome 154), the same widths and
both themes: the same results, and every link and image on both home pages answers 200. Short
last lines were not caught locally: `text-wrap: pretty` left one word or one or two Chinese
characters alone at the end of 8 text blocks at 1280 px in Chinese (「据。」 in the hero, 「标处。」
in the phone band) and of 6 at 375 px in English ("Android." in the closer). Every text block on
the home page and in the footer now balances its lines. That left one: the English presets
heading, whose forced line break voltip's content drops. The presets' name column is 168 px, so
"Chinese ⇄ English" stays on one line.

**Hallmark slop test, 2026-10-23 (design A home page, both languages).** Pre-emit critique P4 H5
E4 S5 R5 V4, stamped at the top of `theme/styles/bands.css`. Fixed on the first build: margins
that a band-wide reset overrode (now a zero-specificity `:where()` reset), a heading that left one
word on its last line (balanced), a phone title on four lines in English (shortened to the guide
page's title), a QR caption that split 「六月水蓝」 (kept whole), and footer links that would wrap
at 320 px (one column below 360 px). Passes by justification: 42, the nav is VitePress's docs bar
restyled, as before; 7, pure white only on raised surfaces. Every other gate passes: no gradient,
glow or blur, no drawn chrome, no invented number (the one measurement names its hardware, and
examples are labelled as examples), two families, no italic heading, contrast at least 4.5:1
(the said card's muted text is 7.3:1 on `#0E1524`), and tokens for every colour.

**Design A, second pass (2026-10-24): the borrowed structure taken out.** The owner found the
page too close to the reference and asked for it to keep its content and look but stop following
the reference's layout and wording. What changed, band by band:

- *Rhythm.* No alternating sheet and desk bands: every band sits on the sheet and opens with a
  hairline as wide as the column. Every head puts its title in the wider left column and its words
  on the right, set against the title's last line (one column below 960 px). No eyebrows or section
  numbers (Hallmark gate 54).
- *Hero.* The claim in 56–84 px takes the left of the column; the tagline, the buttons and the
  three facts (a list with dots, no check marks) stand on the right; the recorded dictation runs
  across the whole column under them, its two stages side by side with an arrow between.
- *Said and inserted.* One ledger card: a row per example, what was said (muted, the dropped words
  struck through in the mark orange) beside what went in, an arrow between. No dark cards.
- *Presets.* One board: the recognised words across its top, each preset's output in a cell of a
  2 × 2 grid; the scenes below it as rows of name, apps and preset. No connector tree.
- *Recognition.* One comparison table, a column per mode whose rows line up across (subgrid): what
  it is, where the audio goes, its terms, its models or vendors; the default mode carries a line of
  ink across its head. The small "where the audio goes" diagrams are gone (`flow` and `scope` stay
  optional in the schema, unused); AI polish is one line of marks and names under the table.
- *Platforms.* One strip with a column per platform instead of four cards.
- *Questions.* Every answer open, in two columns; no disclosure widgets.
- *Closer.* Left-aligned words and buttons, and the shortcut as key caps on the right
  (`closer.keys`, optional).
- *Words.* voltip's content rewrites the headings and labels that paraphrased the reference
  (for example 「识别在哪里完成，由你选择」 → 「三种识别方式」, 「按住快捷键，开始说话」 → 「下载 Voltip」).

Checked 2026-10-24 on a local build, Chrome 154: both languages, both themes, 320 / 375 / 414 / 768
/ 960 / 1024 / 1100 / 1180 / 1280 / 1440 px: no horizontal scroll, no clickable text on two lines
(the English footer's two wrapped links at exactly 1100 px are the same on the live site), no text
block ending on one word or one or two characters, every image loads. The site still builds and
renders voltip's earlier content (voltip@4bdb360).

**Design A, third pass (2026-10-24): the nav bar, brand colours and more of the product.** The
owner asked for four things: a nav bar that no longer looks like the reference's, the scenes'
applications as coloured marks with their names under them, coloured vendor marks, and a home page
that says more about the product, in its own way.

- *Nav bar.* The menu is plain words on the bar, with no frame and no fill; the page you are in
  is marked by a 2 px ink line along the bar's lower edge, and hover draws the line in the rule
  colour. The try item is bold ink after the logo's three bars and cursor, with no frame (it was
  an outlined pill with a microphone); on pages without a sidebar the bar ends with the same try
  link and the Download pill. (Design A's selector for the flyout's button,
  `.VPNavBarMenuGroup .VPFlyout`, never matched: VitePress puts both classes on one element.)
- *Brand colours, an exception the owner asked for.* A mark keeps its own colours, on a 48 px
  tile tinted with them (10 % over the raised surface, 16 % in the dark theme), with its name
  under it; a black mark takes the text colour on a neutral tile. Some of these colours are
  purple (Kiro, Obsidian, SiliconFlow, facets of Model Studio's mark, Discord's blurple): the rule
  that nothing on the site is purple now reads "nothing of the site's own is purple". Brand
  colours appear only inside marks. Sources (`theme/data/marks.ts`): Lobe Icons (MIT) for the
  vendors and Kiro, Simple Icons (CC0) for the other applications. An application no open set
  carries a mark for (VS Code, Word, Outlook, WPS, OneNote, Slack, Teams, DingTalk, Feishu) is
  named in words, never drawn.
- *Scenes.* A card per built-in scene: its name and preset, its applications as tiles, the rest
  in words, and its extra instructions word for word as the app has them (the English page, whose
  app has the instructions in Chinese only, describes them instead). The four domain scenes list
  no application, so their tiles are line icons.
- *Two new bands, both optional in the schema.* `home.flow`: the six steps a dictation goes
  through, as nodes on one line (down the page below 1100 px), the two ends in ink.
  `home.more`: six features the page did not mention (dictionary and rules, a single key,
  computer audio and long recordings, fallback models, AI tools over MCP, the local service), as
  cells of one or two columns, each with one piece of evidence (a correction, key caps, chips, a
  chain or a command) and its guide page.
- *Words.* A fourth fact under the buttons (the built-in service is free and needs no key), a
  tagline that says what the product is, and two questions with honest answers: the shortcut need
  not be held, but there is no wake word and no stop on silence; the Windows installer is not
  code-signed and the macOS app is not notarized.

Checked 2026-10-24 on a local build, Chrome 154: both languages, both themes, 320 / 360 / 375 /
390 / 414 / 768 / 960 / 1100 / 1280 / 1440 px: no horizontal scroll, no clickable text on two
lines except the English footer's two links at exactly 1100 px (as on the live site), no text
block ending on one word or one or two characters, every image loads.

**The scenes' marks, checked against each owner's terms (2026-10-24).** The owner asked for the
applications still named in words to get marks too, from the open sets where possible and from the
owners' own assets otherwise; the owner chose to add only what the owners' terms allow. Added
from Simple Icons: Alacritty (its icon's licence is Apache-2.0) and WezTerm. Added as the owners'
own files, byte for byte (`theme/assets/brands/`, with their sources and terms): VS Code, whose
brand page accepts the icon used to link to the VS Code website and forbids modifying it or
adding a background, so it sits on no tile and links to code.visualstudio.com; LibreOffice Writer,
an MPL-2.0 file of the LibreOffice project, under The Document Foundation's policy that permits
its marks to refer factually to its products. Not added, because the owners' published terms
forbid this use without a written licence:

- Microsoft's other products (Word, Outlook, OneNote, Teams, Windows Terminal, PowerShell): its
  trademark page says its logos and app and product icons "can never be used without an express
  license"; Simple Icons removed every Microsoft icon after a notice from Microsoft
  (simple-icons#11236).
- Slack: its brand terms say most uses need a written licence and its logos may not be
  redistributed; Simple Icons removed Salesforce's icons (simple-icons#14140).
- Apple (Mail, Pages, Messages): Apple's guidelines for third parties forbid any Apple-owned
  icon without an express written trademark licence. The iMessage mark that came with Simple
  Icons left the bundle with this change.
- DingTalk, Feishu and Lark, WeCom, WPS: their brand rules require the owner's approval for a
  third party to show the logo; DingTalk's also forbids the symbol on its own.
- Typora: no published terms for its icon.

**The coding scene's agents (2026-10-25).** The owner asked for the logos of the coding agents
people dictate to: Claude Code, Codex, OpenCode and Pi Agent. They run inside the terminals the
coding scene names, so the scene applies to them through the terminal around them: the card shows
them as a group of their own under its applications (`tools`, with its label and its words). The
three drawn come from Lobe Icons (MIT) at commit 7d7d037, mono, on neutral tiles:

- Codex: OpenAI's brand guidelines (openai.com/brand, read 2026-10-25) let a third party use its
  marks where they relate directly to OpenAI's service, unaltered, never more prominent than the
  page's own name and without implying a partnership. Its colour file draws a solid tile, so the
  mono file is used.
- OpenCode publishes its marks for use (opencode.ai/brand); Pi Agent is MIT-licensed (pi.dev).

Not drawn: Claude Code. Its terms (code.claude.com/docs/en/legal-and-compliance and Anthropic's
trademark guidelines, read 2026-10-25) allow a plain-text statement that a product runs Claude
Code and require written permission for any other use of its name or logo, so it is named in the
group's words.

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
site; it is fixed on every documentation site since 2026-10-04 (§14).

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

**A copied defect.** pt-tools' `home.css` lacked the base `display: grid` rule for its privacy
band, so its three cards stacked at every width; this site added the rule, and pt-tools has it
since 2026-10-04 (§14).

**Community.** The Official Account's QR code is CodeGraph's community asset
(`public/community/`, owned by codegraph-rust like the screenshots), drawn by `QrCode`, the
pt-tools component on this site's tokens with its white plate (`--cg-qr-plate`). The sync
checks that every `/community/` file a page names exists, as it does for `/screens/`.

## 14. Fixes shared by the documentation sites (2026-10-04)

**The search button's label.** VitePress's search button prints its shortcut hint (Ctrl or ⌘,
then K) inside the button, so its visible text is its label followed by "K" while its accessible
name is the label alone: WCAG 2.5.3 Label in Name, which Lighthouse reports as
`label-content-name-mismatch` (§12). VitePress already draws the modifier as generated content;
every site's `theme/search-button.ts`, called from the theme's `setup` after mount and after
every route change, draws the letter the same way: it moves the key's text into `data-key`, which
`styles/base.css` renders with `content: attr(data-key)`, so the button looks the same and its
visible text is its label alone. It also marks the hint `aria-hidden` and gives the button
`aria-keyshortcuts="Control+K Meta+K"`. `aria-hidden` alone does not satisfy the rule, which reads
the visible text: the first version (#33) did only that, and axe-core 4.12.0, the version
Lighthouse 13.4 runs, still flagged the live button. VitePress's component is not copied, so an
upgrade needs no merge; check the class names (`.DocSearch-Button`, `.DocSearch-Button-Keys`,
`.DocSearch-Button-Key`) when VitePress is upgraded.

**The sidebar's group headers.** VitePress 1.6.4 renders every sidebar group's header as a `div`
with `role="button"` and `tabindex="0"`, and a collapsible group's caret as a second
`role="button"` inside it. axe-core 4.12.0 reports `nested-interactive` (WCAG 4.1.2) on every page
that shows a collapsible group, on all four sites; Lighthouse 13.4 does not run that rule, so its
accessibility score stayed 100. The header of a group that cannot collapse is also a focus stop
that does nothing. VitePress's main branch has since made the header a plain element and the caret
a real button with `aria-expanded` (vuejs/vitepress#3517, still open for 1.x). Every site's
`theme/sidebar-groups.ts`, called from the theme's `setup`, gives the rendered sidebar the same
semantics: the header keeps its click handler but loses the role and the focus stop; the caret
stays the one control, toggles on Enter (VitePress's handler, through the header) and on Space,
and reports its state through `aria-expanded`. Groups mount, re-render and collapse after the
first paint, so it runs again on every element or class change in the document, at most once per
frame. As with the search button, VitePress's component is not copied; check the class names
(`.VPSidebarItem`, `.item`, `.caret`, `.collapsed`) when VitePress is upgraded, and remove the
module once a VitePress release ships the fix.

**pt-tools' privacy band.** `.pt-privacy-grid` gains the `display: grid; gap: 16px` the other
sites have. Before, its three cards stacked full width with no gap even at 1800 px, because only
the ≥ 960 px column rule existed.

## 15. Product documentation inside firlab.app: firlab.app/kiro-provider

`kiro-provider/` is the §10 site for a fifth product, published like CodeGraph's (§13) under a path
of this site: VitePress builds it with `base: '/kiro-provider/'` and `deploy.yml` copies it to
`dist/kiro-provider/` after `kiro-provider/scripts/check-dist.sh` has passed. It keeps the VitePress
1.6.4 setup, the palette mapping, the button and link treatment, the code contrast table, the
`<main>` home root, the home-page frontmatter contract and the §14 fixes, through the same files
with a `kp-` prefix. This section records only where it departs from §10–§13, each with its
reason; `kiro-provider/README.md` covers ownership and deployment.

**A new path, not a replaced page (2026-10-05).** kiro-provider had no page on this site, so
nothing redirects. Its catalog entry (§4) is new: category `service`, `page.href` to this site in
each language. A first attempt at a `kiro-provider.firlab.app` subdomain was never published; the
owner asked for a route of firlab.app instead, for §11's reasons.

**English is the root locale, as on the Lockra site (§11).** kiro-provider's README and canonical
references are English, and most references have a Chinese translation
(`docs/readme/<NAME>.zh-CN.md`), so the sync publishes each reference in both languages at the
same path. The three that exist in English only get a generated Chinese pointer, `noindex`, left
out of the sitemap and without an edit link, CodeGraph's arrangement (§13) the other way round.
Each reference opens with a GitHub language line (`[简体中文](…) · English`); the sync drops it,
because the site's language menu does the same job. Links are rewritten as on the CodeGraph site,
and heading ids are GitHub's (`githubSlug`).

**Type: system faces.** kiro-provider has no interface whose face the page should match, so the
reason for Voltip's Instrument Sans and CodeGraph's Inter does not apply; the text uses the system
stack, as on the pt-tools site (§12), and code is JetBrains Mono Variable, self-hosted.

**Status: `available` and `opt-in`.** Web search (`web_search_enabled`) and the legacy Chat
Completions route ship switched off and work once the reader turns them on. They are `opt-in`:
ink text behind a slate ring, so a feature that is off until configured carries no hue (until
2026-10-05 it was CodeGraph's orange `preview` ring). Everything else is `available`.

**Hero: a recorded terminal session.** With no interface to capture, the hero's evidence is the
program's own output: two requests, one per API, and their answers, recorded against
kiro-provider 3.8.0 serving the default address, `127.0.0.1:8787`, in a container of its own, and
copied line for line (`HeroVisual`). Because the session uses the address a reader's own gateway
has, it needs no caption; the owner asked for no notes on how or when a run was recorded
(2026-10-05), and `caption` is optional in the schema. The frame is the site's
plate, a hairline and the plate shadow; there is no drawn window and nothing moves. The transcript
schema has a `continuation` kind for a command's further lines, which carry no prompt. Every line
is its own block with no whitespace between blocks, because inside `<pre>` a newline between two
blocks renders as an empty line; the first build double-spaced the session for that reason. The
hero carries two facts, not three: with three, the Install button fell below the fold at
1280 × 800.

**Bands.** The feature index (four groups: serve, accounts, clients, operate), four steps from
install to the first answer, three text-and-evidence splits that each show a table (the routes
with what they speak and whether they are on, the clients with their API and how each is set up,
web search with each API's tool and what the answer carries), the platform table, what goes where,
the install commands and what kiro-provider does not do (a dashed plate). The three tables share
one component (`ProofTable`) and one frontmatter shape (`columns`, `rows`, `code`, an optional
`caption`).

**Tables in the pages scroll in their own box.** The shared rule (`display: table`, code in a cell
kept on one line) let a table wider than the text column run under the outline and past the
window, where `overflow-x: clip` cut it off: at 1280 px eleven pages did, and the configuration
reference's first table (about 1,700 px) lost most of its columns. `config/shared.ts` wraps every
Markdown table in a `.kp-table-scroll` box that scrolls sideways, and `theme/table-scroll.ts` puts
a box that does scroll in the tab order (`tabindex="0"`, WCAG 2.1.1), measured again whenever the
box or its table changes size. The other documentation sites still have the shared rule.

**Mark (redrawn 2026-10-05).** kiro-provider ships no app icon, so its mark is drawn for this site
in the §1 values: a four-point spark, the model, at the centre of a pale ring with three connection
points, the clients one provider serves, on the navy tile. The spark is teal. The first drawing,
a request (an orange dot) between the loopback brackets of `[::1]`, was replaced because the owner
asked for a mark that is not orange and that shows AI and a provider. The site follows the mark: `--kp-mark` (text selection, search
highlight, the soft brand tint) and the social card's hairline are teal, and nothing on the site
is orange. The same drawing is the site's logo (`kiro-provider-logo.svg`, owned by kiro-provider)
and the catalog's `AppIcon`.

**Verified 2026-10-05 (local preview, Chrome).** At 1280 × 800, 1440 × 900 and 375 × 812, the
headline, both facts and the Install button end above the fold in both languages (the lowest,
English at 375 × 812, ends at 725 of 812 px). No horizontal overflow at 375
or 1280 px on 35 pages (both home pages, every guide page, the references, a Chinese pointer), no
broken image, and all 532 in-site anchors resolve. Lighthouse: accessibility 100 and SEO 100 on
the English home page (mobile) and the Chinese configuration reference (desktop); best practices
78 only for HTTPS, which the local preview does not serve. The configuration reference shows a
layout shift of 0.12 while JetBrains Mono loads, which Lighthouse reports only in its agentic
browsing category.

**Verified again 2026-10-05, after the client pages, the new mark and the table boxes (local
preview, Chrome).** On the 57 pages of the sitemap at 375 and 1280 px, no page scrolls sideways,
no table box runs past the text column, and every box that scrolls is focusable. Lighthouse:
accessibility 100 and SEO 100 on the configuration reference (desktop) and the Chinese Crush page
(mobile); best practices 78 only for HTTPS.

## 16. Product documentation inside firlab.app: firlab.app/winer

`winer/` is the §10 site for winer, published like pt-tools' (§12) under a path of this site:
VitePress builds it with `base: '/winer/'` and `deploy.yml` copies it to `dist/winer/` after
`winer/scripts/check-dist.sh` has passed. It is the pt-tools site with a `wn-` prefix: the same
VitePress 1.6.4 setup, palette mapping, buttons and links, code contrast table, `<main>` home
root, home-page frontmatter contract, Chinese alert titles, system faces and §14 fixes. This
section records only where it departs, each with its reason; `winer/README.md` covers ownership
and deployment.

**A new path, not a replaced page (2026-10-06).** winer had no page on this site, so nothing
redirects. Its catalog entry (§4) is new: category `desktop`, Windows only, `page.href` to this
site in each language. The owner asked for a path of firlab.app rather than a DNS name of its own,
for §11's reasons.

**Chinese is the root locale, as on the pt-tools site (§12).** winer is tested on the Tencent
client and its window opens in Chinese, so `/winer/` is Chinese and English sits under
`/winer/en/`; `x-default` points at the Chinese page. Unlike pt-tools, winer writes every page in
both languages (`docs/site/` and `docs/site/en/`) and the sync refuses a page that exists in one
language only, so there are no generated placeholders.

**The words come from winer.** `winer/scripts/sync-winer-docs.sh` copies winer's `docs/site/`
and its mark. Besides the pt-tools sync's checks it refuses a page that names a screenshot
`docs/site/public/screens/` does not have, or that uses a name from winer's code (`SeatRating`,
`TierSet` and the like) or a colloquial word: the pages are a user guide in standard written
language.

**Mark: the gold hexagon badge (user decision 2026-10-06).** winer's mark is a gold hexagon with a
W cut through it, which the owner chose from the concepts drawn for it. winer's
`scripts/brand/icons.py` generates it; the site's logo and favicon are its `app-icon.svg`, synced
as `winer-logo.svg`, and the catalog's `AppIcon` draws the same paths on the navy tile with the
gradient flattened to the tray glyph's gold (#E3BD66). The gold measures 1.9:1 on paper, so like
pt-tools' orange it only marks (dots, the logo), never text.

**Hero: one capture, in the page's theme.** winer is a desktop app with no phone layout, so the
hero shows the window alone: the game analysis in champ select at 1440 × 900, captured from
winer's demo client so no real player appears, the light theme on a light page and Hextech on a
dark one. The phone overlay the pt-tools component carried is gone. The two text-and-evidence
splits show the history page and the rating settings the same way.

**Verified 2026-10-06 (local preview with GitHub Pages' lookup rules, Chrome).** On the main site
and `dist/winer/` assembled the way `deploy.yml` assembles them: at 1280 × 800, 1440 × 900 and
375 × 812 the headline, both facts and the Install button end above the fold in both languages
(the lowest, English at 375 × 812, ends at 731 of 812 px); none of the 24 pages overflows
horizontally at 375 or 1280 px or shows a broken image; all 188 in-site links and fragments
resolve; the language menu maps every page onto the same path in the other locale, and canonical
and hreflang links are absolute under `https://firlab.app/winer/`; no computed colour on three
pages in either theme falls in OKLCH hue 270–330 with chroma above 0.04; the catalog card leads to
`/winer/` and `/winer/en/`. Lighthouse: accessibility 100 and SEO 100 on the Chinese home page
(mobile) and the English rating page (desktop); best practices 78 only for HTTPS, which the local
preview does not serve.

## 17. Product documentation inside firlab.app: firlab.app/bedrock-gateway

`bedrock-gateway/` is the kiro-provider site (§15) for bedrock-gateway, published the same way under a path of this
site: VitePress builds it with `base: '/bedrock-gateway/'` and `deploy.yml` copies it to `dist/bedrock-gateway/` after
`bedrock-gateway/scripts/check-dist.sh` has passed. It keeps everything §15 records (English root locale, system faces
with JetBrains Mono, the hero's recorded terminal session, the home-page frontmatter contract with three evidence
tables, `available` and `opt-in`, the table scroll boxes, the §14 fixes) through the same files with a `bg-` prefix.
This section records only where it departs from §15, each with its reason; `bedrock-gateway/README.md` covers
ownership and deployment.

**A new path and a tag with a prefix (2026-10-06).** bedrock-gateway had no page on this site, so nothing redirects;
its catalog entry (§4) is new, category `service`, licence MIT-0. Its repository is tagged by release-please per
component (`bedrock-gateway-rust-v0.17.0`), which breaks §4's assumption that a tag is the version string. The version
stays `v0.17.0` in `versions.ts`, so the card reads like every other, and the prefix is a third constant,
`bedrockgatewayTagPrefix`: `check-versions.mjs` compares the prefix plus the version with the latest stable tag, and
`releaseTagHref` builds the release link from both. A tag that loses the prefix is reported as drift of the prefix.

**A Chinese-only reference.** bedrock-gateway-rust's references are English except `docs/caching-and-reasoning.md`,
which is written in Chinese. The sync publishes it under `/zh/reference/` and generates an English pointer at the same
path without `/zh/`, `noindex`, out of the sitemap and without an edit link: §15's English-only arrangement the other
way round, for one page. No reference is bilingual yet, so the sync's `REFERENCES` list is empty and stays wired for
one. A page links a one-language reference in its own language, wherever the reader came from.

**Navigation.** The bar carries Operate beside Guide, Clients and Reference, because deployment (Docker, ECS, Lambda)
is half of what a reader of a self-hosted gateway looks for. Measured in Chrome on 2026-10-06, the bar with the extra
item still fits on one line at 768, 960, 1100 and 1280 px in both languages, with and without a sidebar, under §10's
search-button rules. Privacy and Developers close the sidebar as a group without a heading, after a divider.

**Evidence tables with long codes.** The routes carry the `/api/v1` prefix and the models table lists IDs such as
`global.anthropic.claude-sonnet-5-5`, several to a cell. Three changes keep them inside their plates:

- a code cell after the first column wraps between its words and never inside one: `ProofTable` renders each word as
  an inline block that keeps its line, so a list of IDs wraps and an ID stays whole (on a phone an ID longer than the
  whole card may still break, rather than widen it);
- a row's name may wrap: the shared `th` rule keeps every heading cell on one line, which held
  "Nova, DeepSeek and others" on one line and pushed the models table 26 px past the plate's inner edge at 1280 px;
- the text and its table sit side by side from 1200 px instead of 960: between 960 and about 1140 px the routes and
  models tables ran up to 89 px past the plate's inner edge even with both fixes, so there the text sits above its
  table, as on a phone.

A `SplitBlock` whose `proof` names no table fails the build by name, since a page writes it as a plain attribute that
no type check sees.

**What goes where: four cards.** The home page's privacy band has four modes (model requests, the model list, image
URLs, the client key) where kiro-provider's has three, so four sit two by two from 640 px instead of three and one.

**`opt-in` includes a build option.** The two opt-in rows are reasoning across Chat Completions tool calls, which needs
a signing key of the reader's own, and OpenTelemetry export, which needs a build with the `otel` feature; the tag reads
"Opt-in" / 「需开启」 as on the kiro-provider site.

**Mark (2026-10-06).** bedrock-gateway ships no app icon, so its mark is drawn for this site in the §1 values: two pale
lanes, the OpenAI APIs a client speaks, merge into one and pass between two pale gateposts; past the gate the lane is
teal, Amazon Bedrock. There is no AWS logo, and no orange: on anything about Bedrock, orange reads as AWS's. As on the
kiro-provider site the hue is teal and nothing on the site is orange. The same drawing is the site's logo
(`bedrock-gateway-logo.svg`, owned by bedrock-gateway-rust) and the catalog's `AppIcon`.

**Checked so far (2026-10-06, local preview, Chrome).** On a build from the pages that existed that day (the home
page with its comma-holding table cells quoted), with placeholders for the rest and an English copy as the Chinese
home page: no horizontal overflow on the 44 pages at 375,
768 and 1280 px, no table box past the text column, every box that scrolls focusable; no table past its plate on the
home pages from 960 to 1440 px; the English headline, both facts and the Install button end above the fold at
1280 × 800 (703 px), 1440 × 900 and 375 × 812 (771 px). Not yet checked: the Chinese pages with their real text,
Lighthouse, and the colour sweep.

## 18. Product documentation inside firlab.app: firlab.app/godot-mcp

`godot-mcp/` is the bedrock-gateway site (§17) for godot-mcp, published the same way under a path of this site:
VitePress builds it with `base: '/godot-mcp/'` and `deploy.yml` copies it to `dist/godot-mcp/` after
`godot-mcp/scripts/check-dist.sh` has passed. It keeps everything §17 records (English root locale, system faces with
JetBrains Mono, the home-page frontmatter contract with three evidence tables, the table scroll boxes, splits side by
side from 1200 px, the one-language references with pointers in the other language, the §14 fixes) through the same
files with a `gm-` prefix. This section records only where it departs from §17, each with its reason;
`godot-mcp/README.md` covers ownership and deployment.

**A new path, then the first release (2026-10-12).** godot-mcp had no page on this site, so nothing redirects; its
catalog entry (§4) is new, category `cli`, licence MIT. It went live as `wip` with no version, because
`check-versions.mjs` fails on a repository without a release, and the guide said so. The same day v0.1.0 was
published: the entry is `early`, its version is in `versions.ts` with a `check-versions.mjs` row, and the pages no
longer mention a missing release.

**The hero is an MCP exchange.** godot-mcp is a protocol server: a terminal session would show a process waiting on
stdin. The visual is what a client sends and what godot-mcp answers, from a recorded session against a small project:
`call` lines carry a `›` the reader does not send, `argument` lines sit under their call past the prompt, and
`answer` lines are fields of the structured answer with every value copied unchanged. These three kinds replace §15's
`command`, `continuation` and `output`.

**What a capability needs, not a release state.** Every tool ships in the same release, so `available` and `opt-in`
would say nothing. What a reader has to know is whether a tool needs Godot: an index row is `no-engine` ("No engine" /
「无需引擎」, teal text behind a teal dot) or `engine` ("Needs Godot" / 「需要 Godot」, ink text behind a slate ring, so a
requirement carries no hue). The platform rows carry no tag: each platform has an archive.

**The three splits.** Profiles (what each one adds, with example tools), the managed sessions (the tools for each
task) and the locked Godot builds (what CI runs against each). Their code cells hold tool names such as
`gdscript.references.get`, which do not break, so §17's 1200 px breakpoint and word-keeping code cells apply as they
are.

**Navigation.** The bar carries Guide, Operate and Reference, one item fewer than §17's. The sidebar adds a Use group
between Guide and Operate for the five task pages (analysis, editing, the engine, games and editors, the editor
add-on); Privacy and Developers close it as on §17.

**Mark (2026-10-12).** godot-mcp ships no app icon, so its mark is drawn for this site in the §1 values: on the navy
tile, a pale scene tree of three nodes whose third node is orange, the client the tree is answered to. Orange returns
because nothing here is about AWS (§17's reason for teal); the palette is the Voltip site's as it is, and orange keeps
its role there: the logo, the dots and tints, never text. There is no Godot logo and no Godot blue: godot-mcp is not
affiliated with the Godot Engine project, and the footer says so in both languages. The same drawing is the site's
logo (`godot-mcp-logo.svg`, owned by godot-mcp) and the catalog's `AppIcon`; `og.svg` carries it with the headline and
the first call of the hero's session, and `og.png` is rendered from it in Chrome.

**Mark, redrawn (2026-11-06).** The owner found the tree unrecognisable and asked for no orange. Of two rounds of
candidates they chose `{+}`: two braces around a d-pad, code pressing a game's buttons. On the navy tile the braces
are green `#34D399` (9.74:1 on the tile) and the d-pad pale; with the colour on the braces the mark keeps its hue at
16 px, where the d-pad is two pixels wide. The glyph is drawn on the 64 grid at 72 % (strokes of 7 units, 1.26 px at
16 px). The green takes orange's place across the site: the newest build's dot and the selection and search tints use
`--gm-mark`, `#059669` on paper (3.67:1, where the orange dot was 2.73:1) and `#34D399` in the dark theme, and
`og.svg`'s top hairline is `#059669`. Warning blocks keep their warm tint as `--gm-warn-soft`, so they do not look like
the teal tips. `og.svg` now shows the first two calls of the design-A hero's exchange with the demo game; the old one
showed a scene tree from a project the site no longer uses. No catalog entry was green before; the teal of
kiro-provider and bedrock-gateway is the nearest.

**Checked so far (2026-10-12, local preview, Chrome).** On a build from the pages as they stand that day, all 60 pages
(30 in each language) at 375, 768 and 1280 px: no page scrolls sideways, nothing reaches past the viewport outside a
scroll box, and every box that scrolls sideways is focusable. On both home pages from 960 to 1440 px every evidence
table ends inside its plate and none of them scrolls. The Install button ends above the fold: 702 px of 800 at
1280 × 800 (and of 900 at 1440 × 900) and 725 px of 812 at 375 × 812 in English, 650 px at 1280 × 800 and 375 × 812
in Chinese. Not yet checked: Lighthouse and a colour-contrast sweep; the dark theme was looked at only on the Chinese
home page at 375 px.

**Design A (2026-11-06): the Voltip site's layout, with pictures.** The owner asked for the site to look like
voltip.firlab.app (§10) and to show screenshots, icons and pictures instead of lists. The home page uses the second
frontmatter layout, told apart by its `built` key (`theme/data/home-schema.ts`); a checkout with the old layout still
builds. Under a stacked hero sit ruled bands: how godot-mcp is built (the client, the server's parts and what it
reaches, one line), what an agent can do (cells of two widths, each with a line of a real answer or the tools it
calls, and a "No engine" / 「无需引擎」 or "Needs Godot" / 「需要 Godot」 tag), two showcases with screenshots, a row per
MCP client, the profiles beside their table, the locked Godot builds and the platforms over the install card, a
ledger of where each kind of traffic goes, the questions, and a closing band. `buildEnd` (`config/shared.ts`) fails
the build when a link or an anchor in the home frontmatter leads nowhere.

The pictures are real. Six captures in `public/screens/`, owned by godot-mcp and taken by its
`scripts/site/capture_screens.py`: the editor with the add-on's panel in each language and theme, and the demo game
before and after a test scenario. The demo project (`examples/site-demo` in godot-mcp) draws with images generated
for it with Z-Image Turbo (Apache-2.0) and cut out with BiRefNet (MIT); its `art/README.md` records each prompt and
seed. Icons are Lucide 1.70.0 (ISC; `arrow-right` and `download` come from Feather, MIT), one library only. Client
marks are Simple Icons 16.35.0 (CC0) and Lobe Icons at `7d7d037` (MIT), drawn in the text colour; Claude Code has no
mark here and is named in words.

Where it departs from §10, each with its reason:

- The hero's demo is VitePress's `home-hero-image` slot, so the hero keeps VitePress's `has-image` layout.
- Install sits in the band with the locked Godot builds, and feedback (GitHub Issues) in the closing band.
- A line of code wraps only at its spaces (`codeTokens`), and a code span of 28 characters or fewer keeps to one
  line outside headings: Chrome breaks after a hyphen, so `--allow-scripts` split after its `--`.
- Chinese headings break at punctuation (`word-break: keep-all`) and inside a run only when it is wider than the
  column (`overflow-wrap: anywhere`).
- Install's tabs take less padding below 640 and 360 px: at 320 px they needed 288 px of a 270 px card, now 256.
- Text on the home page, headings, figure captions and the footer balance their lines. Chromium balances up to six
  lines, so the profiles paragraph is two paragraphs.
- The hero's facts are one line each. Voltip's four meta lines take 101 px; three facts of two or three lines took
  264 px and started the demo at 674 px of an 800 px window, showing 28 % of it. Now it starts at 558 px.

**Hallmark slop test, 2026-11-06 (home page, both languages).** Pre-emit critique P4 H4 E4 S5 R4 V4, stamped at the
top of `theme/styles/bands.css`. Fixed in this pass: the facts above (gate 44), a note under the parts diagram that
ran 80 characters a line (25, now capped at 72ch), and a guide link whose arrow slid 2 px while its underline
darkened (13; the slide is gone, as on the Voltip site). Passes by justification: 7, pure white only on raised
surfaces; 42, VitePress's docs bar restyled; 8, the structure is the Voltip site's because the owner asked for it.
Left as they are: 33 of the 151 spacing values in `bands.css` and the components are off the 4 px scale (1 px
insets, 2 px steps such as 6, 10, 14 and 18 px that follow VitePress's own metrics, and a 9 px offset that centres a
list dot on its line), and the cells of the three-column grid are 40 characters wide, a card's measure rather than
prose. Every other gate passes or does not apply: no gradient, no drawn chrome, no invented number (the figures are
from recorded sessions, the image sizes and the release lock), two families, no italic heading, a token for every
colour, and the accent covers at most 0.63 % of a 1280 × 800 window.

**Checked (2026-11-06, local preview, Chrome).** All 60 pages at 320, 375, 414, 768, 1280 and 1920 px: no page
scrolls sideways, nothing reaches past the window outside a scroll box, and every box that scrolls sideways is
focusable. Both home pages in both themes at 320, 375, 414, 768, 960, 1280, 1440 and 1920 px: no clickable text on
two lines, no text block ending on one word or one or two Chinese characters, the nav bar fits, every image loads, and
all text is at least 4.5:1 against its background (3:1 for large text). The lowest are 5.10:1 in the light theme and
5.50:1 in the dark one, 5.00:1 and 4.80:1 in highlighted code, and 6.99:1 and 8.54:1 on the guide pages. At
1280 × 800 the hero's buttons end at 354 px in English and 321 px in Chinese, and the demo shows 59 % and 67 % of
itself (83 % and 90 % at 1440 × 900); on a phone it starts below the first screen. Clicking an install tab moves the
page 0 px. Left as they are: on the two guide pages with screenshots, 33 blocks of body text (31 Chinese, 2 English)
end with one word or one or two characters at some width, and 4 links inside running text wrap with the words around
them; both predate the redesign. Not checked: Lighthouse, the live site, and text over images.
