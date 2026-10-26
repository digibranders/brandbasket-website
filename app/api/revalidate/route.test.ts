import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidateTag }));

import { POST } from "./route";

const SECRET = "s".repeat(32);
const call = (headers: Record<string, string>, body: unknown): Promise<Response> =>
  POST(new Request("https://brandbasket.in/api/revalidate", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) }));

beforeEach(() => {
  revalidateTag.mockClear();
  vi.stubEnv("REVALIDATE_SECRET", SECRET);
});

describe("POST /api/revalidate", () => {
  it("purges the blog tag at once, serving nothing stale", async () => {
    const response = await call({ Authorization: `Bearer ${SECRET}` }, { tags: ["blog"] });
    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("blog", { expire: 0 });
  });

  it("refuses a missing or wrong secret", async () => {
    expect((await call({}, { tags: ["blog"] })).status).toBe(401);
    expect((await call({ Authorization: `Bearer ${"x".repeat(32)}` }, { tags: ["blog"] })).status).toBe(401);
    expect((await call({ Authorization: "Bearer " }, { tags: ["blog"] })).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("purges nothing but the blog tag", async () => {
    for (const body of [{ tags: ["pricing"] }, { tags: ["blog", "pricing"] }, { tags: [] }, {}, "nope"]) {
      expect((await call({ Authorization: `Bearer ${SECRET}` }, body)).status).toBe(400);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
