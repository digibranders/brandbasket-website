// app/contact/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactChat } from "@/components/contact/ContactChat";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactNext } from "@/components/contact/ContactNext";
import { ContactSocial } from "@/components/contact/ContactSocial";
import { CONTACT_PAGE } from "@/content/contact";
import { currencyParam } from "@/lib/currency";
import { OYECHATS_BOT_KEY } from "@/lib/oyechats";
import { breadcrumbJsonLd, contactPageJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.contact);

/**
 * The section's grid. Phones stack head, form, info so a visitor who tapped a main button lands on the form. With the chat bot set up,
 * its card is one more area: on phones it sits between the head and the form (closed it is one row high, and under a long form
 * nobody would find it), on wide screens it is the first row of the left column.
 */
const GRID = "mx-auto grid w-full max-w-[1280px] grid-cols-[minmax(0,1fr)] items-start gap-8 px-[clamp(18px,4vw,56px)] pb-24 pt-32 min-[1000px]:grid-cols-[0.85fr_1.15fr] min-[1000px]:gap-x-16 min-[1000px]:gap-y-0";
const AREAS = "[grid-template-areas:'head'_'form'_'info'] min-[1000px]:grid-rows-[auto_1fr] min-[1000px]:[grid-template-areas:'head_form'_'info_form']";
const AREAS_WITH_CHAT = "[grid-template-areas:'head'_'chat'_'form'_'info'] min-[1000px]:grid-rows-[auto_auto_1fr] min-[1000px]:[grid-template-areas:'head_form'_'chat_form'_'info_form']";
export default async function ContactPage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      {/* The warm glow sits on a full-width layer that fades out at the bottom, so it has no hard edge under the form. */}
      <div className="relative isolate overflow-x-clip before:absolute before:inset-0 before:-z-10 before:[background:var(--hero)] before:[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
      <section
        aria-labelledby="h-contact"
        className={`${GRID} ${OYECHATS_BOT_KEY === null ? AREAS : AREAS_WITH_CHAT}`}
      >
        <div className="min-w-0 [grid-area:head]">
          <h1 id="h-contact" className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{CONTACT_PAGE.title}</h1>
          <p className="mt-[18px] max-w-[40ch] text-lg text-ink-2">{CONTACT_PAGE.lede}</p>
        </div>
        {OYECHATS_BOT_KEY === null ? null : (
          <div className="min-w-0 [grid-area:chat] min-[1000px]:mt-8">
            <ContactChat />
          </div>
        )}
        <div className="min-w-0 [grid-area:info]">
          <ContactChannels />
          <ContactNext />
          <ContactSocial />
        </div>
        <div id="start" className="min-w-0 scroll-mt-28 [grid-area:form]">
          <div className="ct-tray">
            <div className="ct-core">
              <ContactForm />
            </div>
          </div>
        </div>
        <JsonLd data={contactPageJsonLd()} />
        <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      </section>
      </div>
      <ContactFaq currency={currency} />
    </>
  );
}
