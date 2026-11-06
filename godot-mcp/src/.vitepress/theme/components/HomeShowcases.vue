<script setup lang="ts">
/**
 * Two things worth seeing (`home.showcases`), a band each: the words and their points on one side,
 * a real screenshot on the other, with the exchange that produced it under it when there is one.
 * The sides alternate from 960 px; below that the words come first.
 */
import GmImg from './GmImg.vue';
import GuideLink from './GuideLink.vue';
import Transcript from './Transcript.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <template v-if="home">
    <section
      v-for="(show, i) in home.showcases"
      :key="show.title"
      class="gm-v2-band"
      :aria-labelledby="`gm-showcase-${i}-title`"
    >
      <div class="gm-wrap gm-showcase" :class="{ 'gm-showcase-flip': i % 2 === 1 }">
        <div class="gm-showcase-words">
          <h2 :id="`gm-showcase-${i}-title`">{{ show.title }}</h2>
          <p class="gm-showcase-intro" v-html="inline(show.intro)" />
          <ul class="gm-points">
            <li v-for="point in show.points" :key="point.title">
              <h3>{{ point.title }}</h3>
              <p v-html="inline(point.body)" />
            </li>
          </ul>
          <GuideLink v-if="show.guide" :guide="show.guide" />
        </div>
        <figure class="gm-showcase-media">
          <div class="gm-shot-frame">
            <GmImg :screen="show.screen" />
          </div>
          <Transcript v-if="show.exchange" class="gm-showcase-exchange" :exchange="show.exchange" />
          <figcaption v-if="show.caption">{{ show.caption }}</figcaption>
        </figure>
      </div>
    </section>
  </template>
</template>
