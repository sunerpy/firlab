/** Locale-independent build, metadata, search, and theme settings. */
import { defineConfig } from 'vitepress';

export const shared = defineConfig({
  title: 'Zuno',
  description: 'A local Rust coding agent for durable, bounded work.',
  lang: 'en',

  srcDir: '.',
  outDir: '../dist',
  cacheDir: '../.vitepress-cache',

  sitemap: { hostname: 'https://zuno.firlab.app' },

  ignoreDeadLinks: false,

  srcExclude: ['README.md', 'readme/**', 'upstream/**'],

  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/zuno-logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/zuno-logo.png' }],
    ['meta', { name: 'theme-color', content: '#6d28d9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Zuno' }],
    ['meta', { property: 'og:image', content: 'https://zuno.firlab.app/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: '/zuno-logo.svg',
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: 'https://github.com/sunerpy/zuno' }],

    search: {
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
