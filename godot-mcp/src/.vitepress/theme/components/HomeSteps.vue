<script setup lang="ts">
/** From install to the first answer, in four steps. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="gm-band gm-steps" aria-labelledby="gm-steps-title">
    <h2 id="gm-steps-title" class="gm-band-title">{{ home.steps.title }}</h2>
    <ol class="gm-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="gm-step">
        <span class="gm-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="gm-step-title">{{ step.title }}</h3>
        <p v-if="step.command" class="gm-step-command"><code>{{ step.command }}</code></p>
        <p class="gm-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
