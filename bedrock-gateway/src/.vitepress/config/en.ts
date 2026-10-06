/** English (root locale) navigation, sidebar and interface labels. The Markdown is synced from bedrock-gateway-rust. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';
import { editLinkPattern } from './shared';

const REPO = 'https://github.com/sunerpy/bedrock-gateway-rust';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Guide',
    items: [
      { text: 'What is bedrock-gateway', link: '/guide/what-is-bedrock-gateway' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Install', link: '/guide/install' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Models', link: '/guide/models' },
      { text: 'Caching and reasoning', link: '/guide/caching-and-reasoning' },
    ],
  },
  {
    text: 'Clients',
    items: [
      { text: 'Overview', link: '/clients/' },
      { text: 'Codex CLI', link: '/clients/codex' },
      { text: 'Editors and agents', link: '/clients/editors-and-agents' },
    ],
  },
  {
    text: 'Operate',
    items: [
      { text: 'Deploy', link: '/operate/' },
      { text: 'Docker', link: '/operate/docker' },
      { text: 'ECS and Fargate', link: '/operate/ecs' },
      { text: 'Lambda', link: '/operate/lambda' },
      { text: 'Migrating from aws-samples', link: '/operate/migration' },
      { text: 'Observability', link: '/operate/observability' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'API', link: '/reference/api' },
      { text: 'Protocol compatibility', link: '/reference/protocol' },
      { text: 'Caching and reasoning in depth', link: '/reference/caching-and-reasoning' },
      { text: 'FAQ', link: '/reference/faq' },
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
    'An OpenAI-compatible gateway for Amazon Bedrock: Chat Completions, Responses, Completions and Embeddings served from your own AWS account.',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/what-is-bedrock-gateway', activeMatch: '^/guide/' },
      { text: 'Clients', link: '/clients/', activeMatch: '^/clients/' },
      { text: 'Operate', link: '/operate/', activeMatch: '^/operate/' },
      { text: 'Reference', link: '/reference/api', activeMatch: '^/(reference/|privacy)' },
      {
        text: 'More',
        items: [
          { text: 'Downloads and releases', link: `${REPO}/releases` },
          { text: 'Docker Hub', link: 'https://hub.docker.com/r/sunerpy/bedrock-gateway-rust' },
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
      message: `bedrock-gateway is released under the MIT No Attribution License (MIT-0) and is one of the <a href="https://firlab.app/en/">FirLab</a> projects. Content from <a href="${REPO}/commit/${synced.commit}">bedrock-gateway-rust@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
