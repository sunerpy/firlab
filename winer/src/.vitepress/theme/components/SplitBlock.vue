<script setup lang="ts">
/**
 * Text on one side, a capture on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the capture is one of
 * `home.shots`, named by `shot`.
 */
import { computed } from 'vue';
import ScreenFigure from './ScreenFigure.vue';
import { useHome } from './useHome';

const props = defineProps<{ shot: string; flip?: boolean }>();
const home = useHome();
const capture = computed(() => home.value.shots?.[props.shot]);
</script>

<template>
  <section class="wn-band wn-split" :class="{ 'wn-split-flip': flip }">
    <div class="wn-split-text">
      <slot />
    </div>
    <div class="wn-split-proof">
      <ScreenFigure
        v-if="capture"
        :src="capture.light"
        :dark="capture.dark"
        :width="capture.width"
        :height="capture.height"
        :alt="capture.alt"
      />
    </div>
  </section>
</template>
