<script setup lang="ts">
/**
 * The two actions at the end of the nav bar (`themeConfig.vtActions`): try it online, as bold ink
 * words after the logo's bars (the same look as the menu's own try item, base.css), and download,
 * as the ink pill. They show on pages without a sidebar (the home page, the try page) from
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
      <template v-if="!current(action.link)">
        <a v-if="action.theme === 'brand'" class="vt-btn vt-btn-sm vt-btn-brand" :href="withBase(action.link)">
          <VtIcon :name="action.icon" :size="16" />
          {{ action.text }}
        </a>
        <a v-else class="vt-nav-try" :href="withBase(action.link)">{{ action.text }}</a>
      </template>
    </template>
  </div>
</template>

<style>
.vt-nav-actions {
  display: none;
  align-items: center;
  gap: 18px;
  margin-left: 16px;
}

.vt-nav-try {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--vt-ink-900);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.2s;
}

.vt-nav-try:hover {
  color: var(--vt-ink-700);
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
