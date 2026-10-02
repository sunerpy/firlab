/**
 * Wayfinding strings — the pager that ends a product page, and the copy
 * affordance on command lines.
 *
 * Kept out of `ui.ts`, which is the chrome dictionary for things on every page.
 * Same shape: Chinese owns the key set and English is typed against it, so a key
 * added to one and forgotten in the other is a compile error rather than a runtime
 * `undefined`.
 */

import type { Lang } from './ui';

const zh = {
  /** Pager label. The pager is navigation, not another pitch. */
  'pager.label': '下一个应用',
  'pager.nav': '应用顺序导航',
  /** Shown on the pager when the sequence wraps back to the first product. */
  'pager.wrap': '回到第一个',

  /** Copy affordance on a command line. */
  'copy.action': '复制命令',
  'copy.done': '已复制',
  'copy.failed': '复制失败，请手动选择',
} as const;

const en: Record<keyof typeof zh, string> = {
  'pager.label': 'Next app',
  'pager.nav': 'App sequence',
  'pager.wrap': 'Back to the first',

  'copy.action': 'Copy command',
  'copy.done': 'Copied',
  'copy.failed': 'Copy failed — select it manually',
};

const wayfinding = { 'zh-cn': zh, en } as const satisfies Record<Lang, Record<string, string>>;

export type WayfindingKey = keyof typeof zh;

/** Accessor mirroring `useTranslations` from `ui.ts`, minus the interpolation. */
export function useWayfinding(lang: Lang) {
  return function w(key: WayfindingKey): string {
    return wayfinding[lang][key] ?? wayfinding['zh-cn'][key];
  };
}
