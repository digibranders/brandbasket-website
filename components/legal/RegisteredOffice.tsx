import type { ReactElement } from "react";
import { OFFICE_LABELS } from "@/content/legal/labels";
import { businessDetails } from "@/lib/site-config";

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
    <section aria-labelledby="registered-office" className={`rounded-[23px] border border-line bg-surface p-7 ${className}`}>
      <h2 id="registered-office" className="font-display text-[22px] font-normal leading-tight tracking-[-0.02em]">{OFFICE_LABELS.title}</h2>
      <address className="mt-4 grid gap-0.5 text-[16.5px] not-italic leading-relaxed text-ink-2">
        <span className="text-ink">{legalName}</span>
        {address.map((line) => <span key={line}>{line}</span>)}
      </address>
      <dl className="mt-5 grid gap-1.5 text-[15px] text-ink-2">
        {facts.map(({ label, value, href }) => (
          <div key={label} className="flex flex-wrap gap-x-2">
            <dt className="text-ink">{label}</dt>
            <dd className="num">{href ? <a href={href} className="underline underline-offset-[3px]">{value}</a> : value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
