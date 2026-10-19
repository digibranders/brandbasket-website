// app/page.tsx
import type { ReactElement } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { formatInr, PLANS } from "@/lib/pricing";

export default function HomePage(): ReactElement {
  return (
    <section className="mx-auto grid min-h-[80dvh] max-w-[1280px] content-center gap-5 px-[clamp(18px,4vw,56px)] pt-28">
      <h1 className="font-display text-[clamp(40px,5.6vw,82px)] font-medium leading-[0.96] tracking-[-0.052em]">Before They Visit You, They Visit <span className="font-light text-rattan-text">Your Website.</span></h1>
      <p className="text-lg text-ink-2">Your Business Has a Name. Give It a Place on the Internet for free.</p>
      <p className="text-ink-2">From <b className="num font-display text-ink">{formatInr(PLANS.website.monthly)}</b> a month + GST, website built free.</p>
      <div className="flex flex-wrap gap-2.5"><ArrowButton href="/contact#book">Get my free website</ArrowButton><WhatsAppButton /></div>
    </section>
  );
}
