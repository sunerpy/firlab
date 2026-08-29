# Documentation site

The Zuno documentation site, published at <https://zuno.firlab.app>.

## What lives where

Documentation content is **not authored in this repository**. It lives in
[sunerpy/zuno](https://github.com/sunerpy/zuno) under `docs/`, next to the code it
describes, where `crates/zuno-cli/tests/docs.rs` asserts on it and a developer
changing behaviour updates the prose in the same commit.

This repository owns only the site:

| Path | Owner | Notes |
| --- | --- | --- |
| `src/cli/`, `src/config/`, `src/guide/`, `src/operate/`, `src/reference/`, `src/design/`, `src/zh/`, `src/index.md`, `src/*.md` | zuno | Synced. Editing here is overwritten. |
| `src/.vitepress/` | this repo | Config, sidebars, theme |
| `scripts/sync-zuno-docs.sh` | this repo | Defines exactly what is synced |
| `package.json`, `tsconfig.json` | this repo | Build |

To change a sentence on the live site, open a pull request against zuno.

## Why the sync pushes rather than pulls

zuno is private; firlab is public. A token stored here capable of reading zuno
would be reachable from public workflow contexts — a fork pull request, or an edit
to a workflow file — and would leak private source. Inverting the direction removes
that exposure: the credential lives in the private repository and grants write
access to a public one.

zuno's `.github/workflows/publish-docs.yml` runs `scripts/sync-zuno-docs.sh` from
this repository, commits the result here, and this repository's
`deploy-docs.yml` builds and publishes it.

## Local development

`docs/` installs on its own. The repository root is deliberately **not** a pnpm
workspace, so run install from this directory:

```sh
cd docs
pnpm install
pnpm dev
```

To preview against a local zuno checkout:

```sh
./scripts/sync-zuno-docs.sh ../../zuno
pnpm dev
```

Build the production site:

```sh
pnpm build
pnpm preview
```

### Why `docs/tsconfig.json` exists

Vite resolves the nearest `tsconfig.json` by walking up from each source file.
Without one here it finds the repository root's, which extends
`astro/tsconfigs/strict` — and Astro is a dependency of the root package, not of
this sub-site. CI, which installs only `docs/`, then fails with:

```text
[vite:esbuild] failed to resolve "extends":"astro/tsconfigs/strict"
```

It passes locally only when the root `node_modules` happens to be installed. The
sub-site's own `tsconfig.json` stops the walk at the boundary that already exists.

## Deployment

GitHub Pages allows one custom domain per repository, and `public/CNAME` binds it
to `firlab.app`. The docs site therefore goes to **Cloudflare Pages**, which also
keeps the two deployments independent: a docs build failure cannot take firlab.app
down.

### One-time setup

Only the credentials are manual. The Pages project and the custom-domain binding
are created by `deploy-docs.yml` itself, idempotently, so a fresh account needs no
dashboard clicking beyond issuing the token.

1. **Add the repository secrets.**

   | Secret | Value | Scope |
   | --- | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | API token with `Cloudflare Pages: Edit` | This repository |
   | `CLOUDFLARE_ACCOUNT_ID` | The account id | This repository |

   A DNS-only token is **not** sufficient. Measured: with a zone-scoped token every
   account-level endpoint answers `403`, including `pages/projects`, while
   `zones/:id/dns_records` answers `200`.

   ```sh
   gh secret set CLOUDFLARE_API_TOKEN --repo sunerpy/firlab
   gh secret set CLOUDFLARE_ACCOUNT_ID --repo sunerpy/firlab
   ```

2. **Add the DNS record.**

   Attaching a custom domain to a Pages project does **not** create the DNS record,
   even when the zone is in the same account. Measured on the first real run: the
   attach call returned `success` with `status: initializing`, and the zone still
   held zero records for `zuno.firlab.app` five minutes later. The domain only
   resolved after the CNAME was created explicitly:

   ```sh
   curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
     -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
     --data '{"type":"CNAME","name":"zuno","content":"zuno-docs-nae.pages.dev","proxied":true}'
   ```

   `zuno-docs-nae.pages.dev` is this project's assigned subdomain; a project
   recreated from scratch gets a different one, so read it from the deploy log
   rather than copying this value.

3. **Add the docs token to zuno.**

   zuno's publish workflow needs `FIRLAB_DOCS_TOKEN`: a fine-grained personal
   access token scoped to `sunerpy/firlab` **only**, with `Contents: read and
   write`. It needs nothing else. GitHub exposes no API for creating personal
   access tokens, so this one is created in the web UI.

   ```sh
   gh secret set FIRLAB_DOCS_TOKEN --repo sunerpy/zuno
   ```

### Verifying a deploy

```sh
gh run list --workflow='Deploy docs' --limit 3
```

The build fails closed if a locale collapses: `Verify both locales were emitted`
checks that both home pages exist and that the Chinese locale did not silently
drop to nothing.

## Adding a page

1. Add the Markdown to zuno under `docs/`.
2. Add its path to the sidebar in `src/.vitepress/config/en.ts` or `zh.ts`.
3. If it is outside a directory `sync-zuno-docs.sh` already copies, add it to
   `SYNCED_DIRS` or `SYNCED_FILES` in that script.

`ignoreDeadLinks` is `false`, so a link to a page that does not exist fails the
build rather than shipping a 404.
