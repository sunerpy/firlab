# bedrock-gateway documentation site

The bedrock-gateway website, published at <https://firlab.app/bedrock-gateway/>: a home page that shows what
bedrock-gateway does, the user guide in English (`/bedrock-gateway/`) and Chinese (`/bedrock-gateway/zh/`), and some of
bedrock-gateway-rust's references. It has no domain of its own: `deploy.yml` builds it with the base
`/bedrock-gateway/` and publishes it inside firlab.app, next to the main site.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/bedrock-gateway-rust](https://github.com/sunerpy/bedrock-gateway-rust): the guide under `docs/site/`, next to
the code it describes, and the references as `docs/<NAME>.md`. A pull request that changes what a user sees updates the
page in the same commit, and the same files read correctly on GitHub. The home page's fields are defined by
`src/.vitepress/theme/data/home-schema.ts` here; bedrock-gateway-rust's `docs/site/README.md` is the place for the
writing rules authors follow.

This repository owns the site:

| Path                                                                                                                        | Owner                | Notes                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `src/index.md`, `src/{guide,clients,operate,reference}/`, `src/*.md`, `src/zh/`                                             | bedrock-gateway-rust | Synced from `docs/site/`. Edits here are overwritten.                                               |
| `src/operate/{docker,ecs,lambda,migration}.md`, `src/reference/protocol.md`                                                 | bedrock-gateway-rust | English-only references, synced from `docs/deploy/*.md` and `docs/openai-protocol-compatibility.md` |
| `src/zh/reference/caching-and-reasoning.md`                                                                                 | bedrock-gateway-rust | The Chinese-only reference, synced from `docs/caching-and-reasoning.md`                             |
| `src/zh/operate/{docker,ecs,lambda,migration}.md`, `src/zh/reference/protocol.md`, `src/reference/caching-and-reasoning.md` | sync script          | A generated pointer in the other language for each one-language reference                           |
| `src/public/bedrock-gateway-logo.svg`                                                                                       | bedrock-gateway-rust | Synced from `docs/site/public/`                                                                     |
| `src/.vitepress/synced.json`                                                                                                | sync script          | The commit the content came from; the footer shows it                                               |
| `src/.vitepress/` (config, theme, components)                                                                               | this repo            |                                                                                                     |
| `src/public/{og.svg,og.png}`                                                                                                | this repo            |                                                                                                     |
| `scripts/sync-bedrock-gateway-docs.sh`                                                                                      | this repo            | What is synced, the link rewriting, and the checks that stop a bad sync                             |
| `scripts/check-dist.sh`                                                                                                     | this repo            | Checks a build before it joins firlab.app                                                           |
| `package.json`, `pnpm-lock.yaml`, `tsconfig.json`                                                                           | this repo            | Build                                                                                               |

To change a sentence on the live site, open a pull request against bedrock-gateway-rust.

## How a change reaches the site

1. A bedrock-gateway-rust pull request that touches the pages or the references runs bedrock-gateway-rust's
   `docs-site.yml`: it syncs them into a checkout of this repository's `main`, builds and runs
   `scripts/check-dist.sh`, without a secret.
2. After the merge, bedrock-gateway-rust's `publish-site.yml` runs `scripts/sync-bedrock-gateway-docs.sh` from this
   repository, commits the result to the branch `bedrock-gateway-docs/sync` and opens a pull request from it, or
   updates the open one. When this repository's checks pass on that pull request, the workflow squash-merges it at the
   commit that was checked. Nothing is pushed to `main` directly; a failed check leaves the pull request open.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to `dist/bedrock-gateway/` and deploys
   firlab.app to GitHub Pages.

The sync script stops before writing anything when:

- an expected reference or asset is missing, or a one-language reference gained a translation under `docs/readme/`;
- a page exists in one language only, or sits where a synced reference or its pointer goes;
- a page uses a component the theme does not register;
- a guide page uses a colloquial word or names bedrock-gateway-rust's source tree (`src/server/…`, `§`);
  `developers.md` may name the source tree.

It copies each reference to its page, gives each one-language reference a pointer in the other language (`noindex`,
out of the sitemap, no edit link), drops the GitHub language line a reference may open with, and rewrites the links: a
link to a reference becomes its path here, and any other link that leaves the synced tree becomes a GitHub link.

The build fails on a dead link, on a home page whose `home:` frontmatter does not match
`src/.vitepress/theme/data/home-schema.ts`, and on a `SplitBlock` whose `proof` names no table. `scripts/check-dist.sh`
fails when:

- a language is missing;
- a root-relative link or asset leaves `/bedrock-gateway/` or does not resolve to an emitted file;
- a sitemap entry leaves `https://firlab.app/bedrock-gateway/`.

## Local development

`bedrock-gateway/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd bedrock-gateway
pnpm install --frozen-lockfile
./scripts/sync-bedrock-gateway-docs.sh ../../bedrock-gateway-rust    # a local bedrock-gateway-rust checkout
pnpm dev                                                             # http://localhost:5173/bedrock-gateway/
```

```sh
pnpm build      # into bedrock-gateway/dist
./scripts/check-dist.sh dist
pnpm preview
```

`pnpm preview` indexes `dist/` when it starts; restart it after a new build. The sync writes into `src/`. A local
sync from an uncommitted bedrock-gateway-rust tree marks the footer commit `-dirty`; do not commit that state here.

`tsconfig.json` is here for the same reason as `codegraph/tsconfig.json`: without it Vite walks up to the root's,
which extends `astro/tsconfigs/strict`, a package this sub-site does not install.

## Design

`DESIGN.md` §17 records where this site departs from the kiro-provider site (§15), whose shell it is. In short:

- one reference is Chinese only, so the sync writes English pointers as well as Chinese ones;
- the text-and-table splits sit side by side from 1200 px, and a table keeps each model ID on one line;
- the four "what goes where" cards sit two by two;
- the mark is two lanes that merge and pass through a gate, teal past it; nothing on the site is orange.

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG into a page of the built
site (so the JetBrains Mono face is loaded), open it in Chrome at a 1200 × 630 viewport and take a screenshot.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/bedrock-gateway/` path: a path needs no DNS
record, certificate or second host.

`deploy.yml` builds the sub-site after the main site and runs `scripts/check-dist.sh`. It then adds the sub-site to
the Pages artifact, refusing to overwrite a `dist/bedrock-gateway/` the main site emits.

`bedrock-gateway-site-ci.yml` builds and checks the sub-site on pull requests.

### One-time setup

1. **Token in bedrock-gateway-rust.** bedrock-gateway-rust's `publish-site.yml` needs `FIRLAB_DOCS_TOKEN`, which
   exists in that repository: a fine-grained personal access token for `sunerpy/firlab` only, with Contents and Pull
   requests read and write and nothing else. A pull request opened with it starts this repository's pull request
   workflows, which one opened with `GITHUB_TOKEN` would not. To replace it:

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/bedrock-gateway-rust
   ```

2. **The entry on firlab.app.** bedrock-gateway is an entry in `src/i18n/products.ts`. Its `page.href` is this site's
   absolute path in each language (`/bedrock-gateway/`, `/bedrock-gateway/zh/`). Its release tags carry
   release-please's component prefix (`bedrock-gateway-rust-v0.17.0`), so `src/i18n/versions.ts` keeps the version
   without it and the prefix as `bedrockgatewayTagPrefix`, which `scripts/check-versions.mjs` and the release links
   put back.

Merge order: this sub-site first, then the bedrock-gateway-rust change that adds the two workflows, so the first check
finds `bedrock-gateway/scripts/sync-bedrock-gateway-docs.sh` on `main`.

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/bedrock-gateway/ | head -1
curl -sI https://firlab.app/bedrock-gateway/zh/guide/install | head -1
```

## Adding a page

1. Add the page to bedrock-gateway-rust under `docs/site/`, in both languages (`docs/site/<path>.md` and
   `docs/site/zh/<path>.md`).
2. Add it to the sidebar in `src/.vitepress/config/en.ts` and `zh.ts`.
3. To publish another reference from `docs/`, add it to `REFERENCES` (bilingual), `ENGLISH_ONLY` (with a Chinese title
   in `zh_title`) or `CHINESE_ONLY` (with an English title in `en_title`) in `scripts/sync-bedrock-gateway-docs.sh`,
   and to `editLinkPattern`, the `ENGLISH_ONLY` or `CHINESE_ONLY` pattern and the sitemap filter in
   `src/.vitepress/config/shared.ts`.
