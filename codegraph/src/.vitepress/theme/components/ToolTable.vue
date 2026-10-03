<script setup lang="ts">
/** The same question on the command line and as an MCP tool: the proof beside the agent block. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="cg-plate cg-tools">
    <table class="cg-table">
      <thead>
        <tr>
          <th v-for="column in home.tools.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in home.tools.rows" :key="row.question">
          <th scope="row">{{ row.question }}</th>
          <td :data-label="home.tools.columns[1]"><code class="cg-mono">{{ row.cli }}</code></td>
          <td :data-label="home.tools.columns[2]"><code class="cg-mono">{{ row.mcp }}</code></td>
        </tr>
      </tbody>
    </table>
    <p v-if="home.tools.caption" class="cg-plate-caption">{{ home.tools.caption }}</p>
  </div>
</template>
