/**
 * Wayfinding strings — lateral navigation and page endings.
 *
 * Kept out of `ui.ts` deliberately. `ui.ts` is the chrome dictionary for things
 * that appear on *every* page; these strings exist only because a detail page
 * needs a different ending and a different footer than the index does. Adding
 * them there would also collide with the concurrent work extending the product
 * list, and this file has no reason to be touched by that task.
 *
 * Same shape as `ui.ts`: Chinese owns the key set, English is typed against it,
 * so a key added to one and forgotten in the other is a compile error rather
 * than a runtime `undefined`.
 */

import type { Lang } from './ui';

const zh = {
  /** Footer heading on a detail page — lateral movement, not a content list. */
  'footer.jump': '跳到',
  /** Accessible name for that strip. */
  'footer.jumpNav': '产品之间跳转',
  /** Marks the entry the reader is already on. */
  'footer.jumpCurrent': '当前页面',
  /**
   * Back to the index, phrased as a destination rather than a retreat. It sits
   * directly after the wordmark, so it must NOT repeat it — "FirLab" + "目录"
   * composes into "FirLab 目录" on the page.
   */
  'footer.index': '目录',

  /** Pager eyebrow. The pager is navigation, not another pitch. */
  'pager.label': '下一个',
  'pager.nav': '产品顺序导航',
  /** Appended to the pager link's accessible name. */
  'pager.aria': '下一个产品',
  /** Shown on the pager when the sequence wraps back to the first product. */
  'pager.wrap': '回到第一个',

  /** Copy affordance on a command line. */
  'copy.action': '复制命令',
  'copy.done': '已复制',
  'copy.failed': '复制失败，请手动选择',
} as const;

const en: Record<keyof typeof zh, string> = {
  'footer.jump': 'Jump to',
  'footer.jumpNav': 'Jump between products',
  'footer.jumpCurrent': 'Current page',
  'footer.index': 'Index',

  'pager.label': 'Next',
  'pager.nav': 'Product sequence',
  'pager.aria': 'Next product',
  'pager.wrap': 'Back to the first',

  'copy.action': 'Copy command',
  'copy.done': 'Copied',
  'copy.failed': 'Copy failed — select it manually',
};

const wayfinding = { 'zh-cn': zh, en } as const satisfies Record<Lang, Record<string, string>>;

export type WayfindingKey = keyof typeof zh;

/**
 * Accessor mirroring `useTranslations` from `ui.ts`, minus the interpolation:
 * nothing here takes a variable.
 */
export function useWayfinding(lang: Lang) {
  return function w(key: WayfindingKey): string {
    return wayfinding[lang][key] ?? wayfinding['zh-cn'][key];
  };
}
