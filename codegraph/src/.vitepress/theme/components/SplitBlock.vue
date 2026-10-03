<script setup lang="ts">
/**
 * Text on one side, proof on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the proof is drawn
 * from the home frontmatter: the question-to-tool table, the language table, or one of
 * `home.shots` named by `shot`.
 */
import { computed } from 'vue';
import LanguageTable from './LanguageTable.vue';
import ScreenFigure from './ScreenFigure.vue';
import ToolTable from './ToolTable.vue';
import { useHome } from './useHome';

const props = defineProps<{ proof: 'tools' | 'languages' | 'screen'; shot?: string; flip?: boolean }>();
const home = useHome();
const capture = computed(() => (props.proof === 'screen' && props.shot ? home.value.shots?.[props.shot] : undefined));
</script>

<template>
  <section class="cg-band cg-split" :class="{ 'cg-split-flip': flip }">
    <div class="cg-split-text">
      <slot />
    </div>
    <div class="cg-split-proof">
      <ToolTable v-if="proof === 'tools'" />
      <LanguageTable v-else-if="proof === 'languages'" />
      <ScreenFigure
        v-else-if="capture"
        :src="capture.light"
        :dark="capture.dark"
        :width="capture.width"
        :height="capture.height"
        :alt="capture.alt"
      />
    </div>
  </section>
</template>
