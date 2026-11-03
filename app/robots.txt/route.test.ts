// app/robots.txt/route.test.ts
import { describe, expect, it } from "vitest";
import { ANSWER_CRAWLERS, CONTENT_SIGNAL, robotsTxt, TRAINING_CRAWLERS } from "./route";

describe("robotsTxt", () => {
  it("closes the whole site before launch", () => {
    expect(robotsTxt(false)).toBe("User-Agent: *\nDisallow: /\n");
  });

  it("declares content signals on the default group and keeps the sitemap line", () => {
    const body = robotsTxt(true);
    expect(body).toContain(`User-Agent: *\nContent-Signal: ${CONTENT_SIGNAL}\nAllow: /\nDisallow: /api/\nDisallow: /blog/preview/`);
    expect(body).toContain("Sitemap: https://www.brandbasket.in/sitemap.xml");
  });

  it("allows answer crawlers and refuses training crawlers", () => {
    const body = robotsTxt(true);
    for (const bot of ANSWER_CRAWLERS) expect(body).toContain(`User-Agent: ${bot}\nAllow: /`);
    for (const bot of TRAINING_CRAWLERS) expect(body).toContain(`User-Agent: ${bot}\nDisallow: /\n`);
  });
});
