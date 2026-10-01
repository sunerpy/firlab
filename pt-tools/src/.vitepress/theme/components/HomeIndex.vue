<script setup lang="ts">
/** Everything pt-tools does, on one screen: groups of short rows, each with its maturity. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="pt-band pt-index" aria-labelledby="pt-index-title">
    <h2 id="pt-index-title" class="pt-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="pt-band-intro">{{ home.index.intro }}</p>
    <div class="pt-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="pt-index-group">
        <h3 class="pt-index-name">{{ group.name }}</h3>
        <ul class="pt-index-list">
          <li v-for="item in group.items" :key="item.title" class="pt-index-item">
            <div class="pt-index-head">
              <a
                v-if="item.link"
                class="pt-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="pt-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="pt-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
