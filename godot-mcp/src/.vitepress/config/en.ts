/** English (root locale) navigation, sidebar and interface labels. The Markdown is synced from godot-mcp. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/godot-mcp';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Install', link: '/guide/install' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'MCP clients', link: '/guide/clients' },
      { text: 'Profiles and answers', link: '/guide/profiles' },
    ],
  },
  {
    text: 'Use',
    items: [
      { text: 'Analysis', link: '/guide/analysis' },
      { text: 'Editing the project', link: '/guide/editing' },
      { text: 'Running the engine', link: '/guide/engine' },
      { text: 'Games and editors', link: '/guide/sessions' },
      { text: 'The editor add-on', link: '/guide/editor' },
    ],
  },
  {
    text: 'Operate',
    items: [
      { text: 'HTTP', link: '/operate/http' },
      { text: 'Recovery', link: '/operate/recovery' },
      { text: 'Troubleshooting', link: '/operate/troubleshooting' },
    ],
  },
  {
    text: 'Reference',
    collapsed: false,
    items: [
      { text: 'Tools and resources', link: '/reference/tools' },
      { text: 'Configuration', link: '/reference/configuration' },
      { text: 'Outcomes', link: '/reference/outcomes' },
      { text: 'Godot versions', link: '/reference/godot-versions' },
      { text: 'Managed sessions', link: '/reference/managed-sessions' },
      { text: 'Exports', link: '/reference/exports' },
      { text: 'Editor bridge', link: '/reference/editor-bridge' },
      { text: 'Artifacts', link: '/reference/artifacts' },
      { text: 'Process boundaries', link: '/reference/process-boundaries' },
      { text: 'Recovery in depth', link: '/reference/recovery' },
      { text: 'HTTP: trusted_local', link: '/reference/http-trusted-local' },
      { text: 'HTTP: proxied_oidc', link: '/reference/http-proxied-oidc' },
      { text: 'Threat model', link: '/reference/threat-model' },
      { text: 'Usage and verification', link: '/reference/usage' },
    ],
  },
  {
    // No heading: two pages that belong to no section, after a divider.
    items: [
      { text: 'Privacy', link: '/privacy' },
      { text: 'Developers', link: '/developers' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'A local Model Context Protocol server for Godot projects: analysis without the engine, journaled edits, and the games and editors it runs, drives, captures and debugs.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '^/guide/' },
      { text: 'Operate', link: '/operate/http', activeMatch: '^/operate/' },
      { text: 'Reference', link: '/reference/tools', activeMatch: '^/(reference/|privacy)' },
      {
        text: 'More',
        items: [
          { text: 'Downloads and releases', link: `${REPO}/releases` },
          { text: 'Report a problem', link: `${REPO}/issues` },
          { text: 'Developers', link: '/developers' },
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
      message: `godot-mcp is released under the MIT License and is one of the <a href="https://firlab.app/en/">FirLab</a> projects. It is not affiliated with the Godot Engine project. Content from <a href="${REPO}/commit/${synced.commit}">godot-mcp@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
