<script setup lang="ts">
/**
 * Common questions (`home.faq`), every answer open in two columns: nothing to click, the answers
 * read and search like the rest of the page.
 */
import { withBase } from 'vitepress';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-faq-title">
    <div class="vt-wrap">
      <header class="vt-sec-head">
        <h2 id="vt-faq-title" v-html="inline(home.faq.title)" />
        <p v-if="home.faq.intro" v-html="inline(home.faq.intro, withBase)" />
      </header>
      <div class="vt-qa">
        <div v-for="item in home.faq.items" :key="item.q" class="vt-qa-item">
          <h3>{{ item.q }}</h3>
          <p v-html="inline(item.a, withBase)" />
        </div>
      </div>
    </div>
  </section>
</template>
