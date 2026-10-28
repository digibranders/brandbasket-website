// components/basket/BasketStage.tsx
"use client";
import Image from "next/image";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { basket } from "@/lib/basket-store";
import { readDeviceHints, shouldRender3D } from "@/lib/device-hints";
import type { BasketScene } from "./scene/types";

/**
 * Poster first (it is the LCP image). After the page is idle and the stage is near the viewport, loads the OGL
 * scene with a dynamic import, fades the poster out and keeps the tiles in sync with the basket store.
 * The poster is served unoptimized: it is already AVIF under the 40 KB budget, and re-encoding only grows it.
 * `priority` marks it as the LCP image (eager, high fetch priority; Next 16 deprecates the Image `priority` prop).
 */
interface BasketStageProps {
  readonly priority?: boolean;
  /** Accessible name of the stage (mock: #stage aria-label). */
  readonly label?: string;
}

export function BasketStage({ priority = false, label = "A woven basket holding the services in your plan" }: BasketStageProps): ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const hints = readDeviceHints();
    if (!shouldRender3D(hints)) return;
    let scene: BasketScene | undefined;
    let unsubscribe: (() => void) | undefined;
    let started = false;
    let cancelled = false;
    let visible = false;
    let rebuilds = 0;
    let rebuildTimer: number | undefined;
    let idle: { readonly cancel: () => void } | undefined;

    const start = async (): Promise<void> => {
      const [mod, image] = await Promise.all([import("./scene/scene"), loadImage("/basket/studio-house.avif")]);
      const labelFamily = await mod.loadFaceFonts();
      if (cancelled) return;
      scene = mod.createBasketScene(el, image, { reducedMotion: hints.reducedMotion, initialPick: basket.get(), labelFamily, onContextLost: recover });
      scene.setVisible(visible);
      unsubscribe = basket.subscribe(() => scene?.setPick(basket.get()));
      setLive(true);
    };
    const begin = (): void => {
      // A failed load or WebGL setup leaves the poster in place, which is the designed fallback.
      start().catch((error: unknown) => console.warn("Basket stage stayed on its poster.", error));
    };
    // The browser took the WebGL context (a phone backgrounding the tab, a GPU reset). Show the poster at once, then try
    // one rebuild; a context lost again means this device cannot hold it, and the poster stays.
    function recover(): void {
      unsubscribe?.();
      unsubscribe = undefined;
      scene?.destroy();
      scene = undefined;
      setLive(false);
      if (cancelled || rebuilds++ > 0) return;
      rebuildTimer = window.setTimeout(begin, 1000);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !started) {
        started = true;
        // Safari has no requestIdleCallback.
        if (typeof window.requestIdleCallback === "function") {
          const id = window.requestIdleCallback(begin, { timeout: 2000 });
          idle = { cancel: () => window.cancelIdleCallback(id) };
        } else {
          const id = window.setTimeout(begin, 200);
          idle = { cancel: () => window.clearTimeout(id) };
        }
      }
      scene?.setVisible(visible);
    }, { rootMargin: "200px" });
    io.observe(el);

    return () => {
      cancelled = true;
      window.clearTimeout(rebuildTimer);
      idle?.cancel();
      io.disconnect();
      unsubscribe?.();
      scene?.destroy();
      setLive(false);
    };
  }, []);

  return (
    <div ref={host} role="img" aria-label={label} className="relative aspect-[1.12] max-h-[620px] w-full min-[1000px]:aspect-[1.02]">
      <Image
        src="/basket/woven-basket-hero.avif"
        alt=""
        fill
        unoptimized
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        sizes="(min-width: 660px) 620px, 100vw"
        className={`pointer-events-none object-contain transition-opacity duration-300 ease-(--ease) ${live ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
}

/** A missing photograph leaves the complete studio layout available as the texture fallback. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
