<script setup lang="ts">
/** What bedrock-gateway deliberately does not do, on a dashed plate. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="bg-band bg-scope" aria-labelledby="bg-scope-title">
    <div class="bg-scope-plate">
      <h2 id="bg-scope-title" class="bg-scope-title">{{ home.scope.title }}</h2>
      <p v-if="home.scope.intro" class="bg-band-intro">{{ home.scope.intro }}</p>
      <ul class="bg-scope-list">
        <li v-for="item in home.scope.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
