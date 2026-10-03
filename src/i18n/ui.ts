/**
 * i18n chrome dictionary.
 *
 * Scope: navigation, labels, footer and other *chrome* strings — anything short
 * and reusable. Long-form page content (product prose, spec tables, install
 * commands) lives in `content.ts`, because forcing paragraphs through a flat
 * key/value map produces unreadable keys and unreviewable translations.
 *
 * `ui` is the single source of truth for the key set: `en` is typed as
 * `Record<keyof typeof ui['zh-cn'], string>`, so a key added to Chinese and
 * forgotten in English is a type error, not a runtime `undefined`.
 */

export const languages = {
  'zh-cn': '中文',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang = 'zh-cn' satisfies Lang;

/** hreflang value emitted for each locale. Not the same as the Astro locale id. */
export const hreflang = {
  'zh-cn': 'zh-CN',
  en: 'en',
} as const satisfies Record<Lang, string>;

/** `og:locale` value. Underscore form, per the Open Graph spec. */
export const ogLocale = {
  'zh-cn': 'zh_CN',
  en: 'en_US',
} as const satisfies Record<Lang, string>;

/** `<html lang>` value. */
export const htmlLang = hreflang;

const zh = {
  'nav.home': 'FirLab 首页',
  'nav.skipToContent': '跳到正文',
  'nav.label': '主导航',
  'nav.breadcrumb': '面包屑导航',

  'lang.label': '语言',
  'lang.zh': '中',
  'lang.en': 'EN',
  'lang.switchTo': '切换到 English',

  /**
   * Theme control. `theme.system` is a real third state, not a reset button:
   * choosing it removes the stored preference so the page goes back to tracking
   * `prefers-color-scheme`.
   */
  'theme.label': '主题',
  'theme.system': '跟随系统',
  'theme.light': '浅色',
  'theme.dark': '深色',

  'social.label': '更多链接',
  'social.github': 'GitHub',
  'social.bilibili': '哔哩哔哩',
  'social.zhihu': '知乎',
  'social.x': 'X',
  'social.wechat': '微信',
  'social.wechat.caption': '微信扫码添加',
  'social.wechat.alt': '微信个人二维码',
  'social.wechatOa': '公众号',
  'social.wechatOa.caption': '微信扫码关注',
  'social.wechatOa.alt': '微信公众号「六月水蓝」的二维码',

  'nav.apps': '应用',
  'nav.appsList': '应用列表',
  'nav.allApps': '查看全部应用',
  'nav.current': '当前页面',

  'category.service': '自部署服务',
  'category.cli': '命令行工具',
  'category.desktop': '桌面应用',

  'filter.label': '按类别查看',
  'filter.all': '全部',
  'filter.service': '自部署服务',
  'filter.cli': '命令行工具',
  'filter.desktop': '桌面应用',

  'platform.label': '支持平台',
  'platform.windows': 'Windows',
  'platform.macos': 'macOS',
  'platform.linux': 'Linux',
  'platform.docker': 'Docker',

  'card.repo': '{name} 的 GitHub 仓库',
  'release.notes': '{name} {version} 的发布说明',

  'product.version': '版本',
  'product.released': '发布于',
  'product.license': '许可证',
  'product.install': '安装',
  'product.repo': 'GitHub 仓库',
  'product.releases': '发布页',

  'status.live': '持续更新',
  'status.early': '早期版本',
  'status.wip': '开发中',

  'footer.blurb': 'FirLab 的所有应用都在 GitHub 上开源。问题和建议请提交到对应项目的 Issues。',
  'footer.copyright': '© {year} sunerpy',
  'footer.privacy': '无统计代码，无 Cookie',
  'footer.nav': '页脚导航',
} as const;

const en: Record<keyof typeof zh, string> = {
  'nav.home': 'FirLab home',
  'nav.skipToContent': 'Skip to content',
  'nav.label': 'Main navigation',
  'nav.breadcrumb': 'Breadcrumb',

  'lang.label': 'Language',
  'lang.zh': '中',
  'lang.en': 'EN',
  'lang.switchTo': 'Switch to 中文',

  'theme.label': 'Theme',
  'theme.system': 'Follow system',
  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'social.label': 'More links',
  'social.github': 'GitHub',
  'social.bilibili': 'Bilibili',
  'social.zhihu': 'Zhihu',
  'social.x': 'X',
  'social.wechat': 'WeChat',
  'social.wechat.caption': 'Scan with WeChat to add',
  'social.wechat.alt': 'Personal WeChat QR code',
  'social.wechatOa': 'WeChat Official Account',
  'social.wechatOa.caption': 'Scan with WeChat to follow',
  'social.wechatOa.alt': 'QR code of the WeChat Official Account 六月水蓝',

  'nav.apps': 'Apps',
  'nav.appsList': 'App list',
  'nav.allApps': 'See all apps',
  'nav.current': 'Current page',

  'category.service': 'Self-hosted service',
  'category.cli': 'Command-line tool',
  'category.desktop': 'Desktop app',

  'filter.label': 'Show by category',
  'filter.all': 'All',
  'filter.service': 'Self-hosted services',
  'filter.cli': 'Command-line tools',
  'filter.desktop': 'Desktop apps',

  'platform.label': 'Platforms',
  'platform.windows': 'Windows',
  'platform.macos': 'macOS',
  'platform.linux': 'Linux',
  'platform.docker': 'Docker',

  'card.repo': '{name} on GitHub',
  'release.notes': 'Release notes for {name} {version}',

  'product.version': 'Version',
  'product.released': 'Released',
  'product.license': 'License',
  'product.install': 'Install',
  'product.repo': 'GitHub repository',
  'product.releases': 'Releases',

  'status.live': 'Actively maintained',
  'status.early': 'Early release',
  'status.wip': 'In development',

  'footer.blurb': "Every FirLab app is open source on GitHub. Report problems and suggestions in the project's issues.",
  'footer.copyright': '© {year} sunerpy',
  'footer.privacy': 'No analytics, no cookies',
  'footer.nav': 'Footer navigation',
};

export const ui = {
  'zh-cn': zh,
  en,
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof typeof zh;

/**
 * Translation accessor. Returns the key's string for `lang`, falling back to the
 * default locale — never to `undefined`, so a missing string degrades to
 * Chinese rather than printing an empty node.
 *
 * `vars` does simple `{name}` interpolation, which is all this site needs (one
 * placeholder, `{year}`). No plural rules: nothing here is countable.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    const raw = ui[lang][key] ?? ui[defaultLang][key];
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}

/** Type guard so a URL segment can be narrowed to a known locale. */
export function isLang(value: string): value is Lang {
  return value in languages;
}

/**
 * Read the locale out of a URL. `/en/foo` → `en`; anything else → the default.
 * Used only as a safety net: pages pass their own `lang` explicitly so the
 * locale is a build-time fact, not a runtime parse.
 */
export function getLangFromUrl(url: URL): Lang {
  const segment = url.pathname.split('/')[1] ?? '';
  return isLang(segment) ? segment : defaultLang;
}

/**
 * Strip the locale prefix from a pathname, returning a bare relative slug with
 * no leading slash: `/en/voltip/` → `voltip/`, `/` → `''`.
 *
 * This is what makes the language switch land on the *same* page in the other
 * locale instead of always bouncing to the home page.
 */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isLang(parts[0]!)) parts.shift();
  return parts.length === 0 ? '' : `${parts.join('/')}/`;
}
