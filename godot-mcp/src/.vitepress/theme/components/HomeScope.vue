<script setup lang="ts">
/** What godot-mcp deliberately does not do, on a dashed plate. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <section class="gm-band gm-scope" aria-labelledby="gm-scope-title">
    <div class="gm-scope-plate">
      <h2 id="gm-scope-title" class="gm-scope-title">{{ home.scope.title }}</h2>
      <p v-if="home.scope.intro" class="gm-band-intro">{{ home.scope.intro }}</p>
      <ul class="gm-scope-list">
        <li v-for="item in home.scope.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
