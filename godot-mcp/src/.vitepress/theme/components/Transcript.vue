<script setup lang="ts">
/**
 * An exchange with godot-mcp as a monospace transcript: each call behind a `›` the reader does
 * not send, its further arguments under it, then the lines of what godot-mcp answered. Screen
 * readers read the exchange's `label` instead of the aligned columns; the block takes the focus
 * so a keyboard can scroll it where a line is wider than the screen.
 */
import type { Exchange } from '../data/home-schema';

defineProps<{ exchange: Exchange }>();
</script>

<template>
  <!-- One block per line and no whitespace between them: inside <pre> a newline between two
       blocks would render as an empty line of its own. -->
  <pre class="gm-transcript" role="img" :aria-label="exchange.label" tabindex="0"><code><span
    v-for="(line, i) in exchange.transcript"
    :key="i"
    class="gm-transcript-line"
    :class="`is-${line.kind}`"
  ><span v-if="line.kind === 'call'" class="gm-transcript-prompt">› </span>{{ line.text }}</span></code></pre>
</template>
