/** English navigation, sidebar and interface labels. The Markdown is synced from pt-tools. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/pt-tools';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is pt-tools', link: '/en/guide/what-is-pt-tools' },
      { text: 'Install', link: '/en/guide/install' },
      { text: 'Quick start', link: '/en/guide/quick-start' },
      { text: 'Configuration', link: '/en/configuration' },
      { text: 'Upgrades and backups', link: '/en/guide/upgrade' },
    ],
  },
  {
    text: 'Sites and sign-in',
    items: [
      { text: 'Supported sites', link: '/en/sites' },
      { text: 'Cookies and API keys', link: '/en/guide/get-cookie-apikey' },
      { text: 'Browser extension', link: '/en/guide/browser-extension' },
      { text: 'Login status and key backup', link: '/en/guide/site-login-monitoring' },
      { text: 'Request a new site', link: '/en/guide/request-new-site' },
    ],
  },
  {
    text: 'RSS and downloads',
    items: [
      { text: 'RSS subscriptions', link: '/en/guide/rss-subscription' },
      { text: 'Filter rules and TV series', link: '/en/guide/filter-rules-tv-series' },
      { text: 'Auto-delete and disk protection', link: '/en/guide/auto-cleanup' },
    ],
  },
  {
    text: 'ChatOps and notifications',
    items: [
      { text: 'ChatOps quick start', link: '/en/guide/chatops-quickstart' },
      { text: 'QQ through OneBot (NapCat)', link: '/en/guide/chatops-qq-napcat' },
      { text: 'Telegram bot', link: '/en/guide/chatops-telegram' },
      { text: 'New-torrent notifications', link: '/en/guide/chatops-rss-notify' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Questions and troubleshooting', link: '/en/faq' },
      { text: 'Command line', link: '/en/reference/cli' },
      { text: 'Data and security', link: '/en/reference/security' },
      { text: 'Contributing', link: '/en/reference/developers' },
    ],
  },
  {
    text: 'Development and design (Chinese)',
    collapsed: true,
    items: [
      { text: 'Development guide', link: '/en/development' },
      { text: 'ChatOps, MCP and agent architecture', link: '/en/design/chatops-mcp-agent' },
      { text: 'MCP server contract', link: '/en/design/phase4-mcp' },
      { text: 'AI agent design', link: '/en/design/phase5-agent' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'pt-tools automates private trackers: RSS downloads, statistics and search across sites, qBittorrent and Transmission management, and ChatOps over QQ and Telegram. Runs in Docker, on Linux and on Windows.',

  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/en/guide/what-is-pt-tools',
        activeMatch: '^/en/(guide/(what-is-pt-tools|install|quick-start|upgrade)|configuration)',
      },
      {
        text: 'Sites',
        link: '/en/sites',
        activeMatch: '^/en/(sites|guide/(get-cookie-apikey|browser-extension|site-login-monitoring|request-new-site))',
      },
      {
        text: 'RSS and downloads',
        link: '/en/guide/rss-subscription',
        activeMatch: '^/en/guide/(rss-subscription|filter-rules-tv-series|auto-cleanup)',
      },
      { text: 'ChatOps', link: '/en/guide/chatops-quickstart', activeMatch: '^/en/guide/chatops-' },
      { text: 'Reference', link: '/en/faq', activeMatch: '^/en/(faq|reference/|development|design/)' },
      {
        text: 'More',
        items: [
          { text: 'Downloads and releases', link: `${REPO}/releases` },
          { text: 'Changelog', link: `${REPO}/blob/main/CHANGELOG.md` },
          { text: 'Report a problem', link: `${REPO}/issues` },
          { text: 'Discussions', link: `${REPO}/discussions` },
          { text: 'FirLab', link: 'https://firlab.app/en/' },
        ],
      },
    ],

    sidebar: { '/en/': sidebar },

    editLink: {
      // VitePress serialises this function into the client bundle with toString(), so it
      // cannot close over REPO: the address is written out in full.
      pattern: ({ filePath }) => `https://github.com/sunerpy/pt-tools/edit/main/docs/${filePath}`,
      text: 'Edit this page on GitHub',
    },

    outline: { level: [2, 3] },

    footer: {
      message: `pt-tools is released under the MIT License and is one of the <a href="https://firlab.app/en/">FirLab</a> projects. Content from <a href="${REPO}/commit/${synced.commit}">pt-tools@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2024–2026 sunerpy',
    },
  },
});
