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
  <figure class="cg-figure">
    <div class="cg-figure-frame">
      <img
        :class="{ 'cg-only-light': dark }"
        :src="withBase(src)"
        :width="width"
        :height="height"
        :alt="alt"
        loading="lazy"
        decoding="async"
      />
      <img
        v-if="dark"
        class="cg-only-dark"
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
.cg-figure {
  margin: 24px 0;
  min-width: 0;
}

.cg-figure-frame {
  overflow: hidden;
  border: 1px solid var(--cg-rule);
  border-radius: var(--cg-radius-plate);
  background: var(--cg-paper-1);
  box-shadow: var(--cg-shadow-plate);
}

.cg-figure-frame img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}

.cg-figure figcaption {
  margin-top: 12px;
  color: var(--cg-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
