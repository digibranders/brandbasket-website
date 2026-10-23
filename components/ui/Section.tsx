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
    <section id={id} aria-labelledby={labelledBy} className={`in-wrap ${tight ? "pb-16 pt-0 min-[640px]:pb-24" : "py-16 min-[640px]:py-24"} ${className}`}>
      {children}
    </section>
  );
}
