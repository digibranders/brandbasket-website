// components/blog/PostArticle.tsx: a whole post page's content (docs/design/blog-mock.html, post option B with the
// contents rail). The post page and the preview page both render it.
import Link from "next/link";
import type { ReactElement } from "react";
import { Faq } from "@/components/ui/Faq";
import { BLOG_COPY } from "@/content/blog";
import type { Post } from "@/lib/cms/schema";
import { Avatar } from "./Avatar";
import { Crumbs } from "./Crumbs";
import { PostMeta } from "./PostMeta";
import { AuthorBox, RelatedPosts } from "./PostExtras";
import { Thumb } from "./Thumb";
import { TocAside, TocBox } from "./Toc";
import "./prose.css";

export function PostArticle({ post }: { readonly post: Post }): ReactElement {
  const hasToc = post.toc.length > 0;
  return (
    <div className="in-wrap pb-24 pt-32">
      <header className="max-w-[860px]">
        <Crumbs items={[{ label: "Blog", href: "/blog" }, ...(post.category === null ? [] : [{ label: post.category.name, href: `/blog/category/${post.category.slug}` }])]} />
        <h1 className="font-display text-[clamp(36px,4.6vw,60px)] font-medium leading-[1.04] tracking-[-0.045em]">{post.title}</h1>
        {post.excerpt === "" ? null : <p className="mt-4 max-w-[64ch] text-[18.5px] leading-[1.55] text-ink-2">{post.excerpt}</p>}
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3.5">
          {post.author === null ? null : (
            <div className="flex items-center gap-3">
              <Avatar name={post.author.name} photo={post.author.photo} />
              <div>
                <Link href={`/blog/author/${post.author.slug}`} className="font-semibold underline-offset-[3px] hover:underline">{post.author.name}</Link>
                {post.author.jobTitle === "" ? null : <div className="text-[13.5px] text-ink-2">{post.author.jobTitle}</div>}
              </div>
            </div>
          )}
          <PostMeta publishedAt={post.publishedAt} minutes={post.readingMinutes} />
        </div>
      </header>

      {post.cover === null ? null : (
        <div className="mt-10 max-w-[860px] rounded-[28px] shadow-[var(--shadow)]">
          <Thumb image={post.cover} alt={post.cover.alt} sizes="(min-width: 900px) 860px, 100vw" priority className="rounded-[28px]" />
        </div>
      )}

      <div className={`mt-[52px] grid ${hasToc ? "min-[960px]:grid-cols-[240px_minmax(0,720px)] min-[960px]:justify-start min-[960px]:gap-x-[clamp(32px,5vw,80px)]" : ""}`}>
        <TocAside toc={post.toc} />
        <article className={`w-full min-w-0 max-w-[720px] ${hasToc ? "mx-auto min-[960px]:mx-0" : "mx-auto"}`}>
          <TocBox toc={post.toc} />
          <div className="post-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          {post.faqs.length === 0 ? null : (
            <section aria-labelledby="faq-h" className="mt-14">
              <h2 id="faq-h" className="mb-4 font-display text-[clamp(25px,2.4vw,30px)] font-semibold tracking-[-0.028em]">{BLOG_COPY.post.faq}</h2>
              <Faq id="post-faq" items={post.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))} />
            </section>
          )}
          {post.author === null ? null : <AuthorBox author={post.author} />}
        </article>
      </div>

      <RelatedPosts posts={post.related} categoryName={post.category?.name ?? null} />
    </div>
  );
}
