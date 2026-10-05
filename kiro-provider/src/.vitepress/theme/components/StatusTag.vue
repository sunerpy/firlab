<script setup lang="ts">
/**
 * Release state, stated as text. The dot's colour reinforces the label and never carries
 * the meaning alone (WCAG 1.4.1). `opt-in` is a feature that ships switched off until the
 * configuration turns it on: ink text behind a slate ring, so a switched-off feature carries
 * no hue.
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
  <span class="kp-status" :data-status="status">{{ label }}</span>
</template>

<style scoped>
.kp-status {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  font-family: var(--kp-font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.kp-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.kp-status[data-status='available'] {
  color: var(--kp-live);
}

.kp-status[data-status='opt-in'] {
  color: var(--kp-accent);
}

/* Shipping but switched off until configured: a slate ring rather than a dot. */
.kp-status[data-status='opt-in']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--kp-slate);
}
</style>
