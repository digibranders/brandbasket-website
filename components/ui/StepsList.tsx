import type { ReactElement } from "react";
import type { Step } from "@/content/home";

/** Day 1, Week 1, Every month as ruled rows (mock: .steps-mini). Shared by the homepage report section and About. */
export function StepsList({ steps }: { readonly steps: readonly Step[] }): ReactElement {
  return (
    <ol className="grid">
      {steps.map((step) => (
        <li key={step.when} className="grid grid-cols-[120px_1fr] items-baseline gap-3.5 border-t border-line py-4 last:border-b">
          <span className="font-mono text-[13px] text-rattan-ink">{step.when}</span>
          <span className="font-display text-xl tracking-[-0.02em]">{step.what}</span>
        </li>
      ))}
    </ol>
  );
}
