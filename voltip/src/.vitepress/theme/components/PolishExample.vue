<script setup lang="ts">
/** What was heard, and what was typed after the dictionary, AI polish and the rules. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="vt-plate vt-polish">
    <div class="vt-polish-row">
      <p class="vt-polish-label">{{ home.polish.heardLabel }}</p>
      <p class="vt-polish-text vt-polish-heard">{{ home.polish.heard }}</p>
    </div>
    <div class="vt-polish-arrow" aria-hidden="true">↓</div>
    <div class="vt-polish-row">
      <p class="vt-polish-label">{{ home.polish.typedLabel }}</p>
      <p class="vt-polish-text vt-polish-typed">{{ home.polish.typed }}</p>
    </div>
    <p v-if="home.polish.caption" class="vt-plate-caption">{{ home.polish.caption }}</p>
  </div>
</template>
