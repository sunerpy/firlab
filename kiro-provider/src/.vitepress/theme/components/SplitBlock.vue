<script setup lang="ts">
/**
 * Text on one side, proof on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the proof is one of the
 * evidence tables in the home frontmatter, named by `proof`.
 */
import ProofTable from './ProofTable.vue';

defineProps<{ proof: 'protocols' | 'clients' | 'search'; flip?: boolean }>();
</script>

<template>
  <section class="kp-band kp-split" :class="{ 'kp-split-flip': flip }">
    <div class="kp-split-text">
      <slot />
    </div>
    <div class="kp-split-proof">
      <ProofTable :name="proof" />
    </div>
  </section>
</template>
