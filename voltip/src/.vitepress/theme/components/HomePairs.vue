<script setup lang="ts">
/**
 * What was said and what went in (`home.pairs`): each pair is the dark card of the spoken words,
 * with what AI polish dropped struck through, an arrow, and the text that was inserted or that
 * replaced a selection. Each result says whether it is a recorded output or a written example.
 */
import { withBase } from 'vitepress';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-pairs-title">
    <div class="vt-wrap">
      <header class="vt-sec-head vt-sec-center">
        <h2 id="vt-pairs-title" v-html="inline(home.pairs.title)" />
        <p v-if="home.pairs.intro">{{ home.pairs.intro }}</p>
      </header>
      <div class="vt-pairs">
        <article v-for="(pair, i) in home.pairs.items" :key="i" class="vt-pair">
          <div class="vt-said">
            <span class="vt-tag">
              <VtIcon :name="pair.kind === 'edit' ? 'wand' : 'mic'" :size="14" />
              {{ pair.kind === 'edit' ? home.pairs.labels.edit : home.pairs.labels.said }}
            </span>
            <p v-if="pair.kind === 'dictation'" v-html="inline(pair.said, withBase)" />
            <template v-else>
              <p class="vt-said-quote">{{ pair.said }}</p>
              <p class="vt-said-context">
                <span>{{ home.pairs.labels.selection }}</span>
                <span v-html="inline(pair.selection ?? '', withBase)" />
              </p>
            </template>
          </div>
          <span class="vt-pair-arrow" aria-hidden="true"><VtIcon name="down" :size="16" /></span>
          <div class="vt-card vt-typed">
            <span class="vt-tag">
              {{ pair.kind === 'edit' ? home.pairs.labels.replaced : home.pairs.labels.inserted }}
              <span class="vt-badge" :class="{ 'vt-badge-ink': pair.source === 'actual' }">{{
                pair.source === 'actual' ? home.pairs.labels.actual : home.pairs.labels.example
              }}</span>
            </span>
            <p class="vt-typed-text">{{ pair.result }}</p>
          </div>
        </article>
      </div>
      <p v-if="home.pairs.note" class="vt-footnote">{{ home.pairs.note }}</p>
    </div>
  </section>
</template>
