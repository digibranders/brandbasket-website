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
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FactsStrip } from "@/components/home/FactsStrip";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/ui/Band";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHead } from "@/components/ui/SectionHead";
import { SERVICE_COPY, type ServicePageContent } from "@/content/services";
import { type ControlItem, SOCIAL_CONTROL, SOCIAL_FACTS, SOCIAL_HERO_SCENE, SOCIAL_HOW, SOCIAL_REPORT, SOCIAL_WEEK, type WeekPost, type WeekPostState } from "@/content/social-page";
import type { Currency } from "@/lib/currency";
import { PLANS } from "@/lib/pricing";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { colourOf, ControlList, ExampleReport, FloatCard, IconTile, PlanHero, SceneFrame, StepsBand } from "./blocks";
import { Limits, ServiceFaq, Spotlight, Who } from "./ServicePage";
import { ServiceStartButton } from "./ServiceStartButton";

const CONTROL_ICON: Readonly<Record<ControlItem["icon"], Icon>> = { Trash, PencilSimple, CalendarDots, Lightbulb, ArrowCounterClockwise, Lightning };

const KIND_ICON: Readonly<Record<WeekPost["kind"], Icon>> = { post: ImageIcon, carousel: Images, reel: FilmStrip };
const STATE_ICON: Readonly<Record<WeekPostState, Icon>> = { posted: CheckCircle, approved: Check, waiting: Clock };
const STATE_CLASS: Readonly<Record<WeekPostState, string>> = {
  posted: "text-sage",
  approved: "text-sage",
  waiting: "text-rattan-ink",
};

/** The hero's picture: a post for "your business" with the week's work around it. Decorative: the words say the same. */
function HeroScene(): ReactElement {
  const { post, approval, learned, scheduled, channels } = SOCIAL_HERO_SCENE;
  return (
    <SceneFrame
      id="social"
      cards={
        <>
          <FloatCard at="left-0 top-[24%] w-[min(58%,250px)] max-[767px]:bottom-0 max-[767px]:top-auto max-[767px]:w-[68%]" tilt="min-[768px]:-rotate-[5deg]" delay={0} period={7} core="grid gap-2.5 px-4 py-3.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rattan-ink"><Clock weight="bold" className="size-3.5" />{approval.state}</span>
            <b className="font-display text-[15px] font-medium leading-[1.25] tracking-[-0.015em]">{approval.title}</b>
            <span className="flex gap-1.5">
              <span className="whitespace-nowrap rounded-full bg-action px-3 py-1.5 text-[12px] font-semibold text-action-ink">{approval.approve}</span>
              <span className="whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink ring-1 ring-ink/15">{approval.back}</span>
            </span>
          </FloatCard>
          <FloatCard at="right-0 top-[3%] max-[767px]:hidden" tilt="min-[768px]:rotate-[3deg]" delay={900} period={8} core="flex items-center gap-2.5 py-2 pl-3.5 pr-2">
            <span className="text-[12px] font-semibold text-ink-2">{channels}</span>
            <span className="flex -space-x-1.5">
              {[InstagramLogo, FacebookLogo, LinkedinLogo, GoogleLogo].map((ChannelIcon, i) => (
                <span key={i} className="grid size-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--c)_12%,var(--surface))] text-[var(--c)] ring-2 ring-surface"><ChannelIcon weight="fill" className="size-4" /></span>
              ))}
            </span>
          </FloatCard>
          <FloatCard at="bottom-[6%] left-[3%] max-[767px]:hidden" tilt="min-[768px]:rotate-[2deg]" delay={1600} period={9} core="flex items-center gap-3 px-3.5 py-3">
            <IconTile icon={Globe} />
            <span className="grid text-[13px] leading-tight"><b className="font-semibold">{learned.label}</b><span className="font-mono text-[12px] text-ink-2">{learned.site}</span></span>
          </FloatCard>
          <FloatCard at="bottom-[30%] right-0 max-[767px]:hidden" tilt="min-[768px]:-rotate-[3deg]" delay={400} period={8} core="flex items-center gap-3 py-2.5 pl-2.5 pr-4">
            <IconTile icon={CalendarCheck} />
            <span className="grid text-[13px] leading-tight"><b className="font-semibold">{scheduled.label}</b><span className="text-ink-2">{scheduled.when}</span></span>
          </FloatCard>
        </>
      }
    >
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
    </SceneFrame>
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

/** An example week: seven days, five posts. A phone shows only the days that post. */
function YourWeek(): ReactElement {
  return (
    <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
      <section aria-labelledby="h-social-week" className="in-wrap" style={colourOf("social")}>
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

/**
 * /services/social-media-management: the hero, how the AI runs a week, the week itself, what the owner controls, the
 * facts-only promise and an example report, before the limits and questions. Copy in content/services.ts and
 * content/social-page.ts; the shared parts are in ./blocks.
 */
export function SocialPage({ page, currency }: { readonly page: ServicePageContent; readonly currency: Currency }): ReactElement {
  return (
    <>
      <PlanHero
        page={page}
        currency={currency}
        scene={<HeroScene />}
        actions={
          <>
            <ServiceStartButton id={page.id} location={`service_${page.id}`} label={SERVICE_COPY.start} />
            <OutlineButton href="/pricing" location={`service_${page.id}_pricing`}>{SERVICE_COPY.compare}</OutlineButton>
          </>
        }
      />
      <FactsStrip facts={SOCIAL_FACTS} />
      <Who page={page} />
      <StepsBand id="h-social-how" small={SOCIAL_HOW.small} large={SOCIAL_HOW.large} body={SOCIAL_HOW.body} steps={SOCIAL_HOW.steps} />
      <YourWeek />
      <ControlList planId="social" id="h-social-control" heading={SOCIAL_CONTROL.heading} lede={SOCIAL_CONTROL.lede} items={SOCIAL_CONTROL.items.map((item) => ({ ...item, icon: CONTROL_ICON[item.icon] }))} />
      <Spotlight page={page} currency={currency} />
      <ExampleReport planId="social" id="h-social-report" content={SOCIAL_REPORT}>
        <div className="flex items-center gap-3.5 rounded-2xl bg-[color-mix(in_srgb,var(--c)_9%,var(--surface))] p-3.5">
          <span aria-hidden="true" className="grid size-10 flex-none place-items-center rounded-xl bg-surface text-[var(--c)]"><ChatCircleDots weight="duotone" className="size-5" /></span>
          <p className="grid text-[13px] leading-snug">
            <span className="text-ink-2">{SOCIAL_REPORT.best.label}</span>
            <b className="font-display text-[16px] font-medium tracking-[-0.015em]">{SOCIAL_REPORT.best.value}</b>
            <span className="text-ink-2">{SOCIAL_REPORT.best.note}</span>
          </p>
        </div>
      </ExampleReport>
      <Limits page={page} />
      <ServiceFaq page={page} />
      <JsonLd data={serviceJsonLd(page, currency)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }, { name: PLANS[page.id].name, path: page.path }])} />
    </>
  );
}
