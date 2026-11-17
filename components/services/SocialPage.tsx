import type { Icon } from "@phosphor-icons/react";
import {
  ArrowCounterClockwise,
  BookmarkSimple,
  CalendarCheck,
  CalendarDots,
  ChatCircle,
  ChatCircleDots,
  Check,
  CheckCircle,
  Clock,
  FacebookLogo,
  FilmStrip,
  Globe,
  GoogleLogo,
  Heart,
  Image as ImageIcon,
  Images,
  InstagramLogo,
  Lightbulb,
  Lightning,
  LinkedinLogo,
  PaperPlaneTilt,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FactsStrip } from "@/components/home/FactsStrip";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/ui/Band";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { BASKET_COPY } from "@/content/basket";
import { SERVICE_COPY, type ServicePageContent, serviceMoneyCopy } from "@/content/services";
import { type ControlItem, SOCIAL_CONTROL, SOCIAL_FACTS, SOCIAL_HERO_SCENE, SOCIAL_HOW, SOCIAL_REPORT, SOCIAL_WEEK, type WeekPost, type WeekPostState } from "@/content/social-page";
import { type Currency, formatMoney } from "@/lib/currency";
import { PLANS, planPrice, planUsualPrice } from "@/lib/pricing";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { Limits, ServiceFaq, Spotlight, Who } from "./ServicePage";
import { ServiceStartButton } from "./ServiceStartButton";
import "./social-hero.css";

/** The social plan's colour, as on the pricing cards and the basket. */
const SOCIAL_INK = { "--c": "var(--c-growth)" } as CSSProperties;

const CONTROL_ICON: Readonly<Record<ControlItem["icon"], Icon>> = { Trash, PencilSimple, CalendarDots, Lightbulb, ArrowCounterClockwise, Lightning };

const KIND_ICON: Readonly<Record<WeekPost["kind"], Icon>> = { post: ImageIcon, carousel: Images, reel: FilmStrip };
const STATE_ICON: Readonly<Record<WeekPostState, Icon>> = { posted: CheckCircle, approved: Check, waiting: Clock };
const STATE_CLASS: Readonly<Record<WeekPostState, string>> = {
  posted: "text-sage",
  approved: "text-sage",
  waiting: "text-rattan-ink",
};

/** A floating card in the hero scene: a hairline tray around a white core, so it reads as an object, not a box. */
const TRAY = "rounded-[22px] bg-surface/55 p-1.5 shadow-[var(--shadow-float)] ring-1 ring-ink/[0.06]";
const CORE = "rounded-[16px] bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]";

/** Delay and period of one scene card's slow drift. */
function motion(delay: number, period: number): CSSProperties {
  return { "--d": `${delay}ms`, "--t": `${period}s` } as CSSProperties;
}

/** The hero's picture. Decorative: the headline, lede and facts strip say the same in words. */
function HeroScene(): ReactElement {
  const { post, approval, learned, scheduled, channels } = SOCIAL_HERO_SCENE;
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1/1.04] w-full max-w-[560px] max-[767px]:aspect-[1/1.18] max-[767px]:max-w-[400px]" style={SOCIAL_INK}>
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--c)_16%,transparent),transparent_68%)] blur-2xl" />
      <div className="absolute inset-0 grid place-items-center max-[767px]:items-start">
        <div className="w-[min(50%,270px)] max-[767px]:w-[62%] rounded-[38px] bg-ink p-[7px] shadow-[0_50px_80px_-40px_rgba(20,20,24,0.65)] min-[768px]:-rotate-2">
          <div className="overflow-hidden rounded-[31px] bg-surface">
            <div className="flex items-center gap-2 px-3.5 pb-2.5 pt-4">
              <span className="grid size-7 place-items-center rounded-full bg-[var(--c)] text-[11px] font-bold text-action-ink">Y</span>
              <span className="text-[12.5px] font-semibold">{post.handle}</span>
            </div>
            <Image src={post.photo} alt="" width={1024} height={1024} priority sizes="270px" className="aspect-square w-full object-cover" />
            <div className="flex items-center gap-3 px-3.5 pt-2.5 text-ink">
              <Heart weight="fill" className="size-[18px] text-error" /><ChatCircle className="size-[18px]" /><PaperPlaneTilt className="size-[18px]" />
              <BookmarkSimple className="ml-auto size-[18px]" />
            </div>
            <p className="px-3.5 pb-5 pt-1.5 text-[11.5px] leading-[1.45]"><b>{post.handle}</b> {post.caption}</p>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-[24%] w-[min(58%,250px)] max-[767px]:bottom-0 max-[767px]:top-auto max-[767px]:w-[68%]">
        <div className={`sh-float ${TRAY} min-[768px]:-rotate-[5deg]`} style={motion(0, 7)}>
          <div className={`${CORE} grid gap-2.5 px-4 py-3.5`}>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rattan-ink"><Clock weight="bold" className="size-3.5" />{approval.state}</span>
            <b className="font-display text-[15px] font-medium leading-[1.25] tracking-[-0.015em]">{approval.title}</b>
            <span className="flex gap-1.5">
              <span className="whitespace-nowrap rounded-full bg-action px-3 py-1.5 text-[12px] font-semibold text-action-ink">{approval.approve}</span>
              <span className="whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink ring-1 ring-ink/15">{approval.back}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-[3%] max-[767px]:hidden">
        <div className={`sh-float ${TRAY} min-[768px]:rotate-[3deg]`} style={motion(900, 8)}>
          <div className={`${CORE} flex items-center gap-2.5 py-2 pl-3.5 pr-2`}>
            <span className="text-[12px] font-semibold text-ink-2">{channels}</span>
            <span className="flex -space-x-1.5">
              {[InstagramLogo, FacebookLogo, LinkedinLogo, GoogleLogo].map((ChannelIcon, i) => (
                <span key={i} className="grid size-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--c)_12%,var(--surface))] text-[var(--c)] ring-2 ring-surface"><ChannelIcon weight="fill" className="size-4" /></span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[6%] left-[3%] max-[767px]:hidden">
        <div className={`sh-float ${TRAY} min-[768px]:rotate-[2deg]`} style={motion(1600, 9)}>
          <div className={`${CORE} flex items-center gap-3 px-3.5 py-3`}>
            <span className="grid size-9 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--c)_12%,var(--surface))] text-[var(--c)]"><Globe weight="duotone" className="size-5" /></span>
            <span className="grid text-[13px] leading-tight"><b className="font-semibold">{learned.label}</b><span className="font-mono text-[12px] text-ink-2">{learned.site}</span></span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[30%] right-0 max-[767px]:hidden">
        <div className={`sh-float ${TRAY} min-[768px]:-rotate-[3deg]`} style={motion(400, 8)}>
          <div className={`${CORE} flex items-center gap-3 py-2.5 pl-2.5 pr-4`}>
            <span className="grid size-9 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--c)_12%,var(--surface))] text-[var(--c)]"><CalendarCheck weight="duotone" className="size-5" /></span>
            <span className="grid text-[13px] leading-tight"><b className="font-semibold">{scheduled.label}</b><span className="text-ink-2">{scheduled.when}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The page's hero: the headline with its last clause in the brand accent, the price on one line, the two buttons, and the
 * scene. No Reveal: the hero paints at once. The plan card of the other service pages is left out; its facts are the strip below.
 */
function SocialHero({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
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
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-full bg-surface/70 px-5 py-2.5 ring-1 ring-ink/[0.06]">
            <s className="num font-display text-lg leading-none text-ink-2 decoration-rattan-text decoration-1"><span className="sr-only">{BASKET_COPY.was} </span>{formatMoney(planUsualPrice(page.id, currency), currency)}</s>
            <b className="num font-display text-[28px] font-medium leading-none tracking-[-0.035em]">{formatMoney(planPrice(page.id, currency), currency)}</b>
            <small className="text-[13.5px] font-medium text-ink-2">{serviceMoneyCopy(currency).perMonth}</small>
          </p>
          <div className="cta-pair">
            <ServiceStartButton id={page.id} location={`service_${page.id}`} label={SERVICE_COPY.start} />
            <OutlineButton href="/pricing" location={`service_${page.id}_pricing`}>{SERVICE_COPY.compare}</OutlineButton>
          </div>
        </div>
        <HeroScene />
      </div>
    </section>
  );
}

/** The page's one dark band: the six things the AI does each week. */
function HowAiWorks(): ReactElement {
  return (
    <Band tone="ink">
      <section aria-labelledby="h-social-how" className="in-wrap py-[clamp(56px,8vw,112px)]">
        <div className="grid gap-[clamp(28px,3.5vw,44px)]">
          <Reveal>
            <TwoTierHead id="h-social-how" small={SOCIAL_HOW.small} large={SOCIAL_HOW.large} tier="step" onDark />
            <p className="mt-5 max-w-[50ch] text-pretty text-[17px] leading-[1.65] text-action-ink/74">{SOCIAL_HOW.body}</p>
          </Reveal>
          <Reveal>
            <ol className="grid gap-x-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
              {SOCIAL_HOW.steps.map((step) => (
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

function PostCard({ post }: { readonly post: WeekPost }): ReactElement {
  const KindIcon = KIND_ICON[post.kind];
  const StateIcon = STATE_ICON[post.state];
  return (
    <article className="grid content-start gap-3 rounded-[18px] bg-surface p-3.5 shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_18px_36px_-28px_rgba(40,28,14,0.45)]">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--c)]">
        <KindIcon aria-hidden="true" weight="duotone" className="size-4" />
        {SOCIAL_WEEK.kind[post.kind]}
      </span>
      <p className="font-display text-[15.5px] font-medium leading-[1.3] tracking-[-0.015em]">{post.title}</p>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span className={`flex items-center gap-1 text-xs font-semibold ${STATE_CLASS[post.state]}`}>
          <StateIcon aria-hidden="true" weight="bold" className="size-3.5" />
          {SOCIAL_WEEK.state[post.state]}
        </span>
        {post.own ? <span className="rounded-full bg-rattan-wash px-2 py-0.5 text-[11.5px] font-semibold text-rattan-ink">{SOCIAL_WEEK.own}</span> : null}
      </div>
    </article>
  );
}

/** An example week: seven days, four posts. A phone shows only the days that post. */
function YourWeek(): ReactElement {
  return (
    <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
      <section aria-labelledby="h-social-week" className="in-wrap" style={SOCIAL_INK}>
        <Reveal><SectionHead id="h-social-week" title={SOCIAL_WEEK.heading} lede={SOCIAL_WEEK.lede} /></Reveal>
        <Reveal>
          <div role="group" aria-label={SOCIAL_WEEK.ariaLabel} className="grid gap-4">
            <span className="justify-self-start whitespace-nowrap rounded-full bg-rattan-wash px-2.5 py-1 font-mono text-[11.5px] text-rattan-ink">{SOCIAL_WEEK.chip}</span>
            <ol className="grid gap-3 min-[900px]:grid-cols-7">
              {SOCIAL_WEEK.days.map((day) => {
                const post = SOCIAL_WEEK.posts.find((candidate) => candidate.day === day);
                return (
                  <li key={day} className={`grid content-start gap-2.5 max-[899px]:grid-cols-[48px_1fr] max-[899px]:items-start ${post ? "" : "max-[899px]:hidden"}`}>
                    <span className="pt-0.5 font-mono text-[13px] text-ink-2 min-[900px]:pl-1">{day}</span>
                    {post ? <PostCard post={post} /> : <span aria-hidden="true" className="min-h-[132px] rounded-[18px] border-[1.5px] border-dashed border-line" />}
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </section>
    </Band>
  );
}

function Control(): ReactElement {
  return (
    <Section labelledBy="h-social-control">
      <Reveal><SectionHead id="h-social-control" title={SOCIAL_CONTROL.heading} lede={SOCIAL_CONTROL.lede} /></Reveal>
      <Reveal>
        <ul className="grid gap-x-12 min-[760px]:grid-cols-2" style={SOCIAL_INK}>
          {SOCIAL_CONTROL.items.map((item) => {
            const ItemIcon = CONTROL_ICON[item.icon];
            return (
              <li key={item.title} className="grid grid-cols-[44px_1fr] items-start gap-4 border-t border-line py-6">
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--c)_14%,var(--surface))] text-[var(--c)]"><ItemIcon weight="duotone" className="size-6" /></span>
                <div className="grid gap-1">
                  <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em]">{item.title}</h3>
                  <p className="max-w-[46ch] text-[16px] text-ink-2">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}

/** The example monthly report, beside what it covers. Sample numbers, marked as such. */
function Report(): ReactElement {
  return (
    <Section labelledBy="h-social-report" tight>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-9 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:items-center min-[980px]:gap-16">
        <Reveal><SectionHead id="h-social-report" className="mb-0" step title={SOCIAL_REPORT.heading} lede={SOCIAL_REPORT.lede} /></Reveal>
        <Reveal className="min-w-0">
          <div role="group" aria-label={SOCIAL_REPORT.ariaLabel} className="grid gap-[18px] rounded-[26px] border border-line bg-surface p-6 shadow-[var(--shadow)]" style={SOCIAL_INK}>
            <div className="flex flex-wrap items-start justify-between gap-3.5">
              <div>
                <b className="block font-display text-xl font-medium tracking-[-0.02em]">{SOCIAL_REPORT.title}</b>
                <span className="text-[13px] text-ink-2">{SOCIAL_REPORT.subtitle}</span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-rattan-wash px-2.5 py-1 font-mono text-[11.5px] text-rattan-ink">{SOCIAL_REPORT.chip}</span>
            </div>
            <dl className="grid grid-cols-2 gap-2.5 min-[640px]:grid-cols-4">
              {SOCIAL_REPORT.kpis.map((kpi) => (
                <div key={kpi.label} className="grid min-w-0 gap-1 rounded-2xl bg-bg p-3.5">
                  <dt className="text-xs text-ink-2">{kpi.label}</dt>
                  <dd className="num font-display text-[26px] font-medium tracking-[-0.03em]">{kpi.value}</dd>
                  <dd className="text-xs font-semibold text-sage">{kpi.delta}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-3.5 rounded-2xl bg-[color-mix(in_srgb,var(--c)_9%,var(--surface))] p-3.5">
              <span aria-hidden="true" className="grid size-10 flex-none place-items-center rounded-xl bg-surface text-[var(--c)]"><ChatCircleDots weight="duotone" className="size-5" /></span>
              <p className="grid text-[13px] leading-snug">
                <span className="text-ink-2">{SOCIAL_REPORT.best.label}</span>
                <b className="font-display text-[16px] font-medium tracking-[-0.015em]">{SOCIAL_REPORT.best.value}</b>
                <span className="text-ink-2">{SOCIAL_REPORT.best.note}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * /services/social-media-management: the shared service hero, then how the AI runs a week, the week itself, what the owner
 * controls, the facts-only promise and an example report, before the limits and questions. Copy in content/services.ts and
 * content/social-page.ts.
 */
export function SocialPage({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  return (
    <>
      <SocialHero page={page} currency={currency} />
      <FactsStrip facts={SOCIAL_FACTS} />
      <Who page={page} />
      <HowAiWorks />
      <YourWeek />
      <Control />
      <Spotlight page={page} currency={currency} />
      <Report />
      <Limits page={page} />
      <ServiceFaq page={page} />
      <JsonLd data={serviceJsonLd(page, currency)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }, { name: PLANS[page.id].name, path: page.path }])} />
    </>
  );
}
