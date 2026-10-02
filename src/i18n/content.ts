/**
 * Home page copy, per locale, plus the two content shapes the product pages share.
 *
 * The products themselves live in `products.ts`. This file holds only what the home
 * page says around them, and none of it names a product or counts them: a new app
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
   * The h1's second line, what FirLab offers, in phrases. Like the lede's
   * sentences, each phrase stays whole where the line allows, so a phone breaks
   * the line after 「、」 rather than inside 「命令行工具」.
   */
  heroSubtitle: string[];
  /**
   * The lede, one sentence per entry. Each sentence is set as an unbreakable run
   * where the line allows it, so on a desktop measure the lede breaks between
   * sentences instead of inside a word.
   */
  heroLede: string[];
  heroGithub: string;
  heroFollow: string;

  appsTitle: string;

  releasesTitle: string;
  releasesNote: string;

  feedbackTitle: string;
  feedbackBody: string;
  feedbackLink: string;
  followTitle: string;
  followBody: string;
}

const zh: HomeContent = {
  title: 'FirLab — 开源的桌面应用、命令行工具与自部署服务',
  description:
    'FirLab（firlab.app）提供开源的桌面应用、命令行工具和自部署服务，汇总各项目的介绍、文档、下载和最近的发布。',
  ogAlt: 'FirLab — 开源的桌面应用、命令行工具与自部署服务',

  // No trailing 。 on a display heading: a full-width period at that size leaves a
  // visible hole at the end of the line.
  heroTitle: 'FirLab',
  heroSubtitle: ['开源的桌面应用、', '命令行工具与自部署服务'],
  heroLede: ['在这里查看每个应用的介绍、文档和下载。', '所有项目都已开源，源码和安装包在 GitHub 上。'],
  heroGithub: 'GitHub',
  heroFollow: '关注公众号',

  appsTitle: '应用',

  releasesTitle: '最近发布',
  releasesNote: '版本号和发布日期取自各项目在 GitHub 上的最新正式版本。',

  feedbackTitle: '问题与建议',
  feedbackBody:
    '使用中遇到问题，或者希望增加某个功能，请到对应项目的 GitHub Issues 提交，附上版本号和复现步骤会更快得到处理。',
  feedbackLink: '前往 GitHub',
  followTitle: '微信公众号',
  followBody: '六月水蓝',
};

const en: HomeContent = {
  title: 'FirLab — open-source desktop apps, command-line tools and self-hosted services',
  description:
    "FirLab (firlab.app) offers open-source desktop apps, command-line tools and self-hosted services, with each project's overview, documentation, downloads and latest release.",
  ogAlt: 'FirLab — open-source desktop apps, command-line tools and self-hosted services',

  heroTitle: 'FirLab',
  heroSubtitle: ['Open-source desktop apps,', 'CLI tools and self-hosted services'],
  heroLede: [
    'Overviews, documentation and downloads for each app.',
    'Every project is open source, with its code and installers on GitHub.',
  ],
  heroGithub: 'GitHub',
  heroFollow: 'WeChat Official Account',

  appsTitle: 'Apps',

  releasesTitle: 'Latest releases',
  releasesNote: "Versions and dates come from each project's latest stable release on GitHub.",

  feedbackTitle: 'Bugs and requests',
  feedbackBody:
    "Found a problem, or missing a feature? Open an issue in the project's GitHub repository; the version number and steps to reproduce get it handled sooner.",
  feedbackLink: 'Go to GitHub',
  followTitle: 'WeChat Official Account',
  followBody: '六月水蓝',
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, HomeContent>;

export function getHomeContent(lang: Lang): HomeContent {
  return content[lang];
}
