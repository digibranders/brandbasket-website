import { Check } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { IndustryHero } from "@/components/industries/IndustryHero";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Shell } from "@/components/ui/Shell";
import { INDUSTRIES, INDUSTRY_PAGE, type Industry as IndustryCopy, industryBySlug } from "@/content/industries";
import { basketPlans, formatInr, monthlyTotal } from "@/lib/pricing";
import { audienceServiceJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { industryRoute } from "@/lib/seo/routes";

interface IndustryPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

// Only the eight industries exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams(): { slug: IndustryCopy["slug"] }[] {
  return INDUSTRIES.map(({ slug }) => ({ slug }));
}

async function industryFor(params: IndustryPageProps["params"]): Promise<IndustryCopy> {
  const { slug } = await params;
  return industryBySlug(slug) ?? notFound();
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  return pageMetadata(industryRoute(await industryFor(params)));
}

/** One template for the eight industry pages (plan 02, Task 7.2). The closing section comes from the root layout. */
export default async function IndustryPage({ params }: IndustryPageProps): Promise<ReactElement> {
  const industry = await industryFor(params);
  const path = `/industries/${industry.slug}`;
  return (
    <>
      <IndustryHero industry={industry} />

      <Section labelledBy="h-problems" tight>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
          <Reveal>
            <SectionHead id="h-problems" className="mb-0" title={INDUSTRY_PAGE.problemsHeading} />
          </Reveal>
          <Reveal className="min-w-0">
            <ul className="grid">
              {industry.problems.map((problem) => (
                <li key={problem} className="border-t border-line py-4 font-display text-xl tracking-[-0.02em] last:border-b">{problem}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="h-get" tight>
        <Reveal>
          <SectionHead id="h-get" title={INDUSTRY_PAGE.getHeading} />
        </Reveal>
        <Reveal>
          <ul className="grid max-w-[1000px] grid-cols-[minmax(0,1fr)] gap-x-14 gap-y-3.5 text-[16.5px] min-[760px]:grid-cols-2">
            {industry.whatYouGet.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check aria-hidden="true" className="mt-0.5 size-[19px] flex-none text-sage" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section labelledBy="h-basket" tight>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
          <Reveal>
            <SectionHead id="h-basket" className="mb-0" title={INDUSTRY_PAGE.basketHeading} />
          </Reveal>
          <Reveal className="min-w-0 max-w-[560px]">
            <Shell>
              <ul className="grid">
                {basketPlans(industry.suggested).map((plan) => (
                  <li key={plan.id} className="border-b border-line py-3 font-display text-[19px] font-medium tracking-[-0.02em]">{plan.name}</li>
                ))}
              </ul>
              <p className="num font-display text-[clamp(40px,4.4vw,56px)] font-normal leading-none tracking-[-0.05em]">
                {formatInr(monthlyTotal(industry.suggested))}
                <small className="ml-2.5 font-sans text-[15px] font-medium tracking-normal text-ink-2">{INDUSTRY_PAGE.priceNote}</small>
              </p>
              <ArrowLink href="/pricing#compare">{INDUSTRY_PAGE.compareLabel}</ArrowLink>
            </Shell>
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="h-ifaq" tight>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
          <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
            <Reveal className="grid justify-items-start">
              <SectionHead id="h-ifaq" title={INDUSTRY_PAGE.faqHeading} className="mb-6" />
              <ArrowLink href="/contact#start">{INDUSTRY_PAGE.contactLabel}</ArrowLink>
            </Reveal>
          </div>
          <Reveal className="min-w-0">
            <Faq items={industry.faq} id="industry-faq" />
          </Reveal>
        </div>
      </Section>

      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: industry.name, path }])} />
      <JsonLd data={audienceServiceJsonLd({ name: industry.h1, description: industry.description, path, audienceType: industry.name })} />
    </>
  );
}
