<script setup lang="ts">
/** What leaves the server pt-tools runs on, destination by destination. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="pt-band pt-privacy" aria-labelledby="pt-privacy-title">
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
