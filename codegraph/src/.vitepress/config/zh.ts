/** 简体中文（根语言）导航、侧边栏与界面文案。Markdown 内容由 codegraph-rust 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/codegraph-rust';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '开始使用',
    items: [
      { text: 'CodeGraph 是什么', link: '/guide/what-is-codegraph' },
      { text: '安装', link: '/guide/install' },
      { text: '快速开始', link: '/guide/quick-start' },
    ],
  },
  {
    text: '使用',
    items: [
      { text: '接入编码 Agent', link: '/guide/agents' },
      { text: '浏览器查看器', link: '/guide/viewer' },
      { text: '保持索引最新', link: '/guide/keeping-current' },
      { text: '配置', link: '/guide/configuration' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '常见问题', link: '/reference/faq' },
      { text: '交流与反馈', link: '/reference/community' },
      { text: '数据与网络', link: '/privacy' },
      { text: 'CLI 参考（英文）', link: '/reference/cli' },
      { text: 'MCP 参考（英文）', link: '/reference/mcp' },
      { text: '查看器参考（英文）', link: '/reference/ui' },
      { text: '支持的语言（英文）', link: '/reference/languages' },
      { text: 'Godot 静态分析（英文）', link: '/reference/godot' },
      { text: '故障排查（英文）', link: '/reference/troubleshooting' },
    ],
  },
  {
    text: '开发',
    collapsed: true,
    items: [
      { text: '参与开发', link: '/developers' },
      { text: '架构（英文）', link: '/dev/architecture' },
      { text: '数据模型（英文）', link: '/dev/data-model' },
      { text: '等价性校验（英文）', link: '/dev/equivalence' },
      { text: '语法 ABI 清单（英文）', link: '/dev/grammar-manifest' },
      { text: '嵌入式提取（英文）', link: '/dev/embedded-extraction' },
      { text: '基准测试方法（英文）', link: '/dev/benchmark' },
      { text: '基准测试结果（英文）', link: '/dev/benchmark-results' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    'CodeGraph 用 tree-sitter 把代码仓库解析成本机的符号与调用索引，为命令行、编码 Agent（MCP）和浏览器查看器回答结构性问题，不依赖任何模型。',

  themeConfig: {
    nav: [
      {
        text: '指南',
        link: '/guide/what-is-codegraph',
        activeMatch: '^/guide/',
      },
      { text: '参考', link: '/reference/faq', activeMatch: '^/(reference/|privacy)' },
      { text: '开发', link: '/developers', activeMatch: '^/(developers|dev/)' },
      {
        text: '更多',
        items: [
          { text: '下载与发布', link: `${REPO}/releases` },
          { text: '更新日志', link: `${REPO}/blob/main/changelog/CHANGELOG-v0.x.md` },
          { text: '反馈问题', link: `${REPO}/issues` },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: { '/': sidebar },

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
      message: `CodeGraph 基于 MIT License 发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一。内容来自 <a href="${REPO}/commit/${synced.commit}">codegraph-rust@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
