// app/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PRIMARY_CTA } from "@/content/navigation";
import { formatInr, PLANS } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo/metadata";

const HOME_TITLE = "Free business website, run for you monthly | Brandbasket";
const HOME_DESCRIPTION = `Get a professional website built free for your local business. We host, secure and update it for ${formatInr(PLANS.website.monthly)} a month. Add Google and local search any time.`;

// pageMetadata gives the canonical and social tags; the absolute title skips the "%s | Brandbasket" template.
export const metadata: Metadata = {
  ...pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

export default function HomePage(): ReactElement {
  return (
    <section className="mx-auto grid min-h-[80dvh] max-w-[1280px] content-center gap-5 px-[clamp(18px,4vw,56px)] pt-28">
      <h1 className="font-display text-[clamp(40px,5.6vw,82px)] font-medium leading-[0.96] tracking-[-0.052em]">Before They Visit You, They Visit <span className="font-light text-rattan-text">Your Website.</span></h1>
      <p className="text-lg text-ink-2">Your Business Has a Name. Give It a Place on the Internet for free.</p>
      <p className="text-ink-2">From <b className="num font-display text-ink">{formatInr(PLANS.website.monthly)}</b> a month + GST, website built free.</p>
      <div className="flex flex-wrap gap-2.5"><ArrowButton href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</ArrowButton><WhatsAppButton /></div>
    </section>
  );
}
