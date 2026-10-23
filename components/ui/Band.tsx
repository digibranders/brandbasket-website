import type { ReactElement, ReactNode } from "react";

type Tone = "plain" | "sunken" | "ink" | "glow";

const TONE: Readonly<Record<Tone, string>> = {
  plain: "",
  sunken: "band-sunken",
  ink: "band-ink",
  glow: "band-glow",
};

interface BandProps {
  readonly tone?: Tone;
  readonly className?: string;
  readonly children: ReactNode;
}

/** A full-width band behind a section (its content keeps the site column). Decorative icons inside sit behind the content. */
export function Band({ tone = "plain", className = "", children }: BandProps): ReactElement {
  return <div className={`band ${TONE[tone]} ${className}`}>{children}</div>;
}
