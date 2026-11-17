import type { Icon } from "@phosphor-icons/react";
import { CaretRight, ChartLineUp, ChatCircleText, CheckCircle, Clock, FacebookLogo, InstagramLogo, Tag, Wallet } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FactsStrip } from "@/components/home/FactsStrip";
import { Reveal } from "@/components/motion/Reveal";
import { ComingSoonChip } from "@/components/ui/ComingSoonChip";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ADS_CONTROL, ADS_HERO_SCENE, ADS_HOW, type AdsControlItem, adsFactsFor, adsMoneyFor, adsReportFor } from "@/content/ads-page";
import { SERVICE_COPY, type ServicePageContent } from "@/content/services";
import type { Currency } from "@/lib/currency";
import { isPlanPaused, PLANS } from "@/lib/pricing";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { colourOf, ControlList, ExampleReport, FloatCard, IconTile, PlanHero, SceneFrame, StepsBand } from "./blocks";
import { Limits, ServiceFaq, Who } from "./ServicePage";
import { ServiceStartButton } from "./ServiceStartButton";

const CONTROL_ICON: Readonly<Record<AdsControlItem["icon"], Icon>> = { CheckCircle, Wallet, Tag, ChartLineUp };

/** The hero's picture: a sponsored post for "your business" with the cards around it. Decorative: the words say the same. */
function HeroScene(): ReactElement {
  const { ad, approval, lead, budget, channels } = ADS_HERO_SCENE;
  return (
    <SceneFrame
      id="ads"
      cards={
        <>
          <FloatCard at="left-0 top-[24%] w-[min(58%,250px)] max-[767px]:bottom-0 max-[767px]:top-auto max-[767px]:w-[72%]" tilt="min-[768px]:-rotate-[5deg]" delay={0} period={7} core="grid gap-2.5 px-4 py-3.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rattan-ink"><Clock weight="bold" className="size-3.5" />{approval.state}</span>
            <b className="font-display text-[15px] font-medium leading-[1.25] tracking-[-0.015em]">{approval.title}</b>
            <span className="flex gap-1.5">
              <span className="whitespace-nowrap rounded-full bg-action px-3 py-1.5 text-[12px] font-semibold text-action-ink">{approval.approve}</span>
              <span className="whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink ring-1 ring-ink/15">{approval.back}</span>
            </span>
          </FloatCard>
          <FloatCard at="right-[4%] top-[3%] max-[767px]:hidden" tilt="min-[768px]:rotate-[3deg]" delay={900} period={8} core="flex items-center gap-2.5 py-2 pl-3.5 pr-2">
            <span className="text-[12px] font-semibold text-ink-2">{channels}</span>
            <span className="flex -space-x-1.5">
              {[FacebookLogo, InstagramLogo].map((ChannelIcon, i) => (
                <span key={i} className="grid size-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--c)_12%,var(--surface))] text-[var(--c)] ring-2 ring-surface"><ChannelIcon weight="fill" className="size-4" /></span>
              ))}
            </span>
          </FloatCard>
          <FloatCard at="bottom-[30%] right-0 max-[767px]:hidden" tilt="min-[768px]:-rotate-[3deg]" delay={400} period={8} core="flex items-center gap-3 py-2.5 pl-2.5 pr-4">
            <IconTile icon={ChatCircleText} />
            <span className="grid text-[13px] leading-tight"><b className="font-semibold">{lead.label}</b><span className="text-ink-2">{lead.from}</span></span>
          </FloatCard>
          <FloatCard at="bottom-[6%] left-[3%] max-[767px]:hidden" tilt="min-[768px]:rotate-[2deg]" delay={1600} period={9} core="flex items-center gap-3 px-3.5 py-3">
            <IconTile icon={Wallet} />
            <span className="grid text-[13px] leading-tight"><b className="font-semibold">{budget.label}</b><span className="text-ink-2">{budget.note}</span></span>
          </FloatCard>
        </>
      }
    >
      <div className="flex items-center gap-2 px-3.5 pb-2.5 pt-4">
        <span className="grid size-7 place-items-center rounded-full bg-[var(--c)] text-[11px] font-bold text-action-ink">Y</span>
        <span className="grid leading-tight">
          <span className="text-[12.5px] font-semibold">{ad.handle}</span>
          <span className="text-[10.5px] text-ink-2">{ad.sponsored}</span>
        </span>
      </div>
      <Image src={ad.photo} alt="" width={1024} height={1024} priority sizes="270px" className="aspect-square w-full object-cover" />
      <div className="flex items-center justify-between bg-[color-mix(in_srgb,var(--c)_10%,var(--surface))] px-3.5 py-2.5 text-[12px] font-semibold text-[var(--c)]">
        {ad.cta}
        <CaretRight weight="bold" className="size-3.5" />
      </div>
      <p className="px-3.5 pb-5 pt-2.5 text-[11.5px] leading-[1.45]"><b>{ad.handle}</b> {ad.caption}</p>
    </SceneFrame>
  );
}

/** Our fee and the client's ad budget, side by side and kept apart. */
function WhereMoneyGoes({ currency }: { readonly currency: Currency }): ReactElement {
  const money = adsMoneyFor(currency);
  return (
    <Section labelledBy="h-ads-money">
      <Reveal><SectionHead id="h-ads-money" title={money.heading} lede={money.lede} /></Reveal>
      <Reveal>
        <div className="grid items-stretch gap-4 min-[860px]:grid-cols-[1fr_auto_1fr] min-[860px]:items-center min-[860px]:gap-6" style={colourOf("ads")}>
          {money.parts.map((part, i) => (
            <div key={part.label} className="contents">
              {i === 1 ? <span aria-hidden="true" className="justify-self-center font-display text-[22px] font-light text-ink-2">{money.plus}</span> : null}
              <article className={`grid h-full content-start gap-3 rounded-[26px] p-[clamp(22px,3vw,32px)] ${i === 0 ? "bg-surface shadow-[var(--shadow)] ring-1 ring-ink/[0.06]" : "bg-[color-mix(in_srgb,var(--c)_9%,var(--surface))]"}`}>
                <span className="text-[13px] font-semibold text-[var(--c)]">{part.label}</span>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <b className="num font-display text-[clamp(30px,3.4vw,42px)] font-medium leading-none tracking-[-0.04em]">{part.amount}</b>
                  <small className="text-[14px] font-medium text-ink-2">{part.unit}</small>
                </p>
                <p className="max-w-[40ch] text-[16px] text-ink-2">{part.body}</p>
              </article>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/**
 * /services/paid-ads-management: the hero, how we run ads, where the money goes, what the owner controls and an example
 * report, before the limits and questions. While the plan is paused (PAUSED_PLAN_IDS) the hero offers WhatsApp instead of
 * "Start my plan" and its price carries "Coming soon". Copy in content/services.ts and content/ads-page.ts.
 */
export function AdsPage({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  const paused = isPlanPaused(page.id);
  const report = adsReportFor(currency);
  const { whatsapp } = ADS_HERO_SCENE;
  return (
    <>
      <PlanHero
        page={page}
        currency={currency}
        scene={<HeroScene />}
        chip={paused ? <ComingSoonChip /> : null}
        actions={
          <>
            {paused ? (
              <WhatsAppButton location={`service_${page.id}`} label={whatsapp.label} short={whatsapp.short} message={whatsapp.message} />
            ) : (
              <ServiceStartButton id={page.id} location={`service_${page.id}`} label={SERVICE_COPY.start} />
            )}
            <OutlineButton href="/pricing" location={`service_${page.id}_pricing`}>{SERVICE_COPY.compare}</OutlineButton>
          </>
        }
      />
      <FactsStrip facts={adsFactsFor(currency)} />
      <Who page={page} />
      <StepsBand id="h-ads-how" small={ADS_HOW.small} large={ADS_HOW.large} body={ADS_HOW.body} steps={ADS_HOW.steps} />
      <WhereMoneyGoes currency={currency} />
      <ControlList planId="ads" id="h-ads-control" heading={ADS_CONTROL.heading} lede={ADS_CONTROL.lede} items={ADS_CONTROL.items.map((item) => ({ ...item, icon: CONTROL_ICON[item.icon] }))} />
      <ExampleReport planId="ads" id="h-ads-report" content={report}>
        <table className="w-full text-left text-[13px]">
          <caption className="sr-only">{report.campaignsLabel}</caption>
          <thead className="text-xs text-ink-2">
            <tr>
              <th scope="col" className="pb-2 font-medium">{report.campaignsLabel}</th>
              <th scope="col" className="pb-2 text-right font-medium">{report.leadsLabel}</th>
              <th scope="col" className="pb-2 text-right font-medium">{report.perLeadLabel}</th>
            </tr>
          </thead>
          <tbody>
            {report.campaigns.map((row) => (
              <tr key={row.name} className="border-t border-line">
                <th scope="row" className="py-2.5 pr-3 font-normal">
                  <b className="block font-display text-[14.5px] font-medium tracking-[-0.01em]">{row.name}</b>
                  <span className="text-ink-2">{row.where}</span>
                </th>
                <td className="num py-2.5 text-right font-display text-[15px]">{row.leads}</td>
                <td className="num py-2.5 text-right font-display text-[15px]">{row.perLead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ExampleReport>
      <Limits page={page} />
      <ServiceFaq page={page} />
      <JsonLd data={serviceJsonLd(page, currency)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }, { name: PLANS[page.id].name, path: page.path }])} />
    </>
  );
}
