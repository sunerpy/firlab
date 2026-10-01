<script setup lang="ts">
/**
 * Maturity, stated as text. The dot's colour reinforces the label and never carries
 * the meaning alone (WCAG 1.4.1). firlab.app's three states, plus `experimental` for a
 * feature that ships without end-to-end verification.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Status } from '../data/home-schema';

const props = defineProps<{ status: Status }>();
const { lang } = useData();

const LABELS: Record<string, Record<Status, string>> = {
  'zh-CN': { available: '已发布', experimental: '实验性', building: '开发中', planned: '计划中' },
  'en-US': { available: 'Available', experimental: 'Experimental', building: 'In development', planned: 'Planned' },
};

const label = computed(() => (LABELS[lang.value] ?? LABELS['zh-CN'])[props.status] ?? props.status);
</script>

<template>
  <span class="pt-status" :data-status="status">{{ label }}</span>
</template>

<style scoped>
.pt-status {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  font-family: var(--pt-font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.pt-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.pt-status[data-status='available'] {
  color: var(--pt-live);
}

.pt-status[data-status='building'],
.pt-status[data-status='experimental'] {
  color: var(--pt-accent);
}

.pt-status[data-status='building']::before {
  background: var(--pt-mark);
}

/* Shipping, not yet verified: the orange of "in development", as a ring rather than a dot. */
.pt-status[data-status='experimental']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--pt-mark);
}

.pt-status[data-status='planned'] {
  color: var(--pt-ink-400);
}

.pt-status[data-status='planned']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--pt-slate);
}
</style>
