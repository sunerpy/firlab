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
    // `i18n` makes the sitemap emit `xhtml:link rel="alternate"` pairs, so the
    // locale relationship is declared to crawlers in the sitemap as well as in
    // each document's <head>. Keys are the Astro locale ids; values are the
    // hreflang codes that actually ship.
    sitemap({
      i18n: {
        defaultLocale: 'zh-cn',
        locales: {
          'zh-cn': 'zh-CN',
          en: 'en',
        },
      },
    }),
  ],
});
