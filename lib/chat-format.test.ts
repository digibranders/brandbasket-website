import { describe, expect, it } from "vitest";
import { parseChatText, parseInline } from "./chat-format";

describe("parseInline", () => {
  it("finds bold, markdown links and bare https links", () => {
    expect(parseInline("See **plans** at [pricing](https://www.brandbasket.in/pricing) or https://www.brandbasket.in/contact.")).toEqual([
      { kind: "text", text: "See " },
      { kind: "bold", text: "plans" },
      { kind: "text", text: " at " },
      { kind: "link", text: "pricing", href: "https://www.brandbasket.in/pricing" },
      { kind: "text", text: " or " },
      { kind: "link", text: "https://www.brandbasket.in/contact", href: "https://www.brandbasket.in/contact" },
      { kind: "text", text: "." },
    ]);
  });
  it("never turns a non-https address into a link", () => {
    expect(parseInline("[x](javascript:alert(1)) and http://evil.example")).toEqual([{ kind: "text", text: "[x](javascript:alert(1)) and http://evil.example" }]);
  });
  it("leaves markup as plain text, never as HTML", () => {
    expect(parseInline("<b>hi</b>")).toEqual([{ kind: "text", text: "<b>hi</b>" }]);
  });
});

describe("parseChatText", () => {
  it("makes a paragraph of each line and one list of consecutive bullets", () => {
    const blocks = parseChatText("Three things:\n- a website\n- social media\n1. ads\n\nAsk away.");
    expect(blocks.map((block) => block.kind)).toEqual(["paragraph", "list", "paragraph"]);
    expect(blocks[1]).toMatchObject({ kind: "list", items: [[{ text: "a website" }], [{ text: "social media" }], [{ text: "ads" }]] });
  });
  it("returns nothing for blank text", () => {
    expect(parseChatText("  \n\n")).toEqual([]);
  });
});
