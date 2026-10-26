import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { ServicePage } from "@/components/services/ServicePage";
import { SERVICE_PAGES, servicePageBySlug } from "@/content/services";
import { pageMetadata } from "@/lib/seo/metadata";
import { serviceRoute } from "@/lib/seo/routes";

interface ServicePageParams {
  readonly params: Promise<{ readonly slug: string }>;
}

/** The three service pages are known at build time; any other address is a 404. */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ServicePageParams): Promise<Metadata> {
  const page = servicePageBySlug((await params).slug);
  if (page === undefined) notFound();
  return pageMetadata(serviceRoute(page));
}

/** /services/managed-website, /services/social-media-and-ads and /services/local-seo-aeo. */
export default async function ServiceRoute({ params }: ServicePageParams): Promise<ReactElement> {
  const page = servicePageBySlug((await params).slug);
  if (page === undefined) notFound();
  return <ServicePage page={page} />;
}
