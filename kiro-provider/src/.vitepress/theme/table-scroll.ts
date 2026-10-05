/**
 * Every Markdown table sits in a scroll box (config/shared.ts wraps it, styles/base.css lets it
 * scroll), so a table wider than the text column, such as the configuration reference's,
 * scrolls inside the page instead of running under the outline or past the window. A box whose
 * table is wider than it gets tabindex="0", so the keyboard can scroll it too (WCAG 2.1.1, axe's
 * scrollable-region-focusable); a box whose table fits stays out of the tab order.
 *
 * Pages, fonts and the window all change a table's width after the first paint, so each box is
 * measured again whenever it or its table is resized, and new boxes are picked up when the
 * document's elements change, at most once per frame. It only writes an attribute the mutation
 * observer does not watch.
 */
import { onMounted, onUnmounted } from 'vue';

function markScrollable(box: HTMLElement): void {
  if (box.scrollWidth > box.clientWidth) {
    if (box.getAttribute('tabindex') !== '0') box.setAttribute('tabindex', '0');
  } else if (box.hasAttribute('tabindex')) {
    box.removeAttribute('tabindex');
  }
}

export function useScrollableTables(): void {
  let mutations: MutationObserver | undefined;
  let sizes: ResizeObserver | undefined;
  let frame = 0;
  const watched = new WeakSet<Element>();

  const scan = (): void => {
    for (const box of document.querySelectorAll<HTMLElement>('.kp-table-scroll')) {
      if (!watched.has(box)) {
        watched.add(box);
        sizes?.observe(box);
        const table = box.querySelector(':scope > table');
        if (table) sizes?.observe(table);
      }
      markScrollable(box);
    }
  };

  onMounted(() => {
    sizes = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.target.closest<HTMLElement>('.kp-table-scroll');
        if (box) markScrollable(box);
      }
    });
    scan();
    mutations = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });
    mutations.observe(document.body, { subtree: true, childList: true });
  });

  onUnmounted(() => {
    mutations?.disconnect();
    sizes?.disconnect();
    cancelAnimationFrame(frame);
  });
}
