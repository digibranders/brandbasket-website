// lib/seo/metadata.ts
import type { Metadata } from "next";
import { isProductionSite, siteConfig } from "@/lib/site-config";
import type { RouteMeta } from "./routes";

/** Metadata for one page from its registry entry (lib/seo/routes.ts). */
export function pageMetadata({ title, description, path, noindex = false }: Pick<RouteMeta, "title" | "description" | "path" | "noindex">): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    // Registry titles are complete, so the layout's "%s | Brandbasket" template must not append the brand again.
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    // og:image and twitter:image come from the nearest opengraph-image file, which Next adds to every route.
    openGraph: { title, description, url, siteName: siteConfig.name, type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description },
    // Only set the key when needed: a present-but-undefined key overrides the layout robots in Next's metadata merge.
    // Before launch the layout's "noindex, nofollow" applies everywhere, so a noindex page must not loosen it to follow.
    ...(noindex ? { robots: { index: false, follow: isProductionSite() } } : {}),
  };
}
