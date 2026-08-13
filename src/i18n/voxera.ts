/**
 * Voxera detail page content, per locale.
 *
 * Kept in its own module rather than in `content.ts`: the index only needs a
 * five-line summary of each product, while this page carries the full write-up.
 * Merging the two would make the index's data shape carry fields no index band
 * renders.
 *
 * THE CONSTRAINT THAT SHAPES EVERY STRING HERE — Voxera has no public
 * repository, no release and no version. Its own README states the repository
 * address and visibility have not been decided. Therefore:
 *
 *   - No external link. Not to a repo, not to releases, not to raw.github.
 *   - No version number. `Cargo.toml` says 0.1.0; that is an internal workspace
 *     version, not a published release, and printing it here would be a lie.
 *   - No install command. The README's install snippet is parameterised on a
 *     `<account>/<project>` placeholder precisely because it does not exist yet.
 *   - No download button, no waitlist, no countdown. There is no backend to
 *     collect an address and nothing to count down to.
 *
 * What replaces the missing call to action is the design record: where the
 * boundaries were drawn, what leaves the machine in which mode, and what the
 * project deliberately refuses to be. Every claim below traces to the project's
 * own README or architecture docs.
 *
 * Roadmap is never presented as shipping. The phone-as-thin-microphone
 * companion is DESIGNED; the project is at milestone M0 (infrastructure). It is
 * named as a designed shape, once, and never listed as a feature.
 */

import type { Lang } from './ui';

/** A term/value row. Mirrors `Spec` in content.ts so `SpecGrid` can render it. */
export interface Row {
  term: string;
  value: string;
}

/** A numbered step in the capture → recognise → deliver line. */
export interface Step {
  index: string;
  term: string;
  value: string;
}

/**
 * One privacy mode. `tone` drives the indicator only — the transmission is also
 * stated in words, so colour never carries the meaning alone (WCAG 1.4.1).
 *
 *   none  nothing leaves the machine
 *   third data goes to a provider the user configured
 *   off   off by default; sends only once the user turns it on
 */
export interface PrivacyMode {
  name: string;
  tone: 'none' | 'third' | 'off';
  /** Short, mono-set answer to "what is transmitted". */
  sends: string;
  detail: string;
}

export interface Section {
  label: string;
  heading: string;
  intro?: string;
}

export interface VoxeraContent {
  title: string;
  description: string;
  ogAlt: string;

  /** Breadcrumb label for the home crumb. */
  home: string;

  eyebrow: string;
  headline: string;
  role: string;
  lede: string;
  /** Hero-side facts. Deliberately holds no version and no release date. */
  heroFacts: Row[];

  status: Section;
  statusBody: string;
  statusRows: Row[];

  loop: Section;
  steps: Step[];

  negations: Section;
  negationItems: Row[];
  negationClose: string;

  privacy: Section;
  /** Column label above each mode's transmission answer. */
  privacyTransmitLabel: string;
  privacyModes: PrivacyMode[];
  privacyDefaults: string;

  control: Section;
  controlRows: Row[];

  arch: Section;
  crates: Row[];
  archNote: string;
  stackLabel: string;
  stackRows: Row[];

  platform: Section;
  platformRows: Row[];

  licence: Section;
  licenceRows: Row[];

  close: Section;
  closeBody: string;
  siblingsLabel: string;
  siblings: { id: 'codegraph' | 'agentlens'; name: string; role: string; detail: string }[];
  backHome: string;
}

const zh: VoxeraContent = {
  title: 'Voxera — 面向桌面与编码 Agent 的语音输入 · FirLab',
  description:
    '按下全局热键说话，文字落进当前获得焦点的输入框，或送给只监听 127.0.0.1 的桥。离线本地识别与自配云端识别两条路都走得通。开发中，里程碑 M0，尚无发布版本。',
  ogAlt: 'Voxera — 面向桌面与编码 Agent 的语音输入',

  home: 'FirLab',

  eyebrow: '产品 03 · 开发中 · 里程碑 M0（基础设施）',
  headline: 'Voxera',
  role: '面向桌面与编码 Agent 的语音输入',
  lede: '按下一个全局热键，说话，文字落在你原本正在输入的那个地方 —— 编辑器、终端、写给编码 Agent 的提示框。识别交给本地引擎，或者交给你自己配置的云端引擎；投递交给当前获得焦点的输入框，或者交给一个只监听 127.0.0.1 的桥。',
  heroFacts: [
    { term: '形态', value: '桌面应用 + 无界面 CLI' },
    { term: '实现', value: 'Rust · Tauri 2 · React 19' },
    { term: '许可', value: 'AGPL-3.0-only（适配层另计）' },
  ],

  status: {
    label: '当前状态',
    heading: '这一页没有下载链接',
  },
  statusBody:
    '项目处于早期阶段，里程碑 M0（基础设施）正在进行中：还没有发布版本，也还没有公开仓库 —— 仓库地址与可见性尚未确定。所以这一页不给版本号、不给安装命令，也不放一个点不动的按钮。它记录的是设计决定：边界为什么切在这里，什么数据在什么模式下离开这台机器，以及为什么它刻意不去做另外三件看起来很像的事。',
  statusRows: [
    {
      term: '已经能跑',
      value:
        '工作区里的各个库、一个无界面 CLI（列出引擎、跑分阶段基准、单独跑文本后处理规则），以及仓库自身的检查脚本。',
    },
    {
      term: '尚未公开',
      value:
        '桌面端界面与打包链路的代码存在，但仓库尚未公开，也没有产生过任何可安装的发布制品。',
    },
    {
      term: '不写进这里',
      value:
        '路线图上的东西不当成已有功能介绍。手机作为局域网瘦麦克风接入是已经设计好的形态，不是今天能用的功能。',
    },
  ],

  loop: {
    label: '工作方式',
    heading: '三步，一条直线',
    intro:
      '没有唤醒词，没有对话轮次，没有等你确认的中间态。一次听写从按键开始，到文字落地结束。',
  },
  steps: [
    {
      index: '01',
      term: '采集',
      value:
        '一个全局热键，在桌面会话的任何位置都能按。采集与静音检测由 CPAL 拿设备、VAD 切出真正在说话的那一段。',
    },
    {
      index: '02',
      term: '识别',
      value:
        '交给本地离线引擎（sherpa-onnx 跑磁盘上的模型），或者交给你自己配置的云端引擎。两条都是一等路径 —— 本地不是云端不可用时的降级方案。',
    },
    {
      index: '03',
      term: '投递',
      value:
        '文本落进当前获得焦点的输入框，或者交给一个只监听 127.0.0.1 的 Agent 桥。替换规则与热词在落地之前就已生效。',
    },
  ],

  negations: {
    label: '边界',
    heading: '它刻意不做的三件事',
    intro:
      '看到"语音输入"，多数人会先想到下面三样中的一样。Voxera 都不是。这不是功能没做完，是边界画在了别处 —— 而每一条都有随之而来的代价。',
  },
  negationItems: [
    {
      term: '不是语音助手',
      value:
        '不听唤醒词，不解析意图，不代你执行任何动作。它把你说的话变成文字，然后放手。判断该拿这段文字做什么的，是你，或者是你交给它的那个 Agent。',
    },
    {
      term: '不是会议记录工具',
      value:
        '不常驻录音，不做说话人分离，不生成摘要。它一次处理的是一段你主动按键说出来的话 —— 长度以句子计，不以小时计。',
    },
    {
      term: '不是系统输入法',
      value:
        '它不把自己注册成任何平台的输入法：Android 上没有 InputMethodService，iOS 上没有键盘扩展，也不出现在系统的键盘与输入源列表里。它走的是普通应用就能用的合成输入与剪贴板路径。',
    },
  ],
  negationClose:
    '最后一条不是措辞问题，是有代价的：只接受真实输入法的地方拿不到它的文字，Windows 上完整性级别高于 Voxera 的窗口就是最典型的例子。换来的是它不需要系统级的输入信任，也不接管你原本的中文输入体验。代价写在这里，不藏在文档末尾。',

  privacy: {
    label: '隐私模型',
    heading: '哪种模式下，什么东西离开了这台机器',
    intro:
      'Voxera 只在其中一种模式下真的不外传数据。把这件事讲清楚比讲得好听重要。下面三行只按"传输"这一个维度排列；当前处于哪种模式取决于你自己选的设置，并且在听写进行时界面上会显示出来。',
  },
  privacyTransmitLabel: '传输',
  privacyModes: [
    {
      name: '本地识别',
      tone: 'none',
      sends: '无',
      detail:
        '不发音频，不发转写文本，不发元数据。识别在 Voxera 进程内针对磁盘上的模型文件完成，模型装好之后这条路完全不需要网络，断网照样工作。唯一的一次网络操作是听写之前的模型下载，下载内容按编译进二进制的哈希校验。',
    },
    {
      name: '云端识别',
      tone: 'third',
      sends: '音频 + 模型 id + 你的凭据',
      detail:
        '发往你选定的那一家提供方 —— OpenAI、Groq、阿里云百炼、火山引擎，或者你自己填地址的 custom。若配了热词且该提供方支持偏置，热词列表会作为提示文本一起发出。这条路径上不存在任何由 Voxera 运营的服务器，也不存在把音频发给你未配置的提供方的模式。每家的数据留存政策以原文逐字引用的方式记在项目文档里，带来源 URL 与阅读日期。',
    },
    {
      name: 'LLM 润色（默认关闭）',
      tone: 'off',
      sends: '转写文本，不含音频',
      detail:
        '规则链处理之后的文本，加上聊天模型 id 与凭据，发往你配置的那个 OpenAI 兼容 chat 端点。默认关闭 —— 默认值就是为此而设：它增加延迟，并且把文本送离本机。接收方是运营那个地址的人。',
    },
  ],
  privacyDefaults:
    '另外三条同属默认值的决定：历史记录默认关闭，开启后仅存本地，默认上限 500 条或 30 天先到者为准，被系统标记为安全的输入框里的内容根本不会落盘；Agent 桥只监听 127.0.0.1，不接受来自局域网的连接；凭据存在操作系统钥匙串里，配置文件里只留一个标签。',

  control: {
    label: '可控性',
    heading: '不是设置页里堆开关',
    intro: '会被反复用到的四样东西，都做成了你能自己写、自己读、自己关掉的形式。',
  },
  controlRows: [
    {
      term: '替换规则',
      value:
        '自定义的文本替换链，在文字落地之前跑完。念出来是一串口语，落下去是你规定的那个写法 —— 项目名、函数名、内部缩写，不必每次手改。',
    },
    {
      term: '热词',
      value:
        '一份你自己维护的词表。本地引擎用它做偏置；云端提供方若支持偏置，同一份词表作为提示文本一起发出。',
    },
    {
      term: '历史',
      value:
        '默认关闭。开启后只写本地，有条数与天数双重上限，并且被系统标记为安全的输入框（密码框一类）里的内容根本不进这条路。',
    },
    {
      term: '命令行',
      value:
        '一个无界面 CLI：列出已配置且可解析的引擎、跑分阶段耗时、只跑文本后处理规则而不碰音频。结果走 stdout、诊断走 stderr、退出码可直接做分支 —— 其中 3 专指"前置条件缺失"，与 1（运行时失败）分开。',
    },
  ],

  arch: {
    label: '架构',
    heading: '一个 Rust 工作区，边界由脚本守着',
    intro:
      '切分的依据不是"看起来整齐"，而是哪条依赖边一旦被越过，就会让某一端变重、变慢，或者知道了它不该知道的东西。',
  },
  crates: [
    { term: 'voxera-audio', value: '采集与静音检测。CPAL 拿设备，VAD 切出真正在说话的那一段。' },
    {
      term: 'voxera-asr',
      value:
        '识别引擎。本地路径用 sherpa-onnx 跑磁盘上的模型；云端路径是几家提供方各自的适配。',
    },
    {
      term: 'voxera-pipeline',
      value: '从一次按键到一段文字之间的编排：采集、识别、替换规则、热词、投递决策。',
    },
    {
      term: 'voxera-bridge',
      value:
        '本机桥。Axum 加 WebSocket，只监听 127.0.0.1；局域网侧另有 QUIC 与 mDNS，为已设计的手机伴侣形态准备。',
    },
    {
      term: 'voxera-cli',
      value: '无界面入口。在没有桌面环境的机器上验证整条流水线，也是 Agent 自动化的那一头。',
    },
    {
      term: 'apps/',
      value: '桌面端与移动端。平台集成分别落在 Windows API、macOS AppKit 与 X11 上。',
    },
  ],
  archNote:
    '手机侧不允许出现的依赖边写在架构文档里，并且由一个检查脚本守着 —— 越界是 CI 失败，不是 review 时的一句口头提醒。同理，本地识别引擎依赖的 sherpa-onnx 预编译库从一份提交在仓库里的 SHA-256 清单取得，构建时不会临时去网上抓。',
  stackLabel: '技术栈',
  stackRows: [
    { term: '应用', value: 'Rust · Tauri 2 · React 19 · Vite · Tailwind 4' },
    { term: '音频与识别', value: 'CPAL · VAD · sherpa-onnx' },
    { term: '服务', value: 'Axum · WebSocket · QUIC · mDNS · SQLite' },
    { term: '平台集成', value: 'Windows API · macOS AppKit · X11' },
  ],

  platform: {
    label: '平台差异',
    heading: '不一致的地方写在明面上',
    intro: '跨平台不等于处处一致。下面三条是已知的、不打算用措辞抹平的差异。',
  },
  platformRows: [
    {
      term: 'Wayland：只有切换模式',
      value:
        'Wayland 没有能同时给出按下与松开两个边沿的、跨合成器的全局快捷键协议，所以 Wayland 上没有"按住说话"，只有按一下开始、再按一下结束。这不是设置项，也不是本地能修的缺陷。',
    },
    {
      term: 'Windows：提权窗口会被按名拒绝',
      value:
        'UIPI 不允许中等完整性进程向高完整性窗口投送输入，Voxera 也不会为绕过它去申请提权。它给出一条点名 UIPI 的提示，并把文字留在历史与暂存区里，而不是静默失败。',
    },
    {
      term: '延迟数字：暂时不给',
      value:
        '基准的分阶段模式给的是诊断数据。端到端延迟要等交付层完成之后才有意义，在此之前它会明确拒绝给出数字，而不是返回一个看起来像结论的值。',
    },
  ],

  licence: {
    label: '许可',
    heading: '应用本体与适配层分开',
    intro:
      '这两层被人使用的方式不一样：一个是你装在机器上的程序，一个是你抄进自己 Agent 配置里的几十行胶水。所以许可也分开。',
  },
  licenceRows: [
    {
      term: '应用本体 · AGPL-3.0-only',
      value: 'GNU Affero 通用公共许可证第 3 版，仅第 3 版，原文完整且未经修改地随仓库分发。',
    },
    {
      term: '三个 Agent 适配层 · Apache-2.0 OR MIT',
      value:
        'MCP stdio 桥的适配脚本、OpenCode 插件、Claude Code hook 脚本。双许可的目的很具体：让它们能直接嵌进你自己的 Agent 配置，而不把 AGPL 传染给你的东西。',
    },
    {
      term: 'AGPL 第 13 条',
      value:
        '因为 Voxera 通过网络与用户交互，第 13 条适用：运行中的桥在 GET /source 上给出对应源码的获取方式，手机端在"关于"页展示同一个入口。',
    },
    {
      term: '模型权重',
      value: '各自适用自己的许可证，不因为随 Voxera 一起使用就变成 AGPL。',
    },
  ],

  close: {
    label: '接下来',
    heading: '等仓库确定，这一页会长出安装一节',
  },
  closeBody:
    '在那之前，它就是一份设计记录。上面每一条都能在项目自己的 README 与架构文档里找到对应出处，没有一条是为了这一页临时写出来的 —— 包括那些不好听的：Wayland 上没有按住说话，Windows 上进不了提权窗口，端到端延迟现在给不出数字。',
  siblingsLabel: '同一批工具',
  siblings: [
    {
      id: 'codegraph',
      name: 'CodeGraph',
      role: '确定性代码知识图谱',
      detail: '已发布，持续更新 —— 二进制里没有任何模型，同一个问题在任何机器上返回同样的字节。',
    },
    {
      id: 'agentlens',
      name: 'AgentLens',
      role: '编码 Agent 用量归档',
      detail: '已发布，早期 —— 把本机与 SSH 远端的用量记录汇总进同一份持久归档。',
    },
  ],
  backHome: '回到 FirLab 首页',
};

const en: VoxeraContent = {
  title: 'Voxera — voice input for desktop and coding agents · FirLab',
  description:
    'Press a global hotkey, speak, and the text lands in whatever input has focus — or goes to a bridge bound to 127.0.0.1. Offline local recognition and a cloud engine you configure yourself are both first-class. In development, milestone M0, no release yet.',
  ogAlt: 'Voxera — voice input for desktop and coding agents',

  home: 'FirLab',

  eyebrow: 'Product 03 · in development · milestone M0 (infrastructure)',
  headline: 'Voxera',
  role: 'Voice input for desktop and coding agents',
  lede: 'Press a global hotkey, speak, and the text lands where you were already typing — an editor, a terminal, a prompt to a coding agent. Recognition goes to a local engine or to a cloud engine you configured yourself; delivery goes to the focused input, or to a bridge that listens only on 127.0.0.1.',
  heroFacts: [
    { term: 'Shape', value: 'Desktop application + headless CLI' },
    { term: 'Built with', value: 'Rust · Tauri 2 · React 19' },
    { term: 'Licence', value: 'AGPL-3.0-only (adapters differ)' },
  ],

  status: {
    label: 'Current status',
    heading: 'There is no download on this page',
  },
  statusBody:
    'The project is early. Milestone M0 — infrastructure — is in progress: there is no release, and there is no public repository, because the repository address and its visibility have not been decided. So this page carries no version number, no install command, and no button that does nothing when you press it. What it carries instead is the design record: where the boundaries were drawn, what data leaves the machine in which mode, and why it deliberately refuses to be three things it looks a lot like.',
  statusRows: [
    {
      term: 'Runs today',
      value:
        'The workspace libraries, a headless CLI (list engines, run a staged benchmark, run the text post-processing rules on their own), and the repository’s own check scripts.',
    },
    {
      term: 'Not public yet',
      value:
        'The desktop UI code and the packaging path exist, but the repository is not public and has never produced an installable release artefact.',
    },
    {
      term: 'Not written up here',
      value:
        'Roadmap items are not presented as existing features. A phone acting as a LAN thin microphone is a designed shape, not something you can use today.',
    },
  ],

  loop: {
    label: 'How it works',
    heading: 'Three steps, one straight line',
    intro:
      'No wake word, no conversational turns, no intermediate state waiting for you to confirm. A dictation begins at the keypress and ends when the text lands.',
  },
  steps: [
    {
      index: '01',
      term: 'Capture',
      value:
        'One global hotkey, pressable anywhere in the desktop session. CPAL opens the device; a VAD cuts out the part where you were actually speaking.',
    },
    {
      index: '02',
      term: 'Recognise',
      value:
        'Handed to a local offline engine — sherpa-onnx against models on disk — or to a cloud engine you configured yourself. Both are first-class paths: local is not what happens when the cloud is unavailable.',
    },
    {
      index: '03',
      term: 'Deliver',
      value:
        'The text lands in whatever input has focus, or goes to an agent bridge that listens only on 127.0.0.1. Replacement rules and hotwords have already run by then.',
    },
  ],

  negations: {
    label: 'Boundaries',
    heading: 'Three things it deliberately is not',
    intro:
      'Read "voice input" and most people picture one of the three below. Voxera is none of them. That is not unfinished work — the boundary was drawn somewhere else, and each choice carries a cost.',
  },
  negationItems: [
    {
      term: 'Not a voice assistant',
      value:
        'No wake word, no intent parsing, no acting on your behalf. It turns what you said into text and then lets go. Deciding what to do with that text is your job, or the job of the agent you handed it to.',
    },
    {
      term: 'Not a meeting recorder',
      value:
        'It does not sit there recording, does not diarise speakers, does not summarise. One dictation is one deliberate keypress worth of speech — measured in sentences, not hours.',
    },
    {
      term: 'Not an input method',
      value:
        'It does not register itself as an IME on any platform: no InputMethodService on Android, no keyboard extension on iOS, and no entry in the system’s keyboard or input-source list. It uses the synthetic-input and clipboard paths available to an ordinary application.',
    },
  ],
  negationClose:
    'That last one is not a wording choice; it has a price. Anywhere that only accepts a real input method will not receive its text — a window running at higher integrity than Voxera on Windows being the clearest case. What it buys is that Voxera never needs system-level input trust and never takes over the typing experience you already have. The cost is stated here, not buried at the end of a doc.',

  privacy: {
    label: 'Privacy model',
    heading: 'What leaves this machine, in which mode',
    intro:
      'Only one of the modes below genuinely sends nothing. Saying that plainly matters more than saying it nicely. The rows are ordered on one axis — transmission. Which mode you are in follows from settings you chose, and the interface shows it while a dictation is running.',
  },
  privacyTransmitLabel: 'Transmits',
  privacyModes: [
    {
      name: 'Local recognition',
      tone: 'none',
      sends: 'Nothing',
      detail:
        'No audio, no transcript, no metadata. Recognition happens inside the Voxera process against model files on disk; once the models are installed this path needs no network at all and works with the link down. The single network operation is the model download before your first dictation, verified against a hash compiled into the binary.',
    },
    {
      name: 'Cloud recognition',
      tone: 'third',
      sends: 'Audio + model id + your credentials',
      detail:
        'Sent to the one provider you selected — OpenAI, Groq, DashScope, VolcEngine, or a custom endpoint whose address you supply. If you configured hotwords and that provider supports biasing, the list goes along as prompt text. There is no server operated by Voxera anywhere on this path, and no mode that sends audio to a provider you did not configure. Each provider’s retention policy is recorded in the project docs as a verbatim quote, with a source URL and a read date.',
    },
    {
      name: 'LLM polish (off by default)',
      tone: 'off',
      sends: 'Transcript text, no audio',
      detail:
        'The text after the rule chain, plus a chat model id and credentials, sent to the OpenAI-compatible chat endpoint you configured. Off by default, and the default is the point: it adds latency and moves text off the machine. The recipient is whoever runs that address.',
    },
  ],
  privacyDefaults:
    'Three more decisions that live in the defaults: history is off, and once on it stays local with both a count and an age ceiling — 500 entries or 30 days, whichever comes first — while anything typed in an input the system marks as secure never reaches disk at all; the agent bridge listens only on 127.0.0.1 and accepts nothing from the LAN; credentials live in the OS keychain, referenced from config by label alone.',

  control: {
    label: 'Control',
    heading: 'Not a settings page full of switches',
    intro:
      'The four things you reach for repeatedly are each something you can write yourself, read back, and switch off.',
  },
  controlRows: [
    {
      term: 'Replacement rules',
      value:
        'A custom chain of text substitutions that finishes before the text lands. You say the spoken form; what arrives is the spelling you specified — project names, function names, internal abbreviations, without fixing them by hand every time.',
    },
    {
      term: 'Hotwords',
      value:
        'A word list you maintain. The local engine uses it for biasing; if a cloud provider supports biasing, the same list goes along as prompt text.',
    },
    {
      term: 'History',
      value:
        'Off by default. Once on it is written locally only, bounded by both an entry count and an age, and content from inputs the system marks as secure — password fields and the like — never enters that path.',
    },
    {
      term: 'Command line',
      value:
        'A headless CLI: list the engines that are configured and resolvable, run staged timings, run the text post-processing rules without touching audio. Results on stdout, diagnostics on stderr, exit codes you can branch on — where 3 means specifically "a precondition is missing" and is kept distinct from 1, a runtime failure.',
    },
  ],

  arch: {
    label: 'Architecture',
    heading: 'One Rust workspace, with the boundaries enforced',
    intro:
      'The split is not about looking tidy. Each line is a dependency edge that, once crossed, would make one side heavier, slower, or aware of something it has no business knowing.',
  },
  crates: [
    {
      term: 'voxera-audio',
      value: 'Capture and voice activity detection. CPAL for the device, a VAD for the speech.',
    },
    {
      term: 'voxera-asr',
      value:
        'Recognition engines. The local path runs sherpa-onnx against models on disk; the cloud path is one adapter per provider.',
    },
    {
      term: 'voxera-pipeline',
      value:
        'Everything between a keypress and a piece of text: capture, recognition, replacement rules, hotwords, the delivery decision.',
    },
    {
      term: 'voxera-bridge',
      value:
        'The local bridge. Axum plus WebSocket, bound to 127.0.0.1; QUIC and mDNS sit alongside for the designed phone-companion shape.',
    },
    {
      term: 'voxera-cli',
      value:
        'The headless entry point. Verifies the whole pipeline on a machine with no desktop session, and is the end an agent automates against.',
    },
    {
      term: 'apps/',
      value:
        'Desktop and mobile. Platform integration lands on the Windows API, macOS AppKit and X11 respectively.',
    },
  ],
  archNote:
    'The dependency edges the phone side is not allowed to have are written down in the architecture doc and guarded by a check script — crossing one fails CI rather than earning a comment in review. In the same spirit, the prebuilt sherpa-onnx libraries the local engine needs come from a SHA-256 manifest committed to the repository, not from a fetch at build time.',
  stackLabel: 'Stack',
  stackRows: [
    { term: 'Application', value: 'Rust · Tauri 2 · React 19 · Vite · Tailwind 4' },
    { term: 'Audio and ASR', value: 'CPAL · VAD · sherpa-onnx' },
    { term: 'Services', value: 'Axum · WebSocket · QUIC · mDNS · SQLite' },
    { term: 'Platform', value: 'Windows API · macOS AppKit · X11' },
  ],

  platform: {
    label: 'Platform differences',
    heading: 'The inconsistencies, stated',
    intro:
      'Cross-platform does not mean identical everywhere. Three known differences that will not be smoothed over with wording.',
  },
  platformRows: [
    {
      term: 'Wayland: toggle only',
      value:
        'Wayland has no cross-compositor global-shortcut protocol that reports both the press and the release edge, so there is no push-to-talk on Wayland — only press once to start, press again to stop. That is not a setting, and not a defect this project can fix locally.',
    },
    {
      term: 'Windows: elevated windows are refused by name',
      value:
        'UIPI does not let a medium-integrity process send input to a high-integrity window, and Voxera will not request elevation to work around it. It surfaces a message that names UIPI and keeps the text in history and the staging area instead of failing silently.',
    },
    {
      term: 'Latency figures: not yet',
      value:
        'The benchmark’s staged mode reports diagnostics. End-to-end latency only becomes meaningful once the delivery layer is finished, and until then the mode refuses to print a number rather than returning something that looks like a conclusion.',
    },
  ],

  licence: {
    label: 'Licence',
    heading: 'The application and the adapters are split',
    intro:
      'The two layers get used differently: one is a program you install, the other is a few dozen lines of glue you paste into your own agent configuration. So the licences are split too.',
  },
  licenceRows: [
    {
      term: 'The application · AGPL-3.0-only',
      value:
        'The GNU Affero General Public License, version 3 only, distributed with the repository complete and unmodified.',
    },
    {
      term: 'Three agent adapters · Apache-2.0 OR MIT',
      value:
        'The MCP stdio bridge adapter script, the OpenCode plugin, and the Claude Code hook script. The dual licence has a specific purpose: they can be embedded directly in your own agent configuration without the AGPL reaching your work.',
    },
    {
      term: 'AGPL section 13',
      value:
        'Because Voxera interacts with users over a network, section 13 applies: the running bridge serves the corresponding source offer on GET /source, and the phone side shows the same entry point on its about screen.',
    },
    {
      term: 'Model weights',
      value:
        'Each keeps its own licence and does not become AGPL by being used alongside Voxera.',
    },
  ],

  close: {
    label: 'Next',
    heading: 'When the repository is settled, this page grows an install section',
  },
  closeBody:
    'Until then it is a design record. Every claim above traces to the project’s own README and architecture docs — nothing here was written for this page, including the parts that do not flatter it: no push-to-talk on Wayland, no delivery into elevated windows on Windows, no end-to-end latency number today.',
  siblingsLabel: 'The same set of tools',
  siblings: [
    {
      id: 'codegraph',
      name: 'CodeGraph',
      role: 'Deterministic code knowledge graph',
      detail:
        'Released and actively updated — no model anywhere in the binary, so the same question returns the same bytes on every machine.',
    },
    {
      id: 'agentlens',
      name: 'AgentLens',
      role: 'Usage archive for coding agents',
      detail:
        'Released, early — pulls local and SSH-remote usage records into one durable archive.',
    },
  ],
  backHome: 'Back to the FirLab home page',
};

const voxera = { 'zh-cn': zh, en } as const satisfies Record<Lang, VoxeraContent>;

export function getVoxeraContent(lang: Lang): VoxeraContent {
  return voxera[lang];
}
