/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in voltip (`docs/site/index.md`, `docs/site/zh/index.md`); the
 * components that lay them out live here. This file is the contract between the
 * two: `config/shared.ts` runs `validateHome` on both pages at build time, so a
 * missing or misspelt field fails the build instead of rendering an empty band.
 * voltip's `docs/site/README.md` documents the same fields for authors.
 */

export type Status = 'available' | 'building' | 'planned';
export const STATUSES: readonly Status[] = ['available', 'building', 'planned'];

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

export interface Home {
  facts: Fact[];
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
  platforms: {
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

const shot = obj({ light: str(), dark: str(), width: num, height: num, alt: str() });

const HOME: Check = obj({
  facts: list(obj({ term: str(), text: str() }), 2),
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

/** Throws, listing every problem at once, when `frontmatter.home` does not match {@link Home}. */
export function validateHome(page: string, frontmatter: Record<string, unknown>): void {
  const problems: string[] = [];
  HOME(frontmatter.home, 'home', problems);
  const home = frontmatter.home as Home | undefined;
  // The platform table's rows must have one cell per column after the name column.
  home?.platforms?.rows?.forEach((row, i) => {
    if (Array.isArray(row?.cells) && Array.isArray(home.platforms.columns) && row.cells.length !== home.platforms.columns.length - 1) {
      problems.push(`home.platforms.rows[${i}].cells: expected ${home.platforms.columns.length - 1} cells, one per column after the first`);
    }
  });
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
