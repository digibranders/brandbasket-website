import { describe, expect, it } from "vitest";
import { signupHref } from "./signup";

describe("signupHref", () => {
  it("sends people to the contact form while the platform is not live", () => {
    expect(signupHref({ website: true, growth: true, search: false }, undefined)).toBe("/contact?plan=website%2Cgrowth#start");
  });

  it("leaves the website out of a basket that does not hold it", () => {
    expect(signupHref({ website: false, growth: true, search: true }, undefined)).toBe("/contact?plan=growth%2Csearch#start");
  });

  it("builds the platform login link with the picked plans", () => {
    expect(signupHref({ website: true, growth: false, search: true }, "https://app.brandbasket.in")).toBe("https://app.brandbasket.in/login?plan=website%2Csearch");
  });
});
