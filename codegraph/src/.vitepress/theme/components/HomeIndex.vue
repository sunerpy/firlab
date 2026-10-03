<script setup lang="ts">
/** Everything CodeGraph does, on one screen: groups of short rows, each with its release state. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="cg-band cg-index" aria-labelledby="cg-index-title">
    <h2 id="cg-index-title" class="cg-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="cg-band-intro">{{ home.index.intro }}</p>
    <div class="cg-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="cg-index-group">
        <h3 class="cg-index-name">{{ group.name }}</h3>
        <ul class="cg-index-list">
          <li v-for="item in group.items" :key="item.title" class="cg-index-item">
            <div class="cg-index-head">
              <a
                v-if="item.link"
                class="cg-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="cg-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="cg-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
