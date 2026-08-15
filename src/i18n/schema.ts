/**
 * Structured-data vocabulary: the IRIs every JSON-LD node is keyed by, and the
 * one `offers` shape the released products share.
 *
 * This module exists for the same reason `versions.ts` does. Entity `@id` values
 * used to be written as string literals in five files — `Layout.astro` plus one
 * per product page — and that is exactly how both locales ended up claiming the
 * same IRI while carrying different `description` and `inLanguage` values: one
 * IRI asserting two contradictory property sets. Constructing them in one place
 * makes that class of drift unrepresentable rather than merely unlikely.
 */

import { getAbsoluteLocaleUrl } from 'astro:i18n';
import { defaultLang, type Lang } from './ui';

/**
 * Every entity fragment the site mints. A union rather than a bare `string` for
 * the same reason the English dictionary is typed against the Chinese key set:
 * a typo should be a compile error, not a silently orphaned IRI that no other
 * node ever resolves to.
 */
export type EntityFragment = 'website' | 'sunerpy' | 'codegraph' | 'pt-tools' | 'agentlens';

/**
 * Per-locale entity IRI: `https://firlab.app/#codegraph` for Chinese,
 * `https://firlab.app/en/#codegraph` for English.
 *
 * Namespaced by locale because these nodes carry localized prose. A `WebSite` or
 * `SoftwareApplication` node here is a description of the subject in one
 * language — different `description`, different `inLanguage` — so the two
 * locales are two documents and must not claim one IRI between them. The
 * `BreadcrumbList` items were already per-locale; this brings the entity nodes
 * in line with them.
 *
 * Built from `getAbsoluteLocaleUrl` so the IRI and the document's own canonical
 * URL cannot disagree: both derive from `site` and the same locale routing.
 */
export function entityId(lang: Lang, fragment: EntityFragment): string {
  return `${getAbsoluteLocaleUrl(lang, '')}#${fragment}`;
}

/**
 * The author — and the one IRI deliberately NOT namespaced by locale.
 *
 * The reasoning, because the next reader will wonder why this is the exception.
 * `WebSite` and `SoftwareApplication` are localized *descriptions*, so they are
 * genuinely one document per language. A person is not: sunerpy is the same
 * human on both pages, and every property this node carries — `name`, `url`,
 * `sameAs` — is locale-invariant. Splitting it would mint two Person nodes for
 * one human and leave a consumer to guess they are the same, which is the exact
 * ambiguity a stable `@id` exists to remove. So the collision Defect 1 fixed
 * does not apply here: both documents assert an identical property set, which is
 * agreement, not contradiction.
 *
 * Pinned to the default locale so the origin is written once, here.
 */
export const PERSON_ID = entityId(defaultLang, 'sunerpy');

/**
 * `offers` for a product that actually has a public release.
 *
 * Google's `SoftwareApplication` rich result requires `name` plus `offers.price`
 * plus one of `aggregateRating` / `review`. The first two are facts: these tools
 * are free, and `price: 0` is the documented way to say so —
 * https://developers.google.com/search/docs/appearance/structured-data/software-app
 * `priceCurrency` is formally redundant at zero but schema.org pairs it with
 * `price`, so it ships.
 *
 * The third is NOT a fact, and this is the important half of the comment. There
 * are no real user ratings for any of these tools, so no `aggregateRating` and
 * no `review` appears anywhere in this codebase. That keeps the rich result out
 * of reach permanently, and that is the correct outcome: inventing ratings
 * violates Google's structured-data policies and is grounds for a manual action.
 * What this JSON-LD is actually worth here is entity and knowledge-graph signal,
 * and that has never needed a star rating.
 *
 * DO NOT "complete" this node by adding one.
 *
 * Applied only where a release exists. Voxera has none, so it is offered at no
 * price — it is not offered at all — and asserting `price: 0` for it would be
 * the same category of invention.
 */
export const FREE_OFFER = {
  '@type': 'Offer',
  price: 0,
  priceCurrency: 'USD',
} as const;
