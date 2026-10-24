<script setup lang="ts">
/**
 * A mark on its tile with the name under it, as an application sits on a launcher: an
 * application's or a vendor's mark on a tile tinted with its brand colour (a neutral tile for the
 * black marks), or one of the site's line icons on a neutral tile. An owner's own icon file is
 * shown as it is, with no tile behind it, and as a link to the owner's site when its terms ask for
 * that (data/marks.ts, IMAGE_MARKS). The name is the text; the mark is decorative.
 */
import { computed } from 'vue';
import type { IconName, MarkName, SceneAppMark } from '../data/home-schema';
import { APP_MARK_DATA, IMAGE_MARKS, PROVIDER_MARKS } from '../data/marks';
import AppMark from './AppMark.vue';
import ProviderMark from './ProviderMark.vue';
import VtIcon from './VtIcon.vue';

const props = defineProps<{ name: string; app?: SceneAppMark; provider?: MarkName; icon?: IconName }>();

const image = computed(() => (props.app && props.app in IMAGE_MARKS ? IMAGE_MARKS[props.app as keyof typeof IMAGE_MARKS] : undefined));
const tint = computed(() =>
  image.value
    ? undefined
    : props.app
      ? APP_MARK_DATA[props.app as keyof typeof APP_MARK_DATA].tint
      : props.provider
        ? PROVIDER_MARKS[props.provider].tint
        : undefined,
);
</script>

<template>
  <li class="vt-tile-item">
    <component
      :is="image?.href ? 'a' : 'span'"
      class="vt-tile-body"
      :class="{ 'vt-tile-link': image?.href }"
      :href="image?.href"
      :target="image?.href ? '_blank' : undefined"
      :rel="image?.href ? 'noreferrer' : undefined"
    >
      <span
        class="vt-tile"
        :class="{ 'vt-tile-tinted': tint, 'vt-tile-bare': image }"
        :style="tint ? { '--vt-tile-tint': tint } : undefined"
      >
        <img v-if="image" :src="image.src" width="30" height="30" alt="" decoding="async" />
        <AppMark v-else-if="app" :name="app as keyof typeof APP_MARK_DATA" :size="24" />
        <ProviderMark v-else-if="provider" :name="provider" :size="24" />
        <VtIcon v-else-if="icon" :name="icon" :size="22" />
      </span>
      <span class="vt-tile-name">{{ name }}</span>
    </component>
  </li>
</template>
