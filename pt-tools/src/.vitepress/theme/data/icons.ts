/**
 * The home page's line icons (PtIcon.vue): Lucide's shapes (https://lucide.dev), the same table
 * the pt-tools web UI draws with (pt-tools `web/frontend/src/icons/lucide.ts`), so an icon on this
 * page is the one the reader meets in the app. Each element of an icon is copied as it is, on
 * Lucide's 24 × 24 grid. PtIcon draws them with a 1.8 px stroke, as the godot-mcp and Voltip
 * sites' icons are (DESIGN.md §10, §18). They are decorative: the words beside each icon carry
 * the meaning.
 *
 * Lucide is under the ISC licence, and two of the icons here, `arrow-right` and `download`, are
 * derived from Feather, under the MIT licence; both notices follow, as the licences ask.
 *
 * ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * The MIT License (MIT) (for arrow-right and download)
 *
 * Copyright (c) 2013-present Cole Bemis
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

/** One element of an icon: its tag and attributes, in the order of Lucide's file. */
export type IconElement = readonly [tag: 'path' | 'rect' | 'circle' | 'line' | 'polyline', attrs: Readonly<Record<string, string>>];

const p = (d: string): IconElement => ['path', { d }];

export const ICONS = {
  archive: [['rect', { width: '20', height: '5', x: '2', y: '3', rx: '1' }], p('M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8'), p('M10 12h4')],
  'arrow-right': [p('M5 12h14'), p('m12 5 7 7-7 7')],
  bell: [p('M10.268 21a2 2 0 0 0 3.464 0'), p('M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326')],
  download: [p('M12 15V3'), p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), p('m7 10 5 5 5-5')],
  'folder-open': [p('m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2')],
  globe: [['circle', { cx: '12', cy: '12', r: '10' }], p('M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'), p('M2 12h20')],
  house: [p('M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'), p('M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')],
  rss: [p('M4 11a9 9 0 0 1 9 9'), p('M4 4a16 16 0 0 1 16 16'), ['circle', { cx: '5', cy: '19', r: '1' }]],
  server: [['rect', { width: '20', height: '8', x: '2', y: '2', rx: '2', ry: '2' }], ['rect', { width: '20', height: '8', x: '2', y: '14', rx: '2', ry: '2' }], ['line', { 'x1': '6', 'x2': '6.01', 'y1': '6', 'y2': '6' }], ['line', { 'x1': '6', 'x2': '6.01', 'y1': '18', 'y2': '18' }]],
  smartphone: [['rect', { width: '14', height: '20', x: '5', y: '2', rx: '2', ry: '2' }], p('M12 18h.01')],
  sparkles: [p('M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'), p('M20 2v4'), p('M22 4h-4'), ['circle', { cx: '4', cy: '20', r: '2' }]],
  'trending-up': [p('M16 7h6v6'), p('m22 7-8.5 8.5-5-5L2 17')],
} as const satisfies Record<string, readonly IconElement[]>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
