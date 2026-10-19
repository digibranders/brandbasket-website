// lib/seo/metadata.ts
import type { Metadata } from "next";
import { isProductionSite, siteConfig } from "@/lib/site-config";
import type { RouteMeta } from "./routes";

/** Size and alt text shared by every opengraph-image file (lib/og/share-image.tsx). */
export const SHARE_IMAGE_META = { width: 1200, height: 630, alt: `${siteConfig.name} logo and the page headline`, type: "image/png" } as const;

/** The site default share image, served by app/opengraph-image.tsx. */
const DEFAULT_SHARE_IMAGE = { url: "/opengraph-image", ...SHARE_IMAGE_META };

interface PageMetadataOptions {
  /** The route has its own opengraph-image file, so Next adds og:image and twitter:image itself. */
  readonly ownShareImage?: boolean;
}

/** Metadata for one page from its registry entry (lib/seo/routes.ts). */
export function pageMetadata(
  { title, description, path, noindex = false }: Pick<RouteMeta, "title" | "description" | "path" | "noindex">,
  { ownShareImage = false }: PageMetadataOptions = {},
): Metadata {
  const url = `${siteConfig.url}${path}`;
  // A page's openGraph replaces the layout's, file-generated image included, so pages without their own image name
  // the default. A present `images` key stops Next from adding a route's own file, so those pages leave it out.
  const images = ownShareImage ? {} : { images: [DEFAULT_SHARE_IMAGE] };
  return {
    // Registry titles are complete, so the layout's "%s | Brandbasket" template must not append the brand again.
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url, siteName: siteConfig.name, type: "website", locale: "en_IN", ...images },
    twitter: { card: "summary_large_image", title, description, ...images },
    // Only set the key when needed: a present-but-undefined key overrides the layout robots in Next's metadata merge.
    // Before launch the layout's "noindex, nofollow" applies everywhere, so a noindex page must not loosen it to follow.
    ...(noindex ? { robots: { index: false, follow: isProductionSite() } } : {}),
  };
}
