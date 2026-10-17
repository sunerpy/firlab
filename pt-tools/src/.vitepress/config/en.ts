/** English navigation, sidebar and interface labels. The Markdown is synced from pt-tools. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/pt-tools';
// The docs are published from the 1.0 preview: pages and the changelog come from the v1.0.0-rc
// branch. Switch back to main once 1.0 is merged there (zh.ts too).
const DOCS_BRANCH = 'v1.0.0-rc';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is pt-tools', link: '/en/guide/what-is-pt-tools' },
      { text: "What's new in the 1.0 preview", link: '/en/guide/whats-new-1.0' },
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
      { text: 'CookieCloud import', link: '/en/guide/cookiecloud' },
      { text: 'Request a new site', link: '/en/guide/request-new-site' },
    ],
  },
  {
    text: 'RSS and downloads',
    items: [
      { text: 'RSS subscriptions', link: '/en/guide/rss-subscription' },
      { text: 'Filter rules and TV series', link: '/en/guide/filter-rules-tv-series' },
      { text: 'Auto-delete and disk protection', link: '/en/guide/auto-cleanup' },
      { text: 'Seed boosting', link: '/en/guide/brush' },
      { text: 'Statistics and daily report', link: '/en/guide/user-stats' },
      { text: 'Downloader assistant', link: '/en/guide/downloader-assistant' },
      { text: 'Torrent transfer', link: '/en/guide/torrent-transfer' },
      { text: 'IYUU cross-seeding', link: '/en/guide/reseed' },
    ],
  },
  {
    text: 'Media',
    items: [
      { text: 'Subscriptions', link: '/en/guide/media-subscribe' },
      { text: 'Media library organising', link: '/en/guide/media-library' },
      { text: 'Media recognition', link: '/en/guide/media-recognize' },
    ],
  },
  {
    text: 'ChatOps and notifications',
    items: [
      { text: 'ChatOps quick start', link: '/en/guide/chatops-quickstart' },
      { text: 'QQ through OneBot (NapCat)', link: '/en/guide/chatops-qq-napcat' },
      { text: 'Telegram bot', link: '/en/guide/chatops-telegram' },
      { text: 'New-torrent notifications', link: '/en/guide/chatops-rss-notify' },
      { text: 'More notification channels', link: '/en/guide/notify-channels' },
    ],
  },
  {
    text: 'App and APIs',
    items: [
      { text: 'Mobile app', link: '/en/guide/mobile-app' },
      { text: 'Remote access', link: '/en/guide/remote-access' },
      { text: 'AI assistant', link: '/en/guide/assistant' },
      { text: 'MCP', link: '/en/guide/mcp' },
      { text: 'API tokens', link: '/en/guide/api-tokens' },
      { text: 'App API', link: '/en/reference/app-api' },
      { text: 'qB-compatible entrance', link: '/en/guide/qbit-compat' },
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
    'pt-tools automates private trackers: RSS downloads, seed boosting and IYUU cross-seeding, media library organising, statistics and search across sites, qBittorrent and Transmission management, and a mobile app with ChatOps over QQ and Telegram. Runs in Docker, on Linux and on Windows.',

  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/en/guide/what-is-pt-tools',
        activeMatch: '^/en/(guide/(what-is-pt-tools|whats-new-1.0|install|quick-start|upgrade)|configuration)',
      },
      {
        text: 'Sites',
        link: '/en/sites',
        activeMatch: '^/en/(sites|guide/(get-cookie-apikey|browser-extension|site-login-monitoring|cookiecloud|request-new-site))',
      },
      {
        text: 'RSS and downloads',
        link: '/en/guide/rss-subscription',
        activeMatch:
          '^/en/guide/(rss-subscription|filter-rules-tv-series|auto-cleanup|brush|user-stats|downloader-assistant|torrent-transfer|reseed)',
      },
      { text: 'Media', link: '/en/guide/media-library', activeMatch: '^/en/guide/media-' },
      { text: 'ChatOps', link: '/en/guide/chatops-quickstart', activeMatch: '^/en/guide/(chatops-|notify-channels)' },
      {
        text: 'App and APIs',
        link: '/en/guide/mobile-app',
        activeMatch: '^/en/(guide/(mobile-app|remote-access|assistant|mcp|api-tokens|qbit-compat)|reference/app-api)',
      },
      {
        text: 'Reference',
        link: '/en/faq',
        activeMatch: '^/en/(faq|reference/(cli|security|developers)|development|design/)',
      },
      {
        text: 'More',
        items: [
          { text: 'Downloads and releases', link: `${REPO}/releases` },
          { text: 'Changelog', link: `${REPO}/blob/${DOCS_BRANCH}/CHANGELOG.md` },
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
      pattern: ({ filePath }) => `https://github.com/sunerpy/pt-tools/edit/v1.0.0-rc/docs/${filePath}`,
      text: 'Edit this page on GitHub',
    },

    outline: { level: [2, 3] },

    footer: {
      message: `pt-tools is released under the MIT License and is one of the <a href="https://firlab.app/en/">FirLab</a> projects. Content from <a href="${REPO}/commit/${synced.commit}">pt-tools@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2024–2026 sunerpy',
    },
  },
});
