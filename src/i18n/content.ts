/**
 * Long-form page content, per locale.
 *
 * Kept out of `ui.ts` on purpose: product prose, spec tables and install
 * commands are paragraphs and structures, not chrome strings, and flattening
 * them into a dotted-key map makes the translation unreviewable.
 *
 * Every factual claim here was checked against the product's own source and
 * release tags. Notably:
 *   - pt-tools' RSS path downloads FREE torrents only when no filter rule is
 *     enabled. Filter rules (keyword / wildcard / regex) are what widen it.
 *     Never state "downloads everything from a feed".
 *   - pt-tools' ChatOps is verified end-to-end on QQ (OneBot/NapCat) and
 *     Telegram ONLY. WeCom group bot and the custom webhook are experimental
 *     and unverified; that caveat ships on the page.
 *   - CodeGraph parses 38 languages but only 29 get full symbol extraction —
 *     never flatten that to "38 languages".
 *   - CodeGraph contains no model of any kind. It is not semantic search.
 *   - CodeGraph is not on crates.io.
 *   - Voxera has no public repository, no release and no version. It therefore
 *     carries no external link and no version number anywhere on the site.
 *
 * ORDER IS MEANING. The array order is the index order, and it is sorted by
 * maturity, not by age — pt-tools leads because it is the most released thing
 * here (published Docker images, 136 stars). Reordering this array
 * without also renumbering `index` and each detail page's `eyebrow` leaves the
 * site contradicting itself.
 */

import type { Lang } from './ui';
import {
  AGENTLENS_RELEASED,
  AGENTLENS_VERSION,
  codegraphReleased,
  codegraphVersion,
  pttoolsReleased,
  pttoolsVersion,
} from './versions';

export type Status = 'live' | 'early' | 'wip';
export type Weight = 'lead' | 'major' | 'standard' | 'pending';
export type ProductId = 'pttools' | 'codegraph' | 'agentlens' | 'voxera';

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

const PTTOOLS_REPO = 'https://github.com/sunerpy/pt-tools';
const CODEGRAPH_REPO = 'https://github.com/sunerpy/codegraph-rust';
const AGENTLENS_REPO = 'https://github.com/sunerpy/AgentLens';

const zh: PageContent = {
  title: 'FirLab — 本地优先的开发者工具',
  description:
    'PT 站点订阅与统计的自动化工具、确定性的代码知识图谱、编码 Agent 的用量归档，以及面向编辑器与终端的语音输入。四个自部署的工具，作者 sunerpy。',
  ogAlt: 'FirLab — sunerpy 构建的开发者工具',

  // No trailing 。 — a full-width period at display size opens a visible hole
  // at the end of the line, and Chinese display headings conventionally omit it.
  heroHeadline: '四个工具，数据都留在你自己的机器上',
  heroLede:
    '目前四个：PT 站点的订阅与统计自动化、确定性的代码知识图谱、编码 Agent 的用量归档，以及面向编辑器与终端的语音输入。全部自部署，索引、归档和凭据都落在你运行它的那台机器上。',
  heroLedeAccent: 'FirLab 是 sunerpy 的工具集合。',

  products: [
    {
      id: 'pttools',
      index: '01',
      name: 'pt-tools',
      role: 'PT 站点订阅、搜索与统计自动化 · Go',
      status: 'live',
      weight: 'lead',
      version: pttoolsVersion,
      released: pttoolsReleased,
      detail: 'pt-tools/',
      body: '把 PT 站点上手工重复的那几件事接过去：解析 RSS 订阅并把符合条件的种子推给下载器、跨站点批量搜索、把各站的上传下载分享率与魔力值汇总成一张表、按做种时长或分享率清理已完成的种子。免费期结束时自动暂停，H&R 保护和磁盘水位都是硬约束。全部自部署，站点 Cookie 和统计数据只存在你自己那台机器上。',
      specs: [
        {
          term: 'RSS 订阅',
          value:
            '定时解析订阅源并推送给下载器。未启用过滤规则时只下载免费种子；关键词、通配符与正则三种过滤规则用于扩展到非免费内容。',
        },
        {
          term: '搜索与推送',
          value:
            '跨站点搜索种子，可批量下载、批量推送到下载器，或直接把 .torrent 存到本地。',
        },
        {
          term: '统计',
          value:
            '汇总各站点的上传量、下载量、分享率、魔力值与等级进度，并可渲染成一张数据卡片图片。',
        },
        {
          term: '下载器管理',
          value: '支持多个下载器实例，每个实例可单独配置保存目录与添加后的启动策略。',
        },
        {
          term: '自动清理',
          value:
            '按做种时长、分享率或无活动时间清理种子，带 H&R 保护与磁盘剩余空间下限；免费期结束时自动暂停，未完成的种子可选自动删除。',
        },
        {
          term: '远程管理',
          value:
            'Web 管理界面，以及 QQ（OneBot / NapCat）与 Telegram 两条已端到端验证的 ChatOps 通道，13 条内置指令。',
        },
        {
          term: '部署',
          value: 'Go 1.25+ 单二进制，MIT 许可。提供 Docker 镜像，支持 Linux 与 Windows。',
        },
      ],
      install: {
        label: '运行',
        lines: [
          { note: 'Docker', command: 'docker pull sunerpy/pt-tools' },
          {
            note: '或从发布页取对应平台的二进制',
            command: 'pt-tools --help',
          },
        ],
      },
      links: [
        { label: '仓库', href: PTTOOLS_REPO },
        { label: '发布页', href: `${PTTOOLS_REPO}/releases` },
      ],
    },
    {
      id: 'codegraph',
      index: '02',
      name: 'CodeGraph',
      role: '确定性代码知识图谱 · CLI + MCP',
      status: 'live',
      weight: 'major',
      version: codegraphVersion,
      released: codegraphReleased,
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
      index: '03',
      name: 'AgentLens',
      role: '编码 Agent 用量归档 · 桌面应用',
      status: 'early',
      weight: 'standard',
      version: AGENTLENS_VERSION,
      released: AGENTLENS_RELEASED,
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
      index: '04',
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
    'Feed, search and statistics automation for private trackers, a deterministic code knowledge graph, a usage archive for coding agents, and voice input for editors and terminals. Four self-hosted tools by sunerpy.',
  ogAlt: 'FirLab — developer tools by sunerpy',

  heroHeadline: 'Four tools that keep your data on your own machine.',
  heroLede:
    'Four so far: feed, search and statistics automation for private trackers, a deterministic code knowledge graph, a usage archive for coding agents, and voice input aimed at editors and terminals. All self-hosted — the index, the archive and the credentials stay on the host you run them on.',
  heroLedeAccent: 'FirLab is where sunerpy builds developer tools.',

  products: [
    {
      id: 'pttools',
      index: '01',
      name: 'pt-tools',
      role: 'Feed, search and statistics automation for private trackers · Go',
      status: 'live',
      weight: 'lead',
      version: pttoolsVersion,
      released: pttoolsReleased,
      detail: 'pt-tools/',
      body: 'Takes over the repetitive parts of running an account on a private tracker: parsing RSS feeds and handing matching torrents to a downloader, searching across sites, collecting upload, download, ratio and bonus figures into one table, and cleaning up finished torrents by seed time or ratio. Torrents are paused when their free window closes, and H&R protection and a disk floor are hard constraints rather than suggestions. Everything is self-hosted — site cookies and statistics exist only on your own machine.',
      specs: [
        {
          term: 'RSS',
          value:
            'Feeds are polled and matching torrents pushed to a downloader. With no filter rule enabled it downloads free torrents only; keyword, wildcard and regex rules are what widen it beyond that.',
        },
        {
          term: 'Search',
          value:
            'Search torrents across sites, then batch-download, batch-push to a downloader, or save the .torrent files locally.',
        },
        {
          term: 'Statistics',
          value:
            'Upload, download, ratio, bonus points and level progress collected across every configured site, and renderable as a shareable data card image.',
        },
        {
          term: 'Downloaders',
          value:
            'Multiple downloader instances, each with its own save directory and post-add start policy.',
        },
        {
          term: 'Cleanup',
          value:
            'Torrents are removed by seed time, ratio or inactivity, subject to H&R protection and a minimum free-disk floor. Paused automatically when a free window ends; incomplete torrents can optionally be deleted at that point.',
        },
        {
          term: 'Remote control',
          value:
            'A web management UI, plus two ChatOps channels verified end to end — QQ (OneBot / NapCat) and Telegram — with 13 built-in commands.',
        },
        {
          term: 'Deployment',
          value:
            'A single Go 1.25+ binary under MIT. Docker images are published; Linux and Windows are supported.',
        },
      ],
      install: {
        label: 'Run it',
        lines: [
          { note: 'Docker', command: 'docker pull sunerpy/pt-tools' },
          { note: 'or take a binary for your platform off the releases page', command: 'pt-tools --help' },
        ],
      },
      links: [
        { label: 'Repository', href: PTTOOLS_REPO },
        { label: 'Releases', href: `${PTTOOLS_REPO}/releases` },
      ],
    },
    {
      id: 'codegraph',
      index: '02',
      name: 'CodeGraph',
      role: 'Deterministic code knowledge graph · CLI + MCP',
      status: 'live',
      weight: 'major',
      version: codegraphVersion,
      released: codegraphReleased,
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
      index: '03',
      name: 'AgentLens',
      role: 'Usage archive for coding agents · desktop',
      status: 'early',
      weight: 'standard',
      version: AGENTLENS_VERSION,
      released: AGENTLENS_RELEASED,
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
      index: '04',
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
