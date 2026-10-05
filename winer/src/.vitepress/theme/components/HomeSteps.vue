<script setup lang="ts">
/** From an empty server to the first automatic download, in four steps. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="wn-band wn-steps" aria-labelledby="wn-steps-title">
    <h2 id="wn-steps-title" class="wn-band-title">{{ home.steps.title }}</h2>
    <ol class="wn-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="wn-step">
        <span class="wn-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="wn-step-title">{{ step.title }}</h3>
        <p v-if="step.command" class="wn-step-command"><code>{{ step.command }}</code></p>
        <p class="wn-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
