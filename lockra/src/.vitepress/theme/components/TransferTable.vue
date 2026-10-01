<script setup lang="ts">
/** Each app, the way its accounts come into Lockra and the way they go back. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="lk-plate lk-transfer">
    <table class="lk-table lk-table-stack">
      <thead>
        <tr>
          <th v-for="column in home.transfer.columns" :key="column" scope="col">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in home.transfer.rows" :key="row.name">
          <th scope="row">
            <span class="lk-transfer-name">{{ row.name }}</span>
            <span v-if="row.note" class="lk-transfer-note">{{ row.note }}</span>
          </th>
          <td :data-label="home.transfer.columns[1]">{{ row.into }}</td>
          <td :data-label="home.transfer.columns[2]">{{ row.out }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="home.transfer.caption" class="lk-plate-caption">{{ home.transfer.caption }}</p>
  </div>
</template>
