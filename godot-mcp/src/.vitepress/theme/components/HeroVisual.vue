<script setup lang="ts">
/**
 * The hero's right side: a real MCP exchange with godot-mcp, framed by a hairline — no drawn
 * window, no traffic lights. godot-mcp has no interface of its own, so the evidence is what it
 * answered: the tool calls a client sent in a recorded session and, under each, fields of the
 * structured answer, every value copied unchanged (docs/site/README.md in godot-mcp). A call
 * carries a `›` the reader does not send, its further arguments none; nothing moves.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

const { frontmatter } = useData();
const visual = computed(() => (frontmatter.value.home as Home | undefined)?.visual);
</script>

<template>
  <figure v-if="visual" class="gm-hero-visual" :aria-label="visual.label">
    <!-- One block per line and no whitespace between them: inside <pre> a newline between two
         blocks would render as an empty line of its own. -->
    <pre class="gm-terminal" tabindex="0"><code><span
      v-for="(line, i) in visual.transcript"
      :key="i"
      class="gm-terminal-line"
      :class="`is-${line.kind}`"
    ><span v-if="line.kind === 'call'" class="gm-terminal-prompt" aria-hidden="true">› </span>{{ line.text }}</span></code></pre>
    <figcaption v-if="visual.caption" class="gm-hero-caption">{{ visual.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.gm-hero-visual {
  width: 100%;
  margin: 0;
}

.gm-terminal {
  margin: 0;
  padding: 20px 24px;
  overflow-x: auto;
  border: 1px solid var(--gm-rule);
  border-radius: var(--gm-radius-plate);
  background: var(--gm-paper-1);
  box-shadow: var(--gm-shadow-plate);
  color: var(--gm-ink-700);
  font-family: var(--gm-font-mono);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre;
}

.gm-terminal code {
  font: inherit;
  color: inherit;
  background: none;
  padding: 0;
}

.gm-terminal-line {
  display: block;
}

.gm-terminal-line.is-call,
.gm-terminal-line.is-argument {
  color: var(--gm-ink-900);
  font-weight: 500;
}

/* A call's further arguments line up under its text, past the prompt. */
.gm-terminal-line.is-argument {
  padding-left: 2ch;
}

/* Space between one call's answer and the next call. */
.gm-terminal-line.is-answer + .gm-terminal-line.is-call {
  margin-top: 12px;
}

.gm-terminal-prompt {
  color: var(--gm-ink-400);
  user-select: none;
}

.gm-terminal:focus-visible {
  outline: 2px solid var(--gm-ink-900);
  outline-offset: 2px;
}

.gm-hero-caption {
  margin-top: 12px;
  color: var(--gm-ink-500);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 479px) {
  .gm-terminal {
    padding: 16px;
    font-size: 12px;
  }
}
</style>
