"use client";

import { ArrowClockwise, CreditCard, ListChecks, Package, Pause, Play, ShieldCheck, Stack, Storefront, Truck } from "@phosphor-icons/react";
import Image from "next/image";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { ECOMMERCE_ORDER_STEPS } from "@/content/ecommerce";
import type { OrderScene } from "./ecommerce-order-scene";

const STAGE_ICONS = {
  catalog: Stack, storefront: Storefront, checkout: CreditCard, orders: ListChecks,
  packing: Package, delivery: Truck, care: ShieldCheck,
} as const;

export function EcommerceOrderJourney(): ReactElement {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<OrderScene | null>(null);
  const interacted = useRef(false);
  const stage = ECOMMERCE_ORDER_STEPS[index];
  const StageIcon = STAGE_ICONS[stage.id];
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const container = host.current;
    if (element === null || container === null) return;

    let disposed = false;
    function onContextLost(): void {
      scene.current?.freeze();
      setReady(false);
    }

    element.addEventListener("webglcontextlost", onContextLost);
    void import("./ecommerce-order-scene").then(({ createOrderScene }) => {
      if (disposed) return;
      scene.current = createOrderScene(element, container);
      setReady(true);
    }).catch(() => {
      // The illustrated fallback and stage controls remain available without WebGL.
    });
    return () => {
      disposed = true;
      element.removeEventListener("webglcontextlost", onContextLost);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!ready || element === null || interacted.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (interacted.current) return;
      interacted.current = true;
      setPlaying(true);
    }, { threshold: .5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!playing || !ready || !canAnimate()) return;
    const activeScene = scene.current;
    if (activeScene === null) return;
    activeScene.play(setIndex, () => {
      setPlaying(false);
      setFinished(true);
    });
  }, [playing, ready]);

  useEffect(() => {
    if (!playing || (ready && canAnimate())) return;
    const timer = window.setTimeout(() => {
      const next = ECOMMERCE_ORDER_STEPS[index + 1];
      if (next === undefined) {
        setPlaying(false);
        setFinished(true);
      } else {
        scene.current?.show(next.id, false);
        setIndex(index + 1);
      }
    }, stage.duration);
    return () => window.clearTimeout(timer);
  }, [playing, ready, index, stage.duration]);

  function canAnimate(): boolean {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function selectStep(next: number): void {
    interacted.current = true;
    setPlaying(false);
    setFinished(false);
    setPaused(false);
    setIndex(next);
    scene.current?.show(ECOMMERCE_ORDER_STEPS[next].id, canAnimate());
  }

  function togglePlayback(): void {
    interacted.current = true;
    if (playing) {
      scene.current?.freeze();
      setPlaying(false);
      setPaused(true);
      return;
    }
    if (!paused) {
      setIndex(0);
      setFinished(false);
      scene.current?.show("catalog", false);
    }
    setPaused(false);
    setPlaying(true);
  }

  return (
    <figure className="ecommerce-order-journey" data-step={stage.id} aria-labelledby="ecommerce-order-caption">
      <figcaption className="ecommerce-order-header">
        <Image src="/brand/brandbasket-mark.svg" width={23} height={23} alt="" />
        <span id="ecommerce-order-caption">Inside a BrandBasket store</span>
        <button type="button" onClick={togglePlayback} className="ecommerce-order-play">
          {playing ? <Pause weight="fill" size={15} aria-hidden="true" /> : finished ? <ArrowClockwise size={15} aria-hidden="true" /> : <Play weight="fill" size={15} aria-hidden="true" />}
          {playing ? "Pause" : finished ? "Replay" : paused ? "Resume" : "Play journey"}
        </button>
      </figcaption>
      <div ref={host} className="ecommerce-order-scene" data-rendered={ready} aria-hidden="true">
        {playing && ready ? (
          <div className="ecommerce-order-progress">
            <span />
          </div>
        ) : null}
        <canvas ref={canvas} className="ecommerce-order-canvas" />
        <div className="ecommerce-order-fallback" aria-hidden="true">
          {ECOMMERCE_ORDER_STEPS.map(({ id, label }) => {
            const Icon = STAGE_ICONS[id];
            return <div key={id} data-active={id === stage.id}><Icon size={23} weight="duotone" /><span>{label}</span></div>;
          })}
        </div>
        <div className="ecommerce-order-signal" key={stage.id}><span />{stage.signal}</div>
      </div>
      <div className="ecommerce-order-controls" role="group" aria-label="Explore the order journey">
        {ECOMMERCE_ORDER_STEPS.map(({ id, label }, stepIndex) => {
          const Icon = STAGE_ICONS[id];
          const current = index === stepIndex;
          return (
            <button key={id} type="button" aria-pressed={current} aria-controls="ecommerce-order-status" onClick={() => selectStep(stepIndex)}>
              <Icon size={19} weight={current ? "duotone" : "regular"} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
      <div className="ecommerce-order-status" id="ecommerce-order-status" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        {stage.id === "storefront" ? (
          <Image className="ecommerce-order-status-image" src="/services/ecommerce-demo-product.webp" width={38} height={38} alt="" />
        ) : (
          <span className="ecommerce-order-status-icon"><StageIcon weight="duotone" size={23} aria-hidden="true" /></span>
        )}
        <div className="ecommerce-order-copy">
          <div><strong>{stage.title}</strong><p>{stage.detail}</p></div>
          {ECOMMERCE_ORDER_STEPS.map(({ id, title, detail }) => (
            <div key={id} className="ecommerce-order-measure" aria-hidden="true"><strong>{title}</strong><p>{detail}</p></div>
          ))}
        </div>
      </div>
    </figure>
  );
}
