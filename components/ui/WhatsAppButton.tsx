// components/ui/WhatsAppButton.tsx
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { trackAttrs } from "@/lib/analytics";
import { businessDetails } from "@/lib/site-config";
import { outlineClasses, PhoneLabel } from "./OutlineButton";

interface WhatsAppButtonProps {
  /** Where the button sits, reported with its whatsapp_click event. */
  readonly location: string;
  readonly label?: string;
  /** What to say instead of the label on a phone. */
  readonly short?: string;
  readonly tone?: "default" | "inverse";
}

export function WhatsAppButton({ location, label = "Chat on WhatsApp", short, tone = "default" }: WhatsAppButtonProps): ReactElement {
  return (
    <a href={businessDetails.whatsappHref} target="_blank" rel="noopener" {...trackAttrs("whatsapp_click", location)} className={`${outlineClasses(tone)} pl-[18px] pr-6`}>
      <WhatsappLogo aria-hidden="true" weight="fill" className="size-5 text-[var(--whatsapp)]" />
      <PhoneLabel full={label} short={short} />
    </a>
  );
}
