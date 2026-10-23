<script setup lang="ts">
/**
 * One image of the home page's frontmatter (`Img`): a single file for both themes, or a pair
 * where `dark` is the same view in the dark theme and only the one matching the site shows
 * (base.css, `.vt-only-*`). Attributes such as `class` go on each image.
 */
import { withBase } from 'vitepress';
import type { Img } from '../data/home-schema';

defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ img: Img; loading?: 'lazy' | 'eager' }>(), { loading: 'lazy' });
</script>

<template>
  <template v-if="img.dark">
    <img
      v-bind="$attrs"
      class="vt-only-light"
      :src="withBase(img.src)"
      :width="img.width"
      :height="img.height"
      :alt="img.alt"
      :loading="loading"
      decoding="async"
    />
    <img
      v-bind="$attrs"
      class="vt-only-dark"
      :src="withBase(img.dark)"
      :width="img.width"
      :height="img.height"
      :alt="img.alt"
      :loading="loading"
      decoding="async"
    />
  </template>
  <img
    v-else
    v-bind="$attrs"
    :src="withBase(img.src)"
    :width="img.width"
    :height="img.height"
    :alt="img.alt"
    :loading="loading"
    decoding="async"
  />
</template>
