import Link from "next/link";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui/Section";
import { LEGAL_LABELS } from "@/content/legal/labels";
import type { LegalDocument as LegalDocumentContent, LegalSection } from "@/content/legal/types";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { RegisteredOffice } from "./RegisteredOffice";

interface LegalDocumentProps {
  readonly document: LegalDocumentContent;
  /** The page's own path, for the breadcrumb. */
  readonly path: string;
}

/** "3. Acceptance and changes" becomes "acceptance-and-changes", so anchors survive renumbering. */
function sectionId(section: LegalSection): string {
  return section.id ?? section.heading.replace(/^\d+\.\s*/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Renders a legal document: title, version line, intro, a sticky contents list on desktop, the sections and the registered office. */
export function LegalDocument({ document, path }: LegalDocumentProps): ReactElement {
  const { title, updated, version, intro, sections, language = "en" } = document;
  const toc = sections.map((section) => ({ section, id: sectionId(section) }));

  return (
    <div lang={language}>
      <Section labelledBy="h-legal" tight>
        <header className="grid max-w-[68ch] gap-5 pb-12 pt-32 lg:pb-16">
          <h1 id="h-legal" className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{title}</h1>
          <p className="text-lg text-ink-2">{intro}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-semibold text-ink-2">
            <span>{LEGAL_LABELS.updated} {updated}</span>
            {version === undefined ? null : <span className="num">{LEGAL_LABELS.version} {version}</span>}
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,68ch)] lg:gap-16">
          <nav aria-labelledby="legal-contents" className="hidden lg:block">
            <div className="sticky top-28 grid gap-3">
              <h2 id="legal-contents" className="text-[13px] font-semibold text-ink-2">{LEGAL_LABELS.contents}</h2>
              <ol className="grid gap-2 text-[14.5px] leading-snug">
                {toc.map(({ section, id }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-ink-2 transition-colors duration-200 hover:text-ink">{section.heading}</a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="grid min-w-0 gap-12">
            {toc.map(({ section, id }) => (
              <section key={id} id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
                <h2 id={`${id}-h`} className="font-display text-[clamp(24px,2.4vw,30px)] font-normal leading-tight tracking-[-0.03em]">{section.heading}</h2>
                <div className="mt-4 grid gap-4 text-[16.5px] leading-[1.65] text-ink-2">
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
