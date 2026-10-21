// components/basket/scene/shaders.ts
/** Shared vertex shader: world position, world normal and uv for the lit and shadow programs. */
export const VERT = /* glsl */ `
attribute vec3 position; attribute vec3 normal; attribute vec2 uv;
uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; uniform mat4 modelMatrix;
uniform mat4 shadowProjectionMatrix; uniform mat4 shadowViewMatrix;
varying vec3 vN; varying vec2 vUv; varying vec3 vW; varying vec4 vLight;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vLight = shadowProjectionMatrix * shadowViewMatrix * w;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

/** OGL's packed RGBA depth, sampled with a soft 3x3 percentage-closer filter. */
const SHADOW_SAMPLE = /* glsl */ `
uniform sampler2D tShadow;
varying vec4 vLight;
float shadowAt(float bias, float radius) {
  vec3 p = vLight.xyz / vLight.w * 0.5 + 0.5;
  if (p.x <= 0.0 || p.x >= 1.0 || p.y <= 0.0 || p.y >= 1.0 || p.z <= 0.0 || p.z >= 1.0) return 0.0;
  float blocked = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec4 depthTexel = texture2D(tShadow, p.xy + vec2(float(x), float(y)) * radius / 1024.0);
      float depth = dot(depthTexel, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));
      blocked += step(depth + bias, p.z);
    }
  }
  return blocked / 9.0;
}`;

/** Key light with cast shadows, hemisphere fill, interior occlusion and ACES tone mapping. */
export const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tMap; uniform float uUseMap; uniform vec3 uColor; uniform vec2 uRepeat;
uniform float uRough; uniform float uInterior; uniform float uRelief; uniform vec3 cameraPosition;
uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uSky; uniform vec3 uGround; uniform vec3 uRimCol; uniform float uExposure;
varying vec3 vN; varying vec2 vUv; varying vec3 vW;
${SHADOW_SAMPLE}
vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main() {
  vec3 n = normalize(vN);
  bool inside = !gl_FrontFacing;
  if (inside) n = -n;
  if (uRelief > 0.0) {
    vec2 uv = vUv * uRepeat;
    float left = dot(texture2D(tMap, uv - vec2(0.002, 0.0)).rgb, vec3(0.333));
    float right = dot(texture2D(tMap, uv + vec2(0.002, 0.0)).rgb, vec3(0.333));
    float below = dot(texture2D(tMap, uv - vec2(0.0, 0.002)).rgb, vec3(0.333));
    float above = dot(texture2D(tMap, uv + vec2(0.0, 0.002)).rgb, vec3(0.333));
    vec3 tangent = vec3(-n.z, 0.0, n.x);
    tangent /= max(length(tangent), 0.001);
    n = normalize(n - uRelief * ((right - left) * tangent + (above - below) * cross(tangent, n)));
  }
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
  bool cavity = uInterior > 1.5 || inside;
  if (uInterior > 0.5 && cavity) ao = mix(0.32, 0.88, smoothstep(0.0, 1.45, vW.y));
  if (uInterior > 0.5 && !cavity) ao = mix(0.7, 1.0, smoothstep(0.0, 0.5, vW.y));
  float shade = 1.0 - shadowAt(0.0006 + 0.0012 * (1.0 - ndl), 2.0) * 0.82;
  vec3 col = base * (hemi * 0.44 + uKeyCol * ndl * shade) * ao + uKeyCol * spec * shade * ao + uRimCol * fres * 0.08 * ao;
  col = aces(col * uExposure);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

/** Transparent receiver: only the basket's projected silhouette is composited onto the page. */
export const GROUND_SHADOW_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uTint;
varying vec2 vUv;
${SHADOW_SAMPLE}
void main() {
  float edge = 1.0 - smoothstep(0.7, 1.0, length((vUv - 0.5) * 2.0));
  gl_FragColor = vec4(uTint, shadowAt(0.0008, 8.0) * 0.24 * edge);
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
