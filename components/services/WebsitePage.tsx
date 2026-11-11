import { ChartLineUp, CursorClick, Envelope, MapPin, Star } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FactsStrip } from "@/components/home/FactsStrip";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { Promises } from "@/components/home/Promises";
import { ReportSection } from "@/components/home/ReportSection";
import { Responsibility } from "@/components/home/Responsibility";
import { WhatYouGet } from "@/components/home/WhatYouGet";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/ui/Band";
import { DecorIcon } from "@/components/ui/DecorIcon";
import { Section } from "@/components/ui/Section";
import type { ServicePageContent } from "@/content/services";
import type { FaqItem } from "@/content/types";
import type { Currency } from "@/lib/currency";
import { PLANS } from "@/lib/pricing";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { Group, Limits } from "./ServicePage";

/** The "what we do" card kept from the old service page: the ten pages every build includes. */
const PAGE_LIST_TITLE = "10 pages for the website";
/** The service page's questions that the old homepage FAQ does not already answer. */
const EXTRA_FAQ: readonly string[] = ["What counts as an edit?", "Do I need my own domain?"];

function pick<T>(items: readonly T[], match: (item: T) => boolean, what: string): T {
  const found = items.find(match);
  if (found === undefined) throw new Error(`The website page needs "${what}" in content/services.ts`);
  return found;
}

/**
 * /services/managed-website: the website-first homepage as it was before the platform homepage (owner, 2026-11-06),
 * without the plan picker (that lives on Pricing). Kept from the old service page: the list of 10 pages, what is not
 * included, the two FAQ answers the homepage lacked, and the service and breadcrumb structured data.
 */
export function WebsitePage({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  const pageList = pick(page.does.groups, (g) => g.title === PAGE_LIST_TITLE, PAGE_LIST_TITLE);
  const moreFaq: readonly FaqItem[] = EXTRA_FAQ.map((q) => pick(page.faq, (item) => item.q === q, q));
  return (
    <>
      <HomeHero currency={currency} />
      <FactsStrip currency={currency} />
      <Responsibility />
      <WhatYouGet />
      <Section labelledBy="h-page-list" tight>
        <Reveal>
          <div className="grid">
            <h2 id="h-page-list" className="sr-only">{pageList.title}</h2>
            <Group group={pageList} id={page.id} />
          </div>
        </Reveal>
      </Section>
      <Promises />
      <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
        <DecorIcon icon={CursorClick} size={139} rotate={8} faint className="right-[19%] top-[78px] max-[760px]:hidden" />
        <DecorIcon icon={Star} size={109} rotate={-11} faint className="right-[10%] top-[118px] max-[760px]:hidden" />
        <DecorIcon icon={MapPin} size={126} rotate={12} faint className="right-[3%] top-[70px]" />
        <WorkShowcase />
      </Band>
      <Band>
        <DecorIcon icon={ChartLineUp} size={134} rotate={9} faint className="right-[11%] -top-3.5" />
        <DecorIcon icon={Envelope} size={109} rotate={-9} faint className="right-[3%] top-2 max-[760px]:hidden" />
        <ReportSection currency={currency} />
      </Band>
      <Limits page={page} />
      <HomeFaq currency={currency} more={moreFaq} />
      <JsonLd data={serviceJsonLd(page, currency)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }, { name: PLANS[page.id].name, path: page.path }])} />
    </>
  );
}
