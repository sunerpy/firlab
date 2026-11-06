<script setup lang="ts">
/**
 * How godot-mcp is built (`home.built`): the MCP client, the Rust server beside the project with
 * what it does, and the four things it reaches, each saying whether it needs Godot. Left to right
 * from 1100 px, an arrow between the parts; down the page below that.
 */
import { withBase } from 'vitepress';
import GmIcon from './GmIcon.vue';
import StatusTag from './StatusTag.vue';
import { inline } from './inline';
import { away, href } from './links';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="gm-v2-band" aria-labelledby="gm-built-title">
    <div class="gm-wrap">
      <header class="gm-sec-head">
        <h2 id="gm-built-title">{{ home.built.title }}</h2>
        <p v-if="home.built.intro" v-html="inline(home.built.intro)" />
      </header>
      <div class="gm-arch">
        <div class="gm-arch-node gm-arch-client">
          <span class="gm-tile"><GmIcon name="square-terminal" :size="22" /></span>
          <h3>{{ home.built.client.name }}</h3>
          <p v-html="inline(home.built.client.detail)" />
        </div>
        <span class="gm-arch-to" aria-hidden="true"><GmIcon name="arrow-right" :size="16" /></span>
        <div class="gm-arch-node gm-arch-server">
          <img class="gm-arch-logo" :src="withBase('/godot-mcp-logo.svg')" width="44" height="44" alt="" />
          <h3>{{ home.built.server.name }}</h3>
          <p v-html="inline(home.built.server.detail)" />
          <ul class="gm-list">
            <li v-for="part in home.built.server.parts" :key="part">
              <span class="gm-list-dot" aria-hidden="true" />
              <span v-html="inline(part)" />
            </li>
          </ul>
        </div>
        <span class="gm-arch-to" aria-hidden="true"><GmIcon name="arrow-right" :size="16" /></span>
        <ul class="gm-arch-targets">
          <li v-for="target in home.built.targets" :key="target.name" class="gm-arch-target">
            <div class="gm-arch-target-head">
              <h3>
                <a v-if="target.link" :href="href(target.link)" v-bind="away(target.link)">{{ target.name }}</a>
                <template v-else>{{ target.name }}</template>
              </h3>
              <StatusTag :status="target.status" />
            </div>
            <p v-html="inline(target.detail)" />
          </li>
        </ul>
      </div>
      <p v-if="home.built.note" class="gm-footnote" v-html="inline(home.built.note)" />
    </div>
  </section>
</template>
