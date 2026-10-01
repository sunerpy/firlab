<script setup lang="ts">
/** Commands a bound chat account can send: the proof beside the ChatOps block. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="pt-plate pt-commands">
    <dl class="pt-command-list">
      <div v-for="item in home.commands.items" :key="item.command" class="pt-command">
        <dt><code class="pt-mono">{{ item.command }}</code></dt>
        <dd>{{ item.body }}</dd>
      </div>
    </dl>
    <p v-if="home.commands.caption" class="pt-plate-caption">{{ home.commands.caption }}</p>
  </div>
</template>
