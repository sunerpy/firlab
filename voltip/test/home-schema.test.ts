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
