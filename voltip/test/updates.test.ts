import { describe, expect, it } from "vitest";

import { android, type CacheLike, download, FILE_TTL, LATEST_MANIFEST, MANIFEST_TTL, mirrored, releaseFile, route, type UpdateDeps } from "../functions/_lib/updates";

const SITE = "https://voltip.firlab.app";
const RELEASES = "https://github.com/sunerpy/voltip/releases";

const MANIFEST = {
  version: "0.0.52",
  notes: "## 0.0.52\n\n* 手机选择框改为底部面板",
  pub_date: "2026-10-09T15:01:44Z",
  platforms: {
    "windows-x86_64": { url: `${RELEASES}/download/v0.0.52/Voltip_0.0.52_x64-setup.exe`, signature: "c2lnLXdpbg==" },
    "darwin-aarch64": { url: `${RELEASES}/download/v0.0.52/Voltip_0.0.52_aarch64.app.tar.gz`, signature: "c2lnLW1hYw==" },
    "linux-x86_64": { url: `${RELEASES}/download/v0.0.52/Voltip_0.0.52_amd64.AppImage`, signature: "c2lnLWxpbnV4" },
  },
};

/** A cache over a Map that honours `max-age` against a clock the test moves. */
function memoryCache(clock: () => number): CacheLike & { keys: () => string[] } {
  const entries = new Map<string, { body: ArrayBuffer; status: number; headers: [string, string][]; expires: number }>();
  return {
    keys: () => [...entries.keys()],
    async match(request) {
      const entry = entries.get(request.url);
      if (!entry || entry.expires <= clock()) return undefined;
      return new Response(entry.body.slice(0), { status: entry.status, headers: entry.headers });
    },
    async put(request, response) {
      const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get("cache-control") ?? "")?.[1] ?? 0);
      entries.set(request.url, { body: await response.arrayBuffer(), status: response.status, headers: [...response.headers], expires: clock() + maxAge * 1000 });
    },
  };
}

interface Call {
  url: string;
  method: string;
}

function setup(github: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const calls: Call[] = [];
  let now = 1_790_000_000_000;
  const cache = memoryCache(() => now);
  const deps: UpdateDeps = {
    now: () => now,
    fetch: (async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = String(input);
      calls.push({ url, method: init.method ?? "GET" });
      return github(url, init);
    }) as typeof fetch,
    cache: () => cache,
  };
  return { deps, calls, cache, advance: (ms: number) => (now += ms) };
}

const get = (path: string, method = "GET") => new Request(`${SITE}${path}`, { method });
const pathOf = (path: string) => path.replace(/^\/updates\//, "").split("/");

/** GitHub as the channel sees it: the manifest, an APK probe, and the files. */
function github(files: Record<string, string> = {}) {
  return (url: string, init: RequestInit): Response => {
    if (url === LATEST_MANIFEST) return Response.json(MANIFEST);
    const name = url.slice(url.lastIndexOf("/") + 1);
    if (init.method === "HEAD") return new Response(null, { status: name in files ? 302 : 404, headers: name in files ? { location: "https://objects.example/x" } : {} });
    if (name in files) return new Response(files[name], { headers: { "content-type": "application/octet-stream", "content-length": String(files[name]!.length), etag: '"e1"' } });
    return new Response("Not Found", { status: 404 });
  };
}

describe("update channel", () => {
  it("serves the release's manifest with every package on this site and the signatures unchanged", async () => {
    const { deps, calls } = setup(github());
    const answer = await route(get("/updates/latest.json"), ["latest.json"], deps);
    expect(answer.status).toBe(200);
    expect(answer.headers.get("cache-control")).toBe(`public, max-age=${MANIFEST_TTL}`);
    const body = (await answer.json()) as typeof MANIFEST;
    expect(body.version).toBe("0.0.52");
    expect(body.notes).toBe(MANIFEST.notes);
    expect(body.platforms["windows-x86_64"]).toEqual({ url: `${SITE}/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe`, signature: "c2lnLXdpbg==" });
    expect(body.platforms["linux-x86_64"].url).toBe(`${SITE}/updates/download/v0.0.52/Voltip_0.0.52_amd64.AppImage`);
    expect(calls).toEqual([{ url: LATEST_MANIFEST, method: "GET" }]);
  });

  it("asks GitHub again only after five minutes", async () => {
    const { deps, calls, advance } = setup(github());
    await route(get("/updates/latest.json"), ["latest.json"], deps);
    advance((MANIFEST_TTL - 1) * 1000);
    await route(get("/updates/latest.json?x=1"), ["latest.json"], deps);
    expect(calls).toHaveLength(1);
    advance(2000);
    await route(get("/updates/latest.json"), ["latest.json"], deps);
    expect(calls).toHaveLength(2);
  });

  it("regression: answers with the last good manifest while GitHub is unreachable, and with a 502 without one", async () => {
    let down = false;
    const { deps, advance } = setup((url, init) => {
      if (down) throw new TypeError("network connection lost");
      return github()(url, init);
    });
    expect((await route(get("/updates/latest.json"), ["latest.json"], deps)).status).toBe(200);
    down = true;
    advance((MANIFEST_TTL + 1) * 1000);
    const kept = await route(get("/updates/latest.json"), ["latest.json"], deps);
    expect(kept.status).toBe(200);
    expect(kept.headers.get("x-voltip-stale")).toBe("1");
    expect(((await kept.json()) as typeof MANIFEST).version).toBe("0.0.52");

    const empty = setup(() => {
      throw new TypeError("network connection lost");
    });
    expect((await route(get("/updates/latest.json"), ["latest.json"], empty.deps)).status).toBe(502);
  });

  it("refuses a manifest that is not one, so the app tries its next address", async () => {
    const { deps } = setup((url) => (url === LATEST_MANIFEST ? Response.json({ version: "latest", platforms: {} }) : new Response("", { status: 404 })));
    expect((await route(get("/updates/latest.json"), ["latest.json"], deps)).status).toBe(502);
  });

  it("gives the phone the latest release the way GitHub's API does, with the APK on this site", async () => {
    const { deps, calls } = setup(github({ "Voltip_0.0.52_android_arm64.apk": "apk" }));
    const answer = await android(get("/updates/android.json"), deps);
    expect(answer.status).toBe(200);
    expect(await answer.json()).toEqual({
      tag_name: "v0.0.52",
      body: MANIFEST.notes,
      published_at: MANIFEST.pub_date,
      assets: [{ name: "Voltip_0.0.52_android_arm64.apk", browser_download_url: `${SITE}/updates/download/v0.0.52/Voltip_0.0.52_android_arm64.apk` }],
    });
    expect(calls.map((c) => c.method)).toEqual(["GET", "HEAD"]);
    await android(get("/updates/android.json"), deps);
    expect(calls).toHaveLength(2);
  });

  it("lists no APK for a release that has none", async () => {
    const { deps } = setup(github());
    expect(((await (await android(get("/updates/android.json"), deps)).json()) as { assets: unknown[] }).assets).toEqual([]);
  });

  it("copies a release file into the cache once and serves it from there", async () => {
    const { deps, calls, cache } = setup(github({ "Voltip_0.0.52_x64-setup.exe": "MZ-installer" }));
    const first = await download(get("/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe"), "v0.0.52", "Voltip_0.0.52_x64-setup.exe", deps);
    expect(first.status).toBe(200);
    expect(await first.text()).toBe("MZ-installer");
    expect(first.headers.get("content-disposition")).toBe('attachment; filename="Voltip_0.0.52_x64-setup.exe"');
    expect(first.headers.get("cache-control")).toBe(`public, max-age=${FILE_TTL}, immutable`);
    expect(first.headers.get("content-length")).toBe("12");
    expect(calls).toEqual([{ url: `${RELEASES}/download/v0.0.52/Voltip_0.0.52_x64-setup.exe`, method: "GET" }]);
    expect(cache.keys()).toContain(`${SITE}/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe`);

    const again = await route(get("/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe?from=app"), pathOf("/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe"), deps);
    expect(await again.text()).toBe("MZ-installer");
    const head = await route(get("/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe", "HEAD"), pathOf("/updates/download/v0.0.52/Voltip_0.0.52_x64-setup.exe"), deps);
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
    expect(calls).toHaveLength(1);
  });

  it("passes GitHub's 404 on and keeps nothing for it", async () => {
    const { deps, cache } = setup(github());
    const answer = await download(get("/updates/download/v0.0.99/Voltip_0.0.99_x64-setup.exe"), "v0.0.99", "Voltip_0.0.99_x64-setup.exe", deps);
    expect(answer.status).toBe(404);
    expect(cache.keys()).toEqual([]);
  });

  it("regression: serves this repository's release files only, and asks GitHub nothing for any other path", async () => {
    const { deps, calls } = setup(github({ "Voltip_0.0.52_x64-setup.exe": "MZ" }));
    for (const path of [
      "/updates/download/main/Voltip_0.0.52_x64-setup.exe",
      "/updates/download/v0.0.52/..%2F..%2Fother",
      "/updates/download/v0.0.52/.hidden",
      "/updates/download/v0.0.52/a/b",
      "/updates/download/v0.0.52",
      "/updates/other.json",
      "/updates/",
    ]) {
      expect((await route(get(path), pathOf(path).filter(Boolean), deps)).status, path).toBe(404);
    }
    expect((await route(get("/updates/latest.json", "POST"), ["latest.json"], deps)).status).toBe(405);
    expect(calls).toEqual([]);
    expect(releaseFile("v0.0.52", "Voltip_0.0.52_amd64.AppImage")).toBe(true);
    expect(releaseFile("v0.0.52", "x..y")).toBe(false);
  });

  it("moves only this repository's release addresses to the site", () => {
    expect(mirrored(`${RELEASES}/download/v0.0.52/Voltip_0.0.52_amd64.deb`, SITE)).toBe(`${SITE}/updates/download/v0.0.52/Voltip_0.0.52_amd64.deb`);
    expect(mirrored("https://github.com/someone/else/releases/download/v1.0.0/x.exe", SITE)).toBe("https://github.com/someone/else/releases/download/v1.0.0/x.exe");
    expect(mirrored(`${RELEASES}/download/v0.0.52/a/b.exe`, SITE)).toBe(`${RELEASES}/download/v0.0.52/a/b.exe`);
  });
});
