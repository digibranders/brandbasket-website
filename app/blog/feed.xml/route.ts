// app/blog/feed.xml/route.ts: RSS 2.0 for the 20 latest posts. The CMS list gives titles, excerpts and dates, which is
// what a reader needs to decide to click; the full text stays on the site.
import { getPostsPage } from "@/lib/cms/blog";
import { buildFeed } from "@/lib/blog/feed";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const { posts } = await getPostsPage(1);
  return new Response(buildFeed(posts.slice(0, 20), new Date()), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
