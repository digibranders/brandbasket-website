// components/ui/WhatsAppButton.tsx
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { businessDetails } from "@/lib/site-config";

export function WhatsAppButton({ label = "Chat on WhatsApp" }: { readonly label?: string }): ReactElement {
  return (
    <a href={businessDetails.whatsappHref} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface py-3 pl-3.5 pr-5 text-[15px] font-semibold text-ink hover:border-[var(--whatsapp)]">
      <WhatsappLogo aria-hidden="true" weight="fill" className="size-5 text-[var(--whatsapp)]" />
      {label}
    </a>
  );
}
