import { describe, expect, it } from "vitest";
import { SOCIAL_CONTROL, SOCIAL_HOW, SOCIAL_REPORT, SOCIAL_WEEK } from "./social-page";

describe("social media page copy", () => {
  it("shows the plan's week: three single posts, one carousel and one reel, on days that exist", () => {
    const kinds = SOCIAL_WEEK.posts.map((post) => post.kind);
    expect(kinds.filter((kind) => kind === "post")).toHaveLength(3);
    expect(kinds.filter((kind) => kind === "carousel")).toHaveLength(1);
    expect(kinds.filter((kind) => kind === "reel")).toHaveLength(1);
    for (const post of SOCIAL_WEEK.posts) expect(SOCIAL_WEEK.days).toContain(post.day);
    expect(new Set(SOCIAL_WEEK.posts.map((post) => post.day)).size).toBe(SOCIAL_WEEK.posts.length);
  });

  it("allows one topic of the owner's own a week", () => {
    expect(SOCIAL_WEEK.posts.filter((post) => post.own)).toHaveLength(1);
  });

  it("marks sample numbers as an example", () => {
    expect(SOCIAL_WEEK.chip).toMatch(/example/i);
    expect(SOCIAL_REPORT.chip).toMatch(/example/i);
  });

  it("keeps step and control titles unique, since they are list keys", () => {
    for (const titles of [SOCIAL_HOW.steps.map((s) => s.title), SOCIAL_CONTROL.items.map((i) => i.title)]) expect(new Set(titles).size).toBe(titles.length);
  });
});
