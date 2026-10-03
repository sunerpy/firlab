/** English navigation, sidebar and interface labels. The Markdown is synced from codegraph-rust. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/codegraph-rust';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is CodeGraph', link: '/en/guide/what-is-codegraph' },
      { text: 'Install', link: '/en/guide/install' },
      { text: 'Quick start', link: '/en/guide/quick-start' },
    ],
  },
  {
    text: 'Using CodeGraph',
    items: [
      { text: 'Connect a coding agent', link: '/en/guide/agents' },
      { text: 'The browser viewer', link: '/en/guide/viewer' },
      { text: 'Keeping the index current', link: '/en/guide/keeping-current' },
      { text: 'Configuration', link: '/en/guide/configuration' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Frequently asked questions', link: '/en/reference/faq' },
      { text: 'Data and network', link: '/en/privacy' },
      { text: 'CLI reference', link: '/en/reference/cli' },
      { text: 'MCP reference', link: '/en/reference/mcp' },
      { text: 'Viewer reference', link: '/en/reference/ui' },
      { text: 'Supported languages', link: '/en/reference/languages' },
      { text: 'Godot static analysis', link: '/en/reference/godot' },
      { text: 'Troubleshooting', link: '/en/reference/troubleshooting' },
    ],
  },
  {
    text: 'Development',
    collapsed: true,
    items: [
      { text: 'Contributing', link: '/en/developers' },
      { text: 'Architecture', link: '/en/dev/architecture' },
      { text: 'Data model', link: '/en/dev/data-model' },
      { text: 'Equivalence oracle', link: '/en/dev/equivalence' },
      { text: 'Grammar ABI manifest', link: '/en/dev/grammar-manifest' },
      { text: 'Embedded extraction', link: '/en/dev/embedded-extraction' },
      { text: 'Benchmark methodology', link: '/en/dev/benchmark' },
      { text: 'Benchmark results', link: '/en/dev/benchmark-results' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'CodeGraph parses a repository with tree-sitter into a local index of symbols and calls, and answers structural questions for the command line, coding agents over MCP and a browser viewer. No model involved.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/en/guide/what-is-codegraph', activeMatch: '^/en/guide/' },
      { text: 'Reference', link: '/en/reference/faq', activeMatch: '^/en/(reference/|privacy)' },
      { text: 'Development', link: '/en/developers', activeMatch: '^/en/(developers|dev/)' },
      {
        text: 'More',
        items: [
          { text: 'Downloads and releases', link: `${REPO}/releases` },
          { text: 'Changelog', link: `${REPO}/blob/main/changelog/CHANGELOG-v0.x.md` },
          { text: 'Report a problem', link: `${REPO}/issues` },
          { text: 'FirLab', link: 'https://firlab.app/en/' },
        ],
      },
    ],

    sidebar: { '/en/': sidebar },

    editLink: {
      pattern: editLinkPattern,
      text: 'Edit this page on GitHub',
    },

    outline: { level: [2, 3] },

    footer: {
      message: `CodeGraph is released under the MIT License and is one of the <a href="https://firlab.app/en/">FirLab</a> projects. Content from <a href="${REPO}/commit/${synced.commit}">codegraph-rust@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
