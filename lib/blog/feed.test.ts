import { describe, expect, it } from "vitest";
import post from "../../e2e/fixtures/cms/post-card.json";
import { postCardSchema } from "../cms/schema";
import { buildFeed, escapeXml } from "./feed";

const card = postCardSchema.parse(post);
const BUILT = new Date("2026-10-26T06:30:00.000Z");

describe("buildFeed", () => {
  it("lists each post with its address, date, category and excerpt", () => {
    const xml = buildFeed([card], BUILT);
    expect(xml).toContain("<title>What does a website cost in India?</title>");
    expect(xml).toContain("<link>https://www.brandbasket.in/blog/website-cost-india</link>");
    expect(xml).toContain('<guid isPermaLink="true">https://www.brandbasket.in/blog/website-cost-india</guid>');
    expect(xml).toContain("<pubDate>Mon, 05 Oct 2026 04:30:00 GMT</pubDate>");
    expect(xml).toContain("<category>Website basics</category>");
    expect(xml).toContain("<lastBuildDate>Mon, 26 Oct 2026 06:30:00 GMT</lastBuildDate>");
  });

  it("escapes what would break the XML", () => {
    expect(escapeXml(`A & B <c> "d" 'e'`)).toBe("A &amp; B &lt;c&gt; &quot;d&quot; &apos;e&apos;");
    expect(buildFeed([{ ...card, title: "Cats & <dogs>" }], BUILT)).toContain("<title>Cats &amp; &lt;dogs&gt;</title>");
  });

  it("is still a valid feed with no posts", () => {
    const xml = buildFeed([], BUILT);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});
