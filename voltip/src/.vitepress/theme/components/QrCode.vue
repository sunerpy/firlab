<script setup lang="ts">
/**
 * A QR code to scan with a phone: the Telegram group, the WeChat group and the Official
 * Account on the community page. The plate is white in both themes (--vt-qr-plate)
 * because a scanner needs a light ground — a requirement, not a styling slip, and the same
 * rule as the pt-tools site's QrCode and the QR panel in the main site's footer.
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
  { size: 180 },
);
</script>

<template>
  <figure class="vt-qr">
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
.vt-qr {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 16px 32px 0 0;
  vertical-align: top;
}

.vt-qr img {
  display: block;
  box-sizing: content-box;
  padding: 10px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-qr-plate);
}

.vt-qr figcaption {
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.6;
}
</style>
