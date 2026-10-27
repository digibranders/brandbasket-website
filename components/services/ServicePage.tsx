import type { Icon } from "@phosphor-icons/react";
import {
  Article,
  Buildings,
  ChartLineUp,
  Check,
  FileText,
  Globe,
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
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { PlanBasketButton } from "@/components/pricing/PlanBasketButton";
import { Faq } from "@/components/ui/Faq";
import { OfferLine } from "@/components/ui/OfferLine";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { StepsList } from "@/components/ui/StepsList";
import { SERVICE_COPY, type ServiceGroup, type ServiceIconKey, type ServicePageContent, serviceMoneyCopy } from "@/content/services";
import { type Currency, formatMoney } from "@/lib/currency";
import { packageSaving, PACKAGES, packageTotal, PLANS, planPrice, type PlanId } from "@/lib/pricing";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { ServiceStartButton } from "./ServiceStartButton";

const PLAN_ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, growth: Megaphone, search: MagnifyingGlass };
/** The plan colours already used by the pricing cards and the basket. */
const PLAN_COLOUR: Readonly<Record<PlanId, string>> = { website: "var(--c-site)", growth: "var(--c-growth)", search: "var(--c-search)" };
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

const RING = "shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)]";

function colourOf(id: PlanId): CSSProperties {
  return { "--c": PLAN_COLOUR[id] } as CSSProperties;
}

function Hero({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  const PlanIcon = PLAN_ICON[page.id];
  const plan = PLANS[page.id];
  return (
    <section aria-labelledby="h-service" style={colourOf(page.id)} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
      <div className="in-wrap relative grid gap-10 pb-16 pt-32 min-[980px]:grid-cols-[1.1fr_0.9fr] min-[980px]:items-center min-[980px]:gap-14">
        <div className="grid justify-items-start gap-7">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/pricing" className="underline-offset-4 hover:text-ink hover:underline">Pricing</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{plan.name}</li>
            </ol>
          </nav>
          <div className="grid gap-[18px]">
            <h1 id="h-service" className="max-w-[19ch] font-display text-[clamp(36px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.045em]">{page.h1}</h1>
            <p className="max-w-[48ch] text-lg text-ink-2">{page.lede}</p>
          </div>
          <div className="cta-pair">
            <ServiceStartButton id={page.id} location={`service_${page.id}`} label={SERVICE_COPY.start} />
            <OutlineButton href="/pricing" location={`service_${page.id}_pricing`}>{SERVICE_COPY.compare}</OutlineButton>
          </div>
        </div>
        <aside aria-label={SERVICE_COPY.glanceLabel} className={`grid overflow-clip rounded-[28px] bg-surface ${RING}`}>
          <div className="grid grid-cols-[auto_1fr] content-start items-center gap-x-3.5 gap-y-1 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c)_11%,var(--surface)),var(--surface))] px-[26px] pb-[22px] pt-[26px]">
            <span aria-hidden="true" className="grid size-[46px] place-items-center rounded-full bg-[var(--c)] text-action-ink"><PlanIcon weight="fill" className="size-6" /></span>
            <div>
              <p className="font-display text-[21px] font-semibold leading-[1.15] tracking-[-0.03em]">{plan.name}</p>
              {page.id === "website" ? <span className="mt-1 inline-block rounded-full bg-rattan-wash px-2.5 py-[3px] text-xs font-semibold leading-[1.4] text-rattan-ink">{SERVICE_COPY.freeBuild}</span> : null}
            </div>
            <p className="num col-span-full mt-3.5 font-display text-[clamp(40px,4vw,52px)] font-medium leading-none tracking-[-0.045em]">
              {formatMoney(planPrice(page.id, currency), currency)}<small className="ml-1 font-sans text-sm font-medium tracking-normal text-ink-2">{serviceMoneyCopy(currency).perMonth}</small>
            </p>
          </div>
          <ul className="grid gap-2.5 border-t border-line px-[26px] py-5">
            {page.glance.map((fact) => (
              <li key={fact} className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[15px] leading-[1.4]">
                <Check aria-hidden="true" className="mt-px size-[18px] text-sage" />
                {fact}
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-[26px] py-5"><PlanBasketButton id={page.id} /></div>
        </aside>
      </div>
    </section>
  );
}

function Who({ page }: { readonly page: ServicePageContent }): ReactElement {
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

function Group({ group, id }: { readonly group: ServiceGroup; readonly id: PlanId }): ReactElement {
  const GroupIcon = GROUP_ICON[group.icon];
  return (
    <article className={`grid content-start gap-4 rounded-[24px] bg-surface p-6 min-[760px]:[&:last-child:nth-child(odd)]:col-span-2 ${RING}`} style={colourOf(id)}>
      <header className="flex items-center gap-3.5">
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--c)_14%,var(--surface))] text-[var(--c)]"><GroupIcon weight="duotone" className="size-6" /></span>
        <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em]">{group.title}</h3>
      </header>
      <ul className="grid gap-2.5">
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

function Does({ page }: { readonly page: ServicePageContent }): ReactElement {
  return (
    <Section labelledBy="h-does" tight>
      <Reveal><SectionHead id="h-does" title={page.does.heading} lede={page.does.lede} /></Reveal>
      <Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 min-[760px]:grid-cols-2">
          {page.does.groups.map((group) => <Group key={group.title} group={group} id={page.id} />)}
        </div>
      </Reveal>
    </Section>
  );
}

function Spotlight({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  const { spotlight } = page;
  const adMoney = PACKAGES.filter((pkg) => pkg.adCredit[currency] > 0);
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
          {spotlight.kind === "ad-money" ? (
            <ul className="grid gap-2.5">
              {adMoney.map((pkg) => (
                <li key={pkg.id} className="flex items-baseline justify-between gap-4 rounded-2xl bg-surface px-5 py-4">
                  <span className="font-display text-[18px] font-medium tracking-[-0.02em]">{pkg.name}</span>
                  <span className="num font-display text-[22px] font-medium tracking-[-0.03em]">{formatMoney(pkg.adCredit[currency], currency)}<small className="ml-1 font-sans text-[13px] font-medium tracking-normal text-ink-2">a month</small></span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}

function How({ page }: { readonly page: ServicePageContent }): ReactElement {
  return (
    <Section labelledBy="h-how" tight>
      <Reveal><SectionHead id="h-how" title={page.how.heading} /></Reveal>
      <Reveal><StepsList steps={page.how.steps} layout="columns" /></Reveal>
    </Section>
  );
}

function Limits({ page }: { readonly page: ServicePageContent }): ReactElement {
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

function Packages({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  const plan = PLANS[page.id];
  const rows = PACKAGES.filter((pkg) => pkg.pick[page.id]);
  const copy = SERVICE_COPY.packages;
  return (
    <Section labelledBy="h-packages" tight>
      <Reveal><SectionHead id="h-packages" title={copy.heading} lede={serviceMoneyCopy(currency).packagesLede} /></Reveal>
      <Reveal>
        <div role="region" aria-label={copy.heading} tabIndex={0} className="overflow-x-auto rounded-[24px] bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rattan-ink">
          <table className={`w-full min-w-[560px] border-collapse text-left ${RING}`}>
            <caption className="sr-only">{copy.heading}</caption>
            <thead>
              <tr className="text-[13px] font-semibold text-ink-2">
                <th scope="col" className="px-6 py-4">Plans</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4">{copy.saveLabel}</th>
                <th scope="col" className="px-6 py-4">{copy.adMoneyLabel}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="px-6 py-4 font-display text-[18px] font-medium tracking-[-0.02em]">{plan.name}<span className="ml-2 text-sm font-normal text-ink-2">{copy.aloneLabel}</span></th>
                <td className="num px-6 py-4">{formatMoney(planPrice(page.id, currency), currency)}</td>
                <td className="px-6 py-4 text-ink-2">{copy.none}</td>
                <td className="px-6 py-4 text-ink-2">{copy.none}</td>
              </tr>
              {rows.map((pkg) => (
                <tr key={pkg.id} className="border-t border-line">
                  <th scope="row" className="px-6 py-4 font-display text-[18px] font-medium tracking-[-0.02em]">{pkg.name}<span className="ml-2 text-sm font-normal text-ink-2">{pkg.percent}% off</span></th>
                  <td className="num px-6 py-4 font-semibold">{formatMoney(packageTotal(pkg.pick, currency), currency)}</td>
                  <td className="num px-6 py-4">{formatMoney(packageSaving(pkg.pick, currency), currency)}</td>
                  <td className="num px-6 py-4">{pkg.adCredit[currency] > 0 ? formatMoney(pkg.adCredit[currency], currency) : copy.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-2">{copy.adMoneyNote}</p>
      </Reveal>
    </Section>
  );
}

function ServiceFaq({ page }: { readonly page: ServicePageContent }): ReactElement {
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

/**
 * One service page: who it is for, what we do, what sets it apart, how it works, what is left out, the packages it joins
 * and its questions. The closing section comes from the root layout. Prices come from lib/pricing in the page's currency,
 * the lists from the pricing cards, so a page never repeats a number it could drift from.
 */
export function ServicePage({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  return (
    <>
      <Hero page={page} currency={currency} />
      <Who page={page} />
      <Does page={page} />
      <Spotlight page={page} currency={currency} />
      <How page={page} />
      <Limits page={page} />
      <Packages page={page} currency={currency} />
      <ServiceFaq page={page} />
      <JsonLd data={serviceJsonLd(page, currency)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }, { name: PLANS[page.id].name, path: page.path }])} />
    </>
  );
}
