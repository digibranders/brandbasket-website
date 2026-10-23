import type { ReactElement } from "react";

interface TwoTierHeadProps {
  readonly id: string;
  /** The small line above. Omit it for a headline that stands alone. */
  readonly small?: string;
  readonly large: string;
  /** peak: the big bold style, kept for the page's two high points. step: one size down, for the other sections. */
  readonly tier?: "peak" | "step";
  /** On the dark band. */
  readonly onDark?: boolean;
  readonly className?: string;
}

const LARGE = {
  peak: "text-[clamp(40px,5vw,72px)] font-bold leading-none tracking-[-0.045em]",
  step: "text-[clamp(34px,3.8vw,52px)] font-semibold leading-[1.02] tracking-[-0.042em]",
} as const;

/** A small line over a big bold one (mock: .hd-sm over .hd-lg). */
export function TwoTierHead({ id, small, large, tier = "peak", onDark = false, className = "" }: TwoTierHeadProps): ReactElement {
  return (
    <h2 id={id} className={`grid ${className}`}>
      {small ? <span className={`mb-2.5 block font-display text-[clamp(18px,1.7vw,24px)] font-medium leading-[1.2] tracking-[-0.02em] ${onDark ? "text-action-ink/68" : "text-ink-2"}`}>{small}</span> : null}
      <span className={`block w-fit max-w-full text-balance pb-[0.1em] font-display ${LARGE[tier]} ${onDark ? "text-action-ink" : "text-ink"}`}>{large}</span>
    </h2>
  );
}
