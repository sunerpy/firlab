import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Home } from '../data/home-schema';

/** The current page's `home:` frontmatter (validated at build time by `validateHome`). */
export function useHome() {
  const { frontmatter } = useData();
  return computed(() => frontmatter.value.home as Home);
}
