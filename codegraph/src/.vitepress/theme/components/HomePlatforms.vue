<script setup lang="ts">
/** The platforms every release ships an archive for. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="cg-band cg-platforms" aria-labelledby="cg-platforms-title">
    <h2 id="cg-platforms-title" class="cg-band-title">{{ home.platforms.title }}</h2>
    <p v-if="home.platforms.intro" class="cg-band-intro">{{ home.platforms.intro }}</p>
    <div class="cg-plate">
      <table class="cg-table cg-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.platforms.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.platforms.rows" :key="row.name">
            <th scope="row">
              <span class="cg-platforms-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.platforms.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.platforms.note" class="cg-band-note">{{ home.platforms.note }}</p>
  </section>
</template>
