# godot-mcp documentation site

The godot-mcp website, published at <https://firlab.app/godot-mcp/>: a home page that shows what godot-mcp does,
the user guide in English (`/godot-mcp/`) and Chinese (`/godot-mcp/zh/`), and some of godot-mcp's references. It has
no domain of its own: `deploy.yml` builds it with the base `/godot-mcp/` and publishes it inside firlab.app, next to
the main site.

## What lives where

The words are **not written in this repository**. They live in
[sunerpy/godot-mcp](https://github.com/sunerpy/godot-mcp): the guide under `docs/site/`, next to the code it
describes, and the references as `docs/<NAME>.md`. A pull request that changes what a user sees updates the page in
the same commit, and the same files read correctly on GitHub. The home page's fields are defined by
`src/.vitepress/theme/data/home-schema.ts` here; godot-mcp's `docs/site/README.md` is the place for the writing rules
authors follow.

This repository owns the site:

| Path                                                                       | Owner       | Notes                                                                                                          |
| -------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `src/index.md`, `src/{guide,operate}/`, `src/*.md`, `src/zh/`              | godot-mcp   | Synced from `docs/site/`. Edits here are overwritten.                                                          |
| `src/reference/*.md` but `usage.md`                                        | godot-mcp   | The thirteen English-only references, synced from `docs/operator/`, `docs/protocol/` and `docs/security/`      |
| `src/zh/reference/usage.md`                                                | godot-mcp   | The Chinese-only reference, synced from `docs/operator/usage-and-verification.md`                              |
| `src/zh/reference/*.md` but `usage.md`, `src/reference/usage.md`           | sync script | A generated pointer in the other language for each one-language reference                                      |
| `src/public/godot-mcp-logo.svg`                                            | godot-mcp   | Synced from `docs/site/public/`                                                                                |
| `src/.vitepress/synced.json`                                               | sync script | The commit the content came from; the footer shows it                                                          |
| `src/.vitepress/` (config, theme, components)                              | this repo   |                                                                                                                |
| `src/public/{og.svg,og.png}`                                               | this repo   |                                                                                                                |
| `scripts/sync-godot-mcp-docs.sh`                                           | this repo   | What is synced, the link rewriting, and the checks that stop a bad sync                                        |
| `scripts/check-dist.sh`                                                    | this repo   | Checks a build before it joins firlab.app                                                                      |
| `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`   | this repo   | Build                                                                                                          |

To change a sentence on the live site, open a pull request against godot-mcp.

## How a change reaches the site

1. A godot-mcp pull request that touches the pages or the references runs godot-mcp's `docs-site.yml`: it syncs them
   into a checkout of this repository's `main`, builds and runs `scripts/check-dist.sh`, without a secret.
2. After the merge, godot-mcp's `publish-site.yml` runs `scripts/sync-godot-mcp-docs.sh` from this repository,
   commits the result to the branch `godot-mcp-docs/sync` and opens a pull request from it, or updates the open one.
   When this repository's checks pass on that pull request, the workflow squash-merges it at the commit that was
   checked. Nothing is pushed to `main` directly; a failed check leaves the pull request open. A sync that changes
   nothing opens nothing.
3. `deploy.yml` builds the main site and this one, checks this one, copies it to `dist/godot-mcp/` and deploys
   firlab.app to GitHub Pages.

The sync script stops before writing anything when:

- an expected reference or asset is missing, or a one-language reference gained a translation under `docs/readme/`;
- a page exists in one language only, or sits where a synced reference or its pointer goes;
- a page uses a component the theme does not register;
- a guide page uses a colloquial word or names godot-mcp's source tree (`crates/godot-mcp-…/`, `src/….rs`) or a
  plan's task number; `developers.md` may name the source tree.

It copies each reference to its page, gives each one-language reference a pointer in the other language (`noindex`,
out of the sitemap, no edit link), drops the GitHub language line a reference may open with, and rewrites the links: a
link to a reference becomes its path here, and any other link that leaves the synced tree becomes a GitHub link.

The build fails on a dead link, on a home page whose `home:` frontmatter does not match
`src/.vitepress/theme/data/home-schema.ts`, and on a `SplitBlock` whose `proof` names no table. `scripts/check-dist.sh`
fails when:

- a language is missing;
- a root-relative link or asset leaves `/godot-mcp/` or does not resolve to an emitted file;
- a sitemap entry leaves `https://firlab.app/godot-mcp/`.

## Local development

`godot-mcp/` installs on its own; the repository root is not a pnpm workspace.

```sh
cd godot-mcp
pnpm install --frozen-lockfile
./scripts/sync-godot-mcp-docs.sh ../../godot-mcp    # a local godot-mcp checkout
pnpm dev                                            # http://localhost:5173/godot-mcp/
```

```sh
pnpm build      # into godot-mcp/dist
./scripts/check-dist.sh dist
pnpm preview
```

`pnpm preview` indexes `dist/` when it starts; restart it after a new build. The sync writes into `src/`. A local
sync from an uncommitted godot-mcp tree marks the footer commit `-dirty`; do not commit that state here.

`tsconfig.json` is here for the same reason as `codegraph/tsconfig.json`: without it Vite walks up to the root's,
which extends `astro/tsconfigs/strict`, a package this sub-site does not install.

## Design

`DESIGN.md` §18 records where this site departs from the bedrock-gateway site (§17), whose shell it is. In short:

- the hero shows an MCP exchange (tool calls and fields of their answers) instead of a terminal session;
- each capability on the home page says what it needs, `no-engine` or `engine`, instead of a release state;
- the three splits show the profiles, the managed sessions and the locked Godot builds;
- the mark is a scene tree of three nodes with the link to the client in orange, the Voltip site's palette as it is.

`src/public/og.svg` is the source of `og.png` (1200 × 630). To render it, inline the SVG into a page of the built
site (so the JetBrains Mono face is loaded), open it in Chrome at a 1200 × 630 viewport and take a screenshot.

## Deployment

firlab.app is one GitHub Pages site, so this one is served from its `/godot-mcp/` path: a path needs no DNS record,
certificate or second host.

`deploy.yml` builds the sub-site after the main site and runs `scripts/check-dist.sh`. It then adds the sub-site to
the Pages artifact, refusing to overwrite a `dist/godot-mcp/` the main site emits.

`godot-mcp-site-ci.yml` builds and checks the sub-site on pull requests.

### One-time setup

1. **Token in godot-mcp.** godot-mcp's `publish-site.yml` needs `FIRLAB_DOCS_TOKEN` when a sync changes the site: a
   fine-grained personal access token for `sunerpy/firlab` only, with Contents and Pull requests read and write and
   nothing else. A pull request opened with it starts this repository's pull request workflows, which one opened with
   `GITHUB_TOKEN` would not. GitHub has no API that creates one, so it is made by hand:

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/godot-mcp
   ```

2. **The entry on firlab.app.** godot-mcp is an entry in `src/i18n/products.ts`. Its `page.href` is this site's
   absolute path in each language (`/godot-mcp/`, `/godot-mcp/zh/`). Its version and release date are the
   `godotmcpVersion` and `godotmcpReleased` constants in `src/i18n/versions.ts`, which `scripts/check-versions.mjs`
   keeps in step with the latest release.

Merge order: this sub-site first, then the godot-mcp change that adds the two workflows, so the first check finds
`godot-mcp/scripts/sync-godot-mcp-docs.sh` on `main`.

### Verifying a deploy

```sh
gh run list --repo sunerpy/firlab --workflow=Deploy --limit 3
curl -sI https://firlab.app/godot-mcp/ | head -1
curl -sI https://firlab.app/godot-mcp/zh/guide/install | head -1
```

## Adding a page

1. Add the page to godot-mcp under `docs/site/`, in both languages (`docs/site/<path>.md` and
   `docs/site/zh/<path>.md`).
2. Add it to the sidebar in `src/.vitepress/config/en.ts` and `zh.ts`.
3. To publish another reference from `docs/`, add it to `REFERENCES` (bilingual), `ENGLISH_ONLY` (with a Chinese title
   in `zh_title`) or `CHINESE_ONLY` (with an English title in `en_title`) in `scripts/sync-godot-mcp-docs.sh`, and to
   `editLinkPattern`, the `ENGLISH_ONLY` or `CHINESE_ONLY` pattern and the sitemap filter in
   `src/.vitepress/config/shared.ts`.
