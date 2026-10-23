<script setup lang="ts">
/**
 * The feedback the app sends (voltip docs/feedback.md), on the admin page: the open reports first,
 * each with its message, contact, attachments and diagnostics, and the 已处理 mark. AdminStats
 * shows it once the session is signed in; functions/_lib/feedback.ts reads the reports from the
 * feedback Worker. A mark changes the report in place, so a slip can be taken back; the list
 * catches up on the next refresh.
 */
import { computed, ref, watch } from 'vue';

import { fill, type Lang, strings } from './try/strings';

interface Attachment {
  index: number;
  name: string;
  type: string;
  size: number;
  sha256: string;
  complete: boolean;
}
interface Report {
  id: string;
  created_at: number;
  kind: 'bug' | 'idea' | 'other';
  message: string;
  contact: string | null;
  diagnostics: Record<string, string>;
  country: string | null;
  handled_at: number | null;
  attachments: Attachment[];
}
type State = 'open' | 'handled' | 'all';

const props = defineProps<{ lang: Lang; reload: number }>();
const emit = defineEmits<{ signedOut: [] }>();

const t = computed(() => strings(props.lang));
const f = computed(() => t.value.feedback);
const STATES: State[] = ['open', 'handled', 'all'];
const PAGE = 30;

const state = ref<State>('open');
const items = ref<Report[]>([]);
const open = ref<number | null>(null);
const more = ref(false);
const loading = ref(false);
const marking = ref<string | null>(null);
const message = ref('');

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

/** The first page of the chosen state, or the next one after what is shown. */
async function fetchPage(append: boolean) {
  loading.value = true;
  message.value = '';
  const query = new URLSearchParams({ state: state.value, limit: String(PAGE) });
  const last = items.value.at(-1);
  if (append && last) query.set('before', String(last.created_at));
  const answer = await call(`/api/admin/feedback?${query.toString()}`);
  loading.value = false;
  if (answer.status === 401) {
    emit('signedOut');
    return;
  }
  if (!answer.ok) {
    message.value = failure(answer.body);
    return;
  }
  const body = answer.body as unknown as { items: Report[]; open: number };
  items.value = append ? [...items.value, ...body.items] : body.items;
  open.value = body.open;
  more.value = body.items.length === PAGE;
}

watch(
  () => [props.reload, state.value],
  () => void fetchPage(false),
  { immediate: true },
);

async function mark(report: Report, handled: boolean) {
  marking.value = report.id;
  message.value = '';
  const answer = await call('/api/admin/feedback/handled', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: report.id, handled }),
  });
  marking.value = null;
  if (answer.status === 401) {
    emit('signedOut');
    return;
  }
  if (!answer.ok) {
    message.value = failure(answer.body);
    return;
  }
  const at = typeof answer.body?.handled_at === 'number' ? answer.body.handled_at : null;
  if (open.value !== null && (report.handled_at === null) !== (at === null)) open.value += at === null ? 1 : -1;
  items.value = items.value.map((r) => (r.id === report.id ? { ...r, handled_at: at } : r));
}

const timeOf = (at: number) => new Date(at).toLocaleString(props.lang === 'zh' ? 'zh-CN' : 'en');
const sizeOf = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MiB` : `${Math.max(1, Math.round(bytes / 1024))} KiB`);
/** Version, platform, language and country in one line. */
function about(r: Report): string {
  const d = r.diagnostics;
  return [d.app_version, [d.os, d.arch].filter(Boolean).join(' '), d.locale, r.country].filter(Boolean).join(' · ');
}
</script>

<template>
  <section class="vt-fb" :aria-busy="loading">
    <div class="vt-admin-bar">
      <h2 class="vt-admin-section vt-fb-title">
        {{ f.title }}<span v-if="open !== null" class="vt-fb-count">{{ fill(f.openCount, { n: open }) }}</span>
      </h2>
      <div class="vt-fb-states" role="group" :aria-label="f.title">
        <button v-for="s in STATES" :key="s" type="button" class="vt-admin-btn" :aria-pressed="state === s" @click="state = s">
          {{ f.states[s] }}
        </button>
      </div>
    </div>

    <p v-if="message" class="vt-admin-error" role="alert">{{ message }}</p>
    <p v-else-if="loading && !items.length" class="vt-admin-hint">{{ f.loading }}</p>
    <p v-else-if="!items.length" class="vt-admin-hint">{{ f.empty[state] }}</p>

    <ol v-if="items.length" class="vt-fb-list">
      <li v-for="r in items" :id="`fb-${r.id}`" :key="r.id" class="vt-fb-item" :class="{ 'is-handled': r.handled_at !== null }">
        <div class="vt-fb-head">
          <span class="vt-fb-kind" :data-kind="r.kind">{{ f.kinds[r.kind] }}</span>
          <time :datetime="new Date(r.created_at).toISOString()">{{ timeOf(r.created_at) }}</time>
          <span class="vt-admin-hint">{{ about(r) }}</span>
        </div>
        <p class="vt-fb-message">{{ r.message }}</p>
        <p class="vt-fb-contact">
          <template v-if="r.contact">{{ f.contact }}<span class="vt-fb-mono">{{ r.contact }}</span></template>
          <span v-else class="vt-admin-hint">{{ f.noContact }}</span>
        </p>
        <ul v-if="r.attachments.length" class="vt-fb-files">
          <li v-for="a in r.attachments" :key="a.index">
            <a v-if="a.complete" :href="`/api/admin/feedback/${r.id}/attachments/${a.index}`" download>{{ a.name }}</a>
            <span v-else>{{ a.name }}</span>
            <span class="vt-admin-hint">{{ sizeOf(a.size) }}<template v-if="!a.complete"> · {{ f.incomplete }}</template></span>
          </li>
        </ul>
        <details class="vt-fb-details">
          <summary>{{ f.details }}</summary>
          <dl>
            <template v-for="(value, key) in r.diagnostics" :key="key">
              <dt>{{ key }}</dt>
              <dd class="vt-fb-mono">{{ value }}</dd>
            </template>
            <dt>{{ f.id }}</dt>
            <dd class="vt-fb-mono">{{ r.id }}</dd>
          </dl>
        </details>
        <div class="vt-fb-actions">
          <span v-if="r.handled_at !== null" class="vt-admin-hint">{{ fill(f.handledAt, { t: timeOf(r.handled_at) }) }}</span>
          <button
            type="button"
            class="vt-admin-btn"
            :class="{ 'vt-admin-primary': r.handled_at === null }"
            :disabled="marking === r.id"
            @click="mark(r, r.handled_at === null)"
          >
            {{ r.handled_at === null ? f.mark : f.unmark }}
          </button>
        </div>
      </li>
    </ol>

    <div v-if="more">
      <button type="button" class="vt-admin-btn" :disabled="loading" @click="fetchPage(true)">{{ f.more }}</button>
    </div>
  </section>
</template>

<style scoped>
/* The page keeps list items and paragraphs to a 72ch measure (styles/base.css); the section takes
   the same width, so its bar lines up with the reports under it. */
.vt-fb {
  display: grid;
  gap: 14px;
  max-width: 72ch;
}
.vt-fb-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
}
.vt-fb-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.vt-fb-states {
  display: flex;
  gap: 6px;
}
.vt-fb-states .vt-admin-btn[aria-pressed='true'] {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
}
.vt-fb-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.vt-fb-item {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 14px 16px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-paper-soft);
}
.vt-fb-item.is-handled {
  background: transparent;
}
.vt-fb-item.is-handled .vt-fb-message {
  color: var(--vp-c-text-2);
}
.vt-fb-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  font-size: 14px;
}
.vt-fb-kind {
  padding: 1px 10px;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-fill);
  font-size: 13px;
  font-weight: 600;
}
.vt-fb-kind[data-kind='bug'] {
  background: var(--vt-mark-soft);
}
.vt-fb-message {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: var(--vt-lh-prose);
}
.vt-fb-contact {
  font-size: 14px;
  overflow-wrap: anywhere;
}
.vt-fb-mono {
  font-family: var(--vt-font-mono);
  font-size: 13px;
}
.vt-fb-files {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}
.vt-fb-files li {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin: 0;
  overflow-wrap: anywhere;
}
.vt-fb-details summary {
  width: fit-content;
  font-size: 13px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.vt-fb-details dl {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 2px 14px;
  margin: 8px 0 0;
  font-size: 13px;
}
.vt-fb-details dt {
  color: var(--vp-c-text-2);
}
.vt-fb-details dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.vt-fb-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 8px 12px;
}
</style>
