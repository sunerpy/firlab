<script setup lang="ts">
/** The line that leads from a band or an answer to the guide page covering it (`Guide`). */
import type { Guide } from '../data/home-schema';
import GmIcon from './GmIcon.vue';
import { away, href } from './links';

defineProps<{ guide: Guide }>();
</script>

<template>
  <p class="gm-guide">
    <a :href="href(guide.link)" v-bind="away(guide.link)">{{ guide.text }}<GmIcon name="arrow-right" :size="16" /></a>
  </p>
</template>
