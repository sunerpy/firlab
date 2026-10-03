<script setup lang="ts">
/** From install to the first answer, in four steps. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="cg-band cg-steps" aria-labelledby="cg-steps-title">
    <h2 id="cg-steps-title" class="cg-band-title">{{ home.steps.title }}</h2>
    <ol class="cg-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="cg-step">
        <span class="cg-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="cg-step-title">{{ step.title }}</h3>
        <p v-if="step.command" class="cg-step-command"><code>{{ step.command }}</code></p>
        <p class="cg-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
