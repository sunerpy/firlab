<script setup lang="ts">
/**
 * The hero's right side: a real terminal session with bedrock-gateway, framed by a hairline —
 * no drawn window, no traffic lights. bedrock-gateway has no interface of its own, so the
 * evidence is the program's own output, copied from a recorded run of a released version
 * (docs/site/README.md in bedrock-gateway-rust). Commands carry a `$` prompt the reader does not
 * type, and the further lines of a command none; nothing moves.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="bg-hero-visual" :aria-label="visual.label">
    <!-- One block per line and no whitespace between them: inside <pre> a newline between two
         blocks would render as an empty line of its own. -->
    <pre class="bg-terminal" tabindex="0"><code><span
      v-for="(line, i) in visual.transcript"
      :key="i"
      class="bg-terminal-line"
      :class="`is-${line.kind}`"
    ><span v-if="line.kind === 'command'" class="bg-terminal-prompt" aria-hidden="true">$ </span>{{ line.text }}</span></code></pre>
    <figcaption v-if="visual.caption" class="bg-hero-caption">{{ visual.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.bg-hero-visual {
  width: 100%;
  margin: 0;
}

.bg-terminal {
  margin: 0;
  padding: 20px 24px;
  overflow-x: auto;
  border: 1px solid var(--bg-rule);
  border-radius: var(--bg-radius-plate);
  background: var(--bg-paper-1);
  box-shadow: var(--bg-shadow-plate);
  color: var(--bg-ink-700);
  font-family: var(--bg-font-mono);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre;
}

.bg-terminal code {
  font: inherit;
  color: inherit;
  background: none;
  padding: 0;
}

.bg-terminal-line {
  display: block;
}

.bg-terminal-line.is-command,
.bg-terminal-line.is-continuation {
  color: var(--bg-ink-900);
  font-weight: 500;
}

/* A command's further lines line up under its text, past the prompt. */
.bg-terminal-line.is-continuation {
  padding-left: 2ch;
}

/* Space between one command's output and the next command. */
.bg-terminal-line.is-output + .bg-terminal-line.is-command {
  margin-top: 12px;
}

.bg-terminal-prompt {
  color: var(--bg-ink-400);
  user-select: none;
}

.bg-terminal:focus-visible {
  outline: 2px solid var(--bg-ink-900);
  outline-offset: 2px;
}

.bg-hero-caption {
  margin-top: 12px;
  color: var(--bg-ink-500);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 479px) {
  .bg-terminal {
    padding: 16px;
    font-size: 12px;
  }
}
</style>
