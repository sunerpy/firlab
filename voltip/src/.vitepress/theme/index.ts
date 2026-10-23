/**
 * Theme for voltip.firlab.app: VitePress's default theme, without its bundled Inter,
 * with the FirLab palette (styles/tokens.css) and the home page's components.
 *
 * Components registered here may be used in the synced Markdown; the sync script
 * (scripts/sync-voltip-docs.sh, ALLOWED_COMPONENTS) rejects any other tag.
 */
import DefaultTheme from 'vitepress/theme-without-fonts';
import type { Theme } from 'vitepress';
import { h } from 'vue';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import './styles/bands.css';

import AdminStats from './components/AdminStats.vue';
import HeroChecks from './components/HeroChecks.vue';
import HeroFacts from './components/HeroFacts.vue';
import HeroScene from './components/HeroScene.vue';
import HeroVisual from './components/HeroVisual.vue';
import HomeCloser from './components/HomeCloser.vue';
import HomeFaq from './components/HomeFaq.vue';
import HomeIndex from './components/HomeIndex.vue';
import HomeModels from './components/HomeModels.vue';
import HomeModes from './components/HomeModes.vue';
import HomePairs from './components/HomePairs.vue';
import HomePhone from './components/HomePhone.vue';
import HomePlatforms from './components/HomePlatforms.vue';
import HomePresets from './components/HomePresets.vue';
import HomePrivacy from './components/HomePrivacy.vue';
import HomeTryBand from './components/HomeTryBand.vue';
import HomeRoadmap from './components/HomeRoadmap.vue';
import HomeSteps from './components/HomeSteps.vue';
import NavActions from './components/NavActions.vue';
import QrCode from './components/QrCode.vue';
import ScreenFigure from './components/ScreenFigure.vue';
import SplitBlock from './components/SplitBlock.vue';
import StatusTag from './components/StatusTag.vue';
import TryVoltip from './components/TryVoltip.vue';
import VideoFigure from './components/VideoFigure.vue';
import { useSearchButtonLabel } from './search-button';
import { useSidebarGroups } from './sidebar-groups';

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // Each hero part renders only for the layout whose data the page carries
      // (theme/data/home-schema.ts): facts and the app capture for the 2026-09 one, the checks
      // under the buttons and the dictation scene for the 2026-10 one.
      'home-hero-info-after': () => h(HeroFacts),
      'home-hero-actions-after': () => h(HeroChecks),
      'home-hero-image': () => [h(HeroVisual), h(HeroScene)],
      // The way to the try page, under the hero (renders only with `home.try`).
      'home-hero-after': () => h(HomeTryBand),
      'nav-bar-content-after': () => h(NavActions),
    }),
  setup() {
    useSearchButtonLabel();
    useSidebarGroups();
  },
  enhanceApp({ app }) {
    app.component('HomeIndex', HomeIndex);
    app.component('HomeSteps', HomeSteps);
    app.component('SplitBlock', SplitBlock);
    app.component('HomePlatforms', HomePlatforms);
    app.component('HomeModels', HomeModels);
    app.component('HomePrivacy', HomePrivacy);
    app.component('HomeRoadmap', HomeRoadmap);
    app.component('HomePairs', HomePairs);
    app.component('HomePresets', HomePresets);
    app.component('HomeModes', HomeModes);
    app.component('HomePhone', HomePhone);
    app.component('HomeFaq', HomeFaq);
    app.component('HomeCloser', HomeCloser);
    app.component('ScreenFigure', ScreenFigure);
    app.component('StatusTag', StatusTag);
    app.component('VideoFigure', VideoFigure);
    app.component('QrCode', QrCode);
    app.component('TryVoltip', TryVoltip);
    // Only src/admin.md uses it; the sync script does not allow it in voltip's pages.
    app.component('AdminStats', AdminStats);
  },
} satisfies Theme;
