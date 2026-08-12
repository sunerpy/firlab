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

  // Emit `/about/index.html` instead of `/about.html` so URLs work on
  // GitHub Pages without relying on its extension-stripping behaviour.
  build: {
    format: 'directory',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
