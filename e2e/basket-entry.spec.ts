import { expect, test } from "@playwright/test";
import { BASKET_STORAGE_KEY } from "@/lib/basket-store";

interface EntryFrame {
  readonly opacity: number;
  readonly y: number;
  readonly poster: number;
}
interface EntryState {
  frames: EntryFrame[];
  /** The canvas halfway through its entrance animation, read by seeking the animation rather than by waiting for a frame. */
  midpoint?: Omit<EntryFrame, "poster">;
  draws: number[];
  duringEntrance: number[];
}

declare global {
  interface Window {
    basketEntry: EntryState;
    basketRecovery: number[];
  }
}

for (const route of ["/", "/pricing"]) {
  for (const saved of [false, true]) {
    test(`${route} lifts the basket into view before dropping tiles${saved ? " with saved plans" : ""}`, async ({ page }) => {
      await page.addInitScript(({ saved, key }) => {
        if (saved) localStorage.setItem(key, JSON.stringify(["website", "growth", "search"]));
        const state: EntryState = { frames: [], draws: [], duringEntrance: [] };
        window.basketEntry = state;
        const prototype = WebGL2RenderingContext.prototype;
        const bind = prototype.bindFramebuffer;
        const clear = prototype.clear;
        const draw = prototype.drawElements;
        let offscreen = false;
        let draws = 0;
        prototype.bindFramebuffer = function (target, buffer) {
          offscreen = buffer !== null;
          bind.call(this, target, buffer);
        };
        prototype.clear = function (mask) {
          if (!offscreen && (mask & this.COLOR_BUFFER_BIT) !== 0) {
            if (draws > 0) {
              state.draws.push(draws);
              const canvas = document.querySelector(".basket-stage canvas");
              if (canvas?.getAnimations().some((animation) => animation.playState === "running")) state.duringEntrance.push(draws);
            }
            draws = 0;
          }
          clear.call(this, mask);
        };
        prototype.drawElements = function (mode, count, type, offset) {
          if (!offscreen) draws++;
          draw.call(this, mode, count, type, offset);
        };
        // On a slow runner (software WebGL) the page may not draw once during the 650 ms entrance, so the halfway state is read by seeking the real animation.
        document.addEventListener("animationstart", (event) => {
          const canvas = event.target;
          if (!(canvas instanceof HTMLCanvasElement)) return;
          const animation = canvas.getAnimations().find((candidate): candidate is CSSAnimation => candidate instanceof CSSAnimation && candidate.animationName === "basket-arrive");
          const duration = animation?.effect?.getComputedTiming().duration;
          if (!animation || typeof duration !== "number") return;
          animation.pause();
          animation.currentTime = duration / 2;
          const style = getComputedStyle(canvas);
          state.midpoint = { opacity: Number(style.opacity), y: new DOMMatrixReadOnly(style.transform).m42 };
          animation.currentTime = 0;
          animation.play();
        }, true);
        function sample(): void {
          const stage = document.querySelector(".basket-stage");
          const canvas = stage?.querySelector("canvas");
          const poster = stage?.querySelector("img");
          if (canvas && poster) {
            const style = getComputedStyle(canvas);
            state.frames.push({
              opacity: Number(style.opacity),
              y: new DOMMatrixReadOnly(style.transform).m42,
              poster: Number(getComputedStyle(poster).opacity),
            });
          }
          requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      }, { saved, key: BASKET_STORAGE_KEY });
      await page.goto(route);
      const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
      await stage.scrollIntoViewIfNeeded();
      await expect(stage.locator("canvas")).toHaveCSS("opacity", "1", { timeout: 20_000 });
      await expect.poll(() => stage.locator("canvas").evaluate((canvas) => new DOMMatrixReadOnly(getComputedStyle(canvas).transform).isIdentity)).toBe(true);
      await expect.poll(() => page.evaluate(() => {
        const draws = window.basketEntry.draws;
        return Math.max(...draws) - draws[0];
      }), { timeout: 20_000 }).toBeGreaterThan(0);
      const state = await page.evaluate(() => window.basketEntry);
      expect(state.midpoint !== undefined && state.midpoint.opacity > 0 && state.midpoint.opacity < 1 && state.midpoint.y > 0, "the basket itself must rise and fade into view").toBe(true);
      expect(state.frames.every((frame) => frame.poster === 0), "the entrance must never overlap a poster with the live canvas").toBe(true);
      expect(state.duringEntrance.length).toBeGreaterThan(0);
      expect(new Set(state.duringEntrance).size, "tiles must wait until the basket has arrived").toBe(1);
      for (let i = 1; i < state.frames.length; i++) {
        expect(state.frames[i].opacity).toBeGreaterThanOrEqual(state.frames[i - 1].opacity - 0.01);
        expect(state.frames[i].y).toBeGreaterThanOrEqual(0);
      }
    });
  }

  test(`${route} reserves its layout while live assets load`, async ({ page }) => {
    let release: (() => void) | undefined;
    const ready = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/basket/studio-house.avif", async (route) => {
      await ready;
      await route.continue();
    });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
    await stage.scrollIntoViewIfNeeded();
    const before = await stage.boundingBox();
    await expect(stage.locator("img")).toHaveCSS("opacity", "0");
    await expect(stage.locator("canvas")).toHaveCount(0);
    release?.();
    await expect(stage.locator("canvas")).toHaveCSS("opacity", "1", { timeout: 20_000 });
    expect(await stage.boundingBox()).toEqual(before);
  });
}

test("a reclaimed WebGL context shows a decoded fallback and rebuilds the basket", async ({ page }) => {
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator("canvas")).toHaveCSS("opacity", "1", { timeout: 20_000 });
  await stage.evaluate((element) => {
    window.basketRecovery = [];
    let lost = false;
    function sample(): void {
      const canvas = element.querySelector("canvas");
      const poster = element.querySelector("img");
      if (!canvas) lost = true;
      if (lost && canvas && poster && element.getAttribute("data-live") === "true") {
        window.basketRecovery.push(Number(getComputedStyle(canvas).opacity) + Number(getComputedStyle(poster).opacity));
      }
      if (window.basketRecovery.length < 10) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await stage.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("WebGL context loss is unavailable in this browser");
    extension.loseContext();
  });
  await expect(stage.locator("img")).toHaveCSS("opacity", "1");
  await expect.poll(() => stage.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage.locator("canvas")).toHaveCSS("opacity", "1", { timeout: 20_000 });
  await expect(stage.locator("img")).toHaveCSS("opacity", "0");
  await expect.poll(() => page.evaluate(() => window.basketRecovery.length)).toBeGreaterThan(3);
  expect(Math.min(...await page.evaluate(() => window.basketRecovery)), "recovery must not replay the fade and expose blank frames").toBeGreaterThanOrEqual(0.99);
});

test("a slow static fallback stays hidden until its image is decoded", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "deviceMemory", { value: 4 }); });
  let release: (() => void) | undefined;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/basket/woven-basket-hero.avif", async (route) => {
    await ready;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await expect(stage.locator("img")).toHaveCSS("opacity", "0");
  release?.();
  await expect(stage.locator("img")).toHaveCSS("opacity", "1");
  expect(await stage.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(stage.locator("canvas")).toHaveCount(0);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the filled basket remains visible", async ({ page }) => {
    await page.goto("/");
    const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
    const poster = stage.locator("img:visible");
    await expect(poster).toHaveCount(1);
    await expect(poster).toHaveAttribute("src", "/basket/woven-basket-hero.avif");
  });
});
