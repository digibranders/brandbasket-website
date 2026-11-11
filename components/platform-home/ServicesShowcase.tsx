"use client";
import { ArrowRight } from "@phosphor-icons/react";
import { type CSSProperties, type KeyboardEvent, type ReactElement, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { HOME_SERVICES, type HomeServiceId, SERVICES_HEADING } from "@/content/platform-home";
import { SERVICE_META } from "./service-meta";
import { SERVICE_PREVIEWS } from "./ServicePreviews";

const tabId = (id: HomeServiceId): string => `svc-tab-${id}`;
const PANEL_ID = "svc-panel";

/**
 * "Four Services. One Platform.": the four service names as a vertical tab list, and one panel with the chosen
 * service's picture, words and link. All four pictures stay mounted and cross-fade, so switching never reflows.
 * Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern, automatic activation).
 */
export function ServicesShowcase(): ReactElement {
  const [active, setActive] = useState<HomeServiceId>("website");
  const tabRefs = useRef<Partial<Record<HomeServiceId, HTMLButtonElement | null>>>({});
  const current = HOME_SERVICES.find((s) => s.id === active) ?? HOME_SERVICES[0];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const index = HOME_SERVICES.findIndex((s) => s.id === active);
    const last = HOME_SERVICES.length - 1;
    const next: Record<string, number> = { ArrowDown: index === last ? 0 : index + 1, ArrowRight: index === last ? 0 : index + 1, ArrowUp: index === 0 ? last : index - 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last };
    const target = next[event.key];
    const service = target === undefined ? undefined : HOME_SERVICES[target];
    if (!service) return;
    event.preventDefault();
    setActive(service.id);
    tabRefs.current[service.id]?.focus();
  }

  return (
    <Section id="services" labelledBy="h-services" className="scroll-mt-24">
      <Reveal>
        <SectionHead id="h-services" step title={<>{SERVICES_HEADING.lead} <em className="font-light not-italic text-rattan-text">{SERVICES_HEADING.accent}</em></>} />
      </Reveal>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 min-[1000px]:grid-cols-[0.8fr_1.2fr] min-[1000px]:items-start min-[1000px]:gap-14">
        <Reveal>
          <div role="tablist" aria-orientation="vertical" aria-label="Services" onKeyDown={onKeyDown} className="grid">
            {HOME_SERVICES.map((service) => {
              const { icon: Icon, tone } = SERVICE_META[service.id];
              const selected = service.id === active;
              return (
                <button
                  key={service.id}
                  ref={(el) => { tabRefs.current[service.id] = el; }}
                  type="button"
                  role="tab"
                  id={tabId(service.id)}
                  aria-selected={selected}
                  aria-controls={PANEL_ID}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(service.id)}
                  style={{ "--tone": tone } as CSSProperties}
                  className={`group flex cursor-pointer items-center gap-4 border-t border-line py-5 text-left transition-colors duration-300 ease-[var(--ease)] last:border-b ${selected ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                >
                  <span className={`grid size-12 flex-none place-items-center rounded-2xl transition-colors duration-300 ease-[var(--ease)] ${selected ? "bg-[var(--tone)] text-action-ink" : "bg-[color-mix(in_srgb,var(--tone)_10%,var(--surface))] text-[var(--tone)]"}`}>
                    <Icon weight="duotone" className="size-6" />
                  </span>
                  <span className="flex-1 font-display text-[clamp(22px,2.3vw,32px)] font-medium leading-[1.1] tracking-[-0.03em]">{service.name}</span>
                  <ArrowRight aria-hidden="true" className={`size-6 flex-none transition-[opacity,transform] duration-300 ease-[var(--ease)] ${selected ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`} />
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120} className="min-w-0 min-[1000px]:sticky min-[1000px]:top-28">
          <div role="tabpanel" id={PANEL_ID} aria-labelledby={tabId(active)} className="grid gap-6">
            <div
              className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-[28px] transition-[background-color] duration-500 ease-[var(--ease)] max-[560px]:aspect-[4/5]"
              style={{ backgroundColor: `color-mix(in srgb, ${SERVICE_META[active].tone} 11%, var(--surface))` }}
            >
              {HOME_SERVICES.map((service) => {
                const Preview = SERVICE_PREVIEWS[service.id];
                const shown = service.id === active;
                return (
                  <div key={service.id} aria-hidden="true" className={`col-start-1 row-start-1 flex size-full items-center justify-center transition-[opacity,transform] duration-500 ease-[var(--ease)] ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
                    <Preview />
                  </div>
                );
              })}
            </div>
            <div className="grid gap-4">
              <p className="max-w-[52ch] text-[18px] leading-[1.55] text-ink-2">{current.body}</p>
              <ul className="flex flex-wrap gap-2" aria-label={`${current.name} includes`}>
                {current.capabilities.map((c) => (
                  <li key={c} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[14px] font-medium">{c}</li>
                ))}
              </ul>
              <ArrowLink href={current.href}>{current.cta}</ArrowLink>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
