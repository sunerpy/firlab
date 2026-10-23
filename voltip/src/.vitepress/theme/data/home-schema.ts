/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in voltip (`docs/site/index.md`, `docs/site/zh/index.md`); the
 * components that lay them out live here. This file is the contract between the
 * two: `config/shared.ts` runs `validateHome` on both pages at build time, so a
 * missing or misspelt field fails the build instead of rendering an empty band.
 * voltip's `docs/site/README.md` documents the same fields for authors.
 *
 * Two layouts are accepted while the pages move from one to the other. The 2026-09 layout
 * (`HomeV1`: a capture of the app beside the hero, then the feature index, the steps and
 * three text-and-proof splits) and the 2026-10 layout (`HomeV2`, design A of 2026-10-22:
 * a dictation scene beside the hero, then bands of before-and-after examples, presets,
 * recognition modes, the phone, platforms and questions). A page carrying `scene` is
 * checked against the second, any other page against the first; each is strict, so a
 * page cannot mix the two.
 */

export type Status = 'available' | 'building' | 'planned';
export const STATUSES: readonly Status[] = ['available', 'building', 'planned'];

/** The icons `VtIcon.vue` draws; the names a page may give an `icon` field. */
export const ICONS = [
  'mic',
  'download',
  'check',
  'arrow',
  'down',
  'chevron',
  'cpu',
  'cloud',
  'key',
  'server',
  'shield',
  'qr',
  'keyboard',
  'history',
  'relay',
  'wand',
  'plug',
  'github',
] as const;
export type IconName = (typeof ICONS)[number];

/** The vendor marks `ProviderMark.vue` draws, all in the text colour. */
export const MARKS = ['openai', 'groq', 'google', 'siliconflow', 'aliyun', 'deepseek', 'ollama'] as const;
export type MarkName = (typeof MARKS)[number];

// ---- Shared ----------------------------------------------------------------------------

export interface Fact {
  term: string;
  text: string;
}

export interface Shot {
  light: string;
  dark: string;
  width: number;
  height: number;
  alt: string;
}

/** One image, or a pair: `dark` is the same view in the dark theme. */
export interface Img {
  src: string;
  dark?: string;
  width: number;
  height: number;
  alt: string;
}

/** The band under the hero that leads to the try page: what it offers, a heard → polished
 *  sample, and the button. Optional in both layouts. */
export interface TryBand {
  title: string;
  body: string;
  heard: string;
  polished: string;
  action: { text: string; link: string };
}

export interface Term {
  term: string;
  text: string;
}

// ---- The 2026-09 layout ------------------------------------------------------------------

export interface Visual {
  home: Shot;
  /** The overlay in its three states, shown in turn over the home screenshot. */
  pill: Shot[];
}

export interface IndexItem {
  title: string;
  body: string;
  status: Status;
  link?: string;
}

export interface PlatformTable {
  title: string;
  intro?: string;
  columns: string[];
  rows: { name: string; status: Status; cells: string[] }[];
  note?: string;
}

export interface HomeV1 {
  facts: Fact[];
  try?: TryBand;
  visual: Visual;
  index: { title: string; intro?: string; groups: { name: string; items: IndexItem[] }[] };
  steps: { title: string; items: { title: string; body: string; keys?: string[] }[] };
  models: {
    columns: string[];
    rows: { name: string; size: string; languages: string; device: string; note?: string }[];
    caption?: string;
  };
  polish: {
    heardLabel: string;
    heard: string;
    typedLabel: string;
    typed: string;
    caption?: string;
  };
  phone: { items: { title: string; body: string }[] };
  platforms: PlatformTable;
  privacy: {
    title: string;
    intro?: string;
    sendsLabel: string;
    modes: { name: string; sends: string; detail: string }[];
  };
  roadmap: {
    title: string;
    intro?: string;
    items: { title: string; body: string; status: Status }[];
    notPlanned: { title: string; items: string[] };
  };
}

// ---- The 2026-10 layout -------------------------------------------------------------------
// Text fields marked "inline" may carry ~~struck words~~, [a link](/path) and line breaks
// (components/inline.ts); everything else is plain text.

/** One real dictation beside the hero: the overlay while speaking, the inserted text, and
 *  the overlay after it went in. */
export interface Scene {
  /** What to do at each of the two stages: speak, then release. */
  steps: string[];
  live: Img;
  /** The label of the card that holds the inserted text. */
  label: string;
  result: string;
  inserted: Img;
  caption: string;
}

export interface Pair {
  /** `dictation`: what was said and what was inserted. `edit`: a voice edit, the instruction
   *  said over a selection and what replaced it. */
  kind: 'dictation' | 'edit';
  /** Whether `result` is a recorded output or a written illustration. */
  source: 'actual' | 'example';
  /** inline: the words said, with what polish dropped struck through. */
  said: string;
  /** edit only: the selected text. */
  selection?: string;
  result: string;
}

export interface Pairs {
  title: string;
  intro?: string;
  labels: {
    said: string;
    inserted: string;
    edit: string;
    selection: string;
    replaced: string;
    actual: string;
    example: string;
  };
  items: Pair[];
  note?: string;
}

export interface Presets {
  title: string;
  intro: string;
  points?: string[];
  saidLabel: string;
  said: string;
  outputs: { name: string; desc: string; text: string }[];
  note?: string;
  scenes?: { title: string; note?: string; items: { name: string; body: string; preset: string }[] };
}

export interface Chip {
  name: string;
  mark?: MarkName;
  icon?: IconName;
}

export interface Mode {
  icon: IconName;
  label: string;
  badge?: string;
  title: string;
  /** The small diagram: you speak → where the speech is recognised. `local` puts both ends
   *  inside the box labelled with `Modes.scope`. */
  flow: { from: string; to: string; icon: IconName; local: boolean };
  assure: string;
  specs: Term[];
  chipsLabel: string;
  chips: Chip[];
}

export interface Modes {
  title: string;
  intro?: string;
  /** The label of the dashed box around what runs on the computer. */
  scope: string;
  items: Mode[];
  polish?: { title: string; body: string; marks: { name: string; mark: MarkName }[] };
  /** inline */
  note?: string;
}

export interface PhoneV2 {
  title: string;
  intro: string;
  items: { icon: IconName; title: string; body: string }[];
  figure: { back: Img; front: Img; caption?: string };
  /** inline: a line of links under the items. */
  links?: string;
}

export interface PlatformCards {
  title: string;
  intro?: string;
  cards: { name: string; status: Status; specs: Term[] }[];
  /** inline: the line under the install commands, which are the page's own Markdown. */
  install?: string;
  note?: string;
}

export interface Faq {
  title: string;
  /** inline */
  intro?: string;
  /** `a` is inline. */
  items: { q: string; a: string }[];
}

export interface Closer {
  title: string;
  body?: string;
  actions: { text: string; link: string; theme: 'brand' | 'alt'; icon?: IconName }[];
}

export interface HomeV2 {
  /** The short lines under the hero's buttons. */
  checks: string[];
  try?: TryBand;
  scene: Scene;
  pairs: Pairs;
  presets: Presets;
  modes: Modes;
  phone: PhoneV2;
  platforms: PlatformCards;
  faq: Faq;
  closer: Closer;
}

export type Home = HomeV1 | HomeV2;

/** Whether a page uses the 2026-10 layout. */
export function isV2(home: unknown): home is HomeV2 {
  return typeof home === 'object' && home !== null && 'scene' in home;
}

// ---- Checks ------------------------------------------------------------------------------

type Check = (value: unknown, path: string, problems: string[]) => void;

const str =
  (optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (typeof v !== 'string' || v.trim() === '') problems.push(`${path}: expected a non-empty string`);
  };

const num: Check = (v, path, problems) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) problems.push(`${path}: expected a positive number`);
};

const bool: Check = (v, path, problems) => {
  if (typeof v !== 'boolean') problems.push(`${path}: expected true or false`);
};

const oneOf =
  (values: readonly string[], optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (!values.includes(v as string)) problems.push(`${path}: expected one of ${values.join(', ')}`);
  };

const status = oneOf(STATUSES);

const list =
  (item: Check, min = 1): Check =>
  (v, path, problems) => {
    if (!Array.isArray(v) || v.length < min) {
      problems.push(`${path}: expected a list with at least ${min} item(s)`);
      return;
    }
    v.forEach((entry, i) => item(entry, `${path}[${i}]`, problems));
  };

const optionalList =
  (item: Check): Check =>
  (v, path, problems) => {
    if (v === undefined) return;
    list(item, 1)(v, path, problems);
  };

const obj =
  (fields: Record<string, Check>): Check =>
  (v, path, problems) => {
    if (typeof v !== 'object' || v === null || Array.isArray(v)) {
      problems.push(`${path}: expected an object`);
      return;
    }
    const record = v as Record<string, unknown>;
    for (const [key, check] of Object.entries(fields)) check(record[key], `${path}.${key}`, problems);
    for (const key of Object.keys(record)) {
      if (!(key in fields)) problems.push(`${path}.${key}: unknown field`);
    }
  };

const optional =
  (check: Check): Check =>
  (v, path, problems) => {
    if (v !== undefined) check(v, path, problems);
  };

const shot = obj({ light: str(), dark: str(), width: num, height: num, alt: str() });
const img = obj({ src: str(), dark: str(true), width: num, height: num, alt: str() });
const term = obj({ term: str(), text: str() });

const TRY: Check = optional(
  obj({
    title: str(),
    body: str(),
    heard: str(),
    polished: str(),
    action: obj({ text: str(), link: str() }),
  }),
);

const HOME_V1: Check = obj({
  facts: list(obj({ term: str(), text: str() }), 2),
  try: TRY,
  visual: obj({ home: shot, pill: list(shot, 1) }),
  index: obj({
    title: str(),
    intro: str(true),
    groups: list(
      obj({
        name: str(),
        items: list(obj({ title: str(), body: str(), status, link: str(true) })),
      }),
    ),
  }),
  steps: obj({
    title: str(),
    items: list(obj({ title: str(), body: str(), keys: optionalList(str()) }), 2),
  }),
  models: obj({
    columns: list(str(), 4),
    rows: list(
      obj({ name: str(), size: str(), languages: str(), device: str(), note: str(true) }),
    ),
    caption: str(true),
  }),
  polish: obj({
    heardLabel: str(),
    heard: str(),
    typedLabel: str(),
    typed: str(),
    caption: str(true),
  }),
  phone: obj({ items: list(obj({ title: str(), body: str() })) }),
  platforms: obj({
    title: str(),
    intro: str(true),
    columns: list(str(), 2),
    rows: list(obj({ name: str(), status, cells: list(str()) })),
    note: str(true),
  }),
  privacy: obj({
    title: str(),
    intro: str(true),
    sendsLabel: str(),
    modes: list(obj({ name: str(), sends: str(), detail: str() })),
  }),
  roadmap: obj({
    title: str(),
    intro: str(true),
    items: list(obj({ title: str(), body: str(), status })),
    notPlanned: obj({ title: str(), items: list(str()) }),
  }),
});

const icon = oneOf(ICONS);
const mark = oneOf(MARKS);

const HOME_V2: Check = obj({
  checks: list(str(), 2),
  try: TRY,
  scene: obj({
    steps: list(str(), 2),
    live: img,
    label: str(),
    result: str(),
    inserted: img,
    caption: str(),
  }),
  pairs: obj({
    title: str(),
    intro: str(true),
    labels: obj({
      said: str(),
      inserted: str(),
      edit: str(),
      selection: str(),
      replaced: str(),
      actual: str(),
      example: str(),
    }),
    items: list(
      obj({
        kind: oneOf(['dictation', 'edit']),
        source: oneOf(['actual', 'example']),
        said: str(),
        selection: str(true),
        result: str(),
      }),
    ),
    note: str(true),
  }),
  presets: obj({
    title: str(),
    intro: str(),
    points: optionalList(str()),
    saidLabel: str(),
    said: str(),
    outputs: list(obj({ name: str(), desc: str(), text: str() }), 2),
    note: str(true),
    scenes: optional(
      obj({
        title: str(),
        note: str(true),
        items: list(obj({ name: str(), body: str(), preset: str() })),
      }),
    ),
  }),
  modes: obj({
    title: str(),
    intro: str(true),
    scope: str(),
    items: list(
      obj({
        icon,
        label: str(),
        badge: str(true),
        title: str(),
        flow: obj({ from: str(), to: str(), icon, local: bool }),
        assure: str(),
        specs: list(term),
        chipsLabel: str(),
        chips: list(obj({ name: str(), mark: oneOf(MARKS, true), icon: oneOf(ICONS, true) })),
      }),
    ),
    polish: optional(
      obj({ title: str(), body: str(), marks: list(obj({ name: str(), mark })) }),
    ),
    note: str(true),
  }),
  phone: obj({
    title: str(),
    intro: str(),
    items: list(obj({ icon, title: str(), body: str() })),
    figure: obj({ back: img, front: img, caption: str(true) }),
    links: str(true),
  }),
  platforms: obj({
    title: str(),
    intro: str(true),
    cards: list(obj({ name: str(), status, specs: list(term) })),
    install: str(true),
    note: str(true),
  }),
  faq: obj({
    title: str(),
    intro: str(true),
    items: list(obj({ q: str(), a: str() })),
  }),
  closer: obj({
    title: str(),
    body: str(true),
    actions: list(obj({ text: str(), link: str(), theme: oneOf(['brand', 'alt']), icon: oneOf(ICONS, true) })),
  }),
});

/** Throws, listing every problem at once, when `frontmatter.home` does not match {@link Home}. */
export function validateHome(page: string, frontmatter: Record<string, unknown>): void {
  const problems: string[] = [];
  const raw = frontmatter.home;
  if (isV2(raw)) {
    HOME_V2(raw, 'home', problems);
    // A voice edit has a selection to act on; a dictation has none.
    raw.pairs?.items?.forEach((pair, i) => {
      if (pair?.kind === 'edit' && pair.selection === undefined) {
        problems.push(`home.pairs.items[${i}].selection: a voice edit needs the selected text`);
      }
      if (pair?.kind === 'dictation' && pair.selection !== undefined) {
        problems.push(`home.pairs.items[${i}].selection: only a voice edit has a selection`);
      }
    });
    // A chip shows a vendor's mark or one of the site's icons, not both.
    raw.modes?.items?.forEach((mode, i) =>
      mode?.chips?.forEach((chip, j) => {
        if (chip?.mark !== undefined && chip?.icon !== undefined) {
          problems.push(`home.modes.items[${i}].chips[${j}]: give a mark or an icon, not both`);
        }
      }),
    );
  } else {
    HOME_V1(raw, 'home', problems);
    const home = raw as HomeV1 | undefined;
    // The platform table's rows must have one cell per column after the name column.
    home?.platforms?.rows?.forEach((row, i) => {
      if (Array.isArray(row?.cells) && Array.isArray(home.platforms.columns) && row.cells.length !== home.platforms.columns.length - 1) {
        problems.push(`home.platforms.rows[${i}].cells: expected ${home.platforms.columns.length - 1} cells, one per column after the first`);
      }
    });
  }
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
