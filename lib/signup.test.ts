import { describe, expect, it } from "vitest";
import { signupHref } from "./signup";

describe("signupHref", () => {
  it("sends the picked plans to the app's sign-in, in catalogue order", () => {
    expect(signupHref({ website: true, growth: false, search: true })).toBe("https://app.brandbasket.in/login?plan=website%2Csearch");
    expect(signupHref({ website: false, growth: true, search: true })).toBe("https://app.brandbasket.in/login?plan=growth%2Csearch");
  });
});
