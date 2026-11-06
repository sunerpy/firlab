/**
 * The home page's line icons (GmIcon.vue): Lucide 1.70.0 (https://lucide.dev), the elements of
 * each icon's file in the repository at tag 1.70.0 (`icons/<name>.svg`), copied as they are, on
 * Lucide's 24 × 24 grid. GmIcon draws them with a 1.8 px stroke instead of Lucide's 2, as the
 * Voltip site's icons are (DESIGN.md §10, §18). They are decorative: the words beside each icon
 * carry the meaning.
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
  'app-window': [
    ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }],
    p('M10 4v4'),
    p('M2 8h20'),
    p('M6 4v4'),
  ],
  'arrow-right': [p('M5 12h14'), p('m12 5 7 7-7 7')],
  bug: [
    p('M12 20v-9'),
    p('M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z'),
    p('M14.12 3.88 16 2'),
    p('M21 21a4 4 0 0 0-3.81-4'),
    p('M21 5a4 4 0 0 1-3.55 3.97'),
    p('M22 13h-4'),
    p('M3 21a4 4 0 0 1 3.81-4'),
    p('M3 5a4 4 0 0 0 3.55 3.97'),
    p('M6 13H2'),
    p('m8 2 1.88 1.88'),
    p('M9 7.13V6a3 3 0 1 1 6 0v1.13'),
  ],
  cpu: [
    p('M12 20v2'),
    p('M12 2v2'),
    p('M17 20v2'),
    p('M17 2v2'),
    p('M2 12h2'),
    p('M2 17h2'),
    p('M2 7h2'),
    p('M20 12h2'),
    p('M20 17h2'),
    p('M20 7h2'),
    p('M7 20v2'),
    p('M7 2v2'),
    ['rect', { x: '4', y: '4', width: '16', height: '16', rx: '2' }],
    ['rect', { x: '8', y: '8', width: '8', height: '8', rx: '1' }],
  ],
  download: [p('M12 15V3'), p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), p('m7 10 5 5 5-5')],
  'file-pen-line': [
    p(
      'M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z',
    ),
    p('M14.487 7.858A1 1 0 0 1 14 7V2'),
    p('M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516'),
    p('M8 18h1'),
  ],
  'gamepad-2': [
    ['line', { x1: '6', x2: '10', y1: '11', y2: '11' }],
    ['line', { x1: '8', x2: '8', y1: '9', y2: '13' }],
    ['line', { x1: '15', x2: '15.01', y1: '12', y2: '12' }],
    ['line', { x1: '18', x2: '18.01', y1: '10', y2: '10' }],
    p(
      'M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z',
    ),
  ],
  'mouse-pointer-click': [
    p('M14 4.1 12 6'),
    p('m5.1 8-2.9-.8'),
    p('m6 12-1.9 2'),
    p('M7.2 2.2 8 5.1'),
    p('M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z'),
  ],
  package: [
    p('M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z'),
    p('M12 22V12'),
    ['polyline', { points: '3.29 7 12 12 20.71 7' }],
    p('m7.5 4.27 9 5.15'),
  ],
  'scan-search': [
    p('M3 7V5a2 2 0 0 1 2-2h2'),
    p('M17 3h2a2 2 0 0 1 2 2v2'),
    p('M21 17v2a2 2 0 0 1-2 2h-2'),
    p('M7 21H5a2 2 0 0 1-2-2v-2'),
    ['circle', { cx: '12', cy: '12', r: '3' }],
    p('m16 16-1.9-1.9'),
  ],
  'square-terminal': [
    p('m7 11 2-2-2-2'),
    p('M11 13h4'),
    ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', ry: '2' }],
  ],
} as const satisfies Record<string, readonly IconElement[]>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
