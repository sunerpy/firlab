/**
 * Theme for firlab.app/godot-mcp/: VitePress's default theme, without its bundled fonts,
 * with the FirLab palette (styles/tokens.css) and the home page's components.
 *
 * Components registered here may be used in the synced Markdown; the sync script
 * (scripts/sync-godot-mcp-docs.sh, ALLOWED_COMPONENTS) rejects any other tag.
 */
import DefaultTheme from 'vitepress/theme-without-fonts';
import type { Theme } from 'vitepress';
import { h } from 'vue';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import './styles/bands.css';

import HeroFacts from './components/HeroFacts.vue';
import HeroStages from './components/HeroStages.vue';
import HeroVisual from './components/HeroVisual.vue';
import HomeBuilt from './components/HomeBuilt.vue';
import HomeCapabilities from './components/HomeCapabilities.vue';
import HomeClients from './components/HomeClients.vue';
import HomeCloser from './components/HomeCloser.vue';
import HomeEngine from './components/HomeEngine.vue';
import HomeFaq from './components/HomeFaq.vue';
import HomeIndex from './components/HomeIndex.vue';
import HomePlatforms from './components/HomePlatforms.vue';
import HomePrivacy from './components/HomePrivacy.vue';
import HomeScope from './components/HomeScope.vue';
import HomeShowcases from './components/HomeShowcases.vue';
import HomeSteps from './components/HomeSteps.vue';
import ScreenFigure from './components/ScreenFigure.vue';
import SplitBlock from './components/SplitBlock.vue';
import StatusTag from './components/StatusTag.vue';
import { useSearchButtonLabel } from './search-button';
import { useSidebarGroups } from './sidebar-groups';
import { useScrollableTables } from './table-scroll';

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // Each hero part renders only for the layout whose data the page carries
      // (theme/data/home-schema.ts): the facts above the buttons and the exchange for the 2026-09
      // one, the facts under the buttons and the two stages under the words for the 2026-11 one.
      'home-hero-info-after': () => h(HeroFacts, { place: 'info' }),
      'home-hero-actions-after': () => h(HeroFacts, { place: 'actions' }),
      'home-hero-image': () => [h(HeroVisual), h(HeroStages)],
    }),
  setup() {
    useSearchButtonLabel();
    useSidebarGroups();
    useScrollableTables();
  },
  enhanceApp({ app }) {
    // The 2026-11 home page (design A, DESIGN.md §18) and the screenshots of any page.
    app.component('HomeBuilt', HomeBuilt);
    app.component('HomeCapabilities', HomeCapabilities);
    app.component('HomeShowcases', HomeShowcases);
    app.component('HomeClients', HomeClients);
    app.component('HomeEngine', HomeEngine);
    app.component('HomeFaq', HomeFaq);
    app.component('HomeCloser', HomeCloser);
    app.component('ScreenFigure', ScreenFigure);
    // Both layouts.
    app.component('SplitBlock', SplitBlock);
    app.component('HomePrivacy', HomePrivacy);
    // The 2026-09 home page, kept so an older godot-mcp checkout still builds.
    app.component('HomeIndex', HomeIndex);
    app.component('HomeSteps', HomeSteps);
    app.component('HomePlatforms', HomePlatforms);
    app.component('HomeScope', HomeScope);
    app.component('StatusTag', StatusTag);
  },
} satisfies Theme;
