"use client";
// components/consent/ConsentBanner.tsx
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Switch } from "@/components/ui/Switch";
import { CONSENT, PURPOSE_DETAIL, VENDOR_NAME } from "@/content/consent";
import { COOKIE_SETTINGS_HREF } from "@/content/navigation";
import { allowedVendors, type ConsentChoice, GTM_ID, NO_CONSENT, PURPOSE_OF, purposesOf, TOOLS, type VendorId, withdrawn } from "@/lib/consent";
import { readConsent, saveConsent, subscribeConsent } from "./consent-storage";
import { clearTrackingCookies, syncTagManager } from "./tags";
import "./consent.css";

type View = "first" | "choices";

const EQUAL_BUTTON = "h-11 cursor-pointer whitespace-nowrap rounded-full border border-line bg-surface px-4 text-[14.5px] font-semibold transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.98]";

const noSubscribe = (): (() => void) => () => {};
const readGpc = (): boolean => (navigator as Navigator & { readonly globalPrivacyControl?: boolean }).globalPrivacyControl === true;
const namesOf = (vendors: readonly VendorId[]): string => vendors.map((vendor) => VENDOR_NAME[vendor]).join(", ");

/**
 * Option C of plan 12: the notice laid out as an itemised receipt. Shows on a first visit and when the footer's
 * Cookie settings link is clicked; starts Google Tag Manager only after a purpose is allowed. Reject and Accept share
 * one style so neither is nudged. Mounted by the root layout only when a GTM container is configured.
 */
export function ConsentBanner(): ReactElement | null {
  const record = useSyncExternalStore(subscribeConsent, readConsent, () => undefined);
  const gpc = useSyncExternalStore(noSubscribe, readGpc, () => false);
  const [reopened, setReopened] = useState(false);
  const [view, setView] = useState<View>("first");
  const [draft, setDraft] = useState<ConsentChoice>(NO_CONSENT);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = useId();

  const offered = TOOLS.filter((vendor) => !(gpc && PURPOSE_OF[vendor] === "advertising"));
  const purposes = purposesOf(offered);

  useEffect(() => {
    if (record && GTM_ID) syncTagManager(GTM_ID, record, gpc);
  }, [record, gpc]);

  // The footer link falls back to the privacy policy's Cookies section; with the banner mounted it reopens the choices.
  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      const link = event.target instanceof Element ? event.target.closest(`a[href="${COOKIE_SETTINGS_HREF}"]`) : null;
      if (!link) return;
      event.preventDefault();
      setDraft(readConsent() ?? NO_CONSENT);
      setView("choices");
      setReopened(true);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (reopened) headingRef.current?.focus();
  }, [reopened]);

  if (record === undefined || purposes.length === 0 || (record !== null && !reopened)) return null;

  const every = (on: boolean): ConsentChoice => ({ measurement: on && purposes.includes("measurement"), advertising: on && purposes.includes("advertising") });

  const commit = (choice: ConsentChoice): void => {
    const gone = withdrawn(readConsent(), choice);
    saveConsent(choice);
    setReopened(false);
    setView("first");
    if (gone.length > 0) {
      clearTrackingCookies(gone);
      // Tags already running cannot be unloaded; a fresh page starts with only what is still allowed.
      window.location.reload();
    }
  };

  const choosing = view === "choices";
  const loading = allowedVendors(choosing ? draft : (record ?? NO_CONSENT), offered, gpc);

  return (
    <section role="region" aria-labelledby={headingId} className="consent fixed z-30">
      <div className="consent-receipt grid gap-3.5 bg-surface px-[22px] pb-[30px] pt-[22px]">
        <div className="flex items-center justify-between gap-3">
          <Image src="/brand/brandbasket-lockup-horizontal-light.svg" alt="" width={125} height={22} className="h-[22px] w-auto" />
          <span className="font-mono text-[11.5px] text-ink-2">{CONSENT.stamp}</span>
        </div>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="font-display text-[19px] font-semibold leading-tight tracking-[-0.01em]">
          {CONSENT.title}
        </h2>
        <p className="text-[14.5px] leading-normal text-ink-2">{choosing ? CONSENT.choicesIntro : CONSENT.firstIntro}</p>
        <ul className="grid gap-2.5 border-t border-dashed border-line pt-3.5 font-mono text-[13px]">
          {purposes.map((purpose) => {
            const names = namesOf(offered.filter((vendor) => PURPOSE_OF[vendor] === purpose));
            return (
              <li key={purpose} className="consent-item">
                <span className="grid">
                  <span className="font-medium">{names}</span>
                  <span className="font-sans text-[11.5px] text-ink-2">{PURPOSE_DETAIL[purpose]}</span>
                </span>
                <span className="consent-lead" aria-hidden="true" />
                {choosing ? (
                  <Switch checked={draft[purpose]} label={names} onChange={(on) => setDraft((current) => ({ ...current, [purpose]: on }))} />
                ) : (
                  <span className="text-ink-2">{CONSENT.off}</span>
                )}
              </li>
            );
          })}
          <li className="consent-item">
            <span className="grid">
              <span className="font-medium">{CONSENT.needed.name}</span>
              <span className="font-sans text-[11.5px] text-ink-2">{CONSENT.needed.detail}</span>
            </span>
            <span className="consent-lead" aria-hidden="true" />
            <span className="text-sage">{CONSENT.always}</span>
          </li>
        </ul>
        <p className="consent-item border-t border-dashed border-line pt-3 font-mono text-[13px]">
          <span>{choosing ? CONSENT.loadsAfterSave : CONSENT.loadedNow}</span>
          <span className="consent-lead" aria-hidden="true" />
          <span aria-live="polite" className="max-w-[190px] text-right font-medium text-sage">{loading.length > 0 ? namesOf(loading) : CONSENT.nothing}</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={EQUAL_BUTTON} onClick={() => commit(every(false))}>{CONSENT.reject}</button>
          <button type="button" className={EQUAL_BUTTON} onClick={() => commit(every(true))}>{CONSENT.accept}</button>
        </div>
        {choosing ? (
          <button type="button" onClick={() => commit(draft)} className="h-11 w-full cursor-pointer rounded-full bg-action text-[14.5px] font-semibold text-action-ink transition-transform duration-200 active:scale-[0.98]">
            {CONSENT.save}
          </button>
        ) : (
          <button type="button" onClick={() => setView("choices")} className="cursor-pointer justify-self-start text-sm font-semibold underline decoration-rattan underline-offset-[3px]">
            {CONSENT.choose}
          </button>
        )}
        <p className="text-[12.5px] leading-normal text-ink-2">
          {CONSENT.footnote}{" "}
          <Link href="/privacy" className="whitespace-nowrap text-ink underline decoration-rattan underline-offset-[3px]">{CONSENT.policy}</Link>
        </p>
      </div>
    </section>
  );
}
