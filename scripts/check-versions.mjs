#!/usr/bin/env node

// Compares the constants in src/i18n/versions.ts with each product's latest stable GitHub
// release. With --write it rewrites the constants that drifted instead of reporting them, and
// prints `COMMIT_SUBJECT=<subject>` when it changed the file (sync-versions.yml commits that).
//
//   node scripts/check-versions.mjs           exit 0 match, 1 drift, 2 no verdict
//   node scripts/check-versions.mjs --write   exit 0 up to date or rewritten, 1 drift it cannot
//                                             write (a tag prefix moved), 2 no verdict

import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const VERSION_FILE = new URL('../src/i18n/versions.ts', import.meta.url);
const VERSION_PATH = 'src/i18n/versions.ts';
const EXIT_DRIFT = 1;
const EXIT_CHECK_FAILED = 2;
const WRITE = process.argv.includes('--write');
// What a tag may hold before it goes into a quoted TypeScript constant.
const SAFE_TAG = /^[A-Za-z0-9._+-]+$/;

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
    name: 'kiro-provider',
    repository: 'sunerpy/kiro-provider',
    versionConstant: 'kiroproviderVersion',
    releasedConstant: 'kiroproviderReleased',
  },
  {
    name: 'bedrock-gateway',
    repository: 'sunerpy/bedrock-gateway-rust',
    versionConstant: 'bedrockgatewayVersion',
    releasedConstant: 'bedrockgatewayReleased',
  },
  {
    name: 'AgentLens',
    repository: 'sunerpy/AgentLens',
    versionConstant: 'AGENTLENS_VERSION',
    releasedConstant: 'AGENTLENS_RELEASED',
  },
  {
    name: 'Voltip',
    repository: 'sunerpy/voltip',
    versionConstant: 'VOLTIP_VERSION',
    releasedConstant: 'VOLTIP_RELEASED',
  },
  {
    name: 'Lockra',
    repository: 'sunerpy/lockra',
    versionConstant: 'LOCKRA_VERSION',
    releasedConstant: 'LOCKRA_RELEASED',
  },
  {
    name: 'winer',
    repository: 'sunerpy/winer',
    versionConstant: 'winerVersion',
    releasedConstant: 'winerReleased',
  },
];

class CheckFailedError extends Error {}

function constantPattern(name) {
  return new RegExp(`^export const ${name} = '([^']+)';$`, 'm');
}

function readConstant(source, name) {
  const match = source.match(constantPattern(name));
  if (!match) {
    throw new CheckFailedError(`Could not read ${VERSION_PATH}:${name}; keep it as an exported string constant.`);
  }
  return match[1];
}

function writeConstant(source, name, value) {
  return source.replace(constantPattern(name), `export const ${name} = '${value}';`);
}

/** `chore(site): 同步 A v1 与 B v2 的发布版本`, the subject the hand-made syncs used. */
function commitSubject(updates) {
  const named = updates.map(({ product, version }) => `${product.name} ${version}`);
  const list = named.length === 1 ? named[0] : `${named.slice(0, -1).join('、')} 与 ${named.at(-1)}`;
  return `chore(site): 同步 ${list} 的发布版本`;
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
  if (!SAFE_TAG.test(release.tag_name)) {
    throw new CheckFailedError(`${repository}: tag ${JSON.stringify(release.tag_name)} has characters a version constant cannot hold.`);
  }

  const publishedAt = new Date(release.published_at);
  if (Number.isNaN(publishedAt.valueOf())) {
    throw new CheckFailedError(`${repository}: invalid published_at value ${JSON.stringify(release.published_at)}.`);
  }

  return {
    tag: release.tag_name,
    released: publishedAt.toISOString().slice(0, 10),
    publishedAt: release.published_at,
  };
}

function printDrift(product, committed, live) {
  console.error(`--- ${VERSION_PATH} (committed)`);
  console.error(`+++ GitHub ${product.repository} latest stable release`);
  console.error(`@@ ${product.versionConstant} / ${product.releasedConstant} @@`);
  if (committed.tag !== live.tag) {
    if (live.tag.startsWith(committed.tagPrefix)) {
      console.error(`- ${product.versionConstant} = '${committed.version}'`);
      console.error(`+ ${product.versionConstant} = '${live.tag.slice(committed.tagPrefix.length)}'`);
    } else {
      // The tags no longer start the way the committed prefix says: the prefix itself moved.
      console.error(`- tag '${committed.tag}' (${product.tagPrefixConstant ?? 'no prefix'} + ${product.versionConstant})`);
      console.error(`+ tag '${live.tag}'`);
    }
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
      products.map((product) => {
        const version = readConstant(source, product.versionConstant);
        const tagPrefix = product.tagPrefixConstant ? readConstant(source, product.tagPrefixConstant) : '';
        return [
          product.repository,
          { version, tagPrefix, tag: `${tagPrefix}${version}`, released: readConstant(source, product.releasedConstant) },
        ];
      }),
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
    return local.tag !== live.tag || local.released !== live.released;
  });

  if (drift.length > 0 && WRITE) {
    return writeDrift(source, committed, drift);
  }

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
    const { version } = committed.get(product.repository);
    const tag = live.tag === version ? '' : `tag ${live.tag}, `;
    console.log(`✓ ${product.name}: ${version} / ${live.released} (${tag}${live.publishedAt})`);
  }
  console.log('All committed product versions match the latest stable GitHub releases.');
  return 0;
}

/** Rewrites the drifted constants; a tag whose prefix moved needs a person, so nothing is written then. */
async function writeDrift(source, committed, drift) {
  const updates = [];
  for (const check of drift) {
    const { product, live } = check.value;
    const local = committed.get(product.repository);
    if (!live.tag.startsWith(local.tagPrefix)) {
      console.error('VERSION DRIFT DETECTED');
      printDrift(product, local, live);
      console.error(`${product.name}: the tag no longer starts with ${product.tagPrefixConstant}; update ${VERSION_PATH} by hand.`);
      return EXIT_DRIFT;
    }
    updates.push({ product, version: live.tag.slice(local.tagPrefix.length), released: live.released, local });
  }
  let next = source;
  for (const { product, version, released, local } of updates) {
    next = writeConstant(next, product.versionConstant, version);
    next = writeConstant(next, product.releasedConstant, released);
    console.log(`updated ${product.name}: ${local.version} / ${local.released} -> ${version} / ${released}`);
  }
  await writeFile(VERSION_FILE, next);
  console.log(`COMMIT_SUBJECT=${commitSubject(updates)}`);
  return 0;
}

process.exitCode = await main();
