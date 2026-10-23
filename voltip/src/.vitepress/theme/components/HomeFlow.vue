<script setup lang="ts">
/**
 * How one dictation is processed (`home.flow`): the steps in order along one line, each a node with
 * its icon, its name and what can be chosen there; down the page below 1100 px. Optional, so a
 * page written before it builds.
 */
import { withBase } from 'vitepress';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home && home.flow" class="vt-v2-band" aria-labelledby="vt-flow-title">
    <div class="vt-wrap">
      <header class="vt-sec-head">
        <h2 id="vt-flow-title" v-html="inline(home.flow.title)" />
        <p v-if="home.flow.intro">{{ home.flow.intro }}</p>
      </header>
      <ol class="vt-flow">
        <li v-for="step in home.flow.steps" :key="step.name" class="vt-flow-step">
          <span class="vt-flow-node"><VtIcon :name="step.icon" :size="18" /></span>
          <div class="vt-flow-words">
            <h3>
              {{ step.name }}
              <span v-if="step.tag" class="vt-badge">{{ step.tag }}</span>
            </h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
      <p v-if="home.flow.note" class="vt-footnote" v-html="inline(home.flow.note, withBase)" />
    </div>
  </section>
</template>
