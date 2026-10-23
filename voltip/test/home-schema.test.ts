import { describe, expect, it } from "vitest";

import { validateHome } from "../src/.vitepress/theme/data/home-schema";

const shot = { light: "/screens/a-light.webp", dark: "/screens/a-dark.webp", width: 1440, height: 900, alt: "A screen." };

/** The smallest `home:` frontmatter the schema accepts, without the try band. */
function home(extra: Record<string, unknown> = {}) {
  return {
    home: {
      facts: [
        { term: "Runs on", text: "Windows, macOS and Linux." },
        { term: "Your audio", text: "Stays on the computer with a local model." },
      ],
      visual: { home: shot, pill: [shot] },
      index: { title: "What it does", groups: [{ name: "Dictation", items: [{ title: "A shortcut", body: "Hold and speak.", status: "available" }] }] },
      steps: { title: "One take", items: [{ title: "Hold", body: "Hold the keys." }, { title: "Release", body: "Let go." }] },
      models: { columns: ["Model", "Size", "Languages", "Device"], rows: [{ name: "Qwen3-ASR", size: "690 MB", languages: "30", device: "GPU or CPU" }] },
      polish: { heardLabel: "Heard", heard: "um so", typedLabel: "Typed", typed: "So." },
      phone: { items: [{ title: "Hold to talk", body: "On the phone." }] },
      platforms: { title: "Platforms", columns: ["Platform", "Package"], rows: [{ name: "Windows", status: "available", cells: ["NSIS"] }] },
      privacy: { title: "What leaves the computer", sendsLabel: "Sends", modes: [{ name: "Local", sends: "Nothing", detail: "On the computer." }] },
      roadmap: { title: "Next", items: [{ title: "iOS", body: "Not started.", status: "planned" }], notPlanned: { title: "Left out", items: ["Listening all the time."] } },
      ...extra,
    },
  };
}

const TRY = {
  title: "Try Voltip in your browser",
  body: "Say a sentence and see the recognised text and the polished version in a few seconds.",
  heard: "um so let's meet next tuesday",
  polished: "Let's meet next Tuesday.",
  action: { text: "Start", link: "/guide/try" },
};

describe("validateHome", () => {
  it("accepts a home page without the try band, so the site builds before the pages carry it", () => {
    expect(() => validateHome("index.md", home())).not.toThrow();
  });

  it("accepts the try band with every field", () => {
    expect(() => validateHome("index.md", home({ try: TRY }))).not.toThrow();
  });

  it("fails the build when the try band misses its button link or carries an unknown field", () => {
    expect(() => validateHome("index.md", home({ try: { ...TRY, action: { text: "Start" } } }))).toThrow(/home\.try\.action\.link: expected a non-empty string/);
    expect(() => validateHome("index.md", home({ try: { ...TRY, sample: "x" } }))).toThrow(/home\.try\.sample: unknown field/);
    expect(() => validateHome("index.md", home({ try: { ...TRY, heard: "" } }))).toThrow(/home\.try\.heard: expected a non-empty string/);
  });
});

const img = { src: "/screens/a.webp", width: 820, height: 98, alt: "An overlay." };

/** The smallest home frontmatter in the 2026-10 layout (design A): a page that carries `scene`. */
function homeV2(extra: Record<string, unknown> = {}) {
  return {
    home: {
      checks: ["Windows, macOS and Linux", "Open source"],
      scene: { steps: ["Hold and speak", "Release"], live: img, label: "Inserted", result: "The text.", inserted: img, caption: "A real take." },
      pairs: {
        title: "Filler words removed",
        labels: { said: "You said", inserted: "Inserted", edit: "Select and say", selection: "Selected", replaced: "Replaced with", actual: "Actual output", example: "Example" },
        items: [
          { kind: "dictation", source: "actual", said: "~~um~~ the text", result: "The text." },
          { kind: "edit", source: "example", said: "Make it a list.", selection: "One. Two.", result: "- One.\n- Two." },
        ],
      },
      presets: {
        title: "One sentence, a preset each",
        intro: "Presets decide what polish does.",
        saidLabel: "You said",
        said: "um so",
        outputs: [
          { name: "Proofread", desc: "Fixes typos", text: "So." },
          { name: "Formal", desc: "Formal language", text: "Thus." },
        ],
      },
      modes: {
        title: "Where the speech is recognised",
        scope: "This computer",
        items: [
          {
            icon: "cpu",
            label: "On this computer",
            title: "Offline",
            flow: { from: "You speak", to: "Local model", icon: "cpu", local: true },
            assure: "The audio stays here",
            specs: [{ term: "Cost", text: "Free" }],
            chipsLabel: "Providers",
            chips: [{ name: "OpenAI", mark: "openai" }, { name: "Compatible", icon: "plug" }, { name: "Paraformer" }],
          },
        ],
      },
      phone: {
        title: "Your phone",
        intro: "Hold to talk on the phone.",
        items: [{ icon: "qr", title: "Pair once", body: "Scan the code." }],
        figure: { back: { ...img, dark: "/screens/a-dark.webp" }, front: img },
      },
      platforms: { title: "Platforms", cards: [{ name: "Windows", status: "available", specs: [{ term: "Package", text: "NSIS" }] }] },
      faq: { title: "Questions", items: [{ q: "Offline?", a: "Yes, with a [local model](/recognition/local)." }] },
      closer: { title: "Start speaking", actions: [{ text: "Download", link: "/guide/install", theme: "brand", icon: "download" }] },
      ...extra,
    },
  };
}

describe("validateHome, 2026-10 layout", () => {
  it("accepts the layout with and without the try band", () => {
    expect(() => validateHome("index.md", homeV2())).not.toThrow();
    expect(() => validateHome("index.md", homeV2({ try: TRY }))).not.toThrow();
  });

  it("is strict: a field of the 2026-09 layout fails on a page in the new one", () => {
    expect(() => validateHome("index.md", homeV2({ index: { title: "x", groups: [] } }))).toThrow(/home\.index: unknown field/);
  });

  it("fails on a missing band, an unknown icon, mark or status", () => {
    const { faq: _faq, ...withoutFaq } = homeV2().home;
    expect(() => validateHome("index.md", { home: withoutFaq })).toThrow(/home\.faq: expected an object/);
    const bad = homeV2();
    bad.home.phone.items[0]!.icon = "rocket";
    bad.home.modes.items[0]!.chips[0]!.mark = "anthropic";
    bad.home.platforms.cards[0]!.status = "beta";
    expect(() => validateHome("index.md", bad)).toThrow(/phone\.items\[0\]\.icon: expected one of mic/);
    expect(() => validateHome("index.md", bad)).toThrow(/chips\[0\]\.mark: expected one of openai/);
    expect(() => validateHome("index.md", bad)).toThrow(/cards\[0\]\.status: expected one of available/);
  });

  it("ties a selection to a voice edit and a chip to one picture", () => {
    const edit = homeV2();
    delete (edit.home.pairs.items[1] as { selection?: string }).selection;
    expect(() => validateHome("index.md", edit)).toThrow(/pairs\.items\[1\]\.selection: a voice edit needs the selected text/);
    const dictation = homeV2();
    (dictation.home.pairs.items[0] as { selection?: string }).selection = "x";
    expect(() => validateHome("index.md", dictation)).toThrow(/pairs\.items\[0\]\.selection: only a voice edit has a selection/);
    const chip = homeV2();
    chip.home.modes.items[0]!.chips[0] = { name: "OpenAI", mark: "openai", icon: "plug" } as never;
    expect(() => validateHome("index.md", chip)).toThrow(/chips\[0\]: give a mark or an icon, not both/);
  });

  it("accepts the modes without their old diagram fields, and with them (2026-10-24 comparison table)", () => {
    const bare = homeV2();
    delete (bare.home.modes as { scope?: string }).scope;
    delete (bare.home.modes.items[0] as { flow?: unknown }).flow;
    expect(() => validateHome("index.md", bare)).not.toThrow();
    const broken = homeV2();
    (broken.home.modes.items[0] as { flow: unknown }).flow = { from: "You speak" };
    expect(() => validateHome("index.md", broken)).toThrow(/modes\.items\[0\]\.flow\.to: expected a non-empty string/);
  });

  it("takes the closer's shortcut as a list of key caps", () => {
    const keys = homeV2();
    (keys.home.closer as { keys?: string[] }).keys = ["Ctrl", "Alt", "Space"];
    expect(() => validateHome("index.md", keys)).not.toThrow();
    (keys.home.closer as { keys?: unknown }).keys = [];
    expect(() => validateHome("index.md", keys)).toThrow(/home\.closer\.keys/);
    (keys.home.closer as { keys?: unknown }).keys = ["Ctrl", ""];
    expect(() => validateHome("index.md", keys)).toThrow(/home\.closer\.keys\[1\]: expected a non-empty string/);
  });

  it("accepts the steps of a dictation and the more features, both optional (2026-10-24)", () => {
    const flow = {
      title: "What happens",
      steps: [
        { icon: "mic", name: "Recording", text: "Hold to talk." },
        { icon: "audio", name: "Recognition", text: "A local model." },
        { icon: "cursor", name: "Insert", text: "At your cursor.", tag: "Optional" },
      ],
    };
    const more = {
      title: "More",
      items: [
        { title: "Dictionary", wide: true, body: "Spelled right.", swap: { from: "cube control", to: "kubectl" }, guide: "[Dictionary](/recognition/dictionary)" },
        { title: "Single key", body: "Right Ctrl.", keys: ["Right Ctrl", "Fn"] },
      ],
    };
    expect(() => validateHome("index.md", homeV2({ flow, more }))).not.toThrow();
    expect(() => validateHome("index.md", homeV2({ flow: { ...flow, steps: flow.steps.slice(0, 2) } }))).toThrow(/home\.flow\.steps: expected a list with at least 3/);
    expect(() => validateHome("index.md", homeV2({ flow: { ...flow, steps: [{ ...flow.steps[0], icon: "rocket" }, ...flow.steps.slice(1)] } }))).toThrow(/home\.flow\.steps\[0\]\.icon/);
    const twoProofs = { ...more, items: [{ ...more.items[0], chips: ["a"] }, more.items[1]] };
    expect(() => validateHome("index.md", homeV2({ more: twoProofs }))).toThrow(/home\.more\.items\[0\]: give one of chips, swap, not several/);
  });

  it("takes a scene's apps as marks or icons, with its instruction or words (2026-10-24 scene cards)", () => {
    const scenes = (items: unknown[]) => ({ title: "Scenes", labels: { preset: "Preset", instruction: "Extra instructions" }, items });
    const cards = homeV2();
    (cards.home.presets as { scenes?: unknown }).scenes = scenes([
      { name: "Coding", preset: "Proofread", apps: [{ name: "Cursor", mark: "cursor" }, { name: "Legal", icon: "scale" }], more: "And VS Code.", instruction: "Keep code." },
      { name: "Chat", preset: "Casual chat", body: "No extra instructions." },
    ]);
    expect(() => validateHome("index.md", cards)).not.toThrow();
    const rows = homeV2();
    (rows.home.presets as { scenes?: unknown }).scenes = { title: "Scenes", items: [{ name: "Coding", body: "Editors.", preset: "Proofread" }] };
    expect(() => validateHome("index.md", rows)).not.toThrow();
    const bare = homeV2();
    (bare.home.presets as { scenes?: unknown }).scenes = scenes([{ name: "Coding", preset: "Proofread" }]);
    expect(() => validateHome("index.md", bare)).toThrow(/scenes\.items\[0\]: give its apps, its instruction or a body/);
    const both = homeV2();
    (both.home.presets as { scenes?: unknown }).scenes = scenes([{ name: "Coding", preset: "Proofread", apps: [{ name: "Cursor", mark: "cursor", icon: "cpu" }] }]);
    expect(() => validateHome("index.md", both)).toThrow(/apps\[0\]: give a mark or an icon, not both/);
    const unknown = homeV2();
    (unknown.home.presets as { scenes?: unknown }).scenes = scenes([{ name: "Coding", preset: "Proofread", apps: [{ name: "VS Code", mark: "vscode" }] }]);
    expect(() => validateHome("index.md", unknown)).toThrow(/apps\[0\]\.mark: expected one of cursor/);
  });

  it("still checks the 2026-09 layout on a page without a scene", () => {
    expect(() => validateHome("index.md", home({ checks: ["x", "y"] }))).toThrow(/home\.checks: unknown field/);
  });
});
