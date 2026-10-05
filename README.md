# firlab

Source for [firlab.app](https://firlab.app) — the catalog of FirLab's open-source
apps: desktop apps, command-line tools and self-hosted services, each with its
overview, documentation and downloads.

## Stack

- [Astro](https://astro.build) 7, `output: 'static'` — the whole site is
  prerendered to HTML at build time
- [Tailwind CSS](https://tailwindcss.com) 4 via `@tailwindcss/vite`
- TypeScript, checked with `astro check`
- `@astrojs/sitemap` for `sitemap-index.xml`
- No client-side framework — the only JavaScript is two small inline scripts
  (the theme control, and the popovers and copy buttons)

## Local development

Requires Node 22 (see `.node-version`) and pnpm 10 (pinned in `package.json`).

```sh
pnpm install     # install dependencies
pnpm dev         # dev server on http://localhost:4321
pnpm check       # astro check (TypeScript + Astro diagnostics)
pnpm build       # production build into ./dist
pnpm preview     # serve ./dist locally to verify the build
```

## Adding an app

The home page, the header's app menu, the footer and the release list all render
from one list, `src/i18n/products.ts`. A new app is an entry there, two version
constants in `src/i18n/versions.ts` plus a row in `scripts/check-versions.mjs`,
and its icon in `src/components/AppIcon.astro`. [DESIGN.md §4](DESIGN.md#4-the-catalog)
has the checklist and the rules for its one-line description.

## Deployment

Pushes to `main` build and publish to GitHub Pages automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow can
also be triggered manually from the Actions tab.

Pull requests run [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which
installs, type-checks, and builds without deploying.

Seven product documentation sites live here too, each a VitePress project that
installs on its own. Two deploy to Cloudflare Pages on their own subdomains:
`docs/` is [zuno.firlab.app](https://zuno.firlab.app) (`deploy-docs.yml`) and
`voltip/` is [voltip.firlab.app](https://voltip.firlab.app) (`deploy-voltip.yml`).
The other five have no domain of their own: `deploy.yml` builds `lockra/`,
`pt-tools/`, `codegraph/`, `kiro-provider/` and `winer/` with the bases `/lockra/`,
`/pt-tools/`, `/codegraph/`, `/kiro-provider/` and `/winer/`, and publishes them inside
this site at [firlab.app/lockra](https://firlab.app/lockra/),
[firlab.app/pt-tools](https://firlab.app/pt-tools/),
[firlab.app/codegraph](https://firlab.app/codegraph/),
[firlab.app/kiro-provider](https://firlab.app/kiro-provider/) and
[firlab.app/winer](https://firlab.app/winer/)
(`lockra-site-ci.yml`, `pt-tools-site-ci.yml`, `codegraph-site-ci.yml`,
`kiro-provider-site-ci.yml` and `winer-site-ci.yml` check them on pull requests). Their
pages are pushed in from the product repositories; `docs/README.md`, `voltip/README.md`,
`lockra/README.md`, `pt-tools/README.md`, `codegraph/README.md`,
`kiro-provider/README.md` and `winer/README.md` describe the sync and the one-time setup.

## Custom domain

DNS for `firlab.app` is managed at Cloudflare; hosting is GitHub Pages.

`public/CNAME` contains `firlab.app` and Astro copies it to `dist/CNAME` on
build. That file is what keeps the custom domain bound — **do not delete it.**
If it goes missing, GitHub Pages drops the custom domain and the site starts
serving 404s on the apex. Both workflows assert `dist/CNAME` exists after the
build so this fails in CI rather than in production.

Two related constraints worth remembering:

- `.app` is on the HSTS preload list, so HTTPS is mandatory and GitHub Pages
  must have "Enforce HTTPS" enabled.
- GitHub cannot issue or renew its certificate while the Cloudflare DNS records
  are proxied. Keep them on "DNS only" (grey cloud) at least during certificate
  provisioning and renewal.

## License

[MIT](LICENSE)
