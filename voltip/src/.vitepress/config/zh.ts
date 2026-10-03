/** 简体中文导航、侧边栏与界面文案。Markdown 内容由 voltip 仓库同步。 */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/voltip';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '开始使用',
    items: [
      { text: 'Voltip 是什么', link: '/zh/guide/what-is-voltip' },
      { text: '安装', link: '/zh/guide/install' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: '更新、卸载与数据位置', link: '/zh/guide/updates' },
    ],
  },
  {
    text: '听写',
    items: [
      { text: '快捷键与录音方式', link: '/zh/dictation/shortcuts' },
      { text: '文字的插入方式', link: '/zh/dictation/output' },
      { text: '语音编辑', link: '/zh/dictation/voice-edit' },
      { text: '历史记录', link: '/zh/dictation/history' },
    ],
  },
  {
    text: '识别与 AI',
    items: [
      { text: '本地识别', link: '/zh/recognition/local' },
      { text: '云端服务', link: '/zh/recognition/cloud' },
      { text: 'AI 润色与预设', link: '/zh/recognition/polish' },
      { text: '场景', link: '/zh/recognition/scenes' },
      { text: '词典与替换规则', link: '/zh/recognition/dictionary' },
    ],
  },
  {
    text: '手机',
    items: [{ text: '手机当麦克风和键盘', link: '/zh/phone/' }],
  },
  {
    text: '参考',
    items: [
      { text: '隐私', link: '/zh/privacy' },
      { text: '命令行', link: '/zh/reference/cli' },
      { text: '各平台说明', link: '/zh/reference/platforms' },
      { text: '常见问题', link: '/zh/reference/faq' },
      { text: '交流与反馈', link: '/zh/reference/community' },
      { text: '路线图', link: '/zh/roadmap' },
      { text: '开发者', link: '/zh/developers' },
    ],
  },
  {
    text: '设计文档',
    collapsed: true,
    items: [
      { text: '架构', link: '/zh/dev/architecture' },
      { text: '听写流水线', link: '/zh/dev/dictation' },
      { text: '界面与 IPC 契约', link: '/zh/dev/frontend' },
      { text: '配对', link: '/zh/dev/pairing' },
      { text: '线协议', link: '/zh/dev/protocol' },
      { text: '威胁模型', link: '/zh/dev/threat-model' },
      { text: '状态机', link: '/zh/dev/state-machines' },
      { text: '应用内反馈', link: '/zh/dev/feedback' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description:
    'Voltip 是 Windows、macOS 和 Linux 上的语音输入工具：按住快捷键说话，松开后文字出现在光标处。可以在本机识别，也可以使用你选择的云端服务。',

  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/what-is-voltip', activeMatch: '^/zh/guide/' },
      { text: '听写', link: '/zh/dictation/shortcuts', activeMatch: '^/zh/dictation/' },
      { text: '识别与 AI', link: '/zh/recognition/local', activeMatch: '^/zh/recognition/' },
      { text: '手机', link: '/zh/phone/', activeMatch: '^/zh/phone/' },
      {
        text: '参考',
        link: '/zh/reference/faq',
        activeMatch: '^/zh/(reference/|privacy|roadmap|developers|dev/)',
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
      pattern: ({ filePath }) =>
        filePath.startsWith('zh/dev/')
          ? `https://github.com/sunerpy/voltip/edit/main/docs/${filePath.slice('zh/dev/'.length)}`
          : `https://github.com/sunerpy/voltip/edit/main/docs/site/${filePath}`,
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
      message: `Voltip 基于 GNU AGPL v3.0 或更高版本发布，是 <a href="https://firlab.app">FirLab</a> 的项目之一。内容来自 <a href="${REPO}/commit/${synced.commit}">voltip@${synced.shortCommit}</a>。`,
      copyright: 'Copyright © 2026 Voltip contributors',
    },
  },
});
