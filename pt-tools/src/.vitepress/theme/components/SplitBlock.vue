<script setup lang="ts">
/**
 * Text on one side, proof on the other; `flip` swaps the sides so consecutive blocks
 * alternate. The prose is the page's own Markdown (the default slot); the proof is drawn
 * from the home frontmatter: the filter-rule examples, the chat commands, or one of
 * `home.shots` named by `shot`.
 */
import { computed } from 'vue';
import CommandList from './CommandList.vue';
import RuleExamples from './RuleExamples.vue';
import ScreenFigure from './ScreenFigure.vue';
import { useHome } from './useHome';

const props = defineProps<{ proof: 'rules' | 'commands' | 'screen'; shot?: string; flip?: boolean }>();
const home = useHome();
const capture = computed(() => (props.proof === 'screen' && props.shot ? home.value.shots?.[props.shot] : undefined));
</script>

<template>
  <section class="pt-band pt-split" :class="{ 'pt-split-flip': flip }">
    <div class="pt-split-text">
      <slot />
    </div>
    <div class="pt-split-proof">
      <RuleExamples v-if="proof === 'rules'" />
      <CommandList v-else-if="proof === 'commands'" />
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
