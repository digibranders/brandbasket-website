// content/consent.ts
import type { Purpose, VendorId } from "@/lib/consent";

/** Consent banner copy (option C, the itemised receipt), approved by the owner on 2026-10-21. */
export const CONSENT = {
  stamp: "Your visit",
  title: "Here is everything we would add",
  firstIntro: "Each line stays off until you say yes. Nothing loads before you choose.",
  choicesIntro: "Turn on what you are happy with. The last line shows what will load.",
  off: "Off",
  always: "Always",
  needed: { name: "This choice", detail: "Needed: kept 12 months, no tracking" },
  loadedNow: "Loaded right now",
  loadsAfterSave: "Loads after you save",
  nothing: "Nothing",
  reject: "Reject all",
  accept: "Accept all",
  choose: "Choose line by line",
  save: "Save my choices",
  footnote: "Change your mind any time from Cookie settings at the foot of every page.",
  policy: "Privacy policy",
} as const;

export const PURPOSE_DETAIL: Readonly<Record<Purpose, string>> = {
  measurement: "Measurement: which pages help",
  advertising: "Advertising: did our ads bring you",
};

export const VENDOR_NAME: Readonly<Record<VendorId, string>> = {
  ga4: "Google Analytics",
  clarity: "Microsoft Clarity",
  googleAds: "Google Ads",
  metaPixel: "Meta Pixel",
};
