# winer documentation site

The winer website, published at <https://firlab.app/winer/>: a home page that shows what winer
does, and the user guide, in Chinese (`/winer/`) and English (`/winer/en/`). It has no domain of
its own: `deploy.yml` builds it with the base `/winer/` and publishes it inside firlab.app, next to
the main site. It is a new path; nothing redirects to it.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/winer](https://github.com/sunerpy/winer) under `docs/site/`, next to the code they
describe, so a pull request that changes what a user sees updates the page in the same commit.
winer's `docs/site/README.md` has the writing rules, the home page's fields and how the
screenshots are taken.

This repository owns the site:

| Path | Owner | Notes |
| --- | --- | --- |
| `src/index.md`, `src/guide/`, `src/{rating,faq,privacy}.md`, `src/en/` | winer | Synced from `docs/site/`. Edits here are overwritten. |
| `src/public/screens/`, `src/public/winer-logo.svg` | winer | Synced (`docs/site/public/screens/`, `app/src-tauri/app-icon.svg`) |
| `src/.vitepress/synced.json` | sync script | The commit the content came from; the footer shows it |
| `src/.vitepress/` (config, theme, components) | this repo | The pt-tools site's theme with a `wn-` prefix |
| `src/public/{og.svg,og.png}` | this repo | |
| `scripts/sync-winer-docs.sh` | this repo | What is synced, and the checks that stop a bad sync |
| `scripts/check-dist.sh` | this repo | Checks a build before it joins firlab.app |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json` | this repo | Build |

To change a sentence on the live site, open a pull request against winer.

## How a change reaches the site

1. A winer pull request that touches the pages runs winer's `docs-site.yml`: it syncs the pages
   into a checkout of this repository's `main`, builds and runs `scripts/check-dist.sh`, without
   a secret.
2. After the merge, winer's `publish-docs-site.yml` runs `scripts/sync-winer-docs.sh` from this
   repository, commits the result as `docs(winer): sync from winer@<sha>` to the branch
   `winer-docs/sync` and opens a pull request from it (or updates the open one). Once this
   repository's checks pass, it squash-merges the pull request at the commit that was checked;
   nothing is pushed to `main` directly.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to `dist/winer/`
   and deploys firlab.app to GitHub Pages.

The sync stops before writing anything when an expected page or file is missing, a page exists in
one language only, a page uses a component the theme does not register, a page names a screenshot
that is not there, or a user page uses an internal or colloquial word. The build fails on a dead
link and on a home page whose `home:` frontmatter does not match
`src/.vitepress/theme/data/home-schema.ts`; `scripts/check-dist.sh` fails when a language is
missing, or a link, an asset or a sitemap entry leaves `/winer/` or resolves to nothing.

## Local development

`winer/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd winer
pnpm install --frozen-lockfile
./scripts/sync-winer-docs.sh ../../winer     # a local winer checkout
pnpm dev                                     # http://localhost:5173/winer/
```

```sh
pnpm build      # into winer/dist
./scripts/check-dist.sh dist
pnpm preview
```

A local sync from an uncommitted winer tree marks the footer commit `-dirty`; do not commit that
state here.

## Design

`DESIGN.md` §16 records what this sub-site changes from the pt-tools site (§12), whose palette,
type, buttons, links and §14 fixes it keeps.

`src/public/og.svg` is the source of `og.png` (1200 × 630): the site's light ground, winer's mark
and the home page's hero capture.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/winer/` path: a path needs
no DNS record, certificate or second host. `deploy.yml` builds the sub-site after the main site,
runs `scripts/check-dist.sh`, refuses to overwrite a `dist/winer/` the main site emits, and adds
the sub-site to the Pages artifact. `winer-site-ci.yml` builds and checks it on pull requests.

### One-time setup

winer's `publish-docs-site.yml` needs `FIRLAB_DOCS_TOKEN`: a fine-grained personal access token
for `sunerpy/firlab` only, with Contents and Pull requests read and write and nothing else, created
by hand in the GitHub web interface. A pull request opened with it starts this repository's pull
request workflows, which one opened with `GITHUB_TOKEN` would not.

```sh
gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/winer
```

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/winer/ | head -1
curl -sI https://firlab.app/winer/en/rating | head -1
```

## Adding a page

1. Add the page to winer under `docs/site/`, in both languages.
2. Add it to the sidebar in `src/.vitepress/config/zh.ts` and `en.ts`.
3. If it sits outside a directory the sync script already copies, add it to `SYNCED_DIRS` or
   `SYNCED_FILES` in `scripts/sync-winer-docs.sh`.
