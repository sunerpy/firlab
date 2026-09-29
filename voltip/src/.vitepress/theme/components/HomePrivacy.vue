<script setup lang="ts">
/** What leaves the computer, mode by mode. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="vt-band vt-privacy" aria-labelledby="vt-privacy-title">
    <h2 id="vt-privacy-title" class="vt-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="vt-band-intro">{{ home.privacy.intro }}</p>
    <div class="vt-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="vt-privacy-mode">
        <h3 class="vt-privacy-name">{{ mode.name }}</h3>
        <p class="vt-privacy-sends">
          <span class="vt-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="vt-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="vt-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
