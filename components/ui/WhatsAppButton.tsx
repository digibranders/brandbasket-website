// components/ui/WhatsAppButton.tsx
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { businessDetails } from "@/lib/site-config";

type Tone = "default" | "inverse";

const TONES: Readonly<Record<Tone, string>> = {
  default: "border-line bg-surface text-ink hover:border-[var(--whatsapp)]",
  // Mock: .closing .wa-btn, on the dark closing block.
  inverse: "border-action-ink/30 bg-transparent text-action-ink",
};

interface WhatsAppButtonProps {
  readonly label?: string;
  readonly tone?: Tone;
}

export function WhatsAppButton({ label = "Chat on WhatsApp", tone = "default" }: WhatsAppButtonProps): ReactElement {
  return (
    <a href={businessDetails.whatsappHref} target="_blank" rel="noopener" className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border py-3 pl-3.5 pr-5 text-[15px] font-semibold ${TONES[tone]}`}>
      <WhatsappLogo aria-hidden="true" weight="fill" className="size-5 text-[var(--whatsapp)]" />
      {label}
    </a>
  );
}
