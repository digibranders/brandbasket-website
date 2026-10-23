import { CaretDown, ChartLineUp, FileText, Headset, LockKey, PencilSimpleLine, PlugsConnected, Phone, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { INCLUDED, type IncludedGroup, type IncludedIconKey, type IncludedPart } from "@/content/pricing";
import { Column } from "./PlanDetails";

const ICONS: Readonly<Record<IncludedIconKey, Icon>> = { FileText, Phone, PencilSimpleLine, PlugsConnected, ShieldCheck, LockKey, ChartLineUp, Headset };
const COLOUR: Readonly<Record<IncludedGroup["colour"], string>> = { site: "var(--c-site)", growth: "var(--c-growth)", search: "var(--c-search)", care: "var(--c-care)" };

function Group({ group }: { readonly group: IncludedGroup }): ReactElement {
  const GroupIcon = ICONS[group.icon];
  return (
    <details className="group/inc border-t border-line last-of-type:border-b">
      <summary className="group/sum grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" style={{ "--c": COLOUR[group.colour] } as CSSProperties} className="grid size-[42px] place-items-center rounded-full bg-[var(--c)] text-action-ink">
          <GroupIcon className="size-[22px]" />
        </span>
        <span>
          <b className="block font-display text-xl font-medium tracking-[-0.02em] transition-colors duration-300 ease-[var(--ease)] group-hover/sum:text-rattan-ink">{group.title}</b>
          <span className="text-sm text-ink-2">{group.summary}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-rattan-ink">
          <span className="max-[640.98px]:sr-only">{INCLUDED.toggle}</span>
          <CaretDown aria-hidden="true" className="size-5 transition-transform duration-[400ms] ease-[var(--ease)] group-open/inc:rotate-180" />
        </span>
      </summary>
      <div className="grid gap-6 pb-7 pl-[58px] max-[640.98px]:pl-0 min-[900px]:grid-cols-2">
        {group.columns.map((column) => <Column key={column.heading} column={column} />)}
      </div>
    </details>
  );
}

function Part({ part }: { readonly part: IncludedPart }): ReactElement {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="mb-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-[22px] font-medium tracking-[-0.03em]">
        {part.label}
        <small className="font-sans text-sm font-normal tracking-normal text-ink-2">{part.note}</small>
      </h3>
      <div>
        {part.groups.map((group) => <Group key={group.id} group={group} />)}
      </div>
    </div>
  );
}

/**
 * Everything included, in two parts: what we build for free and what the monthly plan keeps running. Eight closed groups,
 * about 40 lines (docs/plans/21-pricing-page-content.md). The home page's "See everything included" lands here.
 */
export function EverythingIncluded(): ReactElement {
  return (
    <Section id="included" labelledBy="h-included" tight className="scroll-mt-24">
      <Reveal>
        <SectionHead id="h-included" title={<>{INCLUDED.heading} <em className="pivot pr-1">{INCLUDED.accent}</em></>} lede={INCLUDED.lede} />
      </Reveal>
      <Reveal>
        <Part part={INCLUDED.build} />
        <Part part={INCLUDED.run} />
        <p className="mt-6 max-w-[70ch] text-sm leading-[1.6] text-ink-2">{INCLUDED.privacyNote}</p>
      </Reveal>
    </Section>
  );
}
