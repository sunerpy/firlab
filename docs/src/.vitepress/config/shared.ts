/**
 * Locale-independent site configuration.
 *
 * Anything true regardless of language: output paths, what counts as a page, code
 * highlighting, search. Translated prose belongs in `en.ts` / `zh.ts`.
 */
import { defineConfig } from 'vitepress';

export const shared = defineConfig({
  title: 'Zuno',
  lang: 'en',

  // Served at a subdomain root, so no `base` prefix.
  srcDir: '.',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  sitemap: { hostname: 'https://zuno.firlab.app' },

  // A documentation site whose own cross-references 404 is worse than one that
  // refuses to publish. Kept strict deliberately — the synced pages arrive from
  // another repository, and this is what catches a link that only resolved there.
  ignoreDeadLinks: false,

  // The zuno repository's own index is replaced by this site's navigation, and its
  // hand-maintained translated README is not a page here.
  srcExclude: ['README.md', 'readme/**', 'upstream/**', 'guides/**'],

  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#b03a09' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Zuno' }],
    ['meta', { property: 'og:image', content: 'https://zuno.firlab.app/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: '/favicon.svg',
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: 'https://github.com/sunerpy/zuno' }],

    search: {
      // Local, not Algolia: zuno is a private repository, so a hosted crawler
      // could not index it, and a build-time index has no runtime dependency.
      provider: 'local',
      options: {
        detailedView: true,
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '返回',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '选择',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上',
                  navigateDownKeyAriaLabel: '下',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },
  },
});
