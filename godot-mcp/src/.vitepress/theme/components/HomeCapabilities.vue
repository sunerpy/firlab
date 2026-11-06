<script setup lang="ts">
/**
 * What an agent can do with godot-mcp (`home.capabilities`), as cells: each an icon, whether it
 * needs Godot, a title that leads to its guide page, its words and one piece of evidence at the
 * cell's foot (lines of a real answer, or the tools it uses). Three across from 1100 px, where a
 * `wide` cell takes two; two across from 640 px.
 */
import GmIcon from './GmIcon.vue';
import StatusTag from './StatusTag.vue';
import { codeTokens, inline } from './inline';
import { away, href } from './links';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="gm-v2-band" aria-labelledby="gm-capabilities-title">
    <div class="gm-wrap">
      <header class="gm-sec-head">
        <h2 id="gm-capabilities-title">{{ home.capabilities.title }}</h2>
        <p v-if="home.capabilities.intro" v-html="inline(home.capabilities.intro)" />
      </header>
      <ul class="gm-bento">
        <li
          v-for="item in home.capabilities.items"
          :key="item.title"
          class="gm-bento-cell"
          :class="{ 'gm-bento-wide': item.wide }"
        >
          <div class="gm-bento-top">
            <span class="gm-tile gm-tile-sm"><GmIcon :name="item.icon" :size="20" /></span>
            <StatusTag :status="item.status" />
          </div>
          <h3>
            <a :href="href(item.link)" v-bind="away(item.link)">{{ item.title }}</a>
          </h3>
          <p class="gm-bento-body" v-html="inline(item.body)" />
          <div class="gm-bento-proof">
            <pre v-if="item.evidence.kind === 'code'" class="gm-code-line" tabindex="0"><code v-html="codeTokens(item.evidence.text)" /></pre>
            <ul v-else class="gm-chips">
              <li v-for="chip in item.evidence.items" :key="chip" class="gm-chip">{{ chip }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
