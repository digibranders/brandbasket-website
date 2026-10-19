import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { StepsList } from "@/components/ui/StepsList";
import { REPORT, type ReportTone, STEPS } from "@/content/home";

const TONE: Readonly<Record<ReportTone, string>> = {
  site: "bg-[var(--c-site)]",
  growth: "bg-[var(--c-growth)]",
  growth2: "bg-[var(--c-growth-2)]",
  search: "bg-[var(--c-search)]",
};

/** Horizontal guide lines in the chart's viewBox (mock: #h-report svg). */
const GRID_Y = [20, 55, 90] as const;

function ReportChart(): ReactElement {
  const { chart } = REPORT;
  const points = chart.pointsY.map((y, i) => ({ x: chart.firstX + i * chart.stepX, y }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];
  const area = last ? `${line} ${last.x},${chart.baselineY} ${chart.firstX},${chart.baselineY}` : "";
  return (
    <div className="rounded-2xl bg-bg px-3.5 pb-2 pt-3.5">
      <div className="mb-1.5 flex justify-between text-[12.5px] text-ink-2"><span>{chart.title}</span><span>{chart.range}</span></div>
      <svg viewBox={`0 0 ${chart.viewBox.width} ${chart.viewBox.height}`} role="img" aria-labelledby="ch-t" className="block h-auto w-full text-ink">
        <title id="ch-t">{chart.svgTitle}</title>
        <g stroke="currentColor" strokeOpacity="0.12">
          {GRID_Y.map((y) => <line key={y} x1="0" y1={y} x2={chart.viewBox.width} y2={y} />)}
        </g>
        <polygon points={area} className="fill-rattan" fillOpacity="0.16" />
        <polyline points={line} fill="none" className="stroke-rattan" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {last ? <circle cx={last.x} cy={last.y} r="5" className="fill-rattan" /> : null}
      </svg>
    </div>
  );
}

/** Steps and the example monthly report (mock: #h-report, .steps-mini, .report). The "Example report" chip stays. */
export function ReportSection(): ReactElement {
  return (
    <Section labelledBy="h-report" tight>
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 min-[1000px]:grid-cols-[0.8fr_1.2fr] min-[1000px]:gap-16">
        <Reveal>
          <SectionHead id="h-report" className="mb-7" title={<>{REPORT.heading} <em className="pivot pr-1">{REPORT.headingAccent}</em></>} />
          <StepsList steps={STEPS} />
        </Reveal>
        <Reveal className="min-w-0">
          <div role="group" aria-label={REPORT.ariaLabel} className="grid min-w-0 gap-[18px] rounded-[26px] border border-line bg-surface p-6 shadow-[var(--shadow)]">
            <div className="flex flex-wrap items-start justify-between gap-3.5">
              <div>
                <b className="block font-display text-xl font-medium tracking-[-0.02em]">{REPORT.title}</b>
                <span className="text-[13px] text-ink-2">{REPORT.subtitle}</span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-rattan-wash px-2.5 py-1 font-mono text-[11.5px] text-rattan-ink">{REPORT.chip}</span>
            </div>
            <dl className="grid grid-cols-2 gap-2.5 min-[640px]:grid-cols-4">
              {REPORT.kpis.map((kpi) => (
                <div key={kpi.label} className="grid min-w-0 gap-1 rounded-2xl bg-bg p-3.5">
                  <dt className="flex items-center gap-1.5 text-xs text-ink-2"><i aria-hidden="true" className={`size-2 rounded-[2px] ${TONE[kpi.tone]}`} />{kpi.label}</dt>
                  <dd className="num font-display text-[26px] font-medium tracking-[-0.03em]">{kpi.value}</dd>
                  <dd className="text-xs font-semibold text-sage">{kpi.delta}</dd>
                </div>
              ))}
            </dl>
            <ReportChart />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
