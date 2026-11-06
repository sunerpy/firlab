<script setup lang="ts">
/**
 * A real screenshot on a guide page, framed by a hairline, never redrawn window chrome:
 * `<ScreenFigure src="/screens/<name>.webp" dark="…" width="…" height="…" alt="…" caption="…" />`.
 * `dark` is the same view in the dark theme; the page shows the one that matches the site's
 * theme. Both carry `loading="lazy"`, so the hidden one is never fetched.
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
  <figure class="gm-figure">
    <div class="gm-figure-frame">
      <img
        :class="{ 'gm-only-light': dark }"
        :src="withBase(src)"
        :width="width"
        :height="height"
        :alt="alt"
        loading="lazy"
        decoding="async"
      />
      <img
        v-if="dark"
        class="gm-only-dark"
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
.gm-figure {
  margin: 24px 0;
  min-width: 0;
}

.gm-figure-frame {
  overflow: hidden;
  border: 1px solid var(--gm-rule);
  border-radius: var(--gm-radius-plate);
  background: var(--gm-paper-1);
  box-shadow: var(--gm-shadow-plate);
}

/* base.css rounds every image of a page; inside the frame the frame does it. */
.vp-doc .gm-figure-frame img,
.gm-figure-frame img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}

/* A caption is two or three lines, so it balances them and never ends on one word. */
.gm-figure figcaption {
  margin-top: 12px;
  color: var(--gm-ink-500);
  font-size: 14px;
  line-height: 1.6;
  text-wrap: balance;
}
</style>
