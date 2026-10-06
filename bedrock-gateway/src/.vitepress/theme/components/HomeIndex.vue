<script setup lang="ts">
/** Everything bedrock-gateway does, on one screen: groups of short rows, each with its release state. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="bg-band bg-index" aria-labelledby="bg-index-title">
    <h2 id="bg-index-title" class="bg-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="bg-band-intro">{{ home.index.intro }}</p>
    <div class="bg-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="bg-index-group">
        <h3 class="bg-index-name">{{ group.name }}</h3>
        <ul class="bg-index-list">
          <li v-for="item in group.items" :key="item.title" class="bg-index-item">
            <div class="bg-index-head">
              <a
                v-if="item.link"
                class="bg-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="bg-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="bg-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
