import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { trackAttrs } from "@/lib/analytics";

type Tone = "default" | "inverse";

/** Shared by every outline pill: OutlineButton and the WhatsApp button. */
export function outlineClasses(tone: Tone): string {
  const colours = tone === "inverse" ? "border-action-ink/35 text-action-ink hover:border-action-ink" : "border-ink/20 text-ink hover:border-ink";
  return `group inline-flex h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] bg-transparent px-6 font-display text-[15.5px] font-semibold tracking-[-0.01em] transition-colors duration-300 ease-[var(--ease)] ${colours}`;
}

interface OutlineButtonProps {
  readonly href: string;
  readonly children: string;
  /** Where the button sits, reported with its cta_click event (lib/analytics.ts). */
  readonly location: string;
  readonly tone?: Tone;
}

/** The secondary action beside a main ArrowButton (mock: .btn-s). */
export function OutlineButton({ href, children, location, tone = "default" }: OutlineButtonProps): ReactElement {
  return (
    <Link href={href} className={`${outlineClasses(tone)} max-[560px]:justify-between`} {...trackAttrs("cta_click", location)}>
      {children}
      <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
    </Link>
  );
}
