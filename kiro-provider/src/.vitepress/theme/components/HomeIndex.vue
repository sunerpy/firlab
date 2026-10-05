<script setup lang="ts">
/** Everything kiro-provider does, on one screen: groups of short rows, each with its release state. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="kp-band kp-index" aria-labelledby="kp-index-title">
    <h2 id="kp-index-title" class="kp-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="kp-band-intro">{{ home.index.intro }}</p>
    <div class="kp-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="kp-index-group">
        <h3 class="kp-index-name">{{ group.name }}</h3>
        <ul class="kp-index-list">
          <li v-for="item in group.items" :key="item.title" class="kp-index-item">
            <div class="kp-index-head">
              <a
                v-if="item.link"
                class="kp-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="kp-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="kp-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
