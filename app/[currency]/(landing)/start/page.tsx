// app/[currency]/(landing)/start/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { StartBar } from "@/components/start/StartBar";
import { CareSection, StartClosing, StartFacts, StartFaq, StartHero, StepsSection } from "@/components/start/StartSections";
import { Band } from "@/components/ui/Band";
import { barNoteFor, START_PAY_LABEL } from "@/content/start";
import { currencyParam, formatMoney } from "@/lib/currency";
import { planPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.start);

/**
 * The page ads land on (docs/design/ads-landing-mock.html): one offer, one form, proof, what the monthly price covers, the
 * steps, five questions, and the same button again. The form sends the visitor to the app's sign-up with their details sealed
 * into the address, or asks the support team to call.
 */
export default async function StartPage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      <StartHero currency={currency} />
      <StartFacts currency={currency} />
      <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
        <WorkShowcase />
      </Band>
      <CareSection currency={currency} />
      <StepsSection />
      <StartFaq currency={currency} />
      <StartClosing />
      <StartBar price={formatMoney(planPrice("website", currency), currency)} unit="/month" note={barNoteFor(currency)} label={START_PAY_LABEL} />
    </>
  );
}
