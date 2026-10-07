<script setup lang="ts">
/**
 * The admin page: sign in with the admin password and a Turnstile answer, then read the edge's
 * daily summaries (functions/_lib/admin.ts). The session cookie is HttpOnly, so the page asks for
 * the statistics first and shows the sign-in form when the answer is 401. The page sits outside
 * the two locales, so the browser's language picks the words.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import { fill, type Lang, langOf, strings } from './try/strings';
import { widget } from './try/turnstile';

interface Endpoint {
  requests: number;
  status: Record<string, number>;
  limited: number;
  upstream_429: number;
  p50_ms: number | null;
  p95_ms: number | null;
}
interface Day {
  day: string;
  users: number;
  endpoints: Record<string, Endpoint | undefined>;
}
interface Stats {
  edge: { generated?: string; days?: Day[] } | null;
  edge_error: string | null;
  try_today: { asr: number; polish: number; limits: { asrPerDay: number; polishPerDay: number } };
}

const lang = ref<Lang>('en');
const t = computed(() => strings(lang.value));
const a = computed(() => t.value.admin);

const phase = ref<'loading' | 'signedOut' | 'signedIn'>('loading');
const message = ref('');
const busy = ref(false);
const password = ref('');
const token = ref('');
const stats = ref<Stats | null>(null);
const turnstileBox = ref<HTMLElement | null>(null);
let turnstile: { reset(): void; remove(): void } | null = null;

async function call(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; body: Record<string, unknown> | null }> {
  try {
    const response = await fetch(path, { ...init, credentials: 'same-origin' });
    return { ok: response.ok, status: response.status, body: (await response.json().catch(() => null)) as Record<string, unknown> | null };
  } catch {
    return { ok: false, status: 0, body: { error: 'network' } };
  }
}

function failure(body: Record<string, unknown> | null): string {
  const code = typeof body?.error === 'string' ? body.error : 'unknown';
  return fill(t.value.errors[code] ?? t.value.errors.unknown!, { code });
}

async function showSignIn() {
  phase.value = 'signedOut';
  await nextTick();
  if (turnstile || !turnstileBox.value) return;
  const options = await call('/api/try/options');
  const siteKey = typeof options.body?.turnstile_site_key === 'string' ? options.body.turnstile_site_key : '';
  if (!siteKey) {
    message.value = failure(options.body);
    return;
  }
  try {
    turnstile = await widget(turnstileBox.value, siteKey, lang.value === 'zh' ? 'zh-cn' : 'en', (answer) => (token.value = answer), () => (token.value = ''));
  } catch {
    message.value = t.value.verifyFailed;
  }
}

async function load() {
  const answer = await call('/api/admin/stats');
  if (answer.status === 401) {
    stats.value = null;
    if (phase.value === 'signedIn') message.value = a.value.signedOut;
    await showSignIn();
    return;
  }
  if (!answer.ok) {
    message.value = failure(answer.body);
    return;
  }
  stats.value = answer.body as unknown as Stats;
  phase.value = 'signedIn';
}

async function signIn() {
  if (!token.value) {
    message.value = a.value.verify;
    return;
  }
  busy.value = true;
  message.value = '';
  const answer = await call('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: password.value, turnstile: token.value }),
  });
  // A Turnstile answer is good for one check.
  token.value = '';
  turnstile?.reset();
  busy.value = false;
  if (answer.ok) {
    password.value = '';
    await load();
    return;
  }
  const code = answer.body?.error;
  if (code === 'locked') message.value = fill(a.value.locked, { m: Math.max(1, Math.ceil(Number(answer.body?.retry_after ?? 900) / 60)) });
  else if (code === 'wrong_password') message.value = a.value.wrong;
  else if (code === 'not_verified') message.value = t.value.verifyFailed;
  else message.value = failure(answer.body);
}

async function signOut() {
  await call('/api/admin/logout', { method: 'POST' });
  stats.value = null;
  message.value = '';
  await showSignIn();
}

onMounted(() => {
  lang.value = langOf(navigator.language);
  void load();
});
onBeforeUnmount(() => turnstile?.remove());

const served = (e: Endpoint | undefined) => Object.entries(e?.status ?? {}).reduce((n, [code, count]) => (code.startsWith('2') ? n + count : n), 0);
const latency = (e: Endpoint | undefined) => (e?.p50_ms == null ? '—' : `${e.p50_ms}·${e.p95_ms ?? '—'}`);
const SERVICE = ['asr', 'refine', 'try_asr', 'try_refine'];

const rows = computed(() =>
  [...(stats.value?.edge?.days ?? [])].reverse().map((d) => {
    const e = d.endpoints;
    return {
      day: d.day,
      users: d.users,
      asr: served(e.asr),
      refine: served(e.refine),
      tryAsr: served(e.try_asr),
      tryRefine: served(e.try_refine),
      updates: e.updates?.requests ?? 0,
      limited: SERVICE.reduce((n, k) => n + (e[k]?.limited ?? 0), 0),
      upstream429: (e.refine?.upstream_429 ?? 0) + (e.try_refine?.upstream_429 ?? 0),
      latency: `${latency(e.asr)} / ${latency(e.refine)}`,
    };
  }),
);
const NUMBERS = ['asr', 'refine', 'tryAsr', 'tryRefine', 'updates', 'limited', 'upstream429'] as const;
const totals = computed(() => Object.fromEntries(NUMBERS.map((k) => [k, rows.value.reduce((n, r) => n + r[k], 0)])) as Record<(typeof NUMBERS)[number], number>);
const generated = computed(() => {
  const at = stats.value?.edge?.generated;
  return at ? fill(a.value.generated, { t: new Date(at).toLocaleString(lang.value === 'zh' ? 'zh-CN' : 'en') }) : '';
});
const tryToday = computed(() => {
  const today = stats.value?.try_today;
  return today ? fill(a.value.tryToday, { asr: today.asr, polish: today.polish, asrDay: today.limits.asrPerDay, polishDay: today.limits.polishPerDay }) : '';
});
</script>

<template>
  <div class="vt-admin">
    <p v-if="phase === 'loading' && !message" class="vt-admin-hint">{{ a.loading }}</p>

    <form v-if="phase === 'signedOut'" class="vt-admin-form" @submit.prevent="signIn">
      <label>
        <span>{{ a.password }}</span>
        <input v-model="password" type="password" autocomplete="current-password" required maxlength="256" />
      </label>
      <div ref="turnstileBox" class="vt-admin-turnstile" />
      <div>
        <button type="submit" class="vt-admin-btn vt-admin-primary" :disabled="busy || !password">{{ a.signIn }}</button>
      </div>
    </form>

    <p v-if="message" class="vt-admin-error" role="alert">{{ message }}</p>

    <template v-if="phase === 'signedIn' && stats">
      <div class="vt-admin-bar">
        <span class="vt-admin-hint">{{ generated }}</span>
        <span class="vt-admin-actions">
          <button type="button" class="vt-admin-btn" @click="load">{{ a.refresh }}</button>
          <button type="button" class="vt-admin-btn" @click="signOut">{{ a.signOut }}</button>
        </span>
      </div>
      <p v-if="stats.edge_error" class="vt-admin-error" role="alert">{{ fill(a.edgeError, { e: stats.edge_error }) }}</p>
      <p>{{ tryToday }}</p>

      <p v-if="!rows.length" class="vt-admin-hint">{{ a.empty }}</p>
      <div v-else class="vt-admin-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">{{ a.day }}</th>
              <th scope="col">{{ a.users }}</th>
              <th scope="col">{{ a.asr }}</th>
              <th scope="col">{{ a.refine }}</th>
              <th scope="col">{{ a.tryAsr }}</th>
              <th scope="col">{{ a.tryRefine }}</th>
              <th scope="col">{{ a.updates }}</th>
              <th scope="col">{{ a.limited }}</th>
              <th scope="col">{{ a.upstream429 }}</th>
              <th scope="col">{{ a.latency }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.day">
              <th scope="row">{{ r.day }}</th>
              <td>{{ r.users }}</td>
              <td>{{ r.asr }}</td>
              <td>{{ r.refine }}</td>
              <td>{{ r.tryAsr }}</td>
              <td>{{ r.tryRefine }}</td>
              <td>{{ r.updates }}</td>
              <td>{{ r.limited }}</td>
              <td>{{ r.upstream429 }}</td>
              <td>{{ r.latency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{{ fill(a.total, { n: rows.length }) }}</th>
              <td>—</td>
              <td>{{ totals.asr }}</td>
              <td>{{ totals.refine }}</td>
              <td>{{ totals.tryAsr }}</td>
              <td>{{ totals.tryRefine }}</td>
              <td>{{ totals.updates }}</td>
              <td>{{ totals.limited }}</td>
              <td>{{ totals.upstream429 }}</td>
              <td>—</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p class="vt-admin-hint">{{ a.note }}</p>
    </template>
  </div>
</template>

<style scoped>
.vt-admin {
  display: grid;
  gap: 16px;
  margin: 24px 0;
}
.vt-admin-form {
  display: grid;
  gap: 14px;
  max-width: 360px;
}
.vt-admin label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.vt-admin input {
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-paper-soft);
  color: var(--vp-c-text-1);
  font: inherit;
}
.vt-admin-turnstile {
  min-height: 65px;
}
.vt-admin-btn {
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-fill);
  color: var(--vp-c-text-1);
  font-weight: 500;
  cursor: pointer;
}
.vt-admin-btn:hover:not(:disabled) {
  background: var(--vt-fill-hover);
}
.vt-admin-primary {
  background: var(--vt-accent);
  color: var(--vt-accent-ink);
}
.vt-admin-primary:hover:not(:disabled) {
  background: var(--vt-accent-hover);
}
.vt-admin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.vt-admin-btn:focus-visible,
.vt-admin input:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 2px;
}
.vt-admin-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.vt-admin-actions {
  display: flex;
  gap: 8px;
}
.vt-admin-scroll {
  overflow-x: auto;
}
.vt-admin table {
  display: table;
  width: 100%;
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.vt-admin td {
  text-align: right;
  white-space: nowrap;
}
.vt-admin th {
  white-space: nowrap;
}
.vt-admin tfoot th,
.vt-admin tfoot td {
  font-weight: 600;
}
.vt-admin p {
  margin: 0;
}
.vt-admin-hint {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.vt-admin-error {
  padding: 10px 12px;
  border-radius: var(--vt-radius-control);
  background: var(--vt-mark-soft);
  color: var(--vp-c-text-1);
}
</style>

<style>
/* The admin page (src/admin.md, pageClass vt-admin-page) gives the table the page's full width. */
.vt-admin-page .VPDoc .container,
.vt-admin-page .VPDoc .content,
.vt-admin-page .VPDoc .content-container {
  max-width: 1200px !important;
}
</style>
