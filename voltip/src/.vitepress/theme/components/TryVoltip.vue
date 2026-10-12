<script setup lang="ts">
/**
 * The online try page: record or upload up to a minute, recognised by the built-in service's
 * model, then polished with one of its models and a preset or a prompt of the visitor's own.
 * The API is functions/api/try/*; this component never holds a service token.
 *
 * Laid out as one centred column (design A, 2026-10-12): the round record button is the page,
 * the settings are three pill selects under it, and both texts share one card with the step
 * between them marked. The page that carries it is a `layout: page` with `pageClass:
 * vt-try-page`, so no sidebar, outline or pager competes with it.
 */
import { useData } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { AudioError, fileToWav, record, type Recording } from './try/audio';
import { fill, LANGUAGE_NAMES, langOf, PRESET_TEXT, strings } from './try/strings';
import { widget } from './try/turnstile';

interface Options {
  asr_model: string;
  polish_models: string[];
  presets: string[];
  languages: string[];
  max_seconds: number;
  max_prompt_chars: number;
  limits: { asrPerHour: number; polishPerHour: number; asrPerDay: number; polishPerDay: number };
  turnstile_site_key: string;
}

const { lang: siteLang, isDark } = useData();
const lang = computed(() => langOf(siteLang.value));
const t = computed(() => strings(lang.value));

const opts = ref<Options | null>(null);
const verified = ref(false);
const verifyError = ref('');
const turnstileBox = ref<HTMLElement | null>(null);
let turnstile: { reset(): void; remove(): void } | null = null;

const language = ref('auto');
const model = ref('');
const preset = ref('proofread');
const customPrompt = ref('');
const autoPolish = ref(true);

const heard = ref('');
const polished = ref('');
const asrInfo = ref('');
const polishInfo = ref('');
const error = ref('');
/** What the service is doing for the page right now, if anything. */
const step = ref<'asr' | 'polish' | null>(null);
const busy = computed(() => step.value !== null);

const recording = ref<Recording | null>(null);
const level = ref(0);
const elapsed = ref(0);
const copied = ref<'heard' | 'polished' | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const maxSeconds = computed(() => opts.value?.max_seconds ?? 60);
const presetChoices = computed(() => (opts.value?.presets ?? []).filter((id) => PRESET_TEXT[id]).map((id) => ({ id, ...PRESET_TEXT[id]![lang.value] })));
const presetName = computed(() => (preset.value === 'custom' ? t.value.custom : (presetChoices.value.find((p) => p.id === preset.value)?.name ?? preset.value)));
const presetDescription = computed(() => presetChoices.value.find((p) => p.id === preset.value)?.description ?? '');
const limitsLine = computed(() => {
  const l = opts.value?.limits;
  return l ? fill(t.value.limits, { asr: l.asrPerHour, polish: l.polishPerHour }) : '';
});
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const seconds = (ms: number) => (ms / 1000).toFixed(1);
/** `Qwen/Qwen3-ASR-1.7B` → `Qwen3-ASR-1.7B`. */
const shortModel = (id: string) => id.slice(id.lastIndexOf('/') + 1);

/** The line under the record button: what pressing it does now, or what is happening. */
const recordLine = computed(() => {
  if (recording.value) return fill(t.value.recording, { t: clock(elapsed.value), max: clock(maxSeconds.value) });
  if (step.value === 'asr') return t.value.recognising;
  if (step.value === 'polish') return t.value.polishing;
  if (!opts.value) return '';
  if (!verified.value) return verifyError.value ? '' : t.value.verifying;
  return fill(t.value.ready, { s: maxSeconds.value });
});
/** What a screen reader hears: the step, not the clock that ticks under the button. */
const status = computed(() => {
  if (recording.value) return t.value.listening;
  if (step.value === 'asr') return t.value.recognising;
  if (step.value === 'polish') return t.value.polishing;
  return '';
});

function explain(body: { error?: string; retry_after?: number; max_seconds?: number; max_chars?: number } | null, fallback = 'unknown'): string {
  const code = body?.error ?? fallback;
  const template = t.value.errors[code] ?? t.value.errors.unknown!;
  return fill(template, {
    code,
    m: Math.max(1, Math.ceil((body?.retry_after ?? 60) / 60)),
    s: code === 'too_long' ? (body?.max_seconds ?? opts.value?.max_seconds ?? 60) : (body?.retry_after ?? 30),
    c: body?.max_chars ?? opts.value?.max_prompt_chars ?? 2000,
  });
}

async function call(path: string, init: RequestInit): Promise<{ ok: boolean; status: number; body: Record<string, unknown> | null }> {
  try {
    const response = await fetch(path, { ...init, credentials: 'same-origin' });
    const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    if (response.status === 401 && body?.error === 'no_session') {
      verified.value = false;
      turnstile?.reset();
    }
    return { ok: response.ok, status: response.status, body };
  } catch {
    return { ok: false, status: 0, body: { error: 'network' } };
  }
}

async function onToken(token: string) {
  verifyError.value = '';
  const answer = await call('/api/try/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ turnstile: token }) });
  if (answer.ok) {
    verified.value = true;
    error.value = '';
  } else {
    verifyError.value = explain(answer.body as never, 'not_verified');
    turnstile?.reset();
  }
}

onMounted(async () => {
  const answer = await call('/api/try/options', { method: 'GET' });
  if (!answer.ok || !answer.body) {
    error.value = explain(answer.body as never, 'service_unreachable');
    return;
  }
  opts.value = answer.body as unknown as Options;
  model.value = opts.value.polish_models[0] ?? '';
  if (turnstileBox.value && opts.value.turnstile_site_key) {
    try {
      // The answer only opens the 30-minute session (`/api/try/session`); once that cookie is set
      // the answer lapsing changes nothing, so it is not fetched again and the page stays usable.
      // A lapsed session comes back from the API as `no_session`, which resets the widget (`call`).
      // (2026-10-12: re-verifying every five minutes left the record button waiting mid-session.)
      turnstile = await widget(turnstileBox.value, opts.value.turnstile_site_key, lang.value === 'zh' ? 'zh-cn' : 'en', onToken, () => {}, {
        theme: isDark.value ? 'dark' : 'light',
        refreshExpired: 'never',
      });
    } catch {
      verifyError.value = t.value.verifyFailed;
    }
  }
});

onBeforeUnmount(() => {
  recording.value?.cancel();
  turnstile?.remove();
});

async function recognise(wav: Blob) {
  step.value = 'asr';
  error.value = '';
  polished.value = '';
  polishInfo.value = '';
  const form = new FormData();
  form.set('file', wav, 'take.wav');
  form.set('language', language.value);
  const answer = await call('/api/try/transcribe', { method: 'POST', body: form });
  step.value = null;
  if (!answer.ok || typeof answer.body?.text !== 'string') {
    error.value = explain(answer.body as never, 'service_failed');
    return;
  }
  heard.value = answer.body.text;
  asrInfo.value = fill(t.value.asrMeta, {
    model: shortModel(opts.value?.asr_model ?? ''),
    s: Number(answer.body.seconds ?? 0),
    sec: seconds(Number(answer.body.ms ?? 0)),
  });
  if (autoPolish.value && heard.value.trim()) await runPolish();
}

async function runPolish() {
  if (!heard.value.trim()) {
    error.value = t.value.errors.no_text!;
    return;
  }
  step.value = 'polish';
  error.value = '';
  const body: Record<string, unknown> = { text: heard.value, model: model.value, preset: preset.value };
  if (preset.value === 'custom') body.prompt = customPrompt.value;
  if (language.value !== 'auto') body.language = language.value;
  const name = presetName.value;
  const answer = await call('/api/try/polish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  step.value = null;
  if (!answer.ok || typeof answer.body?.text !== 'string') {
    error.value = explain(answer.body as never, 'service_failed');
    return;
  }
  polished.value = answer.body.text;
  polishInfo.value = fill(t.value.polishMeta, { preset: name, model: shortModel(String(answer.body.model ?? model.value)), sec: seconds(Number(answer.body.ms ?? 0)) });
}

async function toggleRecording() {
  if (recording.value) {
    const take = recording.value;
    recording.value = null;
    level.value = 0;
    const { wav } = await take.stop();
    await recognise(wav);
    return;
  }
  error.value = '';
  try {
    recording.value = await record(
      maxSeconds.value,
      (l, s) => {
        level.value = l;
        elapsed.value = s;
      },
      () => void toggleRecording(),
    );
    elapsed.value = 0;
  } catch (e) {
    error.value = explain({ error: e instanceof AudioError ? e.code : 'no_audio_support' });
  }
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (fileInput.value) fileInput.value.value = '';
  if (!file) return;
  error.value = '';
  try {
    const { wav } = await fileToWav(file, maxSeconds.value);
    await recognise(wav);
  } catch (e) {
    error.value = explain({ error: e instanceof AudioError ? e.code : 'not_audio' });
  }
}

async function copy(which: 'heard' | 'polished') {
  await navigator.clipboard?.writeText(which === 'heard' ? heard.value : polished.value);
  copied.value = which;
  setTimeout(() => (copied.value = null), 1500);
}
</script>

<template>
  <div class="vt-try">
    <!-- Empty unless Cloudflare needs the visitor to click (interaction-only); gone once verified. -->
    <div v-show="!verified" ref="turnstileBox" class="vt-try-turnstile" />
    <p v-if="verifyError" class="vt-try-error" role="alert">{{ verifyError }}</p>

    <section class="vt-try-rec">
      <button
        type="button"
        class="vt-try-mic"
        :class="{ 'is-live': recording }"
        :style="{ '--vt-level': level }"
        :disabled="!verified || (busy && !recording)"
        :aria-label="recording ? t.stop : t.record"
        @click="toggleRecording">
        <svg v-if="recording" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" /></svg>
        <svg v-else width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z M19 11a7 7 0 0 1-14 0 M12 18v3" /></svg>
      </button>
      <p class="vt-try-line" aria-hidden="true"><span v-if="recording" class="vt-try-dot" />{{ recordLine }}</p>
      <p class="vt-try-sr" role="status">{{ status }}</p>
      <label class="vt-try-upload" :class="{ 'is-off': !verified || busy || recording }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4 M7 9l5-5 5 5 M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></svg>
        {{ t.upload }}
        <input ref="fileInput" type="file" accept="audio/*" class="vt-try-file" :disabled="!verified || busy || !!recording" @change="onFile" />
      </label>
    </section>

    <section class="vt-try-opts" :aria-label="t.settings">
      <label class="vt-try-chip">
        <span>{{ t.language }}</span>
        <select v-model="language">
          <option v-for="code in ['auto', ...(opts?.languages ?? [])]" :key="code" :value="code">{{ LANGUAGE_NAMES[code]?.[lang] ?? code }}</option>
        </select>
      </label>
      <label class="vt-try-chip">
        <span>{{ t.model }}</span>
        <select v-model="model">
          <option v-for="m in opts?.polish_models ?? []" :key="m" :value="m">{{ shortModel(m) }}</option>
        </select>
      </label>
      <label class="vt-try-chip">
        <span>{{ t.preset }}</span>
        <select v-model="preset">
          <option v-for="p in presetChoices" :key="p.id" :value="p.id">{{ p.name }}</option>
          <option value="custom">{{ t.custom }}</option>
        </select>
      </label>
      <label class="vt-try-switch">
        <input v-model="autoPolish" type="checkbox" role="switch" />
        <i aria-hidden="true" />
        {{ t.autoPolish }}
      </label>
    </section>
    <p v-if="preset !== 'custom'" class="vt-try-hint">{{ presetDescription }}</p>
    <label v-else class="vt-try-prompt">
      <span>{{ t.custom }}</span>
      <textarea v-model="customPrompt" rows="3" :maxlength="opts?.max_prompt_chars ?? 2000" :placeholder="t.customPlaceholder" />
    </label>

    <p v-if="error" class="vt-try-error" role="alert">{{ error }}</p>

    <section class="vt-try-card" :aria-label="t.results">
      <div class="vt-try-part">
        <div class="vt-try-head">
          <span class="vt-try-label">{{ t.heard }}</span>
          <span v-if="asrInfo" class="vt-try-meta">{{ asrInfo }}</span>
          <button v-if="heard" type="button" class="vt-try-icon" :aria-label="copied === 'heard' ? t.copied : t.copyHeard" :title="copied === 'heard' ? t.copied : t.copyHeard" @click="copy('heard')">
            <svg v-if="copied === 'heard'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><path d="M9 9h10v10H9z M5 15V5h10" /></svg>
          </button>
        </div>
        <textarea v-model="heard" class="vt-try-text is-heard" rows="2" :placeholder="t.heardPlaceholder" :aria-label="t.heard" />
      </div>
      <div class="vt-try-part is-out">
        <span class="vt-try-flow" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 4V2 M15 10V8 M11 6h2 M17 6h2 M3 21l9-9 M12.5 11.5l1-1" /></svg>
          {{ t.flow }}
        </span>
        <div class="vt-try-head">
          <span class="vt-try-label">{{ t.polished }}</span>
          <span v-if="polishInfo" class="vt-try-meta">{{ polishInfo }}</span>
          <button v-if="polished" type="button" class="vt-try-icon" :aria-label="copied === 'polished' ? t.copied : t.copyPolished" :title="copied === 'polished' ? t.copied : t.copyPolished" @click="copy('polished')">
            <svg v-if="copied === 'polished'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><path d="M9 9h10v10H9z M5 15V5h10" /></svg>
          </button>
        </div>
        <p class="vt-try-text" :class="{ 'is-empty': !polished }" aria-live="polite">{{ polished || t.polishedPlaceholder }}</p>
        <div class="vt-try-foot">
          <button type="button" class="vt-try-btn" :disabled="!verified || busy || !heard.trim()" @click="runPolish">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7" /></svg>
            {{ polished ? t.polishAgain : t.polish }}
          </button>
        </div>
      </div>
    </section>

    <p class="vt-try-note">
      <span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /></svg>
        {{ t.notKept }}
      </span>
      <span v-if="limitsLine">{{ limitsLine }}</span>
      <a :href="t.privacyLink">{{ t.privacy }}</a>
    </p>

    <aside class="vt-try-app">
      <p><strong>{{ t.appLead }}</strong> {{ t.appBody }}</p>
      <a class="vt-try-btn is-primary" :href="t.appLink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11 M7 10l5 5 5-5 M5 20h14" /></svg>
        {{ t.appAction }}
      </a>
    </aside>
  </div>
</template>

<style>
/* The page around the component (`pageClass: vt-try-page`, `layout: page`): one centred
   column, the Markdown's title and line above the record button. */
.vt-try-page .VPPage {
  max-width: 808px;
  margin: 0 auto;
  padding: 72px 24px 112px;
}
.vt-try-page .VPPage h1 {
  margin: 0;
  color: var(--vt-ink-900);
  font-size: 44px;
  font-weight: 700;
  line-height: var(--vt-lh-display);
  letter-spacing: var(--vt-ls-display);
  text-align: center;
}
.vt-try-page .VPPage h1 + p {
  margin: 14px 0 0;
  color: var(--vt-ink-500);
  font-size: 17px;
  line-height: 1.6;
  text-align: center;
  text-wrap: balance;
}
@media (max-width: 640px) {
  .vt-try-page .VPPage {
    padding: 40px 16px 96px;
  }
  .vt-try-page .VPPage h1 {
    font-size: 34px;
  }
}
</style>

<style scoped>
.vt-try {
  display: grid;
  margin-top: 8px;
}

.vt-try-turnstile:not(:empty) {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.vt-try-error {
  margin: 20px 0 0;
  padding: 10px 14px;
  border-radius: var(--vt-radius-control);
  background: var(--vt-mark-soft);
  color: var(--vt-ink-900);
  font-size: 15px;
  text-align: center;
}

/* ---- The record button --------------------------------------------------- */

.vt-try-rec {
  display: grid;
  justify-items: center;
  gap: 14px;
  margin-top: 52px;
}

.vt-try-mic {
  position: relative;
  display: grid;
  place-items: center;
  width: 112px;
  height: 112px;
  border: 0;
  border-radius: 50%;
  background: var(--vt-accent);
  color: var(--vt-accent-ink);
  box-shadow: var(--vt-shadow-pill);
  cursor: pointer;
  transition: background-color 0.2s;
}
.vt-try-mic:hover:not(:disabled) {
  background: var(--vt-accent-hover);
}
.vt-try-mic:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  box-shadow: none;
}
.vt-try-mic:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 16px;
}
/* A hairline ring at rest; while recording, an orange ring that follows the input level. */
.vt-try-mic::before {
  content: '';
  position: absolute;
  inset: -12px;
  border: 1px solid var(--vt-rule);
  border-radius: 50%;
}
.vt-try-mic.is-live::before {
  inset: calc(-14px - var(--vt-level, 0) * 14px);
  border: 3px solid var(--vt-mark);
  transition: inset 0.08s linear;
}
@media (prefers-reduced-motion: reduce) {
  .vt-try-mic.is-live::before {
    inset: -18px;
    transition: none;
  }
}

.vt-try-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  margin: 18px 0 0;
  color: var(--vt-ink-500);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}
.vt-try-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.vt-try-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vt-mark);
}

.vt-try-upload {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--vt-ink-500);
  font-size: 14px;
  text-decoration: underline;
  text-decoration-color: var(--vt-link-line);
  text-underline-offset: 3px;
  cursor: pointer;
}
.vt-try-upload:hover {
  color: var(--vt-ink-900);
}
.vt-try-upload.is-off {
  opacity: 0.5;
  cursor: not-allowed;
}
.vt-try-upload:focus-within {
  outline: 2px solid var(--vt-accent);
  outline-offset: 3px;
  border-radius: var(--vt-radius-chip);
}
.vt-try-file {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

/* ---- Settings: selects drawn as pills ------------------------------------ */

.vt-try-opts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}
.vt-try-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 0 0 14px;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-fill);
  color: var(--vt-ink-400);
  font-size: 14px;
  white-space: nowrap;
}
.vt-try-chip:hover {
  background: var(--vt-fill-hover);
}
.vt-try-chip:focus-within {
  outline: 2px solid var(--vt-accent);
  outline-offset: 2px;
}
.vt-try-chip select {
  height: 36px;
  padding: 0 32px 0 0;
  border: 0;
  background: transparent
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b6779' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M7 10l5 5 5-5'/%3E%3C/svg%3E")
    right 10px center / 16px no-repeat;
  color: var(--vt-ink-900);
  font: inherit;
  font-weight: 500;
  appearance: none;
  /* As wide as the chosen option, not the longest one (where supported). */
  field-sizing: content;
  cursor: pointer;
  outline: none;
}
.vt-try-chip select option {
  background: var(--vt-paper-elv);
  color: var(--vt-ink-900);
}

.vt-try-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  color: var(--vt-ink-500);
  font-size: 14px;
  cursor: pointer;
}
.vt-try-switch input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
.vt-try-switch i {
  position: relative;
  width: 30px;
  height: 18px;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-paper-2);
  transition: background-color 0.2s;
}
.vt-try-switch i::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vt-paper-elv);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: transform 0.2s;
}
.vt-try-switch input:checked + i {
  background: var(--vt-accent);
}
.vt-try-switch input:checked + i::after {
  transform: translateX(12px);
  background: var(--vt-accent-ink);
}
.vt-try-switch input:focus-visible + i {
  outline: 2px solid var(--vt-accent);
  outline-offset: 2px;
}

.vt-try-hint {
  margin: 14px 0 0;
  color: var(--vt-ink-400);
  font-size: 13px;
  text-align: center;
}
.vt-try-prompt {
  display: grid;
  gap: 6px;
  margin-top: 16px;
  color: var(--vt-ink-500);
  font-size: 14px;
}
.vt-try-prompt textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-paper-elv);
  color: var(--vt-ink-900);
  font: inherit;
  font-size: 15px;
  resize: vertical;
}
.vt-try-prompt textarea:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 1px;
}

/* ---- The result card ------------------------------------------------------- */

.vt-try-card {
  margin-top: 28px;
  overflow: hidden;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-elv);
  box-shadow: var(--vt-shadow-plate);
}
.vt-try-part {
  display: grid;
  gap: 8px;
  padding: 18px 22px 20px;
}
/* Where the heard text turns into the polished one: a tag on the rule between them. */
.vt-try-part.is-out {
  position: relative;
  border-top: 1px solid var(--vt-rule);
  background: var(--vt-paper-0);
}
.vt-try-flow {
  position: absolute;
  top: 0;
  left: 50%;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-pill);
  background: var(--vt-paper-elv);
  color: var(--vt-ink-500);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}
.vt-try-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  min-height: 32px;
}
.vt-try-label {
  color: var(--vt-ink-500);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.vt-try-meta {
  margin-left: auto;
  color: var(--vt-ink-400);
  font-family: var(--vt-font-mono);
  font-size: 12px;
}
.vt-try-icon {
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-left: auto;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--vt-ink-500);
  cursor: pointer;
}
.vt-try-meta + .vt-try-icon {
  margin-left: 0;
}
.vt-try-icon:hover {
  background: var(--vt-fill);
  color: var(--vt-ink-900);
}
.vt-try-icon:focus-visible,
.vt-try-btn:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 2px;
}
.vt-try-text {
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--vt-ink-900);
  font: inherit;
  font-size: 17px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
textarea.vt-try-text {
  min-height: calc(2 * 1.8em);
  resize: none;
  field-sizing: content;
  outline: none;
}
.vt-try-text.is-heard {
  color: var(--vt-ink-700);
}
.vt-try-text::placeholder,
.vt-try-text.is-empty {
  color: var(--vt-ink-400);
  font-size: 15px;
}
.vt-try-part:first-child:focus-within {
  box-shadow: inset 0 0 0 2px var(--vt-accent);
}
.vt-try-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.vt-try-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border: 0;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-fill);
  color: var(--vt-ink-900);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
}
.vt-try-btn:hover:not(:disabled) {
  background: var(--vt-fill-hover);
}
.vt-try-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.vt-try-btn.is-primary {
  background: var(--vt-accent);
  color: var(--vt-accent-ink);
}
.vt-try-btn.is-primary:hover {
  background: var(--vt-accent-hover);
}

/* ---- What the page keeps, and the app ------------------------------------ */

.vt-try-note {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 18px;
  margin: 22px 0 0;
  color: var(--vt-ink-400);
  font-size: 13px;
}
.vt-try-note span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.vt-try-note a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--vt-link-line);
  text-underline-offset: 2px;
}
.vt-try-note a:hover {
  color: var(--vt-ink-900);
}

.vt-try-app {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--vt-rule);
}
.vt-try-app p {
  margin: 0;
  color: var(--vt-ink-500);
  font-size: 15px;
}
.vt-try-app strong {
  color: var(--vt-ink-900);
  font-weight: 600;
}

@media (max-width: 640px) {
  .vt-try-rec {
    margin-top: 40px;
  }
  .vt-try-part {
    padding: 16px 16px 18px;
  }
  /* The label and the copy button on one row, the timings under them. */
  .vt-try-meta {
    order: 3;
    flex-basis: 100%;
    margin-left: 0;
  }
  .vt-try-meta + .vt-try-icon,
  .vt-try-icon {
    margin-left: auto;
  }
}
</style>
