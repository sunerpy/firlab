<script setup lang="ts">
/** From an empty server to the first automatic download, in four steps. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="pt-band pt-steps" aria-labelledby="pt-steps-title">
    <h2 id="pt-steps-title" class="pt-band-title">{{ home.steps.title }}</h2>
    <ol class="pt-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="pt-step">
        <span class="pt-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="pt-step-title">{{ step.title }}</h3>
        <p v-if="step.command" class="pt-step-command"><code>{{ step.command }}</code></p>
        <p class="pt-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
