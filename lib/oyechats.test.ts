import { describe, expect, it } from "vitest";
import { parseBotKey } from "./oyechats";

describe("parseBotKey", () => {
  it("is null when no key is set, so the contact page loads no chat", () => {
    expect(parseBotKey({})).toBeNull();
    expect(parseBotKey({ NEXT_PUBLIC_OYECHATS_BOT_KEY: "  " })).toBeNull();
  });
  it("accepts a bot key", () => {
    expect(parseBotKey({ NEXT_PUBLIC_OYECHATS_BOT_KEY: " bot-a1B2_c3 " })).toBe("bot-a1B2_c3");
  });
  it("throws naming the variable on a malformed key", () => {
    expect(() => parseBotKey({ NEXT_PUBLIC_OYECHATS_BOT_KEY: "https://evil.example" })).toThrow(/NEXT_PUBLIC_OYECHATS_BOT_KEY/);
  });
});
