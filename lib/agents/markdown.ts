// lib/agents/markdown.ts
import TurndownService from "turndown";

/** True when the Accept header ranks text/markdown at least as high as text/html. A browser's header never names markdown. */
export function wantsMarkdown(accept: string | null): boolean {
  if (accept === null) return false;
  const quality = (type: string): number => {
    const entry = accept.split(",").map((part) => part.trim().toLowerCase()).find((part) => part === type || part.startsWith(`${type};`));
    if (entry === undefined) return 0;
    const q = /;\s*q=([0-9.]+)/.exec(entry)?.[1];
    return q === undefined ? 1 : Number(q);
  };
  const markdown = quality("text/markdown");
  return markdown > 0 && markdown >= quality("text/html");
}

const converter = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced", linkStyle: "inlined" });
const DROPPED = new Set(["SCRIPT", "STYLE", "SVG", "NAV", "FORM", "BUTTON", "DIALOG", "NOSCRIPT", "IFRAME", "IMG"]);
// addRule, not remove(): Turndown's built-in rules (images) are checked before its remove list.
converter.addRule("dropped", { filter: (node) => DROPPED.has(node.nodeName), replacement: () => "" });

/** The page's <main> as markdown, with its title on top. Falls back to the whole body when a page has no <main>. */
export function htmlToMarkdown(html: string, origin: string): string {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1] ?? html;
  const body = converter.turndown(main).replace(/\]\((\/[^)]*)\)/g, (_match, path: string) => `](${origin}${path})`);
  return `${title === "" ? "" : `<!-- ${title} -->\n\n`}${body.trim()}\n`;
}

/** Rough token count (four characters a token), sent as x-markdown-tokens. */
export function estimateTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}
