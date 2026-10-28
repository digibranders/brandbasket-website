import type { ReactElement, ReactNode } from "react";

interface PageHeroProps {
  readonly id: string;
  readonly h1: string;
  readonly lede: string;
  /** Width and size tweaks for long headlines. */
  readonly h1ClassName?: string;
  /** Width of the lede; a longer direct answer needs more than the default. */
  readonly ledeClassName?: string;
  /** Anything below the lede, such as the offer line and the main button. */
  readonly children?: ReactNode;
}

/**
 * Short text hero for inner pages (About). No Reveal: the hero paints at once.
 * The --hero wash is masked to fade out at the bottom. Its rattan glow sits on the bottom edge, which on a short
 * hero shows as a hard line where the section ends; the tall homepage and pricing heroes hide it.
 */
export function PageHero({ id, h1, lede, h1ClassName = "", ledeClassName = "max-w-[46ch]", children }: PageHeroProps): ReactElement {
  return (
    <section aria-labelledby={id} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
      <div className="in-wrap relative grid justify-items-start gap-7 pb-16 pt-32">
        <div className="grid gap-[18px]">
          <h1 id={id} className={`font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em] ${h1ClassName}`}>{h1}</h1>
          <p className={`text-lg text-ink-2 ${ledeClassName}`}>{lede}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
