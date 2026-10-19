import { describe, expect, it } from "vitest";
import { MAX_TOKEN_AGE_MS, MIN_FILL_MS, planTokenUse, TOKEN_REFRESH_AGE_MS } from "./form-fields";

const NOW = 10_000_000;

describe("planTokenUse", () => {
  it("fetches a token when there is none", () => expect(planTokenUse(null, NOW)).toEqual({ kind: "refresh" }));

  it("uses a token that is old enough and not near expiry", () => expect(planTokenUse(NOW - 60_000, NOW)).toEqual({ kind: "use" }));

  it("waits out the minimum fill time, with a margin, for a fresh token", () => {
    const plan = planTokenUse(NOW - 200, NOW);
    expect(plan.kind).toBe("wait");
    if (plan.kind === "wait") expect(plan.ms).toBeGreaterThan(MIN_FILL_MS - 200);
  });

  it("refreshes a token about ten minutes before the server would expire it", () => {
    expect(TOKEN_REFRESH_AGE_MS).toBeLessThan(MAX_TOKEN_AGE_MS);
    expect(planTokenUse(NOW - TOKEN_REFRESH_AGE_MS, NOW)).toEqual({ kind: "refresh" });
    expect(planTokenUse(NOW - (TOKEN_REFRESH_AGE_MS - 1), NOW)).toEqual({ kind: "use" });
  });
});
