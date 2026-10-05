/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in winer (`docs/site/index.md`, `docs/site/en/index.md`); the components that
 * lay them out live here. This file is the contract between the two: `config/shared.ts` runs
 * `validateHome` on both pages at build time, so a missing or misspelt field fails the build
 * instead of rendering an empty band. winer's `docs/site/README.md` lists the same fields for
 * authors.
 */

/** Maturity, always written as text, never colour alone. */
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
  /** Captures a `<SplitBlock shot="…">` refers to by key. */
  shots: Record<string, Shot>;
  privacy: {
    title: string;
    intro?: string;
    sendsLabel: string;
    modes: { name: string; sends: string; detail: string }[];
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
  visual: obj({ desktop: shot }),
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
  shots: record(shot),
  privacy: obj({
    title: str(),
    intro: str(true),
    sendsLabel: str(),
    modes: list(obj({ name: str(), sends: str(), detail: str() })),
  }),
});

/** Throws, listing every problem at once, when `frontmatter.home` does not match {@link Home}. */
export function validateHome(page: string, frontmatter: Record<string, unknown>): void {
  const problems: string[] = [];
  HOME(frontmatter.home, 'home', problems);
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
