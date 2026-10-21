// components/shell/Nav.tsx
import Link from "next/link";
import type { ReactElement } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { PRIMARY_CTA, PRIMARY_NAV } from "@/content/navigation";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { NavScrollState } from "./NavScrollState";

export function Nav(): ReactElement {
  return (
    <>
      <NavScrollState />
      {/* The offer strip renders on the server, so the nav starts below it and rises once it scrolls away or closes. */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-30 translate-y-11 px-3 transition-transform duration-500 ease-[var(--ease)] [html[data-promo=away]_&]:translate-y-0 [html[data-promo=closed]_&]:translate-y-0">
        <nav aria-label="Site" className="pointer-events-auto relative mx-auto flex w-full max-w-[1120px] items-center gap-3 rounded-full border border-[var(--line-2)] bg-[var(--nav)] py-[7px] pl-[18px] pr-[7px] shadow-[var(--shadow-nav)] backdrop-blur-xl transition-[background-color,box-shadow] duration-500 [html[data-scrolled=true]_&]:bg-surface/95 [html[data-scrolled=true]_&]:shadow-[var(--shadow-nav-scrolled)]">
          <Link href="/" aria-label="Brandbasket home"><Logo priority /></Link>
          <ul className="ml-auto hidden gap-1 min-[1000px]:flex">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}><Link href={link.href} className="rounded-full px-3 py-[7px] text-[14.5px] text-ink-2 hover:text-ink">{link.label}</Link></li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-1.5 min-[1000px]:ml-0">
            <span className="hidden sm:inline-flex"><ArrowButton href={PRIMARY_CTA.href} location="nav" size="sm">{PRIMARY_CTA.label}</ArrowButton></span>
            <MobileMenu />
          </div>
        </nav>
      </header>
    </>
  );
}
