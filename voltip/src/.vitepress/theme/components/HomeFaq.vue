<script setup lang="ts">
/**
 * Common questions (`home.faq`) as native disclosure widgets, the first one open: they work
 * with the keyboard and without JavaScript, and the answers stay in the page for search.
 */
import { withBase } from 'vitepress';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-faq-title">
    <div class="vt-wrap vt-faq">
      <div class="vt-sec-head">
        <h2 id="vt-faq-title" v-html="inline(home.faq.title)" />
        <p v-if="home.faq.intro" v-html="inline(home.faq.intro, withBase)" />
      </div>
      <div class="vt-card vt-faq-list">
        <details v-for="(item, i) in home.faq.items" :key="item.q" :open="i === 0">
          <summary>
            {{ item.q }}
            <VtIcon name="chevron" />
          </summary>
          <p v-html="inline(item.a, withBase)" />
        </details>
      </div>
    </div>
  </section>
</template>
