import { Check } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Faq } from "@/components/ui/Faq";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { GUIDE_COPY, type GuidePageContent, type GuideSection, type GuideTable } from "@/content/guides";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { GuideLinks } from "./GuideLinks";

const TWO_COLUMNS = "grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16";

function SectionBlock({ section, id }: { readonly section: GuideSection; readonly id: string }): ReactElement {
  return (
    <Section labelledBy={id} tight>
      <div className={TWO_COLUMNS}>
        <Reveal>
          <SectionHead id={id} className="mb-0" title={section.heading} step />
        </Reveal>
        <Reveal className="grid min-w-0 gap-4 text-[17.5px] text-ink-2">
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="max-w-[62ch]">{paragraph}</p>)}
          {section.bullets === undefined ? null : (
            <ul className="grid max-w-[62ch] gap-2.5">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <Check aria-hidden="true" weight="bold" className="mt-1 size-[18px] flex-none text-rattan-text" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

function TableBlock({ table }: { readonly table: GuideTable }): ReactElement {
  return (
    <Section labelledBy="h-table" tight>
      <Reveal>
        <SectionHead id="h-table" title={table.heading} lede={table.lede} step />
      </Reveal>
      <Reveal className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-[15px] text-ink-2">
          <thead>
            <tr>
              {table.head.map((cell, i) => (
                <th key={cell || "row"} scope="col" className={`border-b border-line px-4 py-3 font-display text-[16px] font-medium text-ink ${i === 1 ? "bg-sunken" : ""}`}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={cell} scope="row" className="border-b border-line px-4 py-3 align-top font-medium text-ink">{cell}</th>
                  ) : (
                    <td key={`${row[0]}-${cell}`} className={`border-b border-line px-4 py-3 align-top ${i === 1 ? "bg-sunken text-ink" : ""}`}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Section>
  );
}

/** One "for your kind of business" or comparison page: a direct answer first, then the detail, the questions and where to read next. */
export function GuidePage({ page }: { readonly page: GuidePageContent }): ReactElement {
  return (
    <>
      <PageHero id="h-guide" h1={page.h1} lede={page.answer} h1ClassName="max-w-[22ch]" ledeClassName="max-w-[62ch]">
        <ArrowLink href={GUIDE_COPY.planLink.href}>{GUIDE_COPY.planLink.label}</ArrowLink>
      </PageHero>
      {page.sections.map((section, i) => <SectionBlock key={section.heading} section={section} id={`h-s${i}`} />)}
      {page.table === undefined ? null : <TableBlock table={page.table} />}
      <Section labelledBy="h-faq" tight>
        <div className={TWO_COLUMNS}>
          <Reveal>
            <SectionHead id="h-faq" className="mb-0" title={GUIDE_COPY.faqHeading} step />
          </Reveal>
          <Reveal className="min-w-0">
            <Faq items={page.faq} id="guide-faq" />
          </Reveal>
        </div>
      </Section>
      <GuideLinks links={page.next} heading={GUIDE_COPY.nextHeading} id="h-next" />
      <JsonLd data={webPageJsonLd({ name: page.metaTitle, description: page.metaDescription, path: page.path })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.h1, path: page.path }])} />
    </>
  );
}
