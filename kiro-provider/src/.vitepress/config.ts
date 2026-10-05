/**
 * Site configuration for firlab.app/kiro-provider/.
 *
 * kiro-provider owns the Markdown and pushes it here through
 * `kiro-provider/scripts/sync-kiro-provider-docs.sh`. FirLab owns this configuration, the theme,
 * the presentation assets and the deploy pipeline, which builds this site into firlab.app under
 * `/kiro-provider/` (no domain of its own).
 *
 * English is the root locale and Chinese sits under /zh/, as on the Lockra site: kiro-provider's
 * README and canonical references are English, with Chinese translations beside them.
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
