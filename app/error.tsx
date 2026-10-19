"use client";
// app/error.tsx
import type { ReactElement } from "react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ERROR_COPY } from "@/content/errors";

interface ErrorProps {
  readonly error: unknown;
  readonly retry: () => void;
}

/** Route error boundary. The error itself is never shown: production messages are generic and may leak details. */
export default function RouteError({ retry }: ErrorProps): ReactElement {
  return (
    <section className="mx-auto grid min-h-[60dvh] w-full max-w-[1280px] content-center justify-items-start gap-5 px-[clamp(18px,4vw,56px)] pb-20 pt-32">
      <h1 className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{ERROR_COPY.title}</h1>
      <p className="max-w-[44ch] text-lg text-ink-2">{ERROR_COPY.body}</p>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={() => retry()} className="cursor-pointer rounded-full bg-action px-[22px] py-3 text-[15px] font-semibold text-action-ink transition-transform duration-500 ease-[var(--ease)] active:scale-[0.98]">
          {ERROR_COPY.retry}
        </button>
        <WhatsAppButton />
      </div>
    </section>
  );
}
