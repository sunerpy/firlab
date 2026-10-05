<script setup lang="ts">
/** What stays on the machine kiro-provider runs on, and what each kind of traffic sends upstream. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="kp-band kp-privacy" aria-labelledby="kp-privacy-title">
    <h2 id="kp-privacy-title" class="kp-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="kp-band-intro">{{ home.privacy.intro }}</p>
    <div class="kp-privacy-grid">
      <article v-for="mode in home.privacy.modes" :key="mode.name" class="kp-privacy-mode">
        <h3 class="kp-privacy-name">{{ mode.name }}</h3>
        <p class="kp-privacy-sends">
          <span class="kp-privacy-label">{{ home.privacy.sendsLabel }}</span>
          <span class="kp-privacy-value">{{ mode.sends }}</span>
        </p>
        <p class="kp-privacy-detail">{{ mode.detail }}</p>
      </article>
    </div>
  </section>
</template>
