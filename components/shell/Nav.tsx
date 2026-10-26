// components/shell/Nav.tsx
import Link from "next/link";
import type { ReactElement } from "react";
import { BasketTrigger } from "@/components/basket/BasketTrigger";
import { BASKET_COPY } from "@/content/basket";
import { LOGIN_LINK, PRIMARY_NAV } from "@/content/navigation";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { NavScrollState } from "./NavScrollState";

/** The Quiet nav (owner's pick, 2026-10-26): logo left, links centred, Log in and the basket button right. Styles in nav.css. */
export function Nav(): ReactElement {
  return (
    <header className="site-nav fixed inset-x-0 top-0 z-30">
      <NavScrollState />
      <nav aria-label="Site" className="in-wrap relative grid h-16 grid-cols-[1fr_auto] items-center gap-3 min-[1000px]:h-[72px] min-[1000px]:grid-cols-[1fr_auto_1fr] min-[1000px]:gap-6">
        <Link href="/" aria-label="Brandbasket home" className="justify-self-start"><Logo priority /></Link>
        <ul className="hidden gap-0.5 min-[1000px]:flex">
          {PRIMARY_NAV.map((link) => (
            <li key={link.href}><Link href={link.href} className="nav-link block px-3.5 py-2 text-[14.5px] text-ink-2 transition-colors duration-300 hover:text-ink">{link.label}</Link></li>
          ))}
        </ul>
        <div className="flex items-center justify-end gap-1.5">
          <a href={LOGIN_LINK.href} className="hidden px-3.5 py-2 text-[14.5px] text-ink-2 transition-colors duration-300 hover:text-ink sm:inline-flex">{LOGIN_LINK.label}</a>
          <span className="hidden sm:inline-flex"><BasketTrigger anchor="nav" location="nav" size="sm" label={BASKET_COPY.startPlan} /></span>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
