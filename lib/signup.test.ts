import { describe, expect, it } from "vitest";
import { loginHref, signupHref, startHref } from "./signup";

describe("signupHref", () => {
  it("sends the picked plans to the app's sign-in, in catalogue order", () => {
    expect(signupHref({ website: true, growth: false, search: true })).toBe("https://app.brandbasket.in/login?plan=website%2Csearch");
    expect(signupHref({ website: false, growth: true, search: true })).toBe("https://app.brandbasket.in/login?plan=growth%2Csearch");
  });
});

describe("loginHref", () => {
  it("opens the app's sign-in with no plan in the address", () => {
    expect(loginHref()).toBe("https://app.brandbasket.in/login");
  });
});


describe("startHref", () => {
  it("opens the Managed Website sign-up with the sealed details", () => {
    expect(startHref("abc123")).toBe("https://app.brandbasket.in/login?plan=website&start=abc123");
  });

  it("is the plain Managed Website sign-up with no token", () => {
    expect(startHref(null)).toBe("https://app.brandbasket.in/login?plan=website");
  });
});
