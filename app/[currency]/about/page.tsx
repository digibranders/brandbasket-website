import type { Icon } from "@phosphor-icons/react";
import { Buildings, Eye, Globe, ListChecks, MapPin, Megaphone, Package, Rocket, ShareNetwork, Stack, Storefront, Target, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import "@/components/about/about.css";
import { HeroPicture } from "@/components/about/HeroPicture";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { ABOUT, type AboutIconKey, type AboutItem, type AboutTone } from "@/content/about";
import { aboutPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.about);

const ICON: Readonly<Record<AboutIconKey, Icon>> = { Globe, Wrench, ShareNetwork, Megaphone, MapPin, Storefront, Buildings, Rocket, Package, Stack, ListChecks };
/** The plan colours the pricing cards and the basket already use. */
const TONE: Readonly<Record<AboutTone, string>> = { site: "var(--c-site)", growth: "var(--c-growth)", search: "var(--c-search)" };
const RING = "shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)]";
const PANEL = "rounded-[32px] px-[clamp(22px,4vw,48px)] py-[clamp(28px,4vw,48px)]";

function IconDisc({ name, className = "" }: { readonly name: AboutIconKey; readonly className?: string }): ReactElement {
  const ItemIcon = ICON[name];
  return (
    <span aria-hidden="true" className={`grid size-11 shrink-0 place-items-center rounded-full bg-rattan-wash text-rattan-ink ${className}`}>
      <ItemIcon weight="duotone" className="size-6" />
    </span>
  );
}

/** Headline and lede on the left, the picture of the five services around the mark on the right. Stacks on phones with the picture under the text. */
function Hero(): ReactElement {
  return (
    <section aria-labelledby="h-about" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
      <div className="in-wrap relative grid items-center gap-10 pb-16 pt-32 min-[980px]:grid-cols-[1.05fr_0.95fr] min-[980px]:gap-14">
        <div className="grid gap-[18px]">
          <h1 id="h-about" className="max-w-[16ch] font-display text-[clamp(38px,5vw,68px)] font-normal leading-[1.02] tracking-[-0.05em]">{ABOUT.h1}</h1>
          <p className="max-w-[46ch] text-lg text-ink-2">{ABOUT.lede}</p>
        </div>
        <HeroPicture />
      </div>
    </section>
  );
}

/** One large statement, then the rest of the story. */
function Who(): ReactElement {
  const { who } = ABOUT;
  return (
    <Section id="who" labelledBy="h-who" tight className="about-section">
      <Reveal className="grid gap-9">
        <div className="grid gap-5">
          <h2 id="h-who" className="font-display text-[clamp(18px,1.6vw,21px)] font-medium tracking-[-0.02em] text-rattan-ink">{who.heading}</h2>
          <p className="max-w-[30ch] font-display text-[clamp(26px,3.8vw,50px)] font-normal leading-[1.1] tracking-[-0.04em]">{who.lead}</p>
        </div>
        <p className="max-w-[60ch] text-[17.5px] text-ink-2">{who.body}</p>
      </Reveal>
    </Section>
  );
}

/**
 * The five services as a bento: the free build wide and the care beside it, then Social and Ads in two tiles and Local SEO.
 * Each tile wears its plan's colour, so the page matches the pricing cards and the basket.
 */
function What(): ReactElement {
  const { what } = ABOUT;
  const SPAN = ["min-[980px]:col-span-4", "min-[980px]:col-span-2", "min-[980px]:col-span-2", "min-[980px]:col-span-2", "min-[980px]:col-span-2"];
  return (
    <Section id="what" labelledBy="h-what" tight className="about-section">
      <Reveal><SectionHead id="h-what" title={what.heading} lede={what.lede} /></Reveal>
      <Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 min-[640px]:grid-cols-2 min-[980px]:grid-cols-6">
          {what.items.map((item, index) => {
            const ItemIcon = ICON[item.icon];
            return (
              <article
                key={item.title}
                style={{ "--c": TONE[item.tone] } as CSSProperties}
                className={`grid content-start gap-3.5 rounded-[24px] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--c)_14%,var(--surface)),color-mix(in_srgb,var(--c)_4%,var(--surface)))] p-6 min-[980px]:p-7 ${index === 4 ? "min-[640px]:col-span-2" : ""} ${SPAN[index]} ${RING}`}
              >
                <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[var(--c)] text-action-ink"><ItemIcon weight="fill" className="size-6" /></span>
                <h3 className={`font-display font-medium leading-[1.15] tracking-[-0.03em] ${index === 0 ? "text-[clamp(26px,2.6vw,34px)]" : "text-[22px]"}`}>{item.title}</h3>
                <p className="max-w-[52ch] text-[16px] text-ink-2">{item.body}</p>
              </article>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}

/** Three kinds of customer as wide rows: the name large on the left, what it means for them on the right. */
function Serve(): ReactElement {
  const { serve } = ABOUT;
  return (
    <Section id="serve" labelledBy="h-serve" tight className="about-section">
      <Reveal><SectionHead id="h-serve" title={serve.heading} lede={serve.lede} /></Reveal>
      <Reveal>
        <ul className="grid">
          {serve.items.map((item: AboutItem) => (
            <li key={item.title} className="grid items-start gap-4 border-t border-line py-8 min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-14">
              <div className="grid grid-cols-[44px_1fr] items-center gap-4">
                <IconDisc name={item.icon} />
                <h3 className="font-display text-[clamp(24px,2.6vw,34px)] font-medium leading-[1.12] tracking-[-0.03em]">{item.title}</h3>
              </div>
              <p className="max-w-[56ch] text-[17px] text-ink-2">{item.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** How the business makes money: the reasoning on the left, a receipt of what a plan is made of on the right. */
function Earn(): ReactElement {
  const { earn } = ABOUT;
  const { receipt } = earn;
  return (
    <Section id="earn" labelledBy="h-earn" tight className="about-section">
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 min-[980px]:grid-cols-[1.05fr_0.95fr] min-[980px]:gap-16">
        <Reveal className="grid gap-8">
          <SectionHead id="h-earn" className="mb-0" title={earn.heading} lede={earn.lede} />
          <div className="grid gap-6">
            {earn.points.map((point) => (
              <div key={point.title} className="border-t border-line pt-5">
                <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em]">{point.title}</h3>
                <p className="mt-1.5 max-w-[54ch] text-[16px] text-ink-2">{point.body}</p>
              </div>
            ))}
          </div>
          <ArrowLink href="/pricing">{earn.pricingLink}</ArrowLink>
        </Reveal>
        <Reveal className="mx-auto w-full max-w-[420px] min-[980px]:mx-0 min-[980px]:mt-6 min-[980px]:justify-self-center">
          <div className="about-receipt-wrap">
            <div className="about-receipt">
              <p className="font-display text-[22px] font-medium tracking-[-0.025em]">{receipt.title}</p>
              <ul className="mt-4">
                {receipt.lines.map((line, index) => (
                  <li key={line.label} style={{ "--i": index } as CSSProperties} className="about-receipt-line">
                    <span>{line.label}</span>
                    <span aria-hidden="true" className="about-receipt-leader" />
                    <span className="about-receipt-value">{line.value}</span>
                  </li>
                ))}
              </ul>
              <div style={{ "--i": receipt.lines.length } as CSSProperties} className="about-receipt-line mt-3 border-t-2 border-dashed border-line pt-4">
                <span className="font-semibold">{receipt.apart.label}</span>
                <span aria-hidden="true" className="about-receipt-leader" />
                <span className="about-receipt-value">{receipt.apart.value}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Four reasons in one warm band, divided by hairlines. Two by two on tablets, stacked on phones. */
function Why(): ReactElement {
  const { why } = ABOUT;
  return (
    <Section id="why" labelledBy="h-why" tight className="about-section">
      <Reveal>
        <div className={`${PANEL} grid gap-10 bg-rattan-wash`}>
          <h2 id="h-why" className="font-display text-[clamp(30px,3.6vw,46px)] font-normal leading-none tracking-[-0.04em]">{why.heading}</h2>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-0 gap-y-8 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-4">
            {why.items.map((item) => (
              <li key={item.title} className="grid content-start gap-3 min-[1100px]:px-6 min-[1100px]:first:pl-0 min-[1100px]:last:pr-0 min-[1100px]:not-first:border-l min-[1100px]:not-first:border-[color-mix(in_srgb,var(--rattan-ink)_22%,transparent)]">
                <IconDisc name={item.icon} className="bg-surface" />
                <h3 className="font-display text-[20px] font-medium leading-[1.2] tracking-[-0.025em]">{item.title}</h3>
                <p className="text-[15.5px] text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

/** Mission and vision as two panels. The vision carries the Brandbasket mark, large and faint. */
function Purpose(): ReactElement {
  const { mission, vision } = ABOUT;
  return (
    <Section id="purpose" labelledBy="h-mission" tight className="about-section">
      <Reveal className="grid grid-cols-[minmax(0,1fr)] gap-5 min-[900px]:grid-cols-[0.9fr_1.1fr]">
        <div className={`${PANEL} grid content-start gap-5 bg-surface ${RING}`}>
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-rattan-wash text-rattan-ink"><Target weight="duotone" className="size-6" /></span>
          <h2 id="h-mission" className="font-display text-[clamp(28px,3.2vw,40px)] font-normal leading-none tracking-[-0.04em]">{mission.heading}</h2>
          <p className="max-w-[42ch] text-[18px] leading-[1.55] text-ink-2">{mission.body}</p>
        </div>
        <div className={`${PANEL} relative isolate grid content-start gap-5 overflow-clip bg-sunken`}>
          <Image src="/brand/brandbasket-mark.svg" alt="" width={360} height={360} aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-10 -z-10 size-[min(70%,340px)] opacity-[0.07]" />
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-surface text-rattan-ink"><Eye weight="duotone" className="size-6" /></span>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] font-normal leading-none tracking-[-0.04em]">{vision.heading}</h2>
          <p className="max-w-[34ch] font-display text-[clamp(22px,2.4vw,30px)] font-normal leading-[1.25] tracking-[-0.03em]">{vision.body}</p>
        </div>
      </Reveal>
    </Section>
  );
}

/** About Brandbasket: who we are, what we do, who we serve, how we earn, why us, mission and vision, and ends there. */
export default function AboutPage(): ReactElement {
  return (
    <>
      <Hero />
      <Who />
      <What />
      <Serve />
      <Earn />
      <Why />
      <Purpose />
      <JsonLd data={aboutPageJsonLd({ name: ROUTES.about.title, description: ROUTES.about.description })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    </>
  );
}
