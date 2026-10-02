/**
 * Voltip detail-page content, per locale.
 *
 * Shorter than the other detail pages on purpose: Voltip has its own site,
 * https://voltip.firlab.app, with the full user guide in both languages, and this
 * page summarises it and points there. `en` is typed against the Chinese shape, so
 * a section added to one language and forgotten in the other is a compile error.
 *
 * Every claim here was checked against the product's README and its site. The
 * load-bearing ones, which must never be softened or embellished:
 *   - Release metadata comes from `versions.ts`. Early (0.0.x), not "mature".
 *   - The Android app is built and tested but NOT released. It is described as in
 *     development, never as a feature you can use.
 *   - On-device recognition keeps the audio on the computer. The cloud and AI
 *     polish paths send audio or text to the service the user chose, and the page
 *     says which.
 *   - The Windows installer is not code-signed and the Mac packages are not
 *     notarized; the first start asks for a confirmation.
 *
 * Voltip is the shipped successor of the unreleased Voxera (2026-09-29); the old
 * `/voxera/` URLs redirect here (astro.config.mjs).
 */

import type { Lang } from './ui';
import type { InstallLine, Spec } from './content';
import type { SectionMeta, TermBody } from './agentlens';

export const VOLTIP_REPO = 'https://github.com/sunerpy/voltip';
export const VOLTIP_RELEASES = `${VOLTIP_REPO}/releases`;
export const VOLTIP_SITE = 'https://voltip.firlab.app';

export interface PrivacyMode {
  name: string;
  /** Short answer to "what is sent, and where". */
  sends: string;
  detail: string;
}

export interface VoltipContent {
  title: string;
  description: string;

  role: string;
  lede: string;
  /** Leading sentence of the lede, set a step stronger. */
  ledeAccent: string;

  tocLabel: string;
  backToIndex: string;

  purpose: SectionMeta & { paras: string[]; whoLabel: string; who: TermBody[] };
  capabilities: SectionMeta & { groups: TermBody[] };
  privacy: SectionMeta & { intro: string; sendsLabel: string; modes: PrivacyMode[] };
  install: SectionMeta & {
    intro: string;
    packagesLabel: string;
    packages: { platform: string; artifact: string }[];
    commandsLabel: string;
    lines: InstallLine[];
    afterLabel: string;
    after: string;
  };
  platforms: SectionMeta & { rows: Spec[] };
  maturity: SectionMeta & { paras: string[]; buildingLabel: string; building: TermBody[] };
  links: SectionMeta & { items: { label: string; href: string }[] };
}

const INSTALL_PS1 = 'irm https://raw.githubusercontent.com/sunerpy/voltip/main/scripts/install.ps1 | iex';
const INSTALL_SH = 'curl -fsSL https://raw.githubusercontent.com/sunerpy/voltip/main/scripts/install.sh | sh';

const zh: VoltipContent = {
  title: 'Voltip — 按住说话的语音输入 · FirLab',
  description:
    '按住快捷键说话，松开后文字出现在任意应用的光标处。本机模型识别时音频不离开电脑，也可以使用内置服务或你选择的云端服务。支持 Windows、macOS 与 Linux。',

  role: '按住说话的语音输入 · 跨平台桌面应用',
  ledeAccent: '按住快捷键说话，松开后文字出现在光标处。',
  lede: '编辑器、终端、聊天窗口和写给编码 Agent 的提示都可以用。识别可以在本机完成，也可以交给你选择的服务；插入之前，文字还可以经过 AI 润色、个人词典和替换规则。',

  tocLabel: '本页内容',
  backToIndex: '返回 FirLab 首页',

  purpose: {
    id: 'purpose',
    num: '01',
    label: '用途',
    heading: '它解决的问题',
    paras: [
      '说一句话通常比打一句话快，但多数听写工具只在自己的窗口里工作，或者要求你把音频交给某一家云服务。Voltip 在任意应用的光标处输入文字，识别在哪里完成由你决定。',
      '识别出的文字还要能直接用：标点、错字、口头禅和总是听错的专有名词，都在插入之前处理掉，而不是每次手工改一遍。',
    ],
    whoLabel: '谁会需要',
    who: [
      { term: '写得多的人', body: '文档、邮件、提交说明、写给编码 Agent 的长提示，说出来比打出来快。' },
      { term: '在意数据去向的人', body: '本机模型识别时音频不离开电脑；使用云端服务时，只发给你自己选择的那一家。' },
      { term: '中英混说的人', body: '识别中英文混合的句子，词典把人名和术语固定成正确的写法。' },
    ],
  },

  capabilities: {
    id: 'capabilities',
    num: '02',
    label: '功能',
    heading: '能做什么',
    groups: [
      {
        term: '录音方式',
        body: '按住 Ctrl+Alt+Space 说话，或按一次开始、再按一次结束；也可以只用右 Ctrl、右 Alt、Mac 上的 Fn 键或鼠标侧键。悬浮窗显示输入音量，按 Esc 取消。',
      },
      {
        term: '本地识别',
        body: 'Qwen3-ASR 0.6B（690 MB）与 1.7B（1.7 GB）、SenseVoice Small（240 MB）和 Paraformer（227 MB）。Qwen3-ASR 在有显卡时通过 Vulkan 或 Metal 运行，否则使用处理器。',
      },
      {
        term: '云端识别',
        body: '发布版内置默认服务，无需设置即可开始听写；也可以改用 OpenAI、Groq、硅基流动或任意 OpenAI 兼容接口，密钥保存在系统钥匙串中。',
      },
      {
        term: 'AI 润色',
        body: '修正标点和错别字，删除口头禅和重复，不改变你说的内容。可以使用默认服务、自己的服务商或本机的 Ollama。',
      },
      {
        term: '词典、规则与场景',
        body: '词典纠正听错的人名和术语，替换规则按字面或正则改写短语，场景根据当前应用切换润色风格、输出方式和语言。',
      },
      {
        term: '插入与编辑',
        body: '粘贴到光标处或只复制到剪贴板，可以整段、逐句或边说边输入。选中文字后按 Ctrl+Alt+E 说出修改要求，即可替换选中的内容。',
      },
    ],
  },

  privacy: {
    id: 'privacy',
    num: '03',
    label: '数据',
    heading: '哪些数据会离开电脑',
    intro: '取决于你选择的服务。首页和「语音模型」页始终显示当前使用的是哪一项。',
    sendsLabel: '发送',
    modes: [
      {
        name: '本地识别',
        sends: '不发送任何内容',
        detail: '识别在 Voltip 内完成，使用磁盘上的模型文件。唯一的网络访问是下载模型，下载内容按 SHA-256 校验。',
      },
      {
        name: '云端识别',
        sends: '音频，发给你选择的服务',
        detail: '录音发送给内置服务或你配置的服务商；如果设置了词典，词条也会作为识别提示一并发送。',
      },
      {
        name: 'AI 润色与语音编辑',
        sends: '文字，发给你选择的 AI 服务',
        detail: '发送识别出的文字；语音编辑时发送选中的文字和你的指令。默认附带当前应用的名称，可以关闭。不发送音频。',
      },
    ],
  },

  install: {
    id: 'install',
    num: '04',
    label: '安装',
    heading: '安装',
    intro:
      '一行命令即可为这台电脑选择合适的安装包，按发布附带的 SHA256SUMS 校验后再安装。也可以从发布页下载安装包。',
    packagesLabel: '安装包',
    packages: [
      { platform: 'Windows 10/11 x64', artifact: '安装包与便携版 zip' },
      { platform: 'macOS 11+（Apple 芯片）', artifact: '.dmg' },
      { platform: 'macOS 11+（Intel）', artifact: '.dmg' },
      { platform: 'Linux x64', artifact: '.deb 与 AppImage' },
    ],
    commandsLabel: '安装',
    lines: [
      { note: 'Windows，PowerShell', command: INSTALL_PS1 },
      { note: 'Linux 与 macOS', command: INSTALL_SH },
    ],
    afterLabel: '装完之后',
    after:
      '在 Mac 上授予麦克风和辅助功能权限，然后按住快捷键说一句话。Windows 安装包尚未进行代码签名，Mac 安装包未经公证，首次打开时需要确认一次；详细步骤见 Voltip 网站的「安装」与「快速开始」。',
  },

  platforms: {
    id: 'platforms',
    num: '05',
    label: '平台',
    heading: '各平台的差异',
    rows: [
      { term: 'Windows', value: '全局快捷键和单键都可用。显卡通过 Vulkan 调用。以管理员身份运行的窗口不接受普通应用的输入，Voltip 会改为把文字留在剪贴板中。' },
      { term: 'macOS', value: '需要辅助功能权限，不需要「输入监控」。显卡通过 Metal 调用。从 0.0.7 起各版本使用同一张签名证书，以便更新后保留权限；第一次这样的更新尚未在真机上验证。' },
      { term: 'Linux', value: '支持 X11 和 Wayland。纯 Wayland 会话不允许全局快捷键，请为 voltip-desktop --toggle 绑定系统快捷键。' },
      { term: '手机', value: 'Android 应用已完成并通过测试，尚未发布。iOS 尚未开始。' },
    ],
  },

  maturity: {
    id: 'maturity',
    num: '06',
    label: '现状',
    heading: '当前状态',
    paras: [
      '早期版本（0.0.x），每个版本都在 Windows、macOS 和 Linux 上构建并发布。应用内可以检查并安装更新。',
      '接下来的工作写在 Voltip 网站的路线图上，下面几项正在开发，尚未包含在发布版本中：',
    ],
    buildingLabel: '正在开发',
    building: [
      { term: 'Android 应用', body: '手机当作电脑的麦克风和键盘，通过二维码、6 位验证码或局域网配对，连接端到端加密。' },
      { term: 'AI 预设与内置场景', body: '校对、提示词优化、意图整理、口语聊天、中英互译和要点纪要，以及编程开发、办公写作等内置场景。' },
      { term: '长录音与电脑声音', body: '单次最长 2 小时，可以录制麦克风、电脑声音或两者混合，并导出 SRT 字幕。' },
    ],
  },

  links: {
    id: 'links',
    num: '07',
    label: '链接',
    heading: '链接',
    items: [
      { label: '网站', href: `${VOLTIP_SITE}/zh/` },
      { label: '仓库', href: VOLTIP_REPO },
      { label: '发布页', href: VOLTIP_RELEASES },
    ],
  },
};

const en: VoltipContent = {
  title: 'Voltip — push-to-talk dictation · FirLab',
  description:
    'Hold a shortcut, speak, and let go: the text appears at the cursor in any app. With an on-device model the audio never leaves the computer; the built-in service or a cloud provider you choose also work. Windows, macOS and Linux.',

  role: 'Push-to-talk dictation · cross-platform desktop app',
  ledeAccent: 'Hold a shortcut, speak, and the text appears at your cursor.',
  lede: 'In an editor, a terminal, a chat window or a prompt to a coding agent. Recognition runs on your computer or on a service you choose, and before the text is inserted it can pass through AI polish, a personal dictionary and replacement rules.',

  tocLabel: 'On this page',
  backToIndex: 'Back to FirLab',

  purpose: {
    id: 'purpose',
    num: '01',
    label: 'Purpose',
    heading: 'The problem it solves',
    paras: [
      'Saying a sentence is usually faster than typing it, but most dictation tools only work inside their own window, or ask you to hand the audio to one particular cloud service. Voltip types at the cursor of any app, and you decide where the recognition happens.',
      'The recognised text also has to be usable as it is: punctuation, typos, filler words and the names a recogniser always mishears are dealt with before the text is inserted, not fixed by hand every time.',
    ],
    whoLabel: 'Who it is for',
    who: [
      { term: 'People who write a lot', body: 'Documents, email, commit messages and long prompts to a coding agent are faster to say than to type.' },
      { term: 'People who care where the data goes', body: 'With an on-device model the audio never leaves the computer; with a cloud service it goes only to the one you chose.' },
      { term: 'People who mix languages', body: 'Sentences that mix Chinese and English are recognised, and the dictionary keeps names and terms spelled right.' },
    ],
  },

  capabilities: {
    id: 'capabilities',
    num: '02',
    label: 'Capabilities',
    heading: 'What it does',
    groups: [
      {
        term: 'Recording',
        body: 'Hold Ctrl+Alt+Space to talk, or press once to start and again to stop; Right Ctrl, Right Alt, the Fn key on a Mac or a mouse side button work on their own too. The overlay shows the input level, and Esc cancels.',
      },
      {
        term: 'On-device recognition',
        body: 'Qwen3-ASR 0.6B (690 MB) and 1.7B (1.7 GB), SenseVoice Small (240 MB) and Paraformer (227 MB). Qwen3-ASR runs on the graphics card through Vulkan or Metal when there is one, and on the processor otherwise.',
      },
      {
        term: 'Cloud recognition',
        body: 'Release packages include a default service, so dictation works before you set anything up; OpenAI, Groq, SiliconFlow or any OpenAI-compatible endpoint can be used instead, with the key kept in the system keychain.',
      },
      {
        term: 'AI polish',
        body: 'Fixes punctuation and typos and removes filler words and repetitions without changing what you said. It can use the default service, your own provider or a local Ollama.',
      },
      {
        term: 'Dictionary, rules and scenes',
        body: 'The dictionary corrects misheard names and terms, replacement rules rewrite phrases literally or by regular expression, and scenes switch the polish style, output mode and language by app.',
      },
      {
        term: 'Insertion and editing',
        body: 'Pasted at the cursor or only copied to the clipboard, all at once, sentence by sentence or as you speak. Select text, press Ctrl+Alt+E and say what to change, and the selection is replaced.',
      },
    ],
  },

  privacy: {
    id: 'privacy',
    num: '03',
    label: 'Data',
    heading: 'What leaves your computer',
    intro: 'It depends on the service you choose. The home page and the Speech models page always show which one is in use.',
    sendsLabel: 'Sends',
    modes: [
      {
        name: 'On-device recognition',
        sends: 'Nothing',
        detail: 'Recognition happens inside Voltip with the model files on disk. The only network access is downloading a model, which is checked against its SHA-256.',
      },
      {
        name: 'Cloud recognition',
        sends: 'Audio, to the service you chose',
        detail: 'The recording goes to the built-in service or the provider you set up; with a dictionary, its entries go along as a hint.',
      },
      {
        name: 'AI polish and voice edit',
        sends: 'Text, to the AI service you chose',
        detail: 'The recognised text is sent; for voice edit, the selected text and your instruction. The current app’s name goes along by default and can be turned off. No audio.',
      },
    ],
  },

  install: {
    id: 'install',
    num: '04',
    label: 'Install',
    heading: 'Install',
    intro:
      'One command picks the right package for the computer and checks it against the release’s SHA256SUMS before installing. The packages are also on the releases page.',
    packagesLabel: 'Packages',
    packages: [
      { platform: 'Windows 10/11 x64', artifact: 'Installer and portable zip' },
      { platform: 'macOS 11+ (Apple silicon)', artifact: '.dmg' },
      { platform: 'macOS 11+ (Intel)', artifact: '.dmg' },
      { platform: 'Linux x64', artifact: '.deb and AppImage' },
    ],
    commandsLabel: 'Install',
    lines: [
      { note: 'Windows, PowerShell', command: INSTALL_PS1 },
      { note: 'Linux and macOS', command: INSTALL_SH },
    ],
    afterLabel: 'After installing',
    after:
      'On a Mac, allow the microphone and Accessibility, then hold the shortcut and say a sentence. The Windows installer is not code-signed and the Mac packages are not notarized, so the first start asks for a confirmation; the Install and Quick start pages on the Voltip site have the steps.',
  },

  platforms: {
    id: 'platforms',
    num: '05',
    label: 'Platforms',
    heading: 'How the platforms differ',
    rows: [
      { term: 'Windows', value: 'The global shortcut and single keys both work. The graphics card is used through Vulkan. Windows running as administrator do not accept input from ordinary apps, so Voltip leaves the text on the clipboard instead.' },
      { term: 'macOS', value: 'Needs the Accessibility permission, not Input Monitoring. The graphics card is used through Metal. From 0.0.7 releases share one signing certificate so that updates keep the permissions; the first such update has not been checked on a real Mac yet.' },
      { term: 'Linux', value: 'X11 and Wayland. A pure Wayland session allows no global shortcuts; bind a system shortcut to voltip-desktop --toggle instead.' },
      { term: 'Phone', value: 'The Android app is built and tested but not released yet. iOS has not been started.' },
    ],
  },

  maturity: {
    id: 'maturity',
    num: '06',
    label: 'Status',
    heading: 'Current status',
    paras: [
      'Early (0.0.x), with every release built and published for Windows, macOS and Linux. The app checks for updates and installs them.',
      'What comes next is on the roadmap on the Voltip site. These are being built and are not in a release yet:',
    ],
    buildingLabel: 'In development',
    building: [
      { term: 'Android app', body: 'The phone as the computer’s microphone and keyboard, paired by QR code, a 6-digit code or on the local network, over an end-to-end encrypted connection.' },
      { term: 'AI presets and built-in scenes', body: 'Proofreading, prompt writing, intent, chat, translation and notes, plus built-in scenes for coding, office writing and more.' },
      { term: 'Long recordings and computer audio', body: 'Up to two hours per recording, from the microphone, the computer’s own audio or both, with export to SRT subtitles.' },
    ],
  },

  links: {
    id: 'links',
    num: '07',
    label: 'Links',
    heading: 'Links',
    items: [
      { label: 'Website', href: VOLTIP_SITE },
      { label: 'Repository', href: VOLTIP_REPO },
      { label: 'Releases', href: VOLTIP_RELEASES },
    ],
  },
};

const content = { 'zh-cn': zh, en } as const satisfies Record<Lang, VoltipContent>;

export function getVoltipContent(lang: Lang): VoltipContent {
  return content[lang];
}

/** Section order, used for both the in-page table of contents and rendering. */
export function getVoltipSections(c: VoltipContent): SectionMeta[] {
  return [c.purpose, c.capabilities, c.privacy, c.install, c.platforms, c.maturity, c.links];
}
