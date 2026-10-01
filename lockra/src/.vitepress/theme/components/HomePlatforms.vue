<script setup lang="ts">
/** Platform by platform: what ships, and what works where. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="lk-band lk-platforms" aria-labelledby="lk-platforms-title">
    <h2 id="lk-platforms-title" class="lk-band-title">{{ home.platforms.title }}</h2>
    <p v-if="home.platforms.intro" class="lk-band-intro">{{ home.platforms.intro }}</p>
    <div class="lk-plate">
      <table class="lk-table lk-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.platforms.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.platforms.rows" :key="row.name">
            <th scope="row">
              <span class="lk-platform-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.platforms.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.platforms.note" class="lk-band-note">{{ home.platforms.note }}</p>
  </section>
</template>
