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

  it("still checks the 2026-09 layout on a page without a scene", () => {
    expect(() => validateHome("index.md", home({ checks: ["x", "y"] }))).toThrow(/home\.checks: unknown field/);
  });
});
