<script setup lang="ts">
/** The line that leads from a band or an answer to the guide page covering it (`Guide`). */
import type { Guide } from '../data/home-schema';
import PtIcon from './PtIcon.vue';
import { away, href } from './links';

defineProps<{ guide: Guide }>();
</script>

<template>
  <p class="pt-guide">
    <a :href="href(guide.link)" v-bind="away(guide.link)">{{ guide.text }}<PtIcon name="arrow-right" :size="16" /></a>
  </p>
</template>
