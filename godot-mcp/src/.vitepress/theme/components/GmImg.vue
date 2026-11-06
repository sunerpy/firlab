<script setup lang="ts">
/**
 * One screenshot of the home page's frontmatter (`Screen`): a single file for both themes, or a
 * pair where `dark` is the same view in the dark theme and only the one matching the site shows
 * (base.css, `.gm-only-*`). Attributes such as `class` go on each image.
 */
import { withBase } from 'vitepress';
import type { Screen } from '../data/home-schema';

defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ screen: Screen; loading?: 'lazy' | 'eager' }>(), { loading: 'lazy' });
</script>

<template>
  <template v-if="screen.dark">
    <img
      v-bind="$attrs"
      class="gm-only-light"
      :src="withBase(screen.src)"
      :width="screen.width"
      :height="screen.height"
      :alt="screen.alt"
      :loading="loading"
      decoding="async"
    />
    <img
      v-bind="$attrs"
      class="gm-only-dark"
      :src="withBase(screen.dark)"
      :width="screen.width"
      :height="screen.height"
      :alt="screen.alt"
      :loading="loading"
      decoding="async"
    />
  </template>
  <img
    v-else
    v-bind="$attrs"
    :src="withBase(screen.src)"
    :width="screen.width"
    :height="screen.height"
    :alt="screen.alt"
    :loading="loading"
    decoding="async"
  />
</template>
