import type { ReactElement } from "react";
import { OFFICE_LABELS } from "@/content/legal/labels";
import { businessDetails } from "@/lib/site-config";
import { LEGAL_IDS } from "./section-id";

interface RegisteredOfficeProps {
  readonly className?: string;
}

/** The legal entity behind Brandbasket: name, registered address, CIN, GSTIN and how to reach it. Shared by legal, About and Contact. */
export function RegisteredOffice({ className = "" }: RegisteredOfficeProps): ReactElement {
  const { legalName, address, cin, gstNumber, phone, phoneHref, email } = businessDetails;
  const facts = [
    { label: OFFICE_LABELS.cin, value: cin },
    { label: OFFICE_LABELS.gstin, value: gstNumber },
    { label: OFFICE_LABELS.phone, value: phone, href: `tel:${phoneHref}` },
    { label: OFFICE_LABELS.email, value: email, href: `mailto:${email}` },
  ];

  return (
    <section aria-labelledby={LEGAL_IDS.office} className={`min-w-0 rounded-[20px] border border-line bg-surface p-[24px] sm:p-[32px] ${className}`}>
      <h2 id={LEGAL_IDS.office} className="font-display text-[22px] font-normal leading-tight tracking-[-0.02em]">{OFFICE_LABELS.title}</h2>
      <address className="mt-5 grid gap-1 text-[15px] not-italic leading-relaxed text-ink-2">
        <span className="font-medium text-ink">{legalName}</span>
        {address.map((line) => <span key={line}>{line}</span>)}
      </address>
      <dl className="mt-6 grid gap-3 border-t border-line pt-5 text-sm text-ink-2">
        {facts.map(({ label, value, href }) => (
          <div key={label} className="grid grid-cols-[4rem_minmax(0,1fr)] items-baseline gap-x-3">
            <dt className="font-medium text-ink">{label}</dt>
            <dd className="num min-w-0 break-words">{href ? <a href={href} className="underline underline-offset-[3px]">{value}</a> : value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
