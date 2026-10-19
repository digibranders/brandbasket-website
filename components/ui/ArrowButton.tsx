// components/ui/ArrowButton.tsx
import Link from "next/link";
import type { ReactElement } from "react";

interface ArrowButtonProps {
  readonly href: string;
  readonly children: string;
  readonly size?: "md" | "sm";
  readonly tone?: "action" | "inverse";
}

/** Pill button with the arrow in its own circle, as in the mock. */
export function ArrowButton({ href, children, size = "md", tone = "action" }: ArrowButtonProps): ReactElement {
  const pad = size === "sm" ? "py-1.5 pl-4 pr-1.5 text-sm gap-2.5" : "py-2 pl-5 pr-2 text-[15px] gap-3";
  const colours = tone === "action" ? "bg-action text-action-ink" : "bg-action-ink text-action";
  const dot = size === "sm" ? "size-[30px]" : "size-9";
  return (
    <Link href={href} className={`group inline-flex items-center whitespace-nowrap rounded-full font-semibold transition-transform duration-500 active:scale-[0.98] ${pad} ${colours}`}>
      {children}
      <span aria-hidden="true" className={`grid place-items-center rounded-full bg-rattan text-[#15161a] transition-transform duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5 ${dot}`}>
        <svg viewBox="0 0 16 16" className="size-[15px]"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </Link>
  );
}
