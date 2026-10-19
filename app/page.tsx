// app/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { PhoneTotalBar } from "@/components/basket/PhoneTotalBar";
import { FactsStrip } from "@/components/home/FactsStrip";
import { HomeHero } from "@/components/home/HomeHero";
import { IndustriesLine } from "@/components/home/IndustriesLine";
import { PlansSection } from "@/components/home/PlansSection";
import { ReportSection } from "@/components/home/ReportSection";
import { formatInr, PLANS } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo/metadata";

const HOME_TITLE = "Free business website, run for you monthly | Brandbasket";
const HOME_DESCRIPTION = `Get a professional website built free for your local business. We host, secure and update it for ${formatInr(PLANS.website.monthly)} a month. Add Google and local search any time.`;

// pageMetadata gives the canonical and social tags; the absolute title skips the "%s | Brandbasket" template.
export const metadata: Metadata = {
  ...pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

/** Sections in mock order (docs/design/mock.html, #view-home). The closing section comes from the root layout. */
export default function HomePage(): ReactElement {
  return (
    <>
      <HomeHero />
      <FactsStrip />
      <IndustriesLine />
      <PlansSection />
      <ReportSection />
      <PhoneTotalBar />
    </>
  );
}
