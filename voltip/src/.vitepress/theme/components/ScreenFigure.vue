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
  <figure class="vt-figure">
    <div class="vt-figure-frame">
      <img
        :class="{ 'vt-only-light': dark }"
        :src="withBase(src)"
        :width="width"
        :height="height"
        :alt="alt"
        loading="lazy"
        decoding="async"
      />
      <img
        v-if="dark"
        class="vt-only-dark"
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
.vt-figure {
  margin: 24px 0;
  min-width: 0;
}

.vt-figure-frame {
  overflow: hidden;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-1);
  box-shadow: var(--vt-shadow-plate);
}

.vt-figure-frame img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}

.vt-figure figcaption {
  margin-top: 10px;
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
