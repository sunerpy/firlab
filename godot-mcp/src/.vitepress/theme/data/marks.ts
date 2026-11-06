/**
 * The marks of the MCP clients the home page's client band names (HomeClients.vue), drawn on a
 * neutral tile with the client's name under it, as on the Voltip site (DESIGN.md §10, §18).
 *
 * Sources, copied as they are, on their 24 × 24 grids:
 * - Cursor: Simple Icons 16.35.0 (https://simpleicons.org, `icons/cursor.svg`), CC0 1.0.
 * - Codex, OpenCode and Pi Agent: Lobe Icons at commit 7d7d037
 *   (https://github.com/lobehub/lobe-icons, `packages/static-svg/icons/{codex,opencode,pi}.svg`),
 *   the mono files, whose root sets `fill-rule="evenodd"`. Their primaries are black or white,
 *   so their tiles stay neutral and the marks take the text colour.
 * The same files the Voltip site's marks.ts copies. Claude Code is named in words, as there.
 *
 * The marks are their owners' trademarks, shown only to name the client beside them.
 *
 * Lobe Icons is under the MIT licence:
 *
 * MIT License
 *
 * Copyright (c) 2023 LobeHub
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export interface MarkPath {
  d: string;
  evenOdd?: boolean;
}

export interface Mark {
  title: string;
  paths: readonly MarkPath[];
}

export const MARKS = {
  cursor: {
    title: 'Cursor',
    paths: [
      {
        d: 'M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23',
      },
    ],
  },
  codex: {
    title: 'Codex',
    paths: [
      {
        d: 'M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z',
        evenOdd: true,
      },
    ],
  },
  opencode: {
    title: 'OpenCode',
    paths: [{ d: 'M16 6H8v12h8V6zm4 16H4V2h16v20z', evenOdd: true }],
  },
  pi: {
    title: 'Pi Agent',
    paths: [
      { d: 'M1 1h16.5v11H12v5.5H6.5V23H1V1zm5.5 5.5V12H12V6.5H6.5z', evenOdd: true },
      { d: 'M17.5 12H23v11h-5.5V12z', evenOdd: true },
    ],
  },
} as const satisfies Record<string, Mark>;

export type MarkName = keyof typeof MARKS;
export const MARK_NAMES = Object.keys(MARKS) as MarkName[];
