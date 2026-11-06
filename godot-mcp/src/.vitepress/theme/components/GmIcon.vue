<script setup lang="ts">
/**
 * One of the home page's line icons (data/icons.ts, Lucide 1.70.0), in the text colour with a
 * 1.8 px stroke on Lucide's 24 px grid. Decorative: the words beside each icon carry the meaning,
 * so every icon is hidden from assistive technology.
 */
import { ICONS, type IconName } from '../data/icons';

defineProps<{ name: IconName; size?: number }>();
</script>

<template>
  <svg
    class="gm-icon"
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <component :is="tag" v-for="([tag, attrs], i) in ICONS[name]" :key="i" v-bind="attrs" />
  </svg>
</template>

<style scoped>
.gm-icon {
  flex: none;
}
</style>
