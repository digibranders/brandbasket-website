import type { ReactElement, ReactNode } from "react";

interface SectionHeadProps {
  readonly id: string;
  readonly title: ReactNode;
  readonly lede?: string;
  /** Bottom spacing; the mock trims it where a list follows the head (mock: #h-report). */
  readonly className?: string;
  /** One size down and heavier, as the home page's secondary headings (docs/plans/20-homepage-polish.md). */
  readonly step?: boolean;
}

/** Headline and optional lede, stacked (mock: .sec-head). */
export function SectionHead({ id, title, lede, className = "mb-10", step = false }: SectionHeadProps): ReactElement {
  return (
    <div className={`grid max-w-[760px] gap-3.5 ${className}`}>
      <h2 id={id} className={`font-display ${step ? "text-[clamp(34px,3.8vw,52px)] font-semibold leading-[1.02] tracking-[-0.042em]" : "text-[clamp(32px,4vw,54px)] font-normal leading-none tracking-[-0.045em]"}`}>{title}</h2>
      {lede ? <p className="max-w-[56ch] text-[17.5px] text-ink-2">{lede}</p> : null}
    </div>
  );
}
