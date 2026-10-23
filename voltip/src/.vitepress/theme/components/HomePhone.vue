<script setup lang="ts">
/**
 * The phone as the computer's microphone and keyboard (`home.phone`): what it does, point by
 * point, beside two captures of the computer's phone page, the smaller one over the corner of the
 * larger. Each capture exists in both themes when `dark` is given.
 */
import { withBase } from 'vitepress';
import VtIcon from './VtIcon.vue';
import VtImg from './VtImg.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-phone-title">
    <div class="vt-wrap vt-split-v2">
      <div class="vt-sec-head">
        <h2 id="vt-phone-title" v-html="inline(home.phone.title)" />
        <p>{{ home.phone.intro }}</p>
        <ul class="vt-items">
          <li v-for="item in home.phone.items" :key="item.title" class="vt-item">
            <span class="vt-item-icon"><VtIcon :name="item.icon" /></span>
            <div>
              <b>{{ item.title }}</b>
              <p>{{ item.body }}</p>
            </div>
          </li>
        </ul>
        <p v-if="home.phone.links" class="vt-links" v-html="inline(home.phone.links, withBase)" />
      </div>
      <figure class="vt-stack">
        <VtImg class="vt-stack-back" :img="home.phone.figure.back" />
        <VtImg class="vt-stack-front" :img="home.phone.figure.front" />
        <figcaption v-if="home.phone.figure.caption">{{ home.phone.figure.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>
