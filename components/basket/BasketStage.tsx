// components/basket/BasketStage.tsx
"use client";
import Image from "next/image";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { basket } from "@/lib/basket-store";
import { readDeviceHints, shouldRender3D } from "@/lib/device-hints";
import type { BasketScene } from "./scene/types";
import "./stage.css";

/**
 * The rendered basket fades in and rises into place before its tiles drop. The image is a static fallback only;
 * keeping it out of the live entrance avoids a visible swap between two different renderings of the weave.
 * The fallback is an unoptimized AVIF under the 40 KB budget; re-encoding only grows it.
 * `priority` starts an above-the-fold scene promptly and loads its fallback eagerly; secondary stages wait for idle.
 */
interface BasketStageProps {
  readonly priority?: boolean;
  /** Accessible name of the stage (mock: #stage aria-label). */
  readonly label?: string;
}

export function BasketStage({ priority = false, label = "A woven basket holding the services in your plan" }: BasketStageProps): ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const enter = useRef<(() => void) | null>(null);
  const [live, setLive] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [recovered, setRecovered] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    const showFallback = (): void => {
      queueMicrotask(() => {
        if (cancelled) return;
        setLive(false);
        // Never expose a partially loaded fallback, even on a slow connection.
        void loadImage("/basket/woven-basket-hero.avif").then((image) => {
          if (!cancelled && image) setFallback(true);
        });
      });
    };
    const hints = readDeviceHints();
    if (!shouldRender3D(hints)) {
      showFallback();
      return () => { cancelled = true; };
    }
    let scene: BasketScene | undefined;
    let unsubscribe: (() => void) | undefined;
    let started = false;
    let visible = false;
    let rebuilds = 0;
    let rebuildTimer: number | undefined;
    let idle: { readonly cancel: () => void } | undefined;

    const start = async (): Promise<void> => {
      const [mod, image] = await Promise.all([import("./scene/scene"), loadImage("/basket/studio-house.avif")]);
      const labelFamily = await mod.loadFaceFonts();
      if (cancelled) return;
      scene = mod.createBasketScene(el, image, {
        reducedMotion: hints.reducedMotion,
        initialPick: basket.get(),
        animateEntry: rebuilds === 0,
        labelFamily,
        onReady: () => {
          if (cancelled) return;
          setRecovered(rebuilds > 0);
          setLive(true);
        },
        onContextLost: recover,
      });
      enter.current = scene.startEntry;
      scene.setVisible(visible);
      unsubscribe = basket.subscribe(() => scene?.setPick(basket.get()));
    };
    const begin = (): void => {
      // A failed load or WebGL setup leaves the poster in place, which is the designed fallback.
      start().catch((error: unknown) => {
        showFallback();
        console.warn("Basket stage stayed on its poster.", error);
      });
    };
    // The browser took the WebGL context (a phone backgrounding the tab, a GPU reset). Show the poster at once, then try
    // one rebuild; a context lost again means this device cannot hold it, and the poster stays.
    function recover(): void {
      unsubscribe?.();
      unsubscribe = undefined;
      scene?.destroy();
      scene = undefined;
      enter.current = null;
      showFallback();
      if (cancelled || rebuilds++ > 0) return;
      rebuildTimer = window.setTimeout(begin, 1000);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !started) {
        started = true;
        if (priority) {
          begin();
        // Safari has no requestIdleCallback.
        } else if (typeof window.requestIdleCallback === "function") {
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
      enter.current = null;
      setLive(false);
    };
  }, [priority]);

  return (
    <div
      ref={host}
      role="img"
      aria-label={label}
      data-live={live}
      data-fallback={fallback}
      data-recovered={recovered}
      className="basket-stage relative isolate aspect-[1.12] max-h-[620px] w-full min-[1000px]:aspect-[1.02]"
      onAnimationEnd={(event) => {
        if (live && event.target instanceof HTMLCanvasElement && event.animationName === "basket-arrive") enter.current?.();
      }}
    >
      <Image
        src="/basket/woven-basket-hero.avif"
        alt=""
        fill
        unoptimized
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        sizes="(min-width: 660px) 620px, 100vw"
        className="basket-stage-poster pointer-events-none z-[2] object-contain"
      />
      <noscript>
        <style>{".basket-stage > .basket-stage-poster { display: none; }"}</style>
        <Image
          src="/basket/woven-basket-hero.avif"
          alt=""
          fill
          unoptimized
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes="(min-width: 660px) 620px, 100vw"
          className="pointer-events-none z-[2] object-contain"
        />
      </noscript>
    </div>
  );
}

/** A missing photograph leaves the complete studio layout available as the texture fallback. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => { img.decode().then(() => resolve(img), () => resolve(null)); };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
