/**
 * Site configuration for firlab.app/godot-mcp/.
 *
 * godot-mcp owns the Markdown and pushes it here through `godot-mcp/scripts/sync-godot-mcp-docs.sh`.
 * FirLab owns this configuration, the theme, the presentation assets and the deploy pipeline,
 * which builds this site into firlab.app under `/godot-mcp/` (no domain of its own).
 *
 * English is the root locale and Chinese sits under /zh/, as on the kiro-provider and
 * bedrock-gateway sites: godot-mcp's README and its references are English. One reference is
 * Chinese only, and the sync gives it an English pointer, as it gives each English-only reference
 * a Chinese one.
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
