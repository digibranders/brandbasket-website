// content/about.test.ts
import { describe, expect, it } from "vitest";
import { ABOUT } from "./about";
import { STEPS } from "./home";

describe("about content", () => {
  it("fits the SEO limits", () => {
    expect(ABOUT.title).toBe("About Brandbasket, a brand of Digibranders");
    expect(ABOUT.title.length).toBeLessThanOrEqual(60);
    expect(ABOUT.description.length).toBeGreaterThanOrEqual(120);
    expect(ABOUT.description.length).toBeLessThanOrEqual(155);
  });
  it("reuses the homepage steps", () => {
    expect(ABOUT.how.steps).toBe(STEPS);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify(ABOUT)).not.toMatch(/[\u2013\u2014]/);
  });
});
