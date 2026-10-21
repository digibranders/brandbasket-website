// content/consent.ts
import type { Purpose, VendorId } from "@/lib/consent";

/** Consent banner copy (option C, the itemised receipt). Formal wording approved by the owner on 2026-10-21. */
export const CONSENT = {
  stamp: "Cookie notice",
  title: "We use cookies only with your consent",
  firstIntro: "Each tool below stays off unless you allow it. Nothing loads until you make a choice.",
  choicesIntro: "Select the purposes you agree to. The summary below shows what will load when you save.",
  off: "Off",
  always: "Always on",
  needed: { name: "Your consent record", detail: "Strictly necessary: kept for 12 months, no tracking" },
  loadedNow: "Currently active",
  loadsAfterSave: "Active after saving",
  nothing: "None",
  reject: "Reject all",
  accept: "Accept all",
  choose: "Manage preferences",
  save: "Save preferences",
  footnote: "You can change or withdraw your consent at any time from Cookie settings at the bottom of every page.",
  policy: "Privacy policy",
} as const;

export const PURPOSE_DETAIL: Readonly<Record<Purpose, string>> = {
  measurement: "Measurement: how visitors use this site",
  advertising: "Advertising: measuring our ads and showing them to past visitors",
};

export const VENDOR_NAME: Readonly<Record<VendorId, string>> = {
  ga4: "Google Analytics",
  clarity: "Microsoft Clarity",
  googleAds: "Google Ads",
  metaPixel: "Meta Pixel",
};
