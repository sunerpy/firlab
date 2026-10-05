<script setup lang="ts">
/**
 * The evidence beside a split block: a small table from the home frontmatter whose first
 * column names each row. `code` marks the columns whose cells are code (a route, a model ID,
 * a command). A code cell after the first column wraps between its words and never inside one,
 * so a list of model IDs keeps each ID whole (styles/home.css, `.bg-word`). Under 768 px each row
 * becomes a card, each cell labelled by its column.
 */
import { computed } from 'vue';
import type { ProofName, ProofTable } from '../data/home-schema';
import { useHome } from './useHome';

const props = defineProps<{ name: ProofName }>();
const home = useHome();
// A page writes `proof` as a plain attribute, which no type check sees: a name with no table
// behind it fails the build here, by name, instead of as a read of `undefined`.
const table = computed<ProofTable>(() => {
  const found = home.value[props.name];
  if (!found) throw new Error(`<SplitBlock proof="${props.name}">: the home frontmatter has no such table`);
  return found;
});
const isCode = (column: number) => table.value.code?.includes(column) ?? false;
/** A code cell after the first column, split at its spaces: it may hold a list of model IDs. */
const words = (cell: string) => cell.split(/\s+/).filter(Boolean);
</script>

<template>
  <div class="bg-plate bg-proof">
    <table class="bg-table bg-table-stack">
      <thead>
        <tr>
          <th v-for="column in table.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows" :key="row.cells[0]">
          <template v-for="(cell, i) in row.cells" :key="i">
            <th v-if="i === 0" scope="row">
              <code v-if="isCode(0)" class="bg-mono">{{ cell }}</code>
              <template v-else>{{ cell }}</template>
            </th>
            <td v-else :data-label="table.columns[i]">
              <code v-if="isCode(i)" class="bg-mono"
                ><template v-for="(word, w) in words(cell)" :key="w"
                  >{{ w ? ' ' : '' }}<span class="bg-word">{{ word }}</span></template
                ></code
              >
              <template v-else>{{ cell }}</template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <p v-if="table.caption" class="bg-plate-caption">{{ table.caption }}</p>
  </div>
</template>
