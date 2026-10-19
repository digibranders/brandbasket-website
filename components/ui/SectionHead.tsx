import type { ReactElement, ReactNode } from "react";

interface SectionHeadProps {
  readonly id: string;
  readonly title: ReactNode;
  readonly lede?: string;
  /** Bottom spacing; the mock trims it where a list follows the head (mock: #h-report). */
  readonly className?: string;
}

/** Headline and optional lede, stacked (mock: .sec-head). */
export function SectionHead({ id, title, lede, className = "mb-10" }: SectionHeadProps): ReactElement {
  return (
    <div className={`grid max-w-[760px] gap-3.5 ${className}`}>
      <h2 id={id} className="font-display text-[clamp(32px,4vw,54px)] font-normal leading-none tracking-[-0.045em]">{title}</h2>
      {lede ? <p className="max-w-[56ch] text-[17.5px] text-ink-2">{lede}</p> : null}
    </div>
  );
}
