<script setup lang="ts">
/**
 * Release state, stated as text. The dot's colour reinforces the label and never carries
 * the meaning alone (WCAG 1.4.1). `opt-in` is a feature that ships switched off until the
 * reader turns it on, in the configuration or at build time: ink text behind a slate ring, so a
 * switched-off feature carries no hue.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Status } from '../data/home-schema';

const props = defineProps<{ status: Status }>();
const { lang } = useData();

const LABELS: Record<string, Record<Status, string>> = {
  'zh-CN': { available: '已发布', 'opt-in': '需开启' },
  'en-US': { available: 'Available', 'opt-in': 'Opt-in' },
};

const label = computed(() => (LABELS[lang.value] ?? LABELS['en-US'])[props.status] ?? props.status);
</script>

<template>
  <span class="bg-status" :data-status="status">{{ label }}</span>
</template>

<style scoped>
.bg-status {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  font-family: var(--bg-font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.bg-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.bg-status[data-status='available'] {
  color: var(--bg-live);
}

.bg-status[data-status='opt-in'] {
  color: var(--bg-accent);
}

/* Shipping but switched off until configured: a slate ring rather than a dot. */
.bg-status[data-status='opt-in']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--bg-slate);
}
</style>
