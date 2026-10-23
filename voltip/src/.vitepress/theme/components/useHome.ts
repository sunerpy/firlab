import { computed } from 'vue';
import { useData } from 'vitepress';
import { isV2, type HomeV1, type HomeV2 } from '../data/home-schema';

/** The current page's `home:` frontmatter in the 2026-09 layout (validated at build time by
 *  `validateHome`). The components of that layout use it; the page's body decides which run. */
export function useHome() {
  const { frontmatter } = useData();
  return computed(() => frontmatter.value.home as HomeV1);
}

/** The current page's `home:` frontmatter in the 2026-10 layout, or undefined on any other page,
 *  so a band of that layout renders nothing where its data is absent. */
export function useHomeV2() {
  const { frontmatter } = useData();
  return computed<HomeV2 | undefined>(() => (isV2(frontmatter.value.home) ? frontmatter.value.home : undefined));
}
