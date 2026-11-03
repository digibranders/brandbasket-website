// lib/seo/metadata.ts
import type { Metadata } from "next";
import { isProductionSite, siteConfig } from "@/lib/site-config";
import type { RouteMeta } from "./routes";

/** Size and alt text shared by every opengraph-image file (lib/og/share-image.tsx). */
export const SHARE_IMAGE_META = { width: 1200, height: 630, alt: `Get your business website for FREE. Built for you. Live in 7 working days. ${siteConfig.name}.`, type: "image/png" } as const;

/** The site default share image, served by app/opengraph-image.tsx. */
const DEFAULT_SHARE_IMAGE = { url: "/opengraph-image", ...SHARE_IMAGE_META };

/** Blog posts: OpenGraph "article" with its times, author and section. */
export interface ArticleMeta {
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly authors?: readonly string[];
  readonly section?: string;
}

interface PageMetadataOptions {
  /** The route has its own opengraph-image file, so Next adds og:image and twitter:image itself. */
  readonly ownShareImage?: boolean;
  /** Makes the page an OpenGraph article. */
  readonly article?: ArticleMeta;
  /** The share image to use instead of the site default (a post's cover). */
  readonly image?: { readonly url: string; readonly width: number; readonly height: number; readonly alt: string };
}

/** Metadata for one page from its registry entry (lib/seo/routes.ts). */
export function pageMetadata(
  { title, description, path, noindex = false }: Pick<RouteMeta, "title" | "description" | "path" | "noindex">,
  { ownShareImage = false, article, image }: PageMetadataOptions = {},
): Metadata {
  const url = `${siteConfig.url}${path}`;
  // A page's openGraph replaces the layout's, file-generated image included, so pages without their own image name
  // the default. A present `images` key stops Next from adding a route's own file, so those pages leave it out.
  const images = ownShareImage ? {} : { images: [image ?? DEFAULT_SHARE_IMAGE] };
  return {
    // Registry titles are complete, so the layout's "%s | Brandbasket" template must not append the brand again.
    title: { absolute: title },
    description,
    alternates: { canonical: path, types: { "application/rss+xml": `${siteConfig.url}/blog/feed.xml` } },
    openGraph: { title, description, url, siteName: siteConfig.name, locale: "en_IN", ...(article === undefined ? { type: "website" as const } : { type: "article" as const, ...article, authors: article.authors === undefined ? undefined : [...article.authors] }), ...images },
    twitter: { card: "summary_large_image", title, description, ...images },
    // Only set the key when needed: a present-but-undefined key overrides the layout robots in Next's metadata merge.
    // Before launch the layout's "noindex, nofollow" applies everywhere, so a noindex page must not loosen it to follow.
    ...(noindex ? { robots: { index: false, follow: isProductionSite() } } : {}),
  };
}
