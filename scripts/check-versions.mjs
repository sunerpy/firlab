#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const VERSION_FILE = new URL('../src/i18n/versions.ts', import.meta.url);
const VERSION_PATH = 'src/i18n/versions.ts';
const EXIT_DRIFT = 1;
const EXIT_CHECK_FAILED = 2;

const products = [
  {
    name: 'pt-tools',
    repository: 'sunerpy/pt-tools',
    versionConstant: 'pttoolsVersion',
    releasedConstant: 'pttoolsReleased',
  },
  {
    name: 'CodeGraph',
    repository: 'sunerpy/codegraph-rust',
    versionConstant: 'codegraphVersion',
    releasedConstant: 'codegraphReleased',
  },
  {
    name: 'AgentLens',
    repository: 'sunerpy/AgentLens',
    versionConstant: 'AGENTLENS_VERSION',
    releasedConstant: 'AGENTLENS_RELEASED',
  },
];

// Voxera is deliberately excluded: the site publishes no version for it, and
// this repository's GITHUB_TOKEN cannot read its private, release-less repo.

class CheckFailedError extends Error {}

function readConstant(source, name) {
  const match = source.match(new RegExp(`^export const ${name} = '([^']+)';$`, 'm'));
  if (!match) {
    throw new CheckFailedError(`Could not read ${VERSION_PATH}:${name}; keep it as an exported string constant.`);
  }
  return match[1];
}

function resolveToken() {
  const environmentToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (environmentToken) return environmentToken;

  try {
    return execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    throw new CheckFailedError(
      'GitHub authentication is unavailable. Set GITHUB_TOKEN/GH_TOKEN or run `gh auth login`; refusing an unauthenticated, rate-limit-prone check.',
    );
  }
}

function rateLimitMessage(response, repository) {
  const remaining = response.headers.get('x-ratelimit-remaining');
  const resetSeconds = Number(response.headers.get('x-ratelimit-reset'));
  const reset = Number.isFinite(resetSeconds) ? new Date(resetSeconds * 1000).toISOString() : 'unknown';
  return `${repository}: GitHub API rate limit blocked the check (remaining=${remaining ?? 'unknown'}, reset=${reset}).`;
}

async function latestStableRelease(repository, token) {
  let response;
  try {
    response = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'firlab-version-check',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    throw new CheckFailedError(`${repository}: could not reach GitHub (${error.message}).`);
  }

  if (
    response.status === 429 ||
    (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')
  ) {
    throw new CheckFailedError(rateLimitMessage(response, repository));
  }
  if (response.status === 401 || response.status === 403) {
    throw new CheckFailedError(
      `${repository}: GitHub rejected the supplied token (HTTP ${response.status}); no drift verdict was made.`,
    );
  }
  if (response.status === 404) {
    throw new CheckFailedError(
      `${repository}: GitHub reports no latest stable release (the repo has zero releases, only drafts/prereleases, or is inaccessible).`,
    );
  }
  if (!response.ok) {
    throw new CheckFailedError(`${repository}: GitHub API returned HTTP ${response.status}; no drift verdict was made.`);
  }

  let release;
  try {
    release = await response.json();
  } catch (error) {
    throw new CheckFailedError(`${repository}: GitHub returned invalid JSON (${error.message}).`);
  }

  if (release.draft || release.prerelease) {
    throw new CheckFailedError(
      `${repository}: GitHub's latest-stable endpoint unexpectedly returned a draft/prerelease; refusing to adopt ${release.tag_name ?? 'it'}.`,
    );
  }
  if (typeof release.tag_name !== 'string' || typeof release.published_at !== 'string') {
    throw new CheckFailedError(`${repository}: latest stable release is missing tag_name or published_at.`);
  }

  const publishedAt = new Date(release.published_at);
  if (Number.isNaN(publishedAt.valueOf())) {
    throw new CheckFailedError(`${repository}: invalid published_at value ${JSON.stringify(release.published_at)}.`);
  }

  return {
    version: release.tag_name,
    released: publishedAt.toISOString().slice(0, 10),
    publishedAt: release.published_at,
  };
}

function printDrift(product, committed, live) {
  console.error(`--- ${VERSION_PATH} (committed)`);
  console.error(`+++ GitHub ${product.repository} latest stable release`);
  console.error(`@@ ${product.versionConstant} / ${product.releasedConstant} @@`);
  if (committed.version !== live.version) {
    console.error(`- ${product.versionConstant} = '${committed.version}'`);
    console.error(`+ ${product.versionConstant} = '${live.version}'`);
  }
  if (committed.released !== live.released) {
    console.error(`- ${product.releasedConstant} = '${committed.released}'`);
    console.error(`+ ${product.releasedConstant} = '${live.released}'`);
  }
  console.error(`  publishedAt = '${live.publishedAt}' (UTC)`);
}

async function main() {
  let source;
  let token;
  try {
    [source, token] = await Promise.all([readFile(VERSION_FILE, 'utf8'), Promise.resolve().then(resolveToken)]);
  } catch (error) {
    console.error(`VERSION CHECK INCOMPLETE\n! ${error.message}`);
    return EXIT_CHECK_FAILED;
  }

  let committed;
  try {
    committed = new Map(
      products.map((product) => [
        product.repository,
        {
          version: readConstant(source, product.versionConstant),
          released: readConstant(source, product.releasedConstant),
        },
      ]),
    );
  } catch (error) {
    console.error(`VERSION CHECK INCOMPLETE\n! ${error.message}`);
    return EXIT_CHECK_FAILED;
  }

  const checks = await Promise.allSettled(
    products.map(async (product) => ({
      product,
      live: await latestStableRelease(product.repository, token),
    })),
  );

  const failures = checks.filter((check) => check.status === 'rejected');
  if (failures.length > 0) {
    console.error('VERSION CHECK INCOMPLETE');
    for (const failure of failures) console.error(`! ${failure.reason.message}`);
    console.error('No version drift verdict was produced; retry the check without changing committed metadata.');
    return EXIT_CHECK_FAILED;
  }

  const drift = checks.filter((check) => {
    const { product, live } = check.value;
    const local = committed.get(product.repository);
    return local.version !== live.version || local.released !== live.released;
  });

  if (drift.length > 0) {
    console.error('VERSION DRIFT DETECTED');
    for (const check of drift) {
      const { product, live } = check.value;
      printDrift(product, committed.get(product.repository), live);
    }
    console.error(`Update the named constants in ${VERSION_PATH}; do not fetch release data during the site build.`);
    return EXIT_DRIFT;
  }

  for (const check of checks) {
    const { product, live } = check.value;
    console.log(`✓ ${product.name}: ${live.version} / ${live.released} (${live.publishedAt})`);
  }
  console.log('All committed product versions match the latest stable GitHub releases.');
  return 0;
}

process.exitCode = await main();
