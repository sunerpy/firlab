<script setup lang="ts">
/** The platforms every release ships an archive for, and what each one runs. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="gm-band gm-platforms" aria-labelledby="gm-platforms-title">
    <h2 id="gm-platforms-title" class="gm-band-title">{{ home.platforms.title }}</h2>
    <p v-if="home.platforms.intro" class="gm-band-intro">{{ home.platforms.intro }}</p>
    <div class="gm-plate">
      <table class="gm-table gm-table-stack">
        <thead>
          <tr>
            <th v-for="column in home.platforms.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in home.platforms.rows" :key="row.name">
            <th scope="row">
              <span class="gm-platforms-name">{{ row.name }}</span>
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="home.platforms.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="home.platforms.note" class="gm-band-note">{{ home.platforms.note }}</p>
  </section>
</template>
