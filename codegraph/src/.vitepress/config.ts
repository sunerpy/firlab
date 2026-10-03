/**
 * Site configuration for firlab.app/codegraph/.
 *
 * codegraph-rust owns the Markdown and the screenshots and pushes them here through
 * `codegraph/scripts/sync-codegraph-docs.sh`. FirLab owns this configuration, the theme,
 * the presentation assets and the deploy pipeline.
 *
 * Chinese is the root locale and English sits under /en/, as on the pt-tools site: the site
 * replaced firlab.app's Chinese-first CodeGraph product page at the same path (user decision
 * 2026-10-03, DESIGN.md §13).
 */
import { defineConfig } from 'vitepress';
import { shared } from './config/shared';
import { zh } from './config/zh';
import { en } from './config/en';

export default defineConfig({
  ...shared,
  locales: {
    root: { label: '简体中文', ...zh },
    en: { label: 'English', ...en },
  },
});
