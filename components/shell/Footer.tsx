// components/shell/Footer.tsx
import Link from "next/link";
import type { ReactElement } from "react";
import { FOOTER_NAV, LEGAL_NAV } from "@/content/navigation";
import { businessDetails } from "@/lib/site-config";
import { Logo } from "./Logo";
import "./footer.css";

export function Footer(): ReactElement {
  return (
    <footer className="site-footer">
      <div className="site-footer-body">
        <div className="in-wrap">
          <div className="site-footer-grid">
            <div className="site-footer-brand">
              <Logo />
              <p>Websites, Google, ads and local search for local businesses, run for you every month.</p>
            </div>
            <FooterList title="Brandbasket" links={FOOTER_NAV} />
            <FooterList title="Legal" links={LEGAL_NAV} />
            <div className="site-footer-contact">
              <h2 className="site-footer-label">Talk to us</h2>
              <ul className="site-footer-contact-links">
                <li><a className="site-footer-link" href={`mailto:${businessDetails.email}`}>{businessDetails.email}</a></li>
                <li><a className="site-footer-link" href={`tel:${businessDetails.phoneHref}`}>{businessDetails.phone}</a></li>
              </ul>
            </div>
          </div>
          <div className="site-footer-colophon">
            <p>&copy; {new Date().getFullYear()} {businessDetails.tradeName}</p>
          </div>
        </div>
      </div>
      <div className="site-footer-signature" aria-hidden="true">
        <div className="in-wrap">
          <div className="site-footer-wordmark" />
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { readonly title: string; readonly links: readonly { label: string; href: string }[] }): ReactElement {
  return (
    <nav aria-label={title}>
      <h2 className="site-footer-label">{title}</h2>
      <ul className="site-footer-links">
        {links.map((link) => <li key={link.href}><Link className="site-footer-link" href={link.href}>{link.label}</Link></li>)}
      </ul>
    </nav>
  );
}
