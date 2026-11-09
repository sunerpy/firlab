<script setup lang="ts">
/**
 * The last band (`home.closer`): the closing words and the buttons on the left; on the right, the
 * page's own Markdown in `.vp-doc` (where to talk about pt-tools, and the WeChat account's QR
 * code), one column on a phone. An arrow follows its words; any other icon leads.
 */
import { useSlots } from 'vue';
import PtIcon from './PtIcon.vue';
import { inline } from './inline';
import { away, href } from './links';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
const slots = useSlots();
</script>

<template>
  <section v-if="home" class="pt-v2-band pt-closer" aria-labelledby="pt-closer-title">
    <div class="pt-wrap pt-closer-grid" :class="{ 'pt-closer-with-aside': slots.default }">
      <div class="pt-closer-words">
        <h2 id="pt-closer-title">{{ home.closer.title }}</h2>
        <p v-html="inline(home.closer.body)" />
        <div class="pt-actions">
          <a
            v-for="action in home.closer.actions"
            :key="action.link"
            class="pt-btn"
            :class="action.theme === 'brand' ? 'pt-btn-brand' : 'pt-btn-alt'"
            :href="href(action.link)"
            v-bind="away(action.link)"
          >
            <PtIcon v-if="action.icon && action.icon !== 'arrow-right'" :name="action.icon" />
            {{ action.text }}
            <PtIcon v-if="action.icon === 'arrow-right'" name="arrow-right" />
          </a>
        </div>
      </div>
      <div v-if="slots.default" class="pt-closer-aside vp-doc"><slot /></div>
    </div>
  </section>
</template>
