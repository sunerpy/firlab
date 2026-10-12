<script setup lang="ts">
/**
 * VitePress's VPHome (1.6.4) with one change: the root element is <main>, so the home
 * page has a main landmark like the guide pages (Lighthouse and axe "landmark-one-main").
 * config/shared.ts aliases it over VPHome.vue. Compare it with
 * node_modules/vitepress/dist/client/theme-default/components/VPHome.vue when VitePress
 * is upgraded.
 */
import { useData } from 'vitepress';
import VPHomeContent from 'vitepress/dist/client/theme-default/components/VPHomeContent.vue';
import VPHomeFeatures from 'vitepress/dist/client/theme-default/components/VPHomeFeatures.vue';
import VPHomeHero from 'vitepress/dist/client/theme-default/components/VPHomeHero.vue';

const { frontmatter, theme } = useData();
</script>

<template>
  <main class="VPHome" :class="{ 'external-link-icon-enabled': theme.externalLinkIcon }">
    <slot name="home-hero-before" />
    <VPHomeHero>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
    </VPHomeHero>
    <slot name="home-hero-after" />

    <slot name="home-features-before" />
    <VPHomeFeatures />
    <slot name="home-features-after" />

    <VPHomeContent v-if="frontmatter.markdownStyles !== false">
      <Content />
    </VPHomeContent>
    <Content v-else />
  </main>
</template>

<style scoped>
.VPHome {
  display: block;
  margin-bottom: 96px;
}

@media (min-width: 768px) {
  .VPHome {
    margin-bottom: 128px;
  }
}
</style>
