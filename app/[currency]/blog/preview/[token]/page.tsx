// app/blog/preview/[token]/page.tsx: a draft, for anyone holding the link. Never cached, never indexed (the metadata,
// and the X-Robots-Tag header from next.config.ts), and the page says so.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { PostArticle } from "@/components/blog/PostArticle";
import { BLOG_COPY } from "@/content/blog";
import { getPreview } from "@/lib/cms/blog";
import { PREVIEW_METADATA } from "@/lib/seo/blog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = PREVIEW_METADATA;

export default async function PreviewPage({ params }: { readonly params: Promise<{ readonly token: string }> }): Promise<ReactElement> {
  const result = await getPreview((await params).token);
  if (result.kind === "missing") notFound();
  if (result.kind === "expired") {
    return <div className="in-wrap pb-24 pt-40"><p role="status" className="max-w-[56ch] text-[18px] text-ink-2">{BLOG_COPY.preview.expired}</p></div>;
  }
  return (
    <>
      <p role="status" className="fixed inset-x-0 bottom-0 z-40 bg-ink px-4 py-2.5 text-center text-sm font-semibold text-action-ink">{BLOG_COPY.preview.bar}</p>
      <PostArticle post={result.post} />
    </>
  );
}
