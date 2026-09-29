<script setup lang="ts">
/** What is being built next, and what Voltip deliberately does not do. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="vt-band vt-roadmap" aria-labelledby="vt-roadmap-title">
    <h2 id="vt-roadmap-title" class="vt-band-title">{{ home.roadmap.title }}</h2>
    <p v-if="home.roadmap.intro" class="vt-band-intro">{{ home.roadmap.intro }}</p>
    <ol class="vt-roadmap-list">
      <li v-for="item in home.roadmap.items" :key="item.title" class="vt-roadmap-item">
        <div class="vt-index-head">
          <h3 class="vt-roadmap-title">{{ item.title }}</h3>
          <StatusTag :status="item.status" />
        </div>
        <p class="vt-roadmap-body">{{ item.body }}</p>
      </li>
    </ol>
    <div class="vt-roadmap-not">
      <h3 class="vt-roadmap-not-title">{{ home.roadmap.notPlanned.title }}</h3>
      <ul>
        <li v-for="item in home.roadmap.notPlanned.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
