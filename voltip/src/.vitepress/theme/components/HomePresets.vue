<script setup lang="ts">
/**
 * One sentence, several presets (`home.presets`): the spoken words across the top of one board
 * and what each preset makes of them in its cells, then the built-in scenes as cards: the
 * applications as their marks with their names under them, the ones without a mark in words, the
 * preset and the scene's extra instruction. A page written before the cards (name, words, preset)
 * renders as rows.
 */
import BrandTile from './BrandTile.vue';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-presets-title">
    <div class="vt-wrap">
      <header class="vt-sec-head">
        <h2 id="vt-presets-title" v-html="inline(home.presets.title)" />
        <p>{{ home.presets.intro }}</p>
        <ul v-if="home.presets.points" class="vt-list">
          <li v-for="point in home.presets.points" :key="point">
            <span class="vt-list-dot" aria-hidden="true" />
            <span>{{ point }}</span>
          </li>
        </ul>
      </header>
      <div class="vt-board">
        <div class="vt-board-said">
          <span class="vt-tag"><VtIcon name="mic" :size="14" />{{ home.presets.saidLabel }}</span>
          <p>{{ home.presets.said }}</p>
        </div>
        <ul class="vt-board-grid">
          <li v-for="output in home.presets.outputs" :key="output.name" class="vt-board-cell">
            <p class="vt-board-name">
              <b>{{ output.name }}</b>
              <span>{{ output.desc }}</span>
            </p>
            <p class="vt-board-text">
              <span v-for="(line, j) in output.text.split('\n')" :key="j" class="vt-line">{{ line }}</span>
            </p>
          </li>
        </ul>
      </div>
      <p v-if="home.presets.note" class="vt-footnote">{{ home.presets.note }}</p>
      <div v-if="home.presets.scenes" class="vt-scenes">
        <div class="vt-scenes-head">
          <h3>{{ home.presets.scenes.title }}</h3>
          <p v-if="home.presets.scenes.note">{{ home.presets.scenes.note }}</p>
        </div>
        <ul v-if="home.presets.scenes.items.some((scene) => scene.apps)" class="vt-scene-cards">
          <li v-for="scene in home.presets.scenes.items" :key="scene.name" class="vt-scene-card">
            <header class="vt-scene-card-head">
              <h4>{{ scene.name }}</h4>
              <span class="vt-scene-preset">
                <span v-if="home.presets.scenes.labels">{{ home.presets.scenes.labels.preset }}</span>
                <span class="vt-badge">{{ scene.preset }}</span>
              </span>
            </header>
            <ul v-if="scene.apps" class="vt-tiles">
              <BrandTile v-for="app in scene.apps" :key="app.name" :name="app.name" :app="app.mark" :icon="app.icon" />
            </ul>
            <p v-if="scene.more" class="vt-scene-more">{{ scene.more }}</p>
            <p v-if="scene.instruction" class="vt-scene-ask">
              <span v-if="home.presets.scenes.labels" class="vt-scene-ask-label">{{ home.presets.scenes.labels.instruction }}</span>
              <span>{{ scene.instruction }}</span>
            </p>
            <p v-if="scene.body" class="vt-scene-ask">{{ scene.body }}</p>
          </li>
        </ul>
        <ul v-else class="vt-scene-rows">
          <li v-for="scene in home.presets.scenes.items" :key="scene.name" class="vt-scene-row">
            <b>{{ scene.name }}</b>
            <p>{{ scene.body }}</p>
            <span class="vt-scene-preset">
              <VtIcon name="arrow" :size="15" />
              <span class="vt-badge">{{ scene.preset }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
