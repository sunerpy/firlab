<script setup lang="ts">
/**
 * What a capability needs, stated as text. The dot's colour reinforces the label and never
 * carries the meaning alone (WCAG 1.4.1). `no-engine` answers from the project's files on a
 * machine without Godot: teal text behind a teal dot. `engine` needs a Godot executable: ink
 * text behind a slate ring, so a requirement carries no hue.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Status } from '../data/home-schema';

const props = defineProps<{ status: Status }>();
const { lang } = useData();

const LABELS: Record<string, Record<Status, string>> = {
  'zh-CN': { 'no-engine': '无需引擎', engine: '需要 Godot' },
  'en-US': { 'no-engine': 'No engine', engine: 'Needs Godot' },
};

const label = computed(() => (LABELS[lang.value] ?? LABELS['en-US'])[props.status] ?? props.status);
</script>

<template>
  <span class="gm-status" :data-status="status">{{ label }}</span>
</template>

<style scoped>
.gm-status {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  font-family: var(--gm-font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.gm-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.gm-status[data-status='no-engine'] {
  color: var(--gm-live);
}

.gm-status[data-status='engine'] {
  color: var(--gm-accent);
}

/* A requirement, not a state: a slate ring rather than a dot. */
.gm-status[data-status='engine']::before {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--gm-slate);
}
</style>
