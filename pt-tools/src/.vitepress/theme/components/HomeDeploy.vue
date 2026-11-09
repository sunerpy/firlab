<script setup lang="ts">
/**
 * Ways to run pt-tools: what ships for which system, and where the data lives. The 2026-11 layout
 * draws the ways as one strip, each with its architecture, where to get it and its data directory,
 * then the page's own Markdown (the install commands) in a card of its own, given `.vp-doc` back so
 * the code group keeps VitePress's tabs and copy button, with the note under it (after godot-mcp's
 * HomeEngine). The 2026-09 layout draws a table inside the page's `.vp-doc`.
 */
import { useSlots } from 'vue';
import GuideLink from './GuideLink.vue';
import StatusTag from './StatusTag.vue';
import { inline } from './inline';
import { useHome, useHomeV2 } from './useHome';

const home = useHome();
const v2 = useHomeV2();
const slots = useSlots();
</script>

<template>
  <section v-if="v2" class="pt-v2-band" aria-labelledby="pt-deploy-title">
    <div class="pt-wrap">
      <header class="pt-sec-head">
        <h2 id="pt-deploy-title">{{ v2.deploy.title }}</h2>
        <p v-if="v2.deploy.intro" v-html="inline(v2.deploy.intro)" />
      </header>
      <ul class="pt-ways">
        <li v-for="row in v2.deploy.rows" :key="row.name" class="pt-way">
          <div class="pt-way-head">
            <h3>{{ row.name }}</h3>
            <StatusTag :status="row.status" />
          </div>
          <dl class="pt-way-facts">
            <div v-for="(cell, i) in row.cells" :key="i">
              <dt class="pt-tag">{{ v2.deploy.columns[i + 1] }}</dt>
              <dd v-html="inline(cell)" />
            </div>
          </dl>
        </li>
      </ul>
      <div v-if="slots.default" class="pt-card pt-install">
        <div class="vp-doc"><slot /></div>
        <div v-if="v2.deploy.note || v2.deploy.guide" class="pt-install-note">
          <p v-if="v2.deploy.note" v-html="inline(v2.deploy.note)" />
          <GuideLink v-if="v2.deploy.guide" :guide="v2.deploy.guide" />
        </div>
      </div>
      <template v-else>
        <p v-if="v2.deploy.note" class="pt-footnote" v-html="inline(v2.deploy.note)" />
        <GuideLink v-if="v2.deploy.guide" :guide="v2.deploy.guide" />
      </template>
    </div>
  </section>

  <section v-else class="pt-band pt-deploy" aria-labelledby="pt-deploy-title">
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
