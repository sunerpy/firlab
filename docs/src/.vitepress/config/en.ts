/** English navigation, sidebar, and interface labels. */
import { defineConfig, type DefaultTheme } from 'vitepress';

const guide: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    items: [
      { text: 'What is Zuno?', link: '/guide/what-is-zuno' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Your first session', link: '/guide/first-session' },
    ],
  },
  {
    text: 'Core concepts',
    items: [
      { text: 'Sessions and turns', link: '/guide/sessions' },
      { text: 'Agents', link: '/guide/agents' },
      { text: 'Tools', link: '/guide/tools' },
      { text: 'Permissions and sandboxing', link: '/guide/permissions' },
      { text: 'Skills', link: '/guide/skills' },
      { text: 'Goals, plans and todos', link: '/guide/durable-state' },
    ],
  },
  {
    text: 'Working with Zuno',
    items: [
      { text: 'The terminal application', link: '/guide/tui' },
      { text: 'Headless runs', link: '/guide/headless' },
      { text: 'Orchestration and delegation', link: '/orchestration' },
      { text: 'Images and file references', link: '/reference/attachments' },
    ],
  },
  {
    text: 'Integrations',
    items: [
      { text: 'Editors and ACP', link: '/reference/zed-acp' },
      { text: 'MCP servers', link: '/guide/mcp' },
      { text: 'Plugins and extensions', link: '/plugins' },
      { text: 'Writing a process plugin', link: '/process-plugin-development' },
    ],
  },
];

const config: DefaultTheme.SidebarItem[] = [
  {
    text: 'Configuration',
    items: [
      { text: 'Overview', link: '/config/' },
      { text: 'Files and precedence', link: '/config/files' },
      { text: 'Configuration reference', link: '/reference/configuration' },
      { text: 'Variables and substitution', link: '/config/variables' },
      { text: 'Instructions and AGENTS.md', link: '/config/instructions' },
    ],
  },
  {
    text: 'Providers and models',
    items: [
      { text: 'Providers and credentials', link: '/reference/providers' },
      { text: 'Authentication', link: '/config/authentication' },
      { text: 'Model routing', link: '/config/models' },
    ],
  },
  {
    text: 'Customization',
    items: [
      { text: 'Custom agents', link: '/config/custom-agents' },
      { text: 'Workflows and commands', link: '/config/workflows' },
      { text: 'Authoring Skills', link: '/config/authoring-skills' },
      { text: 'Themes and keybindings', link: '/config/theming' },
    ],
  },
];

const operate: DefaultTheme.SidebarItem[] = [
  {
    text: 'Operations',
    items: [
      { text: 'Self-update', link: '/reference/self-update' },
      { text: 'Portable bundles', link: '/reference/portable-bundles' },
      { text: 'Session retention', link: '/session-retention' },
      { text: 'Operational logging', link: '/logging' },
      { text: 'Resource gates', link: '/resource-gates' },
      { text: 'Database lifecycle', link: '/migration' },
    ],
  },
  {
    text: 'Troubleshooting',
    items: [
      { text: 'FAQ', link: '/faq' },
      { text: 'Diagnosing a failure', link: '/operate/diagnostics' },
    ],
  },
  {
    text: 'Architecture',
    collapsed: true,
    items: [
      { text: 'Harness runtime', link: '/harness-runtime' },
      { text: 'Performance methodology', link: '/perf-methodology' },
    ],
  },
];

const cli: DefaultTheme.SidebarItem[] = [
  {
    text: 'CLI reference',
    items: [
      { text: 'Overview', link: '/cli/' },
      { text: 'Global options', link: '/cli/global-options' },
    ],
  },
  {
    text: 'Running Zuno',
    items: [
      { text: 'zuno run', link: '/cli/run' },
      { text: 'zuno tui', link: '/cli/tui' },
      { text: 'zuno serve', link: '/cli/serve' },
      { text: 'zuno acp', link: '/cli/acp' },
    ],
  },
  {
    text: 'Managing state',
    items: [
      { text: 'zuno session', link: '/cli/session' },
      { text: 'zuno agent', link: '/cli/agent' },
      { text: 'zuno db', link: '/cli/db' },
      { text: 'zuno export', link: '/cli/export' },
      { text: 'zuno import', link: '/cli/import' },
    ],
  },
  {
    text: 'Providers and extensions',
    items: [
      { text: 'zuno models', link: '/cli/models' },
      { text: 'zuno providers', link: '/cli/providers' },
      { text: 'zuno mcp', link: '/cli/mcp' },
      { text: 'zuno plugin', link: '/cli/plugin' },
    ],
  },
  {
    text: 'Maintenance',
    items: [
      { text: 'zuno self-update', link: '/cli/self-update' },
      { text: 'zuno debug', link: '/cli/debug' },
      { text: 'zuno completion', link: '/cli/completion' },
      { text: 'Excluded commands', link: '/cli/excluded' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'A local Rust coding agent with durable sessions, explicit permissions, and native orchestration.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/what-is-zuno', activeMatch: '^/guide/' },
      {
        text: 'Configuration',
        link: '/config/',
        activeMatch: '^/(config|reference)/',
      },
      {
        text: 'Operate',
        link: '/faq',
        activeMatch: '^/(operate/|faq|logging|migration|session-retention|resource-gates|harness-runtime|perf-methodology)',
      },
      { text: 'CLI', link: '/cli/', activeMatch: '^/cli/' },
      {
        text: 'More',
        items: [
          { text: 'Releases', link: 'https://github.com/sunerpy/zuno/releases' },
          {
            text: 'Changelog',
            link: 'https://github.com/sunerpy/zuno/blob/main/CHANGELOG.md',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/sunerpy/zuno/blob/main/CONTRIBUTING.md',
          },
          {
            text: 'Security policy',
            link: 'https://github.com/sunerpy/zuno/blob/main/SECURITY.md',
          },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: {
      '/guide/': guide,
      '/orchestration': guide,
      '/plugins': guide,
      '/process-plugin-development': guide,
      '/config/': config,
      '/reference/': config,
      '/cli/': cli,
      '/operate/': operate,
      '/faq': operate,
      '/logging': operate,
      '/migration': operate,
      '/session-retention': operate,
      '/resource-gates': operate,
      '/harness-runtime': operate,
      '/perf-methodology': operate,
      '/design/': operate,
    },

    editLink: {
      pattern: 'https://github.com/sunerpy/zuno/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',
    langMenuLabel: 'Change language',
    lastUpdated: { text: 'Last updated' },

    footer: {
      message:
        'Released under the MIT License. Part of <a href="https://firlab.app">FirLab</a>.',
      copyright: 'Copyright © 2026 Zuno contributors',
    },
  },
});
