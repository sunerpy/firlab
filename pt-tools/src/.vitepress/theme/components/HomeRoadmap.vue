<script setup lang="ts">
/** What is being built next, and what pt-tools deliberately does not do. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="pt-band pt-roadmap" aria-labelledby="pt-roadmap-title">
    <h2 id="pt-roadmap-title" class="pt-band-title">{{ home.roadmap.title }}</h2>
    <p v-if="home.roadmap.intro" class="pt-band-intro">{{ home.roadmap.intro }}</p>
    <ol class="pt-roadmap-list">
      <li v-for="item in home.roadmap.items" :key="item.title" class="pt-roadmap-item">
        <div class="pt-index-head">
          <h3 class="pt-roadmap-title">{{ item.title }}</h3>
          <StatusTag :status="item.status" />
        </div>
        <p class="pt-roadmap-body">{{ item.body }}</p>
      </li>
    </ol>
    <div class="pt-roadmap-not">
      <h3 class="pt-roadmap-not-title">{{ home.roadmap.notPlanned.title }}</h3>
      <ul>
        <li v-for="item in home.roadmap.notPlanned.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
