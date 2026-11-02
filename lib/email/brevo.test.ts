import { afterEach, describe, expect, it, vi } from "vitest";

const env = vi.hoisted(() => ({ BREVO_API_KEY: "" }));
vi.mock("@/lib/env", () => ({ serverEnv: () => env }));

import { sendTransactionalEmail } from "./brevo";

const MAIL = {
  sender: { email: "hello@brandbasket.in" },
  to: [{ email: "owner@example.test" }],
  subject: "Hello",
  htmlContent: "<p>Hi</p>",
  textContent: "Hi",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("sendTransactionalEmail without a live key", () => {
  it("skips delivery outside production, so local development needs no Brevo account", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    env.BREVO_API_KEY = "local-dev-key";
    vi.stubEnv("NODE_ENV", "development");
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    await expect(sendTransactionalEmail(MAIL)).resolves.toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("still calls Brevo in production, so a missing key fails loudly instead of reporting mail as sent", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response("unauthorized", { status: 401 }));
    vi.stubGlobal("fetch", fetchSpy);
    env.BREVO_API_KEY = "";
    vi.stubEnv("NODE_ENV", "production");
    await expect(sendTransactionalEmail(MAIL)).rejects.toThrow(/401/);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
