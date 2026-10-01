<script setup lang="ts">
/** Moving accounts in, start to finish. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="lk-band lk-steps" aria-labelledby="lk-steps-title">
    <h2 id="lk-steps-title" class="lk-band-title">{{ home.steps.title }}</h2>
    <ol class="lk-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="lk-step">
        <span class="lk-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="lk-step-title">{{ step.title }}</h3>
        <p v-if="step.keys?.length" class="lk-step-keys">
          <kbd v-for="key in step.keys" :key="key" class="lk-kbd">{{ key }}</kbd>
        </p>
        <p class="lk-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
