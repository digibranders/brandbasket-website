// app/sitemap.ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const PATHS: readonly { readonly path: string; readonly priority: number }[] = [
  { path: "", priority: 1 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map(({ path, priority }) => ({ url: `${siteConfig.url}${path}`, lastModified: now, changeFrequency: "monthly", priority }));
}
