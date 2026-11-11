import { describe, expect, it } from "vitest";
import { showsDock } from "./dock-paths";

describe("showsDock", () => {
  it("shows on the pages that sell the plans", () => {
    expect(showsDock("/")).toBe(true);
    expect(showsDock("/pricing")).toBe(true);
    expect(showsDock("/services/managed-website")).toBe(true);
  });
  it("stays off the contact form, About and the legal pages", () => {
    for (const path of ["/contact", "/about", "/privacy", "/terms", "/refund", "/shipping", "/notice", "/error-preview"]) expect(showsDock(path)).toBe(false);
  });
});
