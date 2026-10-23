<script setup lang="ts">
/** The short lines under the hero's buttons (`home.checks`): where Voltip runs, where the audio
 *  goes, the licence, one fact per line. The 2026-10 layout only; the earlier one has HeroFacts
 *  above the buttons. */
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <ul v-if="home" class="vt-meta">
    <li v-for="check in home.checks" :key="check">{{ check }}</li>
  </ul>
</template>

<style scoped>
.vt-meta {
  display: grid;
  gap: 4px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.6;
}

.vt-meta li {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  align-items: baseline;
}

.vt-meta li::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vt-ink-400);
  transform: translateY(-2px);
}
</style>
