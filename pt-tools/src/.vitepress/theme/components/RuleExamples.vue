<script setup lang="ts">
/** What a filter rule says and which titles it matches: the proof beside the RSS block. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="pt-plate pt-rules">
    <table class="pt-table">
      <thead>
        <tr>
          <th v-for="column in home.rules.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in home.rules.rows" :key="row.pattern">
          <th scope="row"><code class="pt-mono">{{ row.pattern }}</code></th>
          <td :data-label="home.rules.columns[1]">{{ row.kind }}</td>
          <td :data-label="home.rules.columns[2]">{{ row.matches }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="home.rules.caption" class="pt-plate-caption">{{ home.rules.caption }}</p>
  </div>
</template>
