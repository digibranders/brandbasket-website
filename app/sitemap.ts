// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getSitemap } from "@/lib/cms/blog";
import { indexableRoutes, routeUrl } from "@/lib/seo/routes";

// Rendered per request so a build never needs the CMS; the CMS answers are cached under the "blog" tag.
export const dynamic = "force-dynamic";

/** The site's pages, then the blog's. If the CMS cannot answer this throws, so Search Console never gets half a list. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await getSitemap();
  const newestPost = blog.posts.map((post) => post.lastModified).sort().at(-1);
  const pages = indexableRoutes().map((r) => ({
    url: routeUrl(r.path),
    lastModified: new Date(r.path === "/blog" && newestPost !== undefined ? newestPost : r.updated),
    changeFrequency: r.path === "/blog" ? ("weekly" as const) : ("monthly" as const),
    priority: r.priority,
  }));
  const entries = (prefix: string, items: readonly { readonly slug: string; readonly lastModified: string }[], priority: number): MetadataRoute.Sitemap =>
    items.map((item) => ({ url: routeUrl(`${prefix}/${item.slug}`), lastModified: new Date(item.lastModified), changeFrequency: "monthly", priority }));
  return [...pages, ...entries("/blog", blog.posts, 0.7), ...entries("/blog/category", blog.categories, 0.5), ...entries("/blog/author", blog.authors, 0.4)];
}
