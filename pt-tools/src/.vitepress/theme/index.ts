/**
 * Theme for firlab.app/pt-tools/: VitePress's default theme, without its bundled Inter,
 * with the FirLab palette (styles/tokens.css) and the home page's components.
 *
 * Components registered here may be used in the synced Markdown; the sync script
 * (scripts/sync-pt-tools-docs.sh, ALLOWED_COMPONENTS) rejects any other tag.
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
import HomeDeploy from './components/HomeDeploy.vue';
import HomeIndex from './components/HomeIndex.vue';
import HomePrivacy from './components/HomePrivacy.vue';
import HomeRoadmap from './components/HomeRoadmap.vue';
import HomeSteps from './components/HomeSteps.vue';
import QrCode from './components/QrCode.vue';
import ScreenFigure from './components/ScreenFigure.vue';
import SplitBlock from './components/SplitBlock.vue';
import StatusTag from './components/StatusTag.vue';

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () => h(HeroFacts),
      'home-hero-image': () => h(HeroVisual),
    }),
  enhanceApp({ app }) {
    app.component('HomeIndex', HomeIndex);
    app.component('HomeSteps', HomeSteps);
    app.component('SplitBlock', SplitBlock);
    app.component('HomeDeploy', HomeDeploy);
    app.component('HomePrivacy', HomePrivacy);
    app.component('HomeRoadmap', HomeRoadmap);
    app.component('ScreenFigure', ScreenFigure);
    app.component('StatusTag', StatusTag);
    app.component('QrCode', QrCode);
  },
} satisfies Theme;
