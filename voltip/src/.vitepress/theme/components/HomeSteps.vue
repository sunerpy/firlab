<script setup lang="ts">
/** One dictation, start to finish. */
import { useHome } from './useHome';

const home = useHome();
const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<template>
  <section class="vt-band vt-steps" aria-labelledby="vt-steps-title">
    <h2 id="vt-steps-title" class="vt-band-title">{{ home.steps.title }}</h2>
    <ol class="vt-steps-list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="vt-step">
        <span class="vt-step-number" aria-hidden="true">{{ number(i) }}</span>
        <h3 class="vt-step-title">{{ step.title }}</h3>
        <p v-if="step.keys?.length" class="vt-step-keys">
          <kbd v-for="key in step.keys" :key="key" class="vt-kbd">{{ key }}</kbd>
        </p>
        <p class="vt-step-body">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
