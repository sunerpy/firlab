/**
 * VitePress configuration for the Zuno documentation site (zuno.firlab.app).
 *
 * WHERE THE CONTENT COMES FROM
 *
 * Two sources share one tree, split by path so a sync can never clobber authored
 * work:
 *
 *   SYNCED from the zuno repository, never hand-edited here —
 *     cli/, reference/, design/, faq.md, harness-runtime.md, logging.md,
 *     migration.md, orchestration.md, plugins.md, session-retention.md,
 *     resource-gates.md, perf-methodology.md, process-plugin-development.md
 *
 *   AUTHORED here, never touched by the sync —
 *     index.md, guide/, config/, operate/, zh/
 *
 * zuno owns the first set: `crates/zuno-cli/tests/docs.rs` asserts on those files'
 * contents, so an edit made in this repository would both be overwritten on the
 * next sync and break a test in a repository the editor is not looking at.
 * `.github/workflows/sync-zuno-docs.yml` documents the mechanism.
 *
 * WHY THE SYNC PUSHES RATHER THAN PULLS
 *
 * zuno is private and firlab is public. A token here capable of reading zuno would
 * be reachable from public workflow contexts, so the credential direction is
 * inverted: zuno's CI pushes its Markdown into this repository. This repository
 * holds no access to zuno at all.
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
