import type { Metadata } from "next";
import type { ReactElement } from "react";
import { GuideLinks } from "@/components/guides/GuideLinks";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { GLOSSARY, GUIDE_COPY } from "@/content/guides";
import { breadcrumbJsonLd, definedTermSetJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.glossary);

/** /glossary: the terms a local business meets, each in a sentence or two. */
export default function GlossaryPage(): ReactElement {
  return (
    <>
      <PageHero id="h-glossary" h1={GLOSSARY.h1} lede={GLOSSARY.lede} h1ClassName="max-w-[22ch]" />
      <Section labelledBy="h-glossary" tight>
        <Reveal>
          <dl className="grid max-w-[820px] gap-x-14 gap-y-8 min-[900px]:grid-cols-2">
            {GLOSSARY.terms.map((entry) => (
              <div key={entry.term} className="border-t border-line pt-5">
                <dt className="font-display text-[19px] font-medium tracking-[-0.02em]">{entry.term}</dt>
                <dd className="mt-1 text-[15.5px] text-ink-2">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>
      <GuideLinks links={GLOSSARY.next} heading={GUIDE_COPY.nextHeading} id="h-next" />
      <JsonLd data={definedTermSetJsonLd({ name: GLOSSARY.h1, path: ROUTES.glossary.path, terms: GLOSSARY.terms })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Glossary", path: ROUTES.glossary.path }])} />
    </>
  );
}
