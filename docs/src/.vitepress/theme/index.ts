/**
 * VitePress theme extension.
 *
 * Only a stylesheet: no component overrides. The default theme's layout is what
 * makes a documentation site navigable, and replacing pieces of it to match a
 * marketing page would cost more than the visual consistency is worth. The palette
 * is aligned instead.
 */
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './styles/tokens.css';

export default {
  extends: DefaultTheme,
} satisfies Theme;
