<script setup lang="ts">
/**
 * Where the speech is recognised (`home.modes`), as one comparison table: a column per mode, its
 * rows lined up across the columns (what it is, where the audio goes, its terms, the models or
 * vendors it offers), one column after another on a phone; then the vendors AI polish can use, as
 * a row of tiles. Vendor marks are drawn in their own colours (data/marks.ts).
 */
import { withBase } from 'vitepress';
import BrandTile from './BrandTile.vue';
import ProviderMark from './ProviderMark.vue';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-modes-title">
    <div class="vt-wrap">
      <header class="vt-sec-head">
        <h2 id="vt-modes-title" v-html="inline(home.modes.title)" />
        <p v-if="home.modes.intro">{{ home.modes.intro }}</p>
      </header>
      <div class="vt-compare">
        <article v-for="mode in home.modes.items" :key="mode.label" class="vt-compare-col" :class="{ 'vt-compare-default': mode.badge }">
          <header class="vt-compare-head">
            <span class="vt-compare-icon"><VtIcon :name="mode.icon" :size="18" /></span>
            <h3>
              {{ mode.label }}
              <span v-if="mode.badge" class="vt-badge vt-badge-ink">{{ mode.badge }}</span>
            </h3>
            <p>{{ mode.title }}</p>
          </header>
          <p class="vt-compare-assure"><VtIcon name="shield" :size="16" />{{ mode.assure }}</p>
          <dl class="vt-compare-specs">
            <div v-for="spec in mode.specs" :key="spec.term">
              <dt>{{ spec.term }}</dt>
              <dd>{{ spec.text }}</dd>
            </div>
          </dl>
          <div class="vt-compare-chips">
            <p>{{ mode.chipsLabel }}</p>
            <ul class="vt-chips">
              <li v-for="chip in mode.chips" :key="chip.name" class="vt-chip">
                <ProviderMark v-if="chip.mark" :name="chip.mark" :size="15" />
                <VtIcon v-else-if="chip.icon" :name="chip.icon" :size="15" />
                {{ chip.name }}
              </li>
            </ul>
          </div>
        </article>
      </div>
      <div v-if="home.modes.polish" class="vt-polish-line">
        <div>
          <h3><VtIcon name="wand" :size="17" />{{ home.modes.polish.title }}</h3>
          <p>{{ home.modes.polish.body }}</p>
        </div>
        <ul class="vt-tiles">
          <BrandTile v-for="item in home.modes.polish.marks" :key="item.name" :name="item.name" :provider="item.mark" />
        </ul>
      </div>
      <p v-if="home.modes.note" class="vt-footnote" v-html="inline(home.modes.note, withBase)" />
    </div>
  </section>
</template>
