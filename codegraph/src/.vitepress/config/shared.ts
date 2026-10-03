/** Locale-independent build, metadata, search and theme settings. */
import { fileURLToPath } from 'node:url';
import { defineConfig, type HeadConfig } from 'vitepress';
import { validateHome } from '../theme/data/home-schema';

/** Where the site is served inside firlab.app. Pages link without it; VitePress adds it. */
const BASE = '/codegraph/';
const HOST = 'https://firlab.app/codegraph';

/**
 * Pages written in English only: CodeGraph's canonical references (`docs/<name>.md` in
 * codegraph-rust), published under /en/reference/ and /en/dev/. The sync script gives each a
 * Chinese placeholder at the same path without /en/, because VitePress's language switch maps
 * the current path onto the other locale unchanged. Keep this list, the sync script's
 * REFERENCE_DOCS / DEV_DOCS and `editLinkPattern` below in step.
 */
const ENGLISH_ONLY =
  /^(reference\/(cli|mcp|ui|languages|godot|troubleshooting)|dev\/(architecture|data-model|equivalence|grammar-manifest|embedded-extraction|benchmark|benchmark-results))\.md$/;

/**
 * Heading ids the way GitHub makes them, so a link written and checked in codegraph-rust
 * (`cli.md#environment-variable-reference`, checked by its scripts/docs-check.py) lands on the
 * same heading here: lower-case, drop everything but letters, digits, marks, `-`, `_` and
 * spaces, then turn each space into `-` without collapsing. VitePress's own slugify collapses
 * runs of `-` and would miss every heading with a `/`, `&` or `—` in it.
 */
export function githubSlug(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

/**
 * Where a page's source lives in codegraph-rust. VitePress serialises this function into the
 * client bundle with toString(), so it closes over nothing: the address and the canonical names
 * are written out in full. A synced reference maps back to `docs/<name>.md`; every other page is
 * under `docs/site/`. The generated Chinese placeholders set `editLink: false`.
 */
export function editLinkPattern({ filePath }: { filePath: string }): string {
  const canonical =
    /^en\/(?:reference\/(cli|mcp|ui|languages|godot|troubleshooting)|dev\/(architecture|data-model|equivalence|grammar-manifest|embedded-extraction|benchmark|benchmark-results))\.md$/.exec(
      filePath,
    );
  const name = canonical ? (canonical[1] ?? canonical[2]) : undefined;
  return name
    ? `https://github.com/sunerpy/codegraph-rust/edit/main/docs/${name}.md`
    : `https://github.com/sunerpy/codegraph-rust/edit/main/docs/site/${filePath}`;
}

/** `guide/install.md` → `https://firlab.app/codegraph/guide/install`; `en/index.md` → `…/en/`. */
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
  title: 'CodeGraph',
  description: '本机的代码知识图谱：用 tree-sitter 解析仓库，回答谁调用了它、改动会影响哪里，可在命令行、MCP 和浏览器查看器中使用。',
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
    // The Chinese placeholders of the English-only references say "read it in English" and
    // nothing else; they are noindex and stay out of the sitemap.
    transformItems: (items) =>
      items.filter(
        (item) =>
          !/^\/?(reference\/(cli|mcp|ui|languages|godot|troubleshooting)|dev\/(architecture|data-model|equivalence|grammar-manifest|embedded-extraction|benchmark|benchmark-results))$/.test(
            item.url,
          ),
      ),
  },

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    // The pages are plain GitHub Markdown, read on GitHub as well as here; markdown-it-attrs
    // would read a trailing `{…}` (a template placeholder in a table, say) as HTML
    // attributes and break the page. No page on this site uses `{#id}` or `{.class}`.
    attrs: { disable: true },
    // GitHub's heading ids, so the anchors the canonical docs use resolve here too.
    anchor: { slugify: githubSlug },
    codeTransformers: [
      {
        name: 'codegraph:code-contrast',
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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}codegraph-logo.svg` }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#F3F6FA' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0C0F13' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'CodeGraph' }],
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
  // Chinese page as the default. An English-only reference is canonical on its own and its
  // Chinese placeholder declares nothing (it is noindex).
  transformHead({ pageData }) {
    if (pageData.isNotFound) return [];
    const rel = pageData.relativePath;
    const english = rel.startsWith('en/');
    const base = english ? rel.slice('en/'.length) : rel;
    if (!english && ENGLISH_ONLY.test(base)) return [];
    const head: HeadConfig[] = [['link', { rel: 'canonical', href: pageUrl(rel) }]];
    if (ENGLISH_ONLY.test(base)) return head;
    head.push(
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: pageUrl(base) }],
      ['link', { rel: 'alternate', hreflang: 'en', href: pageUrl(`en/${base}`) }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: pageUrl(base) }],
    );
    return head;
  },

  themeConfig: {
    logo: { src: '/codegraph-logo.svg', alt: '' },
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: 'https://github.com/sunerpy/codegraph-rust' }],

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
