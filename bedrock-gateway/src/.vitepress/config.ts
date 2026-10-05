/**
 * Site configuration for firlab.app/bedrock-gateway/.
 *
 * bedrock-gateway-rust owns the Markdown and pushes it here through
 * `bedrock-gateway/scripts/sync-bedrock-gateway-docs.sh`. FirLab owns this configuration, the
 * theme, the presentation assets and the deploy pipeline, which builds this site into firlab.app
 * under `/bedrock-gateway/` (no domain of its own).
 *
 * English is the root locale and Chinese sits under /zh/, as on the kiro-provider site:
 * bedrock-gateway-rust's README and most of its references are English. One reference is Chinese
 * only, and the sync gives it an English pointer, as it gives each English-only reference a
 * Chinese one.
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
