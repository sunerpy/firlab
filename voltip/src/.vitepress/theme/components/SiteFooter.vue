<script setup lang="ts">
/**
 * VitePress's VPFooter (1.6.4) with the site's own columns: config/shared.ts aliases it over
 * VPFooter.vue, as it does HomeMain over VPHome. Like VPFooter it shows only on pages without a
 * sidebar (the home page, the try page, 404) and hides with `footer: false`. Above VitePress's
 * licence and source line (`themeConfig.footer`) it draws `themeConfig.vtFooter`: the brand, a
 * QR code and the documentation in columns, so every guide page is one step from the home page.
 * Compare it with node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue when
 * VitePress is upgraded.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { useSidebar } from 'vitepress/theme-without-fonts';
import type { VoltipThemeConfig } from '../data/site-config';
import { isExternal } from './inline';

const { theme, frontmatter, site, localeIndex } = useData<VoltipThemeConfig>();
const { hasSidebar } = useSidebar();
const footer = computed(() => theme.value.vtFooter);
const home = computed(() => (localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`));
const logo = computed(() => {
  const value = theme.value.logo;
  return typeof value === 'string' ? value : value && 'src' in value ? value.src : undefined;
});
const href = (link: string) => (isExternal(link) ? link : withBase(link));
</script>

<template>
  <footer v-if="theme.footer && frontmatter.footer !== false" class="VPFooter vt-footer" :class="{ 'has-sidebar': hasSidebar }">
    <div class="vt-footer-in">
      <div v-if="footer" class="vt-footer-grid">
        <div class="vt-footer-brand">
          <a class="vt-footer-name" :href="withBase(home)">
            <img v-if="logo" :src="withBase(logo)" width="28" height="28" alt="" />
            <span>{{ site.title }}</span>
          </a>
          <p>{{ footer.tagline }}</p>
          <div v-if="footer.qr" class="vt-footer-qr">
            <img :src="withBase(footer.qr.src)" width="84" height="84" :alt="footer.qr.alt" loading="lazy" decoding="async" />
            <span>
              {{ footer.qr.caption }}
              <a v-if="footer.qr.link" :href="href(footer.qr.link.link)">{{ footer.qr.link.text }}</a>
            </span>
          </div>
        </div>
        <nav v-for="column in footer.columns" :key="column.title" class="vt-footer-col" :aria-label="column.title">
          <h2>{{ column.title }}</h2>
          <ul>
            <li v-for="item in column.items" :key="item.link">
              <a
                :href="href(item.link)"
                :target="isExternal(item.link) ? '_blank' : undefined"
                :rel="isExternal(item.link) ? 'noreferrer' : undefined"
                >{{ item.text }}</a
              >
            </li>
          </ul>
        </nav>
      </div>
      <div class="vt-footer-bottom">
        <p v-if="theme.footer.message" class="message" v-html="theme.footer.message"></p>
        <p v-if="theme.footer.copyright" class="copyright" v-html="theme.footer.copyright"></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 64px 24px 32px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}

@media (min-width: 640px) {
  .VPFooter {
    padding: 64px 48px 32px;
  }
}

@media (min-width: 960px) {
  .VPFooter {
    padding: 64px 64px 32px;
  }
}

.vt-footer-in {
  max-width: 1152px;
  margin: 0 auto;
}

.vt-footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px 24px;
  padding-bottom: 48px;
}

.vt-footer-brand {
  grid-column: 1 / -1;
}

/* Two columns of links on a phone, where every link still fits on one line. */
@media (min-width: 360px) {
  .vt-footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 640px) {
  .vt-footer-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 40px 32px;
  }
}

@media (min-width: 1100px) {
  .vt-footer-grid {
    grid-template-columns: minmax(0, 1.5fr) repeat(5, minmax(0, 1fr));
  }

  .vt-footer-brand {
    grid-column: auto;
  }
}

.vt-footer-name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--vt-ink-900);
  font-size: 18px;
  font-weight: 650;
  text-decoration: none;
}

.vt-footer-brand > p {
  max-width: 22em;
  margin: 12px 0 0;
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.7;
}

.vt-footer-qr {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  color: var(--vt-ink-500);
  font-size: 13px;
  line-height: 1.6;
}

.vt-footer-qr img {
  flex: none;
  width: 84px;
  height: 84px;
  padding: 4px;
  border: 1px solid var(--vt-rule);
  border-radius: var(--vt-radius-control);
  background: var(--vt-qr-plate);
}

.vt-footer-qr span {
  display: grid;
  gap: 4px;
  /* A name in 「」 stays on one line. */
  word-break: keep-all;
}

.vt-footer-col h2 {
  margin: 0 0 16px;
  color: var(--vt-ink-900);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.4;
}

.vt-footer-col ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.vt-footer a {
  color: var(--vt-ink-500);
  font-size: 14px;
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.2s;
}

.vt-footer a:hover {
  color: var(--vt-ink-900);
}

.vt-footer .vt-footer-name {
  color: var(--vt-ink-900);
  font-size: 18px;
}

.vt-footer-qr a {
  font-size: 13px;
  text-decoration-line: underline;
  text-decoration-color: var(--vt-link-line);
  text-underline-offset: 2px;
}

.vt-footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  padding-top: 24px;
  border-top: 1px solid var(--vt-rule);
}

.vt-footer-in > .vt-footer-bottom:first-child {
  padding-top: 0;
  border-top: 0;
  justify-content: center;
  text-align: center;
}

.message,
.copyright {
  margin: 0;
  color: var(--vt-ink-400);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.7;
}

.message :deep(a),
.copyright :deep(a) {
  color: var(--vt-ink-500);
  font-size: 13px;
  text-decoration-line: underline;
  text-decoration-color: var(--vt-link-line);
  text-underline-offset: 2px;
}

.message :deep(a:hover) {
  color: var(--vt-ink-900);
}
</style>
