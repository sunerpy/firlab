<script setup lang="ts">
/** What is kept where, and what goes online: nothing. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="lk-band lk-privacy" aria-labelledby="lk-privacy-title">
    <h2 id="lk-privacy-title" class="lk-band-title">{{ home.privacy.title }}</h2>
    <p v-if="home.privacy.intro" class="lk-band-intro">{{ home.privacy.intro }}</p>
    <div class="lk-privacy-grid">
      <article v-for="item in home.privacy.items" :key="item.name" class="lk-privacy-item">
        <h3 class="lk-privacy-name">{{ item.name }}</h3>
        <p class="lk-privacy-where">
          <span class="lk-privacy-label">{{ home.privacy.label }}</span>
          <span class="lk-privacy-value">{{ item.value }}</span>
        </p>
        <p class="lk-privacy-detail">{{ item.detail }}</p>
      </article>
    </div>
  </section>
</template>
