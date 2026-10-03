/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in codegraph-rust (`docs/site/index.md`, `docs/site/en/index.md`); the
 * components that lay them out live here. This file is the contract between the two:
 * `config/shared.ts` runs `validateHome` on both pages at build time, so a missing or misspelt
 * field fails the build instead of rendering an empty band. codegraph-rust's
 * `docs/site/README.md` documents the same fields for authors.
 */

/**
 * Release state. `preview` is a feature that ships but is switched off unless the reader turns
 * it on and may still change: CodeGraph's browser viewer, behind `CODEGRAPH_UI=1`.
 */
export type Status = 'available' | 'preview';
export const STATUSES: readonly Status[] = ['available', 'preview'];

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
  /** The hero's capture of the browser viewer. */
  desktop: Shot;
  /** A phone capture laid over its corner; CodeGraph's home page does not use one. */
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
  /** The agent split's evidence: a question, its command and its MCP tool. */
  tools: {
    columns: string[];
    rows: { question: string; cli: string; mcp: string }[];
    caption?: string;
  };
  /** Captures a `<SplitBlock proof="screen" shot="…">` refers to by key. */
  shots: Record<string, Shot>;
  /** The language split's evidence: an extraction depth, what it extracts and its members. */
  languages: {
    columns: string[];
    rows: { depth: string; extracted: string; members: string }[];
    caption?: string;
  };
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
  /** What CodeGraph deliberately does not do. */
  scope: { title: string; intro?: string; items: string[] };
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
  tools: obj({
    columns: list(str(), 3),
    rows: list(obj({ question: str(), cli: str(), mcp: str() }), 2),
    caption: str(true),
  }),
  shots: record(shot),
  languages: obj({
    columns: list(str(), 3),
    rows: list(obj({ depth: str(), extracted: str(), members: str() })),
    caption: str(true),
  }),
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
  scope: obj({
    title: str(),
    intro: str(true),
    items: list(str(), 2),
  }),
});

/** Throws, listing every problem at once, when `frontmatter.home` does not match {@link Home}. */
export function validateHome(page: string, frontmatter: Record<string, unknown>): void {
  const problems: string[] = [];
  HOME(frontmatter.home, 'home', problems);
  const home = frontmatter.home as Home | undefined;
  // The platform table's rows must have one cell per column after the name column.
  home?.platforms?.rows?.forEach((row, i) => {
    if (
      Array.isArray(row?.cells) &&
      Array.isArray(home.platforms.columns) &&
      row.cells.length !== home.platforms.columns.length - 1
    ) {
      problems.push(
        `home.platforms.rows[${i}].cells: expected ${home.platforms.columns.length - 1} cells, one per column after the first`,
      );
    }
  });
  // The two evidence tables have exactly the three columns their rows fill.
  if (Array.isArray(home?.tools?.columns) && home.tools.columns.length !== 3) {
    problems.push('home.tools.columns: expected exactly 3 columns (question, command line, MCP tool)');
  }
  if (Array.isArray(home?.languages?.columns) && home.languages.columns.length !== 3) {
    problems.push('home.languages.columns: expected exactly 3 columns (depth, what is extracted, languages)');
  }
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
