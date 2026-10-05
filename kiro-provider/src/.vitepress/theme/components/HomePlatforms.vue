<script setup lang="ts">
/** The platforms every release ships an archive for. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="kp-band kp-platforms" aria-labelledby="kp-platforms-title">
    <h2 id="kp-platforms-title" class="kp-band-title">{{ home.platforms.title }}</h2>
    <p v-if="home.platforms.intro" class="kp-band-intro">{{ home.platforms.intro }}</p>
    <div class="kp-plate">
      <table class="kp-table kp-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.platforms.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.platforms.rows" :key="row.name">
            <th scope="row">
              <span class="kp-platforms-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.platforms.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.platforms.note" class="kp-band-note">{{ home.platforms.note }}</p>
  </section>
</template>
