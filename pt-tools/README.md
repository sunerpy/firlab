# pt-tools documentation site

The pt-tools website, published at <https://firlab.app/pt-tools/>: a home page that shows what
pt-tools does, and the user guide, in Chinese (`/pt-tools/`) and English (`/pt-tools/en/`). It has
no domain of its own: `deploy.yml` builds it with the base `/pt-tools/` and publishes it inside
firlab.app, next to the main site. It replaced the main site's pt-tools product page at the same
path on 2026-10-01; `/en/pt-tools/`, the old English page, redirects to `/pt-tools/en/`.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/pt-tools](https://github.com/sunerpy/pt-tools) under `docs/`, next to the code they
describe, so a pull request that changes what a user sees updates the page in the same commit,
and the same files read correctly on GitHub. pt-tools' `docs/README.md` has the writing rules,
the home page's fields and the screenshot procedure.

This repository owns the site:

| Path | Owner | Notes |
| --- | --- | --- |
| `src/index.md`, `src/{guide,reference}/`, `src/{configuration,faq,sites}.md`, `src/en/` | pt-tools | Synced from `docs/`. Edits here are overwritten. |
| `src/development.md`, `src/design/` | pt-tools | The Chinese contributor guide and design documents |
| `src/en/development.md`, `src/en/design/` | sync script | A generated English pointer for each Chinese-only page |
| `src/public/screens/`, `src/public/community/`, `src/public/pt-tools-logo.svg` | pt-tools | Synced (`docs/public/screens/`, `docs/public/community/`, `web/frontend/public/logo.svg`) |
| `src/.vitepress/synced.json` | sync script | The commit the content came from; the footer shows it |
| `src/.vitepress/` (config, theme, components) | this repo | |
| `src/public/{og.svg,og.png}` | this repo | |
| `scripts/sync-pt-tools-docs.sh` | this repo | What is synced, and the checks that stop a bad sync |
| `scripts/check-dist.sh` | this repo | Checks a build before it joins firlab.app |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json` | this repo | Build |

To change a sentence on the live site, open a pull request against pt-tools.

## How a change reaches the site

1. A pt-tools pull request that touches the pages runs pt-tools' `docs-site.yml`: it syncs
   the pages into a checkout of this repository's `main`, builds and runs
   `scripts/check-dist.sh`, without a secret.
2. After the merge, pt-tools' `publish-docs-site.yml` runs `scripts/sync-pt-tools-docs.sh`
   from this repository and pushes the result to `main` as
   `docs(pt-tools): sync from pt-tools@<sha>`.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to
   `dist/pt-tools/` and deploys firlab.app to GitHub Pages.

The sync pushes for the same reason as Voltip's and Lockra's: the event that should update the
site, a merge in pt-tools, happens there, and a push needs one token scoped to this repository's
contents.

The sync script stops before writing anything when an expected page or file is missing, a
page exists in one language only, a page uses a component the theme does not register, or a
user page uses an internal or colloquial word. The build fails on a dead link and on a home
page whose `home:` frontmatter does not match `src/.vitepress/theme/data/home-schema.ts`;
`scripts/check-dist.sh` fails when a language is missing or a link, an asset or a sitemap entry
leaves `/pt-tools/`.

## Local development

`pt-tools/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd pt-tools
pnpm install --frozen-lockfile
./scripts/sync-pt-tools-docs.sh ../../pt-tools    # a local pt-tools checkout
pnpm dev                                          # http://localhost:5173/pt-tools/
```

```sh
pnpm build      # into pt-tools/dist
./scripts/check-dist.sh dist
pnpm preview
```

The sync writes into `src/`. A local sync from an uncommitted pt-tools tree marks the footer
commit `-dirty`; do not commit that state here.

`tsconfig.json` is here for the same reason as `voltip/tsconfig.json`: without it Vite walks
up to the root's, which extends `astro/tsconfigs/strict`, a package this sub-site does not
install.

## Design

`DESIGN.md` §12 records where this site departs from the Voltip site (§10), whose theme it
started from. In short: Chinese is the root locale, the text uses the web UI's system font
stack with no Latin web font, JetBrains Mono is self-hosted for code, and the hero shows a
desktop and a phone capture of the web UI with no animation.

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG in a
page that serves `/screens/` and `/pt-tools-logo.svg`, open it in Chrome at a 1200 × 630
viewport and take a screenshot.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/pt-tools/` path: GitHub
Pages allows one custom domain per repository, `public/CNAME` binds it to `firlab.app`, and a
path needs no DNS record, certificate or second host. `deploy.yml` builds the sub-site after the
main site, runs `scripts/check-dist.sh`, refuses to overwrite a `dist/pt-tools/` the main site
emits (it emitted one until the product page was removed, so a page restored at
`src/pages/pt-tools.astro` fails the deploy instead of being replaced silently), and adds the
sub-site to the Pages artifact. `pt-tools-site-ci.yml` builds and checks it on pull requests.

### One-time setup

1. **Token in pt-tools.** pt-tools' `publish-docs-site.yml` needs `FIRLAB_DOCS_TOKEN`: a
   fine-grained personal access token for `sunerpy/firlab` only, with Contents read and write
   and nothing else.

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/pt-tools
   ```

2. **The entry on firlab.app.** pt-tools is product 01 in `src/i18n/content.ts`; its `detail`
   is this site's absolute path in each language (`/pt-tools/`, `/pt-tools/en/`), and
   `astro.config.mjs` redirects the old English page.

Merge order: this sub-site first, then the pt-tools change that adds the two workflows, so the
first publish finds `pt-tools/scripts/sync-pt-tools-docs.sh` on `main`.

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/pt-tools/ | head -1
curl -sI https://firlab.app/pt-tools/en/guide/install | head -1
curl -s https://firlab.app/en/pt-tools/ | grep -o 'url=[^"]*'    # the redirect's target
```

## Adding a page

1. Add the page to pt-tools under `docs/`, in both languages (`docs/<path>.md` and
   `docs/en/<path>.md`).
2. Add it to the sidebar in `src/.vitepress/config/zh.ts` and `en.ts`.
3. If it sits outside a directory the sync script already copies, add it to `SYNCED_DIRS`
   or `SYNCED_FILES` in `scripts/sync-pt-tools-docs.sh`; a page meant to stay Chinese-only
   goes in `CHINESE_ONLY` with an English title in `chinese_only_title`.
