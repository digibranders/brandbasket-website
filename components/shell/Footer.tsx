// components/shell/Footer.tsx
import Link from "next/link";
import type { ReactElement } from "react";
import { FOOTER_NAV, LEGAL_NAV } from "@/content/navigation";
import { businessDetails } from "@/lib/site-config";
import { Logo } from "./Logo";

export function Footer(): ReactElement {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto grid max-w-[1280px] gap-8 border-t border-line px-[clamp(18px,4vw,56px)] pb-5 pt-14">
      <div className="grid gap-7 min-[900px]:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="grid max-w-[38ch] gap-3.5 text-[14.5px] text-ink-2"><Logo /><p>Websites, Google, ads and local search for local businesses, run for you every month.</p></div>
        <FooterList title="Brandbasket" links={FOOTER_NAV} />
        <FooterList title="Legal" links={LEGAL_NAV} />
        <div>
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Talk to us</h2>
          <ul className="grid gap-2 text-[14.5px]">
            <li><a href={`mailto:${businessDetails.email}`}>{businessDetails.email}</a></li>
            <li><a href={`tel:${businessDetails.phoneHref}`}>{businessDetails.phone}</a></li>
            <li>{businessDetails.hours}</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <p className="max-w-[92ch] text-[12.5px] leading-relaxed text-ink-2">
          <b className="font-semibold text-ink">Brandbasket is a brand of {businessDetails.legalName}.</b> CIN {businessDetails.cin} · GSTIN {businessDetails.gstNumber} · Registered office: {businessDetails.address.join(" ")}. Payments by Razorpay. © {year} {businessDetails.legalName}.
        </p>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { readonly title: string; readonly links: readonly { label: string; href: string }[] }): ReactElement {
  return (
    <div>
      <h2 className="mb-3 text-[13px] font-semibold text-ink-2">{title}</h2>
      <ul className="grid gap-2 text-[14.5px]">{links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
    </div>
  );
}
