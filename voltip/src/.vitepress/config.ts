/**
 * Site configuration for voltip.firlab.app.
 *
 * Voltip owns the Markdown and the product screenshots and pushes them here through
 * `voltip/scripts/sync-voltip-docs.sh`. FirLab owns this configuration, the theme,
 * the presentation assets and the deploy pipeline.
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
