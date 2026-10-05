/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in bedrock-gateway-rust (`docs/site/index.md`, `docs/site/zh/index.md`); the
 * components that lay them out live here. This file is the contract between the two:
 * `config/shared.ts` runs `validateHome` on both pages at build time, so a missing or misspelt
 * field fails the build instead of rendering an empty band. bedrock-gateway-rust's
 * `docs/site/README.md` documents the same fields for authors.
 */

/**
 * Release state. `opt-in` is a feature that ships switched off and works once the reader turns
 * it on: reasoning across Chat Completions tool calls (it needs a signing key of the reader's
 * own) and OpenTelemetry export (a build option).
 */
export type Status = 'available' | 'opt-in';
export const STATUSES: readonly Status[] = ['available', 'opt-in'];

export interface Fact {
  term: string;
  text: string;
}

/**
 * One line of the hero's terminal: a command the reader types, a further line of the same
 * command (after a trailing `\` or inside a quoted argument), or what the program printed.
 */
export type TranscriptKind = 'command' | 'continuation' | 'output';
export const TRANSCRIPT_KINDS: readonly TranscriptKind[] = ['command', 'continuation', 'output'];

export interface TranscriptLine {
  kind: TranscriptKind;
  text: string;
}

export interface Visual {
  /** What the transcript shows, read by assistive technology in place of the text. */
  label: string;
  /** A real session, line by line; the output is copied from the released program. */
  transcript: TranscriptLine[];
  caption?: string;
}

export interface IndexItem {
  title: string;
  body: string;
  status: Status;
  link?: string;
}

/** The evidence beside a split block: a small table whose first column names each row. */
export interface ProofTable {
  columns: string[];
  rows: { cells: string[] }[];
  /** Columns (by index) whose cells are code: a route, a model ID, a command. */
  code?: number[];
  caption?: string;
}

/** The three evidence tables, by the name a `SplitBlock`'s `proof` uses. */
export type ProofName = 'routes' | 'clients' | 'models';
export const PROOF_TABLES: readonly ProofName[] = ['routes', 'clients', 'models'];

export interface Home {
  facts: Fact[];
  visual: Visual;
  index: { title: string; intro?: string; groups: { name: string; items: IndexItem[] }[] };
  steps: { title: string; items: { title: string; body: string; command?: string }[] };
  /** The routes split's evidence: each route, the API it speaks and a note on how it is served. */
  routes: ProofTable;
  /** The client split's evidence: each client, the API it speaks and how it is set up. */
  clients: ProofTable;
  /** The models split's evidence: each model family, its IDs and the Bedrock path that serves it. */
  models: ProofTable;
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
  /** What bedrock-gateway deliberately does not do. */
  scope: { title: string; intro?: string; items: string[] };
}

type Check = (value: unknown, path: string, problems: string[]) => void;

const str =
  (optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (typeof v !== 'string' || v.trim() === '') problems.push(`${path}: expected a non-empty string`);
  };

const status: Check = (v, path, problems) => {
  if (!STATUSES.includes(v as Status)) problems.push(`${path}: expected one of ${STATUSES.join(', ')}`);
};

const kind: Check = (v, path, problems) => {
  if (!TRANSCRIPT_KINDS.includes(v as TranscriptKind)) {
    problems.push(`${path}: expected one of ${TRANSCRIPT_KINDS.join(', ')}`);
  }
};

const index: Check = (v, path, problems) => {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) problems.push(`${path}: expected a column index`);
};

const list =
  (item: Check, min = 1, optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
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

const proofTable = obj({
  columns: list(str(), 2),
  rows: list(obj({ cells: list(str(), 2) }), 2),
  code: list(index, 1, true),
  caption: str(true),
});

const HOME: Check = obj({
  facts: list(obj({ term: str(), text: str() }), 2),
  visual: obj({
    label: str(),
    transcript: list(obj({ kind, text: str() }), 2),
    caption: str(true),
  }),
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
  routes: proofTable,
  clients: proofTable,
  models: proofTable,
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
  // Every evidence table's rows fill exactly its columns, and its code columns exist.
  for (const name of PROOF_TABLES) {
    const table = home?.[name];
    if (!Array.isArray(table?.columns)) continue;
    table.rows?.forEach((row, i) => {
      if (Array.isArray(row?.cells) && row.cells.length !== table.columns.length) {
        problems.push(`home.${name}.rows[${i}].cells: expected ${table.columns.length} cells, one per column`);
      }
    });
    table.code?.forEach((column, i) => {
      if (typeof column === 'number' && column >= table.columns.length) {
        problems.push(`home.${name}.code[${i}]: column ${column} does not exist`);
      }
    });
  }
  // A continuation belongs to the command above it.
  home?.visual?.transcript?.forEach((line, i, lines) => {
    if (line?.kind === 'continuation' && (i === 0 || lines[i - 1]?.kind === 'output')) {
      problems.push(`home.visual.transcript[${i}]: a continuation must follow a command or another continuation`);
    }
  });
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
