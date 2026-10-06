/** 简体中文导航、侧边栏与界面文案。Markdown 内容由 bedrock-gateway-rust 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/bedrock-gateway-rust';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '指南',
    items: [
      { text: '什么是 bedrock-gateway', link: '/zh/guide/what-is-bedrock-gateway' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: '安装', link: '/zh/guide/install' },
      { text: '配置', link: '/zh/guide/configuration' },
      { text: '模型', link: '/zh/guide/models' },
      { text: '缓存与推理', link: '/zh/guide/caching-and-reasoning' },
    ],
  },
  {
    text: '客户端',
    items: [
      { text: '概览', link: '/zh/clients/' },
      { text: 'Codex CLI', link: '/zh/clients/codex' },
      { text: '编辑器与 Agent', link: '/zh/clients/editors-and-agents' },
    ],
  },
  {
    text: '运维',
    items: [
      { text: '部署', link: '/zh/operate/' },
      { text: 'Docker', link: '/zh/operate/docker' },
      { text: 'ECS 与 Fargate', link: '/zh/operate/ecs' },
      { text: 'Lambda', link: '/zh/operate/lambda' },
      { text: '从 aws-samples 迁移', link: '/zh/operate/migration' },
      { text: '可观测性', link: '/zh/operate/observability' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: 'API', link: '/zh/reference/api' },
      { text: '协议兼容性', link: '/zh/reference/protocol' },
      { text: '缓存与推理详解', link: '/zh/reference/caching-and-reasoning' },
      { text: '常见问题', link: '/zh/reference/faq' },
    ],
  },
  {
    // 不设标题：不属于任何一组的两页，排在分隔线之后。
    items: [
      { text: '隐私', link: '/zh/privacy' },
      { text: '开发者', link: '/zh/developers' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    'Amazon Bedrock 的 OpenAI 兼容网关：用你自己的 AWS 账号提供 Chat Completions、Responses、Completions 和 Embeddings 接口。',

  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/what-is-bedrock-gateway', activeMatch: '^/zh/guide/' },
      { text: '客户端', link: '/zh/clients/', activeMatch: '^/zh/clients/' },
      { text: '运维', link: '/zh/operate/', activeMatch: '^/zh/operate/' },
      { text: '参考', link: '/zh/reference/api', activeMatch: '^/zh/(reference/|privacy)' },
      {
        text: '更多',
        items: [
          { text: '下载与发布', link: `${REPO}/releases` },
          { text: 'Docker Hub', link: 'https://hub.docker.com/r/sunerpy/bedrock-gateway-rust' },
          { text: '反馈问题', link: `${REPO}/issues` },
          { text: '开发者', link: '/zh/developers' },
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
      message: `bedrock-gateway 基于 MIT No Attribution License（MIT-0）发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一。内容来自 <a href="${REPO}/commit/${synced.commit}">bedrock-gateway-rust@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
