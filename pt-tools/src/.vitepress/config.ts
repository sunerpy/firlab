/**
 * Site configuration for firlab.app/pt-tools/.
 *
 * pt-tools owns the Markdown and the screenshots and pushes them here through
 * `pt-tools/scripts/sync-pt-tools-docs.sh`. FirLab owns this configuration, the theme,
 * the presentation assets and the deploy pipeline.
 *
 * Chinese is the root locale and English sits under /en/ — the reverse of the Voltip
 * site, because pt-tools' users and its existing documentation are Chinese first
 * (user decision 2026-10-01, DESIGN.md §12).
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
