"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { usePagePath } from "@/components/currency/usePagePath";
import { campaignSource, campaignWhatsAppMessage, ECOMMERCE_CAMPAIGN_PATH } from "@/content/ecommerce-campaign";
import { START } from "@/content/start";
import { trackAttrs } from "@/lib/analytics";
import { businessDetails } from "@/lib/site-config";

export function LandingWhatsAppLink({ message }: { readonly message?: string }): ReactElement {
  const href = message === undefined ? businessDetails.whatsappHref : `${businessDetails.whatsappHref}?text=${encodeURIComponent(message)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={START.reach.whatsapp} className="grid size-[42px] place-items-center rounded-full border border-line bg-surface text-[var(--whatsapp)]" {...trackAttrs("whatsapp_click", "landing_header")}>
      <WhatsappLogo aria-hidden="true" weight="fill" className="size-[22px]" />
    </a>
  );
}

export function LandingWhatsApp(): ReactElement {
  const path = usePagePath();
  const query = useSearchParams();
  if (path !== ECOMMERCE_CAMPAIGN_PATH) return <LandingWhatsAppLink />;
  const source = campaignSource(query.getAll("source").length === 1 ? query.get("source") : null, query.getAll("utm_source").length === 1 ? query.get("utm_source") : null);
  return <LandingWhatsAppLink message={campaignWhatsAppMessage(source)} />;
}
