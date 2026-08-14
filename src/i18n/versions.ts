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
 * Voxera is intentionally absent: it has no version anywhere on the site, its
 * repository is private with no releases, and this repository's `GITHUB_TOKEN`
 * cannot read it. Adding it would turn an honest omission into a broken CI check.
 */

export const pttoolsVersion = 'v0.46.0';
export const pttoolsReleased = '2026-08-10';

export const codegraphVersion = 'v0.42.10';
export const codegraphReleased = '2026-08-07';

export const AGENTLENS_VERSION = 'v0.0.7';
export const AGENTLENS_RELEASED = '2026-08-13';
