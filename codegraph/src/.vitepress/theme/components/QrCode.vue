<script setup lang="ts">
/**
 * A QR code to scan with a phone: the WeChat Official Account on the home page and the
 * community page. The plate is white in both themes (--cg-qr-plate) because a scanner needs a
 * light ground — a requirement, not a styling slip, and the same rule as the pt-tools and
 * Voltip sites' QrCode and the QR panel in the main site's footer.
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
  <figure class="cg-qr">
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
.cg-qr {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 16px 0 0;
}

.cg-qr img {
  display: block;
  box-sizing: content-box;
  padding: 10px;
  border: 1px solid var(--cg-rule);
  border-radius: var(--cg-radius-control);
  background: var(--cg-qr-plate);
}

.cg-qr figcaption {
  color: var(--cg-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
