// components/contact/ContactChannels.tsx
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { CONTACT_PAGE } from "@/content/contact";
import { trackAttrs } from "@/lib/analytics";
import { OYECHATS_BOT_KEY } from "@/lib/oyechats";
import { businessDetails } from "@/lib/site-config";

interface Channel {
  readonly label: string;
  readonly detail: string;
  readonly href: string;
  readonly icon: Icon;
  readonly whatsapp?: boolean;
}

const CHANNELS: readonly Channel[] = [
  { label: "WhatsApp", detail: `${businessDetails.phone}, ${CONTACT_PAGE.whatsappNote}`, href: businessDetails.whatsappHref, icon: WhatsappLogo, whatsapp: true },
  { label: "Call us", detail: businessDetails.phone, href: `tel:${businessDetails.phoneHref}`, icon: Phone },
  { label: "Email", detail: businessDetails.email, href: `mailto:${businessDetails.email}`, icon: EnvelopeSimple },
];

/** Direct channels (mock: .ct-ways). With a chat bot set up, the chat card (its own area on the page) takes the WhatsApp row's place; WhatsApp stays as the floating icon on every page. The registered office is not printed here (owner, 2026-10-28); it stays on the legal pages. */
export function ContactChannels(): ReactElement {
  return (
    <ul className={OYECHATS_BOT_KEY === null ? "mt-8 grid gap-3" : "grid gap-3 min-[1000px]:mt-3"}>
      {CHANNELS.filter((channel) => OYECHATS_BOT_KEY === null || channel.whatsapp !== true).map(({ label, detail, href, icon: ChannelIcon, whatsapp }) => (
        <li key={label}>
          <a
            href={href}
            {...(whatsapp ? { target: "_blank", rel: "noopener", ...trackAttrs("whatsapp_click", "contact") } : {})}
            className="ct-way group"
          >
            <span aria-hidden="true" className={`grid size-[46px] place-items-center rounded-2xl ${whatsapp ? "bg-[color-mix(in_srgb,var(--whatsapp)_12%,var(--surface))] text-[var(--whatsapp)]" : "bg-rattan-wash text-rattan-ink"}`}>
              <ChannelIcon weight={whatsapp ? "fill" : "duotone"} className="size-[23px]" />
            </span>
            <span>
              <b className="block font-display text-lg font-medium tracking-[-0.02em]">{label}</b>
              <span className="text-sm text-ink-2">{detail}</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-[18px] text-ink-2 transition-[transform,color] duration-[400ms] ease-[var(--ease)] group-hover:translate-x-[3px] group-hover:text-ink" />
          </a>
        </li>
      ))}
    </ul>
  );
}
