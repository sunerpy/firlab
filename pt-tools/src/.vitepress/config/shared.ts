/** Locale-independent build, metadata, search and theme settings. */
import { fileURLToPath } from 'node:url';
import { defineConfig, type HeadConfig } from 'vitepress';
import { validateHome } from '../theme/data/home-schema';

/** Where the site is served inside firlab.app. Pages link without it; VitePress adds it. */
const BASE = '/pt-tools/';
const HOST = 'https://firlab.app/pt-tools';

/**
 * Pages written in Chinese only: the development guide and the design documents. The
 * sync script gives each an English placeholder at the same path under /en/, because
 * VitePress's language switch maps the current path onto the other locale unchanged.
 */
const CHINESE_ONLY = /^(design\/|development\.md$)/;

/** `guide/install.md` → `https://firlab.app/pt-tools/guide/install`; `en/index.md` → `…/en/`. */
function pageUrl(relativePath: string): string {
  const path = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
  return `${HOST}/${path}`;
}

/**
 * vitesse-light and vitesse-dark, with every token colour below 4.5:1 on this site's code
 * background (#F3F6FA light, #0C0F13 dark) moved to the nearest colour of the same hue that
 * reaches 4.6:1 — the table the Voltip site measured (firlab DESIGN.md §10); the
 * backgrounds are the same.
 */
const CODE_CONTRAST: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    '#999999': '#6F6F6F',
    '#2E8F82': '#127D70',
    '#B07D48': '#96652F',
    '#B5695977': '#876863',
    '#B56959': '#A55B4B',
    '#A0ADA0': '#667266',
    '#59873A': '#4E7B2E',
    '#99841877': '#787042',
    '#998418': '#816E06',
    '#AB5959': '#A95757',
    '#A65E2B': '#A55D2A',
    '#2F798A': '#2E7889',
  },
  dark: {
    '#666666': '#7C7C7C',
    '#C98A7D77': '#947571',
    '#758575DD': '#718072',
    '#B8A96577': '#827D5E',
  },
};

const ZH_ALERT_TITLES: Record<string, string> = {
  tip: '提示',
  note: '说明',
  info: '信息',
  important: '重要',
  warning: '注意',
  caution: '警告',
  danger: '危险',
};

export const shared = defineConfig({
  title: 'pt-tools',
  description: '面向 PT 站点的自动化管理工具：RSS 自动下载、多站点统计与搜索、下载器管理和 ChatOps。',
  lang: 'zh-CN',
  base: BASE,

  srcDir: '.',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  cleanUrls: true,
  // A link to a page that does not exist fails the build instead of shipping a 404.
  ignoreDeadLinks: false,
  // The page dates would be the sync commit's, not the author's, so none are shown.
  lastUpdated: false,
  srcExclude: ['README.md'],

  vite: {
    resolve: {
      // VitePress's home layout has no main landmark; theme/components/HomeMain.vue is the
      // same component with a <main> root (VitePress's documented way to override one).
      alias: [
        {
          find: /^.*\/VPHome\.vue$/,
          replacement: fileURLToPath(new URL('../theme/components/HomeMain.vue', import.meta.url)),
        },
      ],
    },
  },

  sitemap: {
    // The trailing slash matters: sitemap entries are relative paths resolved against it.
    hostname: `${HOST}/`,
    // The English placeholders of the Chinese-only pages say "read it in Chinese" and
    // nothing else; they are noindex and stay out of the sitemap.
    transformItems: (items) => items.filter((item) => !/^\/?en\/(design\/|development$)/.test(item.url)),
  },

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    // The pages are plain GitHub Markdown, read on GitHub as well as here; markdown-it-attrs
    // would read a trailing `{…}` (a template placeholder in a table, say) as HTML
    // attributes and break the page. No page on this site uses `{#id}` or `{.class}`.
    attrs: { disable: true },
    codeTransformers: [
      {
        name: 'pt-tools:code-contrast',
        postprocess(html) {
          return html.replace(
            /--shiki-(light|dark):(#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?)/g,
            (match, theme: 'light' | 'dark', colour: string) => {
              const fixed = CODE_CONTRAST[theme][colour.toUpperCase()];
              return fixed ? `--shiki-${theme}:${fixed}` : match;
            },
          );
        },
      },
    ],
    // The pages use GitHub's alert syntax (`> [!WARNING]`), which VitePress titles with one
    // site-wide label set. Chinese is the root locale here, so a Chinese page gets Chinese
    // titles and an English page keeps VitePress's; a title written after the marker wins.
    config(md) {
      const render = md.renderer.rules.github_alert_open;
      if (!render) return;
      md.renderer.rules.github_alert_open = (tokens, idx, options, env, self) => {
        const meta = tokens[idx].meta as { title: string; type: string };
        const english = String(env?.relativePath ?? '').startsWith('en/');
        if (!english && meta.title === meta.type.toUpperCase()) {
          meta.title = ZH_ALERT_TITLES[meta.type] ?? meta.title;
        }
        return render(tokens, idx, options, env, self);
      };
    },
  },

  // VitePress does not prefix `head` with the base: these paths carry it themselves.
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}pt-tools-logo.svg` }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#F3F6FA' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0C0F13' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'pt-tools' }],
    ['meta', { property: 'og:image', content: `${HOST}/og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  // The home pages carry their data in frontmatter; a missing or misspelt field
  // would render an empty band, so it fails the build here instead.
  transformPageData(pageData) {
    if (pageData.relativePath === 'index.md' || pageData.relativePath === 'en/index.md') {
      validateHome(pageData.relativePath, pageData.frontmatter);
    }
  },

  // One canonical URL per page, and hreflang pairs between the two languages, with the
  // Chinese page as the default. A Chinese-only page is canonical on its own and its
  // English placeholder declares nothing (it is noindex).
  transformHead({ pageData }) {
    if (pageData.isNotFound) return [];
    const rel = pageData.relativePath;
    const english = rel.startsWith('en/');
    const base = english ? rel.slice('en/'.length) : rel;
    if (english && CHINESE_ONLY.test(base)) return [];
    const head: HeadConfig[] = [['link', { rel: 'canonical', href: pageUrl(rel) }]];
    if (CHINESE_ONLY.test(base)) return head;
    head.push(
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: pageUrl(base) }],
      ['link', { rel: 'alternate', hreflang: 'en', href: pageUrl(`en/${base}`) }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: pageUrl(base) }],
    );
    return head;
  },

  themeConfig: {
    logo: { src: '/pt-tools-logo.svg', alt: '' },
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: 'https://github.com/sunerpy/pt-tools' }],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          options: {
            // MiniSearch splits on spaces and punctuation, which leaves a Chinese
            // sentence as one token: "过滤" then never finds "过滤规则与追剧". Words are cut
            // with Intl.Segmenter instead, for the index and for the query alike (VitePress
            // serialises this function to the client). It must stay self-contained.
            tokenize: (text: string) => {
              const words: string[] = [];
              for (const part of new Intl.Segmenter('zh', { granularity: 'word' }).segment(text)) {
                if (part.isWordLike) words.push(part.segment);
              }
              return words;
            },
          },
        },
        // The root locale is Chinese, so it carries the translated search interface;
        // English keeps VitePress's own strings.
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '返回',
                noResultsText: '没有找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '选择',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上',
                  navigateDownKeyAriaLabel: '下',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
      },
    },
  },
});
