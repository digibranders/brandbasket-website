// components/contact/ContactNext.tsx
import type { ReactElement } from "react";
import { StepsList } from "@/components/ui/StepsList";
import { CONTACT_NEXT } from "@/content/contact";
import { STEPS } from "@/content/home";

/** What follows a message, under the contact rows. The same three steps as the homepage. */
export function ContactNext(): ReactElement {
  return (
    <section aria-labelledby="h-next" className="mt-10">
      <h2 id="h-next" className="mb-3 font-display text-[22px] font-medium tracking-[-0.025em]">{CONTACT_NEXT.heading}</h2>
      <StepsList steps={STEPS} />
    </section>
  );
}
