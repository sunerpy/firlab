<script setup lang="ts">
/**
 * A real screenshot of the app, framed by a hairline — never redrawn window chrome.
 * `dark` is the same screen in the dark theme; the page shows the one that matches the
 * site's theme. Both carry `loading="lazy"`, so the hidden one is never fetched.
 */
import { withBase } from 'vitepress';

defineProps<{
  src: string;
  dark?: string;
  width: number | string;
  height: number | string;
  alt: string;
  caption?: string;
}>();
</script>

<template>
  <figure class="wn-figure">
    <div class="wn-figure-frame">
      <img
        :class="{ 'wn-only-light': dark }"
        :src="withBase(src)"
        :width="width"
        :height="height"
        :alt="alt"
        loading="lazy"
        decoding="async"
      />
      <img
        v-if="dark"
        class="wn-only-dark"
        :src="withBase(dark)"
        :width="width"
        :height="height"
        :alt="alt"
        loading="lazy"
        decoding="async"
      />
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.wn-figure {
  margin: 24px 0;
  min-width: 0;
}

.wn-figure-frame {
  overflow: hidden;
  border: 1px solid var(--wn-rule);
  border-radius: var(--wn-radius-plate);
  background: var(--wn-paper-1);
  box-shadow: var(--wn-shadow-plate);
}

.wn-figure-frame img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}

.wn-figure figcaption {
  margin-top: 12px;
  color: var(--wn-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
