// components/contact/ContactChannels.tsx
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, EnvelopeSimple, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { CONTACT_PAGE } from "@/content/contact";
import { trackAttrs } from "@/lib/analytics";
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

const { legalName, postalAddress } = businessDetails;
const OFFICE = `${legalName}, ${postalAddress.street}, ${postalAddress.locality}, ${postalAddress.region} ${postalAddress.postalCode}`;

/** Direct channels and registered office (mock: .ct-ways, .ct-meta). */
export function ContactChannels(): ReactElement {
  return (
    <>
      <ul className="mt-8 grid gap-3">
        {CHANNELS.map(({ label, detail, href, icon: ChannelIcon, whatsapp }) => (
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
      <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 px-1">
        <span aria-hidden="true" className="grid size-[46px] place-items-center rounded-2xl bg-sunken text-ink-2"><MapPin weight="duotone" className="size-[23px]" /></span>
        <dl className="text-[14.5px]">
          <dt className="text-[13px] font-semibold text-ink-2">{CONTACT_PAGE.officeLabel}</dt>
          <dd className="mt-1.5 max-w-[46ch] leading-relaxed text-ink-2">{OFFICE}</dd>
        </dl>
      </div>
    </>
  );
}
