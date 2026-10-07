/**
 * The app's built-in presets (copied from the voltip repository's IPC fixture by
 * scripts/sync-voltip-docs.sh) and the system prompt the app builds from one: the preset's text,
 * then the speaker's language (voltip crates/voltip-refine/src/prompt.rs `system_prompt`).
 */
import presets from "../../src/.vitepress/theme/data/presets-builtin.json";

export interface BuiltinPreset {
  id: string;
  prompt: string;
}

export const PRESETS: BuiltinPreset[] = presets as BuiltinPreset[];

/** The polish models of the built-in service (Groq's free tier), the first one the app's default. */
export const POLISH_MODELS = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"] as const;

export const LANGUAGES = ["zh", "en", "ja", "ko", "yue"] as const;

/** The app's sampling temperature for polish. */
export const TEMPERATURE = 0.2;

export const MAX_PROMPT_CHARS = 2000;
export const MAX_TEXT_CHARS = 2000;

export function systemPrompt(base: string, presetId: string | null, language: string | null): string {
  let prompt = base;
  if (language) {
    prompt += `\n\n说话人使用的语言代码：${language}`;
    prompt += presetId === "translate" ? "。" : "。输出保持这种语言。";
  }
  return prompt;
}

/**
 * `max_tokens` as the app sets it for the preset (presets.rs `output_token_budget`), between its
 * MIN_OUTPUT_TOKENS (128) and the built-in service's ceiling BUILTIN_OUTPUT_CAP (900).
 */
export function outputBudget(presetId: string | null, chars: number): number {
  const wanted = presetId === "translate" || presetId === "prompt" ? chars * 3 + 128 : presetId === "notes" ? chars : chars * 2 + 64;
  return Math.min(900, Math.max(128, wanted));
}
