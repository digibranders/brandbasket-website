// components/basket/scene/shaders.ts
/** Shared vertex shader: world position, world normal and uv for the lit and shadow programs. */
export const VERT = /* glsl */ `
attribute vec3 position; attribute vec3 normal; attribute vec2 uv;
uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; uniform mat4 modelMatrix;
varying vec3 vN; varying vec2 vUv; varying vec3 vW;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

/** Key light, hemisphere fill, rim, painted interior occlusion and ACES tone mapping. */
export const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tMap; uniform float uUseMap; uniform vec3 uColor; uniform vec2 uRepeat;
uniform float uRough; uniform float uInterior; uniform vec3 cameraPosition;
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uSky; uniform vec3 uGround; uniform vec3 uRimCol; uniform float uExposure;
varying vec3 vN; varying vec2 vUv; varying vec3 vW;
vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main() {
  vec3 n = normalize(vN);
  bool inside = !gl_FrontFacing;
  if (inside) n = -n;
  vec3 base = uUseMap > 0.5 ? toLinear(texture2D(tMap, vUv * uRepeat).rgb) : toLinear(uColor);
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(uKeyDir);
  float ndl = clamp((dot(n, L) + 0.25) / 1.25, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float shin = mix(10.0, 90.0, 1.0 - uRough);
  float spec = pow(max(dot(n, H), 0.0), shin) * (1.0 - uRough) * 0.55;
  vec3 hemi = mix(uGround, uSky, n.y * 0.5 + 0.5);
  float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
  float ao = 1.0;
  if (uInterior > 0.5 && inside) ao = mix(0.32, 0.88, smoothstep(0.0, 1.45, vW.y));
  if (uInterior > 0.5 && !inside) ao = mix(0.7, 1.0, smoothstep(0.0, 0.5, vW.y));
  vec3 col = base * (hemi * 0.48 + uKeyCol * ndl * 1.0) * ao + uKeyCol * spec * ao + uRimCol * fres * 0.35 * ao;
  col = aces(col * uExposure);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

/** Soft contact shadow, painted rather than computed. */
export const SHADOW_FRAG = /* glsl */ `
precision highp float;
uniform float uStrength; uniform vec3 uTint;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  p.x *= 0.92;
  float d = length(p);
  float soft = pow(1.0 - smoothstep(0.0, 1.0, d), 1.8);
  float core = 1.0 - smoothstep(0.0, 0.62, d);
  gl_FragColor = vec4(uTint, (soft * 0.55 + core * 0.45) * uStrength);
}`;
