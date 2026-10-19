// app/sitemap.ts
import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/content/industries";
import { siteConfig } from "@/lib/site-config";

const PATHS: readonly { readonly path: string; readonly priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/pricing", priority: 0.9 },
  { path: "/industries", priority: 0.8 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/refund", priority: 0.3 },
  { path: "/shipping", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = PATHS.map(({ path, priority }) => ({ url: `${siteConfig.url}${path}`, lastModified: now, changeFrequency: "monthly", priority }));
  const industries: MetadataRoute.Sitemap = INDUSTRIES.map(({ slug, updated }) => ({ url: `${siteConfig.url}/industries/${slug}`, lastModified: new Date(updated), changeFrequency: "monthly", priority: 0.8 }));
  return [...pages, ...industries];
}
