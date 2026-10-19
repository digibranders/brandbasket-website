// app/llms.txt/route.test.ts
import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("lists plan prices and the sign-up add-on discount", async () => {
    const body = await GET().text();
    expect(body).toContain("Digital Growth: ₹7,000 a month before 18% GST");
    expect(body).toContain("Local SEO + AEO: ₹25,000 a month before 18% GST");
    expect(body).toContain("Add-ons chosen at sign-up are 5% off for as long as they run; add-ons added later are charged at the listed price.");
  });
});
