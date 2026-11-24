// app/[currency]/(site)/faq/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { FaqLeave, FaqPlanCard, FaqScope } from "@/components/faq/FaqSections";
import { answerText, FAQ_CHIP_LABEL, FAQ_PAGE, FAQ_QUICK, faqCountFor, faqItemsFor, faqTopicsFor } from "@/content/faq";
import { currencyParam } from "@/lib/currency";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.faq);

/** The FAQ page: every question about the managed website plan, searchable and grouped by topic, then what is included and what happens if you leave. */
export default async function FaqPage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  const topics = faqTopicsFor(currency).map((topic) => ({
    ...topic,
    groups: topic.groups.map((group) => ({ ...group, questions: group.questions.map((question) => ({ ...question, hay: `${question.q} ${answerText(question.a)}`.toLowerCase() })) })),
  }));
  return (
    <>
      <FaqExplorer
        topics={topics}
        quick={FAQ_QUICK}
        chipLabels={FAQ_CHIP_LABEL}
        aside={<FaqPlanCard currency={currency} />}
        copy={{
          h1: FAQ_PAGE.h1,
          lede: `${faqCountFor(currency)} ${FAQ_PAGE.ledeAfterCount}`,
          searchLabel: FAQ_PAGE.searchLabel,
          searchPlaceholder: FAQ_PAGE.searchPlaceholder,
          clear: FAQ_PAGE.clear,
          topicsLabel: FAQ_PAGE.topicsLabel,
          emptyHeading: FAQ_PAGE.emptyHeading,
          emptyBody: FAQ_PAGE.emptyBody,
          emptyLink: FAQ_PAGE.emptyLink,
          emptyHref: ROUTES.contact.path,
        }}
      />
      <FaqScope currency={currency} />
      <FaqLeave currency={currency} />
      <JsonLd data={faqJsonLd(faqItemsFor(currency))} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />
    </>
  );
}
