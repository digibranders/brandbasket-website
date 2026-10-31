// components/start/StartSections.tsx
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Logo } from "@/components/shell/Logo";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Faq } from "@/components/ui/Faq";
import { OfferLine } from "@/components/ui/OfferLine";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { homeFaqFor, offerFor } from "@/content/home";
import { CARE, START, START_CLOSING, START_FAQ_HEADING, START_FAQ_QUESTIONS, START_PAY_LABEL, START_STEPS, startFactsFor, SUPPORT_HOURS } from "@/content/start";
import type { Currency } from "@/lib/currency";
import { businessDetails } from "@/lib/site-config";
import "@/components/shell/footer.css";
import { START_ICONS } from "./icons";
import { StartForm } from "./StartForm";

/** The only things to click above the form: the logo (no link out), a call and WhatsApp. No navigation. */
export function StartHeader(): ReactElement {
  return (
    <header className="in-wrap flex h-[72px] items-center justify-between gap-3">
      <Logo priority />
      <div className="flex items-center gap-2">
        <a href={`tel:${businessDetails.phoneHref}`} className="inline-flex h-[42px] items-center gap-2 rounded-full border border-line bg-surface px-3 font-display text-[14.5px] font-semibold min-[421px]:pr-4">
          <Phone aria-hidden="true" weight="fill" className="size-[19px] text-rattan-text" />
          <span className="max-[420px]:sr-only">{businessDetails.phone}</span>
          <span className="sr-only min-[421px]:hidden">{START.reach.call}</span>
        </a>
        <a href={businessDetails.whatsappHref} target="_blank" rel="noopener" aria-label={START.reach.whatsapp} className="grid size-[42px] place-items-center rounded-full border border-line bg-surface text-[var(--whatsapp)]">
          <WhatsappLogo aria-hidden="true" weight="fill" className="size-[22px]" />
        </a>
      </div>
    </header>
  );
}

/** The headline, the approved offer line and the form: the only thing on the page that asks for anything. */
export function StartHero({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <section aria-labelledby="h-start" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]" />
      <div className="in-wrap relative grid grid-cols-[minmax(0,1fr)] items-start gap-6 pb-10 pt-4 min-[980px]:grid-cols-[1.04fr_0.96fr] min-[980px]:gap-14 min-[980px]:pb-[72px] min-[980px]:pt-10">
        <div className="grid min-w-0 justify-items-start gap-4 min-[980px]:gap-5 min-[980px]:pt-6">
          <h1 id="h-start" className="font-display text-[clamp(40px,6.2vw,78px)] font-medium leading-[0.98] tracking-[-0.05em]">
            {START.headline} <em className="block font-light not-italic text-rattan-text">{START.headlineAccent}</em>
          </h1>
          <p className="max-w-[44ch] text-[clamp(17px,1.5vw,19.5px)] text-ink-2">{START.lede}</p>
          <OfferLine currency={currency} />
        </div>
        <div id="start" className="relative scroll-mt-4 rounded-3xl border border-line bg-surface p-[clamp(20px,2.4vw,32px)] shadow-[var(--shadow-float)]">
          <StartForm />
        </div>
      </div>
    </section>
  );
}

export function StartFacts({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <section aria-label="The basics" className="border-y border-line bg-surface">
      <ul className="in-wrap grid grid-cols-2 gap-x-4 gap-y-[18px] py-[22px] min-[760px]:grid-cols-4">
        {startFactsFor(currency).map((fact) => {
          const Icon = START_ICONS[fact.icon];
          return (
            <li key={fact.text} className="flex items-center gap-3 font-display text-base font-medium leading-tight tracking-[-0.015em]">
              <span aria-hidden="true" className="grid size-[42px] flex-none place-items-center rounded-full bg-rattan-wash text-rattan-ink"><Icon className="size-[22px]" /></span>
              {fact.text}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The monthly plan's twelve points in four groups, beside a sticky price card that repeats the offer and the one button. */
export function CareSection({ currency }: { readonly currency: Currency }): ReactElement {
  const offer = offerFor(currency);
  return (
    <Section id="care" labelledBy="h-care" tight>
      <Reveal>
        <SectionHead id="h-care" step title={<>{CARE.heading} <span className="font-light text-rattan-text">{CARE.headingAccent}</span></>} />
      </Reveal>
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 min-[980px]:grid-cols-[0.72fr_1.28fr] min-[980px]:gap-16">
        <Reveal className="min-[980px]:sticky min-[980px]:top-6">
          <aside aria-label="The price" className="grid gap-[22px] rounded-3xl bg-action p-[clamp(22px,2.4vw,32px)] text-action-ink shadow-[var(--shadow-float)]">
            <h3 className="font-display text-[22px] font-medium leading-[1.15] tracking-[-0.025em] text-action-ink/78">{CARE.priceTitle}</h3>
            <div className="grid gap-1">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <s className="num font-display text-[22px] leading-none text-action-ink/60 decoration-rattan"><span className="sr-only">Usually </span>{offer.build.was}</s>
                <b className="num font-display text-[clamp(40px,4.4vw,56px)] font-medium leading-none tracking-[-0.045em] text-[#e0b277]">{offer.build.price}</b>
              </p>
              <span className="text-sm text-action-ink/78">{offer.build.label}</span>
            </div>
            <div aria-hidden="true" className="border-t border-dashed border-action-ink/30" />
            <div className="grid gap-1">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <s className="num font-display text-[22px] leading-none text-action-ink/60 decoration-rattan"><span className="sr-only">Usually </span>{offer.run.was}</s>
                <b className="num font-display text-[clamp(40px,4.4vw,56px)] font-medium leading-none tracking-[-0.045em]">{offer.run.price}</b>
                <small className="font-sans text-[15px] font-medium text-action-ink/78">{offer.run.unit}</small>
              </p>
              <span className="text-sm text-action-ink/78">{offer.run.label}</span>
            </div>
            <ArrowButton href="#start" tone="inverse" location="start_price" short={START_PAY_LABEL} centered>{START_PAY_LABEL}</ArrowButton>
            <p className="text-center text-[13px] text-action-ink/78">{CARE.priceNote}</p>
          </aside>
        </Reveal>
        <Reveal className="grid gap-x-14 gap-y-9 min-[700px]:grid-cols-2">
          {CARE.groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1.5 border-b-[1.5px] border-rattan pb-3.5 text-[13px] font-semibold uppercase tracking-[0.04em] text-rattan-ink">{group.title}</h3>
              <ul>
                {group.items.map((item) => {
                  const Icon = START_ICONS[item.icon];
                  return (
                    <li key={item.title} className="grid grid-cols-[24px_1fr] gap-x-3 py-3.5">
                      <Icon aria-hidden="true" className="row-span-2 size-6 text-rattan-text" />
                      <b className="font-display text-lg font-medium leading-tight tracking-[-0.02em]">{item.title}</b>
                      <span className="text-[15px] leading-[1.45] text-ink-2">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

export function StepsSection(): ReactElement {
  return (
    <div className="border-y border-line bg-surface">
      <Section id="how" labelledBy="h-how">
        <Reveal>
          <SectionHead id="h-how" step title={<>{START_STEPS.heading} <span className="font-light text-rattan-text">{START_STEPS.headingAccent}</span></>} />
        </Reveal>
        <Reveal>
          <ol className="relative grid gap-7 min-[820px]:grid-cols-3 min-[820px]:gap-10 min-[820px]:before:absolute min-[820px]:before:inset-x-0 min-[820px]:before:top-[23px] min-[820px]:before:border-t-[1.5px] min-[820px]:before:border-dashed min-[820px]:before:border-rattan">
            {START_STEPS.steps.map((step) => {
              const Icon = START_ICONS[step.icon];
              return (
                <li key={step.title} className="relative grid content-start gap-2.5">
                  <span aria-hidden="true" className="relative grid size-[46px] place-items-center rounded-full border-[1.5px] border-rattan bg-rattan-wash text-rattan-ink"><Icon className="size-[22px]" /></span>
                  <span className="font-mono text-[13.5px] text-rattan-ink">{step.when}</span>
                  <h3 className="font-display text-[clamp(24px,2.4vw,30px)] font-medium leading-[1.1] tracking-[-0.035em]">{step.title}</h3>
                  <p className="max-w-[32ch] text-ink-2">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Section>
    </div>
  );
}

export function StartFaq({ currency }: { readonly currency: Currency }): ReactElement {
  const items = homeFaqFor(currency).filter((item) => (START_FAQ_QUESTIONS as readonly string[]).includes(item.q));
  return (
    <Section id="faq" labelledBy="h-faq">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.7fr_1.3fr] min-[980px]:gap-16">
        <div className="min-[980px]:sticky min-[980px]:top-6 min-[980px]:self-start">
          <Reveal>
            <SectionHead id="h-faq" step title={START_FAQ_HEADING} />
          </Reveal>
        </div>
        <Reveal className="min-w-0">
          <Faq items={items} id="start-faq" />
        </Reveal>
      </div>
    </Section>
  );
}

export function StartClosing(): ReactElement {
  return (
    <div className="in-wrap">
      <section aria-labelledby="h-start-close" className="relative mb-6 grid justify-items-start gap-[22px] overflow-hidden rounded-[32px] bg-action p-[clamp(32px,6vw,72px)] text-action-ink max-[560px]:p-5">
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[60px] -right-[60px] size-[340px] rounded-full opacity-60 [background:repeating-conic-gradient(from_0deg,var(--rattan)_0_6deg,transparent_6deg_12deg)] [mask:radial-gradient(circle,transparent_46%,#000_47%,#000_70%,transparent_71%)]" />
        <h2 id="h-start-close" className="relative max-w-[16ch] font-display text-[clamp(32px,4.4vw,60px)] font-normal leading-none tracking-[-0.045em]">
          {START_CLOSING.heading} <span className="text-[#e0b277]">{START_CLOSING.headingAccent}</span>
        </h2>
        <div className="relative z-[1]">
          <ArrowButton href="#start" tone="inverse" location="start_closing" short={START_PAY_LABEL}>{START_PAY_LABEL}</ArrowButton>
        </div>
        <p className="relative text-[15px] text-action-ink/78">
          {START_CLOSING.ringPre} <a href={`tel:${businessDetails.phoneHref}`} className="font-semibold text-action-ink underline underline-offset-4">{businessDetails.phone}</a>, {SUPPORT_HOURS}.
        </p>
      </section>
    </div>
  );
}

/**
 * The legal minimum, with no way out to the rest of the site, and the big faded mark the main site's footer ends on (same
 * classes, components/shell/footer.css). The spacer keeps the mark clear of the phone bar.
 */
export function StartFooter(): ReactElement {
  return (
    <footer className="site-footer">
      <div className="site-footer-body">
        <div className="in-wrap">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pb-6 pt-8 text-[13.5px] text-ink-2">
            <Link href="/privacy" className="text-ink underline underline-offset-[3px]">Privacy Policy</Link>
            <Link href="/terms" className="text-ink underline underline-offset-[3px]">Terms</Link>
            <Link href="/refund" className="text-ink underline underline-offset-[3px]">Refund and cancellation</Link>
          </nav>
          <div className="site-footer-colophon">
            <p>&copy; {new Date().getFullYear()} {businessDetails.tradeName}</p>
          </div>
        </div>
      </div>
      <div className="site-footer-signature" aria-hidden="true">
        <div className="in-wrap">
          <Image src="/brand/brandbasket-logo-horizontal-light.svg" alt="" width={1188} height={200} className="site-footer-wordmark" />
        </div>
      </div>
      <div aria-hidden="true" className="h-20 min-[980px]:hidden" />
    </footer>
  );
}
