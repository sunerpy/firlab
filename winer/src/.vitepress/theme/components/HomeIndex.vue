<script setup lang="ts">
/** Everything winer does, on one screen: groups of short rows, each with its maturity. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="wn-band wn-index" aria-labelledby="wn-index-title">
    <h2 id="wn-index-title" class="wn-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="wn-band-intro">{{ home.index.intro }}</p>
    <div class="wn-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="wn-index-group">
        <h3 class="wn-index-name">{{ group.name }}</h3>
        <ul class="wn-index-list">
          <li v-for="item in group.items" :key="item.title" class="wn-index-item">
            <div class="wn-index-head">
              <a
                v-if="item.link"
                class="wn-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="wn-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="wn-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
