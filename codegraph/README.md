# CodeGraph documentation site

The CodeGraph website, published at <https://firlab.app/codegraph/>: a home page that shows what
CodeGraph does, the user guide in Chinese (`/codegraph/`) and English (`/codegraph/en/`), and
CodeGraph's technical references in English. It has no domain of its own: `deploy.yml` builds it
with the base `/codegraph/` and publishes it inside firlab.app, next to the main site. It replaced
the main site's CodeGraph product page at the same path on 2026-10-03; `/en/codegraph/`, the old
English page, redirects to `/codegraph/en/`.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/codegraph-rust](https://github.com/sunerpy/codegraph-rust) under `docs/site/`, next to
the code they describe, so a pull request that changes what a user sees updates the page in the
same commit, and the same files read correctly on GitHub. codegraph-rust's
`docs/site/README.md` has the writing rules, the home page's fields and the screenshot procedure.

This repository owns the site:

| Path | Owner | Notes |
| --- | --- | --- |
| `src/index.md`, `src/{guide,reference}/`, `src/{privacy,developers}.md`, `src/en/` | codegraph-rust | Synced from `docs/site/`. Edits here are overwritten. |
| `src/en/reference/`, `src/en/dev/` (except `en/reference/faq.md`) | codegraph-rust | The canonical references `docs/<name>.md`, copied unchanged |
| `src/reference/<name>.md`, `src/dev/<name>.md` | sync script | A generated Chinese pointer for each English-only reference |
| `src/public/screens/`, `src/public/codegraph-logo.svg` | codegraph-rust | Synced |
| `src/.vitepress/synced.json` | sync script | The commit the content came from; the footer shows it |
| `src/.vitepress/` (config, theme, components) | this repo | |
| `src/public/{og.svg,og.png}` | this repo | |
| `scripts/sync-codegraph-docs.sh` | this repo | What is synced, the link rewriting, and the checks that stop a bad sync |
| `scripts/check-dist.sh` | this repo | Checks a build before it joins firlab.app |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json` | this repo | Build |

To change a sentence on the live site, open a pull request against codegraph-rust.

## How a change reaches the site

1. A codegraph-rust pull request that touches the pages or the references runs codegraph-rust's
   `docs-site.yml`: it syncs them into a checkout of this repository's `main`, builds and runs
   `scripts/check-dist.sh`, without a secret.
2. After the merge, codegraph-rust's `publish-site.yml` runs `scripts/sync-codegraph-docs.sh`
   from this repository and pushes the result to `main` as
   `docs(codegraph): sync from codegraph-rust@<sha>`.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to
   `dist/codegraph/` and deploys firlab.app to GitHub Pages.

The sync pushes for the same reason as the other sites': the event that should update the site,
a merge in codegraph-rust, happens there, and a push needs one token scoped to this repository's
contents.

The sync script stops before writing anything when:

- an expected reference or asset is missing;
- a page exists in one language only;
- a page uses a component the theme does not register, or shows a screenshot that is not there;
- a user page uses a colloquial word or one of CodeGraph's crate names;
- any page makes an unversioned "sub-millisecond" claim.

It copies the references to `/en/reference/` and `/en/dev/` with a Chinese pointer for each, and
rewrites the links: a link to a reference becomes its path here, and any other link that leaves
the synced tree becomes a GitHub link.

The build fails on a dead link and on a home page whose `home:` frontmatter does not match
`src/.vitepress/theme/data/home-schema.ts`. `scripts/check-dist.sh` fails when:

- a language is missing;
- a root-relative link or asset leaves `/codegraph/` or does not resolve to an emitted file;
- a sitemap entry leaves `https://firlab.app/codegraph/`.

## Local development

`codegraph/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd codegraph
pnpm install --frozen-lockfile
./scripts/sync-codegraph-docs.sh ../../codegraph-rust    # a local codegraph-rust checkout
pnpm dev                                                 # http://localhost:5173/codegraph/
```

```sh
pnpm build      # into codegraph/dist
./scripts/check-dist.sh dist
pnpm preview
```

The sync writes into `src/`. A local sync from an uncommitted codegraph-rust tree marks the footer
commit `-dirty`; do not commit that state here.

`tsconfig.json` is here for the same reason as `voltip/tsconfig.json`: without it Vite walks up to
the root's, which extends `astro/tsconfigs/strict`, a package this sub-site does not install.

## Design

`DESIGN.md` §13 records where this site departs from the Voltip site (§10) and the pt-tools site
(§12), whose shell it started from. In short:

- Chinese is the root locale;
- the English-only references get Chinese pointers;
- the text uses Inter and the code JetBrains Mono, the browser viewer's faces;
- `preview` marks the viewer;
- the hero shows one capture of the viewer, with no animation.

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG in a page
that loads the two fonts from `node_modules/@fontsource-variable/*/files/` and serves `/screens/`,
open it in Chrome at a 1200 × 630 viewport and take a screenshot.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/codegraph/` path: GitHub
Pages allows one custom domain per repository, `public/CNAME` binds it to `firlab.app`, and a path
needs no DNS record, certificate or second host.

`deploy.yml` builds the sub-site after the main site and runs `scripts/check-dist.sh`. It then
adds the sub-site to the Pages artifact, refusing to overwrite a `dist/codegraph/` the main site
emits. The main site emitted one until the product page was removed, so a page restored at
`src/pages/codegraph.astro` fails the deploy instead of being replaced silently.

`codegraph-site-ci.yml` builds and checks the sub-site on pull requests.

### One-time setup

1. **Token in codegraph-rust.** codegraph-rust's `publish-site.yml` needs `FIRLAB_DOCS_TOKEN`: a
   fine-grained personal access token for `sunerpy/firlab` only, with Contents read and write and
   nothing else.

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/codegraph-rust
   ```

   Until it exists, that workflow fails at its first step, and a sync from codegraph-rust's
   `main` reaches this repository through a pull request instead.

2. **The entry on firlab.app.** CodeGraph is an entry in `src/i18n/products.ts`. Its `page.href`
   is this site's absolute path in each language (`/codegraph/`, `/codegraph/en/`), and
   `astro.config.mjs` redirects the old English page.

Merge order: this sub-site first, then the codegraph-rust change that adds the two workflows, so
the first publish finds `codegraph/scripts/sync-codegraph-docs.sh` on `main`.

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/codegraph/ | head -1
curl -sI https://firlab.app/codegraph/en/guide/install | head -1
curl -s https://firlab.app/en/codegraph/ | grep -o 'url=[^"]*'    # the redirect's target
```

## Adding a page

1. Add the page to codegraph-rust under `docs/site/`, in both languages (`docs/site/<path>.md`
   and `docs/site/en/<path>.md`).
2. Add it to the sidebar in `src/.vitepress/config/zh.ts` and `en.ts`.
3. To publish another reference from `docs/`, add its name to `REFERENCE_DOCS` or `DEV_DOCS` in
   `scripts/sync-codegraph-docs.sh` and to `ENGLISH_ONLY` and `editLinkPattern` in
   `src/.vitepress/config/shared.ts`, then give it a Chinese title in `zh_title`.
