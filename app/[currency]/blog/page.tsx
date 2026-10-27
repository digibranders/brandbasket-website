// app/blog/page.tsx: the blog's front page. Rendered per request, from the CMS responses the site caches (lib/cms),
// so a build never needs the CMS to be up.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { BlogListing } from "@/components/blog/BlogListing";
import { listingMetadata } from "@/lib/seo/blog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = listingMetadata(1);

export default function BlogPage(): Promise<ReactElement> {
  return BlogListing({ page: 1 });
}
