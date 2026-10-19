// components/contact/ContactChannels.tsx
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
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
      <ul className="mt-8 grid">
        {CHANNELS.map(({ label, detail, href, icon: ChannelIcon, whatsapp }) => (
          <li key={label} className="[&:last-child>a]:border-b">
            <a
              href={href}
              {...(whatsapp ? { target: "_blank", rel: "noopener", ...trackAttrs("whatsapp_click", "contact") } : {})}
              className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 border-t border-line py-4"
            >
              <span aria-hidden="true" className={`grid size-[42px] place-items-center rounded-[13px] bg-sunken ${whatsapp ? "text-[var(--whatsapp)]" : "text-ink"}`}>
                <ChannelIcon weight={whatsapp ? "regular" : "fill"} className="size-[21px]" />
              </span>
              <span>
                <b className="block font-display text-lg font-medium tracking-[-0.02em]">{label}</b>
                <span className="text-sm text-ink-2">{detail}</span>
              </span>
              <ArrowRight aria-hidden="true" className="size-4 text-ink-2 transition-[transform,color] duration-[400ms] ease-[var(--ease)] group-hover:translate-x-[3px] group-hover:text-ink" />
            </a>
          </li>
        ))}
      </ul>
      <dl className="mt-7 grid gap-4 text-[14.5px]">
        <div><dt className="text-[13px] font-semibold text-ink-2">{CONTACT_PAGE.officeLabel}</dt><dd className="mt-2 max-w-[46ch] text-ink-2 leading-relaxed">{OFFICE}</dd></div>
      </dl>
    </>
  );
}
