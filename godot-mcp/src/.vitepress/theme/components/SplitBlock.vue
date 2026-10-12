<script setup lang="ts">
/**
 * Text on one side, proof on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the proof is one of the
 * evidence tables in the home frontmatter, named by `proof`.
 */
import type { ProofName } from '../data/home-schema';
import ProofTable from './ProofTable.vue';

defineProps<{ proof: ProofName; flip?: boolean }>();
</script>

<template>
  <section class="gm-band gm-split" :class="{ 'gm-split-flip': flip }">
    <div class="gm-split-text">
      <slot />
    </div>
    <div class="gm-split-proof">
      <ProofTable :name="proof" />
    </div>
  </section>
</template>
