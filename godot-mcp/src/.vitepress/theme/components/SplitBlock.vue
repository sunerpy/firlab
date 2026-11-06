<script setup lang="ts">
/**
 * Text on one side, proof on the other. The prose is the page's own Markdown (the default slot);
 * the proof is one of the evidence tables in the home frontmatter, named by `proof`.
 *
 * In the 2026-11 layout the block is a band of its own: the Markdown takes the place of a band's
 * head on the left, and the table, given `.vp-doc` back so it keeps the table styles of
 * styles/home.css, sits on the right from 960 px. In the 2026-09 layout `flip` swaps the sides so
 * consecutive blocks alternate.
 */
import type { ProofName } from '../data/home-schema';
import ProofTable from './ProofTable.vue';
import { useHomeV2 } from './useHome';

defineProps<{ proof: ProofName; flip?: boolean }>();
const v2 = useHomeV2();
</script>

<template>
  <section v-if="v2" class="gm-v2-band">
    <div class="gm-wrap gm-split-v2">
      <div class="gm-sec-head gm-split-words">
        <slot />
      </div>
      <div class="gm-split-proof vp-doc">
        <ProofTable :name="proof" />
      </div>
    </div>
  </section>

  <section v-else class="gm-band gm-split" :class="{ 'gm-split-flip': flip }">
    <div class="gm-split-text">
      <slot />
    </div>
    <div class="gm-split-proof">
      <ProofTable :name="proof" />
    </div>
  </section>
</template>
