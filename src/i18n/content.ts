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
 *   - Voltip's Android app is built and tested but not released. It is never
 *     listed as available; the entry says "in development".
 *   - Voltip's on-device path keeps audio on the computer; the cloud and AI
 *     polish paths send audio or text to the service the user chose. Never
 *     flatten that to "nothing leaves your machine".
 *   - Lockra reads Microsoft Authenticator accounts only from that app's
 *     database on a rooted Android phone (the app has no export), and work or
 *     school accounts cannot be moved. Never state the import without that
 *     condition. Lockra itself makes no network connections at all.
 *
 * ORDER IS MEANING. The array order is the index order, and it is sorted by
 * maturity, not by age — pt-tools leads because it is the most released thing
 * here (published Docker images, 136 stars). Reordering this array
 * without also renumbering `index` and each detail page's `eyebrow` leaves the
 * site contradicting itself.
 */

import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Lang } from './ui';
import {
  AGENTLENS_RELEASED,
  AGENTLENS_VERSION,
  codegraphReleased,
  codegraphVersion,
  LOCKRA_RELEASED,
  LOCKRA_VERSION,
  pttoolsReleased,
  pttoolsVersion,
  VOLTIP_RELEASED,
  VOLTIP_VERSION,
} from './versions';

export type Status = 'live' | 'early' | 'wip';
export type Weight = 'lead' | 'major' | 'standard' | 'pending';
export type ProductId = 'pttools' | 'codegraph' | 'agentlens' | 'voltip' | 'lockra';

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
  /**
   * Path to the in-site detail page, relative to the locale root. A product whose
   * own site is published under a path of firlab.app (pt-tools at `/pt-tools/`, Lockra at
   * `/lockra/`) gives that site's absolute path in this locale instead; see `productHref`.
   */
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
const VOLTIP_REPO = 'https://github.com/sunerpy/voltip';
const VOLTIP_SITE = 'https://voltip.firlab.app';
const LOCKRA_REPO = 'https://github.com/sunerpy/lockra';

const zh: PageContent = {
  title: 'FirLab — 本地优先的开发者工具',
  description:
    'PT 站点订阅与统计的自动化工具、确定性的代码知识图谱、编码 Agent 的用量归档、按住说话、文字直接出现在光标处的语音输入，以及不联网的两步验证器。五个自部署的工具，作者 sunerpy。',
  ogAlt: 'FirLab — sunerpy 构建的开发者工具',

  // No trailing 。 — a full-width period at display size opens a visible hole
  // at the end of the line, and Chinese display headings conventionally omit it.
  heroHeadline: '五个工具，数据都留在你自己的机器上',
  heroLede:
    '目前五个：PT 站点的订阅与统计自动化、确定性的代码知识图谱、编码 Agent 的用量归档、按住说话、文字出现在光标处的语音输入，以及不联网的两步验证器。全部自部署，索引、归档和凭据都落在你运行它的那台机器上。',
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
      detail: '/pt-tools/',
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
      id: 'voltip',
      index: '04',
      name: 'Voltip',
      role: '按住说话的语音输入 · 桌面应用',
      status: 'early',
      weight: 'standard',
      version: VOLTIP_VERSION,
      released: VOLTIP_RELEASED,
      detail: 'voltip/',
      body: '按住快捷键说话，松开后文字出现在当前应用的光标处。识别可以用本机的模型完成，音频不离开电脑；也可以交给内置服务或你选择的云端服务。插入之前，文字还可以经过 AI 润色、个人词典和替换规则。Windows、macOS 与 Linux 各有安装包；把 Android 手机当作麦克风和键盘的应用正在开发，尚未发布。',
      specs: [
        {
          term: '触发',
          value: '按住 Ctrl+Alt+Space 说话，或按一次开始、再按一次结束；也可以只用一个按键或鼠标侧键。',
        },
        {
          term: '识别',
          value:
            '本地模型 Qwen3-ASR（0.6B 与 1.7B）、SenseVoice 与 Paraformer；Qwen3-ASR 在 Windows 和 Linux 上通过 Vulkan、在 macOS 上通过 Metal 使用显卡。云端可用 OpenAI、Groq、硅基流动或任意 OpenAI 兼容接口。',
        },
        {
          term: '整理',
          value: 'AI 润色修正标点、错字和口头禅；词典纠正人名与术语，替换规则改写固定短语，场景按当前应用切换这些设置。',
        },
        {
          term: '插入',
          value: '粘贴到光标处，或只复制到剪贴板；可以整段插入、逐句插入，也可以边说边输入。',
        },
        {
          term: '平台',
          value: 'Windows 10/11、macOS 11 及以上（Apple 芯片与 Intel）、Linux x64（X11 与 Wayland）。Apache-2.0 许可。',
        },
        { term: '技术栈', value: 'Rust · Tauri 2 · React 19。' },
      ],
      links: [
        { label: '网站', href: `${VOLTIP_SITE}/zh/` },
        { label: '仓库', href: VOLTIP_REPO },
        { label: '发布页', href: `${VOLTIP_REPO}/releases` },
      ],
    },
    {
      id: 'lockra',
      index: '05',
      name: 'Lockra',
      role: '离线的两步验证器 · 桌面应用',
      status: 'early',
      weight: 'standard',
      version: LOCKRA_VERSION,
      released: LOCKRA_RELEASED,
      detail: '/lockra/zh/',
      body: '把两步验证码保存在本机的一个加密文件里，点一下账号就复制当前的验证码。可以拍下 Google 身份验证器的导出二维码迁入账号，也可以读取已 root 的 Android 手机上 Microsoft Authenticator 的数据库；反过来也能生成二维码迁回手机。Lockra 不建立任何网络连接，主密码忘记后无法找回。',
      specs: [
        {
          term: '验证码',
          value: 'TOTP 与 HOTP，SHA1、SHA256 或 SHA512，6 到 8 位，任意周期。复制 30 秒后，剪贴板里若还是这个验证码就清空。',
        },
        {
          term: '迁移',
          value:
            '迁入：Google 身份验证器的导出二维码、已 root 的 Android 手机上 Microsoft Authenticator 的数据库、otpauth 链接与列表。迁出：给这两个应用的二维码。工作或学校账号无法迁移。',
        },
        {
          term: '备份',
          value: '加密的 .lockrabackup 文件。每次改动后几秒自动写入你选择的文件夹，默认保留最近 10 份；恢复时可以逐个合并，也可以整体替换。',
        },
        {
          term: '保护',
          value: '保险库用主密码派生的密钥加密（Argon2id、XChaCha20-Poly1305），可选用系统钥匙串记住本机；默认空闲 5 分钟自动锁定。',
        },
        {
          term: '平台',
          value: 'Windows 10/11、macOS 11 及以上（Apple 芯片与 Intel）、Linux，均有 x64 与 ARM64 安装包。Apache-2.0 许可。',
        },
        { term: '技术栈', value: 'Rust · Tauri 2 · React 19。' },
      ],
      links: [
        { label: '仓库', href: LOCKRA_REPO },
        { label: '发布页', href: `${LOCKRA_REPO}/releases` },
      ],
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
    'Private-tracker automation, deterministic code knowledge graph, usage archives for coding agents, push-to-talk dictation that types at your cursor, and an offline two-factor authenticator. Self-hosted.',
  ogAlt: 'FirLab — developer tools by sunerpy',

  heroHeadline: 'Five tools that keep your data on your own machine.',
  heroLede:
    'Five so far: feed, search and statistics automation for private trackers, a deterministic code knowledge graph, a usage archive for coding agents, push-to-talk dictation that types at your cursor, and a two-factor authenticator that never goes online. All self-hosted — the index, the archive and the credentials stay on the host you run them on.',
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
      detail: '/pt-tools/en/',
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
      id: 'voltip',
      index: '04',
      name: 'Voltip',
      role: 'Push-to-talk dictation · desktop',
      status: 'early',
      weight: 'standard',
      version: VOLTIP_VERSION,
      released: VOLTIP_RELEASED,
      detail: 'voltip/',
      body: 'Hold a shortcut, speak, and let go: the text appears at the cursor in whatever app you are in. Recognition runs on a model on your computer, so no audio leaves it, or on the built-in service or a cloud provider you choose. Before it is inserted, the text can pass through AI polish, a personal dictionary and replacement rules. There are packages for Windows, macOS and Linux; an Android app that makes a phone the microphone and keyboard is in development and not released.',
      specs: [
        {
          term: 'Trigger',
          value:
            'Hold Ctrl+Alt+Space to talk, or press once to start and again to stop; a single key or a mouse side button works too.',
        },
        {
          term: 'Recognition',
          value:
            'On-device Qwen3-ASR (0.6B and 1.7B), SenseVoice and Paraformer; Qwen3-ASR uses the graphics card through Vulkan on Windows and Linux and Metal on macOS. In the cloud: OpenAI, Groq, SiliconFlow or any OpenAI-compatible endpoint.',
        },
        {
          term: 'Clean-up',
          value:
            'AI polish fixes punctuation, typos and filler words; the dictionary corrects names and terms, replacement rules rewrite fixed phrases, and scenes switch all of it by app.',
        },
        {
          term: 'Insertion',
          value:
            'Pasted at the cursor or only copied to the clipboard; all at once, sentence by sentence, or as you speak.',
        },
        {
          term: 'Platforms',
          value:
            'Windows 10/11, macOS 11 or later (Apple silicon and Intel), Linux x64 (X11 and Wayland). Apache-2.0.',
        },
        { term: 'Stack', value: 'Rust · Tauri 2 · React 19.' },
      ],
      links: [
        { label: 'Website', href: VOLTIP_SITE },
        { label: 'Repository', href: VOLTIP_REPO },
        { label: 'Releases', href: `${VOLTIP_REPO}/releases` },
      ],
    },
    {
      id: 'lockra',
      index: '05',
      name: 'Lockra',
      role: 'Offline two-factor authenticator · desktop app',
      status: 'early',
      weight: 'standard',
      version: LOCKRA_VERSION,
      released: LOCKRA_RELEASED,
      detail: '/lockra/',
      body: 'Keeps your two-factor codes in one encrypted file on your computer; click an account to copy its current code. Move accounts in by photographing Google Authenticator’s export codes, or by reading Microsoft Authenticator’s database from a rooted Android phone, and back out to either app as QR codes. Lockra makes no network connections, and a forgotten master password cannot be recovered.',
      specs: [
        {
          term: 'Codes',
          value:
            'TOTP and HOTP, SHA1, SHA256 or SHA512, 6 to 8 digits, any period. A copied code is cleared from the clipboard after 30 seconds if it is still there.',
        },
        {
          term: 'Moving accounts',
          value:
            'In: Google Authenticator’s export codes, Microsoft Authenticator’s database from a rooted Android phone, otpauth links and lists. Out: QR codes for either app. Work and school accounts cannot be moved.',
        },
        {
          term: 'Backups',
          value:
            'Encrypted .lockrabackup files. A few seconds after every change one goes to a folder you choose, and the newest 10 are kept by default; restore account by account or in full.',
        },
        {
          term: 'Protection',
          value:
            'The vault is encrypted with a key derived from the master password (Argon2id, XChaCha20-Poly1305), optionally remembered in the system keychain; it locks after five idle minutes by default.',
        },
        {
          term: 'Platforms',
          value:
            'Windows 10/11, macOS 11 or later (Apple silicon and Intel) and Linux, with x64 and ARM64 installers. Apache-2.0.',
        },
        { term: 'Stack', value: 'Rust · Tauri 2 · React 19.' },
      ],
      links: [
        { label: 'Repository', href: LOCKRA_REPO },
        { label: 'Releases', href: `${LOCKRA_REPO}/releases` },
      ],
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

/**
 * The URL of a product's page. Every link to it goes through here, so a product
 * with an absolute `detail` cannot be sent through the locale prefix by one
 * surface and not another: Lockra's English site is `/lockra/`, and
 * `getRelativeLocaleUrl('en', 'lockra/')` would make that `/en/lockra/`, which
 * does not exist.
 */
export function productHref(lang: Lang, product: Pick<Product, 'detail'>): string {
  return product.detail.startsWith('/') ? product.detail : getRelativeLocaleUrl(lang, product.detail);
}

export function getContent(lang: Lang): PageContent {
  return content[lang];
}
