// app/md/[[...slug]]/route.ts
import type { NextRequest } from "next/server";
import { estimateTokens, htmlToMarkdown } from "@/lib/agents/markdown";

// proxy.ts rewrites a page request that asks for text/markdown here. The page is fetched as HTML and converted, so the markdown never drifts from what a visitor reads.
export const dynamic = "force-dynamic";

// A bot user agent: proxy.ts gives bots the rupee copy, the same as llms.txt.
const FETCH_AGENT = "BrandbasketMarkdownBot/1.0";

export async function GET(request: NextRequest, { params }: { readonly params: Promise<{ slug?: string[] }> }): Promise<Response> {
  const { slug = [] } = await params;
  const { origin, search } = request.nextUrl;
  const page = await fetch(`${origin}/${slug.map(encodeURIComponent).join("/")}${search}`, { headers: { Accept: "text/html", "User-Agent": FETCH_AGENT }, cache: "no-store" });
  if (!page.ok || !(page.headers.get("content-type") ?? "").includes("text/html")) {
    return new Response(page.status === 404 ? "Not found\n" : "Could not build the markdown copy of this page.\n", { status: page.status === 404 ? 404 : 502, headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" } });
  }
  const markdown = htmlToMarkdown(await page.text(), origin);
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(estimateTokens(markdown)),
      Vary: "Accept",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
