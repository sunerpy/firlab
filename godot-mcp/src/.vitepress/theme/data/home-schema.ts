/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in godot-mcp (`docs/site/index.md`, `docs/site/zh/index.md`); the
 * components that lay them out live here. This file is the contract between the two:
 * `config/shared.ts` runs `validateHome` on both pages at build time, so a missing or misspelt
 * field fails the build instead of rendering an empty band. godot-mcp's
 * `docs/site/README.md` documents the same fields for authors.
 */

/**
 * What a capability needs. `no-engine` answers from the project's files alone, on a machine
 * without Godot; `engine` needs a Godot executable, and some of it a running game or editor
 * that the server starts itself.
 */
export type Status = 'no-engine' | 'engine';
export const STATUSES: readonly Status[] = ['no-engine', 'engine'];

export interface Fact {
  term: string;
  text: string;
}

/**
 * One line of the hero's exchange: a tool call an MCP client sent, a further argument of the
 * same call, or a line of what godot-mcp answered.
 */
export type TranscriptKind = 'call' | 'argument' | 'answer';
export const TRANSCRIPT_KINDS: readonly TranscriptKind[] = ['call', 'argument', 'answer'];

export interface TranscriptLine {
  kind: TranscriptKind;
  text: string;
}

export interface Visual {
  /** What the exchange shows, read by assistive technology in place of the text. */
  label: string;
  /** A real session, call by call; every value in an answer line is copied from godot-mcp's answer. */
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
  /** Columns (by index) whose cells are code: a profile, a tool name, a version. */
  code?: number[];
  caption?: string;
}

/** The three evidence tables, by the name a `SplitBlock`'s `proof` uses. */
export type ProofName = 'profiles' | 'sessions' | 'versions';
export const PROOF_TABLES: readonly ProofName[] = ['profiles', 'sessions', 'versions'];

export interface Home {
  facts: Fact[];
  visual: Visual;
  index: { title: string; intro?: string; groups: { name: string; items: IndexItem[] }[] };
  steps: { title: string; items: { title: string; body: string; command?: string }[] };
  /** The profiles split's evidence: each profile, what it adds and tools it lists. */
  profiles: ProofTable;
  /** The sessions split's evidence: what a managed game or editor session does, and with which tools. */
  sessions: ProofTable;
  /** The engine split's evidence: each locked Godot build and how CI runs it. */
  versions: ProofTable;
  platforms: {
    title: string;
    intro?: string;
    columns: string[];
    rows: { name: string; cells: string[] }[];
    note?: string;
  };
  privacy: {
    title: string;
    intro?: string;
    sendsLabel: string;
    modes: { name: string; sends: string; detail: string }[];
  };
  /** What godot-mcp deliberately does not do. */
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
  profiles: proofTable,
  sessions: proofTable,
  versions: proofTable,
  platforms: obj({
    title: str(),
    intro: str(true),
    columns: list(str(), 2),
    rows: list(obj({ name: str(), cells: list(str()) })),
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
  // An argument belongs to the call above it.
  home?.visual?.transcript?.forEach((line, i, lines) => {
    if (line?.kind === 'argument' && (i === 0 || lines[i - 1]?.kind === 'answer')) {
      problems.push(`home.visual.transcript[${i}]: an argument must follow a call or another argument`);
    }
  });
  if (problems.length > 0) {
    throw new Error(`${page}: the home frontmatter does not match theme/data/home-schema.ts\n  ${problems.join('\n  ')}`);
  }
}
