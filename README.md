# firlab

Source for [firlab.app](https://firlab.app) — a landing page that indexes the
developer tools I build and maintain.

## Stack

- [Astro](https://astro.build) 7, `output: 'static'` — the whole site is
  prerendered to HTML at build time
- [Tailwind CSS](https://tailwindcss.com) 4 via `@tailwindcss/vite`
- TypeScript, checked with `astro check`
- `@astrojs/sitemap` for `sitemap-index.xml`
- Zero client-side JavaScript — no framework runtime ships to the browser

## Local development

Requires Node 22 (see `.node-version`) and pnpm 9.

```sh
pnpm install     # install dependencies
pnpm dev         # dev server on http://localhost:4321
pnpm check       # astro check (TypeScript + Astro diagnostics)
pnpm build       # production build into ./dist
pnpm preview     # serve ./dist locally to verify the build
```

## Deployment

Pushes to `main` build and publish to GitHub Pages automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow can
also be triggered manually from the Actions tab.

Pull requests run [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which
installs, type-checks, and builds without deploying.

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
