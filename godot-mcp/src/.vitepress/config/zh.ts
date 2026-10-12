/** 简体中文导航、侧边栏与界面文案。Markdown 内容由 godot-mcp 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/godot-mcp';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '指南',
    items: [
      { text: '简介', link: '/zh/guide/introduction' },
      { text: '安装', link: '/zh/guide/install' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: 'MCP 客户端', link: '/zh/guide/clients' },
      { text: 'Profile 与答复', link: '/zh/guide/profiles' },
    ],
  },
  {
    text: '使用',
    items: [
      { text: '静态分析', link: '/zh/guide/analysis' },
      { text: '修改项目', link: '/zh/guide/editing' },
      { text: '运行引擎', link: '/zh/guide/engine' },
      { text: '游戏与编辑器', link: '/zh/guide/sessions' },
      { text: '编辑器插件', link: '/zh/guide/editor' },
    ],
  },
  {
    text: '运维',
    items: [
      { text: 'HTTP', link: '/zh/operate/http' },
      { text: '恢复', link: '/zh/operate/recovery' },
      { text: '故障排查', link: '/zh/operate/troubleshooting' },
    ],
  },
  {
    text: '参考',
    collapsed: false,
    items: [
      { text: '工具与资源', link: '/zh/reference/tools' },
      { text: '配置', link: '/zh/reference/configuration' },
      { text: '答复分类', link: '/zh/reference/outcomes' },
      { text: 'Godot 版本', link: '/zh/reference/godot-versions' },
      { text: '托管会话', link: '/zh/reference/managed-sessions' },
      { text: '导出', link: '/zh/reference/exports' },
      { text: '编辑器桥接', link: '/zh/reference/editor-bridge' },
      { text: '产物', link: '/zh/reference/artifacts' },
      { text: '进程边界', link: '/zh/reference/process-boundaries' },
      { text: '恢复详解', link: '/zh/reference/recovery' },
      { text: 'HTTP：trusted_local', link: '/zh/reference/http-trusted-local' },
      { text: 'HTTP：proxied_oidc', link: '/zh/reference/http-proxied-oidc' },
      { text: '威胁模型', link: '/zh/reference/threat-model' },
      { text: '能力实操与验证复现', link: '/zh/reference/usage' },
    ],
  },
  {
    items: [
      { text: '隐私', link: '/zh/privacy' },
      { text: '开发者', link: '/zh/developers' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    '面向 Godot 项目的本地 Model Context Protocol 服务器：不需要引擎的分析、写入日志的改动，以及它自己运行、操控、截取和调试的游戏与编辑器。',

  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/introduction', activeMatch: '^/zh/guide/' },
      { text: '运维', link: '/zh/operate/http', activeMatch: '^/zh/operate/' },
      { text: '参考', link: '/zh/reference/tools', activeMatch: '^/zh/(reference/|privacy)' },
      {
        text: '更多',
        items: [
          { text: '下载与发布', link: `${REPO}/releases` },
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
      message: `godot-mcp 基于 MIT 许可证发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一，与 Godot Engine 项目没有隶属关系。内容来自 <a href="${REPO}/commit/${synced.commit}">godot-mcp@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
