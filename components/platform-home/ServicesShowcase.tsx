import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { HOME_SERVICES, type HomeServiceId, SERVICES_HEADING } from "@/content/platform-home";
import { SERVICE_META } from "./service-meta";
import { SERVICE_PREVIEWS } from "./ServicePreviews";

/** Each panel's ground: the deep end of the plan colour, so white type reads on it. */
const GROUND: Readonly<Record<HomeServiceId, string>> = {
  website: "var(--rattan-ink)",
  social: "var(--c-growth-2)",
  ads: "var(--c-search-2)",
};

/** "Social Media Management" becomes the big "Social Media" and the small "Management". */
function splitName(name: string): { readonly big: string; readonly small: string } {
  const at = name.lastIndexOf(" ");
  return at < 0 ? { big: name, small: "" } : { big: name.slice(0, at), small: name.slice(at + 1) };
}

/**
 * "Three Services. One Platform.": the three services as three poster panels in their own colours that pin and pile up
 * as the page scrolls, so three become one. Each panel carries the service name set huge, what it does, and a live
 * picture of the work. Server markup only: the stacking is CSS (`position: sticky`, components/platform-home/platform-home.css).
 * The panels are direct children of the stack, with no wrapper, because a wrapper would end each panel's pin early.
 */
export function ServicesShowcase(): ReactElement {
  return (
    <Section id="services" labelledBy="h-services" className="scroll-mt-24">
      <Reveal>
        <h2 id="h-services" className="mb-[clamp(28px,4vw,56px)] max-w-[14ch] font-display text-[clamp(40px,5.6vw,88px)] font-semibold leading-[0.98] tracking-[-0.052em]">
          {SERVICES_HEADING.lead} <em className="font-light not-italic text-rattan-text">{SERVICES_HEADING.accent}</em>
        </h2>
      </Reveal>
      <div className="svc-stack">
        {HOME_SERVICES.map((service, i) => {
          const { icon: Icon } = SERVICE_META[service.id];
          const Preview = SERVICE_PREVIEWS[service.id];
          const { big, small } = splitName(service.name);
          const headingId = `svc-${service.id}`;
          return (
            <article key={service.id} aria-labelledby={headingId} className="svc-panel" style={{ "--ground": GROUND[service.id], "--i": i } as CSSProperties}>
              <Icon aria-hidden="true" weight="thin" className="svc-mark" />
              <div className="svc-copy">
                <h3 id={headingId} className="svc-name">
                  {big}
                  {small ? <span>{small}</span> : null}
                </h3>
                <p className="svc-body">{service.body}</p>
                <ul aria-label={`${service.name} includes`} className="svc-caps">
                  {service.capabilities.map((c) => <li key={c}>{c}</li>)}
                </ul>
                <Link href={service.href} className="svc-cta group">
                  {service.cta}
                  <ArrowRight aria-hidden="true" weight="bold" className="size-[18px] transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
                </Link>
              </div>
              <div aria-hidden="true" className="svc-stage"><Preview /></div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
