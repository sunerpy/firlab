/** 简体中文（根语言）导航、侧边栏与界面文案。Markdown 内容由 winer 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/winer';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '开始使用',
    items: [
      { text: 'winer 是什么', link: '/guide/what-is-winer' },
      { text: '安装', link: '/guide/install' },
      { text: '快速开始', link: '/guide/quick-start' },
    ],
  },
  {
    text: '功能',
    items: [
      { text: '对局分析与喊话', link: '/guide/live' },
      { text: '战绩与成就', link: '/guide/history' },
      { text: '自动化', link: '/guide/automation' },
      { text: '客户端增强', link: '/guide/client' },
      { text: '工具与设置', link: '/guide/settings' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '评级说明', link: '/rating' },
      { text: '常见问题', link: '/faq' },
      { text: '数据与隐私', link: '/privacy' },
      { text: '致谢与免责声明', link: '/guide/about' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    'winer 是英雄联盟客户端助手：选人时看清每位队友的近期战绩和档位，翻完任何人的战绩，把接受对局、选用英雄和开局喊话交给它。只做 Windows 版，在国服客户端上实测。',

  themeConfig: {
    nav: [
      {
        text: '指南',
        link: '/guide/what-is-winer',
        activeMatch: '^/guide/(what-is-winer|install|quick-start)',
      },
      {
        text: '功能',
        link: '/guide/live',
        activeMatch: '^/guide/(live|history|automation|client|settings)',
      },
      { text: '评级', link: '/rating', activeMatch: '^/rating' },
      { text: '参考', link: '/faq', activeMatch: '^/(faq|privacy|guide/about)' },
      {
        text: '更多',
        items: [
          { text: '下载与发布', link: `${REPO}/releases` },
          { text: '更新日志', link: `${REPO}/blob/main/CHANGELOG.md` },
          { text: '反馈问题', link: `${REPO}/issues` },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: { '/': sidebar },

    editLink: {
      // VitePress serialises this function into the client bundle with toString(), so it
      // cannot close over REPO: the address is written out in full.
      pattern: ({ filePath }) => `https://github.com/sunerpy/winer/edit/main/docs/site/${filePath}`,
      text: '在 GitHub 上编辑此页',
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '切换语言',
    skipToContentLabel: '跳到正文',

    notFound: {
      title: '页面不存在',
      quote: '地址可能有误，或者页面已经移动。',
      linkLabel: '前往首页',
      linkText: '返回首页',
    },

    footer: {
      message: `winer 基于 MIT License 发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一，与 Riot Games 和腾讯无关。内容来自 <a href="${REPO}/commit/${synced.commit}">winer@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
