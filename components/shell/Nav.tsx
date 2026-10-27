// components/shell/Nav.tsx
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { BasketTrigger } from "@/components/basket/BasketTrigger";
import { BASKET_COPY } from "@/content/basket";
import { LOGIN_LINK, PRIMARY_NAV } from "@/content/navigation";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { NavScrollState } from "./NavScrollState";
import { ServicesMenu } from "./ServicesMenu";

/** The Quiet nav (owner's pick, 2026-10-26): logo left; Services, the links, Log in and the basket button together on the right. Styles in nav.css. */
export function Nav(): ReactElement {
  return (
    <header className="site-nav fixed inset-x-0 top-0 z-30">
      <NavScrollState />
      <nav aria-label="Site" className="in-wrap relative flex h-16 items-center gap-3 min-[1000px]:h-[72px] min-[1000px]:gap-6">
        <Link href="/" aria-label="Brandbasket home"><Logo priority /></Link>
        <ul className="ml-auto hidden gap-0.5 min-[1000px]:flex">
          <ServicesMenu />
          {PRIMARY_NAV.map((link) => (
            <li key={link.href}><Link href={link.href} className="nav-link block px-3.5 py-2 text-[14.5px] text-ink-2 transition-colors duration-300 hover:text-ink">{link.label}</Link></li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-1.5 min-[1000px]:ml-0">
          <a href={LOGIN_LINK.href} className="hidden items-center gap-2 px-3.5 py-2 text-[14.5px] text-ink-2 transition-colors duration-300 hover:text-ink sm:inline-flex"><UserCircle aria-hidden="true" className="size-[19px] text-ink" />{LOGIN_LINK.label}</a>
          <span className="hidden sm:inline-flex"><BasketTrigger anchor="nav" location="nav" size="sm" label={BASKET_COPY.startPlan} /></span>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
