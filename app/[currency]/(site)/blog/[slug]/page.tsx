// app/blog/[slug]/page.tsx: one post. An old address answers 308 to the current one; an address with no post is a 404,
// decided before anything streams, so this segment has no loading.tsx.
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { ReactElement } from "react";
import { PostArticle } from "@/components/blog/PostArticle";
import { JsonLd } from "@/components/JsonLd";
import { getPost } from "@/lib/cms/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, personJsonLd } from "@/lib/seo/jsonld";
import { postMetadata } from "@/lib/seo/blog";

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getPost((await params).slug);
  return found === null || "redirect" in found ? {} : postMetadata(found.post);
}

export default async function PostPage({ params }: Props): Promise<ReactElement> {
  const found = await getPost((await params).slug);
  if (found === null) notFound();
  if ("redirect" in found) permanentRedirect(`/blog/${found.redirect}`);
  const { post } = found;
  return (
    <>
      <PostArticle post={post} />
      <JsonLd data={blogPostingJsonLd(post)} />
      {post.author === null ? null : <JsonLd data={personJsonLd(post.author)} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          ...(post.category === null ? [] : [{ name: post.category.name, path: `/blog/category/${post.category.slug}` }]),
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </>
  );
}
