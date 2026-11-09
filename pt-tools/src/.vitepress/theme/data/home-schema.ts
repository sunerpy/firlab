/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in pt-tools (`docs/index.md`, `docs/en/index.md`); the components that
 * lay them out live here. This file is the contract between the two: `config/shared.ts`
 * runs `validateHome` on both pages at build time, so a missing or misspelt field fails
 * the build instead of rendering an empty band. pt-tools' `docs/README.md` documents
 * the same fields for authors.
 *
 * Two layouts are accepted. The 2026-11 one (design A, DESIGN.md §12 and §18) is told apart by
 * its `stages` band, and its bands draw only on a page that carries it (`useHomeV2`). The
 * 2026-09 one keeps building, so an older pt-tools checkout still syncs and builds.
 */
import { ICON_NAMES, type IconName } from './icons';

export type { IconName } from './icons';

/**
 * Maturity. `experimental` is what Voltip's site does not need: a feature that ships but
 * has not been verified end to end (pt-tools' WeCom and generic webhook channels).
 * `preview` is shipped in the 1.0 preview releases (v1.0.0-rc.N) and not yet in a stable one.
 */
export type Status = 'available' | 'preview' | 'experimental' | 'building' | 'planned';
export const STATUSES: readonly Status[] = ['available', 'preview', 'experimental', 'building', 'planned'];

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

export interface Visual {
  /** The web UI on a desktop, the hero's main capture. */
  desktop: Shot;
  /** The same product on a phone, laid over the desktop capture's corner. */
  mobile?: Shot;
}

export interface IndexItem {
  title: string;
  body: string;
  status: Status;
  link?: string;
}

export interface HomeV1 {
  facts: Fact[];
  visual: Visual;
  index: { title: string; intro?: string; groups: { name: string; items: IndexItem[] }[] };
  steps: { title: string; items: { title: string; body: string; command?: string }[] };
  /** Filter-rule examples for the RSS split: what a rule says and what it matches. */
  rules: {
    columns: string[];
    rows: { pattern: string; kind: string; matches: string }[];
    caption?: string;
  };
  /** Chat commands for the ChatOps split. */
  commands: { items: { command: string; body: string }[]; caption?: string };
  /** Captures a `<SplitBlock proof="screen" shot="…">` refers to by key. */
  shots: Record<string, Shot>;
  deploy: {
    title: string;
    intro?: string;
    columns: string[];
    rows: { name: string; status: Status; cells: string[] }[];
    note?: string;
  };
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

/** The 2026-09 layout's name, kept for the components written for it. */
export type Home = HomeV1;

// ---- The 2026-11 layout (design A) ---------------------------------------------------------

/**
 * A screenshot in `public/screens/`, as `/screens/<name>.webp`. `dark` is the same view in the
 * dark theme; only the one matching the site's theme shows.
 */
export interface Screen {
  src: string;
  dark?: string;
  width: number;
  height: number;
  alt: string;
}

/** A line that leads to the guide page covering a band or an answer. */
export interface Guide {
  text: string;
  link: string;
}

/** The one piece of evidence a capability shows: a line of the real interface, or names. */
export type Evidence = { kind: 'code'; text: string } | { kind: 'chips'; items: string[] };
export const EVIDENCE_KINDS = ['code', 'chips'] as const;

export interface Capability {
  icon: IconName;
  title: string;
  status: Status;
  body: string;
  evidence: Evidence;
  link: string;
  /** Takes two of the three columns from 1100 px. */
  wide?: boolean;
}

export interface Showcase {
  title: string;
  intro: string;
  screen: Screen;
  caption?: string;
  points: { title: string; body: string }[];
  guide?: Guide;
}

export type ButtonTheme = 'brand' | 'alt';
export const BUTTON_THEMES: readonly ButtonTheme[] = ['brand', 'alt'];

export interface HomeV2 {
  /** The short facts under the hero's buttons, one line each. */
  facts: Fact[];
  /** Under the hero: a show followed in pt-tools, then its new episode organized into the library. */
  stages: { steps: [string, string]; screens: [Screen, Screen]; caption: string };
  capabilities: { title: string; intro?: string; items: Capability[] };
  showcases: Showcase[];
  /** How to run it; the page's own Markdown (the install commands) goes in HomeDeploy's slot. */
  deploy: HomeV1['deploy'] & { guide?: Guide };
  privacy: HomeV1['privacy'];
  faq: { title: string; intro?: string; items: { q: string; a: string; guide?: Guide }[] };
  /** The last band; the page's own Markdown (community links, the QR code) goes in its slot. */
  closer: {
    title: string;
    body: string;
    actions: { text: string; link: string; theme: ButtonTheme; icon?: IconName }[];
  };
}

/** Whether a page's `home:` frontmatter is in the 2026-11 layout: only that one has `stages`. */
export function isV2(home: unknown): home is HomeV2 {
  return typeof home === 'object' && home !== null && 'stages' in home;
}

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

const status: Check = (v, path, problems) => {
  if (!STATUSES.includes(v as Status)) problems.push(`${path}: expected one of ${STATUSES.join(', ')}`);
};

const list =
  (item: Check, min = 1, max = Infinity): Check =>
  (v, path, problems) => {
    if (!Array.isArray(v) || v.length < min || v.length > max) {
      const count = max === Infinity ? `at least ${min}` : min === max ? `exactly ${min}` : `${min} to ${max}`;
      problems.push(`${path}: expected a list with ${count} item(s)`);
      return;
    }
    v.forEach((entry, i) => item(entry, `${path}[${i}]`, problems));
  };

const oneOf =
  (values: readonly string[], optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (!values.includes(v as string)) problems.push(`${path}: expected one of ${values.join(', ')}`);
  };

const bool =
  (optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (typeof v !== 'boolean') problems.push(`${path}: expected true or false`);
  };

const size: Check = (v, path, problems) => {
  if (typeof v !== 'number' || !Number.isInteger(v) || v <= 0) problems.push(`${path}: expected a positive whole number of pixels`);
};

/** A link a component makes: a page of the site (`/guide/…`, with an optional `#anchor`) or a web address. */
const link =
  (optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (typeof v !== 'string' || !/^(\/[^\s]*|https:\/\/[^\s]+)$/.test(v) || /\.md(#|$)/.test(v)) {
      problems.push(`${path}: expected a site path such as /guide/install, or an https:// address`);
    }
  };

/** A screenshot's path: a file of `public/screens/`, named in lower-case letters, digits and hyphens. */
const screenPath =
  (optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (typeof v !== 'string' || !/^\/screens\/[a-z0-9-]+\.webp$/.test(v)) {
      problems.push(`${path}: expected /screens/<name>.webp, a file of public/screens/`);
    }
  };

const obj =
  (fields: Record<string, Check>, optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
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

/** An object whose keys are names chosen by the author and whose values all match `item`. */
const record =
  (item: Check, min = 1): Check =>
  (v, path, problems) => {
    if (typeof v !== 'object' || v === null || Array.isArray(v) || Object.keys(v).length < min) {
      problems.push(`${path}: expected an object with at least ${min} entry(ies)`);
      return;
    }
    for (const [key, entry] of Object.entries(v as Record<string, unknown>)) item(entry, `${path}.${key}`, problems);
  };

const shotFields = { light: str(), dark: str(), width: num, height: num, alt: str() };
const shot = obj(shotFields);

const deployFields = {
  title: str(),
  intro: str(true),
  columns: list(str(), 2),
  rows: list(obj({ name: str(), status, cells: list(str()) })),
  note: str(true),
};

const privacy = obj({
  title: str(),
  intro: str(true),
  sendsLabel: str(),
  modes: list(obj({ name: str(), sends: str(), detail: str() })),
});

const HOME_V1: Check = obj({
  facts: list(obj({ term: str(), text: str() }), 2),
  visual: obj({ desktop: shot, mobile: obj(shotFields, true) }),
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
    items: list(obj({ title: str(), body: str(), command: str(true) }), 2),
  }),
  rules: obj({
    columns: list(str(), 3),
    rows: list(obj({ pattern: str(), kind: str(), matches: str() })),
    caption: str(true),
  }),
  commands: obj({
    items: list(obj({ command: str(), body: str() }), 2),
    caption: str(true),
  }),
  shots: record(shot),
  deploy: obj(deployFields),
  privacy,
  roadmap: obj({
    title: str(),
    intro: str(true),
    items: list(obj({ title: str(), body: str(), status })),
    notPlanned: obj({ title: str(), items: list(str()) }),
  }),
});

const screen = obj({ src: screenPath(), dark: screenPath(true), width: size, height: size, alt: str() });
const guide = (optional = false) => obj({ text: str(), link: link() }, optional);

/** `code` with its line, or `chips` with names: the fields of one kind, and only those. */
const evidence: Check = (v, path, problems) => {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    problems.push(`${path}: expected an object`);
    return;
  }
  const record = v as Record<string, unknown>;
  if (record.kind === 'code') obj({ kind: str(), text: str() })(v, path, problems);
  else if (record.kind === 'chips') obj({ kind: str(), items: list(str()) })(v, path, problems);
  else problems.push(`${path}.kind: expected one of ${EVIDENCE_KINDS.join(', ')}`);
};

const HOME_V2: Check = obj({
  facts: list(obj({ term: str(), text: str() }), 2, 4),
  stages: obj({
    steps: list(str(), 2, 2),
    screens: list(screen, 2, 2),
    caption: str(),
  }),
  capabilities: obj({
    title: str(),
    intro: str(true),
    items: list(
      obj({ icon: oneOf(ICON_NAMES), title: str(), status, body: str(), evidence, link: link(), wide: bool(true) }),
      6,
    ),
  }),
  showcases: list(
    obj({
      title: str(),
      intro: str(),
      screen,
      caption: str(true),
      points: list(obj({ title: str(), body: str() }), 2, 4),
      guide: guide(true),
    }),
    2,
  ),
  deploy: obj({ ...deployFields, guide: guide(true) }),
  privacy,
  faq: obj({
    title: str(),
    intro: str(true),
    items: list(obj({ q: str(), a: str(), guide: guide(true) }), 4),
  }),
  closer: obj({
    title: str(),
    body: str(),
    actions: list(obj({ text: str(), link: link(), theme: oneOf(BUTTON_THEMES), icon: oneOf(ICON_NAMES, true) })),
  }),
});

/** The deploy table's rows have one cell per column after the name column. */
function checkDeploy(deploy: HomeV1['deploy'] | undefined, problems: string[]): void {
  deploy?.rows?.forEach?.((row, i) => {
    if (Array.isArray(row?.cells) && Array.isArray(deploy.columns) && row.cells.length !== deploy.columns.length - 1) {
      problems.push(`home.deploy.rows[${i}].cells: expected ${deploy.columns.length - 1} cells, one per column after the first`);
    }
  });
}

/**
 * Every Markdown link inside the words: only web addresses may sit there. A page of the site goes
 * in a `link` or a `guide` field, where the build checks it and where GitHub, which shows the
 * page's frontmatter as a table, does not read it as a broken Markdown link.
 */
function checkProse(value: unknown, path: string, problems: string[]): void {
  if (typeof value === 'string') {
    for (const [, target] of value.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
      if (!target?.startsWith('https://')) {
        problems.push(`${path}: the link to ${target} belongs in a link or guide field; only https:// links may sit in the words`);
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => checkProse(item, `${path}[${i}]`, problems));
  } else if (typeof value === 'object' && value !== null) {
    for (const [key, item] of Object.entries(value)) checkProse(item, `${path}.${key}`, problems);
  }
}

/** Throws, listing every problem at once, when `frontmatter.home` matches neither layout. */
export function validateHome(page: string, frontmatter: Record<string, unknown>): void {
  const problems: string[] = [];
  const raw = frontmatter.home;
  let layout: string;
  if (isV2(raw)) {
    layout = 'the 2026-11 layout (HomeV2)';
    HOME_V2(raw, 'home', problems);
    checkDeploy((raw as Partial<HomeV2>).deploy, problems);
    checkProse(raw, 'home', problems);
  } else {
    layout = 'the 2026-09 layout (HomeV1)';
    HOME_V1(raw, 'home', problems);
    const home = raw as Partial<HomeV1> | undefined;
    checkDeploy(home?.deploy, problems);
    // The rule table has exactly the three columns its rows fill.
    if (Array.isArray(home?.rules?.columns) && home.rules.columns.length !== 3) {
      problems.push('home.rules.columns: expected exactly 3 columns (pattern, kind, matches)');
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `${page}: the home frontmatter does not match ${layout} of theme/data/home-schema.ts\n  ${problems.join('\n  ')}`,
    );
  }
}
