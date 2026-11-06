/**
 * The shape of the `home:` frontmatter both home pages carry.
 *
 * The words live in godot-mcp (`docs/site/index.md`, `docs/site/zh/index.md`); the
 * components that lay them out live here. This file is the contract between the two:
 * `config/shared.ts` runs `validateHome` on both pages at build time, so a missing or misspelt
 * field fails the build instead of rendering an empty band. godot-mcp's
 * `docs/site/README.md` documents the same fields for authors.
 *
 * Two layouts are accepted. The 2026-11 one (design A, DESIGN.md §18) is told apart by its
 * `built` band, and its bands draw only on a page that carries it (`useHomeV2`). The 2026-09 one
 * keeps building, so an older godot-mcp checkout still syncs and builds.
 */
import { ICON_NAMES, type IconName } from './icons';
import { MARK_NAMES, type MarkName } from './marks';

export type { IconName } from './icons';
export type { MarkName } from './marks';

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
 * One line of an exchange: a tool call an MCP client sent, a further argument of the same call,
 * or a line of what godot-mcp answered.
 */
export type TranscriptKind = 'call' | 'argument' | 'answer';
export const TRANSCRIPT_KINDS: readonly TranscriptKind[] = ['call', 'argument', 'answer'];

export interface TranscriptLine {
  kind: TranscriptKind;
  text: string;
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

export interface Privacy {
  title: string;
  intro?: string;
  sendsLabel: string;
  modes: { name: string; sends: string; detail: string }[];
}

// ---- The 2026-09 layout ----------------------------------------------------------------

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

export interface HomeV1 {
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
  privacy: Privacy;
  /** What godot-mcp deliberately does not do. */
  scope: { title: string; intro?: string; items: string[] };
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

/** An exchange with godot-mcp: a label for assistive technology and the transcript. */
export interface Exchange {
  label: string;
  transcript: TranscriptLine[];
}

/** A line that leads to the guide page covering a band or an answer. */
export interface Guide {
  text: string;
  link: string;
}

/** The one piece of evidence a capability shows: lines of an answer, or tool names. */
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
  exchange?: Exchange;
  guide?: Guide;
}

/** A client: its `command`, or a `note` on where its configuration goes when it has none. */
export interface Client {
  name: string;
  mark?: MarkName;
  command?: string;
  note?: string;
  link: string;
}

export type ButtonTheme = 'brand' | 'alt';
export const BUTTON_THEMES: readonly ButtonTheme[] = ['brand', 'alt'];

export interface HomeV2 {
  /** The short facts under the hero's buttons. */
  facts: Fact[];
  /** Under the hero: what an agent sent the running game, and the screenshot godot-mcp answered. */
  stages: { steps: [string, string]; exchange: Exchange; screen: Screen; caption: string };
  /** How godot-mcp is built: the client, the server and what it reaches. */
  built: {
    title: string;
    intro?: string;
    client: { name: string; detail: string };
    server: { name: string; detail: string; parts: string[] };
    targets: { name: string; detail: string; status: Status; link?: string }[];
    note?: string;
  };
  capabilities: { title: string; intro?: string; items: Capability[] };
  showcases: Showcase[];
  clients: { title: string; intro?: string; items: Client[]; more: string; guide?: Guide };
  /** The table beside the profiles split. */
  profiles: ProofTable;
  engine: {
    title: string;
    intro?: string;
    versions: { version: string; detail: string }[];
    platforms: { name: string; archive: string; detail: string }[];
    /** The line under the install commands. */
    install: string;
    guide?: Guide;
    note?: string;
  };
  privacy: Privacy;
  faq: { title: string; intro?: string; items: { q: string; a: string; guide?: Guide }[] };
  closer: {
    title: string;
    body: string;
    actions: { text: string; link: string; theme: ButtonTheme; icon?: IconName }[];
  };
}

/** Whether a page's `home:` frontmatter is in the 2026-11 layout: only that one has `built`. */
export function isV2(home: unknown): home is HomeV2 {
  return typeof home === 'object' && home !== null && 'built' in home;
}

// ---- Checks --------------------------------------------------------------------------------

type Check = (value: unknown, path: string, problems: string[]) => void;

const str =
  (optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (typeof v !== 'string' || v.trim() === '') problems.push(`${path}: expected a non-empty string`);
  };

const oneOf =
  (values: readonly string[], optional = false): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (!values.includes(v as string)) problems.push(`${path}: expected one of ${values.join(', ')}`);
  };

const status = oneOf(STATUSES);
const kind = oneOf(TRANSCRIPT_KINDS);

const index: Check = (v, path, problems) => {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) problems.push(`${path}: expected a column index`);
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

const list =
  (item: Check, min = 1, optional = false, max = Infinity): Check =>
  (v, path, problems) => {
    if (v === undefined && optional) return;
    if (!Array.isArray(v) || v.length < min || v.length > max) {
      const count = max === Infinity ? `at least ${min}` : min === max ? `exactly ${min}` : `${min} to ${max}`;
      problems.push(`${path}: expected a list with ${count} item(s)`);
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

const privacy = obj({
  title: str(),
  intro: str(true),
  sendsLabel: str(),
  modes: list(obj({ name: str(), sends: str(), detail: str() })),
});

const HOME_V1: Check = obj({
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
  privacy,
  scope: obj({
    title: str(),
    intro: str(true),
    items: list(str(), 2),
  }),
});

const screen = obj({ src: screenPath(), dark: screenPath(true), width: size, height: size, alt: str() });
const exchange = (optional = false) =>
  obj({ label: str(), transcript: list(obj({ kind, text: str() }), 2) }, optional);
const guide = (optional = false) => obj({ text: str(), link: link() }, optional);

/** `code` with its lines, or `chips` with tool names: the fields of one kind, and only those. */
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
  facts: list(obj({ term: str(), text: str() }), 2, false, 4),
  stages: obj({
    steps: list(str(), 2, false, 2),
    exchange: exchange(),
    screen,
    caption: str(),
  }),
  built: obj({
    title: str(),
    intro: str(true),
    client: obj({ name: str(), detail: str() }),
    server: obj({ name: str(), detail: str(), parts: list(str(), 2) }),
    targets: list(obj({ name: str(), detail: str(), status, link: link(true) }), 2),
    note: str(true),
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
      points: list(obj({ title: str(), body: str() }), 2, false, 4),
      exchange: exchange(true),
      guide: guide(true),
    }),
    2,
  ),
  clients: obj({
    title: str(),
    intro: str(true),
    items: list(
      obj({ name: str(), mark: oneOf(MARK_NAMES, true), command: str(true), note: str(true), link: link() }),
      2,
    ),
    more: str(),
    guide: guide(true),
  }),
  profiles: proofTable,
  engine: obj({
    title: str(),
    intro: str(true),
    versions: list(obj({ version: str(), detail: str() })),
    platforms: list(obj({ name: str(), archive: str(), detail: str() })),
    install: str(),
    guide: guide(true),
    note: str(true),
  }),
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

/** A table's rows fill exactly its columns, and its code columns exist. */
function checkTable(table: ProofTable | undefined, path: string, problems: string[]): void {
  if (!Array.isArray(table?.columns)) return;
  table.rows?.forEach((row, i) => {
    if (Array.isArray(row?.cells) && row.cells.length !== table.columns.length) {
      problems.push(`${path}.rows[${i}].cells: expected ${table.columns.length} cells, one per column`);
    }
  });
  table.code?.forEach((column, i) => {
    if (typeof column === 'number' && column >= table.columns.length) {
      problems.push(`${path}.code[${i}]: column ${column} does not exist`);
    }
  });
}

/** An argument belongs to the call above it; in the 2026-11 layout an exchange opens with a call. */
function checkTranscript(lines: TranscriptLine[] | undefined, path: string, problems: string[], opensWithCall = true): void {
  if (!Array.isArray(lines)) return;
  lines.forEach((line, i) => {
    if (line?.kind === 'argument' && (i === 0 || lines[i - 1]?.kind === 'answer')) {
      problems.push(`${path}[${i}]: an argument must follow a call or another argument`);
    }
  });
  if (opensWithCall && lines[0]?.kind !== undefined && lines[0].kind !== 'call') {
    problems.push(`${path}[0]: an exchange opens with a call`);
  }
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
    const home = raw as Partial<HomeV2>;
    checkTable(home.profiles, 'home.profiles', problems);
    checkTranscript(home.stages?.exchange?.transcript, 'home.stages.exchange.transcript', problems);
    home.showcases?.forEach?.((showcase, i) =>
      checkTranscript(showcase?.exchange?.transcript, `home.showcases[${i}].exchange.transcript`, problems),
    );
    home.clients?.items?.forEach?.((client, i) => {
      if (client && Boolean(client.command) === Boolean(client.note)) {
        problems.push(`home.clients.items[${i}]: expected a command, or a note where it has none, and not both`);
      }
    });
    checkProse(raw, 'home', problems);
  } else {
    layout = 'the 2026-09 layout (HomeV1)';
    HOME_V1(raw, 'home', problems);
    const home = raw as Partial<HomeV1> | undefined;
    // The platform table's rows must have one cell per column after the name column.
    home?.platforms?.rows?.forEach((row, i) => {
      if (
        Array.isArray(row?.cells) &&
        Array.isArray(home.platforms?.columns) &&
        row.cells.length !== home.platforms.columns.length - 1
      ) {
        problems.push(
          `home.platforms.rows[${i}].cells: expected ${home.platforms.columns.length - 1} cells, one per column after the first`,
        );
      }
    });
    for (const name of PROOF_TABLES) checkTable(home?.[name], `home.${name}`, problems);
    checkTranscript(home?.visual?.transcript, 'home.visual.transcript', problems, false);
  }
  if (problems.length > 0) {
    throw new Error(
      `${page}: the home frontmatter does not match ${layout} in theme/data/home-schema.ts\n  ${problems.join('\n  ')}`,
    );
  }
}
