import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { GUIDE_LINKS_HEADING } from "@/content/guides";
import type { GuideLink } from "@/content/types";

interface GuideLinksProps {
  readonly links: readonly GuideLink[];
  readonly heading?: string;
  readonly id?: string;
}

/**
 * Guides and pages worth reading next, so the commercial pages and the blog link to each other. Each entry is a bold title
 * and a two-line summary between thin rules; the arrow appears only on hover or keyboard focus.
 */
export function GuideLinks({ links, heading = GUIDE_LINKS_HEADING, id = "h-guides" }: GuideLinksProps): ReactElement {
  return (
    <Section labelledBy={id} tight>
      <Reveal>
        <SectionHead id={id} title={heading} className="mb-8" step />
      </Reveal>
      <Reveal>
        <ul className="max-w-[680px] divide-y divide-line border-y border-line">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="group grid gap-2 py-6">
                <span className="flex items-center justify-between gap-4 font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-300 ease-[var(--ease)] group-hover:text-rattan-text group-focus-visible:text-rattan-text">
                  {link.label}
                  <ArrowRight aria-hidden="true" className="size-[18px] shrink-0 -translate-x-2 text-rattan-text opacity-0 transition-[transform,opacity] duration-300 ease-[var(--ease)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
                </span>
                <span className="line-clamp-2 text-[15px] leading-relaxed text-ink-2">{link.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
