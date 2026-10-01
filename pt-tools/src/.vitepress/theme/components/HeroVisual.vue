<script setup lang="ts">
/**
 * The hero's right side: a real capture of the pt-tools web UI in the site's theme, with
 * the same page captured on a phone laid over its lower right corner. Both are captures of
 * the real interface on its acceptance fixtures, framed by a hairline — no drawn window or
 * phone. Nothing moves.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="pt-hero-visual" :class="{ 'has-mobile': visual.mobile }">
    <div class="pt-hero-screen">
      <img
        class="pt-only-light"
        :src="withBase(visual.desktop.light)"
        :width="visual.desktop.width"
        :height="visual.desktop.height"
        :alt="visual.desktop.alt"
        decoding="async"
      />
      <img
        class="pt-only-dark"
        :src="withBase(visual.desktop.dark)"
        :width="visual.desktop.width"
        :height="visual.desktop.height"
        :alt="visual.desktop.alt"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div v-if="visual.mobile" class="pt-hero-phone" :style="{ aspectRatio: `${visual.mobile.width} / ${visual.mobile.height}` }">
      <img
        class="pt-only-light"
        :src="withBase(visual.mobile.light)"
        :width="visual.mobile.width"
        :height="visual.mobile.height"
        :alt="visual.mobile.alt"
        loading="lazy"
        decoding="async"
      />
      <img
        class="pt-only-dark"
        :src="withBase(visual.mobile.dark)"
        :width="visual.mobile.width"
        :height="visual.mobile.height"
        :alt="visual.mobile.alt"
        loading="lazy"
        decoding="async"
      />
    </div>
  </figure>
</template>

<style scoped>
.pt-hero-visual {
  position: relative;
  width: 100%;
  margin: 0;
}

/* Room for the phone capture to hang below the desktop one. */
.pt-hero-visual.has-mobile {
  padding-bottom: 48px;
}

.pt-hero-screen {
  overflow: hidden;
  border: 1px solid var(--pt-rule);
  border-radius: var(--pt-radius-plate);
  background: var(--pt-paper-1);
  box-shadow: var(--pt-shadow-plate);
}

.pt-hero-visual.has-mobile .pt-hero-screen {
  width: 86%;
}

.pt-hero-screen img,
.pt-hero-phone img {
  display: block;
  width: 100%;
  height: auto;
}

.pt-hero-phone {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 27%;
  overflow: hidden;
  border: 1px solid var(--pt-rule);
  border-radius: var(--pt-radius-plate);
  background: var(--pt-paper-1);
  filter: var(--pt-pill-drop);
}

@media (max-width: 479px) {
  .pt-hero-visual.has-mobile {
    padding-bottom: 32px;
  }

  .pt-hero-phone {
    width: 32%;
  }
}
</style>
