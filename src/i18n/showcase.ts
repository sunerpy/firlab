/**
 * What each project's card shows above its name: a real capture of the app, or the
 * lines of a real terminal or MCP session for a project that has no window of its own.
 *
 * Every capture is copied from the project's own documentation site (its
 * `src/public/screens/`, or `public/agentlens/` for the page on this site), in the
 * light and the dark take; the card shows the one that matches the page's theme. A
 * capture taken per language is listed per language. Every session is the transcript
 * on the project's documentation home page, re-wrapped at the shell's own line breaks.
 *
 * Typed as a `Record` over every product id, so a product added to the catalog without
 * a showcase entry is a type error rather than an empty well.
 */

import type { Lang } from './ui';
import type { ProductId } from './products';

/** One take of a capture: its path under `public/` and its intrinsic size in pixels. */
interface Take {
  src: string;
  width: number;
  height: number;
}

interface Capture {
  light: Take;
  dark: Take;
}

/**
 * One line of a session. `cmd` is a shell command after its prompt, `cont` a
 * continuation of one, `out` the result the command exists to show, `row` any other
 * output, and `call` an MCP tool call with its argument.
 */
export type SessionLine =
  | { kind: 'cmd' | 'cont' | 'out' | 'row'; text: string }
  | { kind: 'call'; tool: string; arg: string }
  | { kind: 'gap' };

export type Showcase =
  | { capture: Capture | Record<Lang, Capture> }
  | { session: SessionLine[] };

const screens = (id: string): Capture => ({
  light: { src: `/screens/${id}-light.webp`, width: 1440, height: 900 },
  dark: { src: `/screens/${id}-dark.webp`, width: 1440, height: 900 },
});

export const showcase: Record<ProductId, Showcase> = {
  pttools: { capture: screens('pttools') },
  codegraph: { capture: screens('codegraph') },
  godotmcp: {
    session: [
      { kind: 'call', tool: 'scene.tree.get', arg: 'scene: main.tscn' },
      { kind: 'row', text: '.            Node         main.gd' },
      { kind: 'row', text: 'Player       Area2D       player/player.gd' },
      { kind: 'row', text: 'HUD          CanvasLayer  ui/hud.gd' },
      { kind: 'row', text: 'HUD/Message  Label' },
      { kind: 'row', text: 'Mob          RigidBody2D' },
      { kind: 'out', text: 'Mob.body_entered → ._on_mob_body_entered' },
      { kind: 'gap' },
      { kind: 'call', tool: 'gdscript.references.get', arg: 'take_damage' },
      { kind: 'row', text: 'main.gd:6  player.take_damage()  calls' },
    ],
  },
  kiroprovider: {
    session: [
      { kind: 'cmd', text: 'curl -s $KP/responses \\' },
      { kind: 'cont', text: '    -H "Authorization: Bearer $KEY" --json \'{' },
      { kind: 'cont', text: '    "model": "gpt-5.6-sol", "store": false,' },
      { kind: 'cont', text: '    "input": "Reply with exactly: KIRO_OK"}\' |' },
      { kind: 'cont', text: "  jq -r '.output[-1].content[0].text'" },
      { kind: 'out', text: 'KIRO_OK' },
      { kind: 'cmd', text: 'curl -s $KP/messages -H "x-api-key: $KEY" \\' },
      { kind: 'cont', text: '    --json \'{"model": "claude-opus-5-5", …}\'' },
      { kind: 'out', text: 'KIRO_OK' },
    ],
  },
  bedrockgateway: {
    session: [
      { kind: 'cmd', text: 'export BGW=http://localhost:8080/api/v1' },
      { kind: 'cmd', text: 'curl -s $BGW/responses \\' },
      { kind: 'cont', text: '    -H "Authorization: Bearer $API_KEY" --json \'{' },
      { kind: 'cont', text: '    "model": "us.amazon.nova-2-lite-v1:0",' },
      { kind: 'cont', text: '    "input": "Reply with exactly: BEDROCK_OK"}\' |' },
      { kind: 'cont', text: "  jq -r '.output[-1].content[0].text'" },
      { kind: 'out', text: 'BEDROCK_OK' },
    ],
  },
  agentlens: {
    capture: {
      light: { src: '/agentlens/usage-drilldown.png', width: 1440, height: 960 },
      dark: { src: '/agentlens/overview-by-model-dark.png', width: 1440, height: 1800 },
    },
  },
  voltip: { capture: { 'zh-cn': screens('voltip-zh'), en: screens('voltip-en') } },
  lockra: { capture: { 'zh-cn': screens('lockra-zh'), en: screens('lockra-en') } },
  winer: { capture: screens('winer') },
};

/** The capture a card shows in `lang`, or `undefined` for a session. */
export function captureFor(id: ProductId, lang: Lang): Capture | undefined {
  const entry = showcase[id];
  if (!('capture' in entry)) return undefined;
  return 'light' in entry.capture ? entry.capture : entry.capture[lang];
}
