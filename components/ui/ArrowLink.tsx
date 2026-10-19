import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";

interface ArrowLinkProps {
  readonly href: string;
  readonly children: string;
}

/** Underlined text link with a trailing arrow (mock: .eq-side .explore). */
export function ArrowLink({ href, children }: ArrowLinkProps): ReactElement {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 justify-self-start py-1 text-[15px] font-semibold text-ink">
      <span className="underline decoration-rattan decoration-2 underline-offset-[6px]">{children}</span>
      <ArrowRight aria-hidden="true" className="size-[18px] text-rattan-text transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
    </Link>
  );
}
