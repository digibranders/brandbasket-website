// app/not-found.tsx
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { NOT_FOUND_COPY } from "@/content/errors";

export const metadata: Metadata = { title: NOT_FOUND_COPY.metaTitle, robots: { index: false } };

export default function NotFound(): ReactElement {
  return (
    <section className="mx-auto grid min-h-[60dvh] w-full max-w-[1280px] content-center gap-5 px-[clamp(18px,4vw,56px)] pb-20 pt-32 [background:var(--hero)]">
      <h1 className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{NOT_FOUND_COPY.title}</h1>
      <p className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
        <Link href="/" className="underline">{NOT_FOUND_COPY.home}</Link>
        <Link href="/pricing" className="underline">{NOT_FOUND_COPY.pricing}</Link>
      </p>
    </section>
  );
}
