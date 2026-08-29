/**
 * 简体中文 locale。
 *
 * 分组与 `en.ts` 严格对应，所有 `link` 带 `/zh/` 前缀。中文页面是独立文档而非
 * 构建期转换产物：翻译需要评审，派生产物不需要。
 *
 * 注意中文侧没有 synced 页面 —— zuno 仓库的文档是英文的，中文全部在本仓库编写。
 */
import { defineConfig, type DefaultTheme } from 'vitepress';

const guide: DefaultTheme.SidebarItem[] = [
  {
    text: '入门',
    items: [
      { text: 'Zuno 是什么', link: '/zh/guide/what-is-zuno' },
      { text: '安装', link: '/zh/guide/installation' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: '第一个会话', link: '/zh/guide/first-session' },
    ],
  },
  {
    text: '核心概念',
    items: [
      { text: '会话与回合', link: '/zh/guide/sessions' },
      { text: 'Agent', link: '/zh/guide/agents' },
      { text: '工具', link: '/zh/guide/tools' },
      { text: '权限与沙箱', link: '/zh/guide/permissions' },
      { text: 'Skill', link: '/zh/guide/skills' },
      { text: 'Goal、Plan 与 Todo', link: '/zh/guide/durable-state' },
    ],
  },
  {
    text: '使用 Zuno',
    items: [
      { text: '终端应用', link: '/zh/guide/tui' },
      { text: '无界面运行', link: '/zh/guide/headless' },
      { text: '编排与委派', link: '/zh/guide/orchestration' },
      { text: '图片与文件引用', link: '/zh/guide/attachments' },
    ],
  },
  {
    text: '集成',
    items: [
      { text: '编辑器与 ACP', link: '/zh/guide/editors' },
      { text: 'MCP 服务器', link: '/zh/guide/mcp' },
      { text: '插件与扩展', link: '/zh/guide/plugins' },
    ],
  },
];

const config: DefaultTheme.SidebarItem[] = [
  {
    text: '配置',
    items: [
      { text: '概览', link: '/zh/config/' },
      { text: '配置文件与优先级', link: '/zh/config/files' },
      { text: '配置项参考', link: '/zh/config/reference' },
      { text: '变量与替换', link: '/zh/config/variables' },
      { text: '指令与 AGENTS.md', link: '/zh/config/instructions' },
    ],
  },
  {
    text: 'Provider 与模型',
    items: [
      { text: 'Provider 与凭据', link: '/zh/config/providers' },
      { text: '认证', link: '/zh/config/authentication' },
      { text: '模型路由', link: '/zh/config/models' },
    ],
  },
  {
    text: '定制',
    items: [
      { text: '自定义 Agent', link: '/zh/config/custom-agents' },
      { text: '工作流与命令', link: '/zh/config/workflows' },
      { text: '编写 Skill', link: '/zh/config/authoring-skills' },
      { text: '主题与快捷键', link: '/zh/config/theming' },
    ],
  },
];

const operate: DefaultTheme.SidebarItem[] = [
  {
    text: '运维',
    items: [
      { text: '自更新', link: '/zh/operate/self-update' },
      { text: '可移植环境包', link: '/zh/operate/portable-bundles' },
      { text: '会话保留', link: '/zh/operate/session-retention' },
      { text: '运行日志', link: '/zh/operate/logging' },
      { text: '资源门禁', link: '/zh/operate/resource-gates' },
      { text: '数据库生命周期', link: '/zh/operate/migration' },
    ],
  },
  {
    text: '排障',
    items: [
      { text: '常见问题', link: '/zh/operate/faq' },
      { text: '故障诊断', link: '/zh/operate/diagnostics' },
    ],
  },
  {
    text: '架构',
    collapsed: true,
    items: [{ text: 'Harness 运行时', link: '/zh/operate/harness-runtime' }],
  },
];

const cli: DefaultTheme.SidebarItem[] = [
  {
    text: 'CLI 参考',
    items: [
      { text: '概览', link: '/zh/cli/' },
      { text: '全局选项', link: '/zh/cli/global-options' },
    ],
  },
  {
    text: '运行',
    items: [
      { text: 'zuno run', link: '/zh/cli/run' },
      { text: 'zuno tui', link: '/zh/cli/tui' },
      { text: 'zuno serve', link: '/zh/cli/serve' },
      { text: 'zuno acp', link: '/zh/cli/acp' },
    ],
  },
  {
    text: '状态管理',
    items: [
      { text: 'zuno session', link: '/zh/cli/session' },
      { text: 'zuno agent', link: '/zh/cli/agent' },
      { text: 'zuno db', link: '/zh/cli/db' },
      { text: 'zuno export', link: '/zh/cli/export' },
      { text: 'zuno import', link: '/zh/cli/import' },
    ],
  },
  {
    text: 'Provider 与扩展',
    items: [
      { text: 'zuno models', link: '/zh/cli/models' },
      { text: 'zuno providers', link: '/zh/cli/providers' },
      { text: 'zuno mcp', link: '/zh/cli/mcp' },
      { text: 'zuno plugin', link: '/zh/cli/plugin' },
    ],
  },
  {
    text: '维护',
    items: [
      { text: 'zuno self-update', link: '/zh/cli/self-update' },
      { text: 'zuno debug', link: '/zh/cli/debug' },
      { text: 'zuno completion', link: '/zh/cli/completion' },
      { text: '被排除的命令', link: '/zh/cli/excluded' },
    ],
  },
];

export const zh = defineConfig({
  lang: 'zh-CN',
  description: '用 Rust 编写的单二进制编码 Agent CLI，无运行时依赖。',

  themeConfig: {
    nav: [
      { text: '指南', link: '/zh/guide/what-is-zuno', activeMatch: '^/zh/guide/' },
      { text: '配置', link: '/zh/config/', activeMatch: '^/zh/config/' },
      { text: '运维', link: '/zh/operate/faq', activeMatch: '^/zh/operate/' },
      { text: 'CLI', link: '/zh/cli/', activeMatch: '^/zh/cli/' },
      {
        text: '更多',
        items: [
          { text: '发布版本', link: 'https://github.com/sunerpy/zuno/releases' },
          {
            text: '变更日志',
            link: 'https://github.com/sunerpy/zuno/blob/main/CHANGELOG.md',
          },
          {
            text: '贡献指南',
            link: 'https://github.com/sunerpy/zuno/blob/main/CONTRIBUTING.md',
          },
          {
            text: '安全策略',
            link: 'https://github.com/sunerpy/zuno/blob/main/SECURITY.md',
          },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: {
      '/zh/guide/': guide,
      '/zh/config/': config,
      '/zh/operate/': operate,
      '/zh/cli/': cli,
    },

    editLink: {
      pattern: 'https://github.com/sunerpy/firlab/edit/main/docs/src/:path',
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
    lastUpdated: { text: '最后更新' },

    footer: {
      message:
        '基于 MIT 许可证发布。<a href="https://firlab.app">FirLab</a> 项目之一。',
      copyright: 'Copyright © 2026 Zuno contributors',
    },
  },
});
