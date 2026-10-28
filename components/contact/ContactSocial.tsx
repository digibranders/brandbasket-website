// components/contact/ContactSocial.tsx
import type { ReactElement } from "react";
import { SocialLinks } from "@/components/shell/SocialLinks";
import { CONTACT_FOLLOW } from "@/content/contact";
import { socialLinks } from "@/lib/site-config";

/** Brandbasket's profiles under the contact rows. Nothing renders, heading included, while lib/site-config.ts lists none. */
export function ContactSocial(): ReactElement | null {
  if (socialLinks.length === 0) return null;
  return (
    <section aria-labelledby="h-follow" className="mt-10">
      <h2 id="h-follow" className="font-display text-[22px] font-medium tracking-[-0.025em]">{CONTACT_FOLLOW.heading}</h2>
      <SocialLinks />
    </section>
  );
}
