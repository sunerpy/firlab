/** 简体中文（根语言）导航、侧边栏与界面文案。Markdown 内容由 pt-tools 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/pt-tools';
// 文档按 1.0 预览版发布，页面与更新日志取自 v1.0.0-rc 分支；1.0 合回 main 以后改回 main（en.ts 同）。
const DOCS_BRANCH = 'v1.0.0-rc';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '开始使用',
    items: [
      { text: 'pt-tools 是什么', link: '/guide/what-is-pt-tools' },
      { text: '1.0 预览版新功能', link: '/guide/whats-new-1.0' },
      { text: '安装', link: '/guide/install' },
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '配置说明', link: '/configuration' },
      { text: '升级与备份', link: '/guide/upgrade' },
    ],
  },
  {
    text: '站点与认证',
    items: [
      { text: '支持站点', link: '/sites' },
      { text: '获取 Cookie 与 API Key', link: '/guide/get-cookie-apikey' },
      { text: '浏览器扩展', link: '/guide/browser-extension' },
      { text: '登录状态与密钥备份', link: '/guide/site-login-monitoring' },
      { text: 'CookieCloud 导入', link: '/guide/cookiecloud' },
      { text: '请求新增站点', link: '/guide/request-new-site' },
    ],
  },
  {
    text: 'RSS 与下载',
    items: [
      { text: 'RSS 订阅', link: '/guide/rss-subscription' },
      { text: '过滤规则与追剧', link: '/guide/filter-rules-tv-series' },
      { text: '自动删种与磁盘保护', link: '/guide/auto-cleanup' },
      { text: '刷流任务', link: '/guide/brush' },
      { text: '数据统计与每日战报', link: '/guide/user-stats' },
      { text: '下载器助手', link: '/guide/downloader-assistant' },
      { text: '转移做种', link: '/guide/torrent-transfer' },
      { text: 'IYUU 辅种', link: '/guide/reseed' },
    ],
  },
  {
    text: '媒体',
    items: [
      { text: '订阅', link: '/guide/media-subscribe' },
      { text: '整理入库', link: '/guide/media-library' },
      { text: '媒体识别', link: '/guide/media-recognize' },
    ],
  },
  {
    text: 'ChatOps 与通知',
    items: [
      { text: 'ChatOps 快速开始', link: '/guide/chatops-quickstart' },
      { text: 'QQ OneBot（NapCat）', link: '/guide/chatops-qq-napcat' },
      { text: 'Telegram Bot', link: '/guide/chatops-telegram' },
      { text: 'RSS 上新通知', link: '/guide/chatops-rss-notify' },
      { text: '更多通知通道', link: '/guide/notify-channels' },
    ],
  },
  {
    text: 'App 与接口',
    items: [
      { text: '手机 App', link: '/guide/mobile-app' },
      { text: '远程访问', link: '/guide/remote-access' },
      { text: 'AI 助手', link: '/guide/assistant' },
      { text: 'MCP', link: '/guide/mcp' },
      { text: 'API 令牌', link: '/guide/api-tokens' },
      { text: 'App API', link: '/reference/app-api' },
      { text: 'qB 兼容入口', link: '/guide/qbit-compat' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '常见问题', link: '/faq' },
      { text: '命令行', link: '/reference/cli' },
      { text: '数据与安全', link: '/reference/security' },
      { text: '参与开发', link: '/reference/developers' },
    ],
  },
  {
    text: '开发与设计',
    collapsed: true,
    items: [
      { text: '开发指南', link: '/development' },
      { text: 'ChatOps / MCP / Agent 架构', link: '/design/chatops-mcp-agent' },
      { text: 'MCP Server 接口契约', link: '/design/phase4-mcp' },
      { text: 'AI Agent 设计', link: '/design/phase5-agent' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    'pt-tools 是面向 PT 站点的自动化管理工具：RSS 自动下载、刷流与 IYUU 辅种、媒体库整理、多站点统计与搜索、qBittorrent 与 Transmission 管理，手机 App 和 QQ、Telegram 上的 ChatOps。支持 Docker、Linux 和 Windows。',

  themeConfig: {
    nav: [
      {
        text: '指南',
        link: '/guide/what-is-pt-tools',
        activeMatch: '^/(guide/(what-is-pt-tools|whats-new-1.0|install|quick-start|upgrade)|configuration)',
      },
      {
        text: '站点',
        link: '/sites',
        activeMatch: '^/(sites|guide/(get-cookie-apikey|browser-extension|site-login-monitoring|cookiecloud|request-new-site))',
      },
      {
        text: 'RSS 与下载',
        link: '/guide/rss-subscription',
        activeMatch:
          '^/guide/(rss-subscription|filter-rules-tv-series|auto-cleanup|brush|user-stats|downloader-assistant|torrent-transfer|reseed)',
      },
      { text: '媒体', link: '/guide/media-library', activeMatch: '^/guide/media-' },
      { text: 'ChatOps', link: '/guide/chatops-quickstart', activeMatch: '^/guide/(chatops-|notify-channels)' },
      {
        text: 'App 与接口',
        link: '/guide/mobile-app',
        activeMatch: '^/(guide/(mobile-app|remote-access|assistant|mcp|api-tokens|qbit-compat)|reference/app-api)',
      },
      {
        text: '参考',
        link: '/faq',
        activeMatch: '^/(faq|reference/(cli|security|developers)|development|design/)',
      },
      {
        text: '更多',
        items: [
          { text: '下载与发布', link: `${REPO}/releases` },
          { text: '更新日志', link: `${REPO}/blob/${DOCS_BRANCH}/CHANGELOG.md` },
          { text: '反馈问题', link: `${REPO}/issues` },
          { text: '讨论区', link: `${REPO}/discussions` },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: { '/': sidebar },

    editLink: {
      // VitePress serialises this function into the client bundle with toString(), so it
      // cannot close over REPO: the address is written out in full.
      pattern: ({ filePath }) => `https://github.com/sunerpy/pt-tools/edit/v1.0.0-rc/docs/${filePath}`,
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
      message: `pt-tools 基于 MIT License 发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一。内容来自 <a href="${REPO}/commit/${synced.commit}">pt-tools@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2024–2026 sunerpy',
    },
  },
});
