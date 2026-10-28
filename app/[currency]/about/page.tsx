import type { Icon } from "@phosphor-icons/react";
import { Buildings, Eye, Globe, ListChecks, MapPin, Megaphone, Package, Rocket, ShareNetwork, Stack, Storefront, Target, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import "@/components/about/about.css";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/ui/PageHero";
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
 * The five services as tags hung on a rod, the way the Brandbasket covers show them. Each tag wears its plan's colour, so the page
 * matches the pricing cards and the basket. From 1100px they hang in a row from a rod across the top and swing when hovered.
 * Below that the rod runs down the left and each service hangs off it as a name-tag with its text underneath.
 */
function What(): ReactElement {
  const { what } = ABOUT;
  const DROP = [0, 26, 8, 34, 14];
  const TILT = [-1.6, 1.2, -0.8, 1.6, -1.2];
  return (
    <Section id="what" labelledBy="h-what" tight className="about-section">
      <Reveal><SectionHead id="h-what" title={what.heading} lede={what.lede} /></Reveal>
      <Reveal>
        <ul className="about-tags">
          {what.items.map((item, index) => {
            const ItemIcon = ICON[item.icon];
            const style = { "--c": TONE[item.tone], "--drop": `${DROP[index] ?? 0}px`, "--tilt": `${TILT[index] ?? 0}deg`, "--tilt-small": `${(TILT[index] ?? 0) / 2}deg` } as CSSProperties;
            return (
              <li key={item.title} style={style} className="about-tag-slot">
                <article className="about-tag">
                  <div className="about-tag-head">
                    <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[var(--c)] text-action-ink"><ItemIcon weight="fill" className="size-5" /></span>
                    <h3 className="font-display text-[19px] font-medium leading-[1.15] tracking-[-0.03em] min-[1100px]:text-[21px]">{item.title}</h3>
                  </div>
                  <p className="about-tag-body text-[16px] leading-[1.6] text-ink-2 min-[1100px]:text-[15.5px]">{item.body}</p>
                </article>
              </li>
            );
          })}
        </ul>
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

/** About Brandbasket: who we are, what we do, who we serve, why us, mission and vision, and ends there. */
export default function AboutPage(): ReactElement {
  return (
    <>
      <PageHero id="h-about" h1={ABOUT.h1} lede={ABOUT.lede} h1ClassName="max-w-[20ch]" />
      <Who />
      <What />
      <Serve />
      <Why />
      <Purpose />
      <JsonLd data={aboutPageJsonLd({ name: ROUTES.about.title, description: ROUTES.about.description })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    </>
  );
}
