<script setup lang="ts">
/** What Lockra deliberately leaves out. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="lk-band lk-scope" aria-labelledby="lk-scope-title">
    <h2 id="lk-scope-title" class="lk-band-title">{{ home.scope.title }}</h2>
    <p v-if="home.scope.intro" class="lk-band-intro">{{ home.scope.intro }}</p>
    <ul class="lk-scope-list">
      <li v-for="item in home.scope.items" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
