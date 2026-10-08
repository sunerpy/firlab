/** 简体中文导航、侧边栏与界面文案。Markdown 内容由 lockra 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/lockra';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '开始使用',
    items: [
      { text: 'Lockra 是什么', link: '/zh/guide/what-is-lockra' },
      { text: '安装', link: '/zh/guide/install' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: '更新、卸载与数据', link: '/zh/guide/updates' },
    ],
  },
  {
    text: '账号',
    items: [
      { text: '验证码', link: '/zh/accounts/codes' },
      { text: '添加账号', link: '/zh/accounts/add' },
    ],
  },
  {
    text: '迁移账号',
    items: [
      { text: 'Google 身份验证器', link: '/zh/transfer/google' },
      { text: 'Microsoft Authenticator', link: '/zh/transfer/microsoft' },
      { text: '其他应用、链接与列表', link: '/zh/transfer/other-apps' },
    ],
  },
  {
    text: '备份与安全',
    items: [
      { text: '备份与恢复', link: '/zh/backup/' },
      { text: '多设备同步', link: '/zh/backup/sync' },
      { text: '自建中继', link: '/zh/backup/relay' },
      { text: 'Lockra 如何保护你的账号', link: '/zh/security/' },
      { text: '隐私', link: '/zh/privacy' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '键盘快捷键', link: '/zh/reference/shortcuts' },
      { text: '平台说明', link: '/zh/reference/platforms' },
      { text: '常见问题与故障排除', link: '/zh/reference/faq' },
      { text: '路线图', link: '/zh/roadmap' },
      { text: '开发者', link: '/zh/developers' },
    ],
  },
  {
    text: '设计文档（英文）',
    collapsed: true,
    items: [
      { text: '架构', link: '/zh/dev/architecture' },
      { text: '文件格式', link: '/zh/dev/formats' },
      { text: '安全模型', link: '/zh/dev/security' },
      { text: '发布流程', link: '/zh/dev/release' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    'Lockra 把两步验证码保存在本机的一个加密文件中，适用于 Windows、macOS 和 Linux。可以在 Lockra 与 Google 身份验证器、Microsoft Authenticator 之间迁移账号，把加密备份写入你选择的文件夹，并经 Lockra 中继或你自己的存储，在多台设备之间端到端加密地同步。',

  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/what-is-lockra', activeMatch: '^/zh/guide/' },
      { text: '账号', link: '/zh/accounts/codes', activeMatch: '^/zh/accounts/' },
      { text: '迁移账号', link: '/zh/transfer/google', activeMatch: '^/zh/transfer/' },
      { text: '备份与安全', link: '/zh/backup/', activeMatch: '^/zh/(backup|security)/|^/zh/privacy' },
      {
        text: '参考',
        link: '/zh/reference/faq',
        activeMatch: '^/zh/(reference/|roadmap|developers|dev/)',
      },
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

    sidebar: { '/zh/': sidebar },

    editLink: {
      // 这个函数会被序列化到客户端，不能引用 REPO。
      pattern: ({ filePath }) =>
        filePath.startsWith('dev/')
          ? `https://github.com/sunerpy/lockra/edit/main/docs/${filePath.slice('dev/'.length)}`
          : `https://github.com/sunerpy/lockra/edit/main/docs/site/${filePath}`,
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
      message: `Lockra 基于 Apache License 2.0 发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一。内容来自 <a href="${REPO}/commit/${synced.commit}">lockra@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 Lockra contributors',
    },
  },
});
