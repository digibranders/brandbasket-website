// app/blog/author/[slug]/page.tsx: an author, their links and all their posts.
import { ArrowUpRight, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { ReactElement } from "react";
import { Avatar } from "@/components/blog/Avatar";
import { Crumbs } from "@/components/blog/Crumbs";
import { PostRow } from "@/components/blog/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { BLOG_COPY } from "@/content/blog";
import { getAuthor } from "@/lib/cms/blog";
import { authorMetadata } from "@/lib/seo/blog";
import { breadcrumbJsonLd, personJsonLd, profilePageJsonLd } from "@/lib/seo/jsonld";

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

/** "LinkedIn" for a LinkedIn address, otherwise the site's name. */
function linkLabel(address: string): { readonly label: string; readonly linkedin: boolean } {
  const host = new URL(address).hostname.replace(/^www\./, "");
  return host.endsWith("linkedin.com") ? { label: "LinkedIn", linkedin: true } : { label: host, linkedin: false };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getAuthor((await params).slug);
  return found === null || "redirect" in found ? {} : authorMetadata(found.author);
}

export default async function AuthorPage({ params }: Props): Promise<ReactElement> {
  const found = await getAuthor((await params).slug);
  if (found === null) notFound();
  if ("redirect" in found) permanentRedirect(`/blog/author/${found.redirect}`);
  const { author, posts } = found;
  return (
    <div className="in-wrap pb-24 pt-32">
      <header className="max-w-[860px]">
        <Crumbs items={[{ label: "Blog", href: "/blog" }, { label: author.name }]} />
        <div className="grid items-center gap-[18px] min-[640px]:grid-cols-[auto_1fr] min-[640px]:gap-7">
          <Avatar name={author.name} photo={author.photo} size="lg" />
          <div>
            <h1 className="font-display text-[clamp(40px,5.4vw,72px)] font-normal leading-none tracking-[-0.05em]">{author.name}</h1>
            {author.jobTitle === "" ? null : <p className="mt-2.5 font-semibold text-rattan-ink">{author.jobTitle}</p>}
            {author.bio === "" ? null : <p className="mt-4 max-w-[64ch] text-[18.5px] leading-[1.55] text-ink-2">{author.bio}</p>}
            {author.sameAs.length === 0 ? null : (
              <ul className="mt-[18px] flex flex-wrap gap-2">
                {author.sameAs.map((address) => {
                  const { label, linkedin } = linkLabel(address);
                  const Icon = linkedin ? LinkedinLogo : ArrowUpRight;
                  return (
                    <li key={address}>
                      <a href={address} rel="me noopener" className="inline-flex h-[38px] items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-sm font-semibold transition-colors duration-300 hover:border-ink">
                        <Icon aria-hidden="true" className="size-[18px]" />
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </header>
      <h2 className="mt-[72px] font-display text-[clamp(30px,3.4vw,44px)] font-normal leading-none tracking-[-0.045em]">{BLOG_COPY.author.postsBy} {author.name.split(" ")[0]}</h2>
      <div className="mt-9 border-t border-line">
        {posts.map((post) => <PostRow key={post.slug} post={post} />)}
      </div>
      <JsonLd data={profilePageJsonLd(author)} />
      <JsonLd data={personJsonLd(author)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: author.name, path: `/blog/author/${author.slug}` }])} />
    </div>
  );
}
