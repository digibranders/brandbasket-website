import { describe, expect, it } from "vitest";
import { loginHref, signupHref, startHref } from "./signup";

describe("signupHref", () => {
  it("sends the picked plans to the app's sign-in, in catalogue order", () => {
    expect(signupHref({ website: true, social: false, ads: true })).toBe("https://app.brandbasket.in/login?plan=website%2Cads");
    expect(signupHref({ website: false, social: true, ads: true })).toBe("https://app.brandbasket.in/login?plan=social%2Cads");
  });
});

describe("loginHref", () => {
  it("opens the app's sign-in with no plan in the address", () => {
    expect(loginHref()).toBe("https://app.brandbasket.in/login");
  });
});


describe("startHref", () => {
  it("opens the Website Management sign-up with the sealed details", () => {
    expect(startHref("abc123")).toBe("https://app.brandbasket.in/login?plan=website&start=abc123");
  });

  it("is the plain Website Management sign-up with no token", () => {
    expect(startHref(null)).toBe("https://app.brandbasket.in/login?plan=website");
  });
});
