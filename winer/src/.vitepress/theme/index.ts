/**
 * Theme for firlab.app/winer/: VitePress's default theme, without its bundled Inter, with the
 * FirLab palette (styles/tokens.css) and the home page's components.
 *
 * Components registered here may be used in the synced Markdown; the sync script
 * (scripts/sync-winer-docs.sh, ALLOWED_COMPONENTS) rejects any other tag.
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
import HomePrivacy from './components/HomePrivacy.vue';
import HomeSteps from './components/HomeSteps.vue';
import ScreenFigure from './components/ScreenFigure.vue';
import SplitBlock from './components/SplitBlock.vue';
import StatusTag from './components/StatusTag.vue';
import { useSearchButtonLabel } from './search-button';
import { useSidebarGroups } from './sidebar-groups';

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
  },
  enhanceApp({ app }) {
    app.component('HomeIndex', HomeIndex);
    app.component('HomeSteps', HomeSteps);
    app.component('SplitBlock', SplitBlock);
    app.component('HomePrivacy', HomePrivacy);
    app.component('ScreenFigure', ScreenFigure);
    app.component('StatusTag', StatusTag);
  },
} satisfies Theme;
