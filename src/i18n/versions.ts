/**
 * Published release metadata used by every rendered surface.
 *
 * The source of truth is each public repository's latest stable GitHub Release:
 * compare the tag name (never the release title), and derive the date from
 * `publishedAt` in UTC. Product manifests are deliberately not consulted because
 * they can trail the release tag.
 *
 * The values are not edited by hand: `.github/workflows/sync-versions.yml` runs
 * `scripts/check-versions.mjs --write` every half hour, commits the constants that
 * drifted to `main` and starts the deploy. Only a new product, or a tag prefix that
 * moved, needs a person here.
 *
 * Keep the site build offline and deterministic. Fetching here would not make a
 * new upstream release appear without another FirLab build, while a failed fetch
 * would make deploys network-dependent or force the same silent stale fallback
 * this module exists to prevent. The network belongs in the sync, not the build.
 *
 * Every repository is public, so `GITHUB_TOKEN` reads all of their releases. A new
 * product adds its two constants here and a row in `scripts/check-versions.mjs`
 * (see `products.ts`).
 *
 * A repository whose release tags carry a component prefix (release-please's
 * `bedrock-gateway-rust-v0.17.0`) keeps the version here without it, so its card shows
 * `v0.17.0` like every other, and the prefix as a third constant: the tag is the prefix
 * followed by the version. The check and the release links both rebuild the tag from
 * the two.
 */

export const pttoolsVersion = 'v0.48.0';
export const pttoolsReleased = '2026-10-01';

export const codegraphVersion = 'v0.53.3';
export const codegraphReleased = '2026-10-03';

export const kiroproviderVersion = 'v3.8.1';
export const kiroproviderReleased = '2026-10-07';

export const bedrockgatewayVersion = 'v0.18.1';
export const bedrockgatewayReleased = '2026-10-06';

export const AGENTLENS_VERSION = 'v0.0.7';
export const AGENTLENS_RELEASED = '2026-08-13';

export const VOLTIP_VERSION = 'v0.0.44';
export const VOLTIP_RELEASED = '2026-10-05';

export const LOCKRA_VERSION = 'v0.7.6';
export const LOCKRA_RELEASED = '2026-10-06';

export const winerVersion = 'v0.0.11';
export const winerReleased = '2026-10-07';
