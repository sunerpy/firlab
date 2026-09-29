<script setup lang="ts">
/** Two short facts between the tagline and the buttons: where Voltip runs, and where the data goes. */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const facts = computed(() => (frontmatter.value.home as Home | undefined)?.facts ?? []);
</script>

<template>
  <dl v-if="facts.length" class="vt-facts">
    <div v-for="fact in facts" :key="fact.term" class="vt-fact">
      <dt>{{ fact.term }}</dt>
      <dd>{{ fact.text }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.vt-facts {
  display: grid;
  gap: 10px;
  margin: 24px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--vt-rule);
  max-width: 560px;
}

.vt-fact {
  display: grid;
  grid-template-columns: minmax(0, 7.5em) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
}

.vt-fact dt {
  color: var(--vt-ink-400);
  font-family: var(--vt-font-mono);
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.vt-fact dd {
  margin: 0;
  color: var(--vt-ink-700);
  font-size: 15px;
  line-height: 1.55;
}

@media (max-width: 959px) {
  .vt-facts {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
}

@media (max-width: 479px) {
  .vt-fact {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
}
</style>
