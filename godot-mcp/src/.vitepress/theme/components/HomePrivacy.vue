<script setup lang="ts">
/** Where each kind of traffic goes: the client and the server, the loopback listener, the identity provider, the engine. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="gm-band gm-privacy" aria-labelledby="gm-privacy-title">
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
