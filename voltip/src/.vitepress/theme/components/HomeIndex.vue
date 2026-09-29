<script setup lang="ts">
/** Everything Voltip does, on one screen: four groups of short rows, each with its maturity. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="vt-band vt-index" aria-labelledby="vt-index-title">
    <h2 id="vt-index-title" class="vt-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="vt-band-intro">{{ home.index.intro }}</p>
    <div class="vt-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="vt-index-group">
        <h3 class="vt-index-name">{{ group.name }}</h3>
        <ul class="vt-index-list">
          <li v-for="item in group.items" :key="item.title" class="vt-index-item">
            <div class="vt-index-head">
              <a
                v-if="item.link"
                class="vt-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="vt-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="vt-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
