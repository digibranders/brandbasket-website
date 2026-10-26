// lib/seo/blog.ts: metadata for the blog's pages. A post's own title and description come from the CMS already resolved
// (the brand suffix and length rules); the listing's come from the route registry.
import type { Metadata } from "next";
import type { AuthorProfile, CategoryInfo, Post } from "@/lib/cms/schema";
import { pageMetadata } from "./metadata";
import { ROUTES } from "./routes";

export function listingMetadata(page: number): Metadata {
  const { title, description } = ROUTES.blog;
  return page === 1
    ? pageMetadata(ROUTES.blog)
    : pageMetadata({ title: title.replace("Blog:", `Blog, page ${page}:`), description, path: `/blog/page/${page}` });
}

export function postMetadata(post: Post): Metadata {
  return pageMetadata(
    { title: post.seo.title, description: post.seo.description, path: `/blog/${post.slug}`, noindex: post.seo.noindex },
    {
      article: {
        ...(post.publishedAt === null ? {} : { publishedTime: post.publishedAt }),
        ...(post.modifiedAt === null ? {} : { modifiedTime: post.modifiedAt }),
        ...(post.author === null ? {} : { authors: [post.author.name] }),
        ...(post.category === null ? {} : { section: post.category.name }),
      },
      ...(post.ogImage === null ? {} : { image: { url: post.ogImage.src, width: post.ogImage.width, height: post.ogImage.height, alt: post.ogImage.alt } }),
    },
  );
}

export function categoryMetadata(category: CategoryInfo): Metadata {
  return pageMetadata({
    title: category.metaTitle === "" ? `${category.name} | Brandbasket blog` : category.metaTitle,
    description: [category.metaDescription, category.description].find((text) => text !== "") ?? `Guides on ${category.name.toLowerCase()} for local businesses, from the Brandbasket team.`,
    path: `/blog/category/${category.slug}`,
  });
}

export function authorMetadata(author: AuthorProfile): Metadata {
  return pageMetadata({
    title: `${author.name}${author.jobTitle === "" ? "" : `, ${author.jobTitle}`} | Brandbasket blog`,
    description: author.bio === "" ? `Guides by ${author.name} on websites, Google and local search for local businesses.` : author.bio,
    path: `/blog/author/${author.slug}`,
  });
}

/** A preview is private: never indexed, whatever launch state the site is in. */
export const PREVIEW_METADATA: Metadata = { title: "Preview", robots: { index: false, follow: false } };
