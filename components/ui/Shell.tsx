import type { ReactElement, ReactNode } from "react";

interface ShellProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** Double-bezel container used only where a price or a choice lives (mock: .shell > .core). */
export function Shell({ children, className = "" }: ShellProps): ReactElement {
  return (
    <div className={`min-w-0 rounded-[28px] border border-[var(--line-2)] bg-[var(--line-2)] p-1.5 ${className}`}>
      <div className="grid h-full content-start gap-4 rounded-[23px] bg-surface p-[26px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">{children}</div>
    </div>
  );
}
