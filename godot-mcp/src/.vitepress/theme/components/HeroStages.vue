<script setup lang="ts">
/**
 * The hero's lower half in the 2026-11 layout (`home.stages`): one real exchange with the demo
 * game. On the left, the calls an agent sent the running game, each followed by fields of what
 * godot-mcp answered, every value copied unchanged (godot-mcp's docs/site/README.md); on the
 * right, the screenshot the last answer carried. From 960 px the two stages sit side by side
 * under the hero's words, an arrow between them; below that they stack. Nothing moves.
 */
import GmIcon from './GmIcon.vue';
import GmImg from './GmImg.vue';
import Transcript from './Transcript.vue';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <figure v-if="home" class="gm-stages">
    <div class="gm-stages-plate">
      <div class="gm-stage">
        <p class="gm-stage-step"><span class="gm-stage-num" aria-hidden="true">1</span>{{ home.stages.steps[0] }}</p>
        <Transcript class="gm-stage-exchange" :exchange="home.stages.exchange" />
      </div>
      <span class="gm-stages-to" aria-hidden="true"><GmIcon name="arrow-right" :size="18" /></span>
      <div class="gm-stage">
        <p class="gm-stage-step"><span class="gm-stage-num" aria-hidden="true">2</span>{{ home.stages.steps[1] }}</p>
        <div class="gm-shot-frame">
          <GmImg :screen="home.stages.screen" loading="eager" />
        </div>
      </div>
    </div>
    <figcaption class="gm-stages-caption">{{ home.stages.caption }}</figcaption>
  </figure>
</template>
