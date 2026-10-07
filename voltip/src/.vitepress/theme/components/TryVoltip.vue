<script setup lang="ts">
/**
 * The online try page: record or upload up to a minute, recognised by the built-in service's
 * model, then polished with one of its models and a preset or a prompt of the visitor's own.
 * The API is functions/api/try/*; this component never holds a service token.
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

const { lang: siteLang } = useData();
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
const busy = ref(false);

const recording = ref<Recording | null>(null);
const level = ref(0);
const elapsed = ref(0);
const copied = ref<'heard' | 'polished' | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const presetChoices = computed(() => (opts.value?.presets ?? []).filter((id) => PRESET_TEXT[id]).map((id) => ({ id, ...PRESET_TEXT[id]![lang.value] })));
const presetDescription = computed(() => presetChoices.value.find((p) => p.id === preset.value)?.description ?? '');
const limitsLine = computed(() => {
  const l = opts.value?.limits;
  return l ? fill(t.value.limits, { asr: l.asrPerHour, polish: l.polishPerHour, asrDay: l.asrPerDay, polishDay: l.polishPerDay }) : '';
});
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

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
      turnstile = await widget(turnstileBox.value, opts.value.turnstile_site_key, lang.value === 'zh' ? 'zh-cn' : 'en', onToken, () => (verified.value = false));
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
  busy.value = true;
  error.value = '';
  polished.value = '';
  polishInfo.value = '';
  const form = new FormData();
  form.set('file', wav, 'take.wav');
  form.set('language', language.value);
  const answer = await call('/api/try/transcribe', { method: 'POST', body: form });
  busy.value = false;
  if (!answer.ok || typeof answer.body?.text !== 'string') {
    error.value = explain(answer.body as never, 'service_failed');
    return;
  }
  heard.value = answer.body.text;
  asrInfo.value = fill(t.value.timeAsr, { ms: Number(answer.body.ms ?? 0), s: Number(answer.body.seconds ?? 0) });
  if (autoPolish.value && heard.value.trim()) await runPolish();
}

async function runPolish() {
  if (!heard.value.trim()) {
    error.value = t.value.errors.no_text!;
    return;
  }
  busy.value = true;
  error.value = '';
  const body: Record<string, unknown> = { text: heard.value, model: model.value, preset: preset.value };
  if (preset.value === 'custom') body.prompt = customPrompt.value;
  if (language.value !== 'auto') body.language = language.value;
  const answer = await call('/api/try/polish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  busy.value = false;
  if (!answer.ok || typeof answer.body?.text !== 'string') {
    error.value = explain(answer.body as never, 'service_failed');
    return;
  }
  polished.value = answer.body.text;
  polishInfo.value = fill(t.value.timePolish, { ms: Number(answer.body.ms ?? 0), model: String(answer.body.model ?? model.value) });
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
      opts.value?.max_seconds ?? 60,
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
    const { wav } = await fileToWav(file, opts.value?.max_seconds ?? 60);
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
    <section v-show="!verified" class="vt-try-verify">
      <p>{{ t.verify }}</p>
      <div ref="turnstileBox" class="vt-try-turnstile" />
      <p v-if="verifyError" class="vt-try-error" role="alert">{{ verifyError }}</p>
    </section>

    <section class="vt-try-controls" :aria-disabled="!verified">
      <div class="vt-try-row">
        <button type="button" class="vt-try-btn vt-try-primary" :disabled="!verified || (busy && !recording)" @click="toggleRecording">
          <span v-if="recording" class="vt-try-dot" :style="{ transform: `scale(${1 + level})` }" aria-hidden="true" />
          {{ recording ? t.stop : t.record }}
        </button>
        <label class="vt-try-btn" :class="{ 'vt-try-disabled': !verified || busy || recording }">
          {{ t.upload }}
          <input ref="fileInput" type="file" accept="audio/*" class="vt-try-file" :disabled="!verified || busy || !!recording" @change="onFile" />
        </label>
        <span v-if="recording" class="vt-try-clock" aria-live="polite">{{ fill(t.recording, { t: clock(elapsed), max: clock(opts?.max_seconds ?? 60) }) }}</span>
        <span v-else-if="busy" class="vt-try-clock" aria-live="polite">{{ t.working }}</span>
      </div>
      <p class="vt-try-hint">{{ fill(t.uploadHint, { s: opts?.max_seconds ?? 60 }) }}</p>

      <div class="vt-try-grid">
        <label>
          <span>{{ t.language }}</span>
          <select v-model="language">
            <option v-for="code in ['auto', ...(opts?.languages ?? [])]" :key="code" :value="code">{{ LANGUAGE_NAMES[code]?.[lang] ?? code }}</option>
          </select>
        </label>
        <label>
          <span>{{ t.model }}</span>
          <select v-model="model">
            <option v-for="m in opts?.polish_models ?? []" :key="m" :value="m">{{ m }}</option>
          </select>
        </label>
        <label>
          <span>{{ t.preset }}</span>
          <select v-model="preset">
            <option v-for="p in presetChoices" :key="p.id" :value="p.id">{{ p.name }}</option>
            <option value="custom">{{ t.custom }}</option>
          </select>
        </label>
        <label class="vt-try-check">
          <input v-model="autoPolish" type="checkbox" />
          <span>{{ t.autoPolish }}</span>
        </label>
      </div>
      <p v-if="preset !== 'custom'" class="vt-try-hint">{{ presetDescription }}</p>
      <label v-else class="vt-try-block">
        <span>{{ t.custom }}</span>
        <textarea v-model="customPrompt" rows="4" :maxlength="opts?.max_prompt_chars ?? 2000" :placeholder="t.customPlaceholder" />
      </label>
    </section>

    <p v-if="error" class="vt-try-error" role="alert">{{ error }}</p>

    <section class="vt-try-results">
      <div class="vt-try-result">
        <div class="vt-try-result-head">
          <span>{{ t.heard }}</span>
          <button v-if="heard" type="button" class="vt-try-link" @click="copy('heard')">{{ copied === 'heard' ? t.copied : t.copy }}</button>
        </div>
        <textarea v-model="heard" rows="5" :placeholder="t.heardPlaceholder" :aria-label="t.heard" />
        <p v-if="asrInfo" class="vt-try-hint">{{ asrInfo }}</p>
      </div>
      <div class="vt-try-row">
        <button type="button" class="vt-try-btn" :disabled="!verified || busy || !heard.trim()" @click="runPolish">{{ t.polish }}</button>
      </div>
      <div class="vt-try-result">
        <div class="vt-try-result-head">
          <span>{{ t.polished }}</span>
          <button v-if="polished" type="button" class="vt-try-link" @click="copy('polished')">{{ copied === 'polished' ? t.copied : t.copy }}</button>
        </div>
        <div class="vt-try-output" aria-live="polite">{{ polished }}</div>
        <p v-if="polishInfo" class="vt-try-hint">{{ polishInfo }}</p>
      </div>
    </section>

    <p class="vt-try-hint">{{ limitsLine }}</p>
  </div>
</template>

<style scoped>
.vt-try {
  display: grid;
  gap: 18px;
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-elv);
}
.vt-try section {
  display: grid;
  gap: 12px;
}
.vt-try-controls[aria-disabled='true'] {
  opacity: 0.55;
}
.vt-try-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.vt-try-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-fill);
  color: var(--vp-c-text-1);
  font-weight: 500;
  cursor: pointer;
}
.vt-try-btn:hover:not(:disabled) {
  background: var(--vt-fill-hover);
}
.vt-try-primary {
  background: var(--vt-accent);
  color: var(--vt-accent-ink);
}
.vt-try-primary:hover:not(:disabled) {
  background: var(--vt-accent-hover);
}
.vt-try-btn:disabled,
.vt-try-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.vt-try-btn:focus-visible,
.vt-try select:focus-visible,
.vt-try textarea:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 2px;
}
.vt-try-file {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.vt-try-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vt-mark);
  transition: transform 0.08s linear;
}
.vt-try-clock {
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
}
.vt-try-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.vt-try label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.vt-try-check {
  display: flex !important;
  align-items: center;
  gap: 8px;
  align-self: end;
  min-height: 44px;
}
.vt-try select,
.vt-try textarea {
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-paper-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 15px;
}
.vt-try textarea {
  resize: vertical;
}
.vt-try-block {
  display: grid;
}
.vt-try-result {
  display: grid;
  gap: 6px;
}
.vt-try-result-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}
.vt-try-output {
  min-height: 88px;
  padding: 10px 12px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-paper-soft);
  white-space: pre-wrap;
  line-height: 1.6;
}
.vt-try-link {
  border: 0;
  background: none;
  color: var(--vp-c-text-2);
  text-decoration: underline;
  text-decoration-color: var(--vt-link-line);
  cursor: pointer;
}
.vt-try-hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.vt-try-error {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--vt-radius-control);
  background: var(--vt-mark-soft);
  color: var(--vp-c-text-1);
}
.vt-try-turnstile {
  min-height: 65px;
}
</style>
