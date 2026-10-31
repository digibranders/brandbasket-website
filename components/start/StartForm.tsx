"use client";
// components/start/StartForm.tsx
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { type FocusEvent, type FormEvent, type ReactElement, useRef, useState } from "react";
import { z } from "zod";
import { readConsent } from "@/components/consent/consent-storage";
import { pushConversion } from "@/components/consent/tags";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { START_ERRORS, START_FORM, START_PAY_NOTE } from "@/content/start";
import { startSubmitEvent, trackAttrs } from "@/lib/analytics";
import { readAttribution, type AttributionInput } from "@/lib/attribution";
import type { Currency } from "@/lib/currency";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS } from "@/lib/security/form-fields";
import { businessDetails, siteConfig } from "@/lib/site-config";
import { ADS_KEYS, readMobile, START_MAX, startFields } from "@/lib/start-schema";
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

/** Same rules as the server: an Indian page takes an Indian mobile, a dollar page takes a number with its country code. */
function fieldError(field: Field, value: string, currency: Currency): string {
  if (field === "phone") {
    const mobile = readMobile(value.trim());
    if (currency === "INR") return mobile?.indian ? "" : START_ERRORS.phoneIndia;
    return mobile ? "" : START_ERRORS.phoneWorld;
  }
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

const INPUT_BOX = "flex items-stretch rounded-[14px] border-[1.5px] border-[#8d8b85] bg-white transition-[border-color,box-shadow] duration-200 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(21,22,26,0.1)] aria-[invalid=true]:border-error";
/** The field's own border is the focus indicator; the important flag is needed because the site-wide :focus-visible outline (globals.css) is unlayered and would otherwise draw a second, square ring on the input inside it. */
const INPUT = "h-[52px] min-w-0 flex-1 bg-transparent px-4 text-base outline-none!";

export function StartForm(): ReactElement {
  const currency = useCurrency();
  const india = currency === "INR";
  const formRef = useRef<HTMLFormElement>(null);
  const readyToken = useFormToken();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const working = status.kind === "busy" || status.kind === "opening";

  const focusField = (name: ErrorField): void => formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  const check = (name: Field, value: string): void => setErrors((current) => ({ ...current, [name]: fieldError(name, value, currency) }));
  const onBlur = (event: FocusEvent<HTMLInputElement>, name: Field): void => {
    if (event.currentTarget.value) check(name, event.currentTarget.value);
  };
  const onInput = (event: FormEvent<HTMLInputElement>, name: Field): void => {
    if (errors[name]) check(name, event.currentTarget.value);
  };

  async function submit(): Promise<void> {
    const form = formRef.current;
    if (!form || working) return;
    const data = new FormData(form);
    const value = (name: string): string => String(data.get(name) ?? "").trim();

    const next: Errors = {};
    for (const name of FIELDS) {
      const message = fieldError(name, value(name), currency);
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

  const field = (name: Field, rest: { readonly type: string; readonly autoComplete: string; readonly inputMode?: "tel" | "email"; readonly prefix?: string; readonly hint?: string }): ReactElement => {
    const id = `st-${name}`;
    return (
      <div className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold">{START_FORM.labels[name]}</label>
        <div className={INPUT_BOX} aria-invalid={errors[name] ? true : undefined}>
          {rest.prefix ? <span aria-hidden="true" className="grid place-items-center border-r border-line pl-4 pr-3 text-[15px] text-ink-2">{rest.prefix}</span> : null}
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
        {field("phone", india ? { type: "tel", inputMode: "tel", autoComplete: "tel-national", prefix: "+91" } : { type: "tel", inputMode: "tel", autoComplete: "tel" })}
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
        <button type="submit" disabled={working} className={`${pillClasses("md", "action")} w-full cursor-pointer disabled:cursor-wait disabled:opacity-70`}>
          {working ? START_FORM.paying : START_FORM.pay}
          <Arrow size="md" />
        </button>
        <p className="text-center text-[13px] text-ink-2">{START_PAY_NOTE}</p>
        <div aria-hidden="true" className="flex items-center gap-3 text-[13px] text-ink-2 before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">{START_FORM.or}</div>
        <a
          href={SUPPORT_HREF}
          target="_blank"
          rel="noopener"
          {...trackAttrs("whatsapp_click", "start_form")}
          className="flex min-h-[52px] w-full items-center rounded-full border-[1.5px] border-ink/30 px-5 py-3 font-display text-[15.5px] font-semibold leading-tight tracking-[-0.01em] transition-colors duration-300 ease-[var(--ease)] hover:border-ink hover:bg-surface"
        >
          {START_FORM.support}
        </a>
      </div>
    </form>
  );
}
