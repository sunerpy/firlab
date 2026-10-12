/**
 * VitePress 1.6.4 renders every sidebar group's header as a div with role="button" and
 * tabindex="0", and a collapsible group's caret as a second role="button" inside it. One control
 * then sits inside another, which axe reports as nested-interactive (WCAG 4.1.2), and the header
 * of a group that cannot collapse is a focus stop that does nothing. VitePress's main branch has
 * since made the header a plain element and the caret a real button with aria-expanded
 * (vuejs/vitepress#3517). This gives the rendered sidebar the same semantics: the header keeps
 * its click handler but loses the role and the focus stop; the caret stays the one control,
 * toggles on Enter (VitePress's own handler, through the header) and on Space, and reports its
 * state through aria-expanded.
 *
 * The sidebar is VitePress's own component (VPSidebarItem). Groups mount, re-render and collapse
 * after the first paint, so this runs again on every change to the document's elements or
 * classes, at most once per frame. It only writes attributes the observer does not watch.
 */
import { onMounted, onUnmounted } from 'vue';

function fixSidebarGroups(): void {
  for (const item of document.querySelectorAll<HTMLElement>('.VPSidebarItem > .item')) {
    item.removeAttribute('role');
    item.removeAttribute('tabindex');
    const caret = item.querySelector<HTMLElement>(':scope > .caret');
    if (!caret) continue;
    const expanded = String(!item.parentElement?.classList.contains('collapsed'));
    if (caret.getAttribute('aria-expanded') !== expanded) {
      caret.setAttribute('aria-expanded', expanded);
    }
    if (caret.dataset.space === undefined) {
      caret.dataset.space = '';
      // As on a native button, Space does not scroll the page and activates on release.
      caret.addEventListener('keydown', (event) => {
        if (event.key === ' ') event.preventDefault();
      });
      caret.addEventListener('keyup', (event) => {
        if (event.key === ' ') caret.click();
      });
    }
  }
}

export function useSidebarGroups(): void {
  let observer: MutationObserver | undefined;
  let frame = 0;
  onMounted(() => {
    fixSidebarGroups();
    observer = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        fixSidebarGroups();
      });
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  });
  onUnmounted(() => {
    observer?.disconnect();
    cancelAnimationFrame(frame);
  });
}
