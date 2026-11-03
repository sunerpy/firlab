/**
 * Home page copy, per locale, plus the two content shapes the product pages share.
 *
 * The products themselves live in `products.ts`. This file holds only what the home
 * page says around them, and none of it names a product or counts them: a new project
 * must be able to join the catalog without anyone editing a sentence here.
 *
 * The site speaks as FirLab (firlab.app), not as a person's homepage. Plain
 * statements, no slogans: if a line would read as well on any other site, it does
 * not belong here.
 */

import type { Lang } from './ui';

export interface Spec {
  term: string;
  value: string;
}

export interface InstallLine {
  /** Optional comment rendered above the command. Never part of the command. */
  note?: string;
  command: string;
}

export interface HomeContent {
  title: string;
  description: string;
  ogAlt: string;

  /** The brand line of the h1. */
  heroTitle: string;
  /**
   * The h1's second line, what FirLab offers, in phrases. Like the lede's sentences,
   * each phrase stays whole where the line allows, so the line breaks after 「，」
   * rather than inside a word.
   */
  heroLine: string[];
  /**
   * The lede, one clause per entry. Each is set as an unbreakable run where the line
   * allows it, so on a desktop measure the lede breaks between clauses instead of
   * inside a word.
   */
  heroLede: string[];
  heroGithub: string;
  heroFollow: string;
  /** `{list}` is the platforms the catalog ships for, joined by `listJoin`. */
  factPlatforms: string;
  /** Before the newest release's name and version, and between that and its date. */
  factLatest: string;
  factLatestSep: string;
  factPrivacy: string;

  projectsTitle: string;
  projectsWords: string[];

  releasesTitle: string;
  releasesNote: string;
  releaseNotes: string;

  feedbackTitle: string;
  feedbackBody: string[];
  feedbackLink: string;
}

const zh: HomeContent = {
  title: 'FirLab — 开源软件，从日常应用到开发者工具',
  description:
    'FirLab（firlab.app）汇总开源项目的介绍、文档、下载和最近的发布，从桌面和手机上的日常应用到开发者工具、服务与网关。',
  ogAlt: 'FirLab — 开源软件，从日常应用到开发者工具',

  // No trailing 。 on a display heading: a full-width period at that size leaves a
  // visible hole at the end of the line.
  heroTitle: 'FirLab',
  // The zero-width space is the phrase's one break opportunity, used only when the phrase
  // is wider than the line: headings keep CJK words whole (`keep-all`), and without it a
  // 320px window with a scroll bar broke the phrase before its last character.
  heroLine: ['开源软件，', '从日常应用\u200B到开发者工具'],
  heroLede: ['在这里查看每个项目的介绍、文档和下载。', '所有项目都已开源，', '源码和安装包在 GitHub 上。'],
  heroGithub: 'GitHub',
  heroFollow: '关注公众号',
  factPlatforms: '支持 {list}',
  factLatest: '最近一次发布：',
  factLatestSep: '，',
  factPrivacy: '本站没有统计代码，也不设 Cookie',

  projectsTitle: '项目',
  projectsWords: ['每个项目都有自己的介绍和文档，', '卡片上的版本取自它最新的正式发布。'],

  releasesTitle: '最近发布',
  releasesNote: '版本号和发布日期取自各项目在 GitHub 上的最新正式版本。',
  releaseNotes: '发布说明',

  feedbackTitle: '问题与建议',
  feedbackBody: [
    '使用中遇到问题，',
    '或者希望增加某个功能，',
    '请到对应项目的 GitHub Issues 提交，',
    '附上版本号和复现步骤会更快得到处理。',
  ],
  feedbackLink: '前往 GitHub',
};

const en: HomeContent = {
  title: 'FirLab — open-source software, from everyday apps to developer tools',
  description:
    "FirLab (firlab.app) gathers each open-source project's overview, documentation, downloads and latest release, from everyday desktop and mobile apps to developer tools, services and gateways.",
  ogAlt: 'FirLab — open-source software, from everyday apps to developer tools',

  heroTitle: 'FirLab',
  heroLine: ['Open-source software,', 'from everyday apps', 'to developer tools'],
  heroLede: [
    'Overviews, documentation and downloads for each project.',
    'Every project is open source,',
    'with its code and installers on GitHub.',
  ],
  heroGithub: 'GitHub',
  heroFollow: 'WeChat Official Account',
  factPlatforms: 'Runs on {list}',
  factLatest: 'Latest release: ',
  factLatestSep: ', ',
  factPrivacy: 'This site runs no analytics and sets no cookies',

  projectsTitle: 'Projects',
  projectsWords: [
    'Each project has its own overview and documentation;',
    'the version on a card is its latest stable release.',
  ],

  releasesTitle: 'Latest releases',
  releasesNote: "Versions and dates come from each project's latest stable release on GitHub.",
  releaseNotes: 'Release notes',

  feedbackTitle: 'Bugs and requests',
  feedbackBody: [
    'Found a problem, or missing a feature?',
    "Open an issue in the project's GitHub repository;",
    'the version number and steps to reproduce get it handled sooner.',
  ],
  feedbackLink: 'Go to GitHub',
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, HomeContent>;

export function getHomeContent(lang: Lang): HomeContent {
  return content[lang];
}

/**
 * A list in running text: 「Windows、macOS 和 Linux」, "Windows, macOS and Linux".
 * Written out rather than `Intl.ListFormat`, which sets 「和」 with no space against the
 * Latin names on either side of it.
 */
export function listJoin(lang: Lang, items: readonly string[]): string {
  if (items.length < 2) return items.join('');
  const [sep, last] = lang === 'en' ? [', ', ' and '] : ['、', ' 和 '];
  return `${items.slice(0, -1).join(sep)}${last}${items.at(-1)}`;
}
