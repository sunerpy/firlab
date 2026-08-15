/**
 * CodeGraph detail-page content, per locale.
 *
 * Separate module from `content.ts` on purpose: the index page needs a one-band
 * summary of each product, this page needs the long form. Keeping them apart
 * means the home page cannot accidentally inherit page-length prose, and the
 * detail page cannot drift into repeating the index verbatim.
 *
 * Every claim below was read out of the product's own README and release tags:
 *   - Published release metadata is centralized in `versions.ts`.
 *   - 38 languages PARSED, at three different extraction depths — 29 full
 *     symbol extraction, 6 embedded/template, 3 file-level only. Never flatten
 *     that to "38 languages"; the tiers are the honest number.
 *   - There is no model of any kind in the binary. No embeddings, no vectors,
 *     no LLM. The whole value proposition is byte-stable output.
 *   - NOT published to crates.io. The package is `codegraph-rs`, the binary is
 *     `codegraph`, and it installs from a release archive or `--git`.
 *   - Six prebuilt targets, MIT licence.
 *
 * `en` is typed against the Chinese shape, so a field added to one locale and
 * forgotten in the other is a build error rather than a hole in the page.
 */

import type { Lang } from './ui';
import type { Spec, InstallLine } from './content';

/** A numbered editorial row: index · term · body. */
export interface Numbered {
  index: string;
  term: string;
  body: string;
}

/** One of the three front doors onto the same index. */
export interface Door extends Numbered {
  /** Who this door is for. One mono line. */
  audience: string;
  /** The command that opens it. Real and copyable. */
  command: string;
}

/** One row of the capability table. */
export interface Capability {
  question: string;
  cli: string;
  mcp: string;
}

/** One extraction-depth tier. The tiers are the fact; the total is not. */
export interface LangTier {
  tier: string;
  depth: string;
  count: string;
  languages: string;
}

/** One prebuilt release target. */
export interface Platform {
  platform: string;
  arch: string;
  target: string;
  ext: string;
}

export interface SectionHead {
  index: string;
  title: string;
  lede: string;
}

export interface CodeGraphContent {
  /* ---- head ---- */
  title: string;
  description: string;
  ogAlt: string;

  /* ---- breadcrumb ---- */
  crumbLabel: string;
  crumbHome: string;
  crumbCurrent: string;

  /* ---- masthead ---- */
  eyebrow: string;
  name: string;
  role: string;
  ledeAccent: string;
  lede: string;

  /* ---- meta ledger ---- */
  metaLabel: string;
  licenseTerm: string;
  licenseValue: string;
  packageTerm: string;
  packageValue: string;
  repoLabel: string;
  releasesLabel: string;

  /* ---- determinism callout ---- */
  claimLabel: string;
  claimTitle: string;
  claimBody: string;
  claimPoints: string[];

  /* ---- sections ---- */
  problem: SectionHead;
  audiences: Numbered[];

  pipeline: SectionHead;
  steps: Numbered[];

  doorsHead: SectionHead;
  doors: Door[];

  capsHead: SectionHead;
  capsColumns: { question: string; cli: string; mcp: string };
  capabilities: Capability[];
  capsNote: string;

  installHead: SectionHead;
  installLabel: string;
  install: InstallLine[];
  usageLabel: string;
  usage: InstallLine[];
  installNote: string;

  langHead: SectionHead;
  langColumns: { tier: string; depth: string; count: string; languages: string };
  langTiers: LangTier[];
  langNote: string;

  platHead: SectionHead;
  platColumns: { platform: string; arch: string; target: string; ext: string };
  platforms: Platform[];
  platNote: string;

  stackHead: SectionHead;
  stack: Spec[];

  limitsHead: SectionHead;
  limits: Numbered[];

  /* ---- closing ---- */
  closeLabel: string;
  closeTitle: string;
  closeBody: string;
  backHome: string;
}

const REPO = 'https://github.com/sunerpy/codegraph-rust';
const RELEASES = `${REPO}/releases`;
const INSTALL_SH = `curl -fsSL https://raw.githubusercontent.com/sunerpy/codegraph-rust/main/scripts/install.sh | sh`;
const INSTALL_PS = `irm https://raw.githubusercontent.com/sunerpy/codegraph-rust/main/scripts/install.ps1 | iex`;
const CARGO_GIT = `cargo install --git ${REPO} codegraph-rs`;

export const codegraphLinks = { repo: REPO, releases: RELEASES } as const;

/* Tier membership is quoted from the product's own language table. Listing the
   members rather than only the counts is what stops the three-tier fact from
   collapsing back into "38 languages" the next time someone edits this file. */
const TIER_1 =
  'TypeScript · TSX · JavaScript · JSX · ArkTS · Python · Go · Rust · Java · C · C++ · C# · PHP · Ruby · Swift · Kotlin · Dart · Scala · Lua · Luau · Objective-C · R · Solidity · Nix · Terraform · Erlang · CFML · GDScript · Pascal';
const TIER_2 = 'Vue · Svelte · Astro · Razor (.cshtml) · Liquid · XML / MyBatis mapper';
const TIER_3 = 'YAML · Twig · Properties';

const zh: CodeGraphContent = {
  title: 'CodeGraph — 确定性代码知识图谱 · FirLab',
  description:
    'tree-sitter 把仓库解析成项目级 SQLite 索引，回答谁调用了这个函数、改动它会牵连到哪里。二进制里没有任何模型，同一个问题在任何机器上返回同样的字节。CLI、MCP stdio、MCP HTTP 三个入口共用一份索引。',
  ogAlt: 'CodeGraph — sunerpy 构建的确定性代码知识图谱',

  crumbLabel: '面包屑',
  crumbHome: 'FirLab',
  crumbCurrent: 'CodeGraph',

  eyebrow: '产品 02 · 确定性代码知识图谱',
  name: 'CodeGraph',
  role: 'tree-sitter → SQLite + FTS5 · CLI + MCP · 无模型',
  ledeAccent: '一份索引，三个入口。',
  lede:
    'tree-sitter 把仓库解析成项目级的符号、调用与依赖索引，再针对它回答结构性问题：谁调用了这个函数、它能到达什么、改动它会牵连到哪里。这些答案来自一次完整的语法树解析，不是文本匹配的猜测，也不来自任何模型。',

  metaLabel: '版本信息',
  licenseTerm: '许可',
  licenseValue: 'MIT',
  packageTerm: '包名',
  packageValue: 'codegraph-rs（二进制 codegraph）',
  repoLabel: '仓库',
  releasesLabel: '发布页',

  claimLabel: '前提',
  claimTitle: '里面没有模型，所以输出是可复现的字节',
  claimBody:
    '这不是省下来的一个功能，而是整件事成立的前提。二进制里不含 embedding、不含向量索引、不含 LLM 调用，因此同一个仓库、同一个问题，在你的笔记本、同事的机器和 CI runner 上返回完全相同的字节。可复现，才谈得上下面这三件事：',
  claimPoints: [
    '交给编码 Agent 时，它拿到的是事实而不是一次采样；同一轮对话里问两次不会得到两个答案。',
    '放进 CI 里可以 diff —— 影响半径变了就是代码结构变了，而不是模型今天心情不同。',
    '出错时可以复现。一个确定性的管道，bug 有唯一的重现路径。',
  ],

  problem: {
    index: '01',
    title: '它解决什么问题',
    lede:
      '"改这个函数会碰到哪些地方" 这类问题，grep 答不了。grep 认字符串，不认调用关系：同名的方法、被重新导出的符号、经由 trait 或接口分发的调用，它一律看不见；反过来，注释和字符串里的同名文本它又一定会报出来。于是你回到人工翻文件，一层层往上追调用者，直到自己觉得追干净了 —— 这个"觉得"就是回归 bug 的来源。CodeGraph 把这层结构预先算好、落盘，然后用一次查询回答它。',
  },
  audiences: [
    {
      index: '01',
      term: '在陌生仓库里改代码的人',
      body: '接手一个几十万行的项目，需要在动手之前知道这个符号被谁用着、改了会波及哪里。先看半径，再决定改法。',
    },
    {
      index: '02',
      term: '编码 Agent',
      body: '一次结构化查询就拿到相关符号的源码和它们之间的调用路径，替代几十轮 grep 加读文件 —— 上下文更准，token 更少，来回更短。这也是 MCP 入口存在的原因。',
    },
    {
      index: '03',
      term: '编辑器与 IDE',
      body: '通过本机 HTTP 接同一份索引，不必各自再实现一套跨文件解析。远程开发场景下 HTTP 也是唯一可靠的通道。',
    },
    {
      index: '04',
      term: 'CI 与代码评审',
      body: '一次改动的影响半径可以被算出来、被 diff、被写进评审意见。确定性输出让"这次变更比上次多牵连了三个模块"成为一句可以验证的话。',
    },
  ],

  pipeline: {
    index: '02',
    title: '它怎么工作',
    lede:
      '四个阶段，没有一步需要联网，也没有一步会把你的代码发出去。索引写在仓库自己的 .codegraph/ 目录里。',
  },
  steps: [
    {
      index: '01',
      term: '解析',
      body: 'tree-sitter 按语言逐文件构建语法树，提取符号定义、调用点与文件间依赖，并做跨文件符号解析 —— 这一步决定了后面所有答案的精度。',
    },
    {
      index: '02',
      term: '落盘',
      body: '结果写进项目级的 SQLite 数据库，全文检索由 FTS5 承担。SQLite 静态链接进二进制，机器上不需要预装任何系统库。',
    },
    {
      index: '03',
      term: '查询',
      body: '符号搜索、调用者、被调用者、依赖、变更影响半径，以及按 PageRank 中心度排序的全图导出。查询走索引，是亚毫秒级的读，不是重新扫一遍仓库。',
    },
    {
      index: '04',
      term: '跟随',
      body: '后台守护进程监听文件变化（2 秒防抖）并增量更新索引，落后写入约一秒。同一个项目的多个客户端 —— 终端标签页、Agent、编辑器 —— 共用这一个守护进程；全部断开且空闲超时后它自行退出。',
    },
  ],

  doorsHead: {
    index: '03',
    title: '三个入口，同一份索引',
    lede:
      '索引只建一次。人、Agent 和编辑器分别从最顺手的那个口子进来，看到的是同一份数据，不存在"CLI 的答案和 Agent 的答案不一致"这种情况。',
  },
  doors: [
    {
      index: '01',
      term: 'CLI',
      audience: '给人用',
      command: 'codegraph query "<symbol>" -p .',
      body: '基于 Clap 的子命令集：init、index、sync、query、files、status、callers、callees、impact、affected、check、export、unlock，外加 bash / zsh / fish / powershell / elvish 的补全安装。',
    },
    {
      index: '02',
      term: 'MCP over stdio',
      audience: '给编码 Agent',
      command: 'codegraph serve --mcp',
      body: '标准 MCP stdio 服务。codegraph install --yes 会自动探测已安装的 Agent 与 IDE 并写好配置；codegraph skill install 还能把使用说明作为 Skill 装进它们各自的技能目录。',
    },
    {
      index: '03',
      term: 'MCP over HTTP',
      audience: '给编辑器与远程开发',
      command: 'codegraph serve --http',
      body: '默认只监听 127.0.0.1:8111，不对外暴露。codegraph http list 查看在跑的实例，codegraph http stop <addr> 停掉其中一个。SSH 远程开发时这是推荐通道。',
    },
  ],

  capsHead: {
    index: '04',
    title: '能问它什么',
    lede: '同一个问题，命令行和 MCP 两侧是同一份实现，答案一致。',
  },
  capsColumns: { question: '问题', cli: '命令行', mcp: 'MCP 工具' },
  capabilities: [
    { question: '这个符号在哪里定义的？', cli: 'codegraph query', mcp: 'codegraph_search' },
    { question: '这块代码是怎么工作的？', cli: 'codegraph export', mcp: 'codegraph_explore' },
    { question: '把它的源码和调用链一起给我', cli: 'codegraph query --json', mcp: 'codegraph_node' },
    { question: '谁调用了它？', cli: 'codegraph callers', mcp: 'codegraph_callers' },
    { question: '它调用了什么？', cli: 'codegraph callees', mcp: 'codegraph_callees' },
    { question: '改动它会牵连到哪里？', cli: 'codegraph impact', mcp: 'codegraph_impact' },
    { question: '这次改动影响了哪些文件？', cli: 'codegraph affected', mcp: '—' },
    { question: '索引建好了吗？', cli: 'codegraph status', mcp: 'codegraph_status' },
  ],
  capsNote:
    'impact 给出的是传递闭包，不是一层调用者 —— 这也是它和手工往上翻调用链最主要的差别。export 支持按 PageRank 中心度排序输出全图，用来找一个陌生仓库里真正的枢纽。',

  installHead: {
    index: '05',
    title: '安装与上手',
    lede:
      '一键脚本会探测平台、下载对应的预编译二进制并放到 PATH 上 —— 不需要 Rust 工具链，也不需要等编译。它没有发布到 crates.io，所以从 crates 索引走的那条 cargo 安装路径找不到它；有 Rust 环境时，用下面的 --git 从源码装。',
  },
  installLabel: '安装',
  install: [
    { note: 'Linux 与 macOS', command: INSTALL_SH },
    { note: 'Windows（PowerShell 5.1 及以上）', command: INSTALL_PS },
    { note: '或从源码 —— 未发布到 crates.io', command: CARGO_GIT },
  ],
  usageLabel: '上手',
  usage: [
    { note: '建索引，写进 ./.codegraph/', command: 'codegraph init && codegraph index' },
    { note: '查一个符号', command: 'codegraph query "GraphTraverser" -p .' },
    { note: '看改动它的影响半径', command: 'codegraph impact GraphTraverser' },
    { note: '把 MCP 服务写进已安装的 Agent 配置', command: 'codegraph install --yes' },
  ],
  installNote:
    '设 CODEGRAPH_VERSION 可以钉住某个版本而不取最新。CI 里设 CODEGRAPH_NO_DAEMON=1 走前台模式；不想要文件监听就传 --no-watch。排除规则写在 .codegraph/config.toml 的 [indexing] exclude 下，自定义扩展名映射写在 .codegraph/codegraph.json。',

  langHead: {
    index: '06',
    title: '语言支持',
    lede:
      '一共解析 38 种语言，但深度不一样，而深度才是有用的那个数字。下面三档是按提取深度分的，不要把它们合成一个"支持 38 种语言"。',
  },
  langColumns: { tier: '档位', depth: '提取深度', count: '数量', languages: '语言' },
  langTiers: [
    {
      tier: '第一档',
      depth: '完整符号提取',
      count: '29',
      languages: TIER_1,
    },
    {
      tier: '第二档',
      depth: '嵌入与模板提取',
      count: '6',
      languages: TIER_2,
    },
    {
      tier: '第三档',
      depth: '仅到文件级',
      count: '3',
      languages: TIER_3,
    },
  ],
  langNote:
    '第二档的语言，符号来自宿主文件里嵌入的脚本与模板标记，粒度取决于该文件的写法。第三档只登记文件与文件间的关系，没有符号级的调用图。语言集合是固定的，不做启发式兜底 —— 一个文件要么在这套表里，要么不进图。',

  platHead: {
    index: '07',
    title: '平台',
    lede:
      '六个预编译目标，发布产物命名为 codegraph-<version>-<target>.<ext>。Linux 走 musl 静态链接，不依赖 glibc，也不依赖系统 SQLite。',
  },
  platColumns: { platform: '平台', arch: '架构', target: '目标三元组', ext: '格式' },
  platforms: [
    { platform: 'Linux', arch: 'x86_64（musl 静态）', target: 'x86_64-unknown-linux-musl', ext: '.tar.gz' },
    { platform: 'Linux', arch: 'aarch64（musl 静态）', target: 'aarch64-unknown-linux-musl', ext: '.tar.gz' },
    { platform: 'macOS', arch: 'x86_64', target: 'x86_64-apple-darwin', ext: '.tar.gz' },
    { platform: 'macOS', arch: 'aarch64（Apple Silicon）', target: 'aarch64-apple-darwin', ext: '.tar.gz' },
    { platform: 'Windows', arch: 'x86_64', target: 'x86_64-pc-windows-msvc', ext: '.zip' },
    { platform: 'Windows', arch: 'aarch64（ARM64）', target: 'aarch64-pc-windows-msvc', ext: '.zip' },
  ],
  platNote: '也可以直接从发布页下载压缩包，解压后把 codegraph 放到 PATH 上。',

  stackHead: {
    index: '08',
    title: '技术栈与存储',
    lede: '选型都是为了同一件事：单文件二进制、无外部依赖、输出可复现。',
  },
  stack: [
    { term: '语言', value: 'Rust，Edition 2024。发布产物是单个可执行文件，不带运行时。' },
    { term: '解析', value: 'tree-sitter，每种语言一套语法，加上跨文件符号解析。' },
    {
      term: '存储',
      value: '项目级 SQLite，全文检索用 FTS5。数据库静态链接进二进制，机器上不需要预装 SQLite。',
    },
    {
      term: '索引位置',
      value: '仓库内的 .codegraph/ —— codegraph.db 及其 WAL、config.toml、codegraph.json，守护进程的 pid / socket / 日志也在这里。',
    },
    { term: '命令行', value: 'Clap 子命令，五种 shell 的补全脚本随二进制分发。' },
    {
      term: '后台进程',
      value: '按项目共享的守护进程，通过 Unix socket 通信，监听文件变化并增量更新；客户端全部断开且空闲超时后自行退出。',
    },
    { term: '网络', value: '索引与查询全程离线。HTTP 传输默认只绑 127.0.0.1。' },
    { term: '许可', value: 'MIT。' },
  ],

  limitsHead: {
    index: '09',
    title: '它不做什么',
    lede: '写清边界比多列几条功能有用 —— 尤其是这类容易被误当成别的东西的工具。',
  },
  limits: [
    {
      index: '01',
      term: '不做相似度检索',
      body: '没有 embedding，没有向量库，问题不会被转成向量再找最近邻。它回答的是结构性问题，靠的是语法树里真实存在的边。想按"意思相近"找代码，这个工具帮不上。',
    },
    {
      index: '02',
      term: '不判断对错',
      body: '它告诉你调用关系和影响半径，不告诉你这段代码写得好不好、有没有 bug。类型检查交给编译器，风格交给 linter，正确性交给测试。',
    },
    {
      index: '03',
      term: '跨文件解析是尽力而为',
      body: '跨文件符号解析基于名字匹配，有歧义的调用会返回多个候选。动态分发、反射、运行时拼出来的调用，静态解析看不见。',
    },
    {
      index: '04',
      term: '索引不是实时的',
      body: '守护进程落后文件写入约一秒。刚改完立刻查，可能读到上一版；工具响应会标出处于陈旧状态的文件。',
    },
    {
      index: '05',
      term: '语言集合是固定的',
      body: '不在那 38 种里的语言不会被启发式地"尽量解析一下"，而是直接不进图。这是明确的取舍：宁可少收，也不产出没有依据的边。',
    },
  ],

  closeLabel: '获取',
  closeTitle: '在任意仓库里跑一次 init',
  closeBody:
    '预编译二进制、一键脚本、源码安装三条路都在下面。它是 MIT 许可的个人项目，issue 和 PR 都在同一个仓库里。',
  backHome: '返回 FirLab',
};

const en: CodeGraphContent = {
  title: 'CodeGraph — deterministic code knowledge graph · FirLab',
  description:
    'tree-sitter parses a repo into a per-project SQLite index that answers who calls this and what changing it touches. No model inside: same bytes anywhere.',
  ogAlt: 'CodeGraph — a deterministic code knowledge graph by sunerpy',

  crumbLabel: 'Breadcrumb',
  crumbHome: 'FirLab',
  crumbCurrent: 'CodeGraph',

  eyebrow: 'Product 02 · deterministic code knowledge graph',
  name: 'CodeGraph',
  role: 'tree-sitter → SQLite + FTS5 · CLI + MCP · no model',
  ledeAccent: 'One index, three front doors.',
  lede:
    'tree-sitter parses a repository into a project-level index of symbols, calls and dependencies, then answers structural questions against it: who calls this, what does this reach, what does changing it touch. Those answers come out of a full syntax-tree parse — not a text match that happened to line up, and not a model.',

  metaLabel: 'Release',
  licenseTerm: 'Licence',
  licenseValue: 'MIT',
  packageTerm: 'Package',
  packageValue: 'codegraph-rs (binary: codegraph)',
  repoLabel: 'Repository',
  releasesLabel: 'Releases',

  claimLabel: 'Premise',
  claimTitle: 'There is no model inside it, which is why the bytes are reproducible',
  claimBody:
    'This is not a feature that was left out — it is the premise the whole thing rests on. The binary carries no embeddings, no vector index and no LLM call, so the same repository and the same question return byte-identical output on your laptop, on a colleague\u2019s machine and on a CI runner. Reproducibility is what makes the next three things possible:',
  claimPoints: [
    'Handed to a coding agent, it is a fact rather than a sample. Asking twice in one session cannot produce two different answers.',
    'It can be diffed in CI. A changed impact radius means the code structure changed, not that the weights felt different today.',
    'It can be reproduced when it is wrong. A deterministic pipeline gives a bug exactly one path to walk back down.',
  ],

  problem: {
    index: '01',
    title: 'The problem it solves',
    lede:
      'grep cannot answer "what does changing this function touch". grep matches characters, not call relationships: same-named methods, re-exported symbols, calls dispatched through a trait or an interface — it sees none of them, and it will always hand you the matches inside comments and string literals as well. So you fall back to opening files and walking callers upward until you feel you have got them all — and that feeling is where regressions come from. CodeGraph computes that structure ahead of time, persists it, and answers the question in one query.',
  },
  audiences: [
    {
      index: '01',
      term: 'People editing an unfamiliar repository',
      body: 'You inherit a few hundred thousand lines and need to know, before touching anything, who depends on this symbol and how far a change reaches. Read the radius first, then decide how to change it.',
    },
    {
      index: '02',
      term: 'Coding agents',
      body: 'One structural query returns the relevant symbols\u2019 source plus the call paths between them, replacing dozens of grep-and-read round-trips — more accurate context, fewer tokens, shorter loops. That is what the MCP door exists for.',
    },
    {
      index: '03',
      term: 'Editors and IDEs',
      body: 'Reach the same index over local HTTP instead of each reimplementing cross-file resolution. For remote development, HTTP is also the only transport that reliably works.',
    },
    {
      index: '04',
      term: 'CI and code review',
      body: 'The blast radius of a change can be computed, diffed and quoted in a review. Deterministic output is what turns "this change reaches three more modules than the last one" into a verifiable sentence.',
    },
  ],

  pipeline: {
    index: '02',
    title: 'How it works',
    lede:
      'Four stages. None of them needs a network, and none of them sends your code anywhere. The index is written into the repository\u2019s own .codegraph/ directory.',
  },
  steps: [
    {
      index: '01',
      term: 'Parse',
      body: 'tree-sitter builds a syntax tree per file with a per-language grammar, extracting symbol definitions, call sites and file-to-file dependencies, then resolves symbols across files. This stage sets the ceiling on how precise every later answer can be.',
    },
    {
      index: '02',
      term: 'Persist',
      body: 'Results go into a per-project SQLite database, with full-text search handled by FTS5. SQLite is compiled into the binary, so the host needs no system library installed.',
    },
    {
      index: '03',
      term: 'Query',
      body: 'Symbol search, callers, callees, dependencies, change-impact radius, and a whole-graph export ranked by PageRank centrality. Queries read the index — sub-millisecond, not a fresh walk of the repository.',
    },
    {
      index: '04',
      term: 'Follow',
      body: 'A background daemon watches for file changes on a 2-second debounce and updates the index incrementally, lagging writes by about a second. Every client on one project — terminal tabs, agents, editors — shares that single daemon; it exits once they all disconnect and the idle timeout elapses.',
    },
  ],

  doorsHead: {
    index: '03',
    title: 'Three front doors, one index',
    lede:
      'The index is built once. People, agents and editors each come in through whichever door suits them and see the same data — there is no case where the CLI answer and the agent answer disagree.',
  },
  doors: [
    {
      index: '01',
      term: 'CLI',
      audience: 'for you',
      command: 'codegraph query "<symbol>" -p .',
      body: 'A Clap subcommand set: init, index, sync, query, files, status, callers, callees, impact, affected, check, export, unlock — plus completion installers for bash, zsh, fish, powershell and elvish.',
    },
    {
      index: '02',
      term: 'MCP over stdio',
      audience: 'for coding agents',
      command: 'codegraph serve --mcp',
      body: 'A standard MCP stdio server. codegraph install --yes detects the agents and IDEs you already have and writes their config; codegraph skill install additionally drops the usage guide into each one\u2019s skill directory.',
    },
    {
      index: '03',
      term: 'MCP over HTTP',
      audience: 'for editors and remote work',
      command: 'codegraph serve --http',
      body: 'Binds 127.0.0.1:8111 by default and is not exposed off the host. codegraph http list shows what is running; codegraph http stop <addr> ends one of them. This is the recommended transport for SSH remote development.',
    },
  ],

  capsHead: {
    index: '04',
    title: 'What you can ask it',
    lede: 'The command line and the MCP tools sit on one implementation, so the answers match.',
  },
  capsColumns: { question: 'Question', cli: 'Command line', mcp: 'MCP tool' },
  capabilities: [
    { question: 'Where is this symbol defined?', cli: 'codegraph query', mcp: 'codegraph_search' },
    { question: 'How does this area work?', cli: 'codegraph export', mcp: 'codegraph_explore' },
    {
      question: 'Give me its source and its call trail',
      cli: 'codegraph query --json',
      mcp: 'codegraph_node',
    },
    { question: 'Who calls it?', cli: 'codegraph callers', mcp: 'codegraph_callers' },
    { question: 'What does it call?', cli: 'codegraph callees', mcp: 'codegraph_callees' },
    { question: 'What does changing it touch?', cli: 'codegraph impact', mcp: 'codegraph_impact' },
    { question: 'Which files did this change affect?', cli: 'codegraph affected', mcp: '—' },
    { question: 'Is the index ready?', cli: 'codegraph status', mcp: 'codegraph_status' },
  ],
  capsNote:
    'impact returns the transitive closure, not one layer of callers — which is the main thing it does that walking the call chain by hand does not. export can order the whole graph by PageRank centrality, which is how you find the real hubs in a repository you have never seen.',

  installHead: {
    index: '05',
    title: 'Install and first run',
    lede:
      'The one-liner detects your platform, downloads the matching prebuilt binary and puts it on your PATH — no Rust toolchain, no compile wait. It is not published to crates.io, so the registry path of a plain cargo install will not find it; with a Rust toolchain, use the --git form below.',
  },
  installLabel: 'Install',
  install: [
    { note: 'Linux and macOS', command: INSTALL_SH },
    { note: 'Windows (PowerShell 5.1+)', command: INSTALL_PS },
    { note: 'or from source — not published to crates.io', command: CARGO_GIT },
  ],
  usageLabel: 'First run',
  usage: [
    { note: 'build the index into ./.codegraph/', command: 'codegraph init && codegraph index' },
    { note: 'look a symbol up', command: 'codegraph query "GraphTraverser" -p .' },
    { note: 'see what changing it would reach', command: 'codegraph impact GraphTraverser' },
    { note: 'wire the MCP server into installed agents', command: 'codegraph install --yes' },
  ],
  installNote:
    'Set CODEGRAPH_VERSION to pin a release instead of taking the latest. In CI, CODEGRAPH_NO_DAEMON=1 forces foreground mode; pass --no-watch to skip file watching. Exclude patterns live in .codegraph/config.toml under [indexing] exclude, custom extension mappings in .codegraph/codegraph.json.',

  langHead: {
    index: '06',
    title: 'Language support',
    lede:
      '38 languages are parsed, but not to the same depth — and the depth is the number that matters. The three tiers below are graded by extraction depth; do not collapse them into "supports 38 languages".',
  },
  langColumns: { tier: 'Tier', depth: 'Extraction depth', count: 'Count', languages: 'Languages' },
  langTiers: [
    { tier: 'Tier 1', depth: 'Full symbol extraction', count: '29', languages: TIER_1 },
    { tier: 'Tier 2', depth: 'Embedded / template extraction', count: '6', languages: TIER_2 },
    { tier: 'Tier 3', depth: 'File level only', count: '3', languages: TIER_3 },
  ],
  langNote:
    'In tier 2, symbols come from the scripts and template markup embedded in a host file, so the granularity depends on how that file was written. Tier 3 records files and the relationships between them, with no symbol-level call graph. The language set is fixed and there is no heuristic fallback — a file is either in the table or it is not in the graph.',

  platHead: {
    index: '07',
    title: 'Platforms',
    lede:
      'Six prebuilt targets, published as codegraph-<version>-<target>.<ext>. Linux builds are statically linked against musl — no glibc dependency and no system SQLite.',
  },
  platColumns: { platform: 'Platform', arch: 'Arch', target: 'Target triple', ext: 'Format' },
  platforms: [
    {
      platform: 'Linux',
      arch: 'x86_64 (musl, static)',
      target: 'x86_64-unknown-linux-musl',
      ext: '.tar.gz',
    },
    {
      platform: 'Linux',
      arch: 'aarch64 (musl, static)',
      target: 'aarch64-unknown-linux-musl',
      ext: '.tar.gz',
    },
    { platform: 'macOS', arch: 'x86_64', target: 'x86_64-apple-darwin', ext: '.tar.gz' },
    {
      platform: 'macOS',
      arch: 'aarch64 (Apple Silicon)',
      target: 'aarch64-apple-darwin',
      ext: '.tar.gz',
    },
    { platform: 'Windows', arch: 'x86_64', target: 'x86_64-pc-windows-msvc', ext: '.zip' },
    { platform: 'Windows', arch: 'aarch64 (ARM64)', target: 'aarch64-pc-windows-msvc', ext: '.zip' },
  ],
  platNote:
    'You can also download an archive straight off the releases page, extract it, and put codegraph on your PATH.',

  stackHead: {
    index: '08',
    title: 'Stack and storage',
    lede: 'Every choice here serves the same goal: one binary, no external dependency, reproducible output.',
  },
  stack: [
    { term: 'Language', value: 'Rust, Edition 2024. Shipped as a single executable with no runtime.' },
    {
      term: 'Parsing',
      value: 'tree-sitter, one grammar per language, plus cross-file symbol resolution.',
    },
    {
      term: 'Storage',
      value: 'Per-project SQLite with FTS5 for full-text search. SQLite is statically linked, so nothing needs installing on the host.',
    },
    {
      term: 'Index location',
      value: '.codegraph/ inside the repository — codegraph.db and its WAL, config.toml, codegraph.json, and the daemon\u2019s pid, socket and log.',
    },
    {
      term: 'Command line',
      value: 'Clap subcommands, with completion scripts for five shells shipped in the binary.',
    },
    {
      term: 'Background process',
      value: 'A per-project shared daemon over a Unix socket, watching files and updating the index incrementally; it exits once all clients disconnect and the idle timeout elapses.',
    },
    {
      term: 'Network',
      value: 'Indexing and querying are entirely offline. The HTTP transport binds 127.0.0.1 by default.',
    },
    { term: 'Licence', value: 'MIT.' },
  ],

  limitsHead: {
    index: '09',
    title: 'What it does not do',
    lede: 'Stating the boundary is worth more than listing another feature — especially for a tool this easy to mistake for something else.',
  },
  limits: [
    {
      index: '01',
      term: 'No similarity retrieval',
      body: 'No embeddings, no vector store, no turning a question into a vector and looking for near neighbours. It answers structural questions using edges that genuinely exist in the syntax tree. If you want to find code by "roughly what it means", this is the wrong tool.',
    },
    {
      index: '02',
      term: 'No judgement',
      body: 'It tells you the call relationships and the blast radius, not whether the code is any good or whether it has a bug. Types stay the compiler\u2019s job, style the linter\u2019s, correctness the test suite\u2019s.',
    },
    {
      index: '03',
      term: 'Cross-file resolution is best effort',
      body: 'Cross-file symbol resolution is name-based, so an ambiguous call returns several candidates. Dynamic dispatch, reflection and calls assembled at runtime are invisible to static parsing.',
    },
    {
      index: '04',
      term: 'The index is not instantaneous',
      body: 'The daemon lags file writes by roughly a second. Query immediately after an edit and you may read the previous version; tool responses flag which files are pending re-index.',
    },
    {
      index: '05',
      term: 'The language set is fixed',
      body: 'A language outside those 38 is not heuristically "parsed as best we can" — it simply does not enter the graph. That is a deliberate trade: better to under-collect than to emit edges nothing supports.',
    },
  ],

  closeLabel: 'Get it',
  closeTitle: 'Run init once in any repository',
  closeBody:
    'Prebuilt binaries, the one-line installer and a source build are all below. It is an MIT-licensed personal project; issues and pull requests live in the same repository.',
  backHome: 'Back to FirLab',
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, CodeGraphContent>;

export function getCodeGraphContent(lang: Lang): CodeGraphContent {
  return content[lang];
}
