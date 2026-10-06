<script setup lang="ts">
/** From install to the first answer, in four steps. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="bg-band bg-steps" aria-labelledby="bg-steps-title">
    <h2 id="bg-steps-title" class="bg-band-title">{{ home.steps.title }}</h2>
    <ol class="bg-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="bg-step">
        <span class="bg-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="bg-step-title">{{ step.title }}</h3>
        <p v-if="step.command" class="bg-step-command"><code>{{ step.command }}</code></p>
        <p class="bg-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
