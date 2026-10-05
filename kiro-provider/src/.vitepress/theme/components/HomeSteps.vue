<script setup lang="ts">
/** From install to the first answer, in four steps. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="kp-band kp-steps" aria-labelledby="kp-steps-title">
    <h2 id="kp-steps-title" class="kp-band-title">{{ home.steps.title }}</h2>
    <ol class="kp-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="kp-step">
        <span class="kp-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="kp-step-title">{{ step.title }}</h3>
        <p v-if="step.command" class="kp-step-command"><code>{{ step.command }}</code></p>
        <p class="kp-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
