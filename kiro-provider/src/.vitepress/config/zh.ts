/** 简体中文导航、侧边栏与界面文案。Markdown 内容由 kiro-provider 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/kiro-provider';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '开始使用',
    items: [
      { text: 'kiro-provider 是什么', link: '/zh/guide/what-is-kiro-provider' },
      { text: '安装', link: '/zh/guide/install' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
    ],
  },
  {
    text: '使用',
    items: [
      { text: '账号', link: '/zh/guide/accounts' },
      { text: '联网搜索', link: '/zh/guide/web-search' },
      { text: '更新', link: '/zh/guide/updates' },
    ],
  },
  {
    text: '客户端',
    items: [
      { text: '选择客户端', link: '/zh/clients/' },
      { text: 'Codex CLI', link: '/zh/clients/codex' },
      { text: 'Claude Code', link: '/zh/clients/claude-code' },
      { text: 'Zuno', link: '/zh/clients/zuno' },
      { text: '客户端启动器', link: '/zh/clients/launchers' },
    ],
  },
  {
    text: '运维',
    items: [
      { text: '概览', link: '/zh/operate/' },
      { text: '后台服务', link: '/zh/operate/service' },
      { text: '排障手册', link: '/zh/operate/troubleshooting' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '概览', link: '/zh/reference/' },
      { text: '命令行', link: '/zh/reference/cli' },
      { text: '配置参考', link: '/zh/reference/configuration' },
      { text: '协议兼容性', link: '/zh/reference/protocol' },
      { text: '用量与上下文', link: '/zh/reference/usage' },
      { text: '流式错误契约（英文）', link: '/zh/reference/streaming-errors' },
      { text: '历史工具调用（英文）', link: '/zh/reference/historical-tools' },
      { text: '已知限制', link: '/zh/limits' },
      { text: '常见问题', link: '/zh/reference/faq' },
      { text: '数据与网络', link: '/zh/privacy' },
    ],
  },
  {
    text: '开发',
    collapsed: true,
    items: [
      { text: '参与开发', link: '/zh/developers' },
      { text: '架构（英文）', link: '/zh/dev/architecture' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    '在本机运行的网关，把 AWS Kiro 账号以 OpenAI Responses 和 Anthropic Messages 接口提供给 Codex、Claude Code 等 Agent。',

  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/what-is-kiro-provider', activeMatch: '^/zh/guide/' },
      { text: '客户端', link: '/zh/clients/', activeMatch: '^/zh/clients/' },
      { text: '参考', link: '/zh/reference/', activeMatch: '^/zh/(reference/|operate/|privacy|limits)' },
      {
        text: '更多',
        items: [
          { text: '下载与发布', link: `${REPO}/releases` },
          { text: '更新日志', link: `${REPO}/blob/main/changelog/CHANGELOG-v3.x.md` },
          { text: '反馈问题', link: `${REPO}/issues` },
          { text: '参与开发', link: '/zh/developers' },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: { '/zh/': sidebar },

    editLink: {
      pattern: editLinkPattern,
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
      message: `kiro-provider 基于 MIT License 发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一。内容来自 <a href="${REPO}/commit/${synced.commit}">kiro-provider@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
