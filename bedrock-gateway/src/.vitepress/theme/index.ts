/**
 * Theme for firlab.app/bedrock-gateway/: VitePress's default theme, without its bundled fonts,
 * with the FirLab palette (styles/tokens.css) and the home page's components.
 *
 * Components registered here may be used in the synced Markdown; the sync script
 * (scripts/sync-bedrock-gateway-docs.sh, ALLOWED_COMPONENTS) rejects any other tag.
 */
import DefaultTheme from 'vitepress/theme-without-fonts';
import type { Theme } from 'vitepress';
import { h } from 'vue';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';

import HeroFacts from './components/HeroFacts.vue';
import HeroVisual from './components/HeroVisual.vue';
import HomeIndex from './components/HomeIndex.vue';
import HomePlatforms from './components/HomePlatforms.vue';
import HomePrivacy from './components/HomePrivacy.vue';
import HomeScope from './components/HomeScope.vue';
import HomeSteps from './components/HomeSteps.vue';
import SplitBlock from './components/SplitBlock.vue';
import StatusTag from './components/StatusTag.vue';
import { useSearchButtonLabel } from './search-button';
import { useSidebarGroups } from './sidebar-groups';
import { useScrollableTables } from './table-scroll';

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () => h(HeroFacts),
      'home-hero-image': () => h(HeroVisual),
    }),
  setup() {
    useSearchButtonLabel();
    useSidebarGroups();
    useScrollableTables();
  },
  enhanceApp({ app }) {
    app.component('HomeIndex', HomeIndex);
    app.component('HomeSteps', HomeSteps);
    app.component('SplitBlock', SplitBlock);
    app.component('HomePlatforms', HomePlatforms);
    app.component('HomePrivacy', HomePrivacy);
    app.component('HomeScope', HomeScope);
    app.component('StatusTag', StatusTag);
  },
} satisfies Theme;
