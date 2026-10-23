<script setup lang="ts">
/**
 * One sentence, several presets (`home.presets`): the spoken words on the left and a line from
 * them into what each preset makes of them, then the built-in scenes that pick a preset by app.
 */
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-presets-title">
    <div class="vt-wrap">
      <div class="vt-head-split">
        <div class="vt-sec-head">
          <h2 id="vt-presets-title" v-html="inline(home.presets.title)" />
        </div>
        <div class="vt-sec-head">
          <p>{{ home.presets.intro }}</p>
          <ul v-if="home.presets.points" class="vt-list">
            <li v-for="point in home.presets.points" :key="point">
              <VtIcon name="check" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="vt-tree">
        <div class="vt-said">
          <span class="vt-tag"><VtIcon name="mic" :size="14" />{{ home.presets.saidLabel }}</span>
          <p>{{ home.presets.said }}</p>
        </div>
        <div class="vt-branch" aria-hidden="true" />
        <ul class="vt-outs">
          <li v-for="output in home.presets.outputs" :key="output.name" class="vt-card vt-out">
            <div class="vt-out-name">
              <b>{{ output.name }}</b>
              <span>{{ output.desc }}</span>
            </div>
            <p class="vt-out-text">{{ output.text }}</p>
          </li>
        </ul>
      </div>
      <p v-if="home.presets.note" class="vt-proof">{{ home.presets.note }}</p>
      <div v-if="home.presets.scenes" class="vt-card vt-scenes">
        <div class="vt-scenes-head">
          <h3>{{ home.presets.scenes.title }}</h3>
          <p v-if="home.presets.scenes.note">{{ home.presets.scenes.note }}</p>
        </div>
        <ul class="vt-scene-grid">
          <li v-for="scene in home.presets.scenes.items" :key="scene.name" class="vt-scene-item">
            <b>{{ scene.name }}</b>
            <p>{{ scene.body }}</p>
            <span class="vt-badge">{{ scene.preset }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
