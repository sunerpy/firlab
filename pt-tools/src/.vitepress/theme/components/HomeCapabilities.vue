<script setup lang="ts">
/**
 * What pt-tools does (`home.capabilities`), as cells: each an icon, its maturity, a title that
 * leads to its guide page, its words and one piece of evidence at the cell's foot (a line of the
 * real interface, or names). Three across from 1100 px, where a `wide` cell takes two; two across
 * from 640 px. After godot-mcp's HomeCapabilities.
 */
import PtIcon from './PtIcon.vue';
import StatusTag from './StatusTag.vue';
import { codeTokens, inline } from './inline';
import { away, href } from './links';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="pt-v2-band" aria-labelledby="pt-capabilities-title">
    <div class="pt-wrap">
      <header class="pt-sec-head">
        <h2 id="pt-capabilities-title">{{ home.capabilities.title }}</h2>
        <p v-if="home.capabilities.intro" v-html="inline(home.capabilities.intro)" />
      </header>
      <ul class="pt-bento">
        <li
          v-for="item in home.capabilities.items"
          :key="item.title"
          class="pt-bento-cell"
          :class="{ 'pt-bento-wide': item.wide }"
        >
          <div class="pt-bento-top">
            <span class="pt-tile pt-tile-sm"><PtIcon :name="item.icon" :size="20" /></span>
            <StatusTag :status="item.status" />
          </div>
          <h3>
            <a :href="href(item.link)" v-bind="away(item.link)">{{ item.title }}</a>
          </h3>
          <p class="pt-bento-body" v-html="inline(item.body)" />
          <div class="pt-bento-proof">
            <pre v-if="item.evidence.kind === 'code'" class="pt-code-line" tabindex="0"><code v-html="codeTokens(item.evidence.text)" /></pre>
            <ul v-else class="pt-chips">
              <li v-for="chip in item.evidence.items" :key="chip" class="pt-chip">{{ chip }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
