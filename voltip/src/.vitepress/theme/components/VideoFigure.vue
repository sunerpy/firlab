<script setup lang="ts">
/**
 * A video of the app, framed like ScreenFigure. Nothing plays or downloads until the reader
 * asks: `preload="metadata"` fetches only what the duration needs, and the poster is what
 * shows before. The files live in this repository (`src/public/media/`), not in voltip's
 * `docs/site/`: a 13 MB render would grow voltip's history on every re-render, and the
 * pages only need the path.
 *
 * The captions are burned into the picture, so there is no text track to add.
 */
import { withBase } from 'vitepress';

defineProps<{
  src: string;
  poster: string;
  width: number | string;
  height: number | string;
  /** The video's accessible name. */
  title: string;
  caption?: string;
}>();
</script>

<template>
  <figure class="vt-video">
    <div class="vt-video-frame">
      <video
        controls
        playsinline
        preload="metadata"
        :poster="withBase(poster)"
        :width="width"
        :height="height"
        :aria-label="title"
      >
        <source :src="withBase(src)" type="video/mp4" />
        <a :href="withBase(src)">{{ title }}</a>
      </video>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.vt-video {
  margin: 24px 0;
  min-width: 0;
}

.vt-video-frame {
  overflow: hidden;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-1);
  box-shadow: var(--vt-shadow-plate);
}

.vt-video-frame video {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}

.vt-video figcaption {
  margin-top: 12px;
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
