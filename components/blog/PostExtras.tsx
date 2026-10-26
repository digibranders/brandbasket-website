// components/blog/PostExtras.tsx: what follows an article: the author box and the related posts.
import Link from "next/link";
import type { ReactElement } from "react";
import { BLOG_COPY } from "@/content/blog";
import type { AuthorProfile, PostCard as Card } from "@/lib/cms/schema";
import { Avatar } from "./Avatar";
import { PostCard } from "./PostCard";

export function AuthorBox({ author }: { readonly author: AuthorProfile }): ReactElement {
  return (
    <aside aria-label={BLOG_COPY.post.aboutAuthor} className="mt-14 grid gap-5 rounded-[26px] bg-rattan-wash p-[26px] min-[640px]:grid-cols-[auto_1fr]">
      <Avatar name={author.name} photo={author.photo} size="md" />
      <div>
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em]"><Link href={`/blog/author/${author.slug}`} className="underline-offset-[3px] hover:underline">{author.name}</Link></h2>
        {author.jobTitle === "" ? null : <p className="mt-0.5 text-sm text-rattan-ink">{author.jobTitle}</p>}
        {author.bio === "" ? null : <p className="mt-2.5 text-[15.5px] leading-[1.6] text-ink-2">{author.bio}</p>}
      </div>
    </aside>
  );
}

export function RelatedPosts({ posts, categoryName }: { readonly posts: readonly Card[]; readonly categoryName: string | null }): ReactElement | null {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="related-h" className="mt-24">
      <h2 id="related-h" className="mb-8 font-display text-[clamp(30px,3.4vw,44px)] font-normal leading-none tracking-[-0.045em]">
        {categoryName === null ? BLOG_COPY.post.relatedFallback : `${BLOG_COPY.post.relatedPrefix} ${categoryName.toLowerCase()}`}
      </h2>
      <div className="grid gap-7 min-[860px]:grid-cols-3">
        {posts.map((post) => <PostCard key={post.slug} post={post} heading="h3" showExcerpt={false} showCategory={false} />)}
      </div>
    </section>
  );
}
