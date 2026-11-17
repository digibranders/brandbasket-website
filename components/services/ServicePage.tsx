import type { Icon } from "@phosphor-icons/react";
import {
  Article,
  Buildings,
  ChartLineUp,
  Check,
  FileText,
  Headset,
  InstagramLogo,
  LockKey,
  MagnifyingGlass,
  MapPin,
  Megaphone,
  Minus,
  Phone,
  Question,
  ShieldCheck,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Faq } from "@/components/ui/Faq";
import { OfferLine } from "@/components/ui/OfferLine";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { SERVICE_COPY, type ServiceGroup, type ServiceIconKey, type ServicePageContent } from "@/content/services";
import type { Currency } from "@/lib/currency";
import type { PlanId } from "@/lib/pricing";
import { colourOf } from "./blocks";

// Sections every service page shares: who it is for, the website's page list card, the explainer, what is not included and
// the questions. Each page composes them with its own hero and sections (WebsitePage, SocialPage, AdsPage).

const GROUP_ICON: Readonly<Record<ServiceIconKey, Icon>> = {
  FileText,
  Phone,
  ShieldCheck,
  LockKey,
  Headset,
  InstagramLogo,
  MapPin,
  Star,
  Megaphone,
  ChartLineUp,
  MagnifyingGlass,
  Article,
  Buildings,
  Question,
};

/** A group with more items than this lists them in two columns (it already spans the full width as the last, odd card). */
const LONG_GROUP = 6;

const RING = "shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)]";

/** Who the plan is for. */
export function Who({ page }: { readonly page: ServicePageContent }): ReactElement {
  return (
    <Section labelledBy="h-who" tight>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
        <Reveal><SectionHead id="h-who" className="mb-0" title={page.who.heading} /></Reveal>
        <Reveal className="min-w-0">
          <ul className="grid">
            {page.who.items.map((item) => (
              <li key={item.title} className="border-t border-line py-6 last:border-b">
                <h3 className="font-display text-[22px] font-medium leading-[1.2] tracking-[-0.025em]">{item.title}</h3>
                <p className="mt-1.5 max-w-[56ch] text-[16.5px] text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/** One card of grouped items. The website page shows its list of pages with it. */
export function Group({ group, id }: { readonly group: ServiceGroup; readonly id: PlanId }): ReactElement {
  const GroupIcon = GROUP_ICON[group.icon];
  return (
    <article className={`grid content-start gap-4 rounded-[24px] bg-surface p-6 min-[760px]:[&:last-child:nth-child(odd)]:col-span-2 ${RING}`} style={colourOf(id)}>
      <header className="flex items-center gap-3.5">
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--c)_14%,var(--surface))] text-[var(--c)]"><GroupIcon weight="duotone" className="size-6" /></span>
        <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em]">{group.title}</h3>
      </header>
      <ul className={`grid gap-2.5 ${group.items.length > LONG_GROUP ? "min-[760px]:grid-cols-2 min-[760px]:gap-x-8" : ""}`}>
        {group.items.map((item) => (
          <li key={item} className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[15.5px] leading-[1.4]">
            <Check aria-hidden="true" className="mt-px size-[18px] text-sage" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** What sets a plan apart: the free build offer or an explainer. */
export function Spotlight({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement | null {
  const { spotlight } = page;
  if (spotlight === undefined) return null;
  const body = spotlight.body.map((paragraph) => <p key={paragraph} className="max-w-[54ch] text-[17px] text-ink-2">{paragraph}</p>);
  return (
    <Section labelledBy="h-spotlight" tight>
      <Reveal>
        <div style={colourOf(page.id)} className="grid items-center gap-8 rounded-[32px] bg-[color-mix(in_srgb,var(--c)_9%,var(--surface))] px-[clamp(22px,4vw,56px)] py-[clamp(28px,4vw,52px)] min-[980px]:grid-cols-[1.1fr_0.9fr] min-[980px]:gap-14">
          <div className="grid gap-4">
            <h2 id="h-spotlight" className="font-display text-[clamp(30px,3.6vw,46px)] font-normal leading-[1.05] tracking-[-0.04em]">{spotlight.heading}</h2>
            {spotlight.kind === "explainer" ? null : body}
          </div>
          {spotlight.kind === "explainer" ? <div className="grid gap-4">{body}</div> : null}
          {spotlight.kind === "offer" ? (
            <div className="grid justify-items-start min-[980px]:justify-items-end"><OfferLine currency={currency} /></div>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}

/** "What is not included". */
export function Limits({ page }: { readonly page: ServicePageContent }): ReactElement {
  return (
    <Section labelledBy="h-limits" tight>
      <Reveal>
        <div className="grid gap-8 rounded-[28px] bg-sunken px-[clamp(22px,4vw,48px)] py-[clamp(26px,4vw,44px)] min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
          <SectionHead id="h-limits" className="mb-0" title={page.limits.heading} lede={page.limits.lede} step />
          <ul className="grid content-start gap-3">
            {page.limits.items.map((item) => (
              <li key={item} className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[16px] leading-[1.4] text-ink-2">
                <Minus aria-hidden="true" className="mt-px size-[18px] opacity-70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

/** The plan's questions. */
export function ServiceFaq({ page }: { readonly page: ServicePageContent }): ReactElement {
  return (
    <Section labelledBy="h-service-faq" tight>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
        <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
          <Reveal><SectionHead id="h-service-faq" title={SERVICE_COPY.faqHeading} step /></Reveal>
        </div>
        <Reveal className="min-w-0"><Faq items={page.faq} id={`${page.slug}-faq`} /></Reveal>
      </div>
    </Section>
  );
}
