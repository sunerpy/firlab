<script setup lang="ts">
/**
 * Things worth seeing (`home.showcases`), a band each: the words and their points on one side, a
 * real screenshot on the other. The sides alternate from 960 px; below that the words come first.
 * A screenshot taller than it is wide is the phone App's, and keeps a phone's width instead of
 * filling the column (styles/bands.css, `.pt-shot-phone`).
 */
import PtImg from './PtImg.vue';
import GuideLink from './GuideLink.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';
import type { Screen } from '../data/home-schema';

const home = useHomeV2();
const isPhone = (screen: Screen) => screen.height > screen.width;
</script>

<template>
  <template v-if="home">
    <section
      v-for="(show, i) in home.showcases"
      :key="show.title"
      class="pt-v2-band"
      :aria-labelledby="`pt-showcase-${i}-title`"
    >
      <div class="pt-wrap pt-showcase" :class="{ 'pt-showcase-flip': i % 2 === 1, 'pt-showcase-phone': isPhone(show.screen) }">
        <div class="pt-showcase-words">
          <h2 :id="`pt-showcase-${i}-title`">{{ show.title }}</h2>
          <p class="pt-showcase-intro" v-html="inline(show.intro)" />
          <ul class="pt-points">
            <li v-for="point in show.points" :key="point.title">
              <h3>{{ point.title }}</h3>
              <p v-html="inline(point.body)" />
            </li>
          </ul>
          <GuideLink v-if="show.guide" :guide="show.guide" />
        </div>
        <figure class="pt-showcase-media">
          <div class="pt-shot-frame" :class="{ 'pt-shot-phone': isPhone(show.screen) }">
            <PtImg :screen="show.screen" />
          </div>
          <figcaption v-if="show.caption">{{ show.caption }}</figcaption>
        </figure>
      </div>
    </section>
  </template>
</template>
