<script setup lang="ts">
/** Where winer connects, destination by destination, and what it sends there. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="wn-band wn-privacy" aria-labelledby="wn-privacy-title">
    <h2 id="wn-privacy-title" class="wn-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="wn-band-intro">{{ home.privacy.intro }}</p>
    <div class="wn-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="wn-privacy-mode">
        <h3 class="wn-privacy-name">{{ mode.name }}</h3>
        <p class="wn-privacy-sends">
          <span class="wn-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="wn-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="wn-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
