// components/ui/ArrowButton.tsx
import Link from "next/link";
import type { ReactElement } from "react";
import { trackAttrs } from "@/lib/analytics";

type Size = "md" | "sm";
type Tone = "action" | "inverse";

interface ArrowButtonProps {
  readonly href: string;
  readonly children: string;
  /** Where the button sits, reported with its cta_click event (lib/analytics.ts). */
  readonly location: string;
  readonly size?: Size;
  readonly tone?: Tone;
}

interface ArrowSubmitButtonProps {
  readonly children: string;
  readonly disabled?: boolean;
  readonly describedBy?: string;
  readonly className?: string;
}

function pillClasses(size: Size, tone: Tone): string {
  const pad = size === "sm" ? "h-10 gap-2.5 pr-[5px] pl-[18px] text-sm" : "h-[52px] gap-3.5 pr-2 pl-6 text-[15.5px]";
  const colours = tone === "action" ? "bg-action text-action-ink" : "bg-action-ink text-action";
  return `group inline-flex items-center justify-between whitespace-nowrap rounded-full font-semibold transition-transform duration-500 ease-[var(--ease)] active:scale-[0.98] ${pad} ${colours}`;
}

function Arrow({ size }: { readonly size: Size }): ReactElement {
  const dot = size === "sm" ? "size-[30px]" : "size-9";
  return (
    <span aria-hidden="true" className={`grid place-items-center rounded-full bg-rattan text-ink transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-[1.06] ${dot}`}>
      <svg viewBox="0 0 16 16" className="size-[15px]"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

/** Pill button with the arrow in its own circle, as in the mock. */
export function ArrowButton({ href, children, location, size = "md", tone = "action" }: ArrowButtonProps): ReactElement {
  return (
    <Link href={href} className={pillClasses(size, tone)} {...trackAttrs("cta_click", location)}>
      {children}
      <Arrow size={size} />
    </Link>
  );
}

/** The same pill as a form submit button (mock: button.bib). */
export function ArrowSubmitButton({ children, disabled = false, describedBy, className = "" }: ArrowSubmitButtonProps): ReactElement {
  return (
    <button type="submit" disabled={disabled} aria-describedby={describedBy} className={`${pillClasses("md", "action")} cursor-pointer disabled:cursor-wait ${className}`}>
      {children}
      <Arrow size="md" />
    </button>
  );
}
