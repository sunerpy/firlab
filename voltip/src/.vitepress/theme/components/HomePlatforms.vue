<script setup lang="ts">
/**
 * Platform by platform: what ships, and what works where. The 2026-09 layout draws `platforms` as
 * a table inside the page's `.vp-doc`; the 2026-10 layout draws one strip with a column per platform, then the
 * page's own Markdown (the install commands) in a card of its own, given `.vp-doc` back so the
 * code group keeps VitePress's tabs and copy button.
 */
import { computed, useSlots } from 'vue';
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { inline } from './inline';
import { useHome, useHomeV2 } from './useHome';

const v1 = useHome();
const v2 = useHomeV2();
const slots = useSlots();
const table = computed(() => (v2.value ? undefined : v1.value.platforms));
</script>

<template>
  <section v-if="v2" class="vt-v2-band" aria-labelledby="vt-platforms-title">
    <div class="vt-wrap">
      <header class="vt-sec-head">
        <h2 id="vt-platforms-title" v-html="inline(v2.platforms.title)" />
        <p v-if="v2.platforms.intro">{{ v2.platforms.intro }}</p>
      </header>
      <ul class="vt-platforms">
        <li v-for="card in v2.platforms.cards" :key="card.name" class="vt-platform">
          <h3>{{ card.name }}</h3>
          <StatusTag :status="card.status" />
          <dl>
            <div v-for="spec in card.specs" :key="spec.term">
              <dt>{{ spec.term }}</dt>
              <dd>{{ spec.text }}</dd>
            </div>
          </dl>
        </li>
      </ul>
      <div v-if="slots.default" class="vt-card vt-install">
        <div class="vp-doc"><slot /></div>
        <p v-if="v2.platforms.install" class="vt-install-note" v-html="inline(v2.platforms.install, withBase)" />
      </div>
      <p v-if="v2.platforms.note" class="vt-band-note-v2">{{ v2.platforms.note }}</p>
    </div>
  </section>

  <section v-else-if="table" class="vt-band vt-platforms-table" aria-labelledby="vt-platforms-title">
    <h2 id="vt-platforms-title" class="vt-band-title">{{ table.title }}</h2>
    <p v-if="table.intro" class="vt-band-intro">{{ table.intro }}</p>
    <div class="vt-plate">
      <table class="vt-table vt-table-stack">
        <thead>
          <tr>
            <th v-for="column in table.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.rows" :key="row.name">
            <th scope="row">
              <span class="vt-platform-name">{{ row.name }}</span>
              <StatusTag :status="row.status" />
            </th>
            <td v-for="(cell, i) in row.cells" :key="i" :data-label="table.columns[i + 1]">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="table.note" class="vt-band-note">{{ table.note }}</p>
  </section>
</template>
