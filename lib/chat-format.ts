// lib/chat-format.ts: turns a bot answer into safe blocks for the chat to draw. The answer is plain text with a little markdown
// (bold, bullet lists, links). Nothing here makes HTML, so an answer can never inject markup; links must be https.

export type Inline =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "bold"; readonly text: string }
  | { readonly kind: "link"; readonly text: string; readonly href: string };

export type Block = { readonly kind: "paragraph"; readonly inline: readonly Inline[] } | { readonly kind: "list"; readonly items: readonly (readonly Inline[])[] };

const LIST_ITEM = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/;
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https:\/\/[^\s)]+)\)|(https:\/\/[^\s<>()]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) out.push({ kind: "text", text: text.slice(last, start) });
    const [whole, bold, label, labelHref, bare] = match;
    if (bold !== undefined) {
      out.push({ kind: "bold", text: bold });
      last = start + whole.length;
    } else if (label !== undefined && labelHref !== undefined) {
      out.push({ kind: "link", text: label, href: labelHref });
      last = start + whole.length;
    } else if (bare !== undefined) {
      const href = bare.replace(TRAILING_PUNCTUATION, "");
      out.push({ kind: "link", text: href, href });
      last = start + href.length;
    }
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

/** Each non-empty line is a paragraph, and consecutive bullet or numbered lines make one list. */
export function parseChatText(text: string): Block[] {
  const blocks: Block[] = [];
  let items: Inline[][] | null = null;
  for (const line of text.split("\n")) {
    const item = LIST_ITEM.exec(line);
    if (item !== null) {
      items ??= [];
      items.push(parseInline(item[1] ?? ""));
      if (items.length === 1) blocks.push({ kind: "list", items });
      continue;
    }
    items = null;
    if (line.trim() !== "") blocks.push({ kind: "paragraph", inline: parseInline(line.trim()) });
  }
  return blocks;
}
