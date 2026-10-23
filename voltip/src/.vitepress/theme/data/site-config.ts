/**
 * Settings this theme adds to VitePress's `themeConfig`, one set per language (config/en.ts,
 * config/zh.ts): the two buttons at the end of the nav bar and the footer of the pages without
 * a sidebar.
 */
import type { DefaultTheme } from 'vitepress';
import type { IconName } from './home-schema';

export interface NavAction {
  text: string;
  link: string;
  icon: IconName;
  theme: 'brand' | 'alt';
}

export interface FooterLink {
  text: string;
  link: string;
}

export interface SiteFooter {
  tagline: string;
  /** A QR code beside the brand, on a white plate in both themes. */
  qr?: { src: string; alt: string; caption: string; link?: FooterLink };
  columns: { title: string; items: FooterLink[] }[];
}

export interface VoltipThemeConfig extends DefaultTheme.Config {
  vtActions?: NavAction[];
  vtFooter?: SiteFooter;
}
