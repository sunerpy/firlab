/** English navigation, sidebar and interface labels. The Markdown is synced from winer. */
import { defineConfig, type DefaultTheme } from 'vitepress';
import synced from '../synced.json';

const REPO = 'https://github.com/sunerpy/winer';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'What is winer', link: '/en/guide/what-is-winer' },
      { text: 'Install', link: '/en/guide/install' },
      { text: 'Quick start', link: '/en/guide/quick-start' },
    ],
  },
  {
    text: 'Features',
    items: [
      { text: 'Live game and callout', link: '/en/guide/live' },
      { text: 'Match history and feats', link: '/en/guide/history' },
      { text: 'Automation', link: '/en/guide/automation' },
      { text: 'In-client', link: '/en/guide/client' },
      { text: 'Tools and settings', link: '/en/guide/settings' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'How rating works', link: '/en/rating' },
      { text: 'FAQ', link: '/en/faq' },
      { text: 'Data and privacy', link: '/en/privacy' },
    ],
  },
];

export const en = defineConfig({
  lang: 'en-US',
  description:
    'winer is a League of Legends client companion: every teammate\'s recent form and tier in champ select, anyone\'s whole match history, and accepting, picking and the opening callout done for you. Windows only, tested on the Tencent client.',

  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/en/guide/what-is-winer',
        activeMatch: '^/en/guide/(what-is-winer|install|quick-start)',
      },
      {
        text: 'Features',
        link: '/en/guide/live',
        activeMatch: '^/en/guide/(live|history|automation|client|settings)',
      },
      { text: 'Rating', link: '/en/rating', activeMatch: '^/en/rating' },
      { text: 'Reference', link: '/en/faq', activeMatch: '^/en/(faq|privacy)' },
      {
        text: 'More',
        items: [
          { text: 'Downloads', link: `${REPO}/releases` },
          { text: 'Changelog', link: `${REPO}/blob/main/CHANGELOG.md` },
          { text: 'Report a problem', link: `${REPO}/issues` },
          { text: 'FirLab', link: 'https://firlab.app/en/' },
        ],
      },
    ],

    sidebar: { '/en/': sidebar },

    editLink: {
      // VitePress serialises this function into the client bundle with toString(), so it
      // cannot close over REPO: the address is written out in full.
      pattern: ({ filePath }) => `https://github.com/sunerpy/winer/edit/main/docs/site/${filePath}`,
      text: 'Edit this page on GitHub',
    },

    outline: { level: [2, 3] },

    footer: {
      message: `winer is released under the MIT License, one of <a href="https://firlab.app/en/">FirLab</a>'s projects, and is not affiliated with Riot Games or Tencent. Content from <a href="${REPO}/commit/${synced.commit}">winer@${synced.shortCommit}</a>.`,
      copyright: 'Copyright © 2026 sunerpy',
    },
  },
});
