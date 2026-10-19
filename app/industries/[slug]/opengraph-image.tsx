import { notFound } from "next/navigation";
import type { ImageResponse } from "next/og";
import { INDUSTRIES, industryBySlug } from "@/content/industries";
import { SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE, shareImage } from "@/lib/og/share-image";
import { formatInr, PLANS } from "@/lib/pricing";

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

// Only the eight industries have an image; any other slug is a 404 (route handlers take the same segment config).
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return INDUSTRIES.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { readonly params: Promise<{ readonly slug: string }> }): Promise<ImageResponse> {
  const { slug } = await params;
  const industry = industryBySlug(slug) ?? notFound();
  return shareImage({ headline: industry.h1, line: `Built free. From ${formatInr(PLANS.website.monthly)} a month.` });
}
