<script setup lang="ts">
/** The platforms every release ships a binary or an image for. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="bg-band bg-platforms" aria-labelledby="bg-platforms-title">
    <h2 id="bg-platforms-title" class="bg-band-title">{{ home.platforms.title }}</h2>
    <p v-if="home.platforms.intro" class="bg-band-intro">{{ home.platforms.intro }}</p>
    <div class="bg-plate">
      <table class="bg-table bg-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.platforms.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.platforms.rows" :key="row.name">
            <th scope="row">
              <span class="bg-platforms-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.platforms.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.platforms.note" class="bg-band-note">{{ home.platforms.note }}</p>
  </section>
</template>
