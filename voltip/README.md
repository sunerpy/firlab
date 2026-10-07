# Voltip documentation site

The Voltip website, published at <https://voltip.firlab.app>: a home page that shows what
Voltip does, and the user guide, in English (`/`) and Chinese (`/zh/`).

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/voltip](https://github.com/sunerpy/voltip) under `docs/site/`, next to the code
they describe, so a pull request that changes what a user sees updates the page in the same
commit. voltip's `docs/site/README.md` has the writing rules, the home page's fields and the
screenshot procedure.

This repository owns the site:

| Path | Owner | Notes |
| --- | --- | --- |
| `src/index.md`, `src/{guide,dictation,recognition,phone,reference,zh}/`, `src/{privacy,roadmap,developers}.md` | voltip | Synced from `docs/site/`. Edits here are overwritten. |
| `src/zh/dev/`, `src/dev/` | voltip | The Chinese design documents (`docs/*.md`), and a generated English pointer for each |
| `src/public/screens/`, `src/public/voltip-logo.svg` | voltip | Synced |
| `src/public/community/` | voltip | Synced when voltip has it: the Telegram and WeChat QR codes of the community page. The WeChat group code expires every 7 days and is replaced in voltip |
| `src/.vitepress/synced.json` | sync script | The commit the content came from; the footer shows it |
| `src/.vitepress/theme/data/presets-builtin.json` | voltip | Synced from `packages/shared/src/fixtures/ipc/`: the app's polish presets, which the try page sends as the system prompt |
| `src/admin.md` | this repo | The admin page (`AdminStats`); noindex, outside the sitemap and the search |
| `functions/`, `test/`, `scripts/admin-password.mjs` | this repo | The API of the try page and the admin page (Cloudflare Pages Functions), its tests, and the admin password hasher |
| `src/.vitepress/` (config, theme, components) | this repo | |
| `src/public/{og.svg,og.png,robots.txt,_headers}` | this repo | |
| `src/public/media/` | this repo | The tutorial videos and their posters (`VideoFigure`). Kept here because a 13 MB render would grow voltip's history on every re-render; H.264 with `+faststart`, each file under Cloudflare Pages' 25 MiB limit |
| `scripts/sync-voltip-docs.sh` | this repo | What is synced, and the checks that stop a bad sync |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json` | this repo | Build |

To change a sentence on the live site, open a pull request against voltip.

## How a change reaches the site

1. A voltip pull request that touches the pages runs voltip's `docs-site.yml`: it syncs the
   pages into a checkout of this repository's `main` and builds, without a secret.
2. After the merge, voltip's `publish-site.yml` runs `scripts/sync-voltip-docs.sh` from
   this repository and pushes the result to `main` as `docs(voltip): sync from voltip@<sha>`.
3. `deploy-voltip.yml` builds `voltip/` and deploys it to Cloudflare Pages.

The sync pushes because the event that should update the site, a merge in voltip, happens
there: a push from voltip needs one token scoped to this repository's contents, where a pull
from here would need a schedule or a second cross-repository trigger.

The sync script stops before writing anything when an expected page or file is missing, a
page exists in one language only, a page uses a component the theme does not register, or a
user page uses an internal or colloquial word (the lists follow voltip's interface copy
test). The build fails on a dead link and on a home page whose `home:` frontmatter does not
match `src/.vitepress/theme/data/home-schema.ts`.

## Local development

`voltip/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd voltip
pnpm install --frozen-lockfile
./scripts/sync-voltip-docs.sh ../../voltip    # a local voltip checkout
pnpm dev
```

```sh
pnpm build      # into voltip/dist
pnpm preview
```

`tsconfig.json` is here for the same reason as `docs/tsconfig.json`: without it Vite walks up
to the root's, which extends `astro/tsconfigs/strict`, a package this sub-site does not
install.

## Design

`DESIGN.md` §10 describes the sub-site's design. The palette is FirLab's (§1) mapped onto
VitePress's variables in `theme/styles/tokens.css`, with no purple anywhere; buttons and links
follow OpenAI's developer documentation (ink pills, body-coloured links with a soft
underline). Instrument Sans and JetBrains Mono are self-hosted; Chinese uses the system fonts.

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG in a
page that loads the two fonts from `node_modules/@fontsource-variable/*/files/` and serves
`/screens/`, open it in Chrome at a 1200 × 630 viewport and take a screenshot.

## Deployment

Like `docs/`, the site goes to Cloudflare Pages, because GitHub Pages allows one custom domain
per repository and `public/CNAME` binds it to `firlab.app`.

`deploy-voltip.yml` runs on pushes to `main` that touch `voltip/**`, and on demand. It builds,
checks that both languages were emitted, makes sure the Pages project `voltip-docs` exists,
deploys `voltip/dist` with wrangler, and then makes sure `voltip.firlab.app` is attached to
the project, asking Cloudflare to validate it again while it is not active. A pending domain
does not fail the job; an API error does. `voltip-site-ci.yml` builds the sub-site on pull
requests.

### One-time setup

1. **Cloudflare secrets.** The workflow reuses `CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit)
   and `CLOUDFLARE_ACCOUNT_ID`, the same secrets as `deploy-docs.yml`.
2. **DNS record.** Attaching the domain does not create the record. Point `voltip` in the
   `firlab.app` zone at the project's `*.pages.dev` subdomain with a proxied CNAME; the first
   deploy prints the subdomain. A record already on that name must be removed first.
3. **Token in voltip.** voltip's `publish-site.yml` needs `FIRLAB_DOCS_TOKEN`: a fine-grained
   personal access token for `sunerpy/firlab` only, with Contents read and write and nothing
   else, created by hand in the GitHub web interface.

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/voltip
   ```

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow='Deploy Voltip site' --limit 3
curl -sI https://voltip.firlab.app/ | head -1
```

## The try page and the admin page

`/guide/try` (`TryVoltip`, in voltip's pages) records or uploads up to 60 seconds, has the
built-in service recognise it and polishes the text with a model and a preset or prompt the
visitor picks. `/admin` (`AdminStats`) shows the built-in service's daily statistics after a
sign-in. Both talk to Pages Functions on the same origin, under `/api/`:

| Route | Does |
| --- | --- |
| `GET /api/try/options` | models, presets, languages, limits, the Turnstile site key |
| `POST /api/try/session` | checks a Turnstile answer, sets a 30-minute HttpOnly cookie |
| `POST /api/try/transcribe` | a 16 kHz mono WAV of at most 60 s → text, through the edge's `/try/v1/` |
| `POST /api/try/polish` | text, model, preset or prompt → polished text, through the edge's `/try/refine/v1/` |
| `POST /api/admin/login`, `/logout` | the admin password and a Turnstile answer → a 12-hour HttpOnly cookie |
| `GET /api/admin/stats` | the edge's daily summaries and today's counts of the try page |
| `POST /api/admin/edge-stats` | the edge's hourly push of its summaries (`Authorization: Bearer <STATS_TOKEN>`) |

The edge (the built-in service's gateway) accepts these only with tokens of their own, which
are not the app's, and logs the visitor's address the Functions send with each request. The edge
pushes its summaries every hour, after the cron job that writes them, and the admin page reads
that copy from D1: pulling them on each page load crosses from Cloudflare's overseas data
centres into mainland China and sometimes took longer than the timeout. The page pulls only when
the copy is missing or more than 90 minutes old, and shows the old copy, saying so, when the pull
fails too. The
Functions keep their counters in the D1 database `voltip-playground`, under an HMAC of the
address: 20 recognitions and 10 polishes an hour per address, 300 and 60 a day for all
visitors, and for the admin page a 15-minute lock after five failed sign-ins from one address
and a lock for everyone after 30 failures in an hour. The table is created on first use; rows
go once their window has passed.

### Project settings

The Pages project `voltip-docs` holds the binding and the secrets (Settings → Variables and
Secrets, production), so the deploy token needs Pages only:

| Name | What |
| --- | --- |
| `DB` | D1 binding: `voltip-playground` |
| `EDGE_BASE` | the edge's origin, `https://<asr-host>` |
| `TRY_TOKEN`, `STATS_TOKEN` | the edge's tokens for `/try/` and `/stats/` |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | the Turnstile widget `voltip.firlab.app` |
| `ADMIN_PASSWORD_HASH` | `node scripts/admin-password.mjs < password.txt` (PBKDF2, never the password) |
| `SESSION_KEY`, `IP_SALT` | random, 32 bytes each, e.g. `openssl rand -hex 32` |

To change the admin password, hash the new one, replace `ADMIN_PASSWORD_HASH` and redeploy
(`gh workflow run deploy-voltip.yml`); replacing `SESSION_KEY` also signs everyone out.

### Locally

```sh
pnpm build
pnpm functions:dev     # wrangler pages dev on http://localhost:8788, with a local D1
pnpm test              # the Functions against a fake D1 and a fake edge
```

`functions:dev` reads `voltip/.dev.vars` (git-ignored): the variables above, Turnstile's test
keys (`1x00000000000000000000AA`, `1x0000000000000000000000000000000AA`) and
`TURNSTILE_HOSTNAMES=example.com`, the host those keys report.

## Adding a page

1. Add the page to voltip under `docs/site/`, in both languages.
2. Add it to the sidebar in `src/.vitepress/config/en.ts` and `zh.ts`.
3. If it sits outside a directory the sync script already copies, add it to `SYNCED_DIRS`
   or `SYNCED_FILES` in `scripts/sync-voltip-docs.sh`.
