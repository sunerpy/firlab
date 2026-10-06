<script setup lang="ts">
/** Where each kind of traffic goes: Bedrock in the reader's account, the control plane, an image host, a key store. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="bg-band bg-privacy" aria-labelledby="bg-privacy-title">
    <h2 id="bg-privacy-title" class="bg-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="bg-band-intro">{{ home.privacy.intro }}</p>
    <div class="bg-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="bg-privacy-mode">
        <h3 class="bg-privacy-name">{{ mode.name }}</h3>
        <p class="bg-privacy-sends">
          <span class="bg-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="bg-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="bg-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
