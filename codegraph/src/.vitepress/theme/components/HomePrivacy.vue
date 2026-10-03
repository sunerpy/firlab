<script setup lang="ts">
/** What stays on the machine CodeGraph runs on, and the one thing that goes online. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="cg-band cg-privacy" aria-labelledby="cg-privacy-title">
    <h2 id="cg-privacy-title" class="cg-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="cg-band-intro">{{ home.privacy.intro }}</p>
    <div class="cg-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="cg-privacy-mode">
        <h3 class="cg-privacy-name">{{ mode.name }}</h3>
        <p class="cg-privacy-sends">
          <span class="cg-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="cg-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="cg-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
