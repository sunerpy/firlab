<script setup lang="ts">
/**
 * The hero's right side in the 2026-10 layout (`home.scene`): one real dictation, cut from a
 * screen recording. The overlay while speaking, the text that went in at the cursor, and the
 * overlay after it went in. The two overlays are captures; the inserted text is the page's own
 * text in a plain card, not a drawn window (DESIGN.md §10). From 960 px the two stages sit side
 * by side under the hero's words (2026-10-24); below that they stack. The caret blinks four times
 * and then stays, under five seconds (WCAG 2.2.2); with reduced motion it does not blink.
 */
import VtIcon from './VtIcon.vue';
import VtImg from './VtImg.vue';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <figure v-if="home" class="vt-scene">
    <div class="vt-scene-plate">
      <div class="vt-scene-stage">
        <p class="vt-scene-step"><span class="vt-scene-num" aria-hidden="true">1</span>{{ home.scene.steps[0] }}</p>
        <VtImg class="vt-scene-live" :img="home.scene.live" loading="eager" />
      </div>
      <span class="vt-scene-to" aria-hidden="true"><VtIcon name="arrow" :size="18" /></span>
      <div class="vt-scene-stage">
        <p class="vt-scene-step"><span class="vt-scene-num" aria-hidden="true">2</span>{{ home.scene.steps[1] }}</p>
        <div class="vt-scene-card">
          <span class="vt-scene-label">{{ home.scene.label }}</span>
          <p class="vt-scene-result">{{ home.scene.result }}<span class="vt-scene-caret" aria-hidden="true" /></p>
          <VtImg class="vt-scene-done" :img="home.scene.inserted" loading="eager" />
        </div>
      </div>
    </div>
    <figcaption class="vt-scene-caption">{{ home.scene.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.vt-scene {
  width: 100%;
  margin: 0;
}

.vt-scene-plate {
  position: relative;
  display: grid;
  gap: 24px;
  padding: 32px 32px 44px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-scene-plate);
}

.vt-scene-stage {
  min-width: 0;
}

.vt-scene-to {
  display: none;
}

@media (min-width: 960px) {
  .vt-scene-plate {
    grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr);
    align-items: center;
    gap: 0 16px;
    padding: 36px 40px 48px;
  }

  .vt-scene-to {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    margin-top: 28px;
    border: 1px solid var(--vt-rule);
    border-radius: 50%;
    background: var(--vt-paper-elv);
    color: var(--vt-ink-500);
  }
}

.vt-scene-step {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--vt-ink-400);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.vt-scene-card {
  margin-top: 12px;
}

.vt-scene-num {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 20px;
  height: 20px;
  border: 1px solid var(--vt-rule-strong);
  border-radius: 50%;
  background: var(--vt-paper-elv);
  color: var(--vt-ink-700);
  font-size: 11px;
  font-weight: 650;
}

.vt-scene :deep(.vt-scene-live) {
  display: block;
  width: 100%;
  max-width: 560px;
  height: auto;
  margin: 14px 0 0;
  filter: var(--vt-pill-drop);
}

.vt-scene-card {
  position: relative;
  padding: 20px 24px 40px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-elv);
  box-shadow: var(--vt-shadow-plate);
}

.vt-scene-label {
  display: block;
  color: var(--vt-ink-400);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.vt-scene-result {
  margin: 8px 0 0;
  color: var(--vt-ink-900);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.6;
  /* Balanced, so the lines come out even (bands.css: `pretty` left 「据。」 alone here). */
  text-wrap: balance;
}

.vt-scene-caret {
  display: inline-block;
  width: 2px;
  height: 1.15em;
  margin-left: 3px;
  vertical-align: -0.2em;
  background: var(--vt-ink-900);
  animation: vt-caret 1.1s steps(1, end) 4;
}

@keyframes vt-caret {
  50% {
    opacity: 0;
  }
}

.vt-scene :deep(.vt-scene-done) {
  position: absolute;
  right: 20px;
  bottom: -22px;
  width: 46%;
  height: auto;
  filter: var(--vt-pill-drop);
}

.vt-scene-caption {
  margin-top: 36px;
  color: var(--vt-ink-400);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 639px) {
  .vt-scene-plate {
    padding: 24px 16px 40px;
  }


  .vt-scene-card {
    padding: 16px 16px 36px;
  }

  .vt-scene-result {
    font-size: 17px;
  }

  .vt-scene :deep(.vt-scene-done) {
    right: 12px;
    width: 58%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vt-scene-caret {
    animation: none;
  }
}
</style>
