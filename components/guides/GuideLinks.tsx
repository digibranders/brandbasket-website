import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { GUIDE_LINKS_HEADING } from "@/content/guides";
import type { LinkItem } from "@/content/types";

interface GuideLinksProps {
  readonly links: readonly LinkItem[];
  readonly heading?: string;
  readonly id?: string;
}

/** A short list of guides and pages worth reading next, so the commercial pages and the blog link to each other. */
export function GuideLinks({ links, heading = GUIDE_LINKS_HEADING, id = "h-guides" }: GuideLinksProps): ReactElement {
  return (
    <Section labelledBy={id} tight>
      <Reveal>
        <SectionHead id={id} title={heading} className="mb-8" step />
      </Reveal>
      <Reveal>
        <ul className="grid gap-x-14 gap-y-1 min-[900px]:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <ArrowLink href={link.href}>{link.label}</ArrowLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
