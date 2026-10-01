<script setup lang="ts">
/**
 * The hero's right side: a real capture of Lockra's codes page in the site's theme. Both images
 * are lazy, so the one hidden by the theme is never fetched (it is in view, so the shown one
 * loads at once).
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="lk-hero-visual">
    <div class="lk-hero-screen">
      <img
        class="lk-only-light"
        :src="withBase(visual.home.light)"
        :width="visual.home.width"
        :height="visual.home.height"
        :alt="visual.home.alt"
        loading="lazy"
        decoding="async"
      />
      <img
        class="lk-only-dark"
        :src="withBase(visual.home.dark)"
        :width="visual.home.width"
        :height="visual.home.height"
        :alt="visual.home.alt"
        loading="lazy"
        decoding="async"
      />
    </div>
  </figure>
</template>

<style scoped>
.lk-hero-visual {
  width: 100%;
  margin: 0;
}

.lk-hero-screen {
  overflow: hidden;
  border: 1px solid var(--lk-rule);
  border-radius: var(--lk-radius-plate);
  background: var(--lk-paper-1);
  box-shadow: var(--lk-shadow-plate);
}

.lk-hero-screen img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
