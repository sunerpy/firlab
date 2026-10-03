<script setup lang="ts">
/** Two short facts between the tagline and the buttons: where CodeGraph runs, and where your code stays. */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const facts = computed(() => (frontmatter.value.home as Home | undefined)?.facts ?? []);
</script>

<template>
  <dl v-if="facts.length" class="cg-facts">
    <div v-for="fact in facts" :key="fact.term" class="cg-fact">
      <dt>{{ fact.term }}</dt>
      <dd>{{ fact.text }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.cg-facts {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--cg-rule);
  max-width: 560px;
}

.cg-fact {
  display: grid;
  grid-template-columns: minmax(0, 7.5em) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
}

.cg-fact dt {
  color: var(--cg-ink-400);
  font-family: var(--cg-font-mono);
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.cg-fact dd {
  margin: 0;
  color: var(--cg-ink-700);
  font-size: 15px;
  line-height: 1.55;
}

@media (max-width: 959px) {
  .cg-facts {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
}

@media (max-width: 479px) {
  .cg-fact {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
