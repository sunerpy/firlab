<script setup lang="ts">
/** What CodeGraph deliberately does not do, on a dashed plate. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="cg-band cg-scope" aria-labelledby="cg-scope-title">
    <div class="cg-scope-plate">
      <h2 id="cg-scope-title" class="cg-scope-title">{{ home.scope.title }}</h2>
      <p v-if="home.scope.intro" class="cg-band-intro">{{ home.scope.intro }}</p>
      <ul class="cg-scope-list">
        <li v-for="item in home.scope.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
