// app/robots.ts
import type { MetadataRoute } from "next";
import { isProductionSite, siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/blog/preview/"] }], sitemap: `${siteConfig.url}/sitemap.xml` };
}
