<script setup lang="ts">
/**
 * A real recording of the app, framed as ScreenFigure frames a screenshot: muted, looping and
 * inline, it plays while it is on screen and pauses off it, and loads nothing before it plays
 * (`preload="none"`, the poster until then). A reader who asked for less motion
 * (`prefers-reduced-motion`) gets the poster and the controls: nothing plays by itself.
 */
import { withBase } from 'vitepress';
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  src: string;
  poster: string;
  width: number | string;
  height: number | string;
  /** What the recording shows, for screen readers. */
  label: string;
  caption?: string;
}>();

const video = ref<HTMLVideoElement | null>(null);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  const element = video.value;
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) void element.play().catch(() => undefined);
      else element.pause();
    },
    { threshold: 0.4 },
  );
  observer.observe(element);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <figure class="lk-figure">
    <div class="lk-figure-frame">
      <video
        ref="video"
        :src="withBase(src)"
        :poster="withBase(poster)"
        :width="width"
        :height="height"
        :aria-label="label"
        muted
        loop
        playsinline
        controls
        preload="none"
      />
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.lk-figure {
  margin: 24px 0;
  min-width: 0;
}

.lk-figure-frame {
  overflow: hidden;
  border: 1px solid var(--lk-rule);
  border-radius: var(--lk-radius-plate);
  background: var(--lk-paper-1);
  box-shadow: var(--lk-shadow-plate);
}

.lk-figure-frame video {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
}

.lk-figure figcaption {
  margin-top: 12px;
  color: var(--lk-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
