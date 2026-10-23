<script setup lang="ts">
/** The short lines under the hero's buttons (`home.checks`): where Voltip runs, where the audio
 *  goes, the licence. The 2026-10 layout only; the earlier one has HeroFacts above the buttons. */
import VtIcon from './VtIcon.vue';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <ul v-if="home" class="vt-checks">
    <li v-for="check in home.checks" :key="check">
      <VtIcon name="check" :size="16" />
      <span>{{ check }}</span>
    </li>
  </ul>
</template>

<style scoped>
.vt-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.6;
}

.vt-checks li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.vt-checks :deep(.vt-icon) {
  color: var(--vt-live-mark);
  stroke-width: 2.2;
}
</style>
