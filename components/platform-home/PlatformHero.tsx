import { Browser, InstagramLogo, MegaphoneSimple } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { PLATFORM_HERO } from "@/content/platform-home";

/**
 * Homepage hero, "the poster": no picture beside the words. The headline is set edge to edge and "Digital Presence."
 * is filled with a slow pan of real client work (shops, tables, desks), so the presence is literally made of the
 * business. A turning badge of the three services sits on the corner of the type. No Reveal: the hero paints at once.
 */
export function PlatformHero(): ReactElement {
  const [lead, entire, ...filled] = PLATFORM_HERO.headline.split(" ");
  return (
    <section id="hero" aria-labelledby="h-hero" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(255,255,255,0.95),transparent_70%),radial-gradient(ellipse_80%_40%_at_50%_104%,rgba(196,138,71,0.16),transparent_70%)]" />
      <div className="relative mx-auto grid w-full max-w-[1760px] gap-[clamp(24px,3vw,44px)] px-[clamp(18px,3vw,48px)] pb-14 pt-[112px]">
        <h1 id="h-hero" className="poster-title">
          <span className="poster-line">{lead} {entire}</span>
          <span className="poster-line poster-fill">{filled.join(" ")}</span>
          <span className="poster-line poster-accent">{PLATFORM_HERO.headlineAccent}</span>
        </h1>

        <div aria-hidden="true" className="poster-badge">
          <svg viewBox="0 0 120 120" className="poster-ring">
            <defs><path id="poster-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
            <text><textPath href="#poster-circle">Website · Social media · Paid ads · </textPath></text>
          </svg>
          <span className="poster-icons"><Browser weight="duotone" /><InstagramLogo weight="duotone" /><MegaphoneSimple weight="duotone" /></span>
        </div>

        <div className="poster-foot">
          <p className="max-w-[40ch] text-[clamp(17px,1.4vw,20px)] leading-[1.55] text-ink-2">{PLATFORM_HERO.body}</p>
          <div className="cta-pair">
            <BasketCta location="hero" label={PLATFORM_HERO.primary.label} />
            <OutlineButton href={PLATFORM_HERO.secondary.href} location="hero">{PLATFORM_HERO.secondary.label}</OutlineButton>
          </div>
        </div>
      </div>
    </section>
  );
}
