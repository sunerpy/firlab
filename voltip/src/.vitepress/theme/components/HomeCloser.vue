<script setup lang="ts">
/** The last band (`home.closer`): the claim once more and the buttons, centred. */
import { withBase } from 'vitepress';
import VtIcon from './VtIcon.vue';
import { inline, isExternal } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
const href = (link: string) => (isExternal(link) ? link : withBase(link));
</script>

<template>
  <section v-if="home" class="vt-v2-band vt-closer" aria-labelledby="vt-closer-title">
    <div class="vt-wrap">
      <h2 id="vt-closer-title" v-html="inline(home.closer.title)" />
      <p v-if="home.closer.body">{{ home.closer.body }}</p>
      <div class="vt-actions">
        <a
          v-for="action in home.closer.actions"
          :key="action.link"
          class="vt-btn"
          :class="action.theme === 'brand' ? 'vt-btn-brand' : 'vt-btn-alt'"
          :href="href(action.link)"
          :target="isExternal(action.link) ? '_blank' : undefined"
          :rel="isExternal(action.link) ? 'noreferrer' : undefined"
        >
          <VtIcon v-if="action.icon" :name="action.icon" />
          {{ action.text }}
        </a>
      </div>
    </div>
  </section>
</template>
