import type { ReactElement } from "react";

interface TwoTierHeadProps {
  readonly id: string;
  /** The small line above. Omit it for a headline that stands alone. */
  readonly small?: string;
  readonly large: string;
  readonly className?: string;
}

/** A small line over a big bold one (mock: .hd-sm over .hd-lg). Used by the basket, plans, what-you-get and promises sections. */
export function TwoTierHead({ id, small, large, className = "" }: TwoTierHeadProps): ReactElement {
  return (
    <h2 id={id} className={`grid ${className}`}>
      {small ? <span className="mb-2.5 block font-display text-[clamp(18px,1.7vw,24px)] font-medium leading-[1.2] tracking-[-0.02em] text-ink-2">{small}</span> : null}
      <span className="block w-fit max-w-full text-balance pb-[0.1em] font-display text-[clamp(40px,5vw,72px)] font-bold leading-none tracking-[-0.045em] text-ink">{large}</span>
    </h2>
  );
}
