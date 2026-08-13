/**
 * pt-tools detail-page content, per locale.
 *
 * Separate module from `content.ts` for the same reason `codegraph.ts` is: the
 * index page needs a one-band summary, this page needs the long form.
 *
 * Facts below are read out of the product's own README and release tags, and
 * three of them are easy to get wrong in a way that would mislead a reader:
 *
 *   1. The RSS path downloads FREE torrents only while no filter rule is
 *      enabled. Filter rules (keyword / wildcard / regex) are the mechanism
 *      that widens it to non-free content. "It downloads your whole feed" is
 *      false and would cost someone their ratio.
 *   2. ChatOps is verified end to end on QQ (OneBot via NapCat) and Telegram
 *      ONLY. WeCom group bot and the custom HMAC-SHA256 webhook are shipped
 *      but experimental and NOT end-to-end verified — that caveat is content
 *      on this page, not a footnote to be dropped.
 *   3. 136 stars, v0.46.0, 2026-08-10, MIT, Go 1.25+, Docker published. No
 *      other figure is asserted anywhere: there is no download count and no
 *      benchmark, so neither appears.
 *
 * `en` is typed against the Chinese shape, so a field added to one locale and
 * forgotten in the other is a build error rather than a hole in the page.
 */

import type { Lang } from './ui';
import type { Spec, InstallLine } from './content';
import type { Numbered, SectionHead } from './codegraph';

/** One ChatOps transport, with its verification state stated. */
export interface Channel {
  index: string;
  term: string;
  /** How the bot connects. One mono line. */
  transport: string;
  /** Verified end-to-end, or shipped-but-experimental. Drives the tag. */
  verified: boolean;
  verifiedLabel: string;
  body: string;
}

/** One built-in ChatOps command. */
export interface Command {
  name: string;
  body: string;
}

/** One automation loop: what triggers it, what it does, what bounds it. */
export interface Loop extends Numbered {
  /** The guard that stops the loop doing damage. Never empty. */
  guard: string;
}

export interface PtToolsContent {
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
  languageTerm: string;
  languageValue: string;
  imageTerm: string;
  imageValue: string;
  starsTerm: string;
  starsValue: string;
  repoLabel: string;
  releasesLabel: string;
  dockerLabel: string;

  /* ---- free-only callout ---- */
  claimLabel: string;
  claimTitle: string;
  claimBody: string;
  claimPoints: string[];

  /* ---- sections ---- */
  problem: SectionHead;
  audiences: Numbered[];

  loopsHead: SectionHead;
  loopsColumns: { guard: string };
  loops: Loop[];

  statsHead: SectionHead;
  stats: Numbered[];

  chatHead: SectionHead;
  channels: Channel[];
  commandsLabel: string;
  commands: Command[];
  chatSecurityLabel: string;
  chatSecurity: Spec[];

  installHead: SectionHead;
  installLabel: string;
  install: InstallLine[];
  usageLabel: string;
  usage: InstallLine[];
  installNote: string;

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

const REPO = 'https://github.com/sunerpy/pt-tools';
const RELEASES = `${REPO}/releases`;
const DOCKER = 'https://hub.docker.com/r/sunerpy/pt-tools';

export const pttoolsLinks = { repo: REPO, releases: RELEASES, docker: DOCKER } as const;
export const pttoolsVersion = 'v0.46.0';
export const pttoolsReleased = '2026-08-10';

const zh: PtToolsContent = {
  title: 'pt-tools — PT 站点订阅、搜索与统计自动化 · FirLab',
  description:
    '解析 RSS 订阅并把符合条件的种子推送给下载器，跨站点搜索，汇总各站的上传下载分享率与魔力值，按做种时长或分享率自动清理。Web 界面加 QQ / Telegram 两条 ChatOps 通道。Go 单二进制，MIT，自部署。',
  ogAlt: 'pt-tools — sunerpy 构建的 PT 站点自动化工具',

  crumbLabel: '面包屑',
  crumbHome: 'FirLab',
  crumbCurrent: 'pt-tools',

  eyebrow: '产品 01 · PT 站点订阅、搜索与统计自动化',
  name: 'pt-tools',
  role: 'RSS → 下载器 · 跨站统计 · Web + ChatOps · Go 单二进制',
  ledeAccent: '把重复的那几步交出去，把判断留给自己。',
  lede:
    '在多个 PT 站点上维护账号，日常动作是固定的：翻订阅、看有没有免费种、推给下载器、过一段时间回来清理、月底汇总一下各站的数据。这些步骤本身没有难度，只是需要有人一直盯着。pt-tools 把这些循环接过去，并且每个循环都带着自己的边界条件 —— H&R 保护、磁盘剩余空间下限、免费期结束时的处理策略。',

  metaLabel: '版本信息',
  licenseTerm: '许可',
  licenseValue: 'MIT',
  languageTerm: '语言',
  languageValue: 'Go 1.25+',
  imageTerm: '镜像',
  imageValue: 'sunerpy/pt-tools',
  starsTerm: 'Star',
  starsValue: '136',
  repoLabel: '仓库',
  releasesLabel: '发布页',
  dockerLabel: 'Docker Hub',

  claimLabel: '默认行为',
  claimTitle: '不配过滤规则时，RSS 只下免费种',
  claimBody:
    '这是订阅路径的默认值，也是最容易被误解的一条。没有启用任何过滤规则的时候，RSS 只会下载免费种子 —— 不是"整个订阅源都拉下来"。想要非免费的内容进入下载队列，必须自己写过滤规则。三种规则可用：',
  claimPoints: [
    '关键词匹配 —— 最直接的一种，命中标题里的字符串。',
    '通配符 —— 用在剧集、季度、分辨率这类有固定命名结构的场景。',
    '正则 —— 前两种表达不了的条件走这条，代价是自己负责它的正确性。',
  ],

  problem: {
    index: '01',
    title: '它解决什么问题',
    lede:
      '难点不在单个动作，而在这些动作要在多个站点上长期重复。手工做的时候，出错的地方是固定的几个：免费期结束了没注意到，种子还在跑；磁盘满了才发现清理规则从来没生效；H&R 还没做够时间的种子被顺手删了；月底想看看各站数据，要一个个登进去抄。pt-tools 把这几件事变成配置项，然后按配置执行，出问题时留下记录。',
  },
  audiences: [
    {
      index: '01',
      term: '在多个站点维护账号的人',
      body: '站点越多，手工翻订阅和抄统计数据的成本越是线性上涨。汇总视图和统一的订阅配置是为这个场景做的。',
    },
    {
      index: '02',
      term: '把下载器跑在服务器上的人',
      body: 'Web 管理界面加 ChatOps，意味着不必为了暂停一个种子去开 SSH。QQ 或 Telegram 的私聊窗口就是控制台。',
    },
    {
      index: '03',
      term: '磁盘吃紧的人',
      body: '自动清理带磁盘剩余空间下限，清理规则和 H&R 保护一起生效 —— 不会为了腾空间删掉还没做满时长的种子。',
    },
    {
      index: '04',
      term: '登录态经常掉的人',
      body: '守护登录会话：定期探活，剩余天数不多时提前告警，Web 界面或浏览器扩展一键刷新，而不是等到订阅静默失败了才发现。',
    },
  ],

  loopsHead: {
    index: '02',
    title: '五个自动化循环',
    lede:
      '每个循环都有触发条件、动作和一个约束。约束这一列不是补充说明 —— 它是这些循环敢让它自己跑的原因。',
  },
  loopsColumns: { guard: '约束' },
  loops: [
    {
      index: '01',
      term: 'RSS 订阅 → 下载器',
      body: '按周期解析订阅源，识别其中的免费种子并推送给配置好的下载器；也可以只把 .torrent 存到本地，自己决定什么时候添加。',
      guard: '未启用过滤规则时只取免费种。要取非免费内容，得自己写关键词、通配符或正则规则。',
    },
    {
      index: '02',
      term: '跨站点搜索 → 批量推送',
      body: '一次查询打到多个站点，结果可以批量下载、批量推送到某个下载器实例，或者整批存成本地文件。',
      guard: '推送目标是显式选择的下载器实例，各自带保存目录与添加后的启动策略，不会混进同一个目录。',
    },
    {
      index: '03',
      term: '免费期结束 → 暂停',
      body: '监控免费期的截止时间，到点自动暂停对应的种子，避免免费期过后继续产生下载量。',
      guard: '未完成的种子是否一并删除，是一个显式开关，默认不删。',
    },
    {
      index: '04',
      term: '做种达标 → 清理',
      body: '按做种时长、分享率或无活动时间清理已完成的种子，把空间交还给下一批。',
      guard: 'H&R 保护优先于清理规则，并且设有磁盘剩余空间下限 —— 空间够时不会为了"整理"而删。',
    },
    {
      index: '05',
      term: '登录态探活 → 提前告警',
      body: '定期探测站点侧的活跃状态，剩余天数逐渐减少时提前告警，通过 Web 界面或浏览器扩展一键刷新。',
      guard: '刷新是手动确认的动作，不会拿着过期凭据反复重试把账号撞进风控。',
    },
  ],

  statsHead: {
    index: '03',
    title: '统计与数据卡片',
    lede: '把各站点分散的数字收进一处，并且能直接导出成一张图。',
  },
  stats: [
    {
      index: '01',
      term: '汇总维度',
      body: '上传量、下载量、分享率、魔力值，以及等级进度 —— 按站点分列，也能看到总和。',
    },
    {
      index: '02',
      term: '数据卡片',
      body: '把统计渲染成一张卡片图片，用于分享或存档。图片在本机生成，不经过第三方渲染服务。',
    },
    {
      index: '03',
      term: '版本自检',
      body: '检查是否有新版本；二进制部署方式下可以一键自升级，容器部署则按镜像标签更新。',
    },
  ],

  chatHead: {
    index: '04',
    title: 'ChatOps · 从 v0.31 起',
    lede:
      '把控制台搬进聊天窗口，这样在手机上也能暂停一个种子。两条通道做过端到端验证，另外两条只是"能发出去"，下面分开标注 —— 这个区别在真要靠它值班的时候很重要。',
  },
  channels: [
    {
      index: '01',
      term: 'QQ · OneBot',
      transport: 'NapCat 反向 WebSocket · 私聊指令',
      verified: true,
      verifiedLabel: '已端到端验证',
      body: '通过 NapCat 以反向 WebSocket 接入，指令在私聊里下发。这条通道的收发链路做过完整验证。',
    },
    {
      index: '02',
      term: 'Telegram · Bot API',
      transport: 'BotFather 长轮询 · 私聊指令 · 支持代理',
      verified: true,
      verifiedLabel: '已端到端验证',
      body: 'BotFather 建 Bot，长轮询收消息，私聊下发指令，支持走代理。这条通道的收发链路同样做过完整验证。',
    },
    {
      index: '03',
      term: '企业微信群机器人',
      transport: '群机器人 webhook',
      verified: false,
      verifiedLabel: '实验性 · 未端到端验证',
      body: '代码在，但没有做过端到端验证。当成实验特性用，不要把值班告警只挂在它上面。',
    },
    {
      index: '04',
      term: '自定义 Webhook',
      transport: 'HMAC-SHA256 签名',
      verified: false,
      verifiedLabel: '实验性 · 未端到端验证',
      body: '推送到你自己的接收端，请求带 HMAC-SHA256 签名。同样没有做过端到端验证。',
    },
  ],
  commandsLabel: '13 条内置指令',
  commands: [
    { name: '/help', body: '列出可用指令' },
    { name: '/status', body: '运行状态' },
    { name: '/version', body: '当前版本' },
    { name: '/tasks', body: '任务列表' },
    { name: '/sites', body: '站点列表' },
    { name: '/torrents', body: '种子列表' },
    { name: '/pause', body: '暂停' },
    { name: '/resume', body: '恢复' },
    { name: '/delete', body: '删除' },
    { name: '/bind', body: '绑定账号' },
    { name: '/unbind', body: '解绑' },
    { name: '/addrss', body: '新增订阅' },
    { name: '/delrss', body: '删除订阅' },
  ],
  chatSecurityLabel: '权限与凭据',
  chatSecurity: [
    { term: '管理员白名单', value: '只有名单内的账号能下发指令，其他消息一概不处理。' },
    {
      term: '绑定码有效期',
      value: '五档可选：5 分钟、1 小时、1 天、30 天、永久。默认取短的那一端。',
    },
    { term: '静态加密', value: '凭据以 AES-GCM 加密落盘，不以明文存放。' },
    { term: 'Webhook 签名', value: '出站 webhook 带 HMAC 签名，接收端可以校验来源。' },
    { term: '审计日志', value: '指令与执行结果留有记录，事后可以回查是谁在什么时候做了什么。' },
  ],

  installHead: {
    index: '05',
    title: '部署',
    lede:
      '两种部署形态：容器，或者单个二进制。二进制没有运行时依赖 —— Go 编译产物，放到 PATH 上就能跑。',
  },
  installLabel: '容器',
  install: [
    { note: '拉镜像', command: 'docker pull sunerpy/pt-tools' },
    {
      note: '挂载配置与数据目录',
      command: 'docker run -d -v ./config:/app/config -p 8080:8080 sunerpy/pt-tools',
    },
  ],
  usageLabel: '二进制',
  usage: [
    { note: '从发布页取对应平台的压缩包，解压后放到 PATH 上', command: 'pt-tools --help' },
    { note: '查看当前版本与是否有更新', command: 'pt-tools version' },
  ],
  installNote:
    '代理走标准环境变量：HTTP_PROXY、HTTPS_PROXY、ALL_PROXY，例外走 NO_PROXY。二进制部署支持一键自升级；容器部署按镜像标签更新。端口与数据目录以你自己的部署为准，上面的命令是形状示例，不是唯一写法。',

  stackHead: {
    index: '06',
    title: '技术栈',
    lede: '选型都服务于同一件事：一个进程、一份配置、装在自己机器上。',
  },
  stack: [
    { term: '语言', value: 'Go 1.25+。发布产物是单个可执行文件，不带运行时依赖。' },
    { term: '界面', value: 'Web 管理界面，加 QQ / Telegram 两条 ChatOps 通道。' },
    { term: '下载器', value: '多实例，每个实例独立配置保存目录与添加后的启动策略。' },
    { term: '网络', value: '遵循 HTTP_PROXY / HTTPS_PROXY / ALL_PROXY / NO_PROXY。' },
    { term: '分发', value: 'Docker 镜像 sunerpy/pt-tools，以及 Linux 与 Windows 的二进制。' },
    { term: '许可', value: 'MIT。' },
  ],

  limitsHead: {
    index: '07',
    title: '它不做什么',
    lede: '边界写在前面，比事后解释有用。',
  },
  limits: [
    {
      index: '01',
      term: '不替你判断规则',
      body: '各站点的规则、H&R 要求、免费策略都不一样，工具按你写的配置执行，不会替你判断某个操作在某个站点上是否恰当。配置写错的后果落在你的账号上。',
    },
    {
      index: '02',
      term: '不是下载器',
      body: '它编排下载器，不实现下载。种子的实际下载与做种由你自己的下载器完成。',
    },
    {
      index: '03',
      term: '不是索引器',
      body: '搜索走各站点自己的接口，能搜到什么取决于你在那些站点的权限。它不维护自己的种子库。',
    },
    {
      index: '04',
      term: '两条通知通道未经验证',
      body: '企业微信群机器人和自定义 webhook 属于实验特性，没有做过端到端验证。需要可靠告警时用 QQ 或 Telegram。',
    },
    {
      index: '05',
      term: '成本是你自己的机器',
      body: '没有托管版本，没有账号体系。它跑在你的机器上，站点凭据也存在那里 —— 这既是设计取向，也意味着备份和安全是你自己的事。',
    },
  ],

  closeLabel: '获取',
  closeTitle: '拉一个镜像，或者取一个二进制',
  closeBody:
    'Docker 镜像和各平台二进制都在下面。MIT 许可的个人项目，issue 和 PR 都在同一个仓库里。',
  backHome: '返回 FirLab',
};

const en: PtToolsContent = {
  title: 'pt-tools — feed, search and statistics automation for private trackers · FirLab',
  description:
    'Parses RSS feeds and hands matching torrents to a downloader, searches across sites, collects upload, download, ratio and bonus figures into one view, and cleans up by seed time or ratio. Web UI plus QQ and Telegram ChatOps. A single Go binary, MIT, self-hosted.',
  ogAlt: 'pt-tools — private-tracker automation by sunerpy',

  crumbLabel: 'Breadcrumb',
  crumbHome: 'FirLab',
  crumbCurrent: 'pt-tools',

  eyebrow: 'Product 01 · feed, search and statistics automation for private trackers',
  name: 'pt-tools',
  role: 'RSS → downloader · cross-site stats · web + ChatOps · one Go binary',
  ledeAccent: 'Hand over the repetition, keep the judgement.',
  lede:
    'Running accounts on several private trackers is a fixed set of motions: check the feeds, see what is free, hand it to a downloader, come back later to clean up, and total the numbers at the end of the month. None of it is difficult; all of it needs someone watching. pt-tools takes those loops over, and every loop carries its own bound — H&R protection, a minimum free-disk floor, and an explicit policy for what happens when a free window closes.',

  metaLabel: 'Release',
  licenseTerm: 'Licence',
  licenseValue: 'MIT',
  languageTerm: 'Language',
  languageValue: 'Go 1.25+',
  imageTerm: 'Image',
  imageValue: 'sunerpy/pt-tools',
  starsTerm: 'Stars',
  starsValue: '136',
  repoLabel: 'Repository',
  releasesLabel: 'Releases',
  dockerLabel: 'Docker Hub',

  claimLabel: 'Default behaviour',
  claimTitle: 'With no filter rule enabled, RSS downloads free torrents only',
  claimBody:
    'This is the default on the subscription path, and the single easiest thing to misread. With no filter rule enabled, RSS downloads free torrents only — it does not pull the whole feed. Getting non-free content into the queue means writing a filter rule yourself. Three kinds are available:',
  claimPoints: [
    'Keyword — the direct form, matching a string in the title.',
    'Wildcard — for the cases that already have a naming structure: episodes, seasons, resolutions.',
    'Regex — for conditions the first two cannot express, at the cost of owning its correctness yourself.',
  ],

  problem: {
    index: '01',
    title: 'The problem it solves',
    lede:
      'The difficulty is not in any single action, it is that the actions repeat across several sites indefinitely. Done by hand, the failures are always the same few: a free window closed and the torrent kept downloading; the cleanup rule never actually fired and the disk filled up; a torrent still short of its H&R time got deleted while tidying; and month-end totals meant logging into each site to copy figures out. pt-tools turns those into configuration, executes the configuration, and leaves a record when something goes wrong.',
  },
  audiences: [
    {
      index: '01',
      term: 'People with accounts on several sites',
      body: 'The cost of checking feeds and copying statistics by hand rises linearly with the number of sites. The aggregate view and one shared subscription config exist for exactly that.',
    },
    {
      index: '02',
      term: 'People whose downloader lives on a server',
      body: 'A web UI plus ChatOps means pausing one torrent does not require opening an SSH session. A direct-message window is the console.',
    },
    {
      index: '03',
      term: 'People short on disk',
      body: 'Automatic cleanup carries a minimum free-disk floor, and the cleanup rules run alongside H&R protection — space is never reclaimed by deleting a torrent that has not finished seeding.',
    },
    {
      index: '04',
      term: 'People whose sessions keep expiring',
      body: 'Login sessions are kept alive: activity is probed on a schedule, a warning arrives while there are still days left, and a refresh is one click from the web UI or the browser extension — rather than a feed that silently stopped matching anything.',
    },
  ],

  loopsHead: {
    index: '02',
    title: 'Five automation loops',
    lede:
      'Each loop has a trigger, an action and a bound. The bound column is not supporting detail — it is the reason these loops can be left running.',
  },
  loopsColumns: { guard: 'Bound' },
  loops: [
    {
      index: '01',
      term: 'RSS feed → downloader',
      body: 'Feeds are parsed on a schedule, free torrents identified, and handed to the configured downloader. The .torrent file can also just be saved locally so you decide when to add it.',
      guard:
        'Free torrents only while no filter rule is enabled. Reaching non-free content requires a keyword, wildcard or regex rule you write yourself.',
    },
    {
      index: '02',
      term: 'Cross-site search → batch push',
      body: 'One query reaches several sites; results can be batch-downloaded, batch-pushed to a chosen downloader instance, or saved as local files in bulk.',
      guard:
        'The push target is an explicitly chosen downloader instance, each with its own save directory and post-add start policy — nothing lands in a shared directory by accident.',
    },
    {
      index: '03',
      term: 'Free window closes → pause',
      body: 'The end of a free window is tracked, and the torrents concerned are paused when it arrives, so no download volume accrues afterwards.',
      guard: 'Whether incomplete torrents are also deleted at that point is an explicit switch, off by default.',
    },
    {
      index: '04',
      term: 'Seeding target met → cleanup',
      body: 'Finished torrents are removed by seed time, ratio or inactivity, returning the space to the next batch.',
      guard:
        'H&R protection takes precedence over the cleanup rules, and a minimum free-disk floor applies — nothing is deleted for tidiness while there is still room.',
    },
    {
      index: '05',
      term: 'Session probe → early warning',
      body: 'Site-side activity is probed periodically, a warning arrives as the remaining days run down, and the session is refreshed from the web UI or the browser extension.',
      guard:
        'The refresh is a confirmed manual action — expired credentials are not retried in a loop until the account trips a rate limit.',
    },
  ],

  statsHead: {
    index: '03',
    title: 'Statistics and the data card',
    lede: 'Figures scattered across sites collected into one place, and exportable as a single image.',
  },
  stats: [
    {
      index: '01',
      term: 'What is collected',
      body: 'Upload, download, ratio, bonus points and level progress — per site, and as a total.',
    },
    {
      index: '02',
      term: 'Data card',
      body: 'The statistics render to a card image for sharing or archiving. It is generated locally; no third-party rendering service is involved.',
    },
    {
      index: '03',
      term: 'Version check',
      body: 'Checks whether a newer release exists. A binary deployment can upgrade itself in one step; a container deployment follows its image tag.',
    },
  ],

  chatHead: {
    index: '04',
    title: 'ChatOps · since v0.31',
    lede:
      'The console moves into a chat window, so a torrent can be paused from a phone. Two channels are verified end to end; two others merely send. They are labelled separately below — the difference matters when you actually depend on it.',
  },
  channels: [
    {
      index: '01',
      term: 'QQ · OneBot',
      transport: 'NapCat reverse WebSocket · DM commands',
      verified: true,
      verifiedLabel: 'Verified end to end',
      body: 'Connects through NapCat over a reverse WebSocket, with commands issued in a direct message. This channel has been verified in both directions.',
    },
    {
      index: '02',
      term: 'Telegram · Bot API',
      transport: 'BotFather long-poll · DM commands · proxy support',
      verified: true,
      verifiedLabel: 'Verified end to end',
      body: 'A bot registered through BotFather, receiving by long poll, with commands issued in a direct message and proxy support available. Also verified in both directions.',
    },
    {
      index: '03',
      term: 'WeCom group bot',
      transport: 'Group-bot webhook',
      verified: false,
      verifiedLabel: 'Experimental · not verified end to end',
      body: 'The code is there, but it has not been verified end to end. Treat it as experimental and do not hang your only alerting path on it.',
    },
    {
      index: '04',
      term: 'Custom webhook',
      transport: 'HMAC-SHA256 signed',
      verified: false,
      verifiedLabel: 'Experimental · not verified end to end',
      body: 'Delivers to a receiver you run, with an HMAC-SHA256 signature on the request. Likewise not verified end to end.',
    },
  ],
  commandsLabel: '13 built-in commands',
  commands: [
    { name: '/help', body: 'List commands' },
    { name: '/status', body: 'Runtime status' },
    { name: '/version', body: 'Current version' },
    { name: '/tasks', body: 'Task list' },
    { name: '/sites', body: 'Site list' },
    { name: '/torrents', body: 'Torrent list' },
    { name: '/pause', body: 'Pause' },
    { name: '/resume', body: 'Resume' },
    { name: '/delete', body: 'Delete' },
    { name: '/bind', body: 'Bind an account' },
    { name: '/unbind', body: 'Unbind' },
    { name: '/addrss', body: 'Add a feed' },
    { name: '/delrss', body: 'Remove a feed' },
  ],
  chatSecurityLabel: 'Access and credentials',
  chatSecurity: [
    {
      term: 'Admin allowlist',
      value: 'Only accounts on the list can issue commands; everything else is ignored.',
    },
    {
      term: 'Binding-code TTL',
      value: 'Five options: 5 minutes, 1 hour, 1 day, 30 days, permanent. The short end is the default.',
    },
    { term: 'Encryption at rest', value: 'Credentials are written AES-GCM encrypted, never in plaintext.' },
    {
      term: 'Webhook signing',
      value: 'Outbound webhooks carry an HMAC signature so the receiver can verify the origin.',
    },
    {
      term: 'Audit log',
      value: 'Commands and their outcomes are recorded, so who did what and when can be read back afterwards.',
    },
  ],

  installHead: {
    index: '05',
    title: 'Deployment',
    lede:
      'Two shapes: a container, or a single binary. The binary has no runtime dependency — it is a Go build, so putting it on your PATH is enough.',
  },
  installLabel: 'Container',
  install: [
    { note: 'pull the image', command: 'docker pull sunerpy/pt-tools' },
    {
      note: 'mount config and data',
      command: 'docker run -d -v ./config:/app/config -p 8080:8080 sunerpy/pt-tools',
    },
  ],
  usageLabel: 'Binary',
  usage: [
    {
      note: 'take the archive for your platform off the releases page, extract, put it on PATH',
      command: 'pt-tools --help',
    },
    { note: 'check the current version and whether an update exists', command: 'pt-tools version' },
  ],
  installNote:
    'Proxies use the standard environment variables: HTTP_PROXY, HTTPS_PROXY, ALL_PROXY, with exceptions in NO_PROXY. A binary deployment can self-upgrade in one step; a container deployment follows its image tag. Ports and data paths are whatever your deployment says — the commands above show the shape, not the only spelling.',

  stackHead: {
    index: '06',
    title: 'Stack',
    lede: 'Every choice serves the same goal: one process, one config file, installed on your own machine.',
  },
  stack: [
    { term: 'Language', value: 'Go 1.25+. Shipped as a single executable with no runtime dependency.' },
    { term: 'Interfaces', value: 'A web management UI, plus QQ and Telegram ChatOps channels.' },
    {
      term: 'Downloaders',
      value: 'Multiple instances, each with its own save directory and post-add start policy.',
    },
    { term: 'Network', value: 'Honours HTTP_PROXY / HTTPS_PROXY / ALL_PROXY / NO_PROXY.' },
    {
      term: 'Distribution',
      value: 'The sunerpy/pt-tools Docker image, plus binaries for Linux and Windows.',
    },
    { term: 'Licence', value: 'MIT.' },
  ],

  limitsHead: {
    index: '07',
    title: 'What it does not do',
    lede: 'Stating the boundary up front beats explaining it afterwards.',
  },
  limits: [
    {
      index: '01',
      term: 'It does not judge the rules for you',
      body: 'Every site has its own rules, its own H&R requirements and its own free policy. The tool executes the configuration you wrote; it does not decide whether an action is appropriate on a given site. A wrong config lands on your account, not on the tool.',
    },
    {
      index: '02',
      term: 'It is not a downloader',
      body: 'It orchestrates a downloader rather than implementing one. The actual downloading and seeding is your own client\u2019s job.',
    },
    {
      index: '03',
      term: 'It is not an indexer',
      body: 'Search goes through each site\u2019s own interface, so what you can find depends on the access you already have there. It keeps no torrent database of its own.',
    },
    {
      index: '04',
      term: 'Two notification channels are unverified',
      body: 'The WeCom group bot and the custom webhook are experimental and have not been verified end to end. Use QQ or Telegram where alerting has to be reliable.',
    },
    {
      index: '05',
      term: 'The cost is your own machine',
      body: 'There is no hosted version and no account system. It runs on your host and the site credentials live there too — which is the design stance, and also means backups and security are yours.',
    },
  ],

  closeLabel: 'Get it',
  closeTitle: 'Pull an image, or take a binary',
  closeBody:
    'The Docker image and per-platform binaries are both below. It is an MIT-licensed personal project; issues and pull requests live in the same repository.',
  backHome: 'Back to FirLab',
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, PtToolsContent>;

export function getPtToolsContent(lang: Lang): PtToolsContent {
  return content[lang];
}
