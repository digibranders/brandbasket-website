// lib/cms/schema.ts: the JSON the CMS site API returns. Copied from brandbasket-cms/lib/site/schema.ts: when that file changes,
// copy it here and copy its golden files (brandbasket-cms/test/site-contract/) to e2e/fixtures/cms/.
import { z } from "zod";

export const imageSchema = z.object({
  src: z.string(),
  srcSet: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
});

const nameAndSlug = z.object({ name: z.string(), slug: z.string() });

export const postCardSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  cover: imageSchema.nullable(),
  category: nameAndSlug.nullable(),
  author: nameAndSlug.nullable(),
  /** ISO time it first went live; null only in a preview of a post that never has. */
  publishedAt: z.string().nullable(),
  /** ISO time a reader last saw different words (never a settings change); falls back to publishedAt. */
  modifiedAt: z.string().nullable(),
  readingMinutes: z.number().int().nonnegative(),
});

export const authorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  photo: imageSchema.nullable(),
  sameAs: z.array(z.string()),
});

export const categorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
});

export const postSchema = postCardSchema.omit({ author: true }).extend({
  author: authorSchema.nullable(),
  html: z.string(),
  toc: z.array(z.object({ id: z.string(), text: z.string(), level: z.union([z.literal(2), z.literal(3), z.literal(4)]) })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  /** Title and description as a search engine should show them (brand suffix and length rules applied). */
  seo: z.object({ title: z.string(), description: z.string(), noindex: z.boolean() }),
  /** The cover at 1200 by 630 for social cards, or null when the post has no cover. */
  ogImage: imageSchema.nullable(),
  wordCount: z.number().int().nonnegative(),
  /** Up to 3 latest posts in the same category. */
  related: z.array(postCardSchema),
});

export const postsPageSchema = z.object({ posts: z.array(postCardSchema), page: z.number().int().positive(), pages: z.number().int().nonnegative(), total: z.number().int().nonnegative() });
export const postResponseSchema = z.union([z.object({ post: postSchema }), z.object({ redirect: z.string() })]);
export const categoriesResponseSchema = z.object({ categories: z.array(categorySchema.extend({ postCount: z.number().int().positive() })) });
/** An old address answers with where the record lives now. */
const redirectSchema = z.object({ redirect: z.string() });
export const categoryResponseSchema = z.union([z.object({ category: categorySchema, posts: z.array(postCardSchema) }), redirectSchema]);
export const authorResponseSchema = z.union([z.object({ author: authorSchema, posts: z.array(postCardSchema) }), redirectSchema]);
export const sitemapSchema = z.object({
  posts: z.array(z.object({ slug: z.string(), lastModified: z.string() })),
  categories: z.array(z.object({ slug: z.string(), lastModified: z.string() })),
  authors: z.array(z.object({ slug: z.string(), lastModified: z.string() })),
});

export type Image = z.infer<typeof imageSchema>;
export type PostCard = z.infer<typeof postCardSchema>;
export type Post = z.infer<typeof postSchema>;
export type AuthorProfile = z.infer<typeof authorSchema>;
export type CategoryInfo = z.infer<typeof categorySchema>;
export type PostsPage = z.infer<typeof postsPageSchema>;
export type PostResponse = z.infer<typeof postResponseSchema>;
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type AuthorResponse = z.infer<typeof authorResponseSchema>;
export type Sitemap = z.infer<typeof sitemapSchema>;
