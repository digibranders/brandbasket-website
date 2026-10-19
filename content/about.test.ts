// content/about.test.ts
import { describe, expect, it } from "vitest";
import { ABOUT } from "./about";
import { STEPS } from "./home";

describe("about content", () => {
  it("reuses the homepage steps", () => {
    expect(ABOUT.how.steps).toBe(STEPS);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify(ABOUT)).not.toMatch(/[\u2013\u2014]/);
  });
});
