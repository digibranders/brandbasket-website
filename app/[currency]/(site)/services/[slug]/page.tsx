import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { GuideLinks } from "@/components/guides/GuideLinks";
import { AdsPage } from "@/components/services/AdsPage";
import { SocialPage } from "@/components/services/SocialPage";
import { WebsitePage } from "@/components/services/WebsitePage";
import { GUIDE_LINKS } from "@/content/guides";
import { SERVICE_PAGES, servicePageBySlug } from "@/content/services";
import { currencyParam } from "@/lib/currency";
import { pageMetadata, SOCIAL_SHARE_IMAGE_META, WEBSITE_SHARE_IMAGE_META } from "@/lib/seo/metadata";
import { serviceRoute } from "@/lib/seo/routes";

interface ServicePageParams {
  readonly params: Promise<{ readonly currency: string; readonly slug: string }>;
}

/** The three service pages are known at build time; any other address is a 404. */
export const dynamicParams = false;

/** The layout above supplies the currency; this lists the slugs. */
export function generateStaticParams(): { slug: string }[] {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ServicePageParams): Promise<Metadata> {
  const currency = await currencyParam(params);
  const page = servicePageBySlug((await params).slug, currency);
  if (page === undefined) notFound();
  // Website and Social Media have their own cards; Paid Ads uses the site default.
  return pageMetadata(serviceRoute(page), page.id === "website" ? { image: WEBSITE_SHARE_IMAGE_META } : page.id === "social" ? { image: SOCIAL_SHARE_IMAGE_META } : {});
}

/**
 * /services/managed-website, /services/social-media-management and /services/paid-ads-management, in rupees or dollars. The
 * website page is the old website-first homepage (owner, 2026-11-06); the social and ads pages (2026-11-17) share the parts
 * in components/services/blocks.tsx.
 */
export default async function ServiceRoute({ params }: ServicePageParams): Promise<ReactElement> {
  const currency = await currencyParam(params);
  const page = servicePageBySlug((await params).slug, currency);
  if (page === undefined) notFound();
  return (
    <>
      {page.id === "website" ? <WebsitePage page={page} currency={currency} /> : page.id === "social" ? <SocialPage page={page} currency={currency} /> : <AdsPage page={page} currency={currency} />}
      {GUIDE_LINKS[page.id].length > 0 ? <GuideLinks links={GUIDE_LINKS[page.id]} /> : null}
    </>
  );
}
