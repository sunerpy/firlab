/** English navigation, sidebar and interface labels. The Markdown is synced from voltip. */
import { defineConfigWithTheme, type DefaultTheme } from 'vitepress';
import type { VoltipThemeConfig } from '../theme/data/site-config';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/voltip';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is Voltip', link: '/guide/what-is-voltip' },
      { text: 'Try it online', link: '/guide/try' },
      { text: 'Install', link: '/guide/install' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Updates, uninstall and your data', link: '/guide/updates' },
    ],
  },
  {
    text: 'Dictation',
    items: [
      { text: 'Shortcuts and recording modes', link: '/dictation/shortcuts' },
      { text: 'Where the text goes', link: '/dictation/output' },
      { text: 'Voice edit', link: '/dictation/voice-edit' },
      { text: 'History', link: '/dictation/history' },
    ],
  },
  {
    text: 'Recognition and AI',
    items: [
      { text: 'Local recognition', link: '/recognition/local' },
      { text: 'Cloud services', link: '/recognition/cloud' },
      { text: 'AI polish and presets', link: '/recognition/polish' },
      { text: 'Scenes', link: '/recognition/scenes' },
      { text: 'Dictionary and rules', link: '/recognition/dictionary' },
      { text: 'Local service', link: '/recognition/service' },
      { text: 'AI tools', link: '/recognition/mcp' },
    ],
  },
  {
    text: 'Phone',
    items: [{ text: 'Your phone as a microphone and keyboard', link: '/phone/' }],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Privacy', link: '/privacy' },
      { text: 'Command line', link: '/reference/cli' },
      { text: 'Platform notes', link: '/reference/platforms' },
      { text: 'Questions and troubleshooting', link: '/reference/faq' },
      { text: 'Community', link: '/reference/community' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Developers', link: '/developers' },
    ],
  },
  {
    text: 'Design documents (Chinese)',
    collapsed: true,
    items: [
      { text: 'Architecture', link: '/dev/architecture' },
      { text: 'The dictation pipeline', link: '/dev/dictation' },
      { text: 'Interface and IPC contract', link: '/dev/frontend' },
      { text: 'Pairing', link: '/dev/pairing' },
      { text: 'Wire protocol', link: '/dev/protocol' },
      { text: 'Threat model', link: '/dev/threat-model' },
      { text: 'State machines', link: '/dev/state-machines' },
      { text: 'In-app feedback', link: '/dev/feedback' },
    ],
  },
];

export const en = defineConfigWithTheme<VoltipThemeConfig>({
  lang: 'en-US',
  description:
    'Voltip is a dictation app for Windows, macOS and Linux: hold a shortcut, speak, and the text appears at your cursor. Recognition on your computer or with a cloud service you choose.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/what-is-voltip', activeMatch: '^/guide/(?!try)' },
      { text: 'Try it', link: '/guide/try', activeMatch: '^/guide/try' },
      { text: 'Dictation', link: '/dictation/shortcuts', activeMatch: '^/dictation/' },
      { text: 'Recognition & AI', link: '/recognition/local', activeMatch: '^/recognition/' },
      { text: 'Phone', link: '/phone/', activeMatch: '^/phone/' },
      {
        text: 'Reference',
        link: '/reference/faq',
        activeMatch: '^/(reference/|privacy|roadmap|developers|dev/)',
      },
      {
        text: 'More',
        items: [
          { text: 'Releases', link: `${REPO}/releases` },
          { text: 'Changelog', link: `${REPO}/blob/main/CHANGELOG.md` },
          { text: 'Report a problem', link: `${REPO}/issues` },
          { text: 'FirLab', link: 'https://firlab.app' },
        ],
      },
    ],

    sidebar: { '/': sidebar },

    editLink: {
      // Design documents are copied from docs/<name>.md, everything else from docs/site/.
      pattern: ({ filePath }) =>
        filePath.startsWith('zh/dev/')
          ? `https://github.com/sunerpy/voltip/edit/main/docs/${filePath.slice('zh/dev/'.length)}`
          : `https://github.com/sunerpy/voltip/edit/main/docs/site/${filePath}`,
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
    skipToContentLabel: 'Skip to content',

    notFound: {
      title: 'This page does not exist',
      quote: 'The address may be mistyped, or the page may have moved.',
      linkLabel: 'Go to the home page',
      linkText: 'Back to the home page',
    },

    footer: {
      message: `Voltip is released under the GNU AGPL v3.0 or later. Part of <a href="https://firlab.app">FirLab</a>. Content from <a href="${REPO}/commit/${synced.commit}">voltip@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 Voltip contributors',
    },

    vtActions: [
      { text: 'Try it online', link: '/guide/try', icon: 'mic', theme: 'alt' },
      { text: 'Download', link: '/guide/install', icon: 'download', theme: 'brand' },
    ],

    vtFooter: {
      tagline: 'Dictation for Windows, macOS, Linux and Android.',
      qr: {
        src: '/community/wechat-official-account.jpg',
        alt: 'QR code of the WeChat Official Account 六月水蓝',
        caption: 'WeChat Official Account 六月水蓝',
        link: { text: 'Community', link: '/reference/community' },
      },
      columns: [
        {
          title: 'Getting started',
          items: [
            { text: 'What is Voltip', link: '/guide/what-is-voltip' },
            { text: 'Install', link: '/guide/install' },
            { text: 'Try it online', link: '/guide/try' },
            { text: 'Quick start', link: '/guide/quick-start' },
            { text: 'Updates', link: '/guide/updates' },
          ],
        },
        {
          title: 'Dictation',
          items: [
            { text: 'Shortcuts', link: '/dictation/shortcuts' },
            { text: 'Where the text goes', link: '/dictation/output' },
            { text: 'Voice edit', link: '/dictation/voice-edit' },
            { text: 'History', link: '/dictation/history' },
            { text: 'Phone', link: '/phone/' },
          ],
        },
        {
          title: 'Recognition and AI',
          items: [
            { text: 'Local recognition', link: '/recognition/local' },
            { text: 'Cloud services', link: '/recognition/cloud' },
            { text: 'AI polish', link: '/recognition/polish' },
            { text: 'Scenes', link: '/recognition/scenes' },
            { text: 'Dictionary and rules', link: '/recognition/dictionary' },
            { text: 'Local service', link: '/recognition/service' },
            { text: 'AI tools', link: '/recognition/mcp' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { text: 'Questions', link: '/reference/faq' },
            { text: 'Privacy', link: '/privacy' },
            { text: 'Platform notes', link: '/reference/platforms' },
            { text: 'Command line', link: '/reference/cli' },
            { text: 'Roadmap', link: '/roadmap' },
            { text: 'Developers', link: '/developers' },
          ],
        },
        {
          title: 'Project',
          items: [
            { text: 'GitHub', link: REPO },
            { text: 'Releases', link: `${REPO}/releases` },
            { text: 'Changelog', link: `${REPO}/blob/main/CHANGELOG.md` },
            { text: 'Report a problem', link: `${REPO}/issues` },
            { text: 'FirLab', link: 'https://firlab.app' },
          ],
        },
      ],
    },
  },
});
