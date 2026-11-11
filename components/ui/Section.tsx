import type { ReactElement, ReactNode } from "react";

interface SectionProps {
  readonly id?: string;
  readonly labelledBy: string;
  readonly tight?: boolean;
  readonly className?: string;
  /** The hanging basket (laptops) steps aside while this section is on screen, because the section shows a basket of its own (BasketWall.tsx). The phone dock stays. */
  readonly wallHide?: boolean;
  readonly children: ReactNode;
}

/** Page section with the site gutter and vertical rhythm (mock: .sec, .in-wrap, .tight). */
export function Section({ id, labelledBy, tight = false, className = "", wallHide = false, children }: SectionProps): ReactElement {
  return (
    <section id={id} data-wall-hide={wallHide || undefined} aria-labelledby={labelledBy} className={`in-wrap ${tight ? "pb-10 pt-0 min-[640px]:pb-24" : "py-10 min-[640px]:py-24"} ${className}`}>
      {children}
    </section>
  );
}
