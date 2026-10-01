# Lockra documentation site

The Lockra website, published at <https://firlab.app/lockra/>: a home page that shows what
Lockra does, and the user guide, in English (`/lockra/`) and Chinese (`/lockra/zh/`). It has no
domain of its own: `deploy.yml` builds it with the base `/lockra/` and publishes it inside
firlab.app, next to the main site.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/lockra](https://github.com/sunerpy/lockra) under `docs/site/`, next to the code they
describe, so a pull request that changes what a user sees updates the page in the same commit.
lockra's `docs/site/README.md` has the writing rules, the home page's fields and the screenshot
procedure.

This repository owns the site:

| Path | Owner | Notes |
| --- | --- | --- |
| `src/index.md`, `src/{guide,accounts,transfer,backup,security,reference,zh}/`, `src/{privacy,roadmap,developers}.md` | lockra | Synced from `docs/site/`. Edits here are overwritten. |
| `src/dev/`, `src/zh/dev/` | lockra | The English design documents (`docs/{architecture,formats,security,release}.md`), and a generated Chinese pointer for each |
| `src/public/screens/`, `src/public/lockra-logo.svg` | lockra | Synced |
| `src/.vitepress/synced.json` | sync script | The commit the content came from; the footer shows it |
| `src/.vitepress/` (config, theme, components) | this repo | The Voltip site's theme with Lockra's home bands |
| `src/public/{og.svg,og.png}` | this repo | |
| `scripts/sync-lockra-docs.sh` | this repo | What is synced, and the checks that stop a bad sync |
| `scripts/check-dist.sh` | this repo | Checks a build before it joins firlab.app |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json` | this repo | Build |

To change a sentence on the live site, open a pull request against lockra.

## How a change reaches the site

1. A lockra pull request that touches the pages runs lockra's `docs-site.yml`: it syncs the
   pages into a checkout of this repository's `main`, builds and runs `scripts/check-dist.sh`,
   without a secret.
2. After the merge, lockra's `publish-site.yml` runs `scripts/sync-lockra-docs.sh` from this
   repository and pushes the result to `main` as `docs(lockra): sync from lockra@<sha>`.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to
   `dist/lockra/` and deploys firlab.app to GitHub Pages.

The sync pushes because the event that should update the site, a merge in lockra, happens
there: a push from lockra needs one token scoped to this repository's contents, where a pull
from here would need a schedule or a second cross-repository trigger.

The sync script stops before writing anything when an expected page or file is missing, a page
exists in one language only, a page uses a component the theme does not register, a page shows
a screenshot that is not there, or a user page uses an internal or colloquial word (the lists
follow lockra's writing rules). It rewrites the design documents' links into the lockra
repository as GitHub links. The build fails on a dead link and on a home page whose `home:`
frontmatter does not match `src/.vitepress/theme/data/home-schema.ts`; `scripts/check-dist.sh`
fails when a language is missing or a link, an asset or a sitemap entry leaves `/lockra/`.

## Local development

`lockra/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd lockra
pnpm install --frozen-lockfile
./scripts/sync-lockra-docs.sh ../../lockra    # a local lockra checkout
pnpm dev                                      # http://localhost:5173/lockra/
```

```sh
pnpm build      # into lockra/dist
./scripts/check-dist.sh dist
pnpm preview
```

`tsconfig.json` is here for the same reason as `voltip/tsconfig.json`: without it Vite walks up
to the root's, which extends `astro/tsconfigs/strict`, a package this sub-site does not install.

## Design

`DESIGN.md` §11 describes what this sub-site changes from the Voltip site (§10), whose palette,
type, buttons and links it keeps: `theme/styles/` is Voltip's with an `lk-` prefix, and the home
page has Lockra's own bands (moving accounts, backups, protection, what is left out).

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG in a
page that loads the two fonts from `node_modules/@fontsource-variable/*/files/` and serves
`/screens/`, open it in a browser at 1200 × 630 and take a screenshot of the SVG.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/lockra/` path: GitHub
Pages allows one custom domain per repository, `public/CNAME` binds it to `firlab.app`, and a
path needs no DNS record, certificate or second host. `deploy.yml` builds the sub-site after the
main site, runs `scripts/check-dist.sh`, refuses to overwrite a `dist/lockra/` the main site
emits, and adds the sub-site to the Pages artifact. `lockra-site-ci.yml` builds and checks it on
pull requests.

### One-time setup

1. **Token in lockra.** lockra's `publish-site.yml` needs `FIRLAB_DOCS_TOKEN`: a fine-grained
   personal access token for `sunerpy/firlab` only, with Contents read and write and nothing
   else, created by hand in the GitHub web interface.

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/lockra
   ```

2. **An entry on firlab.app.** The main site lists its products in `src/i18n/content.ts` (a
   `ProductId` and an entry in each language) with a mark in `src/components/ProductMark.astro`.
   Lockra is not listed yet: it gets its entry once its repository is public and has a release,
   since every link on the site leads to the repository and its releases page.

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/lockra/ | head -1
curl -sI https://firlab.app/lockra/zh/guide/install | head -1
```

## Adding a page

1. Add the page to lockra under `docs/site/`, in both languages.
2. Add it to the sidebar in `src/.vitepress/config/en.ts` and `zh.ts`.
3. If it sits outside a directory the sync script already copies, add it to `SYNCED_DIRS` or
   `SYNCED_FILES` in `scripts/sync-lockra-docs.sh`.
