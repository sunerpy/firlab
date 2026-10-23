<script setup lang="ts">
/**
 * Where the speech is recognised (`home.modes`): one card per mode, each with a small diagram of
 * where the audio goes, what that means for privacy, its terms, and the models or vendors it
 * offers; then the vendors AI polish can use. Vendor marks are drawn in the text colour.
 */
import { withBase } from 'vitepress';
import ProviderMark from './ProviderMark.vue';
import VtIcon from './VtIcon.vue';
import { inline } from './inline';
import { useHomeV2 } from './useHome';

const home = useHomeV2();
</script>

<template>
  <section v-if="home" class="vt-v2-band" aria-labelledby="vt-modes-title">
    <div class="vt-wrap">
      <header class="vt-sec-head vt-sec-center">
        <h2 id="vt-modes-title" v-html="inline(home.modes.title)" />
        <p v-if="home.modes.intro">{{ home.modes.intro }}</p>
      </header>
      <div class="vt-modes">
        <article v-for="mode in home.modes.items" :key="mode.label" class="vt-card vt-mode">
          <div class="vt-mode-top">
            <span><VtIcon :name="mode.icon" :size="16" />{{ mode.label }}</span>
            <span v-if="mode.badge" class="vt-badge vt-badge-ink">{{ mode.badge }}</span>
          </div>
          <h3>{{ mode.title }}</h3>
          <div class="vt-flow">
            <span class="vt-flow-box" :class="{ 'vt-flow-half': !mode.flow.local }" aria-hidden="true">
              <span class="vt-flow-label">{{ home.modes.scope }}</span>
            </span>
            <span class="vt-node">
              <span class="vt-node-icon"><VtIcon name="mic" /></span>
              {{ mode.flow.from }}
            </span>
            <span class="vt-flow-line" aria-hidden="true" />
            <span class="vt-node vt-node-dark">
              <span class="vt-node-icon"><VtIcon :name="mode.flow.icon" /></span>
              {{ mode.flow.to }}
            </span>
          </div>
          <p class="vt-assure"><VtIcon name="shield" :size="17" />{{ mode.assure }}</p>
          <dl class="vt-specs">
            <template v-for="spec in mode.specs" :key="spec.term">
              <dt>{{ spec.term }}</dt>
              <dd>{{ spec.text }}</dd>
            </template>
          </dl>
          <p class="vt-chips-label">{{ mode.chipsLabel }}</p>
          <ul class="vt-chips">
            <li v-for="chip in mode.chips" :key="chip.name" class="vt-chip">
              <ProviderMark v-if="chip.mark" :name="chip.mark" :size="15" />
              <VtIcon v-else-if="chip.icon" :name="chip.icon" :size="15" />
              {{ chip.name }}
            </li>
          </ul>
        </article>
      </div>
      <div v-if="home.modes.polish" class="vt-card vt-polish-row">
        <div>
          <h3>{{ home.modes.polish.title }}</h3>
          <p>{{ home.modes.polish.body }}</p>
        </div>
        <ul class="vt-marks">
          <li v-for="item in home.modes.polish.marks" :key="item.name">
            <span class="vt-mark-tile"><ProviderMark :name="item.mark" :size="22" /></span>
            {{ item.name }}
          </li>
        </ul>
      </div>
      <p v-if="home.modes.note" class="vt-proof" v-html="inline(home.modes.note, withBase)" />
    </div>
  </section>
</template>
