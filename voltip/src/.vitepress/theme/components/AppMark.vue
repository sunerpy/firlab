<script setup lang="ts">
/**
 * An application's mark (Simple Icons, CC0; Kiro from Lobe Icons, MIT) in its brand colour; the
 * black marks take the text colour (data/marks.ts). Decorative: the name is always beside it.
 */
import type { AppMarkName } from '../data/home-schema';
import { APP_MARK_DATA } from '../data/marks';

defineProps<{ name: AppMarkName; size?: number }>();
</script>

<template>
  <svg
    class="vt-mark"
    :width="size ?? 16"
    :height="size ?? 16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-for="(path, i) in APP_MARK_DATA[name].paths"
      :key="i"
      :d="path.d"
      :fill="path.fill"
      :fill-rule="path.evenOdd ? 'evenodd' : undefined"
      :clip-rule="path.evenOdd ? 'evenodd' : undefined"
    />
  </svg>
</template>

<style scoped>
.vt-mark {
  flex: none;
}
</style>
