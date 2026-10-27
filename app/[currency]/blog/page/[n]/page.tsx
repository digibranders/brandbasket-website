// app/blog/page/[n]/page.tsx: page 2 and later of the listing. Page 1 lives only at /blog, so /blog/page/1 redirects
// there, and anything that is not a page number is a 404.
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { ReactElement } from "react";
import { BlogListing } from "@/components/blog/BlogListing";
import { pageNumber } from "@/lib/blog/format";
import { listingMetadata } from "@/lib/seo/blog";

interface Props {
  readonly params: Promise<{ readonly n: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pageNumber((await params).n);
  return page === null || page === 1 ? {} : listingMetadata(page);
}

export default async function BlogPageN({ params }: Props): Promise<ReactElement> {
  const page = pageNumber((await params).n);
  if (page === null) notFound();
  if (page === 1) permanentRedirect("/blog");
  return BlogListing({ page });
}
