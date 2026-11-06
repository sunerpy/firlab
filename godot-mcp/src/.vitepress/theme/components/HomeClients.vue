<script setup lang="ts">
/**
 * One command in any MCP client (`home.clients`): a row per client, its mark on a neutral tile
 * (data/marks.ts; a terminal icon for a client named in words), its name leading to its section
 * of the guide, and the one command that registers godot-mcp, or a note on where its
 * configuration goes. Under the rows, the clients the band does not list.
 */
import GmIcon from './GmIcon.vue';
import GmMark from './GmMark.vue';
import GuideLink from './GuideLink.vue';
import { codeTokens, inline } from './inline';
import { away, href } from './links';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="gm-v2-band" aria-labelledby="gm-clients-title">
    <div class="gm-wrap">
      <header class="gm-sec-head">
        <h2 id="gm-clients-title">{{ home.clients.title }}</h2>
        <p v-if="home.clients.intro" v-html="inline(home.clients.intro)" />
      </header>
      <ul class="gm-clients">
        <li v-for="client in home.clients.items" :key="client.name" class="gm-client">
          <span class="gm-tile">
            <GmMark v-if="client.mark" :name="client.mark" />
            <GmIcon v-else name="square-terminal" :size="22" />
          </span>
          <h3 class="gm-client-name">
            <a :href="href(client.link)" v-bind="away(client.link)">{{ client.name }}</a>
          </h3>
          <pre v-if="client.command" class="gm-code-line gm-client-command" tabindex="0"><code v-html="codeTokens(client.command)" /></pre>
          <p v-else-if="client.note" class="gm-client-note" v-html="inline(client.note)" />
        </li>
      </ul>
      <p class="gm-footnote" v-html="inline(home.clients.more)" />
      <GuideLink v-if="home.clients.guide" :guide="home.clients.guide" />
    </div>
  </section>
</template>
