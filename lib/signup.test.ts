import { describe, expect, it } from "vitest";
import { loginHref, signupHref, startHref } from "./signup";

describe("signupHref", () => {
  it("sends the picked plans to the app's sign-in, in catalogue order", () => {
    expect(signupHref({ website: true, social: false, ads: true }, false)).toBe("https://app.brandbasket.in/login?plan=website%2Cads");
    expect(signupHref({ website: false, social: true, ads: true }, false)).toBe("https://app.brandbasket.in/login?plan=social%2Cads");
  });
  it("names monitoring last when it was added, the id brandbasket-platform reads (account-entry.ts)", () => {
    expect(signupHref({ website: true, social: true, ads: false }, true)).toBe("https://app.brandbasket.in/login?plan=website%2Csocial%2Cmonitoring");
    expect(signupHref({ website: true, social: true, ads: true }, true)).toBe("https://app.brandbasket.in/login?plan=website%2Csocial%2Cads%2Cmonitoring");
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

describe("signupHref and the kind of website", () => {
  const pick = { website: true, social: true, ads: false };
  it("adds nothing for a B2B website", () => {
    expect(new URL(signupHref(pick, false, "b2b")).searchParams.has("site")).toBe(false);
    expect(new URL(signupHref(pick, false)).searchParams.has("site")).toBe(false);
  });
  it("says ecommerce when the basket holds the website and the kind is ecommerce", () => {
    const url = new URL(signupHref(pick, false, "ecommerce"));
    expect(url.searchParams.get("plan")).toBe("website,social");
    expect(url.searchParams.get("site")).toBe("ecommerce");
  });
  it("says nothing about a kind when there is no website to build", () => {
    expect(new URL(signupHref({ website: false, social: true, ads: false }, false, "ecommerce")).searchParams.has("site")).toBe(false);
  });
});
