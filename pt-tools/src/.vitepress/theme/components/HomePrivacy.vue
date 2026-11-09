<script setup lang="ts">
/**
 * What leaves the server pt-tools runs on, destination by destination. The 2026-11 layout draws one
 * ledger, a row per destination with an arrow to what it is sent (after godot-mcp's HomePrivacy);
 * the 2026-09 layout a grid of cards inside the page's `.vp-doc`.
 */
import PtIcon from './PtIcon.vue';
import { inline } from './inline';
import { useHome, useHomeV2 } from './useHome';

const home = useHome();
const v2 = useHomeV2();
</script>

<template>
  <section v-if="v2" class="pt-v2-band" aria-labelledby="pt-privacy-title">
    <div class="pt-wrap">
      <header class="pt-sec-head">
        <h2 id="pt-privacy-title">{{ v2.privacy.title }}</h2>
        <p v-if="v2.privacy.intro" v-html="inline(v2.privacy.intro)" />
      </header>
      <ul class="pt-ledger">
        <li v-for="mode in v2.privacy.modes" :key="mode.name" class="pt-ledger-row">
          <h3 class="pt-ledger-name">{{ mode.name }}</h3>
          <span class="pt-ledger-arrow" aria-hidden="true"><PtIcon name="arrow-right" :size="16" /></span>
          <div class="pt-ledger-result">
            <p class="pt-ledger-sends">
              <span class="pt-tag">{{ v2.privacy.sendsLabel }}</span>
              <span class="pt-ledger-value">{{ mode.sends }}</span>
            </p>
            <p class="pt-ledger-detail" v-html="inline(mode.detail)" />
          </div>
        </li>
      </ul>
    </div>
  </section>

  <section v-else class="pt-band pt-privacy" aria-labelledby="pt-privacy-title">
    <h2 id="pt-privacy-title" class="pt-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="pt-band-intro">{{ home.privacy.intro }}</p>
    <div class="pt-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="pt-privacy-mode">
        <h3 class="pt-privacy-name">{{ mode.name }}</h3>
        <p class="pt-privacy-sends">
          <span class="pt-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="pt-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="pt-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
