import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { GuidePage } from "@/components/guides/GuidePage";
import { type GuidePageContent, INDUSTRY_PAGES } from "@/content/guides";
import { pageMetadata } from "@/lib/seo/metadata";
import { guideRoute } from "@/lib/seo/routes";

interface IndustryPageParams {
  readonly params: Promise<{ readonly slug: string }>;
}

/** The "for your kind of business" pages are known at build time; any other address is a 404. */
export const dynamicParams = false;

/** The layout above supplies the currency; this lists the slugs. */
export function generateStaticParams(): { slug: string }[] {
  return INDUSTRY_PAGES.map((page) => ({ slug: page.slug }));
}

async function industryPage(params: IndustryPageParams["params"]): Promise<GuidePageContent> {
  const { slug } = await params;
  const page = INDUSTRY_PAGES.find((candidate) => candidate.slug === slug);
  if (page === undefined) notFound();
  return page;
}

export async function generateMetadata({ params }: IndustryPageParams): Promise<Metadata> {
  return pageMetadata(guideRoute(await industryPage(params)));
}

/** /for/clinics-and-dentists, /for/restaurants and /for/salons-gyms-and-coaching. */
export default async function IndustryRoute({ params }: IndustryPageParams): Promise<ReactElement> {
  return <GuidePage page={await industryPage(params)} />;
}
