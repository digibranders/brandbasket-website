// lib/seo/metadata.ts
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly noindex?: boolean;
}

export function pageMetadata({ title, description, path, noindex = false }: PageMeta): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url, siteName: siteConfig.name, type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description },
    // Only set the key when needed: a present-but-undefined key overrides the layout robots in Next's metadata merge.
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
