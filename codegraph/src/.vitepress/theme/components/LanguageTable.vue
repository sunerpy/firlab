<script setup lang="ts">
/** Extraction depth by language: the proof beside the language block. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="cg-plate cg-languages">
    <table class="cg-table cg-table-stack">
      <thead>
        <tr>
          <th v-for="column in home.languages.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in home.languages.rows" :key="row.depth">
          <th scope="row">{{ row.depth }}</th>
          <td :data-label="home.languages.columns[1]">{{ row.extracted }}</td>
          <td :data-label="home.languages.columns[2]" class="cg-languages-members">{{ row.members }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="home.languages.caption" class="cg-plate-caption">{{ home.languages.caption }}</p>
  </div>
</template>
