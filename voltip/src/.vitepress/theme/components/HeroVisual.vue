<script setup lang="ts">
/**
 * The hero's right side: a real capture of the Voltip home screen in the site's theme,
 * with the real overlay captures stacked below it. The overlay cycles through its states
 * with an opacity cross-fade only; with reduced motion it stays on the last state.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="vt-hero-visual">
    <div class="vt-hero-screen">
      <img
        class="vt-only-light"
        :src="withBase(visual.home.light)"
        :width="visual.home.width"
        :height="visual.home.height"
        :alt="visual.home.alt"
        loading="lazy"
        decoding="async"
      />
      <img
        class="vt-only-dark"
        :src="withBase(visual.home.dark)"
        :width="visual.home.width"
        :height="visual.home.height"
        :alt="visual.home.alt"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="vt-hero-pill" :style="{ '--vt-pill-count': visual.pill.length }">
      <div
        v-for="(pill, i) in visual.pill"
        :key="pill.light"
        class="vt-pill-frame"
        :class="{ 'vt-pill-last': i === visual.pill.length - 1 }"
        :style="{ '--vt-pill-index': i, aspectRatio: `${pill.width} / ${pill.height}` }"
      >
        <img
          class="vt-only-light"
          :src="withBase(pill.light)"
          :width="pill.width"
          :height="pill.height"
          :alt="pill.alt"
          loading="lazy"
          decoding="async"
        />
        <img
          class="vt-only-dark"
          :src="withBase(pill.dark)"
          :width="pill.width"
          :height="pill.height"
          :alt="pill.alt"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </figure>
</template>

<style scoped>
.vt-hero-visual {
  position: relative;
  width: 100%;
  margin: 0;
  padding-bottom: 36px;
}

.vt-hero-screen {
  overflow: hidden;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-1);
  box-shadow: var(--vt-shadow-plate);
}

.vt-hero-screen img {
  display: block;
  width: 100%;
  height: auto;
}

.vt-hero-pill {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(72%, 400px);
  transform: translateX(-50%);
  display: grid;
}

.vt-pill-frame {
  grid-area: 1 / 1;
  width: 100%;
  opacity: 0;
  animation: vt-pill-cycle calc(var(--vt-pill-count) * 2.6s) infinite;
  animation-delay: calc(var(--vt-pill-index) * 2.6s);
  filter: drop-shadow(0 10px 22px rgb(11 18 32 / 0.22));
}

.vt-pill-frame img {
  display: block;
  width: 100%;
  height: auto;
}

@keyframes vt-pill-cycle {
  0% {
    opacity: 0;
  }
  4% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  34% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vt-pill-frame {
    animation: none;
  }
  .vt-pill-frame.vt-pill-last {
    opacity: 1;
  }
}
</style>
