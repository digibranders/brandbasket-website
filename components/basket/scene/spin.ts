// components/basket/scene/spin.ts
export interface SpinSample {
  readonly t: number;
  readonly angle: number;
}

/** About 1.5 turns of coast at most, so a wild fling still glides rather than whirls. */
export const MAX_SPIN_SPEED = 30;
/** A pointer that rests this long before release leaves the basket still. */
export const RELEASE_PAUSE_MS = 120;
const KEEP_MS = 100;
/** Speed is read over at least this long: two or three events, the pace at the moment of release. */
const SPAN_MS = 32;
/** Closer samples than this still divide by it, so two near-simultaneous events cannot read as a fling. */
const MIN_SPAN_MS = 16;

/** Remembers the last 100 ms of the drag, oldest first, and never fewer than the last two events. */
export function recordSpin(samples: SpinSample[], t: number, angle: number): void {
  samples.push({ t, angle });
  while (samples.length > 2 && t - samples[1].t > KEEP_MS) samples.shift();
}

/**
 * Speed (rad/s) to coast at after release: how fast the pointer was moving at the end of the drag, so a flick that is
 * still accelerating spins on and a stroke that slowed before release barely drifts. One raw event is too noisy, and a
 * fixed gap per event under-reads pointers that report faster than 60 Hz.
 */
export function releaseSpin(samples: readonly SpinSample[], now: number): number {
  const last = samples[samples.length - 1];
  if (!last || samples.length < 2 || now - last.t > RELEASE_PAUSE_MS) return 0;
  let first = samples[samples.length - 2];
  for (let i = samples.length - 2; i >= 0; i--) {
    first = samples[i];
    if (last.t - first.t >= SPAN_MS) break;
  }
  const speed = ((last.angle - first.angle) / Math.max(last.t - first.t, MIN_SPAN_MS)) * 1000;
  return Math.max(-MAX_SPIN_SPEED, Math.min(MAX_SPIN_SPEED, speed));
}
