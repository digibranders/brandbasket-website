// app/contact/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { Shell } from "@/components/ui/Shell";
import { CONTACT_PAGE } from "@/content/contact";
import { breadcrumbJsonLd, contactPageJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const CONTACT_TITLE = "Contact Brandbasket: free websites for local business";
const CONTACT_DESCRIPTION = "Talk to Brandbasket about a free website for your local business, a monthly plan or the site you already have. WhatsApp, call, email or send a message.";

export const metadata: Metadata = {
  ...pageMetadata({ title: CONTACT_TITLE, description: CONTACT_DESCRIPTION, path: "/contact" }),
  title: { absolute: CONTACT_TITLE },
};

/** Mock view "Contact". Phones stack head, form, info so a visitor who tapped a main button lands on the form. */
export default function ContactPage(): ReactElement {
  return (
    <section
      aria-labelledby="h-contact"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-[minmax(0,1fr)] items-start gap-8 px-[clamp(18px,4vw,56px)] pb-20 pt-32 [background:var(--hero)] [grid-template-areas:'head'_'form'_'info'] min-[1000px]:grid-cols-[0.85fr_1.15fr] min-[1000px]:grid-rows-[auto_1fr] min-[1000px]:gap-x-16 min-[1000px]:gap-y-0 min-[1000px]:[grid-template-areas:'head_form'_'info_form']"
    >
      <div className="min-w-0 [grid-area:head]">
        <h1 id="h-contact" className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{CONTACT_PAGE.title}</h1>
        <p className="mt-[18px] max-w-[40ch] text-lg text-ink-2">{CONTACT_PAGE.lede}</p>
      </div>
      <div className="min-w-0 [grid-area:info]">
        <ContactChannels />
      </div>
      <div id="start" className="min-w-0 scroll-mt-28 [grid-area:form]">
        <Shell>
          <ContactForm />
        </Shell>
      </div>
      <JsonLd data={contactPageJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    </section>
  );
}
