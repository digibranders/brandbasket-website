import { describe, expect, it } from "vitest";
import { signupHref } from "./signup";

describe("signupHref", () => {
  it("sends people to the contact form while the platform is not live", () => {
    expect(signupHref({ growth: true, search: false }, undefined)).toBe("/contact?plan=website%2Cgrowth#start");
  });

  it("builds the platform login link with the picked plans", () => {
    expect(signupHref({ growth: false, search: true }, "https://app.brandbasket.in")).toBe("https://app.brandbasket.in/login?plan=website%2Csearch");
  });
});
