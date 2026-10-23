// components/ui/WhatsAppButton.tsx
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { trackAttrs } from "@/lib/analytics";
import { businessDetails } from "@/lib/site-config";
import { outlineClasses } from "./OutlineButton";

interface WhatsAppButtonProps {
  /** Where the button sits, reported with its whatsapp_click event. */
  readonly location: string;
  readonly label?: string;
  readonly tone?: "default" | "inverse";
}

export function WhatsAppButton({ location, label = "Chat on WhatsApp", tone = "default" }: WhatsAppButtonProps): ReactElement {
  return (
    <a href={businessDetails.whatsappHref} target="_blank" rel="noopener" {...trackAttrs("whatsapp_click", location)} className={`${outlineClasses(tone)} pl-[18px] pr-6`}>
      <WhatsappLogo aria-hidden="true" weight="fill" className="size-5 text-[var(--whatsapp)]" />
      {label}
    </a>
  );
}
