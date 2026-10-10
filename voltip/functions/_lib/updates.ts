/**
 * The apps' update channel on this site (Voltip docs/dictation.md §9, §20.9): the desktop
 * updater's manifest, the phone's latest release, and the release files both point at, served from
 * Cloudflare instead of GitHub, which many networks in China reach slowly or not at all.
 *
 * GitHub stays the source. Every answer is built from the repository's latest release, and a
 * release file is copied into the data centre's cache the first time someone there asks for it, so
 * later downloads come from Cloudflare. Nothing is signed here and nothing needs to be: the desktop
 * app checks each package against the minisign key built into it, and Android installs an APK over
 * the app only when it carries the same signing key.
 *
 * Only this repository's release files are served, by tag and file name; anything else is a 404
 * without a request to GitHub.
 */
import { defaultDeps, type Deps } from "./env";

export const REPOSITORY = "sunerpy/voltip";
const RELEASES = `https://github.com/${REPOSITORY}/releases`;
/** The single-writer manifest the release workflow attaches to every release. */
export const LATEST_MANIFEST = `${RELEASES}/latest/download/latest.json`;

/** How long the manifest is reused: a new release reaches every app within five minutes. */
export const MANIFEST_TTL = 300;
/** How long the last good manifest is kept to answer with while GitHub cannot be reached. */
export const STALE_TTL = 7 * 24 * 3600;
/** Release files never change under a tag. */
export const FILE_TTL = 365 * 24 * 3600;
/** Cloudflare's cache takes files up to 512 MB; larger ones are passed through uncached. */
export const MAX_CACHED_BYTES = 512 * 1024 * 1024;

const TAG = /^v\d+\.\d+\.\d+$/;
const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/** The part of the Cache API the channel uses, so tests can pass a Map. */
export interface CacheLike {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export interface UpdateDeps extends Deps {
  cache: () => CacheLike;
}

export const defaultUpdateDeps: UpdateDeps = {
  ...defaultDeps,
  cache: () => (caches as unknown as { default: CacheLike }).default,
};

interface Platform {
  url: string;
  signature: string;
  [key: string]: unknown;
}

interface Manifest {
  version: string;
  notes?: string;
  pub_date?: string;
  platforms: Record<string, Platform>;
  [key: string]: unknown;
}

function text(status: number, body: string, headers: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", ...headers },
  });
}

function jsonBody(body: unknown, maxAge: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}`,
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": "*",
      ...headers,
    },
  });
}

/** `/updates/<path>` of this site: the cache key of an answer, without the visitor's query. */
function siteKey(request: Request, path: string): Request {
  return new Request(new URL(`/updates/${path}`, request.url).toString(), { method: "GET" });
}

/** A release file is one of this repository's, named the way GitHub serves it. */
export function releaseFile(tag: string, name: string): boolean {
  return TAG.test(tag) && NAME.test(name) && !name.includes("..");
}

/** `https://github.com/sunerpy/voltip/releases/download/<tag>/<name>` → the same file on this site. */
export function mirrored(url: string, origin: string): string {
  const prefix = `${RELEASES}/download/`;
  if (!url.startsWith(prefix)) return url;
  const [tag = "", name = "", ...rest] = url.slice(prefix.length).split("/");
  if (rest.length > 0 || !releaseFile(tag, name)) return url;
  return `${origin}/updates/download/${tag}/${name}`;
}

function readManifest(value: unknown): Manifest | null {
  if (typeof value !== "object" || value === null) return null;
  const m = value as Partial<Manifest>;
  if (typeof m.version !== "string" || !/^\d+\.\d+\.\d+$/.test(m.version)) return null;
  if (typeof m.platforms !== "object" || m.platforms === null) return null;
  for (const p of Object.values(m.platforms)) {
    if (typeof p !== "object" || p === null || typeof p.url !== "string" || typeof p.signature !== "string") return null;
  }
  return m as Manifest;
}

/** GitHub's latest manifest with every package address moved to this site. */
async function fetchManifest(origin: string, deps: UpdateDeps): Promise<Manifest | null> {
  let response: Response;
  try {
    response = await deps.fetch(LATEST_MANIFEST, { redirect: "follow", headers: { "user-agent": "voltip-docs-updates" } });
  } catch {
    return null;
  }
  if (!response.ok) return null;
  let manifest: Manifest | null;
  try {
    manifest = readManifest(await response.json());
  } catch {
    return null;
  }
  if (!manifest) return null;
  const platforms: Record<string, Platform> = {};
  for (const [key, p] of Object.entries(manifest.platforms)) platforms[key] = { ...p, url: mirrored(p.url, origin) };
  return { ...manifest, platforms };
}

/**
 * The manifest, from the cache while it is fresh, else from GitHub; while GitHub cannot be reached,
 * the last good copy of the past week (`x-voltip-stale: 1`), and with none a 502, on which the
 * desktop updater tries its next address.
 */
async function currentManifest(request: Request, deps: UpdateDeps): Promise<{ manifest: Manifest; stale: boolean } | null> {
  const cache = deps.cache();
  const fresh = siteKey(request, "latest.json");
  const lastGood = siteKey(request, "latest.json?last-good");
  const hit = await cache.match(fresh);
  if (hit) {
    const manifest = readManifest(await hit.json());
    if (manifest) return { manifest, stale: false };
  }
  const manifest = await fetchManifest(new URL(request.url).origin, deps);
  if (manifest) {
    await cache.put(fresh, jsonBody(manifest, MANIFEST_TTL));
    await cache.put(lastGood, jsonBody(manifest, STALE_TTL));
    return { manifest, stale: false };
  }
  const old = await cache.match(lastGood);
  const kept = old ? readManifest(await old.json()) : null;
  return kept ? { manifest: kept, stale: true } : null;
}

/** `GET /updates/latest.json`: what tauri-plugin-updater reads. */
export async function latest(request: Request, deps: UpdateDeps = defaultUpdateDeps): Promise<Response> {
  const current = await currentManifest(request, deps);
  if (!current) return text(502, "the latest release could not be read from GitHub");
  return jsonBody(current.manifest, MANIFEST_TTL, current.stale ? { "x-voltip-stale": "1" } : {});
}

/** The phone's APK of `version`, the name `.github/release-targets.json` gives it. */
export function apkName(version: string): string {
  return `Voltip_${version}_android_arm64.apk`;
}

/**
 * `GET /updates/android.json`: the latest release in the shape of GitHub's latest-release answer,
 * the fields the phone reads (`tag_name`, `body`, `published_at`, `assets`), with the APK on this
 * site. A release without an APK lists no assets, which the phone reports as such.
 */
export async function android(request: Request, deps: UpdateDeps = defaultUpdateDeps): Promise<Response> {
  const cache = deps.cache();
  const key = siteKey(request, "android.json");
  const hit = await cache.match(key);
  if (hit) return hit;
  const current = await currentManifest(request, deps);
  if (!current) return text(502, "the latest release could not be read from GitHub");
  const { version, notes, pub_date } = current.manifest;
  const tag = `v${version}`;
  const name = apkName(version);
  const apk = { name, browser_download_url: `${new URL(request.url).origin}/updates/download/${tag}/${name}` };
  let assets = [apk];
  try {
    const probe = await deps.fetch(`${RELEASES}/download/${tag}/${name}`, { method: "HEAD", redirect: "manual", headers: { "user-agent": "voltip-docs-updates" } });
    // GitHub answers an existing file with a redirect to its storage, a missing one with a 404.
    if (probe.status === 404) assets = [];
  } catch {
    // An unanswered probe is no reason to hide the release: every release carries the APK.
  }
  const answer = { tag_name: tag, body: notes ?? null, published_at: pub_date ?? null, assets };
  if (current.stale) return jsonBody(answer, MANIFEST_TTL, { "x-voltip-stale": "1" });
  await cache.put(key, jsonBody(answer, MANIFEST_TTL));
  return jsonBody(answer, MANIFEST_TTL);
}

function fileHeaders(upstream: Response, name: string): Headers {
  const headers = new Headers({
    "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
    "content-disposition": `attachment; filename="${name}"`,
    "cache-control": `public, max-age=${FILE_TTL}, immutable`,
    "x-content-type-options": "nosniff",
  });
  for (const header of ["content-length", "etag", "last-modified"]) {
    const value = upstream.headers.get(header);
    if (value) headers.set(header, value);
  }
  return headers;
}

function forMethod(response: Response, method: string): Response {
  return method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
}

/**
 * `GET|HEAD /updates/download/<tag>/<name>`: one of this repository's release files, from the
 * data centre's cache, or copied there from GitHub first. The copy finishes before the answer
 * starts, so a download never waits on GitHub's pace after its first bytes.
 */
export async function download(request: Request, tag: string, name: string, deps: UpdateDeps = defaultUpdateDeps): Promise<Response> {
  if (!releaseFile(tag, name)) return text(404, "not found");
  const cache = deps.cache();
  const key = siteKey(request, `download/${tag}/${name}`);
  const hit = await cache.match(key);
  if (hit) return forMethod(hit, request.method);
  const source = `${RELEASES}/download/${tag}/${name}`;
  const fetchFile = () => deps.fetch(source, { redirect: "follow", headers: { "user-agent": "voltip-docs-updates" } });
  let upstream: Response;
  try {
    upstream = await fetchFile();
  } catch {
    return text(502, "the file could not be read from GitHub");
  }
  if (upstream.status === 404) return text(404, "not found");
  if (!upstream.ok || !upstream.body) return text(502, `GitHub answered ${upstream.status}`);
  const length = Number(upstream.headers.get("content-length") ?? NaN);
  if (Number.isFinite(length) && length <= MAX_CACHED_BYTES) {
    try {
      await cache.put(key, new Response(upstream.body, { headers: fileHeaders(upstream, name) }));
      const stored = await cache.match(key);
      if (stored) return forMethod(stored, request.method);
    } catch {
      // The body went into the failed copy; read the file once more and pass it through.
    }
    try {
      upstream = await fetchFile();
    } catch {
      return text(502, "the file could not be read from GitHub");
    }
    if (!upstream.ok || !upstream.body) return text(502, `GitHub answered ${upstream.status}`);
  }
  return forMethod(new Response(upstream.body, { headers: fileHeaders(upstream, name) }), request.method);
}

/** `/updates/*`: the three answers above, and a 404 for anything else. */
export async function route(request: Request, path: readonly string[], deps: UpdateDeps = defaultUpdateDeps): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return text(405, "method not allowed", { allow: "GET, HEAD" });
  const [first = "", second = "", third = "", ...rest] = path;
  if (rest.length === 0 && first === "download" && second && third) return download(request, second, third, deps);
  if (path.length === 1 && first === "latest.json") return forMethod(await latest(request, deps), request.method);
  if (path.length === 1 && first === "android.json") return forMethod(await android(request, deps), request.method);
  return text(404, "not found");
}
