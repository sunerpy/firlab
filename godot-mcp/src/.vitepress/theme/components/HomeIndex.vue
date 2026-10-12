<script setup lang="ts">
/** Everything godot-mcp does, on one screen: groups of short rows, each with what it needs. */
import { withBase } from 'vitepress';
import StatusTag from './StatusTag.vue';
import { useHome } from './useHome';

const home = useHome();
const isExternal = (link: string) => /^https?:/.test(link);
</script>

<template>
  <section class="gm-band gm-index" aria-labelledby="gm-index-title">
    <h2 id="gm-index-title" class="gm-band-title">{{ home.index.title }}</h2>
    <p v-if="home.index.intro" class="gm-band-intro">{{ home.index.intro }}</p>
    <div class="gm-index-grid">
      <section v-for="group in home.index.groups" :key="group.name" class="gm-index-group">
        <h3 class="gm-index-name">{{ group.name }}</h3>
        <ul class="gm-index-list">
          <li v-for="item in group.items" :key="item.title" class="gm-index-item">
            <div class="gm-index-head">
              <a
                v-if="item.link"
                class="gm-index-title"
                :href="isExternal(item.link) ? item.link : withBase(item.link)"
                >{{ item.title }}</a
              >
              <span v-else class="gm-index-title">{{ item.title }}</span>
              <StatusTag :status="item.status" />
            </div>
            <p class="gm-index-body">{{ item.body }}</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
