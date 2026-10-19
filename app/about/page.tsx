import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { RegisteredOffice } from "@/components/legal/RegisteredOffice";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { ABOUT } from "@/content/about";
import { aboutPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

// The title already names Brandbasket, so it is absolute rather than "%s | Brandbasket" (as on Pricing and Contact).
export const metadata: Metadata = {
  ...pageMetadata({ title: ABOUT.title, description: ABOUT.description, path: "/about" }),
  title: { absolute: ABOUT.title },
};

/** About Brandbasket (plan 02, Task 7.3): who we are, how we work, what we will not do, then the registered office. */
export default function AboutPage(): ReactElement {
  return (
    <>
      <section aria-labelledby="h-about" className="[background:var(--hero)]">
        <div className="in-wrap grid gap-[18px] pb-16 pt-32">
          <h1 id="h-about" className="max-w-[22ch] font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em]">{ABOUT.h1}</h1>
          <p className="max-w-[46ch] text-lg text-ink-2">{ABOUT.lede}</p>
        </div>
      </section>

      <Section labelledBy="h-who" tight>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
          <Reveal>
            <SectionHead id="h-who" title={ABOUT.who.heading} />
          </Reveal>
          <Reveal className="grid min-w-0 gap-4 text-[17.5px] text-ink-2">
            {ABOUT.who.paragraphs.map((paragraph) => <p key={paragraph} className="max-w-[62ch]">{paragraph}</p>)}
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="h-how" tight>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
          <Reveal>
            <SectionHead id="h-how" title={ABOUT.how.heading} />
          </Reveal>
          <Reveal className="min-w-0">
            <ol className="grid">
              {ABOUT.how.steps.map((step) => (
                <li key={step.when} className="grid grid-cols-[120px_1fr] items-baseline gap-3.5 border-t border-line py-4 last:border-b">
                  <span className="font-mono text-[13px] text-rattan-ink">{step.when}</span>
                  <span className="font-display text-xl tracking-[-0.02em]">{step.what}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="h-wont" tight>
        <Reveal>
          <SectionHead id="h-wont" title={ABOUT.wontDo.heading} />
        </Reveal>
        <Reveal className="grid grid-cols-[minmax(0,1fr)] gap-x-14 gap-y-7 min-[900px]:grid-cols-3">
          {ABOUT.wontDo.items.map((item) => (
            <div key={item.title} className="border-t border-line pt-5">
              <h3 className="font-display text-[19px] font-medium tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-1 text-[15px] text-ink-2">{item.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <div className="in-wrap pb-24">
        <Reveal>
          <RegisteredOffice className="max-w-[560px]" />
        </Reveal>
      </div>

      <JsonLd data={aboutPageJsonLd({ name: ABOUT.title, description: ABOUT.description })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    </>
  );
}
