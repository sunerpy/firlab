<script setup lang="ts">
/**
 * Common questions (`home.faq`), every answer open in two columns from 960 px: nothing to click,
 * the answers read and search like the rest of the page. An answer may lead to its guide page.
 */
import GuideLink from './GuideLink.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="gm-v2-band" aria-labelledby="gm-faq-title">
    <div class="gm-wrap">
      <header class="gm-sec-head">
        <h2 id="gm-faq-title">{{ home.faq.title }}</h2>
        <p v-if="home.faq.intro" v-html="inline(home.faq.intro)" />
      </header>
      <div class="gm-qa">
        <div v-for="item in home.faq.items" :key="item.q" class="gm-qa-item">
          <h3>{{ item.q }}</h3>
          <p v-html="inline(item.a)" />
          <GuideLink v-if="item.guide" :guide="item.guide" />
        </div>
      </div>
    </div>
  </section>
</template>
