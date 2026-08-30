/**
 * Site configuration for zuno.firlab.app.
 *
 * Zuno owns the Markdown content and pushes it here through
 * `docs/scripts/sync-zuno-docs.sh`. FirLab owns the VitePress configuration,
 * theme, public presentation assets, and deploy pipeline.
 */
import { defineConfig } from 'vitepress';
import { shared } from './config/shared';
import { en } from './config/en';
import { zh } from './config/zh';

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
    zh: { label: '简体中文', ...zh },
  },
});
