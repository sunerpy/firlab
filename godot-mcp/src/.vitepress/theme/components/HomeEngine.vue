<script setup lang="ts">
/**
 * The engine, exactly (`home.engine`): the locked Godot builds as one strip, the platforms every
 * release ships an archive for as another, then the page's own Markdown (the install commands) in a
 * card of its own, given `.vp-doc` back so the code group keeps VitePress's tabs and copy button,
 * with the line about the checksums under it.
 */
import { useSlots } from 'vue';
import GuideLink from './GuideLink.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
const slots = useSlots();
</script>

<template>
  <section v-if="home" class="gm-v2-band" aria-labelledby="gm-engine-title">
    <div class="gm-wrap">
      <header class="gm-sec-head">
        <h2 id="gm-engine-title">{{ home.engine.title }}</h2>
        <p v-if="home.engine.intro" v-html="inline(home.engine.intro)" />
      </header>
      <ul class="gm-versions">
        <li v-for="build in home.engine.versions" :key="build.version" class="gm-version">
          <span class="gm-version-number">{{ build.version }}</span>
          <p v-html="inline(build.detail)" />
        </li>
      </ul>
      <ul class="gm-platforms">
        <li v-for="platform in home.engine.platforms" :key="platform.name" class="gm-platform">
          <h3>{{ platform.name }}</h3>
          <code class="gm-archive">{{ platform.archive }}</code>
          <p v-html="inline(platform.detail)" />
        </li>
      </ul>
      <div v-if="slots.default" class="gm-card gm-install">
        <div class="vp-doc"><slot /></div>
        <div class="gm-install-note">
          <p v-html="inline(home.engine.install)" />
          <GuideLink v-if="home.engine.guide" :guide="home.engine.guide" />
        </div>
      </div>
      <p v-if="home.engine.note" class="gm-footnote" v-html="inline(home.engine.note)" />
    </div>
  </section>
</template>
