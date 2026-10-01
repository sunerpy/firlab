/** Locale-independent build, metadata, search and theme settings. */
import { fileURLToPath } from 'node:url';
import { defineConfig, type HeadConfig } from 'vitepress';
import { validateHome } from '../theme/data/home-schema';

/** Where the site is served inside firlab.app. Pages link without it; VitePress adds it. */
const BASE = '/lockra/';
const HOST = 'https://firlab.app/lockra';

/** `guide/install.md` → `https://firlab.app/lockra/guide/install`; `zh/index.md` → `…/zh/`. */
function pageUrl(relativePath: string): string {
  const path = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
  return `${HOST}/${path}`;
}

/**
 * vitesse-light and vitesse-dark, with every token colour below 4.5:1 on this site's code
 * background (#F3F6FA light, #0C0F13 dark) moved to the nearest colour of the same hue that
 * reaches 4.6:1. The palette and the code backgrounds are the Voltip site's, so its measured
 * table applies unchanged (voltip/src/.vitepress/config/shared.ts).
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

export const shared = defineConfig({
  title: 'Lockra',
  description: 'Two-factor codes that stay on your computer. Windows, macOS and Linux.',
  lang: 'en-US',
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
    // The Chinese placeholders of the English design documents say "read it in English" and
    // nothing else; they are noindex and stay out of the sitemap.
    transformItems: (items) => items.filter((item) => !/^\/?zh\/dev\//.test(item.url)),
  },

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    // The design documents are plain GitHub Markdown; markdown-it-attrs would read a trailing
    // `{…}` as HTML attributes. No page on this site uses `{#id}` or `{.class}`.
    attrs: { disable: true },
    codeTransformers: [
      {
        name: 'lockra:code-contrast',
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
  },

  // VitePress does not prefix `head` with the base: these paths carry it themselves.
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}lockra-logo.svg` }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#F3F6FA' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0C0F13' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Lockra' }],
    ['meta', { property: 'og:image', content: `${HOST}/og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  // The home pages carry their data in frontmatter; a missing or misspelt field would render
  // an empty band, so it fails the build here instead.
  transformPageData(pageData) {
    if (pageData.relativePath === 'index.md' || pageData.relativePath === 'zh/index.md') {
      validateHome(pageData.relativePath, pageData.frontmatter);
    }
  },

  // One canonical URL per page, and hreflang pairs between the two languages. The design
  // documents exist only in English: the English page is canonical and declares no alternate.
  transformHead({ pageData }) {
    if (pageData.isNotFound) return [];
    const rel = pageData.relativePath;
    // The Chinese design-document pointers are noindex: no canonical, no alternates.
    if (rel.startsWith('zh/dev/')) return [];
    const head: HeadConfig[] = [['link', { rel: 'canonical', href: pageUrl(rel) }]];
    const base = rel.startsWith('zh/') ? rel.slice(3) : rel;
    if (base.startsWith('dev/')) return head;
    head.push(
      ['link', { rel: 'alternate', hreflang: 'en', href: pageUrl(base) }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: pageUrl(`zh/${base}`) }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: pageUrl(base) }],
    );
    return head;
  },

  themeConfig: {
    logo: { src: '/lockra-logo.svg', alt: '' },
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: 'https://github.com/sunerpy/lockra' }],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          options: {
            // MiniSearch splits on spaces and punctuation, which leaves a Chinese sentence as
            // one token: "备份" then never finds "自动备份". Words are cut with Intl.Segmenter
            // instead, for the index and for the query alike (VitePress serialises this
            // function to the client). It must stay self-contained.
            tokenize: (text: string) => {
              const words: string[] = [];
              for (const part of new Intl.Segmenter('zh', { granularity: 'word' }).segment(text)) {
                if (part.isWordLike) words.push(part.segment);
              }
              return words;
            },
          },
        },
        locales: {
          zh: {
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
