import { withBase } from 'vitepress';
import { isExternal } from './inline';

/** A `link` field as an href: a site path under the site's base, a web address as it is. */
export const href = (link: string): string => (isExternal(link) ? link : withBase(link));

/** The attributes a link that leaves the site carries. */
export const away = (link: string) =>
  isExternal(link) ? { target: '_blank', rel: 'noreferrer' } : {};
