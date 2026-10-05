/** English (root locale) navigation, sidebar and interface labels. The Markdown is synced from kiro-provider. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/kiro-provider';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is kiro-provider', link: '/guide/what-is-kiro-provider' },
      { text: 'Install', link: '/guide/install' },
      { text: 'Quick start', link: '/guide/quick-start' },
    ],
  },
  {
    text: 'Using kiro-provider',
    items: [
      { text: 'Accounts', link: '/guide/accounts' },
      { text: 'Web search', link: '/guide/web-search' },
      { text: 'Updates', link: '/guide/updates' },
    ],
  },
  {
    text: 'Clients',
    items: [
      { text: 'Choose a client', link: '/clients/' },
      { text: 'Codex CLI', link: '/clients/codex' },
      { text: 'Claude Code', link: '/clients/claude-code' },
      { text: 'Zuno', link: '/clients/zuno' },
      { text: 'Client launchers', link: '/clients/launchers' },
    ],
  },
  {
    text: 'Operate',
    items: [
      { text: 'Overview', link: '/operate/' },
      { text: 'Background service', link: '/operate/service' },
      { text: 'Troubleshooting', link: '/operate/troubleshooting' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Overview', link: '/reference/' },
      { text: 'Command line', link: '/reference/cli' },
      { text: 'Configuration', link: '/reference/configuration' },
      { text: 'Protocol compatibility', link: '/reference/protocol' },
      { text: 'Usage and context', link: '/reference/usage' },
      { text: 'Streaming errors', link: '/reference/streaming-errors' },
      { text: 'Historical tool calls', link: '/reference/historical-tools' },
      { text: 'Known limits', link: '/limits' },
      { text: 'Frequently asked questions', link: '/reference/faq' },
      { text: 'Data and network', link: '/privacy' },
    ],
  },
  {
    text: 'Development',
    collapsed: true,
    items: [
      { text: 'Contributing', link: '/developers' },
      { text: 'Architecture', link: '/dev/architecture' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'A local gateway that serves your AWS Kiro accounts through OpenAI Responses and Anthropic Messages, for Codex, Claude Code and other agents.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/what-is-kiro-provider', activeMatch: '^/guide/' },
      { text: 'Clients', link: '/clients/', activeMatch: '^/clients/' },
      { text: 'Reference', link: '/reference/', activeMatch: '^/(reference/|operate/|privacy|limits)' },
      {
        text: 'More',
        items: [
          { text: 'Downloads and releases', link: `${REPO}/releases` },
          { text: 'Changelog', link: `${REPO}/blob/main/changelog/CHANGELOG-v3.x.md` },
          { text: 'Report a problem', link: `${REPO}/issues` },
          { text: 'Contributing', link: '/developers' },
          { text: 'FirLab', link: 'https://firlab.app/en/' },
        ],
      },
    ],

    sidebar: { '/': sidebar },

    editLink: {
      pattern: editLinkPattern,
      text: 'Edit this page on GitHub',
    },

    outline: { level: [2, 3] },

    footer: {
      message: `kiro-provider is released under the MIT License and is one of the <a href="https://firlab.app/en/">FirLab</a> projects. Content from <a href="${REPO}/commit/${synced.commit}">kiro-provider@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
