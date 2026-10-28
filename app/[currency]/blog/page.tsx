// app/blog/page.tsx: the blog's front page. Rendered per request, from the CMS responses the site caches (lib/cms),
// so a build never needs the CMS to be up.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { BlogListing } from "@/components/blog/BlogListing";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { listingMetadata } from "@/lib/seo/blog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = listingMetadata(1);

export default async function BlogPage(): Promise<ReactElement> {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      {await BlogListing({ page: 1 })}
    </>
  );
}
