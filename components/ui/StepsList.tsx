import type { ReactElement } from "react";
import type { Step } from "@/content/home";

interface StepsListProps {
  readonly steps: readonly Step[];
  /** columns: three across from 760px up, the time above the line. rows: ruled rows (the default). */
  readonly layout?: "rows" | "columns";
}

/** Day 1, Week 1, Every month (mock: .steps-mini). Shared by the homepage report section and About. */
export function StepsList({ steps, layout = "rows" }: StepsListProps): ReactElement {
  const columns = layout === "columns";
  return (
    <ol className={columns ? "grid gap-0 min-[760px]:grid-cols-3 min-[760px]:gap-7" : "grid"}>
      {steps.map((step) => (
        <li key={step.when} className={`grid items-baseline border-t border-line ${columns ? "grid-cols-[120px_1fr] gap-3.5 py-4 last:border-b min-[760px]:grid-cols-1 min-[760px]:gap-1.5 min-[760px]:pb-0 min-[760px]:last:border-b-0" : "grid-cols-[120px_1fr] gap-3.5 py-4 last:border-b"}`}>
          <span className="font-mono text-[13px] text-rattan-ink">{step.when}</span>
          <span className="font-display text-xl tracking-[-0.02em]">{step.what}</span>
        </li>
      ))}
    </ol>
  );
}
