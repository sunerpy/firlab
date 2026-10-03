/**
 * The product catalog: the one list every surface renders from — the home page's
 * app grid and its release list, the header's app menu, the footer, the pager at
 * the end of a product page, and the home page's ItemList JSON-LD. Nothing else
 * lists the products by hand, and no copy anywhere states how many there are.
 *
 * Adding an app:
 *   1. an entry below (array order is display order);
 *   2. two constants in `versions.ts` and a row in `scripts/check-versions.mjs`,
 *      which the daily drift check reads;
 *   3. its icon in `AppIcon.astro`;
 *   4. where its name leads: an in-site page under `src/pages/` (`page.slug`), or a
 *      documentation site published under firlab.app (`page.href`, per locale).
 *
 * Facts were checked against each product's README, licence file and release tags.
 * The constraints that must survive any edit of a tagline:
 *   - pt-tools downloads FREE torrents from a feed unless a filter rule widens it;
 *     never write "downloads everything from a feed".
 *   - CodeGraph contains no model of any kind; it is not semantic search.
 *   - Voltip's on-device path keeps audio on the computer, but its cloud and AI
 *     polish paths send audio or text to the service the user chose. Never write
 *     "nothing leaves your computer".
 *   - Lockra goes online for its own updates and, once the user sets it up, for
 *     sync through storage of their own. Never write "no network connections".
 */

import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Lang } from './ui';
import {
  AGENTLENS_RELEASED,
  AGENTLENS_VERSION,
  codegraphReleased,
  codegraphVersion,
  LOCKRA_RELEASED,
  LOCKRA_VERSION,
  pttoolsReleased,
  pttoolsVersion,
  VOLTIP_RELEASED,
  VOLTIP_VERSION,
} from './versions';

export type ProductId = 'pttools' | 'codegraph' | 'agentlens' | 'voltip' | 'lockra';

/** `live` is a product with a steady release history; `early` has shipped but is young. */
export type Status = 'live' | 'early' | 'wip';

export type Category = 'service' | 'cli' | 'desktop';

export type Platform = 'windows' | 'macos' | 'linux' | 'docker';

/** Canonical rendering order, whatever order an entry lists its platforms in. */
export const PLATFORM_ORDER: readonly Platform[] = ['windows', 'macos', 'linux', 'docker'];

export interface Product {
  id: ProductId;
  name: string;
  category: Category;
  platforms: Platform[];
  status: Status;
  /** The latest stable release tag. Absent for anything unreleased. */
  version?: string;
  /** UTC date of that release. */
  released?: string;
  license: 'MIT' | 'Apache-2.0' | 'AGPL-3.0-or-later';
  repo: string;
  /**
   * Where the product's name leads. `slug` is an in-site page relative to the locale
   * root; `href` is a site published under firlab.app, which owns its own locale paths.
   */
  page: { slug: string } | { href: Record<Lang, string> };
  /** A product website on its own domain, if there is one. */
  site?: Record<Lang, string>;
  /** One plain sentence: what it does. Shown on the card and in the app menu. */
  tagline: Record<Lang, string>;
}

const VOLTIP_SITE = 'https://voltip.firlab.app';

export const products: Product[] = [
  {
    id: 'pttools',
    name: 'pt-tools',
    category: 'service',
    platforms: ['docker', 'linux', 'windows'],
    status: 'live',
    version: pttoolsVersion,
    released: pttoolsReleased,
    license: 'MIT',
    repo: 'https://github.com/sunerpy/pt-tools',
    page: { href: { 'zh-cn': '/pt-tools/', en: '/pt-tools/en/' } },
    tagline: {
      'zh-cn': 'PT 站点的 RSS 订阅下载、跨站搜索、数据统计和种子清理，自部署在自己的服务器或 NAS 上。',
      en: 'RSS downloads, cross-site search, statistics and torrent cleanup for private trackers, self-hosted on your own server or NAS.',
    },
  },
  {
    id: 'codegraph',
    name: 'CodeGraph',
    category: 'cli',
    platforms: ['linux', 'macos', 'windows'],
    status: 'live',
    version: codegraphVersion,
    released: codegraphReleased,
    license: 'MIT',
    repo: 'https://github.com/sunerpy/codegraph-rust',
    page: { href: { 'zh-cn': '/codegraph/', en: '/codegraph/en/' } },
    tagline: {
      'zh-cn': '把代码仓库解析成符号和调用关系的索引，供命令行、编辑器和编码 Agent 查询，不依赖任何模型。',
      en: 'Indexes the symbols and calls in a repository for the command line, editors and coding agents to query. No model involved.',
    },
  },
  {
    id: 'agentlens',
    name: 'AgentLens',
    category: 'desktop',
    platforms: ['windows', 'macos', 'linux'],
    status: 'early',
    version: AGENTLENS_VERSION,
    released: AGENTLENS_RELEASED,
    license: 'MIT',
    repo: 'https://github.com/sunerpy/AgentLens',
    page: { slug: 'agentlens/' },
    tagline: {
      'zh-cn': '汇总本机和远程主机上编码 Agent 的用量记录，按 Agent、模型或项目查看。',
      en: 'Collects coding-agent usage from this computer and from remote hosts, viewable by agent, model or project.',
    },
  },
  {
    id: 'voltip',
    name: 'Voltip',
    category: 'desktop',
    platforms: ['windows', 'macos', 'linux'],
    status: 'early',
    version: VOLTIP_VERSION,
    released: VOLTIP_RELEASED,
    license: 'AGPL-3.0-or-later',
    repo: 'https://github.com/sunerpy/voltip',
    page: { slug: 'voltip/' },
    site: { 'zh-cn': `${VOLTIP_SITE}/zh/`, en: `${VOLTIP_SITE}/` },
    tagline: {
      'zh-cn': '按住快捷键说话，松开后文字输入到光标处。可以用本机模型识别，也可以用云端服务。',
      en: 'Hold a shortcut and speak; the text is typed at your cursor. Recognition runs on a local model or a cloud service.',
    },
  },
  {
    id: 'lockra',
    name: 'Lockra',
    category: 'desktop',
    platforms: ['windows', 'macos', 'linux'],
    status: 'early',
    version: LOCKRA_VERSION,
    released: LOCKRA_RELEASED,
    license: 'Apache-2.0',
    repo: 'https://github.com/sunerpy/lockra',
    page: { href: { 'zh-cn': '/lockra/zh/', en: '/lockra/' } },
    tagline: {
      'zh-cn': '离线使用的两步验证器。验证码加密保存在本机，可选通过自己的存储在多台设备间同步。',
      en: 'An offline two-factor authenticator. Codes are encrypted on your computer, with optional sync between devices through storage of your own.',
    },
  },
];

/**
 * The URL a product's name leads to. Every link goes through here, so a product
 * whose site owns its own locale paths is never sent through the locale prefix by
 * one surface and not another: Lockra's English site is `/lockra/`, and
 * `getRelativeLocaleUrl('en', 'lockra/')` would make that `/en/lockra/`, which does
 * not exist.
 */
export function productHref(lang: Lang, product: Pick<Product, 'page'>): string {
  return 'slug' in product.page
    ? getRelativeLocaleUrl(lang, product.page.slug)
    : product.page.href[lang];
}

/** True when the name leads to a page rendered by this Astro site. */
export function hasInSitePage(product: Pick<Product, 'page'>): boolean {
  return 'slug' in product.page;
}

export function releasesHref(product: Pick<Product, 'repo'>): string {
  return `${product.repo}/releases`;
}

/** The release page of the version the site shows. Tags equal the version strings. */
export function releaseTagHref(product: Pick<Product, 'repo' | 'version'>): string {
  return product.version ? `${product.repo}/releases/tag/${product.version}` : releasesHref(product);
}

export function sortedPlatforms(product: Pick<Product, 'platforms'>): Platform[] {
  return PLATFORM_ORDER.filter((platform) => product.platforms.includes(platform));
}

/** Categories in order of first appearance, so the filter follows the catalog. */
export function categories(list: readonly Product[] = products): Category[] {
  return [...new Set(list.map((product) => product.category))];
}

/** Released products, newest first; ties keep catalog order. */
export function latestReleases(list: readonly Product[] = products): Product[] {
  return list
    .filter((product) => product.version && product.released)
    .map((product, i) => ({ product, i }))
    .sort((a, b) => b.product.released!.localeCompare(a.product.released!) || a.i - b.i)
    .map(({ product }) => product);
}

export function getProduct(id: ProductId): Product {
  const product = products.find((entry) => entry.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}
