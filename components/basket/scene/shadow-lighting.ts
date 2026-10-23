import { Camera, Mesh, Plane, Program, Shadow, type OGLRenderingContext, type Transform } from "ogl";
import { L, SHADOW } from "./materials";
import { GROUND_SHADOW_FRAG, SHADOW_MAP_SIZE, VERT } from "./shaders";

/** Cast/receive shadows from the same upper-left key light used by the material shaders. */
export function createShadowLighting(gl: OGLRenderingContext, scene: Transform, basket: Transform): () => void {
  const light = new Camera(gl, { left: -3.8, right: 3.8, bottom: -3.8, top: 3.8, near: 0.1, far: 20 });
  const direction = L.uKeyDir.value;
  light.position.set(direction[0] * 8, 1.15 + direction[1] * 8, direction[2] * 8);
  light.lookAt([0, 1.15, 0]);
  const shadows = new Shadow(gl, { light, width: SHADOW_MAP_SIZE, height: SHADOW_MAP_SIZE });
  // Packed depth must be compared per texel; interpolating its RGBA channels corrupts depth.
  shadows.target.texture.minFilter = gl.NEAREST;
  shadows.target.texture.magFilter = gl.NEAREST;
  shadows.target.texture.needsUpdate = true;
  shadows.target.texture.update();
  basket.traverse((node) => {
    if (node instanceof Mesh) shadows.add({ mesh: node });
  });

  const ground = new Mesh(gl, {
    geometry: new Plane(gl, { width: 8, height: 8 }),
    program: new Program(gl, {
      vertex: VERT,
      fragment: GROUND_SHADOW_FRAG,
      transparent: true,
      depthWrite: false,
      cullFace: null,
      uniforms: { uTint: { value: SHADOW.tint } },
    }),
    renderOrder: -1,
  });
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.045;
  ground.setParent(scene);
  shadows.add({ mesh: ground, cast: false });

  // Rendered with every frame: the main pass compares each pixel's current position with this map, so a map one
  // frame behind shadows a moving tile with its own old position and the surface flickers.
  return (): void => {
    // Empty depth texels represent the far plane, not a blocker at depth zero.
    gl.clearColor(1, 1, 1, 1);
    try {
      shadows.render({ scene });
    } finally {
      gl.clearColor(0, 0, 0, 0);
    }
  };
}
