import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/ui/Band";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { BASKET_COPY } from "@/content/basket";
import { type ServicePageContent, serviceMoneyCopy } from "@/content/services";
import type { ExampleReportContent } from "@/content/types";
import { type Currency, formatMoney } from "@/lib/currency";
import { type PlanId, PLANS, planPrice, planUsualPrice } from "@/lib/pricing";
import "./service-hero.css";

// The parts the Social Media and Paid Ads pages share: the hero with its floating scene, the dark steps band, the controls
// list and the example report. Each takes its words as props and paints in its plan's colour (--c).

/** The plan colours already used by the pricing cards and the basket. */
const PLAN_COLOUR: Readonly<Record<PlanId, string>> = { website: "var(--c-site)", social: "var(--c-growth)", ads: "var(--c-search)" };

/** Sets --c to the plan's colour for everything inside. */
export function colourOf(id: PlanId): CSSProperties {
  return { "--c": PLAN_COLOUR[id] } as CSSProperties;
}

/** A floating card in a hero scene: a hairline tray around a white core, so it reads as an object, not a box. */
const TRAY = "rounded-[22px] bg-surface/55 p-1.5 shadow-[var(--shadow-float)] ring-1 ring-ink/[0.06]";
const CORE = "rounded-[16px] bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]";

interface FloatCardProps {
  /** Where the card sits in the scene (absolute offsets, widths, phone overrides). */
  readonly at: string;
  /** Its tilt from 768px up, e.g. "min-[768px]:-rotate-[5deg]". Phones show it straight. */
  readonly tilt: string;
  /** Delay (ms) and period (s) of its slow drift, so no two cards move together. */
  readonly delay: number;
  readonly period: number;
  /** Layout of the white core. */
  readonly core: string;
  readonly children: ReactNode;
}

export function FloatCard({ at, tilt, delay, period, core, children }: FloatCardProps): ReactElement {
  return (
    <div className={`absolute ${at}`}>
      <div className={`sh-float ${TRAY} ${tilt}`} style={{ "--d": `${delay}ms`, "--t": `${period}s` } as CSSProperties}>
        <div className={`${CORE} ${core}`}>{children}</div>
      </div>
    </div>
  );
}

/** A small square icon in the plan's colour, for scene cards and report rows. */
export function IconTile({ icon: TileIcon, className = "size-9 rounded-xl" }: { readonly icon: Icon; readonly className?: string }): ReactElement {
  return (
    <span aria-hidden="true" className={`grid flex-none place-items-center bg-[color-mix(in_srgb,var(--c)_12%,var(--surface))] text-[var(--c)] ${className}`}>
      <TileIcon weight="duotone" className="size-5" />
    </span>
  );
}

/** The phone a hero scene is built around, with the plan's glow behind it. Its content is the post or ad. */
export function SceneFrame({ id, children, cards }: { readonly id: PlanId; readonly children: ReactNode; readonly cards: ReactNode }): ReactElement {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1/1.04] w-full max-w-[560px] max-[767px]:aspect-[1/1.18] max-[767px]:max-w-[400px]" style={colourOf(id)}>
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--c)_16%,transparent),transparent_68%)] blur-2xl" />
      <div className="absolute inset-0 grid place-items-center max-[767px]:items-start">
        <div className="w-[min(50%,270px)] rounded-[38px] bg-ink p-[7px] shadow-[0_50px_80px_-40px_rgba(20,20,24,0.65)] max-[767px]:w-[62%] min-[768px]:-rotate-2">
          <div className="overflow-hidden rounded-[31px] bg-surface">{children}</div>
        </div>
      </div>
      {cards}
    </div>
  );
}

interface PlanHeroProps {
  readonly page: ServicePageContent;
  readonly currency: Currency;
  /** The buttons under the price. */
  readonly actions: ReactNode;
  /** The picture beside the words. */
  readonly scene: ReactNode;
  /** A chip after the price, e.g. "Coming soon". */
  readonly chip?: ReactNode;
}

/**
 * A plan's hero: breadcrumb, the headline with its last clause in the brand accent, the lede, the price on one line, the
 * buttons and the scene. No Reveal: the hero paints at once.
 */
export function PlanHero({ page, currency, actions, scene, chip }: PlanHeroProps): ReactElement {
  const cut = page.h1.lastIndexOf(", ");
  const [lead, accent] = cut === -1 ? [page.h1, ""] : [page.h1.slice(0, cut + 1), page.h1.slice(cut + 2)];
  return (
    <section aria-labelledby="h-service" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]" />
      <div className="in-wrap relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-12 pt-[104px] min-[1000px]:min-h-[720px] min-[1000px]:grid-cols-[1fr_1fr] min-[1000px]:gap-8 min-[1000px]:pt-28">
        <div className="grid min-w-0 justify-items-start gap-7">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/pricing" className="underline-offset-4 hover:text-ink hover:underline">Pricing</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{PLANS[page.id].name}</li>
            </ol>
          </nav>
          <div className="grid gap-5">
            <h1 id="h-service" className="max-w-[13ch] text-balance font-display text-[clamp(42px,5.4vw,78px)] font-medium leading-[0.98] tracking-[-0.052em]">
              {lead} {accent ? <em className="font-light not-italic text-rattan-text">{accent}</em> : null}
            </h1>
            <p className="max-w-[44ch] text-pretty text-[clamp(17px,1.35vw,19px)] leading-[1.55] text-ink-2">{page.lede}</p>
          </div>
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full bg-surface/70 px-5 py-2.5 ring-1 ring-ink/[0.06]">
            <s className="num font-display text-lg leading-none text-ink-2 decoration-rattan-text decoration-1"><span className="sr-only">{BASKET_COPY.was} </span>{formatMoney(planUsualPrice(page.id, currency), currency)}</s>
            <b className="num font-display text-[28px] font-medium leading-none tracking-[-0.035em]">{formatMoney(planPrice(page.id, currency), currency)}</b>
            <small className="text-[13.5px] font-medium text-ink-2">{serviceMoneyCopy(currency).perMonth}</small>
            {chip}
          </p>
          <div className="cta-pair">{actions}</div>
        </div>
        {scene}
      </div>
    </section>
  );
}

export interface BandStep {
  readonly title: string;
  readonly body: string;
}

interface StepsBandProps {
  readonly id: string;
  readonly small: string;
  readonly large: string;
  readonly body: string;
  readonly steps: readonly BandStep[];
}

/** The page's one dark band: how the plan's work runs, step by step. */
export function StepsBand({ id, small, large, body, steps }: StepsBandProps): ReactElement {
  return (
    <Band tone="ink">
      <section aria-labelledby={id} className="in-wrap py-[clamp(56px,8vw,112px)]">
        <div className="grid gap-[clamp(28px,3.5vw,44px)]">
          <Reveal>
            <TwoTierHead id={id} small={small} large={large} tier="step" onDark />
            <p className="mt-5 max-w-[50ch] text-pretty text-[17px] leading-[1.65] text-action-ink/74">{body}</p>
          </Reveal>
          <Reveal>
            <ol className="grid gap-x-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
              {steps.map((step) => (
                <li key={step.title} className="grid content-start gap-1.5 border-t border-action-ink/15 py-5">
                  <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em] text-action-ink">{step.title}</h3>
                  <p className="max-w-[40ch] text-[15.5px] leading-[1.55] text-action-ink/70">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </Band>
  );
}

export interface ControlEntry {
  readonly icon: Icon;
  readonly title: string;
  readonly body: string;
}

interface ControlListProps {
  readonly planId: PlanId;
  readonly id: string;
  readonly heading: string;
  readonly lede: string;
  readonly items: readonly ControlEntry[];
}

/** What the owner decides, two across from 760px. */
export function ControlList({ planId, id, heading, lede, items }: ControlListProps): ReactElement {
  return (
    <Section labelledBy={id}>
      <Reveal><SectionHead id={id} title={heading} lede={lede} /></Reveal>
      <Reveal>
        <ul className="grid gap-x-12 min-[760px]:grid-cols-2" style={colourOf(planId)}>
          {items.map((item) => (
            <li key={item.title} className="grid grid-cols-[44px_1fr] items-start gap-4 border-t border-line py-6">
              <IconTile icon={item.icon} className="size-11 rounded-full" />
              <div className="grid gap-1">
                <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em]">{item.title}</h3>
                <p className="max-w-[46ch] text-[16px] text-ink-2">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** An example monthly report beside what it covers. `children` is the plan's own last row. */
export function ExampleReport({ planId, id, content, children }: { readonly planId: PlanId; readonly id: string; readonly content: ExampleReportContent; readonly children: ReactNode }): ReactElement {
  return (
    <Section labelledBy={id} tight>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-9 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:items-center min-[980px]:gap-16">
        <Reveal><SectionHead id={id} className="mb-0" step title={content.heading} lede={content.lede} /></Reveal>
        <Reveal className="min-w-0">
          <div role="group" aria-label={content.ariaLabel} className="grid gap-[18px] rounded-[26px] border border-line bg-surface p-6 shadow-[var(--shadow)]" style={colourOf(planId)}>
            <div className="flex flex-wrap items-start justify-between gap-3.5">
              <div>
                <b className="block font-display text-xl font-medium tracking-[-0.02em]">{content.title}</b>
                <span className="text-[13px] text-ink-2">{content.subtitle}</span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-rattan-wash px-2.5 py-1 font-mono text-[11.5px] text-rattan-ink">{content.chip}</span>
            </div>
            <dl className="grid grid-cols-2 gap-2.5 min-[640px]:grid-cols-4">
              {content.kpis.map((kpi) => (
                <div key={kpi.label} className="grid min-w-0 gap-1 rounded-2xl bg-bg p-3.5">
                  <dt className="text-xs text-ink-2">{kpi.label}</dt>
                  <dd className="num font-display text-[26px] font-medium tracking-[-0.03em]">{kpi.value}</dd>
                  <dd className="text-xs font-semibold text-sage">{kpi.delta}</dd>
                </div>
              ))}
            </dl>
            {children}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
