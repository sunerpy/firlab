// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Required for absolute URLs in sitemap.xml, canonical tags and Open Graph.
  site: 'https://firlab.app',

  // Static output — deployed to GitHub Pages.
  // To migrate to a server runtime later (e.g. ECS), add an SSR adapter here.
  output: 'static',

  // Chinese is the primary audience, so it owns the bare root: `/` is zh-CN and
  // `/en/` is English. `prefixDefaultLocale: false` keeps `/` un-prefixed rather
  // than redirecting it to `/zh-cn/`, which would cost every visitor a hop and
  // break the already-indexed apex URL.
  //
  // No `routing.fallback` and no `redirectToDefaultLocale`: every page is
  // authored in both languages, so there is nothing to fall back to and an
  // English visitor deep-linking to `/en/...` must never be bounced to Chinese.
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Emit `/about/index.html` instead of `/about.html` so URLs work on
  // GitHub Pages without relying on its extension-stripping behaviour.
  build: {
    format: 'directory',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    // Deliberately NO `i18n` option, which is what would make the sitemap emit
    // `xhtml:link rel="alternate"` pairs.
    //
    // hreflang is declared in exactly one place: each document's own head, via
    // `Layout.astro`. Google treats head links, sitemap alternates and HTTP
    // headers as equivalent and says outright that using more than one buys
    // nothing in Search and costs you the job of keeping them in sync. This site
    // shipped two of them and they had already drifted — the head set carried
    // `x-default`, the sitemap set did not. The head implementation is the richer
    // and better-verified one, so the sitemap stops declaring alternates.
    // https://developers.google.com/search/docs/specialty/international/localized-versions
    //
    // `namespaces.xhtml: false` then drops the now-unused `xmlns:xhtml`
    // declaration from `urlset`. Note it only controls that declaration: on its
    // own, with `i18n` still set, it would emit `xhtml:link` elements whose
    // prefix is undeclared — invalid XML. Removing `i18n` is what actually stops
    // the elements; this just cleans up after it.
    sitemap({
      namespaces: { xhtml: false },
    }),
  ],
});
