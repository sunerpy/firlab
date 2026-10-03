/**
 * VitePress's search button prints its shortcut hint (Ctrl or ⌘, then K) inside the button, so
 * the button's visible text is its label followed by "K", while its accessible name is the label
 * alone. That fails WCAG 2.5.3 Label in Name, which Lighthouse reports as
 * label-content-name-mismatch. The
 * hint only shows sighted keyboard users the shortcut, so it is taken out of the accessibility
 * tree, and the button announces the shortcut through aria-keyshortcuts instead; VitePress opens
 * the search on either modifier.
 *
 * The button is VitePress's own component (VPNavBarSearchButton). This runs once it is mounted
 * and again after every route change, which may re-render the navigation bar in another locale.
 */
import { useRoute } from 'vitepress';
import { nextTick, onMounted, watch } from 'vue';

function labelSearchButton(): void {
  for (const button of document.querySelectorAll('.DocSearch-Button')) {
    button.querySelector('.DocSearch-Button-Keys')?.setAttribute('aria-hidden', 'true');
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
