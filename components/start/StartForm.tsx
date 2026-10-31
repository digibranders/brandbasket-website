"use client";
// components/start/StartForm.tsx
import { WarningCircle, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { type FocusEvent, type FormEvent, type ReactElement, type ReactNode, useRef, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { readConsent } from "@/components/consent/consent-storage";
import { pushConversion } from "@/components/consent/tags";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Arrow } from "@/components/ui/ArrowButton";
import { countryFromLocale, INDIA, type PhoneCountry, UNITED_STATES } from "@/content/phone-countries";
import { START_ERRORS, START_FORM, START_PAY_NOTE } from "@/content/start";
import { startSubmitEvent, trackAttrs } from "@/lib/analytics";
import { readAttribution, type AttributionInput } from "@/lib/attribution";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS } from "@/lib/security/form-fields";
import { businessDetails, siteConfig } from "@/lib/site-config";
import { composePhone, phoneError } from "@/lib/start-phone";
import { ADS_KEYS, START_MAX, startFields } from "@/lib/start-schema";
import { CountryPicker } from "./CountryPicker";
import { useFormToken } from "./use-form-token";

type Field = "name" | "phone" | "email";
type ErrorField = Field | "consent";
type Errors = Partial<Record<ErrorField, string>>;
const FIELDS: readonly Field[] = ["name", "phone", "email"];
const ERROR_FIELDS: readonly ErrorField[] = [...FIELDS, "consent"];

type Status = { readonly kind: "idle" | "busy" | "opening" } | { readonly kind: "error"; readonly message: string };

/** "I'd like to speak with your support team first": a WhatsApp chat with the message already typed. No details are asked for and nothing is saved. */
const SUPPORT_HREF = `${businessDetails.whatsappHref}?text=${encodeURIComponent(START_FORM.whatsappMessage)}`;

const startResponse = z.union([
  z.object({ ok: z.literal(true), next: z.string().optional() }),
  z.object({ error: z.string(), fields: z.record(z.string(), z.array(z.string()).optional()).optional() }),
]);

/** Same rules as the server: India takes an Indian mobile, any other chosen country a plausible international number. */
function fieldError(field: Field, value: string, country: PhoneCountry): string {
  if (field === "phone") return phoneError(value, country.dial, country.iso);
  const result = startFields[field].safeParse(value.trim());
  return result.success ? "" : (result.error.issues[0]?.message ?? START_ERRORS.form);
}

/** The campaign parameters in the ad's address, so the team can tell which ad a lead came from. */
function adsParams(): Partial<Record<(typeof ADS_KEYS)[number], string>> {
  const query = new URLSearchParams(window.location.search);
  return Object.fromEntries(ADS_KEYS.flatMap((key) => {
    const value = query.get(key);
    return value ? [[key, value.slice(0, 120)]] : [];
  }));
}

/** The ad's ids, with the cookies read only for what the visitor allowed (Global Privacy Control is a no to advertising). It travels sealed into the sign-up address, to be kept on the account (plan 59). */
function pageAttribution(): ReturnType<typeof readAttribution> {
  const saved = readConsent();
  const gpc = (navigator as Navigator & { readonly globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  const input: AttributionInput = {
    search: window.location.search,
    cookie: document.cookie,
    consent: { measurement: saved?.measurement === true, advertising: saved?.advertising === true && !gpc },
    path: window.location.pathname,
    referrer: document.referrer,
    host: window.location.hostname,
    now: Date.now(),
  };
  return readAttribution(input);
}

/** The two form buttons: the same size and shape, label centred in the space beside a round icon chip pinned to the right edge. They sit in an equal two-column grid that stacks only when a column would be under 8.25rem. */
const CTA = "group inline-flex h-[54px] w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-full text-[15px] font-semibold transition-[transform,background-color] duration-500 ease-[var(--ease)] active:scale-[0.98]";
const INPUT_BOX = "relative flex items-stretch rounded-[14px] border-[1.5px] border-[#8d8b85] bg-white transition-[border-color,box-shadow] duration-200 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(21,22,26,0.1)] aria-[invalid=true]:border-error";
/** The field's own border is the focus indicator; the important flag is needed because the site-wide :focus-visible outline (globals.css) is unlayered and would otherwise draw a second, square ring on the input inside it. */
const INPUT = "h-[52px] min-w-0 flex-1 bg-transparent px-4 text-base outline-none!";

const subscribeToNothing = (): (() => void) => () => undefined;
const browserLanguage = (): string => navigator.language;
const serverLanguage = (): string => "";

export function StartForm(): ReactElement {
  const currency = useCurrency();
  const india = currency === "INR";
  const formRef = useRef<HTMLFormElement>(null);
  const readyToken = useFormToken();
  // Rupee page: India. Dollar page: the country in the browser's language when it is listed, otherwise the United States (the server draws the latter, so nothing mismatches). The visitor's own pick wins.
  const language = useSyncExternalStore(subscribeToNothing, browserLanguage, serverLanguage);
  const [picked, setPicked] = useState<PhoneCountry | null>(null);
  const country = picked ?? (india ? INDIA : (countryFromLocale(language) ?? UNITED_STATES));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const working = status.kind === "busy" || status.kind === "opening";

  const focusField = (name: ErrorField): void => formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  const check = (name: Field, value: string): void => setErrors((current) => ({ ...current, [name]: fieldError(name, value, country) }));
  const onBlur = (event: FocusEvent<HTMLInputElement>, name: Field): void => {
    if (event.currentTarget.value) check(name, event.currentTarget.value);
  };
  const onInput = (event: FormEvent<HTMLInputElement>, name: Field): void => {
    if (errors[name]) check(name, event.currentTarget.value);
  };
  /** Picking another country re-checks a number that is already typed. */
  const onCountry = (next: PhoneCountry): void => {
    setPicked(next);
    const typed = formRef.current?.querySelector<HTMLInputElement>('[name="phone"]')?.value ?? "";
    if (typed !== "") setErrors((current) => ({ ...current, phone: fieldError("phone", typed, next) }));
  };

  async function submit(): Promise<void> {
    const form = formRef.current;
    if (!form || working) return;
    const data = new FormData(form);
    const value = (name: string): string => String(data.get(name) ?? "").trim();

    const next: Errors = {};
    for (const name of FIELDS) {
      const message = fieldError(name, value(name), country);
      if (message) next[name] = message;
    }
    const agreed = data.get("consent") === "on";
    if (!agreed) next.consent = START_ERRORS.consent;
    setErrors(next);
    const firstInvalid = ERROR_FIELDS.find((name) => next[name]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setStatus({ kind: "busy" });
    const token = await readyToken();
    if (!token) {
      setStatus({ kind: "error", message: START_ERRORS.send });
      return;
    }
    const body = {
      ...Object.fromEntries(FIELDS.map((name) => [name, value(name)])),
      phone: composePhone(country.dial, value("phone")),
      consent: agreed,
      noticeVersion: LEGAL_TEXT_VERSION,
      ads: adsParams(),
      attribution: pageAttribution() ?? undefined,
      [FORM_TOKEN_FIELD]: token,
      ...Object.fromEntries(HONEYPOT_FIELDS.map((name) => [name, value(name)])),
    };
    try {
      const res = await fetch("/api/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = startResponse.safeParse(await res.json().catch(() => null));
      if (res.ok && result.success && "ok" in result.data) {
        const sent = startSubmitEvent();
        track(sent.name, sent.properties);
        pushConversion(sent);
        // Only ever to the app: the address comes from our own server, and is checked anyway before the page leaves.
        const to = result.data.next;
        if (to !== undefined && to.startsWith(`${siteConfig.appUrl}/`)) {
          setStatus({ kind: "opening" });
          window.location.assign(to);
          return;
        }
        setStatus({ kind: "error", message: START_ERRORS.send });
        return;
      }
      const failure = result.success && "error" in result.data ? result.data : null;
      if (failure?.fields) {
        const fields = failure.fields;
        setErrors(Object.fromEntries(ERROR_FIELDS.flatMap((name) => (fields[name]?.[0] ? [[name, fields[name][0]]] : []))));
      }
      setStatus({ kind: "error", message: failure?.error ?? START_ERRORS.send });
    } catch {
      setStatus({ kind: "error", message: START_ERRORS.send });
    }
  }

  const field = (name: Field, rest: { readonly type: string; readonly autoComplete: string; readonly inputMode?: "tel" | "email"; readonly prefix?: ReactNode; readonly hint?: string }): ReactElement => {
    const id = `st-${name}`;
    return (
      <div className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold">{START_FORM.labels[name]}</label>
        <div className={INPUT_BOX} aria-invalid={errors[name] ? true : undefined}>
          {rest.prefix ?? null}
          <input
            id={id}
            name={name}
            type={rest.type}
            inputMode={rest.inputMode}
            autoComplete={rest.autoComplete}
            maxLength={START_MAX[name]}
            required
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={`${id}-err`}
            onBlur={(event) => onBlur(event, name)}
            onInput={(event) => onInput(event, name)}
            className={INPUT}
          />
        </div>
        <p id={`${id}-err`} className={`items-center gap-1.5 text-[13.5px] font-medium text-error ${errors[name] ? "flex" : "hidden"}`}>
          <WarningCircle aria-hidden="true" weight="fill" className="size-[17px] flex-none" />
          {errors[name]}
        </p>
        {rest.hint ? <p className="text-[13px] text-ink-2">{rest.hint}</p> : null}
      </div>
    );
  };

  return (
    <form ref={formRef} noValidate onSubmit={(event) => { event.preventDefault(); void submit(); }} className="grid gap-[18px]">
      <div>
        <h2 className="font-display text-[clamp(24px,2.2vw,30px)] font-medium leading-[1.1] tracking-[-0.03em]">{START_FORM.title}</h2>
        <p className="mt-1.5 text-[15px] text-ink-2">{START_FORM.sub}</p>
      </div>

      <div className="grid gap-3.5">
        {field("name", { type: "text", autoComplete: "name" })}
        {field("phone", { type: "tel", inputMode: "tel", autoComplete: "tel-national", prefix: <CountryPicker value={country} onChange={onCountry} onPicked={() => document.getElementById("st-phone")?.focus()} /> })}
        {field("email", { type: "email", inputMode: "email", autoComplete: "email", hint: START_FORM.emailHint })}
      </div>

      {/* Decoys for bots: off screen, out of the tab order and hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 size-px overflow-hidden">
        {HONEYPOT_FIELDS.map((name) => <input key={name} type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />)}
      </div>

      <label className={`flex items-start gap-3 text-[13.5px] leading-[1.45] ${errors.consent ? "text-error" : "text-ink-2"}`}>
        <input
          type="checkbox"
          name="consent"
          aria-invalid={errors.consent ? true : undefined}
          onChange={(event) => { if (event.currentTarget.checked) setErrors((current) => ({ ...current, consent: undefined })); }}
          className="mt-px size-[22px] flex-none cursor-pointer accent-ink"
        />
        <span>
          {START_FORM.consentPre} <Link href="/privacy" target="_blank" className="text-ink underline underline-offset-[3px]">{START_FORM.privacy}</Link> {START_FORM.consentMid} <Link href="/terms" target="_blank" className="text-ink underline underline-offset-[3px]">{START_FORM.terms}</Link>. {START_FORM.consentPost}
        </span>
      </label>

      {status.kind === "error" ? <p role="alert" className="rounded-[14px] border border-error/25 bg-error/5 p-4 text-sm text-error">{status.message}</p> : null}

      <div className="grid gap-3">
        {/* Two equal buttons side by side, labels centred; on a very narrow screen they wrap and stack. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(8.25rem,1fr))] gap-3">
          <button type="submit" disabled={working} className={`${CTA} gap-2 bg-action px-2 text-action-ink disabled:cursor-wait disabled:opacity-70`}>
            <span className="flex-1 text-center">{working ? START_FORM.paying : START_FORM.pay}</span>
            <Arrow size="md" />
          </button>
          <a
            href={SUPPORT_HREF}
            target="_blank"
            rel="noopener"
            {...trackAttrs("whatsapp_click", "start_form")}
            className={`${CTA} gap-2 border-[1.5px] border-rattan bg-rattan-wash px-[6.5px] text-ink hover:bg-[color-mix(in_srgb,var(--rattan-wash)_70%,var(--rattan))]`}
          >
            <span className="flex-1 text-center">{START_FORM.support}</span>
            {/* The same 36px round chip as the pay button's arrow, so the two buttons weigh the same; white to stand out on the light fill. */}
            <span aria-hidden="true" className="grid size-9 flex-none place-items-center rounded-full bg-white text-[var(--whatsapp)] shadow-[inset_0_0_0_1px_rgba(196,138,71,0.3)] transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-[1.06]">
              <WhatsappLogo weight="fill" className="size-5" />
            </span>
          </a>
        </div>
        <p className="text-center text-[13px] text-ink-2">{START_PAY_NOTE}</p>
      </div>
    </form>
  );
}
