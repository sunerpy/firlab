<script setup lang="ts">
/** What kiro-provider deliberately does not do, on a dashed plate. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="kp-band kp-scope" aria-labelledby="kp-scope-title">
    <div class="kp-scope-plate">
      <h2 id="kp-scope-title" class="kp-scope-title">{{ home.scope.title }}</h2>
      <p v-if="home.scope.intro" class="kp-band-intro">{{ home.scope.intro }}</p>
      <ul class="kp-scope-list">
        <li v-for="item in home.scope.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
