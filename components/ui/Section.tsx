import type { ReactElement, ReactNode } from "react";

interface SectionProps {
  readonly id?: string;
  readonly labelledBy: string;
  readonly tight?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Page section with the site gutter and vertical rhythm (mock: .sec, .in-wrap, .tight). */
export function Section({ id, labelledBy, tight = false, className = "", children }: SectionProps): ReactElement {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`mx-auto w-full max-w-[1280px] px-[clamp(18px,4vw,56px)] ${tight ? "pb-24 pt-0" : "py-24"} ${className}`}>
      {children}
    </section>
  );
}
