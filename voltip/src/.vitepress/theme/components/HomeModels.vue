<script setup lang="ts">
/** The local models, as a spec table. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="vt-plate vt-models">
    <table class="vt-table">
      <thead>
        <tr>
          <th v-for="column in home.models.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in home.models.rows" :key="row.name">
          <th scope="row">
            <span class="vt-models-name">{{ row.name }}</span>
            <span v-if="row.note" class="vt-models-note">{{ row.note }}</span>
          </th>
          <td :data-label="home.models.columns[1]" class="vt-mono">{{ row.size }}</td>
          <td :data-label="home.models.columns[2]">{{ row.languages }}</td>
          <td :data-label="home.models.columns[3]">{{ row.device }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="home.models.caption" class="vt-plate-caption">{{ home.models.caption }}</p>
  </div>
</template>
