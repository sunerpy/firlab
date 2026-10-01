<script setup lang="ts">
/**
 * Maturity, stated as text. The dot's colour reinforces the label and never carries
 * the meaning alone (WCAG 1.4.1). The same three states as firlab.app's StatusTag.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Status } from '../data/home-schema';

const props = defineProps<{ status: Status }>();
const { lang } = useData();

const LABELS: Record<string, Record<Status, string>> = {
  'zh-CN': { available: '已发布', building: '开发中', planned: '计划中' },
  'en-US': { available: 'Available', building: 'In development', planned: 'Planned' },
};

const label = computed(() => (LABELS[lang.value] ?? LABELS['en-US'])[props.status] ?? props.status);
</script>

<template>
  <span class="lk-status" :data-status="status">{{ label }}</span>
</template>

<style scoped>
.lk-status {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  font-family: var(--lk-font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.lk-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.lk-status[data-status='available'] {
  color: var(--lk-live);
}

.lk-status[data-status='building'] {
  color: var(--lk-accent);
}

.lk-status[data-status='building']::before {
  background: var(--lk-mark);
}

.lk-status[data-status='planned'] {
  color: var(--lk-ink-400);
}

.lk-status[data-status='planned']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--lk-slate);
}
</style>
