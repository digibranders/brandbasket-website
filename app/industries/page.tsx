import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { INDUSTRIES, INDUSTRIES_HUB } from "@/content/industries";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.industries);

/** The industries hub: the site's only card grid. Each card is one link and holds nothing else (plan 02, Task 7.2). */
export default function IndustriesPage(): ReactElement {
  return (
    <>
      <PageHero id="h-industries" h1={INDUSTRIES_HUB.h1} lede={INDUSTRIES_HUB.lede} />
      <div className="in-wrap pb-24">
        <Reveal>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <li key={industry.slug} className="grid">
                <Link
                  href={`/industries/${industry.slug}`}
                  aria-labelledby={`industry-${industry.slug}`}
                  className="group grid content-start gap-2.5 rounded-[23px] border border-line bg-surface p-6 transition-colors duration-300 hover:border-rattan"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-[22px] font-medium tracking-[-0.02em]">
                    <span id={`industry-${industry.slug}`}>{industry.name}</span>
                    <ArrowRight aria-hidden="true" className="size-[18px] flex-none text-rattan-text transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
                  </span>
                  <span className="text-[15px] text-ink-2">{industry.lede}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} />
    </>
  );
}
