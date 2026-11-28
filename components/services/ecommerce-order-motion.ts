export type OrderVector = readonly [number, number, number];

type Keyframe<T> = readonly [time: number, value: T];

export const PARCEL_SHELF: OrderVector = [-4.05, 1.62, -1.40];
export const LIFT_DOCK: OrderVector = [-4.05, .055, .48];

const RAIL_Y = .31;
const BACK_RAIL = -.14;
export const PACKING_TABLE: OrderVector = [4.05, 1.28, 1.03];
export const LOADING_LANE = 3.72;
const CARGO_HEIGHT = .68;
export const DISPATCH_RAMP = {
  start: [PACKING_TABLE[0], PACKING_TABLE[1], 1.72],
  end: [PACKING_TABLE[0], CARGO_HEIGHT, LOADING_LANE],
} as const satisfies Record<"start" | "end", OrderVector>;
export const VAN_BAY = 2.44;
const DELIVERY_STOP = -4.68;
export const CUSTOMER_POSITION: OrderVector = [-3.30, 0, LOADING_LANE - .96];
const DELIVERED: OrderVector = [CUSTOMER_POSITION[0], .96, CUSTOMER_POSITION[2] + .42];
const VAN_LOADED = 5.43;
const VAN_UNLOADS = 5.84;
const CARGO_OFFSET = .24;

export function smoothstep(fraction: number): number {
  const t = Math.min(1, Math.max(0, fraction));
  return t * t * (3 - 2 * t);
}

export function orderStageTime(index: number, progress: number): number {
  return index + Math.min(1, Math.max(0, progress));
}

export function orderPlaybackFrame(elapsed: number, durations: readonly number[]): {
  index: number;
  time: number;
  done: boolean;
} {
  let remaining = Math.max(0, elapsed);
  for (const [index, duration] of durations.entries()) {
    if (remaining < duration) return { index, time: index + remaining / duration, done: false };
    remaining -= duration;
  }
  return { index: durations.length - 1, time: durations.length, done: true };
}

export function orderPlaybackElapsed(time: number, durations: readonly number[]): number {
  return durations.reduce((elapsed, duration, index) =>
    elapsed + duration * Math.min(1, Math.max(0, time - index)), 0);
}

function mix(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function mixVector(from: OrderVector, to: OrderVector, t: number): OrderVector {
  return [mix(from[0], to[0], t), mix(from[1], to[1], t), mix(from[2], to[2], t)];
}

function sample<T>(keys: readonly Keyframe<T>[], time: number, lerp: (from: T, to: T, fraction: number) => T): T {
  if (time <= keys[0][0]) return keys[0][1];
  const next = keys.findIndex(([when]) => when >= time);
  if (next < 0) return keys[keys.length - 1][1];
  const [start, from] = keys[next - 1];
  const [end, to] = keys[next];
  return lerp(from, to, smoothstep((time - start) / (end - start)));
}

// The same parcel is used from the initial shelf pose to its final seat in the van.
const PARCEL: readonly Keyframe<OrderVector>[] = [
  [0, PARCEL_SHELF],
  [.22, PARCEL_SHELF],
  [.32, [-4.05, 1.72, -1.40]],
  [.53, [-4.05, 1.72, BACK_RAIL]],
  [.84, [-4.05, RAIL_Y, BACK_RAIL]],
  [1, [-4.05, RAIL_Y, BACK_RAIL]],
  [1.72, [-1.52, RAIL_Y, BACK_RAIL]],
  [2, [-1.52, RAIL_Y, BACK_RAIL]],
  [2.50, [1.44, RAIL_Y, BACK_RAIL]],
  [3, [1.44, RAIL_Y, BACK_RAIL]],
  [3.62, [4.40, RAIL_Y, BACK_RAIL]],
  [4, [4.40, RAIL_Y, BACK_RAIL]],
  [4.10, [5.28, RAIL_Y, BACK_RAIL]],
  [4.24, [5.28, RAIL_Y, PACKING_TABLE[2]]],
  [4.39, [5.28, PACKING_TABLE[1], PACKING_TABLE[2]]],
  [4.54, PACKING_TABLE],
  [5, PACKING_TABLE],
  [5.11, DISPATCH_RAMP.start],
  [5.27, DISPATCH_RAMP.end],
  [VAN_LOADED, [VAN_BAY + CARGO_OFFSET, CARGO_HEIGHT, LOADING_LANE]],
  [VAN_UNLOADS, [DELIVERY_STOP + CARGO_OFFSET, CARGO_HEIGHT, LOADING_LANE]],
  [5.91, [CUSTOMER_POSITION[0], .69, LOADING_LANE]],
  [6, DELIVERED],
];

const MIN_LIFT_Y = .055;
const LIFT_EXTENSION: readonly Keyframe<number>[] = [[0, 0], [.12, 0], [.22, 1], [.84, 1], [1, 0]];
const LIFT_HEIGHT: readonly Keyframe<number>[] = [[0, MIN_LIFT_Y], [.02, MIN_LIFT_Y], [.12, PARCEL_SHELF[1] - .265]];
const PACK_LIFT_HEIGHT: readonly Keyframe<number>[] = [[0, MIN_LIFT_Y], [4.24, MIN_LIFT_Y], [4.39, PACKING_TABLE[1] - .265], [4.56, PACKING_TABLE[1] - .265], [4.83, MIN_LIFT_Y]];
const VAN: readonly Keyframe<number>[] = [[0, VAN_BAY], [5.54, VAN_BAY], [5.77, DELIVERY_STOP]];
const AWNING: readonly Keyframe<number>[] = [[0, -.46], [1.07, -.46], [1.61, 0]];
const CARD: readonly Keyframe<OrderVector>[] = [
  [0, [.13, .38, 1.48]], [2.41, [.13, .38, 1.48]], [2.70, [.13, .99, .43]],
  [2.82, [.13, .99, .43]], [3, [.13, .38, 1.48]],
];
const CARD_TILT: readonly Keyframe<number>[] = [[0, .6], [2.34, .6], [2.65, .13], [2.79, .13], [3, .6]];
const CONFIRMATION: readonly Keyframe<number>[] = [[0, 0], [2.63, 0], [2.82, 1]];
const RECEIPT: readonly Keyframe<number>[] = [[0, .17], [3.45, .17], [3.82, .82]];
const FLAPS: readonly Keyframe<number>[] = [[0, 0], [4.55, 0], [4.67, 1.73], [4.76, 1.73], [4.87, 0]];
const LABEL: readonly Keyframe<number>[] = [[0, 0], [4.87, 0], [4.99, 1]];
const CARGO_DOOR: readonly Keyframe<number>[] = [
  [0, 0], [5.01, 0], [5.26, 1], [VAN_LOADED, 1], [5.53, 0],
  [5.77, 0], [VAN_UNLOADS, 1], [5.96, 1], [6.12, 0],
];
const CUSTOMER_STEP: readonly Keyframe<number>[] = [[0, 0], [5.77, 0], [5.91, .40], [6, 0]];
const CUSTOMER_REACH: readonly Keyframe<number>[] = [[0, 0], [5.83, 0], [5.91, .72], [6, 1]];
const TRACKING_PIN: readonly Keyframe<OrderVector>[] = [[0, [-.36, .89, .032]], [5.54, [-.36, .89, .032]], [5.99, [.34, 1.10, .032]]];

interface OrderMotion {
  readonly parcel: OrderVector;
  readonly lift: OrderVector;
  readonly packingLift: number;
  readonly awning: number;
  readonly card: OrderVector;
  readonly cardTilt: number;
  readonly confirmation: number;
  readonly receipt: number;
  readonly flaps: number;
  readonly label: number;
  readonly van: number;
  readonly cargoDoor: number;
  readonly customerReach: number;
  readonly customerStep: number;
  readonly trackingPin: OrderVector;
}

export function sampleOrderMotion(time: number): OrderMotion {
  const van = sample(VAN, time, mix);
  const parcel = time >= VAN_LOADED && time < VAN_UNLOADS
    ? [van + CARGO_OFFSET, CARGO_HEIGHT, LOADING_LANE] as const
    : sample(PARCEL, time, mixVector);
  const extension = sample(LIFT_EXTENSION, time, mix);
  const liftHeight = time < .22 ? sample(LIFT_HEIGHT, time, mix) : Math.max(MIN_LIFT_Y, parcel[1] - .265);
  const liftReach = (time < .84 ? parcel[2] : BACK_RAIL) + .26;
  return {
    parcel,
    lift: [LIFT_DOCK[0], time > .84 ? mix(MIN_LIFT_Y, liftHeight, extension) : liftHeight, mix(LIFT_DOCK[2], liftReach, extension)],
    packingLift: sample(PACK_LIFT_HEIGHT, time, mix),
    awning: sample(AWNING, time, mix),
    card: sample(CARD, time, mixVector),
    cardTilt: sample(CARD_TILT, time, mix),
    confirmation: sample(CONFIRMATION, time, mix),
    receipt: sample(RECEIPT, time, mix),
    flaps: sample(FLAPS, time, mix),
    label: sample(LABEL, time, mix),
    van,
    cargoDoor: sample(CARGO_DOOR, time, mix),
    customerReach: sample(CUSTOMER_REACH, time, mix),
    customerStep: sample(CUSTOMER_STEP, time, mix),
    trackingPin: sample(TRACKING_PIN, time, mixVector),
  };
}
