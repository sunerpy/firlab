/**
 * The few marks the home page's words may carry, turned into HTML after everything else is
 * escaped: `~~struck~~` (what AI polish drops from a sentence, as <del>), `[a link](/path)` and line
 * breaks. Nothing else in the text becomes markup, so a stray `<` stays a character.
 */

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

const UNESCAPES: Record<string, string> = Object.fromEntries(Object.entries(ESCAPES).map(([c, e]) => [e, c]));

function unescapeHtml(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => UNESCAPES[e] ?? e);
}

/** Whether a link leaves the site. */
export const isExternal = (link: string): boolean => /^https?:/.test(link);

/** Only site paths, in-page anchors and web addresses become links. */
const LINKABLE = /^(\/|#|https:\/\/)/;

/** Every `[text](link)` target in `text`, so the build can check them (config/shared.ts). */
export function inlineLinks(text: string): string[] {
  return [...text.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((m) => m[1] ?? '');
}

export function inline(text: string, withBase: (path: string) => string = (path) => path): string {
  return escapeHtml(text)
    // <del>, not <s>: the words were taken out, and screen readers say so.
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label: string, link: string) => {
      // `link` is already escaped, which is what an attribute needs; the base goes on the raw path.
      const target = unescapeHtml(link);
      if (!LINKABLE.test(target)) return whole;
      if (isExternal(target)) return `<a href="${link}" target="_blank" rel="noreferrer">${label}</a>`;
      return `<a href="${target.startsWith('/') ? escapeHtml(withBase(target)) : link}">${label}</a>`;
    })
    .replace(/\n/g, '<br>');
}
