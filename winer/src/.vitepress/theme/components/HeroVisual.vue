<script setup lang="ts">
/**
 * The hero's right side: a capture of winer's window in the site's theme, light or dark,
 * taken from the window's demo client so no real player appears. Framed by a hairline,
 * no drawn window. Nothing moves.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="wn-hero-visual">
    <div class="wn-hero-screen">
      <img
        class="wn-only-light"
        :src="withBase(visual.desktop.light)"
        :width="visual.desktop.width"
        :height="visual.desktop.height"
        :alt="visual.desktop.alt"
        decoding="async"
      />
      <img
        class="wn-only-dark"
        :src="withBase(visual.desktop.dark)"
        :width="visual.desktop.width"
        :height="visual.desktop.height"
        :alt="visual.desktop.alt"
        loading="lazy"
        decoding="async"
      />
    </div>
  </figure>
</template>

<style scoped>
.wn-hero-visual {
  width: 100%;
  margin: 0;
}

.wn-hero-screen {
  overflow: hidden;
  border: 1px solid var(--wn-rule);
  border-radius: var(--wn-radius-plate);
  background: var(--wn-paper-1);
  box-shadow: var(--wn-shadow-plate);
}

.wn-hero-screen img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
