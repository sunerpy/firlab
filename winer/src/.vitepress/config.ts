/**
 * Site configuration for firlab.app/winer/.
 *
 * winer owns the Markdown and the screenshots (its `docs/site/`) and pushes them here through
 * `winer/scripts/sync-winer-docs.sh`. FirLab owns this configuration, the theme, the
 * presentation assets and the deploy pipeline.
 *
 * Chinese is the root locale and English sits under /en/, as on the pt-tools site: winer's
 * users and its window are Chinese first (DESIGN.md §16).
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
