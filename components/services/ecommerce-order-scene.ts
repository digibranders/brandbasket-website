import { Box, Camera, Cylinder, Mesh, Program, Renderer, Transform, Vec3, type OGLRenderingContext } from "ogl";
import { ECOMMERCE_ORDER_STEPS } from "@/content/ecommerce";
import { fitOrderScene, type OrderViewBounds } from "./ecommerce-order-framing";
import { CUSTOMER_POSITION, DISPATCH_RAMP, LIFT_DOCK, LOADING_LANE, orderPlaybackElapsed, orderPlaybackFrame, PACKING_TABLE, PARCEL_SHELF, sampleOrderMotion, smoothstep, VAN_BAY } from "./ecommerce-order-motion";

export type OrderStage = (typeof ECOMMERCE_ORDER_STEPS)[number]["id"];

export interface OrderScene {
  show(stage: OrderStage, animate: boolean): void;
  play(onStage: (index: number) => void, onEnd: () => void): void;
  freeze(): void;
  dispose(): void;
}

// Clockwise merchant journey across the back row and down to dispatch and store care.
const STATIONS = {
  catalog: [-4.45, -1.62],
  storefront: [-1.52, -1.66],
  checkout: [1.44, -1.55],
  orders: [4.4, -1.58],
  packing: [PACKING_TABLE[0], PACKING_TABLE[2]],
  delivery: [VAN_BAY, LOADING_LANE],
  care: [-1.45, 1.4],
} as const satisfies Readonly<Record<OrderStage, readonly [number, number]>>;

type Vector = readonly [number, number, number];
type Colour = "skin" | "line" | "red" | "rubber" | "ink" | "slate" | "sand" | "gold" | "kraft" | "paper" | "teal" | "mint" | "glass";

const PALETTE: Readonly<Record<Colour, Vector>> = {
  skin: [0.69, 0.44, 0.31],
  line: [0.34, 0.43, 0.39],
  red: [0.91, 0.42, 0.26],
  rubber: [0.065, 0.085, 0.088],
  ink: [0.13, 0.15, 0.16],
  slate: [0.23, 0.27, 0.28],
  sand: [0.74, 0.63, 0.47],
  gold: [0.88, 0.61, 0.31],
  kraft: [0.65, 0.42, 0.22],
  paper: [0.98, 0.93, 0.82],
  teal: [0.14, 0.41, 0.38],
  mint: [0.53, 0.83, 0.65],
  glass: [0.31, 0.52, 0.50],
};

const VERTEX = `
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  precision mediump float;
  uniform vec3 uColour;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    float sun = max(dot(normal, normalize(vec3(-0.55, 0.85, 0.68))), 0.0);
    float fill = max(dot(normal, normalize(vec3(0.64, 0.13, -0.72))), 0.0);
    gl_FragColor = vec4(uColour * (0.60 + 0.48 * sun + 0.12 * fill), 1.0);
  }
`;

function assembly(parent: Transform, x: number, y: number, z: number): Transform {
  const node = new Transform();
  node.position.set(x, y, z);
  node.setParent(parent);
  return node;
}

interface CustomerArm {
  readonly side: number;
  readonly upper: Mesh;
  readonly lower: Mesh;
  readonly hand: Mesh;
}

function alignLimb(mesh: Mesh, from: Vec3, to: Vec3): void {
  mesh.position.copy(from).lerp(to, .5);
  mesh.scale.z = from.distance(to) + .056;
  mesh.lookAt(to, true);
}

function buildWorkshop(gl: OGLRenderingContext): {
  readonly world: Transform;
  readonly awning: Transform;
  readonly lift: Transform;
  readonly packingLift: Transform;
  readonly packingScissor: readonly [Mesh, Mesh];
  readonly wheels: readonly Transform[];
  readonly customer: Transform;
  readonly legs: readonly Transform[];
  readonly arms: readonly CustomerArm[];
  readonly cargoDoor: Mesh;
  readonly orderSlip: Transform;
  readonly trackingPin: Mesh;
  readonly careLights: readonly Mesh[];
  readonly careCheck: Transform;
  readonly indicators: ReadonlyMap<OrderStage, Mesh>;
  readonly parcel: Transform;
  readonly card: Transform;
  readonly check: Transform;
  readonly doors: readonly Transform[];
  readonly label: Transform;
  readonly van: Transform;
  readonly dispose: () => void;
} {
  const world = new Transform();
  const box = new Box(gl);
  const tyre = new Cylinder(gl, { radiusTop: .22, radiusBottom: .22, height: .14, radialSegments: 16 });
  const paints = new Map<Colour, Program>();

  function paint(colour: Colour): Program {
    const existing = paints.get(colour);
    if (existing !== undefined) return existing;
    const material = new Program(gl, { vertex: VERTEX, fragment: FRAGMENT, uniforms: { uColour: { value: PALETTE[colour] } } });
    paints.set(colour, material);
    return material;
  }

  function solid(parent: Transform, colour: Colour, position: Vector, size: Vector): Mesh {
    const item = new Mesh(gl, { geometry: box, program: paint(colour) });
    item.position.set(...position);
    item.scale.set(...size);
    item.setParent(parent);
    return item;
  }

  const platformRear = -3.53;
  const platformFront = LOADING_LANE + 1.07;
  const platformDepth = platformFront - platformRear;
  const platformCenter = (platformFront + platformRear) / 2;
  solid(world, "ink", [0, -.36, platformCenter], [12.22, .44, platformDepth]);
  solid(world, "slate", [0, -.10, platformCenter], [12.22, .16, platformDepth]);
  solid(world, "gold", [0, -.23, platformFront + .001], [12.06, .055, .027]);
  solid(world, "gold", [6.112, -.23, platformCenter], [.027, .055, platformDepth - .15]);
  solid(world, "rubber", [0, .004, LOADING_LANE], [11.94, .045, 1.16]);
  for (const offset of [-.60, .61]) {
    solid(world, "line", [0, .024, LOADING_LANE + offset], [11.9, .018, .034]);
  }
  for (const x of [-5.6, -4.7, -3.8, -2.9, -2, -1.1, -.2, .7, 1.6, 2.5, 3.4, 4.3, 5.2]) {
    solid(world, "sand", [x, .03, LOADING_LANE + .41], [.35, .015, .037]);
  }

  solid(world, "rubber", [.55, .02, -.14], [10.03, .06, .72]);
  solid(world, "rubber", [5.28, .021, .47], [.72, .06, 1.94]);
  for (const z of [-.48, .20]) {
    solid(world, "teal", [.54, .072, z], [10.02, .09, .073]);
  }
  for (const x of [4.94, 5.62]) {
    solid(world, "teal", [x, .073, .50], [.075, .09, 1.85]);
  }
  for (let x = -4.37; x < 5.25; x += .24) {
    solid(world, "line", [x, .059, -.14], [.11, .038, .60]);
  }
  for (let z = .21; z < 1.29; z += .23) {
    solid(world, "line", [5.28, .058, z], [.59, .038, .11]);
  }

  const indicators = new Map<OrderStage, Mesh>();
  for (const { id } of ECOMMERCE_ORDER_STEPS) {
    const [x, z] = STATIONS[id];
    const front = z + (id === "delivery" ? .76 : .91);
    solid(world, "ink", [x, .05, front], [.71, .12, .22]);
    indicators.set(id, solid(world, "mint", [x, .12, front], [.48, .045, .079]));
  }

  const catalog = assembly(world, STATIONS.catalog[0], 0, STATIONS.catalog[1]);
  solid(catalog, "teal", [0, 1.0, -.45], [1.92, 1.96, .16]);
  for (const x of [-.9, .9]) solid(catalog, "teal", [x, 1.0, 0], [.14, 1.98, .9]);
  for (const y of [.16, .74, 1.33, 2.0]) solid(catalog, "sand", [0, y, 0], [1.92, .094, .88]);
  for (const [x, y, colour] of [[-.5, .38, "gold"], [.27, .38, "paper"], [-.5, .94, "teal"], [.44, .94, "kraft"], [-.42, 1.54, "mint"]] as const) {
    solid(catalog, colour, [x, y, .10], [.39, .33, .46]);
  }
  for (const y of [.20, .78, 1.37]) {
    solid(catalog, "paper", [-.34, y, .461], [.32, .06, .03]);
    solid(catalog, "ink", [-.34, y, .48], [.15, .022, .012]);
  }
  solid(catalog, "paper", [0, 2.12, .33], [1.77, .16, .18]);
  for (const [index, height] of [.06, .11, .08, .11, .06].entries()) {
    solid(catalog, "teal", [-.56 + index * .13, 2.12, .431], [.052, height, .025]);
  }
  const lift = assembly(world, ...LIFT_DOCK);
  solid(world, "teal", [-3.39, .86, .38], [.12, 1.78, .16]);
  solid(world, "sand", [-3.39, .05, .38], [.32, .12, .28]);
  solid(lift, "teal", [0, -.008, .19], [.44, .084, .19]);
  for (const x of [-.12, .12]) {
    solid(lift, "gold", [x, 0, -.10], [.085, .045, .73]);
  }

  // The storefront uses the BrandBasket awning colours and a window facing the order track.
  const shop = assembly(world, STATIONS.storefront[0], 0, STATIONS.storefront[1]);
  solid(shop, "teal", [0, .74, 0], [2.36, 1.48, 1.68]);
  solid(shop, "ink", [0, 1.58, 0], [2.51, .17, 1.81]);
  solid(shop, "sand", [0, 1.69, .71], [2.34, .10, .25]);
  for (const x of [-1.05, 1.05]) solid(shop, "paper", [x, .76, .92], [.07, 1.24, .12]);
  solid(shop, "gold", [.67, .25, 1.01], [.44, .06, .18]);
  for (const [x, colour] of [[-.76, "mint"], [-.49, "gold"], [-.23, "paper"]] as const) {
    solid(shop, colour, [x, .90, 1.01], [.16, .17, .075]);
  }
  solid(shop, "sand", [0, .08, .93], [2.49, .15, .21]);
  solid(shop, "ink", [-.44, .78, .86], [1.26, .87, .13]);
  solid(shop, "glass", [-.44, .78, .94], [1.1, .7, .05]);
  solid(shop, "ink", [.72, .63, .86], [.57, 1.12, .15]);
  solid(shop, "gold", [.86, .55, .963], [.075, .075, .07]);
  const awning = assembly(shop, 0, 1.4, .76);
  for (const [index, x] of [-1, -.67, -.34, 0, .34, .67, 1].entries()) {
    const stripe = solid(awning, index % 2 === 0 ? "gold" : "paper", [x, -.14, .27], [.34, .10, .57]);
    stripe.rotation.x = .30;
  }
  solid(shop, "kraft", [-.5, .63, .99], [.34, .29, .15]);
  solid(shop, "paper", [-.5, .63, 1.08], [.045, .29, .022]);

  const terminal = assembly(world, STATIONS.checkout[0], 0, STATIONS.checkout[1]);
  solid(terminal, "teal", [0, .13, 0], [1.68, .26, 1.22]);
  solid(terminal, "ink", [0, .72, -.12], [.24, 1.17, .34]);
  solid(terminal, "teal", [0, 1.37, 0], [1.62, .99, .2]);
  solid(terminal, "ink", [0, 1.37, .115], [1.43, .81, .055]);
  solid(terminal, "mint", [0, .68, .14], [.8, .05, .1]);
  solid(terminal, "slate", [.13, .82, .44], [.55, .16, .42]);
  solid(terminal, "glass", [.13, .91, .44], [.39, .036, .22]);
  for (const x of [-.45, -.28, -.11]) solid(terminal, "glass", [x, 1.64, .151], [.09, .08, .023]);
  const check = assembly(terminal, .03, 1.34, .16);
  solid(check, "mint", [-.15, -.03, 0], [.25, .09, .05]).rotation.z = -.74;
  solid(check, "mint", [.075, .01, 0], [.43, .09, .05]).rotation.z = .79;
  const card = assembly(terminal, .13, .38, 1.48);
  solid(card, "gold", [0, 0, 0], [.55, .34, .065]);
  solid(card, "paper", [-.13, .02, .046], [.12, .09, .025]);
  solid(card, "ink", [.12, -.08, .044], [.17, .045, .022]);

  const orders = assembly(world, STATIONS.orders[0], 0, STATIONS.orders[1]);
  solid(orders, "teal", [0, .21, 0], [1.85, .42, 1.15]);
  solid(orders, "sand", [0, .46, 0], [1.95, .14, 1.21]);
  solid(orders, "ink", [-.32, .72, -.14], [.27, .48, .29]);
  solid(orders, "teal", [-.28, 1.17, -.16], [1.25, .88, .20]);
  solid(orders, "slate", [-.28, 1.17, -.045], [1.10, .72, .045]);
  for (const y of [.96, 1.13, 1.30]) {
    solid(orders, "mint", [-.68, y, -.014], [.09, .077, .025]);
    solid(orders, "paper", [-.28, y, -.013], [.57, .045, .022]);
  }
  solid(orders, "ink", [.59, .61, .31], [.59, .27, .48]);
  solid(orders, "glass", [.59, .71, .554], [.41, .045, .025]);
  solid(orders, "teal", [-.30, .55, .36], [.79, .06, .25]);
  for (const x of [-.54, -.37, -.20, -.03]) solid(orders, "sand", [x, .586, .37], [.10, .014, .10]);
  const orderSlip = assembly(orders, .59, .75, .42);
  solid(orderSlip, "paper", [0, 0, 0], [.36, .05, .48]);
  solid(orderSlip, "slate", [0, .03, .09], [.23, .012, .034]);

  const packing = assembly(world, STATIONS.packing[0], 0, STATIONS.packing[1]);
  for (const x of [-.75, .75]) {
    for (const z of [-.4, .4]) solid(packing, "teal", [x, .44, z], [.16, .88, .16]);
  }
  solid(packing, "sand", [0, .94, 0], [1.92, .17, 1.36]);
  solid(packing, "slate", [0, .32, 0], [1.63, .1, .9]);
  solid(packing, "glass", [0, 1.029, 0], [.80, .025, .79]);
  solid(packing, "teal", [-.67, 1.18, -.39], [.37, .31, .29]);
  solid(packing, "paper", [-.67, 1.35, -.39], [.30, .039, .24]);
  for (const z of [-.43, -.29]) solid(packing, "kraft", [.59, 1.09, z], [.42, .12, .12]);

  // A lift table lines up with the sorter and then the packing bench.
  solid(world, "teal", [5.28, .055, 1.03], [.77, .12, .78]);
  const packingScissor = [
    solid(world, "sand", [5.28, .08, .81], [.11, .14, .095]),
    solid(world, "sand", [5.28, .08, .81], [.11, .14, .095]),
  ] as const;
  const packingLift = assembly(world, 5.28, .055, 1.03);
  solid(packingLift, "teal", [0, -.012, 0], [.76, .06, .73]);
  for (const z of [-.24, -.12, 0, .12, .24]) solid(packingLift, "line", [0, .020, z], [.61, .024, .076]);

  // Align the chute with the parcel's route from the packing bench to the road.
  const { start: rampStart, end: rampEnd } = DISPATCH_RAMP;
  const rampDrop = rampStart[1] - rampEnd[1];
  const rampRun = rampEnd[2] - rampStart[2];
  const rampLength = Math.hypot(rampDrop, rampRun);
  const chute = assembly(world, rampStart[0], (rampStart[1] + rampEnd[1]) / 2 - .28, (rampStart[2] + rampEnd[2]) / 2);
  chute.rotation.x = Math.atan2(rampDrop, rampRun);
  solid(chute, "teal", [0, -.037, 0], [.76, .08, rampLength]);
  for (const x of [-.37, .37]) solid(chute, "sand", [x, .029, 0], [.05, .085, rampLength]);
  for (let index = 1; index < 12; index++) {
    solid(chute, "line", [0, .016, rampLength * (index / 12 - .5)], [.68, .044, .075]);
  }
  solid(world, "sand", [3.95, .405, LOADING_LANE], [.65, .07, .7]);

  const label = assembly(world, 3.41, 1.05, .72);
  solid(label, "paper", [0, 0, 0], [.31, .025, .23]);
  for (const x of [-.096, -.066, -.031, .005]) solid(label, "ink", [x, .015, .025], [.013, .008, .105]);
  solid(label, "ink", [.07, .015, -.044], [.075, .008, .022]);

  const parcel = assembly(world, ...PARCEL_SHELF);
  solid(parcel, "kraft", [0, -.212, 0], [.59, .056, .5]);
  for (const x of [-.27, .27]) solid(parcel, "kraft", [x, -.006, 0], [.05, .407, .50]);
  for (const z of [-.229, .229]) solid(parcel, "kraft", [0, -.006, z], [.50, .407, .045]);
  solid(parcel, "mint", [0, -.036, 0], [.48, .30, .39]);
  solid(parcel, "paper", [0, .118, 0], [.058, .015, .38]);
  solid(parcel, "paper", [0, -.013, .257], [.075, .40, .025]);
  const leftFlap = assembly(parcel, -.295, .24, 0);
  const rightFlap = assembly(parcel, .295, .24, 0);
  solid(leftFlap, "gold", [.147, 0, 0], [.294, .037, .5]);
  solid(rightFlap, "gold", [-.147, 0, 0], [.294, .037, .5]);

  const tracking = assembly(world, 1.18, 0, 1.52);
  solid(tracking, "teal", [0, .14, 0], [1.40, .28, .80]);
  solid(tracking, "ink", [0, .53, -.14], [.18, .66, .24]);
  solid(tracking, "teal", [0, .97, -.14], [1.12, .7, .18]);
  solid(tracking, "ink", [0, .97, -.034], [1.00, .57, .048]);
  solid(tracking, "glass", [-.22, .91, 0], [.39, .16, .02]).rotation.z = -.25;
  solid(tracking, "glass", [.18, 1.04, 0], [.42, .15, .02]).rotation.z = .26;
  const trackingPin = solid(tracking, "mint", [-.36, .89, .032], [.10, .10, .04]);

  const van = assembly(world, STATIONS.delivery[0], 0, STATIONS.delivery[1]);
  van.rotation.y = Math.PI;
  solid(van, "ink", [0, .29, 0], [1.96, .21, .91]);
  solid(van, "teal", [-.32, 1.21, 0], [1.34, .09, .89]);
  solid(van, "teal", [.33, .76, 0], [.09, .85, .89]);
  for (const z of [-.40, .40]) solid(van, "teal", [-.32, .78, z], [1.34, .82, .09]);
  const cargoDoor = solid(van, "glass", [-1.0, .78, 0], [.07, .78, .74]);
  solid(van, "sand", [-.32, .37, 0], [1.34, .07, .82]);
  for (const side of [-1, 1]) {
    solid(van, "paper", [-.35, .89, side * .453], [.99, .45, .026]);
    solid(van, "kraft", [-.57, .88, side * .474], [.18, .22, .021]);
    solid(van, "gold", [-.57, .99, side * .474], [.19, .045, .023]);
    solid(van, "teal", [-.24, .92, side * .474], [.32, .046, .022]);
    solid(van, "teal", [-.29, .83, side * .474], [.22, .035, .022]);
    solid(van, "red", [-.97, .52, side * .449], [.11, .13, .05]);
  }
  solid(van, "paper", [-.45, 1.26, 0], [.47, .033, .47]);
  solid(van, "gold", [-.45, 1.28, 0], [.25, .02, .19]);
  solid(van, "teal", [.68, .57, 0], [.68, .57, .91]);
  solid(van, "glass", [.71, .94, 0], [.5, .25, .76]);
  solid(van, "paper", [1.03, .49, .27], [.06, .13, .19]);
  solid(van, "paper", [1.03, .49, -.27], [.06, .13, .19]);
  const wheels: Transform[] = [];
  for (const x of [-.64, .63]) {
    for (const z of [-.45, .45]) {
      const hub = assembly(van, x, .24, z);
      const wheel = new Mesh(gl, { geometry: tyre, program: paint("rubber") });
      wheel.rotation.x = Math.PI / 2;
      wheel.setParent(hub);
      solid(hub, "sand", [0, 0, Math.sign(z) * .073], [.21, .21, .025]);
      solid(hub, "teal", [0, 0, Math.sign(z) * .09], [.08, .08, .018]);
      wheels.push(hub);
    }
  }

  const entrance = assembly(world, -4.65, 0, CUSTOMER_POSITION[2] - .92);
  solid(entrance, "sand", [.35, .045, .35], [2.64, .11, 1.61]);
  solid(entrance, "paper", [-.16, .89, -.18], [1.53, 1.71, .39]);
  solid(entrance, "teal", [-.24, .77, .034], [.61, 1.26, .09]);
  solid(entrance, "glass", [-.24, 1.07, .086], [.43, .38, .045]);
  solid(entrance, "gold", [-.04, .68, .104], [.074, .095, .048]);
  solid(entrance, "ink", [-.16, 1.76, -.14], [1.66, .14, .63]);
  solid(entrance, "gold", [-.16, 1.70, .193], [1.62, .085, .084]);
  solid(entrance, "teal", [.49, .34, .28], [.24, .26, .25]);
  solid(entrance, "mint", [.49, .51, .28], [.22, .24, .19]);
  solid(entrance, "ink", [-.21, .112, .47], [.70, .035, .35]);

  const customer = assembly(world, ...CUSTOMER_POSITION);
  solid(customer, "paper", [0, .91, 0], [.43, .57, .26]);
  solid(customer, "gold", [0, .92, .138], [.32, .075, .027]);
  solid(customer, "skin", [0, 1.23, .012], [.15, .17, .16]);
  solid(customer, "skin", [0, 1.42, .014], [.32, .32, .29]);
  solid(customer, "ink", [0, 1.58, -.01], [.35, .13, .32]);
  solid(customer, "ink", [0, 1.48, -.128], [.35, .19, .08]);
  const legs = [-1, 1].map((side): Transform => {
    solid(customer, "ink", [side * .079, 1.448, .169], [.039, .036, .018]);
    const leg = assembly(customer, side * .117, .65, 0);
    solid(leg, "teal", [0, -.28, 0], [.17, .56, .19]);
    solid(leg, "ink", [0, -.577, .071], [.19, .14, .31]);
    return leg;
  });
  const arms = [-1, 1].map((side): CustomerArm => ({
    side,
    upper: solid(customer, "paper", [0, 0, 0], [.13, .13, .24]),
    lower: solid(customer, "skin", [0, 0, 0], [.105, .107, .23]),
    hand: solid(customer, "skin", [0, 0, 0], [.135, .12, .15]),
  }));

  const care = assembly(world, STATIONS.care[0], 0, STATIONS.care[1]);
  const careLights: Mesh[] = [];
  for (const x of [-.55, .13, .81]) {
    const h = x < 0 ? .88 : x < .5 ? 1.12 : .78;
    solid(care, "teal", [x, h / 2, 0], [.57, h, .68]);
    solid(care, "ink", [x, h / 2, .35], [.46, h * .81, .07]);
    solid(care, "sand", [x, h - .18, .4], [.25, .048, .038]);
    for (const y of [.25, .40]) careLights.push(solid(care, "mint", [x + .11, y, .401], [.082, .07, .034]));
  }
  solid(care, "sand", [.10, .045, .02], [2.14, .10, .94]);
  for (const x of [-.55, .13, .81]) {
    for (const y of [.53, .64]) solid(care, "glass", [x, y, .397], [.30, .038, .035]);
  }
  const shield = assembly(care, -.79, 1.05, .15);
  solid(shield, "gold", [-.13, 0, 0], [.15, .64, .12]).rotation.z = -.23;
  solid(shield, "gold", [.13, 0, 0], [.15, .64, .12]).rotation.z = .23;
  solid(shield, "gold", [0, .30, 0], [.42, .1, .12]);
  solid(shield, "gold", [0, -.30, 0], [.21, .09, .12]);
  const careCheck = assembly(shield, 0, .035, .091);
  solid(careCheck, "mint", [-.08, -.045, 0], [.17, .056, .044]).rotation.z = -.69;
  solid(careCheck, "mint", [.046, -.013, 0], [.25, .056, .044]).rotation.z = .77;

  return {
    world, awning, lift, packingLift, packingScissor, wheels, customer, legs, arms, cargoDoor, orderSlip, trackingPin, careLights, careCheck, indicators, parcel, card, check, doors: [leftFlap, rightFlap], label, van,
    dispose() {
      tyre.remove();
      box.remove();
      for (const material of paints.values()) material.remove();
    },
  };
}

/** The stationary workshop defines the frame. Measure it once so playback can keep the camera still. */
function workshopViewBounds(world: Transform, camera: Camera): OrderViewBounds {
  camera.updateMatrixWorld();
  world.updateMatrixWorld();
  const corner = new Vec3();
  let left = Infinity;
  let right = -Infinity;
  let bottom = Infinity;
  let top = -Infinity;

  world.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    if (!node.geometry.bounds) node.geometry.computeBoundingBox();
    const { min, max } = node.geometry.bounds;
    for (const x of [min.x, max.x]) {
      for (const y of [min.y, max.y]) {
        for (const z of [min.z, max.z]) {
          corner.set(x, y, z).applyMatrix4(node.worldMatrix).applyMatrix4(camera.viewMatrix);
          left = Math.min(left, corner.x);
          right = Math.max(right, corner.x);
          bottom = Math.min(bottom, corner.y);
          top = Math.max(top, corner.y);
        }
      }
    }
  });

  return { left, right, bottom, top };
}

export function createOrderScene(canvas: HTMLCanvasElement, host: HTMLElement): OrderScene {
  const renderer = new Renderer({ canvas, width: 1, height: 1, dpr: Math.min(devicePixelRatio || 1, 1.5), alpha: true, antialias: true });
  const gl = renderer.gl;
  if (!gl) throw new Error("WebGL is unavailable for the order scene.");
  const camera = new Camera(gl, { near: .1, far: 60 });
  const target = new Vec3(0, .44, .20);
  camera.position.set(2.8, 16.44, 16.20);
  // Keep the camera's vertical axis perpendicular to the long edge of the base.
  camera.up.set(0, camera.position.z - target.z, target.y - camera.position.y).normalize();
  camera.lookAt(target);
  const workshop = buildWorkshop(gl);
  const bounds = workshopViewBounds(workshop.world, camera);
  let stage: OrderStage = "catalog";
  let playhead = 0;
  let frame = 0;
  const shoulder = new Vec3();
  const elbow = new Vec3();
  const durations = ECOMMERCE_ORDER_STEPS.map(({ duration }) => duration);

  function draw(): void {
    if (gl.isContextLost()) return;
    const { awning, lift, packingLift, packingScissor, wheels, customer, legs, arms, cargoDoor, orderSlip, trackingPin, careLights, careCheck, indicators, parcel, card, check, doors, label, van, world } = workshop;
    const pose = sampleOrderMotion(playhead);
    for (const [key, indicator] of indicators) {
      indicator.visible = key === stage;
    }
    parcel.position.set(...pose.parcel);
    lift.position.set(...pose.lift);
    packingLift.position.y = pose.packingLift;
    const liftTravel = pose.packingLift - .055;
    const strutLength = Math.hypot(liftTravel, .55);
    const strutAngle = Math.atan2(.55, liftTravel);
    for (const [index, strut] of packingScissor.entries()) {
      strut.position.y = .075 + liftTravel / 2;
      strut.scale.y = strutLength;
      strut.rotation.z = index === 0 ? strutAngle : -strutAngle;
    }
    awning.rotation.x = pose.awning;
    card.position.set(...pose.card);
    card.rotation.x = pose.cardTilt;
    check.visible = pose.confirmation > 0;
    check.scale.set(pose.confirmation, pose.confirmation, pose.confirmation);
    orderSlip.position.z = pose.receipt;
    doors[0].rotation.z = pose.flaps;
    doors[1].rotation.z = -pose.flaps;
    label.position.set(
      3.41 + (pose.parcel[0] - 3.41) * pose.label,
      1.065 + (pose.parcel[1] + .269 - 1.065) * pose.label + Math.sin(Math.PI * pose.label) * .37,
      .72 + (pose.parcel[2] - .72) * pose.label,
    );
    customer.position.z = CUSTOMER_POSITION[2] + pose.customerStep;
    const stride = Math.sin(pose.customerStep / .4 * Math.PI) * .30;
    for (const [index, leg] of legs.entries()) leg.rotation.x = index === 0 ? stride : -stride;
    for (const { side, upper, lower, hand } of arms) {
      const reach = pose.customerReach;
      shoulder.set(side * .245, 1.08, .018);
      elbow.set(side * (.29 + reach * .03), .80 + reach * .085, .035 + reach * .16);
      const grip = hand.position.set(side * (.30 + reach * .013), .62 + reach * .31, .07 + reach * .35);
      alignLimb(upper, shoulder, elbow);
      alignLimb(lower, elbow, grip);
    }
    van.position.x = pose.van;
    cargoDoor.scale.y = .78 - pose.cargoDoor * .75;
    cargoDoor.position.y = 1.17 - cargoDoor.scale.y / 2;
    for (const wheel of wheels) wheel.rotation.z = (VAN_BAY - pose.van) / .22;
    trackingPin.position.set(...pose.trackingPin);
    const careProgress = smoothstep((playhead - 6.30) / .32);
    careCheck.visible = careProgress > 0;
    careCheck.scale.set(careProgress, careProgress, careProgress);
    for (const [index, light] of careLights.entries()) {
      light.scale.x = .034 + .048 * smoothstep((playhead - 6 - index * .1) / .22);
    }

    renderer.render({ scene: world, camera });
  }

  function resize(): void {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height);
    camera.orthographic(fitOrderScene(bounds, width / height));
    draw();
  }

  function freeze(): void {
    cancelAnimationFrame(frame);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return {
    show(next, animate) {
      freeze();
      stage = next;
      const index = ECOMMERCE_ORDER_STEPS.findIndex(({ id }) => id === next);
      const target = index + (next === "catalog" ? 0 : .98);
      if (!animate) {
        playhead = target;
        draw();
        return;
      }
      const origin = playhead;
      const duration = Math.min(1650, 420 + Math.abs(target - origin) * 190);
      const start = performance.now();
      const tick = (now: number): void => {
        const progress = (now - start) / duration;
        playhead = origin + (target - origin) * smoothstep(progress);
        draw();
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    },
    play(onStage, onEnd) {
      freeze();
      if (playhead >= durations.length) playhead = 0;
      let index = -1;
      const start = performance.now() - orderPlaybackElapsed(playhead, durations);
      const tick = (now: number): void => {
        const elapsed = now - start;
        const pose = orderPlaybackFrame(elapsed, durations);
        playhead = pose.time;
        if (pose.index !== index) {
          index = pose.index;
          stage = ECOMMERCE_ORDER_STEPS[index].id;
          onStage(index);
        }
        host.style.setProperty("--order-progress", String(pose.time / durations.length));
        draw();
        if (pose.done) onEnd();
        else frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    },
    freeze,
    dispose() {
      freeze();
      observer.disconnect();
      workshop.dispose();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
