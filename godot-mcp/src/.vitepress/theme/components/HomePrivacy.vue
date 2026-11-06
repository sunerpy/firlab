<script setup lang="ts">
/**
 * Where each kind of traffic goes: the client and the server, the loopback listener, the engine,
 * the logs and captures. The 2026-11 layout draws one ledger, a row per kind with an arrow to where
 * it goes; the 2026-09 layout a grid of cards inside the page's `.vp-doc`.
 */
import GmIcon from './GmIcon.vue';
import { inline } from './inline';
import { useHome, useHomeV2 } from './useHome';

const home = useHome();
const v2 = useHomeV2();
</script>

<template>
  <section v-if="v2" class="gm-v2-band" aria-labelledby="gm-privacy-title">
    <div class="gm-wrap">
      <header class="gm-sec-head">
        <h2 id="gm-privacy-title">{{ v2.privacy.title }}</h2>
        <p v-if="v2.privacy.intro" v-html="inline(v2.privacy.intro)" />
      </header>
      <ul class="gm-ledger">
        <li v-for="mode in v2.privacy.modes" :key="mode.name" class="gm-ledger-row">
          <h3 class="gm-ledger-name">{{ mode.name }}</h3>
          <span class="gm-ledger-arrow" aria-hidden="true"><GmIcon name="arrow-right" :size="16" /></span>
          <div class="gm-ledger-result">
            <p class="gm-ledger-sends">
              <span class="gm-tag">{{ v2.privacy.sendsLabel }}</span>
              <span class="gm-ledger-value">{{ mode.sends }}</span>
            </p>
            <p class="gm-ledger-detail" v-html="inline(mode.detail)" />
          </div>
        </li>
      </ul>
    </div>
  </section>

  <section v-else class="gm-band gm-privacy" aria-labelledby="gm-privacy-title">
    <h2 id="gm-privacy-title" class="gm-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="gm-band-intro">{{ home.privacy.intro }}</p>
    <div class="gm-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="gm-privacy-mode">
        <h3 class="gm-privacy-name">{{ mode.name }}</h3>
        <p class="gm-privacy-sends">
          <span class="gm-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="gm-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="gm-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
