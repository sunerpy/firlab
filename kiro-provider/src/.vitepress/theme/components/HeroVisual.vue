<script setup lang="ts">
/**
 * The hero's right side: a real terminal session with kiro-provider, framed by a hairline —
 * no drawn window, no traffic lights. kiro-provider has no interface of its own, so the
 * evidence is the program's own output, copied from a recorded run of a released version
 * (docs/site/README.md in kiro-provider). Commands carry a `$` prompt the reader does not type,
 * and the further lines of a command none; nothing moves.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="kp-hero-visual" :aria-label="visual.label">
    <!-- One block per line and no whitespace between them: inside <pre> a newline between two
         blocks would render as an empty line of its own. -->
    <pre class="kp-terminal" tabindex="0"><code><span
      v-for="(line, i) in visual.transcript"
      :key="i"
      class="kp-terminal-line"
      :class="`is-${line.kind}`"
    ><span v-if="line.kind === 'command'" class="kp-terminal-prompt" aria-hidden="true">$ </span>{{ line.text }}</span></code></pre>
    <figcaption v-if="visual.caption" class="kp-hero-caption">{{ visual.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.kp-hero-visual {
  width: 100%;
  margin: 0;
}

.kp-terminal {
  margin: 0;
  padding: 20px 24px;
  overflow-x: auto;
  border: 1px solid var(--kp-rule);
  border-radius: var(--kp-radius-plate);
  background: var(--kp-paper-1);
  box-shadow: var(--kp-shadow-plate);
  color: var(--kp-ink-700);
  font-family: var(--kp-font-mono);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre;
}

.kp-terminal code {
  font: inherit;
  color: inherit;
  background: none;
  padding: 0;
}

.kp-terminal-line {
  display: block;
}

.kp-terminal-line.is-command,
.kp-terminal-line.is-continuation {
  color: var(--kp-ink-900);
  font-weight: 500;
}

/* A command's further lines line up under its text, past the prompt. */
.kp-terminal-line.is-continuation {
  padding-left: 2ch;
}

/* Space between one command's output and the next command. */
.kp-terminal-line.is-output + .kp-terminal-line.is-command {
  margin-top: 12px;
}

.kp-terminal-prompt {
  color: var(--kp-ink-400);
  user-select: none;
}

.kp-terminal:focus-visible {
  outline: 2px solid var(--kp-ink-900);
  outline-offset: 2px;
}

.kp-hero-caption {
  margin-top: 12px;
  color: var(--kp-ink-500);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 479px) {
  .kp-terminal {
    padding: 16px;
    font-size: 12px;
  }
}
</style>
