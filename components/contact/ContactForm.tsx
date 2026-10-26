"use client";
// components/contact/ContactForm.tsx
import { Check, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactElement } from "react";
import { z } from "zod";
import { ArrowSubmitButton } from "@/components/ui/ArrowButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { pushConversion } from "@/components/consent/tags";
import { submitEvent } from "@/lib/analytics";
import { CONTACT_ERRORS, CONTACT_FORM_COPY, CONTACT_LABELS, CONTACT_PLACEHOLDERS } from "@/content/contact";
import { basket, DEFAULT_BASKET } from "@/lib/basket-store";
import { CONTACT_MAX, contactSchema, parsePlanParam } from "@/lib/contact-schema";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { basketPlans, type PlanId, samePick } from "@/lib/pricing";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS, planTokenUse } from "@/lib/security/form-fields";

type Field = "name" | "phone" | "business" | "city" | "email" | "message";
/** The text fields plus the privacy checkbox: everything that can show an error. */
type ErrorField = Field | "consent";
type Errors = Partial<Record<ErrorField, string>>;
type Status = { readonly kind: "idle" | "submitting" | "done" } | { readonly kind: "error"; readonly message: string };

/** Fields with a rule beyond their length cap, in page order. The message joined them when it became required (2026-10-26). */
const CHECKED: readonly Field[] = ["name", "phone", "business", "email", "message"];
const FIELDS: readonly Field[] = ["name", "phone", "business", "city", "email", "message"];
const ERROR_FIELDS: readonly ErrorField[] = [...FIELDS, "consent"];

const tokenResponse = z.object({ token: z.string().min(1) });
const contactResponse = z.union([
  z.object({ ok: z.literal(true) }),
  z.object({ error: z.string(), fields: z.record(z.string(), z.array(z.string()).optional()).optional() }),
]);

/** Same rules as the server: each field runs through its own contactSchema entry. */
function fieldError(name: Field, value: string): string {
  const result = contactSchema.shape[name].safeParse(value.trim());
  return result.success ? "" : (result.error.issues[0]?.message ?? CONTACT_ERRORS.form);
}

interface FormToken {
  readonly value: string;
  /** Client clock when the token arrived. The server stamped it earlier, so ages measured from here never overstate. */
  readonly receivedAt: number;
}

async function requestToken(): Promise<FormToken | null> {
  try {
    const res = await fetch("/api/form-token", { cache: "no-store" });
    const parsed = tokenResponse.safeParse(res.ok ? await res.json() : null);
    return parsed.success ? { value: parsed.data.token, receivedAt: Date.now() } : null;
  } catch {
    return null;
  }
}

/** `?plan=` wins (signupHref writes it); otherwise a basket picked earlier in this visit. A website-only basket is a general enquiry. */
function pagePlans(): PlanId[] {
  const fromUrl = parsePlanParam(new URLSearchParams(window.location.search).get("plan"));
  if (fromUrl.length > 0) return fromUrl;
  const pick = basket.get();
  return samePick(pick, DEFAULT_BASKET) ? [] : basketPlans(pick).map((plan) => plan.id);
}

export function ContactForm(): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  // The in-flight or settled token request, so a submit can await it, refresh it or wait out its minimum age.
  const tokenRef = useRef<Promise<FormToken | null> | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    tokenRef.current = requestToken();
  }, []);

  useEffect(() => {
    if (status.kind === "done") doneRef.current?.focus();
  }, [status.kind]);

  /** A token the server will accept as human, or null only when a fresh fetch fails. */
  async function readyToken(): Promise<string | null> {
    let token = await (tokenRef.current ??= requestToken());
    let plan = planTokenUse(token?.receivedAt ?? null, Date.now());
    if (plan.kind === "refresh") {
      tokenRef.current = requestToken();
      token = await tokenRef.current;
      plan = planTokenUse(token?.receivedAt ?? null, Date.now());
    }
    if (!token || plan.kind === "refresh") return null;
    if (plan.kind === "wait") {
      const { ms } = plan;
      await new Promise<void>((resolve) => setTimeout(resolve, ms));
    }
    return token.value;
  }

  function focusField(form: HTMLFormElement, name: ErrorField): void {
    form.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  function check(name: Field, value: string): void {
    const message = fieldError(name, value);
    setErrors((current) => ({ ...current, [name]: message }));
  }

  function onBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>, name: Field): void {
    if (event.currentTarget.value) check(name, event.currentTarget.value);
  }

  function onInput(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, name: Field): void {
    if (errors[name]) check(name, event.currentTarget.value);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (status.kind === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string): string => String(data.get(name) ?? "").trim();

    const next: Errors = {};
    for (const name of CHECKED) {
      const message = fieldError(name, value(name));
      if (message) next[name] = message;
    }
    const agreed = data.get("consent") === "on";
    if (!agreed) next.consent = CONTACT_ERRORS.consent;
    setErrors(next);
    const firstInvalid = ERROR_FIELDS.find((name) => next[name]);
    if (firstInvalid) {
      focusField(form, firstInvalid);
      return;
    }

    setStatus({ kind: "submitting" });
    const token = await readyToken();
    if (!token) {
      setStatus({ kind: "error", message: CONTACT_ERRORS.send });
      return;
    }
    const plans = pagePlans();
    const body = {
      ...Object.fromEntries(FIELDS.map((name) => [name, value(name)])),
      plans,
      consent: agreed,
      noticeVersion: LEGAL_TEXT_VERSION,
      [FORM_TOKEN_FIELD]: token,
      ...Object.fromEntries(HONEYPOT_FIELDS.map((name) => [name, value(name)])),
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = contactResponse.safeParse(await res.json().catch(() => null));
      if (res.ok && result.success && "ok" in result.data) {
        const sent = submitEvent(plans);
        track(sent.name, sent.properties);
        pushConversion(sent);
        setStatus({ kind: "done" });
        return;
      }
      const failure = result.success && "error" in result.data ? result.data : null;
      if (failure?.fields) {
        const fields = failure.fields;
        setErrors(Object.fromEntries(ERROR_FIELDS.flatMap((name) => (fields[name]?.[0] ? [[name, fields[name][0]]] : []))));
        const firstServerError = ERROR_FIELDS.find((name) => fields[name]?.[0]);
        if (firstServerError) focusField(form, firstServerError);
      }
      setStatus({ kind: "error", message: failure?.error ?? CONTACT_ERRORS.send });
    } catch {
      setStatus({ kind: "error", message: CONTACT_ERRORS.send });
    }
  }

  if (status.kind === "done") {
    return (
      <div ref={doneRef} role="status" tabIndex={-1} className="grid justify-items-start gap-3.5 p-[clamp(24px,3vw,36px)] outline-none">
        <CheckCircle aria-hidden="true" weight="fill" className="size-10 text-sage" />
        <b className="font-display text-[26px] font-medium tracking-[-0.03em]">{CONTACT_FORM_COPY.doneTitle}</b>
        <p className="max-w-[44ch] text-ink-2">{CONTACT_FORM_COPY.doneBody}</p>
        <WhatsAppButton location="contact_done" />
      </div>
    );
  }

  const field = (name: Field, rest: { readonly autoComplete: string; readonly type?: string; readonly inputMode?: "tel"; readonly optional?: boolean; readonly full?: boolean; readonly multiline?: boolean }): ReactElement => {
    const id = `ct-${name}`;
    const props = {
      id,
      name,
      autoComplete: rest.autoComplete,
      placeholder: CONTACT_PLACEHOLDERS[name],
      maxLength: CONTACT_MAX[name],
      required: !rest.optional,
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": `${id}-err`,
      onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => onBlur(event, name),
      onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => onInput(event, name),
      className: "ct-input",
    };
    return (
      <div className={`grid min-w-0 content-start gap-2 ${rest.full ? "col-span-full" : ""}`}>
        <label htmlFor={id} className="ct-label">
          {CONTACT_LABELS[name]}
          {rest.optional ? <small>{CONTACT_LABELS.optional}</small> : <span aria-hidden="true" className="ml-1 font-semibold text-error">*</span>}
        </label>
        {rest.multiline ? <textarea {...props} /> : <input {...props} type={rest.type ?? "text"} inputMode={rest.inputMode} />}
        <p id={`${id}-err`} hidden={!errors[name]} className="text-[13px] text-error">{errors[name]}</p>
      </div>
    );
  };

  const submitting = status.kind === "submitting";
  return (
    <form ref={formRef} method="post" noValidate onSubmit={onSubmit} aria-labelledby="ct-form-title" aria-busy={submitting} className="relative">
      <header className="ct-head">
        <h2 id="ct-form-title">{CONTACT_FORM_COPY.title}</h2>
        <p>{CONTACT_FORM_COPY.guidance}</p>
      </header>
      <div className="ct-body">
        <div className="ct-fields">
          {field("name", { autoComplete: "name" })}
          {field("phone", { autoComplete: "tel", type: "tel", inputMode: "tel", optional: true })}
          {field("business", { autoComplete: "organization" })}
          {field("city", { autoComplete: "address-level2", optional: true })}
          {field("email", { autoComplete: "email", type: "email", full: true })}
          {field("message", { autoComplete: "off", full: true, multiline: true })}
        </div>

        {/* Decoys for bots: off screen, out of the tab order and hidden from assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-0 size-px overflow-hidden">
          {HONEYPOT_FIELDS.map((name) => <input key={name} type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />)}
        </div>

        {status.kind === "error" ? <p role="alert" className="rounded-[14px] border border-error/25 bg-error/5 p-4 text-sm text-error">{status.message}</p> : null}

        <div className="ct-foot">
          <div className="grid gap-1.5">
            <label className="ct-consent">
              <input type="checkbox" name="consent" id="ct-consent" required aria-invalid={errors.consent ? true : undefined} aria-describedby="ct-consent-err ct-notice" onChange={() => { if (errors.consent) setErrors((current) => ({ ...current, consent: "" })); }} />
              <span aria-hidden="true" className="ct-box"><Check weight="bold" className="size-3.5" /></span>
              <span>
                {CONTACT_FORM_COPY.consent} <Link href="/privacy" target="_blank" rel="noopener" className="text-ink underline decoration-rattan decoration-2 underline-offset-4">{CONTACT_FORM_COPY.privacyLink}</Link>.{" "}
                <span id="ct-notice" className="text-ink-2">{CONTACT_FORM_COPY.notice}</span>{" "}
                <span aria-hidden="true" className="font-semibold text-error">*</span>
              </span>
            </label>
            <p id="ct-consent-err" hidden={!errors.consent} className="pl-[34px] text-[13px] text-error">{errors.consent}</p>
          </div>
          <ArrowSubmitButton disabled={submitting} className="justify-self-start max-[560px]:w-full max-[560px]:justify-center">
            {submitting ? CONTACT_FORM_COPY.submitting : CONTACT_FORM_COPY.submit}
          </ArrowSubmitButton>
        </div>
      </div>
    </form>
  );
}
