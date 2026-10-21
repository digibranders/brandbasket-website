"use client";
import type { ReactElement } from "react";

interface SwitchProps {
  readonly checked: boolean;
  readonly label: string;
  readonly onChange: (next: boolean) => void;
  /** Marks a switch that will not change, for example the last plan in the basket. It stays focusable. */
  readonly locked?: boolean;
}

/** Toggle switch (mock: .sw). Stops the click so a switch inside a clickable row does not trigger the row. */
export function Switch({ checked, label, onChange, locked = false }: SwitchProps): ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={locked || undefined}
      onClick={(event) => { event.stopPropagation(); onChange(!checked); }}
      className="relative h-7 w-[46px] flex-none rounded-full bg-line transition-colors duration-300 aria-checked:bg-action after:absolute after:left-[3px] after:top-[3px] after:size-[22px] after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(21,22,26,0.25)] after:transition-transform after:duration-[350ms] after:ease-[var(--ease)] aria-checked:after:translate-x-[18px] aria-disabled:cursor-not-allowed aria-disabled:opacity-55"
    />
  );
}
