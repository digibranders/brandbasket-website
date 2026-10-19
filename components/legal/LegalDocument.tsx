import Link from "next/link";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui/Section";
import { LEGAL_LABELS } from "@/content/legal/labels";
import type { LegalDocument as LegalDocumentContent } from "@/content/legal/types";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { LegalContents } from "./LegalContents";
import { RegisteredOffice } from "./RegisteredOffice";
import { LEGAL_IDS, sectionId } from "./section-id";

interface LegalDocumentProps {
  readonly document: LegalDocumentContent;
  /** The page's own path, for the breadcrumb. */
  readonly path: string;
}

/** Renders a legal document: title, version line, intro, a sticky contents list on desktop, the sections and the registered office. */
export function LegalDocument({ document, path }: LegalDocumentProps): ReactElement {
  const { title, updated, version, intro, sections, language = "en" } = document;
  const toc = sections.map((section) => ({ section, id: sectionId(section) }));

  return (
    <div lang={language === "en" ? undefined : language}>
      <Section labelledBy={LEGAL_IDS.title} tight>
        <div className="grid items-start gap-8 pt-32 lg:grid-cols-[256px_minmax(0,68ch)] lg:gap-x-12 lg:gap-y-12">
          <header className="grid min-w-0 gap-5 border-b border-line pb-10 lg:col-start-2 lg:row-start-1 lg:pb-12">
            <h1 id={LEGAL_IDS.title} className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{title}</h1>
            <p className="max-w-[65ch] text-lg leading-relaxed text-ink-2">{intro}</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-semibold text-ink-2">
              <span>{LEGAL_LABELS.updated} {updated}</span>
              {version === undefined ? null : <span className="num">{LEGAL_LABELS.version} {version}</span>}
            </p>
          </header>
          <LegalContents items={toc.map(({ section, id }) => ({ id, heading: section.heading }))} />

          <div className="grid min-w-0 gap-12 lg:col-start-2 lg:row-start-2">
            {toc.map(({ section, id }) => (
              <section key={id} id={id} tabIndex={-1} className="scroll-mt-28 border-b border-line pb-10 focus:outline-none">
                <h2 className="font-display text-[clamp(24px,2.4vw,30px)] font-normal leading-tight tracking-[-0.03em]">{section.heading}</h2>
                <div className="mt-4 grid gap-4 text-[16.5px] leading-[1.8] text-ink-2">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.link === undefined ? null : (
                  <p className="mt-4 text-[16.5px]">
                    <Link href={section.link.href} className="font-semibold text-ink underline underline-offset-[3px]">{section.link.label}</Link>
                  </p>
                )}
              </section>
            ))}
            <RegisteredOffice />
          </div>
        </div>
      </Section>
      <JsonLd data={breadcrumbJsonLd([{ name: LEGAL_LABELS.home, path: "/" }, { name: title, path }])} />
    </div>
  );
}
