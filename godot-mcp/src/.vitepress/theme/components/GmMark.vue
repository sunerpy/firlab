<script setup lang="ts">
/**
 * An MCP client's mark (data/marks.ts: Simple Icons, CC0; Lobe Icons, MIT) in the text colour, so
 * it follows the theme. Decorative: the client's name is always beside it.
 */
import { MARKS, type MarkName } from '../data/marks';

defineProps<{ name: MarkName; size?: number }>();
</script>

<template>
  <svg
    class="gm-mark"
    :width="size ?? 22"
    :height="size ?? 22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-for="(path, i) in MARKS[name].paths"
      :key="i"
      :d="path.d"
      :fill-rule="path.evenOdd ? 'evenodd' : undefined"
      :clip-rule="path.evenOdd ? 'evenodd' : undefined"
    />
  </svg>
</template>

<style scoped>
.gm-mark {
  flex: none;
}
</style>
