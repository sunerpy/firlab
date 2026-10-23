<script setup lang="ts">
/**
 * A mark on its tile with the name under it, as an application sits on a launcher: an
 * application's or a vendor's mark on a tile tinted with its brand colour (a neutral tile for the
 * black marks), or one of the site's line icons on a neutral tile. The name is the text; the
 * mark is decorative.
 */
import { computed } from 'vue';
import type { AppMarkName, IconName, MarkName } from '../data/home-schema';
import { APP_MARK_DATA, PROVIDER_MARKS } from '../data/marks';
import AppMark from './AppMark.vue';
import ProviderMark from './ProviderMark.vue';
import VtIcon from './VtIcon.vue';

const props = defineProps<{ name: string; app?: AppMarkName; provider?: MarkName; icon?: IconName }>();

const tint = computed(() =>
  props.app ? APP_MARK_DATA[props.app].tint : props.provider ? PROVIDER_MARKS[props.provider].tint : undefined,
);
</script>

<template>
  <li class="vt-tile-item">
    <span class="vt-tile" :class="{ 'vt-tile-tinted': tint }" :style="tint ? { '--vt-tile-tint': tint } : undefined">
      <AppMark v-if="app" :name="app" :size="24" />
      <ProviderMark v-else-if="provider" :name="provider" :size="24" />
      <VtIcon v-else-if="icon" :name="icon" :size="22" />
    </span>
    <span class="vt-tile-name">{{ name }}</span>
  </li>
</template>
