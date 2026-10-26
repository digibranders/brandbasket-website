// lib/cms/blog.ts: the blog's reads, one per site API endpoint (plan 22, section 7). Each returns null when the CMS says
// the thing does not exist, and throws when the CMS cannot answer.
import { authorResponseSchema, categoriesResponseSchema, categoryResponseSchema, postResponseSchema, postSchema, postsPageSchema, sitemapSchema } from "./schema";
import type { AuthorResponse, CategoriesResponse, CategoryResponse, Post, PostResponse, PostsPage, Sitemap } from "./schema";
import { cmsGet } from "./client";
import { z } from "zod";

export const POSTS_PER_PAGE = 12;

const orNull = <T>(result: Awaited<ReturnType<typeof cmsGet<T>>>): T | null => (result.ok ? result.data : null);

export async function getPostsPage(page: number, category?: string): Promise<PostsPage> {
  const query = new URLSearchParams({ page: String(page), perPage: String(POSTS_PER_PAGE), ...(category === undefined ? {} : { category }) });
  const result = await cmsGet(`/api/site/posts?${query.toString()}`, postsPageSchema);
  if (!result.ok) throw new Error("The CMS has no post list.");
  return result.data;
}

/** The post, or where an old address now lives, or null when there is no such post. */
export async function getPost(slug: string): Promise<PostResponse | null> {
  return orNull(await cmsGet(`/api/site/posts/${encodeURIComponent(slug)}`, postResponseSchema));
}

export async function getCategories(): Promise<CategoriesResponse> {
  const result = await cmsGet("/api/site/categories", categoriesResponseSchema);
  if (!result.ok) throw new Error("The CMS has no category list.");
  return result.data;
}

export async function getCategory(slug: string): Promise<CategoryResponse | null> {
  return orNull(await cmsGet(`/api/site/categories/${encodeURIComponent(slug)}`, categoryResponseSchema));
}

export async function getAuthor(slug: string): Promise<AuthorResponse | null> {
  return orNull(await cmsGet(`/api/site/authors/${encodeURIComponent(slug)}`, authorResponseSchema));
}

export async function getSitemap(): Promise<Sitemap> {
  const result = await cmsGet("/api/site/sitemap", sitemapSchema);
  if (!result.ok) throw new Error("The CMS has no sitemap.");
  return result.data;
}

export type PreviewResult = { readonly kind: "post"; readonly post: Post } | { readonly kind: "expired" } | { readonly kind: "missing" };

/** A draft by its preview token. Never cached. */
export async function getPreview(token: string): Promise<PreviewResult> {
  const result = await cmsGet(`/api/site/preview?token=${encodeURIComponent(token)}`, z.object({ post: postSchema }), { fresh: true });
  if (result.ok) return { kind: "post", post: result.data.post };
  return result.status === 410 ? { kind: "expired" } : { kind: "missing" };
}
