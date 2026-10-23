<script setup lang="ts">
/**
 * The two pills at the end of the nav bar (`themeConfig.vtActions`): try it online, outlined, and
 * download, in ink. They show on pages without a sidebar (the home page, the try page) from
 * 1100 px, where the bar has room for them beside the menu (measured, DESIGN.md §10); the menu's
 * own try item steps aside wherever they show, so the bar never offers the same page twice.
 * Beside a sidebar, and on narrower screens, the menu keeps its try item and the bar is as before.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { VoltipThemeConfig } from '../data/site-config';
import VtIcon from './VtIcon.vue';

const { theme, page } = useData<VoltipThemeConfig>();
const actions = computed(() => theme.value.vtActions ?? []);
/** The page a button leads to does not show it. */
const current = (link: string) => `/${page.value.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}` === link;
</script>

<template>
  <div v-if="actions.length" class="vt-nav-actions">
    <template v-for="action in actions" :key="action.link">
      <a
        v-if="!current(action.link)"
        class="vt-btn vt-btn-sm"
        :class="action.theme === 'brand' ? 'vt-btn-brand' : 'vt-btn-alt'"
        :href="withBase(action.link)"
      >
        <VtIcon :name="action.icon" :size="16" />
        {{ action.text }}
      </a>
    </template>
  </div>
</template>

<style>
.vt-nav-actions {
  display: none;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

@media (min-width: 1100px) {
  .VPNavBar:not(.has-sidebar) .vt-nav-actions {
    display: flex;
  }

  .VPNavBar:not(.has-sidebar) .VPNavBarMenuLink[href$='/guide/try'] {
    display: none;
  }
}
</style>
