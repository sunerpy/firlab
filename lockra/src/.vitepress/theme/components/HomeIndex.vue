<script setup lang="ts">
/** Everything Lockra does, on one screen: four groups of short rows, each with its maturity. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="lk-band lk-index" aria-labelledby="lk-index-title">
    <h2 id="lk-index-title" class="lk-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="lk-band-intro">{{ home.index.intro }}</p>
    <div class="lk-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="lk-index-group">
        <h3 class="lk-index-name">{{ group.name }}</h3>
        <ul class="lk-index-list">
          <li v-for="item in group.items" :key="item.title" class="lk-index-item">
            <div class="lk-index-head">
              <a
                v-if="item.link"
                class="lk-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="lk-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="lk-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
