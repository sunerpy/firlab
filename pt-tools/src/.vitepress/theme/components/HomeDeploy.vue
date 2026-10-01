<script setup lang="ts">
/** Ways to run pt-tools: what ships for which system, and where the data lives. */
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="pt-band pt-deploy" aria-labelledby="pt-deploy-title">
    <h2 id="pt-deploy-title" class="pt-band-title">{{ home.deploy.title }}</h2>
    <p v-if="home.deploy.intro" class="pt-band-intro">{{ home.deploy.intro }}</p>
    <div class="pt-plate">
      <table class="pt-table pt-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.deploy.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.deploy.rows" :key="row.name">
            <th scope="row">
              <span class="pt-deploy-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.deploy.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.deploy.note" class="pt-band-note">{{ home.deploy.note }}</p>
  </section>
</template>
