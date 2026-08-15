/**
 * AgentLens detail-page content, per locale.
 *
 * Same split as `content.ts`: this is long-form prose and structured detail, so
 * it lives in a typed object rather than a flat dotted-key map. `en` is typed
 * against the Chinese shape, so a section added to one language and forgotten
 * in the other is a compile error.
 *
 * Every claim here was checked against the product's own README and shipped
 * release. The load-bearing ones, which must never be softened or embellished:
 *   - Release metadata comes from `versions.ts`. Early. Not "mature", not
 *     "production-grade".
 *   - Unknown cost is marked missing, NEVER rendered as zero.
 *   - Remote collection is read-only.
 *   - Windows has had real-machine install + GUI acceptance. Linux and macOS
 *     are packaged but have NOT had the equivalent real-machine verification.
 *     That asymmetry is stated on the page on purpose.
 *   - FirLab is one person's project umbrella. No "we", no team, no sales.
 */

import type { Lang } from './ui';
import type { InstallLine, Spec } from './content';
import { AGENTLENS_RELEASED, AGENTLENS_VERSION } from './versions';

export const AGENTLENS_REPO = 'https://github.com/sunerpy/AgentLens';
export const AGENTLENS_RELEASES = `${AGENTLENS_REPO}/releases`;

/** A numbered page section. `label` is the mono rail caption. */
export interface SectionMeta {
  id: string;
  num: string;
  label: string;
  heading: string;
}

export interface TermBody {
  term: string;
  body: string;
}

export interface NumberedItem extends TermBody {
  index: string;
}

export interface Figure {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface AgentLensContent {
  title: string;
  description: string;
  ogAlt: string;

  eyebrow: string;
  role: string;
  lede: string;
  /** Leading sentence of the lede, set a step stronger. */
  ledeAccent: string;

  tocLabel: string;
  backToIndex: string;

  problem: SectionMeta & { paras: string[]; whoLabel: string; who: TermBody[] };
  screens: SectionMeta & { intro: string; figureLabel: string; figures: Figure[] };
  capabilities: SectionMeta & { groups: TermBody[] };
  guarantees: SectionMeta & { items: NumberedItem[] };
  cost: SectionMeta & { intro: string; buckets: TermBody[]; ruleLabel: string; rule: string };
  install: SectionMeta & {
    intro: string;
    packagesLabel: string;
    packages: { platform: string; artifact: string }[];
    commandsLabel: string;
    lines: InstallLine[];
    afterLabel: string;
    after: string;
  };
  stack: SectionMeta & { specs: Spec[] };
  maturity: SectionMeta & {
    paras: string[];
    verifiedLabel: string;
    verified: TermBody[];
    testsLabel: string;
    tests: string;
  };
  links: SectionMeta & { items: { label: string; href: string }[] };
}

const zh: AgentLensContent = {
  title: 'AgentLens — 编码 Agent 用量归档 · FirLab',
  description:
    '一个跨平台桌面看板，把本机与 SSH 远端上 OpenCode、Claude Code、Codex 与 Hermes 的用量记录汇总进同一份持久 SQLite 归档，按时区、Agent、模型与项目切分。未知成本标记为缺失，绝不渲染成 0。',
  ogAlt: 'AgentLens — 编码 Agent 用量归档，由 sunerpy 构建',

  eyebrow: '03 · 产品',
  role: '编码 Agent 用量归档 · 跨平台桌面应用',
  ledeAccent: '一个桌面看板，回答「这些 Agent 到底做了什么、在哪台机器上做的」。',
  lede: '几台机器、四种编码 Agent、几万条会话之后，「这个月跑了多少、花在哪、哪台机器上跑的」就没人能凭记忆回答了。AgentLens 把这些记录采到一处，然后老实告诉你哪些数字算得准、哪些算不准。',

  tocLabel: '本页内容',
  backToIndex: '返回 FirLab 目录',

  problem: {
    id: 'problem',
    num: '01',
    label: '问题',
    heading: '它解决的问题',
    paras: [
      '编码 Agent 的用量记录各自散在本地数据库里：OpenCode 一份、Claude Code 一份、Codex 一份、Hermes 一份。字段口径不一样，轮转策略不一样，也没有哪个地方能把它们放在一起看趋势。',
      '只在一台机器上用一个 Agent 的话，翻它自己的界面就够了。麻烦从第二台机器开始 —— 工作站、构建机、云上的开发容器各跑各的，谁也说不出总数；等某台机器被重装或者数据目录被清空，那段历史就直接消失了。',
      '再往下一层是成本。多数工具给你一个总金额，但不说清这个金额里有多少是上游返回的真实计费、多少是本地按价目表估的、又有多少记录根本查不到价格。三种数据相加得到的数字看着精确，实际上不能用来做任何判断。',
    ],
    whoLabel: '谁会需要',
    who: [
      {
        term: '多机开发者',
        body: '本机加上远端构建机或开发容器，用量分散在几台机器上，没有一个合起来的视图。',
      },
      {
        term: '混用多个 Agent 的人',
        body: 'OpenCode、Claude Code、Codex 与 Hermes 换着用，四份记录的口径还不一致。',
      },
      {
        term: '需要对账的人',
        body: '想知道钱花在哪个模型、哪个项目、哪个 Agent 上，并且需要知道这个数字有多可信。',
      },
    ],
  },

  screens: {
    id: 'screens',
    num: '02',
    label: '界面',
    heading: '实际界面',
    intro:
      '四张实际截图，不是渲染图。除标注为深海蓝的那张，其余都是默认的「石墨浅色」主题；界面语言目前是中文。',
    figureLabel: '图',
    figures: [
      {
        src: '/agentlens/overview-content.png',
        width: 1144,
        height: 1392,
        alt: 'AgentLens 总览页的内容区：统计区间与粒度筛选，Token 用量卡、成本卡与消息会话卡三张并排，下方是按模型分组的用量趋势折线图，图右端有一段斜纹填充的断裂桶。',
        caption:
          '总览页，裁到内容区（原图是超宽窗口截图，两侧大片空白会把界面文字压得看不清）。Token 分成五个原子桶始终分列，不折叠成一个合计；成本卡最显眼的位置放的是每百万可计费 Token 的单价 —— 唯一能横向比较的那个数 —— 旁边标着它覆盖了多少条记录。趋势图里的斜纹块是没有数据覆盖的断裂桶，浅底块是部分覆盖：两者都不是 0。',
      },
      {
        src: '/agentlens/overview-by-model-dark.png',
        width: 1440,
        height: 1800,
        alt: '深海蓝主题下的 AgentLens 总览页，用量趋势按模型分组，多条彩色折线配一条虚线代表合并后的其他项。',
        caption:
          '同一张趋势图切到「按模型」分组，主题换成深海蓝。分组维度和主题都在标题栏就地切换，不用绕去设置页。曲线过多会读不出趋势，所以只画 Token 合计最高的几项，其余合并成一条「其他」。',
      },
      {
        src: '/agentlens/usage-drilldown.png',
        width: 1440,
        height: 960,
        alt: 'AgentLens 用量分析页的三级下钻表格：来源、agent、模型逐层展开，行内可见「成本缺失」标记和占比条。',
        caption:
          '用量分析页，来源 → agent → 模型 三级展开，区间与时区跟总览共用一份状态。查不到价格的行挂一个「成本缺失」标记，而不是填 0 —— 填 0 会让人以为这段用量是免费的。占比只按本级 Token 合计算，不跨级借基数。',
      },
      {
        src: '/agentlens/hosts.png',
        width: 972,
        height: 679,
        alt: 'AgentLens 主机管理页：本机主机卡与一台 SSH 远端主机卡并排堆叠，每张卡上都有独立的采集源勾选框。',
        caption:
          '主机页把本机和 SSH 远端并排放。采集源的开关做在每张主机卡上而不是设置页里 —— 同一个源在哪台机器上开、在哪台不开，本来就是两件事。默认只勾了 OpenCode。',
      },
    ],
  },

  capabilities: {
    id: 'capabilities',
    num: '03',
    label: '能力',
    heading: '能做什么',
    groups: [
      {
        term: '采集范围',
        body: '本机在首次打开主机页时自动注册，不用配置。远端主机通过 SSH 添加，点「测试连接」后机器标识哈希由探测结果自动填入。默认只采 OpenCode，Claude Code、Codex 与 Hermes 要在主机卡上逐个勾选 —— 第一次启用一个新源时那一轮要全量扫描它的数据目录，会比平时慢。',
      },
      {
        term: '分析维度',
        body: '按报表时区、Agent、模型、项目分组看趋势，也能一路下钻到单条记录。区间预设有今天、7 天、30 天、本季度、本年与自定义；粒度可以交给自动，也可以锁定到小时、天、周或月。',
      },
      {
        term: 'Token 口径',
        body: '输入、输出、推理、缓存读、缓存写五个原子桶始终分列，既不折叠成一个 total，也不去读源库自己算好的合计值。',
      },
      {
        term: '覆盖状况',
        body: '没有数据覆盖的桶和部分覆盖的桶在趋势图里画成不同的填充，而不是画成一条掉到 0 的线。缺数据和真的是 0，在图上必须能分清。',
      },
      {
        term: '定价回退',
        body: '同一个模型经不同网关接入时，价目表条目往往只挂在归属方名下，严格按 (provider, model) 匹配会大面积查不到价，所以允许跨 provider 回退。实测 251737 条记录，可定价比例从 0.1% 提到 99.4%。手工覆盖价是例外，仍然精确匹配，不外溢。',
      },
      {
        term: '刷新节奏',
        body: '本机与远端都能改成自动刷新，远端用一个独立的间隔，两者的下限都是 600 秒。',
      },
      {
        term: '时区一致性',
        body: '日历分桶只有一份实现，在 Rust 侧。前端一个日期库都没装，拿到的标签已经按报表时区成型，不会被二次换算到另一个时区 —— 所以各个页面的报表口径永远一致。',
      },
      {
        term: '凭据存放',
        body: 'SSH 口令只进操作系统钥匙串：Linux 走 Secret Service，Windows 走凭据管理器。不落配置文件，也不经 IPC 回传给界面。',
      },
    ],
  },

  guarantees: {
    id: 'guarantees',
    num: '04',
    label: '保证',
    heading: '三件不能出错的事',
    items: [
      {
        index: '01',
        term: '归档库是权威历史',
        body: '源库轮转、备份被删、远端数据目录被整个清空，已归档的记录都还在。归档库是本地一份 SQLite，带去重和按源的水位线；它不是源数据的缓存，而是比源活得更久的那一份。这一条是整个工具存在的前提 —— 一个会跟着源一起缩水的看板，等于没有历史。',
      },
      {
        index: '02',
        term: '远端采集只读',
        body: '静态链接的 musl 采集器推到远端，校验 SHA-256，就地执行，退出时清掉自己。它不写远端工具的任何数据。SSH 那一侧的远端命令是恒定的，变化的只有当作位置参数传进去的载荷，命令本身不参与字符串拼接。',
      },
      {
        index: '03',
        term: '未知成本不写 0',
        body: '查不到价格的记录标记为缺失，在界面上是一个「成本缺失」徽标，不是 0.0000。这条看着最小，但它决定了成本数字能不能用：一旦缺失被渲染成 0，任何求和、任何占比、任何「这个月比上个月省了多少」都是错的，而且错得看不出来。',
      },
    ],
  },

  cost: {
    id: 'cost',
    num: '05',
    label: '成本',
    heading: '成本是怎么算的',
    intro:
      '三种来源的金额始终分开保存，绝不相加成一个「总花费」。这是 AgentLens 与多数用量工具最实际的差别。',
    buckets: [
      {
        term: '上游自带金额',
        body: '记录里带有上游返回的计费金额。它用的是上游的价目表，和本地估算不可比，所以折叠在一个独立入口后面，不并进估算值。',
      },
      {
        term: '目录里查不到价',
        body: '模型在本地价目表里没有条目。这类记录连计费基数都不全，标记为「成本缺失」，不参与任何求和、任何占比。',
      },
      {
        term: '本地估算',
        body: '本机价目表乘以可计费 Token。这是唯一能横向比较的一栏，旁边始终标着它覆盖了多少条记录，让你自己判断这个估算可信到什么程度。',
      },
    ],
    ruleLabel: '结论',
    rule: '真正能跨模型、跨时间比较的只有每百万可计费 Token 的单价，所以成本卡把它放在最显眼的位置，而不是放那个看着最像账单的总金额 —— 因为那个总金额不是账单。',
  },

  install: {
    id: 'install',
    num: '06',
    label: '安装',
    heading: '装到自己机器上',
    intro:
      '预编译包三个。一行式脚本自己认平台，用发布清单校验 SHA-256，不自行提权。也可以从发布页下载后手工校验。',
    packagesLabel: '预编译包',
    packages: [
      { platform: 'Linux x86_64', artifact: '.deb' },
      { platform: 'Windows x64', artifact: 'NSIS 安装包' },
      { platform: 'macOS aarch64', artifact: '.dmg' },
    ],
    commandsLabel: '安装',
    lines: [
      {
        note: 'Linux 与 macOS',
        command:
          'curl -fsSL https://raw.githubusercontent.com/sunerpy/AgentLens/main/scripts/install.sh | bash',
      },
      {
        note: 'Windows，PowerShell',
        command: 'irm https://raw.githubusercontent.com/sunerpy/AgentLens/main/scripts/install.ps1 | iex',
      },
      {
        note: '不想把脚本管道给 shell —— 从发布页下载后手工校验',
        command: 'sha256sum -c sha256sums-linux.txt',
      },
      { note: '校验通过再装', command: 'sudo apt install ./AgentLens_*_amd64.deb' },
    ],
    afterLabel: '装完之后',
    after: '打开「主机管理」，本机会自动注册。要采远端就添加 SSH 主机、点「测试连接」，然后在主机卡上勾选要采的源 —— 默认只有 OpenCode 是开的。',
  },

  stack: {
    id: 'stack',
    num: '07',
    label: '技术栈',
    heading: '怎么搭起来的',
    specs: [
      {
        term: '后端',
        value:
          'Rust。核心 crate 负责归档、解析、聚合与 SSH 传输；远端采集器是独立的静态 musl 单文件；口令助手是 SSH_ASKPASS 的对端，随包分发。',
      },
      { term: '桌面壳', value: 'Tauri 2 —— 宿主进程、IPC 命令与托盘。' },
      {
        term: '前端',
        value: 'React 18 加 Vite，Tailwind CSS 4 做样式，Recharts 画图，TanStack Query 管数据。',
      },
      {
        term: '存储',
        value:
          'SQLite，经 rusqlite 静态链接进二进制，不需要额外安装系统库。归档库带去重和按源的水位线。',
      },
      {
        term: '类型契约',
        value: 'Rust 与 TypeScript 之间的类型由 ts-rs 从 Rust 侧生成，不是手写的，边界不会悄悄漂移。',
      },
      {
        term: '打包',
        value: 'Linux .deb、Windows NSIS 安装包、macOS aarch64 .dmg。',
      },
    ],
  },

  maturity: {
    id: 'maturity',
    num: '08',
    label: '成熟度',
    heading: '成熟度，说清楚',
    paras: [
      `${AGENTLENS_VERSION}，发布于 ${AGENTLENS_RELEASED}。这是一个早期版本：能装、能用、每天在用，但版本号就是它的实际状态，没有必要包装成别的样子。界面还在改，数据口径会继续收紧。`,
      '三平台的 CI 矩阵在 main 上全绿，三平台也都在构建流水线上出过真实安装包。但绿灯只说明缺陷没有复现，不说明产品在那台机器上能起来 —— 这两件事之间的距离，值得写在这里。',
    ],
    verifiedLabel: '真机验收的实际状态',
    verified: [
      {
        term: 'Windows：已验收',
        body: '在 Windows Server 上装包、启动，25 条机器可判定的 GUI 断言全过。',
      },
      {
        term: 'Linux 与 macOS：只到出包',
        body: '两个平台都能出安装包，但没有做过同样的真机启动验收。这不是「应该没问题」，是「没验过」。',
      },
    ],
    testsLabel: '测试规模',
    tests:
      'Rust workspace 426 条，Vitest 560 条，Playwright 组件级 151 条（mock IPC），WebdriverIO 8 个 spec 跑在真 Tauri WebView 上、对一份 15.5 万行的归档库；行覆盖率实测 92.72%，下限 90% 在 CI 里强制。这些数字说明代码被测过，不说明每个平台的安装包都被人手动打开过。',
  },

  links: {
    id: 'links',
    num: '09',
    label: '链接',
    heading: '源码与下载',
    items: [
      { label: '仓库', href: AGENTLENS_REPO },
      { label: '发布页', href: AGENTLENS_RELEASES },
    ],
  },
};

const en: AgentLensContent = {
  title: 'AgentLens — usage archive for coding agents · FirLab',
  description:
    'Desktop dashboard archiving OpenCode, Claude Code, Codex and Hermes usage from local and SSH hosts in one SQLite store. Unknown cost is missing, not zero.',
  ogAlt: 'AgentLens — usage archive for coding agents, built by sunerpy',

  eyebrow: '03 · Product',
  role: 'Usage archive for coding agents · cross-platform desktop app',
  ledeAccent:
    'A desktop dashboard for the question “what have these agents actually been doing, and on which machines”.',
  lede: 'After a few machines, four coding agents and tens of thousands of sessions, nobody can answer “how much ran this month, where did it go, and on which host” from memory. AgentLens pulls those records into one place, then tells you honestly which of its numbers are trustworthy and which are not.',

  tocLabel: 'On this page',
  backToIndex: 'Back to the FirLab index',

  problem: {
    id: 'problem',
    num: '01',
    label: 'Problem',
    heading: 'The problem it solves',
    paras: [
      "Coding-agent usage records sit in separate local databases: one for OpenCode, one for Claude Code, one for Codex, one for Hermes. They don't agree on field semantics, they don't rotate the same way, and there is nowhere that puts them side by side.",
      'One agent on one machine needs none of this — its own UI is enough. Trouble starts at the second machine: a workstation, a build box, a dev container in the cloud, each accumulating its own history, none of them knowing the total. And when one of those machines is reimaged or its data directory is wiped, that stretch of history is simply gone.',
      'Then there is cost. Most tools hand you one figure without saying how much of it is real upstream billing, how much is a local estimate from a price catalogue, and how many records had no price at all. Add those three together and you get a number that looks precise and cannot support a single decision.',
    ],
    whoLabel: 'Who this is for',
    who: [
      {
        term: 'Developers on several machines',
        body: 'A local host plus a remote build box or dev container, with usage spread across all of them and no combined view.',
      },
      {
        term: 'People running more than one agent',
        body: 'OpenCode, Claude Code, Codex and Hermes in rotation — four sets of records that do not measure the same things the same way.',
      },
      {
        term: 'Anyone reconciling spend',
        body: 'You want to know which model, which project and which agent the money went to, and how much to trust the number.',
      },
    ],
  },

  screens: {
    id: 'screens',
    num: '02',
    label: 'Interface',
    heading: 'The actual interface',
    intro:
      'Four real screenshots, not renders. All in the default Graphite Light theme except the one marked Deep Blue. The interface currently ships in Chinese.',
    figureLabel: 'Fig.',
    figures: [
      {
        src: '/agentlens/overview-content.png',
        width: 1144,
        height: 1392,
        alt: 'The content area of the AgentLens overview page: range and granularity filters, a token usage card, a cost card and a messages-and-sessions card side by side, and below them a usage trend line chart grouped by model with a hatched break bucket at its right edge.',
        caption:
          'The overview page, cropped to the content area — the original is an ultrawide window capture whose empty side margins would shrink the interface text past reading. Tokens stay split across five atomic buckets rather than collapsing into one total. The most prominent figure on the cost card is the price per million billable tokens — the only number that compares across models — with a note beside it saying how many records the estimate covers. In the chart, hatched blocks are buckets with no data coverage and tinted blocks are partial coverage. Neither is zero.',
      },
      {
        src: '/agentlens/overview-by-model-dark.png',
        width: 1440,
        height: 1800,
        alt: 'The AgentLens overview page in the Deep Blue theme, with the usage trend grouped by model: several coloured lines plus a dashed line for the merged remainder.',
        caption:
          'The same trend chart grouped by model, in the Deep Blue theme. Grouping and theme both switch in place from the title bar — no trip to a settings page. Too many lines make a trend unreadable, so only the highest-volume series are drawn and the rest merge into one “other” line.',
      },
      {
        src: '/agentlens/usage-drilldown.png',
        width: 1440,
        height: 960,
        alt: 'The AgentLens usage analysis page: a three-level drilldown through source, agent and model, with visible “cost missing” badges and share bars inside the rows.',
        caption:
          'Usage analysis, drilling source → agent → model, sharing range and timezone state with the overview. A row with no price carries a “cost missing” badge instead of a zero — a zero would read as “this usage was free”. Share is computed against the total at that level only; it never borrows a denominator from the level above.',
      },
      {
        src: '/agentlens/hosts.png',
        width: 972,
        height: 679,
        alt: 'The AgentLens hosts page: a card for the local machine stacked above a card for an SSH remote host, each with its own set of collection-source checkboxes.',
        caption:
          'The hosts page puts the local machine and SSH remotes side by side. Source toggles live on each host card rather than in settings, because whether a source is collected on this machine and on that one are genuinely two different decisions. Only OpenCode is enabled by default.',
      },
    ],
  },

  capabilities: {
    id: 'capabilities',
    num: '03',
    label: 'Capabilities',
    heading: 'What it does',
    groups: [
      {
        term: 'Collection scope',
        body: 'The local machine registers itself the first time you open the hosts page — nothing to configure. Remote hosts are added over SSH; hit “test connection” and the machine-identity hash is filled in from the probe. Only OpenCode is collected by default; Claude Code, Codex and Hermes are each enabled per host card. The first run after enabling a new source has to scan its whole data directory, so it is slower than the rest.',
      },
      {
        term: 'Analysis',
        body: 'Trends grouped by reporting timezone, agent, model or project, with a drilldown all the way to the individual record. Range presets cover today, 7 days, 30 days, quarter, year and custom; granularity is automatic or pinned to hour, day, week or month.',
      },
      {
        term: 'Token accounting',
        body: 'Input, output, reasoning, cache read and cache write stay as five separate atomic buckets. They are never folded into one total, and the source database\u2019s own precomputed total is never read.',
      },
      {
        term: 'Coverage',
        body: 'Buckets with no data and buckets with partial data get distinct fills in the chart rather than a line dropping to zero. Missing data and a genuine zero have to be distinguishable at a glance.',
      },
      {
        term: 'Pricing fallback',
        body: 'When one model is reached through different gateways, the catalogue entry usually hangs off the owning provider only, so matching strictly on (provider, model) leaves large stretches unpriced. Cross-provider fallback is therefore allowed: measured over 251737 records, the priceable share went from 0.1% to 99.4%. Manual price overrides are the exception — they still match exactly and never spill.',
      },
      {
        term: 'Refresh',
        body: 'Local and remote collection can both be set to refresh automatically, remote on its own interval. The floor for both is 600 seconds.',
      },
      {
        term: 'Timezone consistency',
        body: 'Calendar bucketing has exactly one implementation, in the Rust backend. The frontend ships no date library at all; labels arrive already bucketed in the reporting timezone and are never converted a second time. That is why every page reports the same numbers.',
      },
      {
        term: 'Credentials',
        body: 'SSH secrets go only into the OS keychain — Secret Service on Linux, Credential Manager on Windows. They never land in a config file and are never handed back to the UI over IPC.',
      },
    ],
  },

  guarantees: {
    id: 'guarantees',
    num: '04',
    label: 'Guarantees',
    heading: 'Three things it must not get wrong',
    items: [
      {
        index: '01',
        term: 'The archive is authoritative history',
        body: 'When a source database rotates, a backup is deleted, or a remote data directory is wiped entirely, the archived records are still there. The archive is one local SQLite database with deduplication and a per-source watermark. It is not a cache of the sources; it is the copy that outlives them. This is the premise the whole tool rests on — a dashboard that shrinks along with its sources has no history at all.',
      },
      {
        index: '02',
        term: 'Remote collection only reads',
        body: 'A statically linked musl collector is pushed to the remote, its SHA-256 verified, executed in place, and it removes itself on exit. It writes none of the remote tool\u2019s data. The remote command on the SSH side is constant; only the payload passed as a positional argument varies, so the command itself is never assembled by string concatenation.',
      },
      {
        index: '03',
        term: 'An unknown cost is never written as zero',
        body: 'A record with no price is marked missing and shows a “cost missing” badge, not 0.0000. It looks like the smallest of the three, and it is the one that decides whether the cost figures are usable at all: once missing renders as zero, every sum, every share and every “we spent less than last month” is wrong — and wrong in a way you cannot see.',
      },
    ],
  },

  cost: {
    id: 'cost',
    num: '05',
    label: 'Cost',
    heading: 'How cost is computed',
    intro:
      'Three kinds of amount are kept apart and never added into one “total spend”. This is the most practical difference between AgentLens and most usage tools.',
    buckets: [
      {
        term: 'Upstream amount included',
        body: 'The record carries a billed amount returned by the provider. It came from someone else\u2019s price list and is not comparable with a local estimate, so it sits behind its own entry point and is never merged into the estimate.',
      },
      {
        term: 'No price in the catalogue',
        body: 'The model has no entry in the local price list. These records do not even have a complete billable base, so they are marked “cost missing” and take part in no sum and no share.',
      },
      {
        term: 'Local estimate',
        body: 'The local price list multiplied by billable tokens. This is the one column that compares across rows, and it always carries the count of records it covers so you can judge for yourself how much the estimate is worth.',
      },
    ],
    ruleLabel: 'The upshot',
    rule: 'The only figure that genuinely compares across models and across time is the price per million billable tokens, so that is what the cost card puts front and centre — not the grand total, which is the number that most looks like a bill and is not one.',
  },

  install: {
    id: 'install',
    num: '06',
    label: 'Install',
    heading: 'Getting it onto your machine',
    intro:
      'Three prebuilt packages. The one-line script detects the platform, verifies SHA-256 against the release manifest, and does not elevate on its own. You can also download from the releases page and verify by hand.',
    packagesLabel: 'Prebuilt packages',
    packages: [
      { platform: 'Linux x86_64', artifact: '.deb' },
      { platform: 'Windows x64', artifact: 'NSIS installer' },
      { platform: 'macOS aarch64', artifact: '.dmg' },
    ],
    commandsLabel: 'Install',
    lines: [
      {
        note: 'Linux and macOS',
        command:
          'curl -fsSL https://raw.githubusercontent.com/sunerpy/AgentLens/main/scripts/install.sh | bash',
      },
      {
        note: 'Windows, PowerShell',
        command: 'irm https://raw.githubusercontent.com/sunerpy/AgentLens/main/scripts/install.ps1 | iex',
      },
      {
        note: 'or, rather than piping a script to a shell — download from releases and verify',
        command: 'sha256sum -c sha256sums-linux.txt',
      },
      { note: 'then install the verified package', command: 'sudo apt install ./AgentLens_*_amd64.deb' },
    ],
    afterLabel: 'After installing',
    after: 'Open the hosts page; the local machine registers itself. To collect from a remote, add an SSH host, hit “test connection”, then tick the sources you want on that host card — only OpenCode starts enabled.',
  },

  stack: {
    id: 'stack',
    num: '07',
    label: 'Stack',
    heading: 'How it is built',
    specs: [
      {
        term: 'Backend',
        value:
          'Rust. The core crate handles the archive, parsing, aggregation and SSH transport; the remote collector is a separate static musl single file; the askpass helper is the SSH_ASKPASS counterpart, shipped in the package.',
      },
      { term: 'Desktop shell', value: 'Tauri 2 — host process, IPC commands and tray.' },
      {
        term: 'Frontend',
        value: 'React 18 on Vite, Tailwind CSS 4 for styling, Recharts for charts, TanStack Query for data.',
      },
      {
        term: 'Storage',
        value:
          'SQLite, statically linked through rusqlite — no system library to install. The archive carries deduplication and a per-source watermark.',
      },
      {
        term: 'Type contract',
        value:
          'The Rust/TypeScript types are generated from the Rust side by ts-rs rather than hand-written, so the boundary cannot drift quietly.',
      },
      {
        term: 'Packaging',
        value: 'Linux .deb, a Windows NSIS installer, and a macOS aarch64 .dmg.',
      },
    ],
  },

  maturity: {
    id: 'maturity',
    num: '08',
    label: 'Maturity',
    heading: 'Maturity, stated plainly',
    paras: [
      `${AGENTLENS_VERSION}, released ${AGENTLENS_RELEASED}. This is an early version: it installs, it works, it gets used daily — and the version number is an accurate description of where it stands, so there is no reason to dress it up. The interface is still moving and the measurement rules will keep tightening.`,
      'The three-platform CI matrix is green on main, and all three platforms have produced real installers in the build pipeline. But a green run only means no defect reproduced; it does not mean the product comes up on that machine. The distance between those two statements is worth writing down.',
    ],
    verifiedLabel: 'Real-machine verification, as it stands',
    verified: [
      {
        term: 'Windows: verified',
        body: 'Installed and launched on Windows Server, with 25 machine-decidable GUI assertions all passing.',
      },
      {
        term: 'Linux and macOS: packaged only',
        body: 'Both platforms produce installers, but neither has had the equivalent real-machine launch verification. That is not “it should be fine” — it is “it has not been checked”.',
      },
    ],
    testsLabel: 'Test surface',
    tests:
      '426 Rust workspace tests, 560 Vitest unit tests, 151 component-level Playwright tests against mocked IPC, and 8 WebdriverIO specs driving a real Tauri WebView over a 155k-row archive; line coverage measured at 92.72% with a 90% floor enforced in CI. Those numbers say the code is tested. They do not say every platform\u2019s installer has been opened by a human.',
  },

  links: {
    id: 'links',
    num: '09',
    label: 'Links',
    heading: 'Source and downloads',
    items: [
      { label: 'Repository', href: AGENTLENS_REPO },
      { label: 'Releases', href: AGENTLENS_RELEASES },
    ],
  },
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, AgentLensContent>;

export function getAgentLensContent(lang: Lang): AgentLensContent {
  return content[lang];
}

/** Section order, used for both the in-page table of contents and rendering. */
export function getAgentLensSections(c: AgentLensContent): SectionMeta[] {
  return [
    c.problem,
    c.screens,
    c.capabilities,
    c.guarantees,
    c.cost,
    c.install,
    c.stack,
    c.maturity,
    c.links,
  ];
}
