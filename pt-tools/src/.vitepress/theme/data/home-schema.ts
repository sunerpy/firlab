/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in pt-tools (`docs/index.md`, `docs/en/index.md`); the components that
 * lay them out live here. This file is the contract between the two: `config/shared.ts`
 * runs `validateHome` on both pages at build time, so a missing or misspelt field fails
 * the build instead of rendering an empty band. pt-tools' `docs/README.md` documents
 * the same fields for authors.
 */

/**
 * Maturity. `experimental` is what Voltip's site does not need: a feature that ships but
 * has not been verified end to end (pt-tools' WeCom and generic webhook channels).
 */
export type Status = 'available' | 'experimental' | 'building' | 'planned';
export const STATUSES: readonly Status[] = ['available', 'experimental', 'building', 'planned'];

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

export interface Home {
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
  (item: Check, min = 1): Check =>
  (v, path, problems) => {
    if (!Array.isArray(v) || v.length < min) {
      problems.push(`${path}: expected a list with at least ${min} item(s)`);
      return;
    }
    v.forEach((entry, i) => item(entry, `${path}[${i}]`, problems));
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

const HOME: Check = obj({
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
  deploy: obj({
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

/** Throws, listing every problem at once, when `frontmatter.home` does not match {@link Home}. */
export function validateHome(page: string, frontmatter: Record<string, unknown>): void {
  const problems: string[] = [];
  HOME(frontmatter.home, 'home', problems);
  const home = frontmatter.home as Home | undefined;
  // The deploy table's rows must have one cell per column after the name column.
  home?.deploy?.rows?.forEach((row, i) => {
    if (Array.isArray(row?.cells) && Array.isArray(home.deploy.columns) && row.cells.length !== home.deploy.columns.length - 1) {
      problems.push(`home.deploy.rows[${i}].cells: expected ${home.deploy.columns.length - 1} cells, one per column after the first`);
    }
  });
  // The rule table has exactly the three columns its rows fill.
  if (Array.isArray(home?.rules?.columns) && home.rules.columns.length !== 3) {
    problems.push('home.rules.columns: expected exactly 3 columns (pattern, kind, matches)');
  }
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
