/**
 * Long-form page content, per locale.
 *
 * Kept out of `ui.ts` on purpose: product prose, spec tables and install
 * commands are paragraphs and structures, not chrome strings, and flattening
 * them into a dotted-key map makes the translation unreviewable.
 *
 * Every factual claim here was checked against the product's own source and
 * release tags. Notably:
 *   - CodeGraph parses 38 languages but only 29 get full symbol extraction —
 *     never flatten that to "38 languages".
 *   - CodeGraph contains no model of any kind. It is not semantic search.
 *   - CodeGraph is not on crates.io.
 *   - Voxera has no public repository, no release and no version. It therefore
 *     carries no external link and no version number anywhere on the site.
 */

import type { Lang } from './ui';

export type Status = 'live' | 'early' | 'wip';
export type Weight = 'lead' | 'standard' | 'pending';
export type ProductId = 'codegraph' | 'agentlens' | 'voxera';

export interface Spec {
  term: string;
  value: string;
}

export interface InstallLine {
  /** Optional comment rendered above the command. Never part of the command. */
  note?: string;
  command: string;
}

export interface Product {
  id: ProductId;
  index: string;
  name: string;
  /** One mono line under the name. Positioning, not a slogan. */
  role: string;
  status: Status;
  weight: Weight;
  /** Absent for anything unreleased. */
  version?: string;
  released?: string;
  body: string;
  specs: Spec[];
  install?: { label: string; lines: InstallLine[] };
  /** External links. Empty for anything with no public repository. */
  links?: { label: string; href: string }[];
  /** Path to the in-site detail page, relative to the locale root. */
  detail: string;
  /** Right-column note, used where there is nothing to link to yet. */
  note?: string;
}

export interface Principle {
  index: string;
  term: string;
  body: string;
}

export interface PageContent {
  title: string;
  description: string;
  ogAlt: string;
  heroHeadline: string;
  heroLede: string;
  /** Inline emphasis inside the lede, wrapped in a stronger ink step. */
  heroLedeAccent: string;
  products: Product[];
  principles: Principle[];
}

const CODEGRAPH_REPO = 'https://github.com/sunerpy/codegraph-rust';
const AGENTLENS_REPO = 'https://github.com/sunerpy/AgentLens';

const zh: PageContent = {
  title: 'FirLab — 本地优先的开发者工具',
  description:
    '一个确定性的代码知识图谱、一个面向编码 Agent 的用量归档工具，以及面向编辑器与终端的语音输入。三个用 Rust 写的工具，作者 sunerpy。',
  ogAlt: 'FirLab — sunerpy 构建的开发者工具',

  // No trailing 。 — a full-width period at display size opens a visible hole
  // at the end of the line, and Chinese display headings conventionally omit it.
  heroHeadline: '三个工具，数据都留在你自己的机器上',
  heroLede:
    '目前三个：确定性的代码知识图谱、编码 Agent 的用量归档，以及面向编辑器与终端的语音输入。都用 Rust 写，索引和记录都落在本机，不往外传。',
  heroLedeAccent: 'FirLab 是 sunerpy 的工具集合。',

  products: [
    {
      id: 'codegraph',
      index: '01',
      name: 'CodeGraph',
      role: '确定性代码知识图谱 · CLI + MCP',
      status: 'live',
      weight: 'lead',
      version: 'v0.42.10',
      released: '2026-08-07',
      detail: 'codegraph/',
      body: 'tree-sitter 把仓库解析成项目级的符号、调用与依赖索引，再针对它回答结构性问题：谁调用了这个函数、它能到达什么、改动它会牵连到哪里。二进制里没有任何模型 —— 没有 embedding，没有向量，没有 LLM —— 所以同一个问题在任何机器上都返回同样的字节。正是这一点让它敢交给 Agent 用，也敢放进 CI 里做 diff。',
      specs: [
        {
          term: '语言支持',
          value:
            '解析 38 种语言；其中 29 种做完整符号提取，6 种经由嵌入与模板标记处理，3 种仅到文件级。',
        },
        {
          term: '查询能力',
          value:
            '符号搜索、调用者、被调用者、依赖关系、变更影响半径，以及按 PageRank 中心度排序的全图导出。',
        },
        {
          term: '接入方式',
          value:
            '一份索引，三个入口：CLI 给人用，MCP over stdio 给编码 Agent，MCP over HTTP（127.0.0.1:8111）给编辑器。',
        },
        {
          term: '存储',
          value:
            '项目级 SQLite 加 FTS5，写在仓库内的 .codegraph/ 目录。SQLite 静态链接，不需要额外安装系统库。',
        },
        {
          term: '平台',
          value:
            '预编译六个目标：Linux x86_64 与 aarch64（musl 静态链接）、macOS x86_64 与 Apple Silicon、Windows x86_64 与 ARM64。',
        },
      ],
      install: {
        label: '安装',
        lines: [
          {
            note: 'Linux 与 macOS',
            command:
              'curl -fsSL https://raw.githubusercontent.com/sunerpy/codegraph-rust/main/scripts/install.sh | sh',
          },
          {
            note: '或从源码安装 —— 未发布到 crates.io',
            command: 'cargo install --git https://github.com/sunerpy/codegraph-rust codegraph-rs',
          },
          { note: '然后在任意仓库里', command: 'codegraph init && codegraph index' },
        ],
      },
      links: [
        { label: '仓库', href: CODEGRAPH_REPO },
        { label: '发布页', href: `${CODEGRAPH_REPO}/releases` },
      ],
    },
    {
      id: 'agentlens',
      index: '02',
      name: 'AgentLens',
      role: '编码 Agent 用量归档 · 桌面应用',
      status: 'early',
      weight: 'standard',
      version: 'v0.0.5',
      released: '2026-08-12',
      detail: 'agentlens/',
      body: '一个跨平台桌面看板，回答"这些 Agent 到底做了什么、在哪台机器上做的"。它把本机与 SSH 远端的用量记录汇总进同一份持久归档，再按时区、Agent、模型或项目切分。功夫花在容易悄悄出错的地方：历史比它的来源活得更久、远端访问只读、成本数字承认自己是估算。',
      specs: [
        {
          term: '数据来源',
          value: 'OpenCode、Claude Code、Codex 与 Hermes 的用量记录。',
        },
        {
          term: '主机范围',
          value:
            '本机，以及通过 SSH 连接的远端主机。远端采集是只读的：推送一个静态链接的采集器，校验其 SHA-256，退出时自行清除。',
        },
        {
          term: '归档',
          value:
            '一份本地 SQLite 归档，被当作权威历史 —— 来源数据库轮转、备份被删、远端被清理，都不会让它跟着缩水。',
        },
        {
          term: '分析维度',
          value: '按时区、Agent、模型或项目分组。',
        },
        {
          term: '成本核算',
          value:
            '带上游金额的记录、价目表里查不到价的记录、以及本地可比的估算值，三者分开保存。未知成本标记为缺失，绝不渲染成 0。',
        },
        {
          term: '技术栈',
          value: 'Rust · Tauri 2 · React 18 · SQLite。打包 Linux、Windows 与 macOS。',
        },
      ],
      links: [
        { label: '仓库', href: AGENTLENS_REPO },
        { label: '发布页', href: `${AGENTLENS_REPO}/releases` },
      ],
    },
    {
      id: 'voxera',
      index: '03',
      name: 'Voxera',
      role: '面向桌面与编码 Agent 的语音输入',
      status: 'wip',
      weight: 'pending',
      detail: 'voxera/',
      body: '冲着开发者真正在打字的地方做的听写 —— 编辑器、终端、写给编码 Agent 的提示。按下全局热键采集语音，交给本地引擎或你自己配置的云端引擎转写，然后送进当前获得焦点的输入框，或者送给只监听 127.0.0.1 的 Agent 桥。它不是语音助手，不是会议记录工具，也不是输入法：它只做一件事，落到已经有你光标的那个地方。',
      specs: [
        { term: '采集', value: '一个全局热键，在桌面会话的任何位置都能用。' },
        {
          term: '识别',
          value: '离线本地引擎，或者你自己配置的云端引擎。离线是一等路径，不是降级方案。',
        },
        {
          term: '投递',
          value:
            '文本落到当前获得焦点的输入框，或者交给一个只监听 127.0.0.1 的 Agent 桥。',
        },
        {
          term: '可控性',
          value: '自定义替换规则与热词。本地历史默认关闭，除非你主动打开。',
        },
        { term: '技术栈', value: 'Rust · Tauri 2 · React 19。' },
      ],
      note: '还没有公开仓库，也还没有发布版本。目前没有可下载的东西；这一条放在这里，只是为了把工作的形状记录在案。',
    },
  ],

  principles: [
    {
      index: '01',
      term: '本地优先',
      body: '索引、归档、识别结果都写在你运行它的那台机器上。远端访问只读，并且默认不开启。',
    },
    {
      index: '02',
      term: '确定性优先',
      body: '同样的输入返回同样的字节。结构化查询里没有模型参与，所以结果可以进 CI、可以 diff、可以交给 Agent 复用。',
    },
    {
      index: '03',
      term: '不猜测',
      body: '未知的成本标记为缺失，而不是渲染成 0；没做完的功能不写进介绍，也不给它一个假的版本号。',
    },
  ],
};

const en: PageContent = {
  title: 'FirLab — local-first developer tools',
  description:
    'A deterministic code knowledge graph, a usage archive for coding agents, and voice input for editors and terminals. Three Rust tools by sunerpy.',
  ogAlt: 'FirLab — developer tools by sunerpy',

  heroHeadline: 'Three tools that keep your data on your own machine.',
  heroLede:
    'Three so far: a deterministic code knowledge graph, a usage archive for coding agents, and voice input aimed at editors and terminals. All written in Rust, all keeping their index and their records on the host you run them on.',
  heroLedeAccent: 'FirLab is where sunerpy builds developer tools.',

  products: [
    {
      id: 'codegraph',
      index: '01',
      name: 'CodeGraph',
      role: 'Deterministic code knowledge graph · CLI + MCP',
      status: 'live',
      weight: 'lead',
      version: 'v0.42.10',
      released: '2026-08-07',
      detail: 'codegraph/',
      body: 'tree-sitter parses a repository into a project-level index of symbols, calls and dependencies, then answers structural questions against it: who calls this, what does this reach, what does changing it touch. There is no model anywhere in the binary — no embeddings, no vectors, no LLM — so the same question returns the same bytes on every machine. That is what makes it safe to hand to an agent, and safe to diff in CI.',
      specs: [
        {
          term: 'Languages',
          value:
            '38 parsed — 29 with full symbol extraction, 6 through embedded and template markup, 3 at file level only.',
        },
        {
          term: 'Queries',
          value:
            'Symbol search, callers, callees, dependencies, change-impact radius, and a whole-graph export ranked by PageRank centrality.',
        },
        {
          term: 'Interfaces',
          value:
            'One index, three front doors: the CLI for you, MCP over stdio for a coding agent, MCP over HTTP on 127.0.0.1:8111 for an editor.',
        },
        {
          term: 'Storage',
          value:
            'Per-project SQLite with FTS5, written to .codegraph/ inside the repository. SQLite is statically linked — no system library to install.',
        },
        {
          term: 'Platforms',
          value:
            'Prebuilt for six targets: Linux x86_64 and aarch64 (musl, static), macOS x86_64 and Apple Silicon, Windows x86_64 and ARM64.',
        },
      ],
      install: {
        label: 'Install',
        lines: [
          {
            note: 'Linux and macOS',
            command:
              'curl -fsSL https://raw.githubusercontent.com/sunerpy/codegraph-rust/main/scripts/install.sh | sh',
          },
          {
            note: 'or from source — not published to crates.io',
            command: 'cargo install --git https://github.com/sunerpy/codegraph-rust codegraph-rs',
          },
          { note: 'then, in any repository', command: 'codegraph init && codegraph index' },
        ],
      },
      links: [
        { label: 'Repository', href: CODEGRAPH_REPO },
        { label: 'Releases', href: `${CODEGRAPH_REPO}/releases` },
      ],
    },
    {
      id: 'agentlens',
      index: '02',
      name: 'AgentLens',
      role: 'Usage archive for coding agents · desktop',
      status: 'early',
      weight: 'standard',
      version: 'v0.0.5',
      released: '2026-08-12',
      detail: 'agentlens/',
      body: 'A cross-platform desktop dashboard for the question "what have these agents actually been doing, and on which machines". It pulls usage records off the local host and off remote hosts over SSH into a single durable archive, then lets you slice it by timezone, agent, model or project. The care went into the parts that are easy to get quietly wrong: history that outlives its sources, remote access that only reads, and cost figures that admit when they are estimates.',
      specs: [
        {
          term: 'Sources',
          value: 'OpenCode, Claude Code, Codex and Hermes usage records.',
        },
        {
          term: 'Hosts',
          value:
            'This machine, plus remote hosts over SSH. Remote collection is read-only: a statically linked collector is pushed, its SHA-256 verified, and it removes itself on exit.',
        },
        {
          term: 'Archive',
          value:
            'One local SQLite archive treated as authoritative history — not truncated when a source database rotates, a backup is deleted, or a remote host is cleaned up.',
        },
        {
          term: 'Analysis',
          value: 'Grouped by timezone, agent, model or project.',
        },
        {
          term: 'Cost',
          value:
            'Records carrying an upstream amount, records with no price in the catalogue, and locally comparable estimates are kept apart. An unknown cost is marked missing, never rendered as zero.',
        },
        {
          term: 'Stack',
          value: 'Rust · Tauri 2 · React 18 · SQLite. Packaged for Linux, Windows and macOS.',
        },
      ],
      links: [
        { label: 'Repository', href: AGENTLENS_REPO },
        { label: 'Releases', href: `${AGENTLENS_REPO}/releases` },
      ],
    },
    {
      id: 'voxera',
      index: '03',
      name: 'Voxera',
      role: 'Voice input for desktop and coding agents',
      status: 'wip',
      weight: 'pending',
      detail: 'voxera/',
      body: 'Dictation aimed at the places developers actually type — an editor, a terminal, a prompt to a coding agent. Speech is captured on a global hotkey, transcribed locally or by an engine you configured yourself, and handed to the focused input or to a bridge bound to 127.0.0.1. It is not a voice assistant, not a meeting recorder, and not an input method: it does one thing, into whatever already has your cursor.',
      specs: [
        { term: 'Capture', value: 'A global hotkey, anywhere in the desktop session.' },
        {
          term: 'Recognition',
          value:
            'An offline local engine, or a cloud engine you configure yourself. Offline is a first-class path, not a fallback.',
        },
        {
          term: 'Delivery',
          value:
            'Text lands in whatever input has focus, or goes to an agent bridge that listens only on 127.0.0.1.',
        },
        {
          term: 'Control',
          value:
            'Custom replacement rules and hotwords. Local history is off unless you turn it on.',
        },
        { term: 'Stack', value: 'Rust · Tauri 2 · React 19.' },
      ],
      note: 'No public repository and no release yet. There is nothing to download; this entry is here so the shape of the work is on the record.',
    },
  ],

  principles: [
    {
      index: '01',
      term: 'Local-first',
      body: 'The index, the archive and the transcription all land on the machine you run them on. Remote access is read-only, and off by default.',
    },
    {
      index: '02',
      term: 'Deterministic first',
      body: 'The same input returns the same bytes. No model takes part in a structural query, so the result can go into CI, be diffed, and be reused by an agent.',
    },
    {
      index: '03',
      term: 'No guessing',
      body: 'An unknown cost is marked missing rather than rendered as zero; unfinished work is not written up, and is not given an invented version number.',
    },
  ],
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, PageContent>;

export function getContent(lang: Lang): PageContent {
  return content[lang];
}
