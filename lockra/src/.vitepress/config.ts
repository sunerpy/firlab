/**
 * Site configuration for firlab.app/lockra.
 *
 * Lockra owns the Markdown and the product screenshots and pushes them here through
 * `lockra/scripts/sync-lockra-docs.sh`. FirLab owns this configuration, the theme, the
 * presentation assets and the deploy pipeline, which builds this site into firlab.app under
 * `/lockra/` (no domain of its own).
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
