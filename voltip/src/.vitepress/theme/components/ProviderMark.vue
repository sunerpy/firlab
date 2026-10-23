<script setup lang="ts">
/**
 * A vendor's mark (Lobe Icons, MIT, the marks the app's provider cards use) in its own colours;
 * the black marks take the text colour, so they follow the theme (data/marks.ts). Decorative: the
 * vendor's name is always beside it.
 */
import type { MarkName } from '../data/home-schema';
import { PROVIDER_MARKS } from '../data/marks';

defineProps<{ name: MarkName; size?: number }>();
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
      v-for="(path, i) in PROVIDER_MARKS[name].paths"
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
