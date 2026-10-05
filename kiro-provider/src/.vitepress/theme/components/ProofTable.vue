<script setup lang="ts">
/**
 * The evidence beside a split block: a small table from the home frontmatter whose first
 * column names each row. `code` marks the columns whose cells are code (a route, a command,
 * a tool type). Under 640 px each row becomes a card, each cell labelled by its column.
 */
import { computed } from 'vue';
import type { ProofTable } from '../data/home-schema';
import { useHome } from './useHome';

const props = defineProps<{ name: 'protocols' | 'clients' | 'search' }>();
const home = useHome();
const table = computed<ProofTable>(() => home.value[props.name]);
const isCode = (column: number) => table.value.code?.includes(column) ?? false;
</script>

<template>
  <div class="kp-plate kp-proof">
    <table class="kp-table kp-table-stack">
      <thead>
        <tr>
          <th v-for="column in table.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows" :key="row.cells[0]">
          <template v-for="(cell, i) in row.cells" :key="i">
            <th v-if="i === 0" scope="row">
              <code v-if="isCode(0)" class="kp-mono">{{ cell }}</code>
              <template v-else>{{ cell }}</template>
            </th>
            <td v-else :data-label="table.columns[i]">
              <code v-if="isCode(i)" class="kp-mono">{{ cell }}</code>
              <template v-else>{{ cell }}</template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <p v-if="table.caption" class="kp-plate-caption">{{ table.caption }}</p>
  </div>
</template>
