<script setup lang="ts">
/**
 * The hero's right side: a real capture of CodeGraph's browser viewer in the site's theme,
 * framed by a hairline — no drawn window. `mobile`, a phone capture laid over the lower
 * right corner, is supported but unused. Nothing moves.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="cg-hero-visual" :class="{ 'has-mobile': visual.mobile }">
    <div class="cg-hero-screen">
      <img
        class="cg-only-light"
        :src="withBase(visual.desktop.light)"
        :width="visual.desktop.width"
        :height="visual.desktop.height"
        :alt="visual.desktop.alt"
        decoding="async"
      />
      <img
        class="cg-only-dark"
        :src="withBase(visual.desktop.dark)"
        :width="visual.desktop.width"
        :height="visual.desktop.height"
        :alt="visual.desktop.alt"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div v-if="visual.mobile" class="cg-hero-phone" :style="{ aspectRatio: `${visual.mobile.width} / ${visual.mobile.height}` }">
      <img
        class="cg-only-light"
        :src="withBase(visual.mobile.light)"
        :width="visual.mobile.width"
        :height="visual.mobile.height"
        :alt="visual.mobile.alt"
        loading="lazy"
        decoding="async"
      />
      <img
        class="cg-only-dark"
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
.cg-hero-visual {
  position: relative;
  width: 100%;
  margin: 0;
}

/* Room for the phone capture to hang below the desktop one. */
.cg-hero-visual.has-mobile {
  padding-bottom: 48px;
}

.cg-hero-screen {
  overflow: hidden;
  border: 1px solid var(--cg-rule);
  border-radius: var(--cg-radius-plate);
  background: var(--cg-paper-1);
  box-shadow: var(--cg-shadow-plate);
}

.cg-hero-visual.has-mobile .cg-hero-screen {
  width: 86%;
}

.cg-hero-screen img,
.cg-hero-phone img {
  display: block;
  width: 100%;
  height: auto;
}

.cg-hero-phone {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 27%;
  overflow: hidden;
  border: 1px solid var(--cg-rule);
  border-radius: var(--cg-radius-plate);
  background: var(--cg-paper-1);
  filter: var(--cg-pill-drop);
}

@media (max-width: 479px) {
  .cg-hero-visual.has-mobile {
    padding-bottom: 32px;
  }

  .cg-hero-phone {
    width: 32%;
  }
}
</style>
