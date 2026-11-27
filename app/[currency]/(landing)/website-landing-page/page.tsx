// app/[currency]/(landing)/website-landing-page/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { StartBar } from "@/components/start/StartBar";
import { WorkHand } from "@/components/start/WorkHand";
import { StartFacts } from "@/components/start/StartFacts";
import { CareSection, StartClosing, StartFaq, StartHero, StepsSection } from "@/components/start/StartSections";
import { Band } from "@/components/ui/Band";
import { BAR_NOTE, START_PAY_LABEL } from "@/content/start";
import { currencyParam } from "@/lib/currency";
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
      <StartFacts />
      <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
        <div className="max-[639px]:hidden">
          <WorkShowcase />
        </div>
        <WorkHand />
      </Band>
      <CareSection currency={currency} />
      <StepsSection />
      <StartFaq currency={currency} />
      <StartClosing />
      <StartBar currency={currency} unit="/month" note={BAR_NOTE} label={START_PAY_LABEL} />
    </>
  );
}
