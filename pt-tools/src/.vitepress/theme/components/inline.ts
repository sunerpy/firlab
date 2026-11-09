/**
 * The few marks the 2026-11 home page's words may carry, turned into HTML after everything else
 * is escaped: `code` in backticks, **strong** words in double asterisks and a link to an https://
 * address in Markdown's own form. A page of the site is linked from a `link` or a `guide` field
 * instead (data/home-schema.ts checks that). Nothing else in the text becomes markup, so a stray
 * `<` stays a character. After godot-mcp's theme/components/inline.ts.
 */

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** Whether a link leaves the site. */
export const isExternal = (link: string): boolean => /^https?:/.test(link);

/** Strong words and https links in a run of text that holds no code span. */
function marks(escaped: string): string {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

/**
 * A line of code as HTML that wraps only at its spaces: each run of other characters is one
 * unbreakable token, so `--`, `pt-tools` or a path never splits at a hyphen. The spaces stay.
 */
export function codeTokens(text: string): string {
  return text
    .split(/(\s+)/)
    .map((part) => (part === '' || /^\s+$/.test(part) ? part : `<span class="pt-token">${escapeHtml(part)}</span>`))
    .join('');
}

/**
 * The longest code span that keeps to one line: up to 28 characters is about 250 px of code, which
 * fits the narrowest column (272 px at 320 px). A longer one, a path say, still wraps.
 */
export const SHORT_CODE = 28;

/** The class a code span of `text` carries: `pt-nowrap` when it is short enough to keep whole. */
export function codeClass(text: string): string | undefined {
  return [...text].length <= SHORT_CODE ? 'pt-nowrap' : undefined;
}

/** The words as HTML: code spans first, so nothing inside one becomes markup. */
export function inline(text: string): string {
  return text
    .split(/(`[^`]+`)/)
    .map((part) => {
      if (!(part.length > 2 && part.startsWith('`') && part.endsWith('`'))) return marks(escapeHtml(part));
      const code = part.slice(1, -1);
      const cls = codeClass(code);
      return `<code${cls ? ` class="${cls}"` : ''}>${escapeHtml(code)}</code>`;
    })
    .join('');
}
