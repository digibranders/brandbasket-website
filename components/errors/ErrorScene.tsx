"use client";

import { LockSimple, User } from "@phosphor-icons/react";
import Image from "next/image";
import { useId, useState, type ReactElement } from "react";
import { ERROR_UI, type ErrorSceneKind } from "@/content/errors";

function PageTile({ className = "" }: { readonly className?: string }): ReactElement {
  return <div className={`error-paper ${className}`}><div className="error-paper__chrome"><i /><i /><i /></div><div className="error-paper__content"><span /><div><i /><i /><i /></div></div><div className="error-paper__line" /><div className="error-paper__line" /></div>;
}

/** Decorative CSS loops keep recovery independent of animation and WebGL. */
export function ErrorScene({ scene, code }: { readonly scene: ErrorSceneKind; readonly code: string }): ReactElement {
  const [paused, setPaused] = useState(false);
  const weaveId = useId();
  return (
    <div className="error-scene-shell" data-motion-paused={paused}>
      <div className={`error-scene error-scene--${scene}`} aria-hidden="true">
        <span className="error-scene__code">{code}</span>
        <div className="error-scene__floor" />
        <svg className="error-scene__threads" viewBox="0 0 600 460" fill="none">
          <defs><pattern id={weaveId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><rect width="10" height="10" fill="var(--rattan)" /><path d="M0 2h10M0 6h10" stroke="var(--rattan-wash)" strokeWidth="2" /><path d="M3 0v10" stroke="var(--rattan-ink)" strokeWidth="1.5" /></pattern></defs>
          {(scene === "tangle" || scene === "repair") && <><path className="error-thread error-thread--loose" d="M344 277C463 298 463 403 384 401C301 399 383 335 451 366C550 411 544 335 497 341" stroke={`url(#${weaveId})`} strokeWidth="9" strokeLinecap="round" /><path className="error-thread error-thread--fine" d="M350 274C399 277 443 320 480 295" stroke="var(--rattan-text)" strokeWidth="3" strokeLinecap="round" /></>}
          {(scene === "journey" || scene === "bridge") && <><path className="error-road" d="M60 370C130 290 218 435 310 370S400 304 550 350" stroke="var(--rattan-wash)" strokeWidth="46" /><path className="error-road__seam" d="M60 370C130 290 218 435 310 370S400 304 550 350" stroke="var(--rattan-text)" strokeDasharray="8 12" strokeWidth="1.5" /></>}
          {scene === "empty" && <rect className="error-empty-slot" x="395" y="160" width="108" height="145" rx="6" stroke="var(--rattan-text)" strokeDasharray="6 8" strokeWidth="2" transform="rotate(12 449 232)" />}
        </svg>
        {scene !== "offline" && <><div className="error-scene__basket-shadow" /><div className="error-basket"><PageTile className="error-paper--inside" /><Image src="/images/errors/woven-basket.webp" alt="" width={768} height={512} className="error-basket__image" loading="eager" unoptimized /></div></>}
        {(scene === "spill" || scene === "empty" || scene === "queue" || scene === "bridge") && <PageTile className="error-paper--escaped" />}
        {scene === "queue" && <><PageTile className="error-paper--queue-one" /><PageTile className="error-paper--queue-two" /></>}
        {scene === "locked" && <Image src="/images/errors/woven-lid.webp" alt="" width={768} height={512} className="error-lid" loading="eager" unoptimized />}
        {(scene === "locked" || scene === "tag") && <div className="error-basket-tag">{scene === "locked" ? <LockSimple size={35} weight="light" /> : <User size={35} weight="light" />}</div>}
        {scene === "journey" && <div className="error-parcel"><span /><i /></div>}
        {scene === "repair" && <div className="error-spool"><span /><span /><span /><span /><span /><span /><span /></div>}
        {scene === "offline" && <>
          <Image src="/images/errors/disconnected-cord.webp" alt="" width={768} height={512} className="error-cord error-cord--left" loading="eager" unoptimized />
          <Image src="/images/errors/disconnected-cord.webp" alt="" width={768} height={512} className="error-cord error-cord--right" loading="eager" unoptimized />
          <span className="error-connection-mark"><i /><i /><i /></span>
        </>}
      </div>
      <button type="button" className="error-motion-toggle" aria-label={paused ? ERROR_UI.resume : ERROR_UI.pause} title={paused ? ERROR_UI.resume : ERROR_UI.pause} aria-pressed={paused} onClick={() => setPaused((value) => !value)} />
    </div>
  );
}
