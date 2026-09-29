<script setup lang="ts">
/**
 * Text on one side, proof on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the proof is
 * drawn from the home frontmatter.
 */
import HomeModels from './HomeModels.vue';
import PhoneMethods from './PhoneMethods.vue';
import PolishExample from './PolishExample.vue';

defineProps<{ proof: 'models' | 'polish' | 'phone'; flip?: boolean }>();
</script>

<template>
  <section class="vt-band vt-split" :class="{ 'vt-split-flip': flip }">
    <div class="vt-split-text">
      <slot />
    </div>
    <div class="vt-split-proof">
      <HomeModels v-if="proof === 'models'" />
      <PolishExample v-else-if="proof === 'polish'" />
      <PhoneMethods v-else-if="proof === 'phone'" />
    </div>
  </section>
</template>
