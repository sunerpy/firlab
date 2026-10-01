/** English navigation, sidebar and interface labels. The Markdown is synced from lockra. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/lockra';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is Lockra', link: '/guide/what-is-lockra' },
      { text: 'Install', link: '/guide/install' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Updates, uninstalling and your data', link: '/guide/updates' },
    ],
  },
  {
    text: 'Accounts',
    items: [
      { text: 'Codes', link: '/accounts/codes' },
      { text: 'Adding an account', link: '/accounts/add' },
    ],
  },
  {
    text: 'Moving accounts',
    items: [
      { text: 'Google Authenticator', link: '/transfer/google' },
      { text: 'Microsoft Authenticator', link: '/transfer/microsoft' },
      { text: 'Other apps, links and lists', link: '/transfer/other-apps' },
    ],
  },
  {
    text: 'Backups and security',
    items: [
      { text: 'Backups and restore', link: '/backup/' },
      { text: 'How Lockra protects your accounts', link: '/security/' },
      { text: 'Privacy', link: '/privacy' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Keyboard shortcuts', link: '/reference/shortcuts' },
      { text: 'Platform notes', link: '/reference/platforms' },
      { text: 'Questions and troubleshooting', link: '/reference/faq' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Developers', link: '/developers' },
    ],
  },
  {
    text: 'Design documents',
    collapsed: true,
    items: [
      { text: 'Architecture', link: '/dev/architecture' },
      { text: 'File formats', link: '/dev/formats' },
      { text: 'Security model', link: '/dev/security' },
      { text: 'Releasing', link: '/dev/release' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'Lockra keeps your two-factor codes in one encrypted file on your computer, for Windows, macOS and Linux. Move accounts from and to Google Authenticator and Microsoft Authenticator, and keep encrypted backups in a folder you choose.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/what-is-lockra', activeMatch: '^/guide/' },
      { text: 'Accounts', link: '/accounts/codes', activeMatch: '^/accounts/' },
      { text: 'Moving accounts', link: '/transfer/google', activeMatch: '^/transfer/' },
      { text: 'Backups & security', link: '/backup/', activeMatch: '^/(backup|security)/|^/privacy' },
      {
        text: 'Reference',
        link: '/reference/faq',
        activeMatch: '^/(reference/|roadmap|developers|dev/)',
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
      // VitePress serialises this function to the client: it cannot use REPO.
      pattern: ({ filePath }) =>
        filePath.startsWith('dev/')
          ? `https://github.com/sunerpy/lockra/edit/main/docs/${filePath.slice('dev/'.length)}`
          : `https://github.com/sunerpy/lockra/edit/main/docs/site/${filePath}`,
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
      message: `Lockra is released under the Apache License 2.0. Part of <a href="https://firlab.app">FirLab</a>. Content from <a href="${REPO}/commit/${synced.commit}">lockra@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 Lockra contributors',
    },
  },
});
