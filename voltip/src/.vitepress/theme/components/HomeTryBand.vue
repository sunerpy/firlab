<script setup lang="ts">
/**
 * The band under the hero that leads to the try page (design B, 2026-10-12): a microphone, what
 * the page offers, a heard → polished sample and the button, all one target. The words come from
 * the page's `home.try` frontmatter; without it nothing renders. The heard sample may strike out
 * the words polish drops (`~~嗯那个~~`, components/inline.ts).
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';
import { inline } from './inline';

const { frontmatter } = useData();
const band = computed(() => (frontmatter.value.home as Home | undefined)?.try);
</script>

<template>
  <section v-if="band" class="vt-tryband-wrap" :aria-label="band.title">
    <div class="vt-tryband">
      <span class="vt-tryband-mic" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z M19 11a7 7 0 0 1-14 0 M12 18v3" /></svg>
      </span>
      <span class="vt-tryband-words">
        <strong>{{ band.title }}</strong>
        <span>{{ band.body }}</span>
      </span>
      <span class="vt-tryband-sample" aria-hidden="true">
        <span class="vt-tryband-heard" v-html="inline(band.heard)" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>
        <span class="vt-tryband-polished">{{ band.polished }}</span>
      </span>
      <!-- The link covers the whole band (its ::after), so a click anywhere on it opens the page. -->
      <a class="vt-tryband-action" :href="band.action.link">
        {{ band.action.text }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6" /></svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* The hero's own column: VPHero pads 24 / 48 / 64 px and caps its container at 1152 px. */
.vt-tryband-wrap {
  margin: -24px 0 56px;
  padding: 0 24px;
}
@media (min-width: 640px) {
  .vt-tryband-wrap {
    margin: -40px 0 72px;
    padding: 0 48px;
  }
}
@media (min-width: 960px) {
  .vt-tryband-wrap {
    padding: 0 64px;
  }
}

.vt-tryband {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 16px 24px;
  max-width: 1152px;
  margin: 0 auto;
  padding: 20px 22px 20px 20px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-plate);
  background: var(--vt-paper-elv);
  box-shadow: var(--vt-shadow-plate);
  transition: border-color 0.2s;
}
.vt-tryband:hover {
  border-color: var(--vt-ink-400);
}

.vt-tryband-mic {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--vt-accent);
  color: var(--vt-accent-ink);
}

.vt-tryband-words {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.vt-tryband-words strong {
  color: var(--vt-ink-900);
  font-size: 18px;
  font-weight: 650;
  line-height: 1.4;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
.vt-tryband-words span {
  color: var(--vt-ink-500);
  font-size: 14.5px;
  line-height: 1.55;
  text-wrap: balance;
}

.vt-tryband-sample {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  padding: 10px 14px;
  border-radius: var(--vt-radius-control);
  background: var(--vt-paper-1);
  color: var(--vt-ink-900);
  font-size: 14px;
  white-space: nowrap;
}
.vt-tryband-sample svg {
  flex: none;
  color: var(--vt-ink-400);
}
.vt-tryband-heard,
.vt-tryband-polished {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vt-tryband-heard {
  color: var(--vt-ink-500);
}
/* What polish drops, struck through in the mark colour (a mark, not text). */
.vt-tryband-heard :deep(del) {
  color: var(--vt-ink-400);
  text-decoration-color: var(--vt-mark);
  text-decoration-thickness: 2px;
}

.vt-tryband-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 22px;
  border-radius: var(--vt-radius-pill);
  background: var(--vt-accent);
  color: var(--vt-accent-ink);
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 0.2s;
}
.vt-tryband-action::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--vt-radius-plate);
}
.vt-tryband:hover .vt-tryband-action {
  background: var(--vt-accent-hover);
}
.vt-tryband-action:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 2px;
}

@media (max-width: 1100px) {
  .vt-tryband {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
  .vt-tryband-sample {
    display: none;
  }
}
@media (max-width: 640px) {
  .vt-tryband {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 16px;
  }
  .vt-tryband-mic {
    width: 48px;
    height: 48px;
  }
  .vt-tryband-action {
    grid-column: 1 / -1;
  }
}
</style>
