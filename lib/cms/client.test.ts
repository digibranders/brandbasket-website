import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { cmsGet, CmsError } from "./client";

const ENV = { url: "https://cms.test", token: "t".repeat(32) };
const schema = z.object({ ok: z.literal(true) });
const reply = (status: number, body: unknown = { ok: true }): Response => new Response(JSON.stringify(body), { status });
const sleep = vi.fn(async () => undefined);
const get = (fetcher: typeof fetch) => cmsGet("/api/site/x", schema, { env: ENV, fetcher, sleep });

describe("cmsGet", () => {
  it("sends the bearer token, caches under the blog tag and returns the parsed JSON", async () => {
    const fetcher = vi.fn(async () => reply(200));
    await expect(get(fetcher as unknown as typeof fetch)).resolves.toEqual({ ok: true, data: { ok: true } });
    expect(fetcher).toHaveBeenCalledWith("https://cms.test/api/site/x", expect.objectContaining({ headers: { Authorization: `Bearer ${ENV.token}`, Accept: "application/json" }, next: { tags: ["blog"], revalidate: 3600 } }));
  });

  it("does not cache a fresh read", async () => {
    const fetcher = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(async () => reply(200));
    await cmsGet("/p", schema, { env: ENV, fetcher: fetcher as unknown as typeof fetch, fresh: true });
    expect(fetcher).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ cache: "no-store" }));
    expect(fetcher.mock.calls[0]?.[1]).not.toHaveProperty("next");
  });

  it("reports not found only when the CMS answers 404 or 410", async () => {
    await expect(get((async () => reply(404, { error: "Not found" })) as unknown as typeof fetch)).resolves.toEqual({ ok: false, status: 404 });
    await expect(get((async () => reply(410)) as unknown as typeof fetch)).resolves.toEqual({ ok: false, status: 410 });
  });

  it("tries again after a 5xx or a network error, then succeeds", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(reply(502)).mockRejectedValueOnce(new Error("socket hang up")).mockResolvedValueOnce(reply(200));
    await expect(get(fetcher as unknown as typeof fetch)).resolves.toMatchObject({ ok: true });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("throws, never says not found, when the CMS stays down", async () => {
    const fetcher = vi.fn(async () => reply(503));
    await expect(get(fetcher as unknown as typeof fetch)).rejects.toThrow(/after 3 tries: HTTP 503/);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("does not retry a refusal, which means this site is misconfigured", async () => {
    const fetcher = vi.fn(async () => reply(401, { error: "Unauthorized" }));
    await expect(get(fetcher as unknown as typeof fetch)).rejects.toThrow(CmsError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("throws on a shape it does not know", async () => {
    await expect(get((async () => reply(200, { ok: false })) as unknown as typeof fetch)).rejects.toThrow(/shape this site does not know/);
  });
});
