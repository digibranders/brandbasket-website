// app/blog/category/[slug]/page.tsx: a category and all its posts.
// shortcut: no pagination until a category passes about 24 posts (plan 22, section 8).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { Crumbs } from "@/components/blog/Crumbs";
import { PostCard } from "@/components/blog/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { getCategories, getCategory } from "@/lib/cms/blog";
import { categoryMetadata } from "@/lib/seo/blog";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getCategory((await params).slug);
  return found === null ? {} : categoryMetadata(found.category);
}

export default async function CategoryPage({ params }: Props): Promise<ReactElement> {
  const slug = (await params).slug;
  const [found, { categories }] = await Promise.all([getCategory(slug), getCategories()]);
  if (found === null) notFound();
  const { category, posts } = found;
  return (
    <div className="in-wrap pb-24 pt-32">
      <header className="max-w-[860px]">
        <Crumbs items={[{ label: "Blog", href: "/blog" }, { label: category.name }]} />
        <h1 className="font-display text-[clamp(40px,5.4vw,72px)] font-normal leading-none tracking-[-0.05em]">{category.name}</h1>
        {category.description === "" ? null : <p className="mt-4 max-w-[64ch] text-[18.5px] leading-[1.55] text-ink-2">{category.description}</p>}
      </header>
      <CategoryPills categories={categories} current={category.slug} />
      <div className="mt-14 grid gap-x-8 gap-y-9 min-[860px]:grid-cols-2 min-[860px]:gap-y-11">
        {posts.map((post) => <PostCard key={post.slug} post={post} showCategory={false} />)}
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: category.name, path: `/blog/category/${category.slug}` }])} />
    </div>
  );
}
