// components/shell/Nav.tsx
import Link from "next/link";
import type { ReactElement } from "react";
import { BasketTrigger } from "@/components/basket/BasketTrigger";
import { BASKET_COPY } from "@/content/basket";
import { LOGIN_LINK, PRIMARY_NAV } from "@/content/navigation";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { NavScrollState } from "./NavScrollState";

export function Nav(): ReactElement {
  return (
    <>
      <NavScrollState />
      <header className="pointer-events-none fixed inset-x-0 top-4 z-30 in-wrap">
        <nav aria-label="Site" className="pointer-events-auto relative flex w-full items-center gap-3 rounded-full border border-[var(--line-2)] bg-[var(--nav)] py-[7px] pl-[18px] pr-[7px] shadow-[var(--shadow-nav)] backdrop-blur-xl transition-[background-color,box-shadow] duration-500 [html[data-scrolled=true]_&]:bg-surface/95 [html[data-scrolled=true]_&]:shadow-[var(--shadow-nav-scrolled)]">
          <Link href="/" aria-label="Brandbasket home"><Logo priority /></Link>
          <ul className="ml-auto hidden gap-1 min-[1000px]:flex">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}><Link href={link.href} className="rounded-full px-3 py-[7px] text-[14.5px] text-ink-2 hover:text-ink">{link.label}</Link></li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-1.5 min-[1000px]:ml-0">
            <a href={LOGIN_LINK.href} className="hidden rounded-full px-3 py-[7px] text-[14.5px] text-ink-2 hover:text-ink sm:inline-flex">{LOGIN_LINK.label}</a>
            <span className="hidden sm:inline-flex"><BasketTrigger anchor="nav" location="nav" size="sm" label={BASKET_COPY.startPlan} /></span>
            <MobileMenu />
          </div>
        </nav>
      </header>
    </>
  );
}
