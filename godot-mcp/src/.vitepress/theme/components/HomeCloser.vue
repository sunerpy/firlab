<script setup lang="ts">
/** The last band (`home.closer`): the closing words and the buttons on the left, godot-mcp's mark on
 *  the right from 960 px, one column on a phone. An arrow follows its words; any other icon leads. */
import { withBase } from 'vitepress';
import GmIcon from './GmIcon.vue';
import { inline } from './inline';
import { away, href } from './links';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="gm-v2-band gm-closer" aria-labelledby="gm-closer-title">
    <div class="gm-wrap gm-closer-grid">
      <div class="gm-closer-words">
        <h2 id="gm-closer-title">{{ home.closer.title }}</h2>
        <p v-html="inline(home.closer.body)" />
        <div class="gm-actions">
          <a
            v-for="action in home.closer.actions"
            :key="action.link"
            class="gm-btn"
            :class="action.theme === 'brand' ? 'gm-btn-brand' : 'gm-btn-alt'"
            :href="href(action.link)"
            v-bind="away(action.link)"
          >
            <GmIcon v-if="action.icon && action.icon !== 'arrow-right'" :name="action.icon" />
            {{ action.text }}
            <GmIcon v-if="action.icon === 'arrow-right'" name="arrow-right" />
          </a>
        </div>
      </div>
      <img class="gm-closer-mark" :src="withBase('/godot-mcp-logo.svg')" width="128" height="128" alt="" />
    </div>
  </section>
</template>
