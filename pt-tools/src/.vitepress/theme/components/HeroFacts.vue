<script setup lang="ts">
/**
 * Short facts: where pt-tools runs, where the data goes, which version the site describes. The
 * 2026-09 layout puts them between the tagline and the buttons (`place="info"`); the 2026-11 one
 * under the buttons (`place="actions"`), one under another (styles/bands.css).
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { isV2, type Fact } from '../data/home-schema';

const props = defineProps<{ place: 'info' | 'actions' }>();
const { frontmatter } = useData();
const facts = computed<Fact[]>(() => {
  const home = frontmatter.value.home as { facts?: Fact[] } | undefined;
  const wanted = isV2(home) ? 'actions' : 'info';
  return props.place === wanted ? (home?.facts ?? []) : [];
});
</script>

<template>
  <dl v-if="facts.length" class="pt-facts" :class="`pt-facts-${place}`">
    <div v-for="fact in facts" :key="fact.term" class="pt-fact">
      <dt>{{ fact.term }}</dt>
      <dd>{{ fact.text }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.pt-facts {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--pt-rule);
  max-width: 560px;
}

.pt-fact {
  display: grid;
  grid-template-columns: minmax(0, 7.5em) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
}

.pt-fact dt {
  color: var(--pt-ink-400);
  font-family: var(--pt-font-mono);
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.pt-fact dd {
  margin: 0;
  color: var(--pt-ink-700);
  font-size: 15px;
  line-height: 1.55;
}

@media (max-width: 959px) {
  .pt-facts {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
}

@media (max-width: 479px) {
  .pt-fact {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
