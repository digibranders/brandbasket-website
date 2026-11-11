import { BookmarkSimple, CalendarCheck, ChatCircle, Heart, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { ReactElement } from "react";
import type { HomeServiceId } from "@/content/platform-home";

// Sample pictures for the services showcase. Every word in them is example UI text for one restaurant client, and the
// ones that show numbers carry an "Example" chip, as the homepage's old report did.

const THALI = "/home/thali-photo.jpg";
const CARD = "rounded-[18px] bg-surface shadow-[0_30px_60px_-36px_rgba(40,28,14,0.45),0_0_0_1px_rgba(21,22,26,0.06)]";
const EXAMPLE = "rounded-full border border-line px-2.5 py-0.5 text-[11.5px] font-semibold text-ink-2";

function WebsitePreview(): ReactElement {
  return (
    <div className={`${CARD} grid w-[86%] grid-rows-[auto_1fr] overflow-hidden`}>
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3.5">
        <i className="size-2 rounded-full bg-line" /><i className="size-2 rounded-full bg-line" /><i className="size-2 rounded-full bg-line" />
        <span className="ml-3 rounded-full bg-bg px-3 py-0.5 font-mono text-[11.5px] text-ink-2">currycook.com</span>
      </div>
      <div className="relative h-[clamp(240px,30vw,360px)] overflow-hidden">
        <Image src="/work/curry-cook-website-desktop.jpg" alt="" width={900} height={1345} sizes="(min-width: 1000px) 560px, 86vw" className="sp-autoscroll absolute inset-x-0 top-0 h-auto w-full" />
      </div>
    </div>
  );
}

function SocialPreview(): ReactElement {
  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="w-[min(46%,250px)] rounded-[34px] bg-ink p-[7px] shadow-[0_40px_70px_-36px_rgba(20,20,24,0.6)]">
        <div className="overflow-hidden rounded-[28px] bg-surface">
          <div className="flex items-center gap-2 px-3 pb-2 pt-4">
            <span className="grid size-7 place-items-center rounded-full bg-rattan-wash text-[11px] font-bold text-rattan-ink">CC</span>
            <span className="text-[12.5px] font-semibold">currycook</span>
          </div>
          <Image src={THALI} alt="" width={900} height={900} sizes="250px" className="aspect-square w-full object-cover" />
          <div className="flex items-center gap-3 px-3 pt-2.5 text-ink">
            <Heart weight="fill" className="size-[18px] text-error" /><ChatCircle className="size-[18px]" /><PaperPlaneTilt className="size-[18px]" />
            <BookmarkSimple className="ml-auto size-[18px]" />
          </div>
          <p className="px-3 pb-4 pt-1.5 text-[11.5px] leading-[1.4]"><b>currycook</b> Weekend thali is back. Saturday and Sunday only.</p>
        </div>
      </div>
      <div className={`${CARD} absolute bottom-[8%] right-[4%] flex items-center gap-3 px-4 py-3 max-[560px]:right-0`}>
        <span className="grid size-9 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--c-growth)_12%,var(--surface))] text-[var(--c-growth)]"><CalendarCheck weight="duotone" className="size-5" /></span>
        <span className="grid text-[13px] leading-tight"><b>Scheduled</b><span className="text-ink-2">Saturday, 11:00</span></span>
      </div>
    </div>
  );
}

function AdsPreview(): ReactElement {
  return (
    <div className="grid w-[90%] grid-cols-[0.9fr_1.1fr] items-center gap-4 max-[560px]:grid-cols-1">
      <div className={`${CARD} overflow-hidden`}>
        <div className="flex items-center gap-2 px-3 py-2.5 text-[12px]"><b>Curry Cook</b><span className="text-ink-2">Sponsored</span></div>
        <Image src={THALI} alt="" width={900} height={900} sizes="240px" className="aspect-[4/3] w-full object-cover object-[50%_40%]" />
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <b className="text-[13px] leading-tight">Weekend thali near you</b>
          <span className="flex-none rounded-full bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-action-ink">Order now</span>
        </div>
      </div>
      <div className={`${CARD} grid gap-2 p-4`}>
        <div className="flex items-center justify-between gap-2"><b className="text-[13px]">Enquiries from ads</b><span className={EXAMPLE}>Example</span></div>
        <svg viewBox="0 0 260 120" className="sp-chart h-auto w-full overflow-visible" aria-hidden="true">
          <defs><linearGradient id="sp-ads-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--c-growth-2)" stopOpacity="0.22" /><stop offset="1" stopColor="var(--c-growth-2)" stopOpacity="0" /></linearGradient></defs>
          <path d="M6 96 L54 88 L102 92 L150 66 L198 54 L252 22 L252 108 L6 108 Z" fill="url(#sp-ads-fill)" />
          <path className="sp-chart-line" d="M6 96 L54 88 L102 92 L150 66 L198 54 L252 22" fill="none" stroke="var(--c-growth-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="252" cy="22" r="5" fill="var(--surface)" stroke="var(--c-growth-2)" strokeWidth="2.5" />
        </svg>
        <div className="flex justify-between text-[11px] text-ink-2"><span>Week 1</span><span>Week 6</span></div>
      </div>
    </div>
  );
}

export const SERVICE_PREVIEWS: Readonly<Record<HomeServiceId, () => ReactElement>> = {
  website: WebsitePreview,
  social: SocialPreview,
  ads: AdsPreview,
};
