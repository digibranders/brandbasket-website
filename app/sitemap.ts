// app/sitemap.ts
import type { MetadataRoute } from "next";
import { indexableRoutes, routeUrl } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((r) => ({ url: routeUrl(r.path), lastModified: new Date(r.updated), changeFrequency: "monthly", priority: r.priority }));
}
