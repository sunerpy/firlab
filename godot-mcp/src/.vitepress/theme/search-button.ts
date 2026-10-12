/**
 * VitePress's search button prints its shortcut hint (Ctrl or ⌘, then K) inside the button, so
 * the button's visible text is its label followed by "K", while its accessible name is the label
 * alone. That fails WCAG 2.5.3 Label in Name, which Lighthouse reports as
 * label-content-name-mismatch. VitePress already draws the modifier as generated content; the
 * letter is drawn the same way (data-key, styles/base.css), so the visible text is the label
 * alone. aria-hidden on the hint is not enough on its own, because the rule reads the visible
 * text. The hint is also taken out of the accessibility tree, and the button announces the
 * shortcut through aria-keyshortcuts; VitePress opens the search on either modifier.
 *
 * The button is VitePress's own component (VPNavBarSearchButton). This runs once it is mounted
 * and again after every route change, which may re-render the navigation bar in another locale.
 */
import { useRoute } from 'vitepress';
import { nextTick, onMounted, watch } from 'vue';

function labelSearchButton(): void {
  for (const button of document.querySelectorAll('.DocSearch-Button')) {
    const hint = button.querySelector('.DocSearch-Button-Keys');
    hint?.setAttribute('aria-hidden', 'true');
    for (const key of hint?.querySelectorAll<HTMLElement>('.DocSearch-Button-Key') ?? []) {
      if (key.textContent) {
        key.dataset.key = key.textContent;
        key.textContent = '';
      }
    }
    button.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
  }
}

export function useSearchButtonLabel(): void {
  const route = useRoute();
  onMounted(labelSearchButton);
  watch(
    () => route.path,
    () => nextTick(labelSearchButton),
  );
}
