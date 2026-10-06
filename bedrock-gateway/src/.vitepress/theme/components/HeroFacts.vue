<script setup lang="ts">
/** Short facts between the tagline and the buttons: where bedrock-gateway runs and whose AWS account it calls. */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const facts = computed(() => (frontmatter.value.home as Home | undefined)?.facts ?? []);
</script>

<template>
  <dl v-if="facts.length" class="bg-facts">
    <div v-for="fact in facts" :key="fact.term" class="bg-fact">
      <dt>{{ fact.term }}</dt>
      <dd>{{ fact.text }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.bg-facts {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--bg-rule);
  max-width: 560px;
}

.bg-fact {
  display: grid;
  grid-template-columns: minmax(0, 7.5em) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
}

.bg-fact dt {
  color: var(--bg-ink-400);
  font-family: var(--bg-font-mono);
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.bg-fact dd {
  margin: 0;
  color: var(--bg-ink-700);
  font-size: 15px;
  line-height: 1.55;
}

@media (max-width: 959px) {
  .bg-facts {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
}

@media (max-width: 479px) {
  .bg-fact {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
