<script setup lang="ts">
/**
 * Text on one side, proof on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the proof is drawn
 * from the home frontmatter.
 */
import PointList from './PointList.vue';
import TransferTable from './TransferTable.vue';

defineProps<{ proof: 'transfer' | 'backup' | 'security'; flip?: boolean }>();
</script>

<template>
  <section class="lk-band lk-split" :class="{ 'lk-split-flip': flip }">
    <div class="lk-split-text">
      <slot />
    </div>
    <div class="lk-split-proof">
      <TransferTable v-if="proof === 'transfer'" />
      <PointList v-else :of="proof" />
    </div>
  </section>
</template>
