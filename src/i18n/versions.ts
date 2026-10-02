/**
 * Published release metadata used by every rendered surface.
 *
 * The source of truth is each public repository's latest stable GitHub Release:
 * compare the tag name (never the release title), and derive the date from
 * `publishedAt` in UTC. Product manifests are deliberately not consulted because
 * they can trail the release tag. `scripts/check-versions.mjs` verifies these
 * committed values against GitHub and names the constant to update when they
 * drift.
 *
 * Keep the site build offline and deterministic. Fetching here would not make a
 * new upstream release appear without another FirLab build, while a failed fetch
 * would make deploys network-dependent or force the same silent stale fallback
 * this module exists to prevent. The network belongs in the check, not the build.
 *
 * Every repository is public, so `GITHUB_TOKEN` reads all of their releases. A new
 * product adds its two constants here and a row in `scripts/check-versions.mjs`
 * (see `products.ts`).
 */

export const pttoolsVersion = 'v0.48.0';
export const pttoolsReleased = '2026-10-01';

export const codegraphVersion = 'v0.52.2';
export const codegraphReleased = '2026-10-01';

export const AGENTLENS_VERSION = 'v0.0.7';
export const AGENTLENS_RELEASED = '2026-08-13';

export const VOLTIP_VERSION = 'v0.0.30';
export const VOLTIP_RELEASED = '2026-10-02';

export const LOCKRA_VERSION = 'v0.6.0';
export const LOCKRA_RELEASED = '2026-10-02';
