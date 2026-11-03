// lib/agents/markdown.test.ts
import { describe, expect, it } from "vitest";
import { estimateTokens, htmlToMarkdown, wantsMarkdown } from "./markdown";

describe("wantsMarkdown", () => {
  it("is false for browsers and for no header", () => {
    expect(wantsMarkdown(null)).toBe(false);
    expect(wantsMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(false);
    expect(wantsMarkdown("*/*")).toBe(false);
  });

  it("is true when markdown is asked for and ranks with or above html", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
    expect(wantsMarkdown("text/markdown, text/html;q=0.8")).toBe(true);
    expect(wantsMarkdown("text/html;q=0.5, text/markdown")).toBe(true);
  });

  it("is false when html outranks markdown or markdown is refused", () => {
    expect(wantsMarkdown("text/html, text/markdown;q=0.5")).toBe(false);
    expect(wantsMarkdown("text/markdown;q=0")).toBe(false);
  });
});

describe("htmlToMarkdown", () => {
  const html = '<html><head><title>Pricing | Brandbasket</title></head><body><nav>Menu</nav><main id="main"><h1>Pricing</h1><p>Pay <strong>monthly</strong>. <a href="/contact">Contact us</a></p><ul><li>One</li><li>Two</li></ul><button>Open basket</button><script>x()</script></main><footer>Legal</footer></body></html>';

  it("keeps the main content, absolute links and headings, and drops chrome", () => {
    const md = htmlToMarkdown(html, "https://www.brandbasket.in");
    expect(md).toContain("# Pricing");
    expect(md).toContain("**monthly**");
    expect(md).toContain("[Contact us](https://www.brandbasket.in/contact)");
    expect(md).toContain("-   One");
    for (const dropped of ["Menu", "Legal", "Open basket", "x()"]) expect(md).not.toContain(dropped);
  });

  it("estimates four characters a token", () => {
    expect(estimateTokens("abcdefgh")).toBe(2);
  });
});
