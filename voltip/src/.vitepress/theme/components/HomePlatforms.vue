<script setup lang="ts">
/** Platform by platform: what ships, and what works where. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="vt-band vt-platforms" aria-labelledby="vt-platforms-title">
    <h2 id="vt-platforms-title" class="vt-band-title">{{ home.platforms.title }}</h2>
    <p v-if="home.platforms.intro" class="vt-band-intro">{{ home.platforms.intro }}</p>
    <div class="vt-plate">
      <table class="vt-table vt-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.platforms.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.platforms.rows" :key="row.name">
            <th scope="row">
              <span class="vt-platform-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.platforms.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.platforms.note" class="vt-band-note">{{ home.platforms.note }}</p>
  </section>
</template>
