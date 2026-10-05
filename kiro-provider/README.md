# kiro-provider documentation site

The kiro-provider website, published at <https://firlab.app/kiro-provider/>: a home page that shows what
kiro-provider does, the user guide in English (`/kiro-provider/`) and Chinese (`/kiro-provider/zh/`), and
kiro-provider's references. It has no domain of its own: `deploy.yml` builds it with the base `/kiro-provider/` and
publishes it inside firlab.app, next to the main site.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/kiro-provider](https://github.com/sunerpy/kiro-provider): the guide under `docs/site/`, next to the code it
describes, and the references as `docs/<NAME>.md` with their Chinese translations in `docs/readme/<NAME>.zh-CN.md`.
A pull request that changes what a user sees updates the page in the same commit, and the same files read correctly on
GitHub. kiro-provider's `docs/site/README.md` has the writing rules and the home page's fields.

This repository owns the site:

| Path                                                                                 | Owner         | Notes                                                                                   |
| ------------------------------------------------------------------------------------ | ------------- | --------------------------------------------------------------------------------------- |
| `src/index.md`, `src/{guide,clients,operate,reference}/`, `src/*.md`, `src/zh/`      | kiro-provider | Synced from `docs/site/`. Edits here are overwritten.                                   |
| `src/{clients,operate,reference,dev}/<page>.md` and their `src/zh/` counterparts     | kiro-provider | The references, synced from `docs/<NAME>.md` and `docs/readme/<NAME>.zh-CN.md`          |
| `src/zh/reference/{streaming-errors,historical-tools}.md`, `src/zh/dev/architecture.md` | sync script | A generated Chinese pointer for each English-only reference                            |
| `src/public/kiro-provider-logo.svg`                                                  | kiro-provider | Synced                                                                                  |
| `src/.vitepress/synced.json`                                                         | sync script   | The commit the content came from; the footer shows it                                   |
| `src/.vitepress/` (config, theme, components)                                        | this repo     |                                                                                         |
| `src/public/{og.svg,og.png}`                                                         | this repo     |                                                                                         |
| `scripts/sync-kiro-provider-docs.sh`                                                 | this repo     | What is synced, the link rewriting, and the checks that stop a bad sync                 |
| `scripts/check-dist.sh`                                                              | this repo     | Checks a build before it joins firlab.app                                               |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json`                                    | this repo     | Build                                                                                   |

To change a sentence on the live site, open a pull request against kiro-provider.

## How a change reaches the site

1. A kiro-provider pull request that touches the pages or the references runs kiro-provider's `docs-site.yml`: it
   syncs them into a checkout of this repository's `main`, builds and runs `scripts/check-dist.sh`, without a secret.
2. After the merge, kiro-provider's `publish-site.yml` runs `scripts/sync-kiro-provider-docs.sh` from this repository
   and pushes the result to `main` as `docs(kiro-provider): sync from kiro-provider@<sha>`.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to `dist/kiro-provider/` and deploys
   firlab.app to GitHub Pages.

The sync script stops before writing anything when:

- an expected reference, translation or asset is missing, or an English-only reference gained a translation;
- a page exists in one language only, or sits where a synced reference goes;
- a page uses a component the theme does not register;
- a guide page uses a colloquial word or names kiro-provider's source tree.

It copies each reference to its page in both languages, gives each English-only reference a Chinese pointer, drops
the GitHub language line at the top of each reference (the site has its own language menu), and rewrites the links: a
link to a reference becomes its path here, and any other link that leaves the synced tree becomes a GitHub link.

The build fails on a dead link and on a home page whose `home:` frontmatter does not match
`src/.vitepress/theme/data/home-schema.ts`. `scripts/check-dist.sh` fails when:

- a language is missing;
- a root-relative link or asset leaves `/kiro-provider/` or does not resolve to an emitted file;
- a sitemap entry leaves `https://firlab.app/kiro-provider/`.

## Local development

`kiro-provider/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd kiro-provider
pnpm install --frozen-lockfile
./scripts/sync-kiro-provider-docs.sh ../../kiro-provider    # a local kiro-provider checkout
pnpm dev                                                    # http://localhost:5173/kiro-provider/
```

```sh
pnpm build      # into kiro-provider/dist
./scripts/check-dist.sh dist
pnpm preview
```

`pnpm preview` indexes `dist/` when it starts; restart it after a new build. The sync writes into `src/`. A local
sync from an uncommitted kiro-provider tree marks the footer commit `-dirty`; do not commit that state here.

`tsconfig.json` is here for the same reason as `codegraph/tsconfig.json`: without it Vite walks up to the root's,
which extends `astro/tsconfigs/strict`, a package this sub-site does not install.

## Design

`DESIGN.md` §15 records where this site departs from the Voltip (§10), Lockra (§11), pt-tools (§12) and CodeGraph
(§13) sites, whose shell it started from. In short:

- English is the root locale, as on the Lockra site, and most references have a Chinese translation;
- the text uses the system faces and the code JetBrains Mono;
- `opt-in` marks what ships switched off: web search and the Chat Completions route;
- the hero shows a recorded terminal session, because kiro-provider has no interface of its own.

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG into a page of the built
site (so the JetBrains Mono face is loaded), open it in Chrome at a 1200 × 630 viewport and take a screenshot.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/kiro-provider/` path: a path needs no DNS
record, certificate or second host.

`deploy.yml` builds the sub-site after the main site and runs `scripts/check-dist.sh`. It then adds the sub-site to
the Pages artifact, refusing to overwrite a `dist/kiro-provider/` the main site emits.

`kiro-provider-site-ci.yml` builds and checks the sub-site on pull requests.

### One-time setup

1. **Token in kiro-provider.** kiro-provider's `publish-site.yml` needs `FIRLAB_DOCS_TOKEN`: a fine-grained personal
   access token for `sunerpy/firlab` only, with Contents read and write and nothing else.

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/kiro-provider
   ```

   Until it exists, that workflow reports that the token is missing and stops, and a sync from kiro-provider's `main`
   reaches this repository through a pull request instead.

2. **The entry on firlab.app.** kiro-provider is an entry in `src/i18n/products.ts`. Its `page.href` is this site's
   absolute path in each language (`/kiro-provider/`, `/kiro-provider/zh/`).

Merge order: this sub-site first, then the kiro-provider change that adds the two workflows, so the first check finds
`kiro-provider/scripts/sync-kiro-provider-docs.sh` on `main`.

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/kiro-provider/ | head -1
curl -sI https://firlab.app/kiro-provider/zh/guide/install | head -1
```

## Adding a page

1. Add the page to kiro-provider under `docs/site/`, in both languages (`docs/site/<path>.md` and
   `docs/site/zh/<path>.md`).
2. Add it to the sidebar in `src/.vitepress/config/en.ts` and `zh.ts`.
3. To publish another reference from `docs/`, add it to `REFERENCES` (or `ENGLISH_ONLY`, with a Chinese title in
   `zh_title`) in `scripts/sync-kiro-provider-docs.sh`, and to `editLinkPattern` (and `ENGLISH_ONLY`) in
   `src/.vitepress/config/shared.ts`.
