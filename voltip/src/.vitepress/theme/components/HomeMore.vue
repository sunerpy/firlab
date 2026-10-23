<script setup lang="ts">
/**
 * More features (`home.more`), as cells of different widths: each a title, its words and one piece
 * of evidence (key caps, chips, a chain of steps, a line of code or a correction), then the guide
 * page that covers it. Optional, so a page written before it builds.
 */
import { withBase } from 'vitepress';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home && home.more" class="vt-v2-band" aria-labelledby="vt-more-title">
    <div class="vt-wrap">
      <header class="vt-sec-head">
        <h2 id="vt-more-title" v-html="inline(home.more.title)" />
        <p v-if="home.more.intro">{{ home.more.intro }}</p>
      </header>
      <ul class="vt-bento">
        <li v-for="item in home.more.items" :key="item.title" class="vt-bento-cell" :class="{ 'vt-bento-wide': item.wide }">
          <h3>{{ item.title }}</h3>
          <p class="vt-bento-body" v-html="inline(item.body, withBase)" />
          <div v-if="item.keys || item.chips || item.chain || item.code || item.swap" class="vt-bento-proof">
            <p v-if="item.keys" class="vt-keyset">
              <kbd v-for="key in item.keys" :key="key">{{ key }}</kbd>
            </p>
            <ul v-else-if="item.chips" class="vt-chips">
              <li v-for="chip in item.chips" :key="chip" class="vt-chip">{{ chip }}</li>
            </ul>
            <ol v-else-if="item.chain" class="vt-chain">
              <li v-for="(link, i) in item.chain" :key="link">
                <VtIcon v-if="i > 0" name="arrow" :size="14" />
                <span class="vt-chip">{{ link }}</span>
              </li>
            </ol>
            <pre v-else-if="item.code" class="vt-code-line"><code>{{ item.code }}</code></pre>
            <p v-else-if="item.swap" class="vt-swap">
              <span class="vt-swap-from">{{ item.swap.from }}</span>
              <VtIcon name="arrow" :size="15" />
              <code>{{ item.swap.to }}</code>
            </p>
          </div>
          <p v-if="item.guide" class="vt-bento-guide" v-html="inline(item.guide, withBase)" />
        </li>
      </ul>
      <p v-if="home.more.note" class="vt-footnote" v-html="inline(home.more.note, withBase)" />
    </div>
  </section>
</template>
