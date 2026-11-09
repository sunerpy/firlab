<script setup lang="ts">
/**
 * The hero's lower half in the 2026-11 layout (`home.stages`): one thing pt-tools does on its own,
 * as two real screenshots. On the left, a show being followed (its subscription on the title's
 * page); on the right, the organize history with that show's new episode put into the library.
 * From 960 px the two stages sit side by side under the hero's words, an arrow between them;
 * below that they stack. Nothing moves.
 */
import PtIcon from './PtIcon.vue';
import PtImg from './PtImg.vue';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <figure v-if="home" class="pt-stages">
    <div class="pt-stages-plate">
      <div class="pt-stage">
        <p class="pt-stage-step"><span class="pt-stage-num" aria-hidden="true">1</span>{{ home.stages.steps[0] }}</p>
        <div class="pt-shot-frame">
          <PtImg :screen="home.stages.screens[0]" loading="eager" />
        </div>
      </div>
      <span class="pt-stages-to" aria-hidden="true"><PtIcon name="arrow-right" :size="18" /></span>
      <div class="pt-stage">
        <p class="pt-stage-step"><span class="pt-stage-num" aria-hidden="true">2</span>{{ home.stages.steps[1] }}</p>
        <div class="pt-shot-frame">
          <PtImg :screen="home.stages.screens[1]" loading="eager" />
        </div>
      </div>
    </div>
    <figcaption class="pt-stages-caption">{{ home.stages.caption }}</figcaption>
  </figure>
</template>
