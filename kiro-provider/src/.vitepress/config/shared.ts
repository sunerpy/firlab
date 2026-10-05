/** Locale-independent build, metadata, search and theme settings. */
import { fileURLToPath } from 'node:url';
import { defineConfig, type HeadConfig } from 'vitepress';
import { validateHome } from '../theme/data/home-schema';

/** Where the site is served inside firlab.app. Pages link without it; VitePress adds it. */
const BASE = '/kiro-provider/';
const HOST = 'https://firlab.app/kiro-provider';

/**
 * Pages that exist in English only: kiro-provider's references without a Chinese translation
 * (`docs/<NAME>.md`). The sync script gives each a Chinese placeholder at the same path under
 * /zh/, because VitePress's language switch maps the current path onto the other locale
 * unchanged. Keep this pattern, the sync script's ENGLISH_ONLY list, `editLinkPattern` below
 * and the sidebars in config/{en,zh}.ts in step.
 */
const ENGLISH_ONLY = /^(reference\/(streaming-errors|historical-tools)|dev\/architecture)\.md$/;

/**
 * Heading ids the way GitHub makes them, so a link written and checked in kiro-provider
 * (`CONFIGURATION.md#web-search`, `CONFIGURATION.zh-CN.md#联网搜索`, both checked by its
 * `make docs-links`) lands on the same heading here: lower-case, drop everything but letters,
 * digits, marks, `-`, `_` and spaces, then turn each space into `-` without collapsing.
 * VitePress's own slugify collapses runs of `-` and would miss every heading with a `/`, `&`
 * or `—` in it.
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
 * Where a page's source lives in kiro-provider. VitePress serialises this function into the
 * client bundle with toString(), so it closes over nothing: the address and the mapping are
 * written out in full. A synced reference maps back to `docs/<NAME>.md` (English) or
 * `docs/readme/<NAME>.zh-CN.md` (Chinese); every other page is under `docs/site/`. The
 * generated Chinese placeholders set `editLink: false`.
 */
export function editLinkPattern({ filePath }: { filePath: string }): string {
  const sources: Record<string, string> = {
    'clients/codex': 'CODEX',
    'clients/claude-code': 'CLAUDE_CODE',
    'clients/zuno': 'ZUNO',
    'clients/launchers': 'CLIENT_LAUNCHERS',
    'operate/service': 'SERVICE',
    'operate/troubleshooting': 'TROUBLESHOOTING',
    'reference/configuration': 'CONFIGURATION',
    'reference/protocol': 'PROTOCOL_COMPATIBILITY',
    'reference/usage': 'RESPONSES_USAGE',
    'reference/streaming-errors': 'STREAM_ERROR_CONTRACT',
    'reference/historical-tools': 'HISTORICAL_TOOLS',
    'dev/architecture': 'ARCHITECTURE',
  };
  const repo = 'https://github.com/sunerpy/kiro-provider/edit/main/docs/';
  const chinese = filePath.startsWith('zh/');
  const name = sources[(chinese ? filePath.slice(3) : filePath).replace(/\.md$/, '')];
  if (!name) return `${repo}site/${filePath}`;
  return chinese ? `${repo}readme/${name}.zh-CN.md` : `${repo}${name}.md`;
}

/** `guide/install.md` → `https://firlab.app/kiro-provider/guide/install`; `zh/index.md` → `…/zh/`. */
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
  title: 'kiro-provider',
  description:
    'A local gateway that serves your AWS Kiro accounts through OpenAI Responses and Anthropic Messages, for Codex, Claude Code and other agents.',
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
    // The Chinese placeholders of the English-only references say "read it in English" and
    // nothing else; they are noindex and stay out of the sitemap.
    transformItems: (items) =>
      items.filter(
        (item) => !/^\/?zh\/(reference\/(streaming-errors|historical-tools)|dev\/architecture)$/.test(item.url),
      ),
  },

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    // The pages are plain GitHub Markdown, read on GitHub as well as here; markdown-it-attrs
    // would read a trailing `{…}` (a placeholder in a table, say) as HTML attributes and break
    // the page. No page on this site uses `{#id}` or `{.class}`.
    attrs: { disable: true },
    // GitHub's heading ids, so the anchors the canonical docs use resolve here too.
    anchor: { slugify: githubSlug },
    codeTransformers: [
      {
        name: 'kiro-provider:code-contrast',
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
    // site-wide label set. English is the root locale here, so a Chinese page gets Chinese
    // titles and an English page keeps VitePress's; a title written after the marker wins.
    config(md) {
      const render = md.renderer.rules.github_alert_open;
      if (!render) return;
      md.renderer.rules.github_alert_open = (tokens, idx, options, env, self) => {
        const meta = tokens[idx].meta as { title: string; type: string };
        const chinese = String(env?.relativePath ?? '').startsWith('zh/');
        if (chinese && meta.title === meta.type.toUpperCase()) {
          meta.title = ZH_ALERT_TITLES[meta.type] ?? meta.title;
        }
        return render(tokens, idx, options, env, self);
      };
    },
  },

  // VitePress does not prefix `head` with the base: these paths carry it themselves.
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}kiro-provider-logo.svg` }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#F3F6FA' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0C0F13' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'kiro-provider' }],
    ['meta', { property: 'og:image', content: `${HOST}/og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  // The home pages carry their data in frontmatter; a missing or misspelt field
  // would render an empty band, so it fails the build here instead.
  transformPageData(pageData) {
    if (pageData.relativePath === 'index.md' || pageData.relativePath === 'zh/index.md') {
      validateHome(pageData.relativePath, pageData.frontmatter);
    }
  },

  // One canonical URL per page, and hreflang pairs between the two languages, with the
  // English page as the default. An English-only reference is canonical on its own and its
  // Chinese placeholder declares nothing (it is noindex).
  transformHead({ pageData }) {
    if (pageData.isNotFound) return [];
    const rel = pageData.relativePath;
    const chinese = rel.startsWith('zh/');
    const base = chinese ? rel.slice('zh/'.length) : rel;
    if (chinese && ENGLISH_ONLY.test(base)) return [];
    const head: HeadConfig[] = [['link', { rel: 'canonical', href: pageUrl(rel) }]];
    if (ENGLISH_ONLY.test(base)) return head;
    head.push(
      ['link', { rel: 'alternate', hreflang: 'en', href: pageUrl(base) }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: pageUrl(`zh/${base}`) }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: pageUrl(base) }],
    );
    return head;
  },

  themeConfig: {
    logo: { src: '/kiro-provider-logo.svg', alt: '' },
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: 'https://github.com/sunerpy/kiro-provider' }],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          options: {
            // MiniSearch splits on spaces and punctuation, which leaves a Chinese sentence as
            // one token: "搜索" then never finds "联网搜索". Words are cut with Intl.Segmenter
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
