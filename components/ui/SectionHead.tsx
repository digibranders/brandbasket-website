import type { ReactElement, ReactNode } from "react";

interface SectionHeadProps {
  readonly id: string;
  readonly title: ReactNode;
  readonly lede?: string;
}

/** Headline and optional lede, stacked (mock: .sec-head). */
export function SectionHead({ id, title, lede }: SectionHeadProps): ReactElement {
  return (
    <div className="mb-10 grid max-w-[760px] gap-3.5">
      <h2 id={id} className="font-display text-[clamp(32px,4vw,54px)] font-normal leading-none tracking-[-0.045em]">{title}</h2>
      {lede ? <p className="max-w-[56ch] text-[17.5px] text-ink-2">{lede}</p> : null}
    </div>
  );
}
