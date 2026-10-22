// e2e/basket.spec.ts
import { expect, test } from "@playwright/test";
import { PRICING_PLANS } from "@/content/basket";
import { type BasketPick, firstPayment, formatInr, packageTotal, PLAN_IDS } from "@/lib/pricing";

test("the basket renders cast shadows as well as its main scene", async ({ page }) => {
  await page.addInitScript(() => {
    const state = { offscreenDraws: 0, shadowReceivers: 0, minFilter: 0, magFilter: 0 };
    (window as Window & { basketShadows?: typeof state }).basketShadows = state;
    const prototype = WebGL2RenderingContext.prototype;
    const bindFramebuffer = prototype.bindFramebuffer;
    const drawElements = prototype.drawElements;
    const getUniformLocation = prototype.getUniformLocation;
    const attachTexture = prototype.framebufferTexture2D;
    let shadowTexture: WebGLTexture | null = null;
    let offscreen = false;
    prototype.framebufferTexture2D = function (target, attachment, textureTarget, texture, level) {
      if (attachment === this.COLOR_ATTACHMENT0) shadowTexture = texture;
      attachTexture.call(this, target, attachment, textureTarget, texture, level);
    };
    prototype.bindFramebuffer = function (target, framebuffer) {
      offscreen = framebuffer !== null;
      bindFramebuffer.call(this, target, framebuffer);
    };
    prototype.drawElements = function (mode, count, type, offset) {
      if (offscreen) {
        state.offscreenDraws++;
        if (shadowTexture && !state.minFilter) {
          const previous: WebGLTexture | null = this.getParameter(this.TEXTURE_BINDING_2D);
          this.bindTexture(this.TEXTURE_2D, shadowTexture);
          state.minFilter = this.getTexParameter(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER);
          state.magFilter = this.getTexParameter(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER);
          this.bindTexture(this.TEXTURE_2D, previous);
        }
      }
      drawElements.call(this, mode, count, type, offset);
    };
    prototype.getUniformLocation = function (program, name) {
      const location = getUniformLocation.call(this, program, name);
      if (location && name === "tShadow") state.shadowReceivers++;
      return location;
    };
  });
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await expect.poll(() => page.evaluate(() => (window as Window & { basketShadows?: { offscreenDraws: number } }).basketShadows?.offscreenDraws ?? 0)).toBeGreaterThan(0);
  const receivers = await page.evaluate(() => (window as Window & { basketShadows?: { shadowReceivers: number } }).basketShadows?.shadowReceivers ?? 0);
  expect(receivers).toBeGreaterThan(0);
  const filtering = await page.evaluate(() => {
    const state = (window as Window & { basketShadows?: { minFilter: number; magFilter: number } }).basketShadows;
    return { min: state?.minFilter, mag: state?.magFilter, nearest: WebGL2RenderingContext.NEAREST };
  });
  expect(filtering.min).toBe(filtering.nearest);
  expect(filtering.mag).toBe(filtering.nearest);
});

const PICKS: readonly BasketPick[] = [
  { website: true, growth: false, search: false },
  { website: true, growth: true, search: false },
  { website: true, growth: false, search: true },
  { website: true, growth: true, search: true },
];

const pickTotal = (pick: BasketPick): string => formatInr(firstPayment(packageTotal(pick)).total);

for (const pick of PICKS) {
  const total = pickTotal(pick);
  test(`pricing total with ${PLAN_IDS.filter((id) => pick[id]).join(" + ")} is ${total}`, async ({ page }) => {
    await page.goto("/pricing");
    const hero = page.locator("section[aria-labelledby='h-pricing']");
    for (const id of PLAN_IDS) {
      // The website starts on; flip every plan that differs from the pick.
      if (pick[id] !== (id === "website")) await hero.getByRole("switch", { name: PRICING_PLANS[id].switchLabel }).click();
    }
    await expect(hero.getByText(total, { exact: true })).toBeVisible();
  });
}

test("the expected totals match the owner's figures", () => {
  // Guards the formula itself: if these move, prices changed and the owner signs off on the new figures.
  expect(PICKS.map(pickTotal)).toEqual(["₹3,538.82", "₹12,269.64", "₹26,429.64", "₹31,384.46"]);
});

test("Social and SEO without the website is the 30% package", async ({ page }) => {
  await page.goto("/pricing");
  const hero = page.locator("section[aria-labelledby='h-pricing']");
  await hero.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).click();
  await hero.getByRole("switch", { name: PRICING_PLANS.search.switchLabel }).click();
  await hero.getByRole("switch", { name: PRICING_PLANS.website.switchLabel }).click();
  await expect(hero.getByText("₹28,907.64", { exact: true })).toBeVisible();
});

test("the last switch on cannot be turned off", async ({ page }) => {
  await page.goto("/pricing");
  const hero = page.locator("section[aria-labelledby='h-pricing']");
  const website = hero.getByRole("switch", { name: PRICING_PLANS.website.switchLabel });
  const total = pickTotal(PICKS[0]);
  await expect(website).toHaveAttribute("aria-disabled", "true");
  // Keyboard activation: Playwright will not click aria-disabled, and a forced click can land on the phone total bar.
  await website.focus();
  await page.keyboard.press("Space");
  await expect(website).toHaveAttribute("aria-checked", "true");
  await expect(hero.getByText(total, { exact: true })).toBeVisible();
  await expect(website).toBeFocused();
});

test("the basket carries from home to pricing", async ({ page }) => {
  await page.goto("/");
  await page.locator("#basket-card").getByRole("button", { name: "Add Social Media and Ads", exact: true }).click();
  await page.getByRole("link", { name: "Compare all plans" }).click();
  await expect(page).toHaveURL(/\/pricing/);
  await expect(page.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).first()).toHaveAttribute("aria-checked", "true");
});

test("the Basket Card adds plans and ticks what is in the basket", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#basket-card");
  await card.getByRole("button", { name: "Add Social Media and Ads", exact: true }).click();
  await expect(card.getByText("20% off and ₹2,000 a month for your ads.", { exact: true })).toBeVisible();
  await expect(card.getByRole("button", { name: "Remove Social Media and Ads" })).toHaveAttribute("aria-pressed", "true");
  await expect(card.getByRole("list", { name: "In your basket" }).getByRole("listitem")).toHaveText(["Managed Website", "Social Media and Ads"]);
  // The "Add next" nudge adds the plan worth adding most.
  await card.getByRole("button", { name: "Add SEO", exact: true }).click();
  await expect(card.getByText("Full basket. 30% off and ₹5,000 a month for your ads.", { exact: true })).toBeVisible();
  await expect(card.getByText(formatInr(firstPayment(packageTotal({ website: true, growth: true, search: true })).total), { exact: false }).first()).toBeVisible();
});

test("the live basket renders and rotates without WebGL errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (/WebGL.*(?:INVALID|error)|GLSL|shader error|basket stage stayed on its poster/i.test(message.text())) {
      errors.push(message.text());
    }
  });
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator("canvas")).toBeVisible({ timeout: 20_000 });
  const bounds = await stage.boundingBox();
  if (!bounds) throw new Error("The basket stage has no visible bounds");
  await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.9, bounds.y + bounds.height * 0.5, { steps: 30 });
  await page.mouse.up();
  await expect(stage.locator("canvas")).toBeVisible();
  expect(errors).toEqual([]);
});

test("reduced motion keeps the basket poster visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  const poster = stage.locator("img");
  await expect(poster).toBeVisible();
  await expect.poll(() => poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(stage.locator("canvas")).toHaveCount(0);
});

test("the website preview loads the original studio photograph", async ({ page }) => {
  const photograph = page.waitForResponse((response) => response.url().endsWith("/basket/studio-house.avif"), { timeout: 10_000 });
  await page.goto("/");
  await page.getByRole("img", { name: /A woven.*basket/ }).first().scrollIntoViewIfNeeded();
  const response = await photograph;
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/avif");
});

test("the studio preview still renders when its photograph is unavailable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/basket/studio-house.avif", (route) => route.abort());
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await expect(stage.locator("img")).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test("basket dragging releases after focus loss, cancellation, and a missed mouseup", async ({ page }) => {
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await stage.evaluate((el) => {
    el.addEventListener("pointerdown", (event) => {
      if (event instanceof PointerEvent) el.dataset.testPointer = String(event.pointerId);
    });
  });
  const bounds = await stage.boundingBox();
  if (!bounds) throw new Error("The basket stage has no visible bounds");

  for (const reason of ["blur", "cancel", "capture", "buttons", "mouseup"] as const) {
    await page.mouse.move(bounds.x + bounds.width * 0.4, bounds.y + bounds.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width * 0.6, bounds.y + bounds.height * 0.5, { steps: 5 });
    await expect.poll(() => stage.evaluate((el) => el.hasPointerCapture(Number(el.dataset.testPointer)))).toBe(true);

    if (reason === "mouseup") await page.mouse.up();
    else await stage.evaluate((el, reason) => {
      const pointerId = Number(el.dataset.testPointer);
      if (reason === "blur") window.dispatchEvent(new Event("blur"));
      if (reason === "cancel") el.dispatchEvent(new PointerEvent("pointercancel", { pointerId, bubbles: true }));
      if (reason === "capture") el.releasePointerCapture(pointerId);
      if (reason === "buttons") el.dispatchEvent(new PointerEvent("pointermove", { pointerId, pointerType: "mouse", buttons: 0, bubbles: true }));
    }, reason);

    // Flush pending lostpointercapture while the physical mouse is still down.
    if (reason === "capture") await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.5);
    await expect.poll(() => stage.evaluate((el) => el.hasPointerCapture(Number(el.dataset.testPointer)))).toBe(false);
    await expect(stage).toHaveCSS("cursor", "grab");
    if (reason !== "mouseup") await page.mouse.up();
  }
});

test("a released basket keeps its momentum without keeping pointer capture", async ({ page }) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  // Observe the basket body's real render matrix, excluding translated tiles and the shadow.
  await page.addInitScript(() => {
    const matrices = new WeakSet<WebGLUniformLocation>();
    const prototype = WebGL2RenderingContext.prototype;
    const getLocation = prototype.getUniformLocation;
    const setMatrix = prototype.uniformMatrix4fv;
    prototype.getUniformLocation = function (program, name) {
      const location = getLocation.call(this, program, name);
      if (location && name === "modelMatrix") matrices.add(location);
      return location;
    };
    prototype.uniformMatrix4fv = function (location, transpose, data) {
      if (location && matrices.has(location)) {
        const matrix = Array.from(data);
        if (Math.abs(matrix[12]) + Math.abs(matrix[13]) + Math.abs(matrix[14]) < 0.00001) {
          (window as Window & { basketAngle?: number }).basketAngle = Math.atan2(matrix[8], matrix[0]);
        }
      }
      setMatrix.call(this, location, transpose, data);
    };
  });
  await page.goto("/");
  const stage = page.getByRole("img", { name: /A woven.*basket/ }).first();
  await stage.scrollIntoViewIfNeeded();
  await page.clock.runFor(1000);
  await expect(stage.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await stage.evaluate((el) => {
    el.addEventListener("pointerdown", (event) => {
      if (event instanceof PointerEvent) el.dataset.testPointer = String(event.pointerId);
    });
  });
  const bounds = await stage.boundingBox();
  if (!bounds) throw new Error("The basket stage has no visible bounds");
  await page.mouse.move(bounds.x + bounds.width * 0.15, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5, { steps: 8 });
  await page.clock.runFor(32);
  await page.mouse.up();
  await expect.poll(() => stage.evaluate((el) => el.hasPointerCapture(Number(el.dataset.testPointer)))).toBe(false);
  const releasedAngle = await page.evaluate(() => (window as Window & { basketAngle?: number }).basketAngle);
  if (releasedAngle === undefined) throw new Error("The rendered basket angle was not observed");
  await page.clock.runFor(250);
  const angle = await page.evaluate(() => (window as Window & { basketAngle?: number }).basketAngle ?? releasedAngle);
  expect(Math.abs(Math.atan2(Math.sin(angle - releasedAngle), Math.cos(angle - releasedAngle)))).toBeGreaterThan(0.1);

  // After the coast settles, an unpressed cursor must not resume turning the basket.
  await page.clock.runFor(2500);
  await page.mouse.move(bounds.x + bounds.width * 0.1, bounds.y + bounds.height * 0.5);
  await page.clock.runFor(500);
  const leftAngle = await page.evaluate(() => (window as Window & { basketAngle?: number }).basketAngle ?? releasedAngle);
  await page.mouse.move(bounds.x + bounds.width * 0.9, bounds.y + bounds.height * 0.5);
  await page.clock.runFor(500);
  const rightAngle = await page.evaluate(() => (window as Window & { basketAngle?: number }).basketAngle ?? releasedAngle);
  const hoverTurn = Math.abs(Math.atan2(Math.sin(rightAngle - leftAngle), Math.cos(rightAngle - leftAngle)));
  expect(hoverTurn).toBeLessThan(0.025); // Allows only the existing gentle idle animation.
});
