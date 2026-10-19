import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES, INDUSTRIES_HUB } from "@/content/industries";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: INDUSTRIES_HUB.title, description: INDUSTRIES_HUB.description, path: "/industries" }),
  title: { absolute: INDUSTRIES_HUB.title },
};

/** The industries hub: the site's only card grid. Each card is one link and holds nothing else (plan 02, Task 7.2). */
export default function IndustriesPage(): ReactElement {
  return (
    <>
      <section aria-labelledby="h-industries" className="[background:var(--hero)]">
        <div className="in-wrap grid gap-[18px] pb-12 pt-32">
          <h1 id="h-industries" className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{INDUSTRIES_HUB.h1}</h1>
          <p className="max-w-[46ch] text-lg text-ink-2">{INDUSTRIES_HUB.lede}</p>
        </div>
      </section>
      <div className="in-wrap pb-24">
        <Reveal>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <li key={industry.slug} className="grid">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group grid content-start gap-2.5 rounded-[23px] border border-line bg-surface p-6 transition-colors duration-300 hover:border-rattan"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-[22px] font-medium tracking-[-0.02em]">
                    {industry.name}
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
