<script setup lang="ts">
/**
 * A QR code to scan with a phone: the WeChat Official Account in the home page's
 * community section. The plate is white in both themes (--pt-qr-plate) because a scanner
 * needs a light ground — a requirement, not a styling slip, and the same rule as the QR
 * panel in the main site's footer.
 */
import { withBase } from 'vitepress';

const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    caption?: string;
    /** Rendered width and height in px. */
    size?: number;
  }>(),
  { size: 160 },
);
</script>

<template>
  <figure class="pt-qr">
    <img
      :src="withBase(props.src)"
      :alt="props.alt"
      :width="props.size"
      :height="props.size"
      loading="lazy"
      decoding="async"
    />
    <figcaption v-if="props.caption">{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.pt-qr {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 16px 0 0;
}

.pt-qr img {
  display: block;
  box-sizing: content-box;
  padding: 10px;
  border: 1px solid var(--pt-rule);
  border-radius: var(--pt-radius-control);
  background: var(--pt-qr-plate);
}

.pt-qr figcaption {
  color: var(--pt-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
