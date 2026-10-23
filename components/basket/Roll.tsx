"use client";
import { type CSSProperties, type ReactElement, useEffect, useState } from "react";

interface RollProps {
  readonly value: string;
  /** 1 when the value went up (it rolls up), -1 when it went down. */
  readonly dir: 1 | -1;
  /** Milliseconds to wait before rolling, so something else can land first. */
  readonly delay?: number;
}

/** Text that rolls to its new value, like an odometer, and stays still on first paint. Transform and opacity only. */
export function Roll({ value, dir, delay = 0 }: RollProps): ReactElement {
  const [current, setCurrent] = useState(value);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  // Adjusting state while rendering is React's pattern for reacting to a changed prop without an extra render pass.
  if (value !== current) {
    setLeaving(current);
    setCurrent(value);
    setAnimated(true);
  }
  useEffect(() => {
    if (leaving === null) return;
    const timer = setTimeout(() => setLeaving(null), 520 + delay);
    return () => clearTimeout(timer);
  }, [leaving, delay]);
  const way = dir > 0 ? "up" : "down";
  return (
    <span className="dock-roll" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span key={current} className={animated ? `dock-roll-in-${way}` : undefined}>{current}</span>
      {leaving === null ? null : <span aria-hidden="true" className={`dock-roll-out-${way} absolute inset-0`}>{leaving}</span>}
    </span>
  );
}
