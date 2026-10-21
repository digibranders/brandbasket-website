// components/consent/tags.ts
import type { ConversionEvent } from "@/lib/analytics";
import { type ConsentChoice, consentSignals, cookiesToClear, type Purpose } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Starts Google Tag Manager once something is allowed, then passes every later choice to it. Consent Mode v2 defaults
 * to denied before gtm.js loads, so container tags only fire for granted purposes. A "bb_consent" event carries the
 * choice for tags that use triggers instead of consent checks.
 */
export function syncTagManager(gtmId: string, choice: ConsentChoice, gpc: boolean): void {
  const signals = consentSignals(choice, gpc);
  if (!window.gtag) {
    if (!Object.values(signals).includes("granted")) return;
    window.dataLayer = window.dataLayer ?? [];
    // gtag reads Arguments objects from the dataLayer, not arrays, so this cannot use rest parameters.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", functionality_storage: "denied", personalization_storage: "denied", security_storage: "granted" });
    window.gtag("consent", "update", signals);
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.append(script);
  } else {
    window.gtag("consent", "update", signals);
  }
  window.dataLayer?.push({ event: "bb_consent", consent_measurement: signals.analytics_storage === "granted", consent_advertising: signals.ad_storage === "granted" });
}

/** Hands a conversion to Tag Manager for GA4 key events and ad conversions. No-op until GTM has started with consent. */
export function pushConversion(conversion: ConversionEvent): void {
  window.dataLayer?.push({ event: conversion.name, ...conversion.properties });
}

/** Deletes a withdrawn purpose's first-party cookies on this host and its parent domain, where the tags set them. */
export function clearTrackingCookies(purposes: readonly Purpose[]): void {
  const names = document.cookie.split(";").map((pair) => pair.split("=")[0]?.trim() ?? "").filter(Boolean);
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const name of cookiesToClear(names, purposes)) {
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
  }
}
