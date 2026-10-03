<script setup lang="ts">
/**
 * Release state, stated as text. The dot's colour reinforces the label and never carries
 * the meaning alone (WCAG 1.4.1). `preview` is a feature that ships switched off and may
 * still change, drawn like pt-tools' `experimental`: an orange ring and orange text.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Status } from '../data/home-schema';

const props = defineProps<{ status: Status }>();
const { lang } = useData();

const LABELS: Record<string, Record<Status, string>> = {
  'zh-CN': { available: '已发布', preview: '预览' },
  'en-US': { available: 'Available', preview: 'Preview' },
};

const label = computed(() => (LABELS[lang.value] ?? LABELS['zh-CN'])[props.status] ?? props.status);
</script>

<template>
  <span class="cg-status" :data-status="status">{{ label }}</span>
</template>

<style scoped>
.cg-status {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  font-family: var(--cg-font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.cg-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.cg-status[data-status='available'] {
  color: var(--cg-live);
}

.cg-status[data-status='preview'] {
  color: var(--cg-accent);
}

/* Shipping but switched off: an orange ring rather than a dot. */
.cg-status[data-status='preview']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--cg-mark);
}
</style>
