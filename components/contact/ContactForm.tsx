"use client";
// components/contact/ContactForm.tsx
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactElement } from "react";
import { z } from "zod";
import { ArrowSubmitButton } from "@/components/ui/ArrowButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { submitEvent } from "@/lib/analytics";
import { CONTACT_ERRORS, CONTACT_FORM_COPY, CONTACT_LABELS, CONTACT_TOPIC_LABELS, CONTACT_TOPIC_LEGEND } from "@/content/contact";
import { basket, DEFAULT_BASKET } from "@/lib/basket-store";
import { CONTACT_MAX, CONTACT_TOPICS, contactSchema, parsePlanParam, parseTopicParam } from "@/lib/contact-schema";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { basketPlans, type PlanId, samePick } from "@/lib/pricing";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS, planTokenUse } from "@/lib/security/form-fields";

type Field = "name" | "phone" | "business" | "city" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = { readonly kind: "idle" | "submitting" | "done" } | { readonly kind: "error"; readonly message: string };

/** Fields with a rule beyond their length cap, in page order (the mock's validation script checks the same four). */
const CHECKED: readonly Field[] = ["name", "phone", "business", "email"];
const FIELDS: readonly Field[] = ["name", "phone", "business", "city", "email", "message"];

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
    const topic = parseTopicParam(new URLSearchParams(window.location.search).get("topic"));
    const radio = topic ? formRef.current?.querySelector<HTMLInputElement>(`input[name="topic"][value="${topic}"]`) : null;
    if (radio) radio.checked = true;
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

  function focusField(form: HTMLFormElement, name: Field): void {
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
    setErrors(next);
    const firstInvalid = CHECKED.find((name) => next[name]);
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
      topic: value("topic"),
      ...Object.fromEntries(FIELDS.map((name) => [name, value(name)])),
      plans,
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
        setStatus({ kind: "done" });
        return;
      }
      const failure = result.success && "error" in result.data ? result.data : null;
      if (failure?.fields) {
        const fields = failure.fields;
        setErrors(Object.fromEntries(FIELDS.flatMap((name) => (fields[name]?.[0] ? [[name, fields[name][0]]] : []))));
        const firstServerError = FIELDS.find((name) => fields[name]?.[0]);
        if (firstServerError) focusField(form, firstServerError);
      }
      setStatus({ kind: "error", message: failure?.error ?? CONTACT_ERRORS.send });
    } catch {
      setStatus({ kind: "error", message: CONTACT_ERRORS.send });
    }
  }

  if (status.kind === "done") {
    return (
      <div ref={doneRef} role="status" tabIndex={-1} className="grid justify-items-start gap-3.5 py-2 outline-none">
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
      maxLength: CONTACT_MAX[name],
      required: !rest.optional,
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": `${id}-err`,
      onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => onBlur(event, name),
      onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => onInput(event, name),
      className: `w-full rounded-[10px] border border-[color-mix(in_srgb,var(--ink-2)_70%,var(--surface))] bg-bg px-3.5 py-3 text-base text-ink transition-[border-color,box-shadow,background-color] duration-[250ms] ease-[var(--ease)] focus:border-ink focus:bg-surface focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--rattan)_35%,transparent)] focus:outline-none aria-invalid:border-error ${rest.multiline ? "min-h-[132px] resize-y" : ""}`,
    };
    return (
      <div className={`grid min-w-0 content-start gap-1.5 ${rest.full ? "col-span-full" : ""}`}>
        <label htmlFor={id} className="text-sm font-semibold">
          {CONTACT_LABELS[name]}
          {rest.optional ? <small className="ml-1 text-[13px] font-normal text-ink-2">{CONTACT_LABELS.optional}</small> : null}
        </label>
        {rest.multiline ? <textarea {...props} /> : <input {...props} type={rest.type ?? "text"} inputMode={rest.inputMode} />}
        <p id={`${id}-err`} hidden={!errors[name]} className="text-[13px] text-error">{errors[name]}</p>
      </div>
    );
  };

  const submitting = status.kind === "submitting";
  return (
    <form ref={formRef} method="post" noValidate onSubmit={onSubmit} aria-labelledby="ct-form-title" aria-busy={submitting} className="relative grid gap-7">
      <header className="grid gap-2 border-b border-line pb-6">
        <h2 id="ct-form-title" className="font-display text-[28px] font-medium leading-tight tracking-[-0.03em]">{CONTACT_FORM_COPY.title}</h2>
        <p className="text-sm leading-relaxed text-ink-2">{CONTACT_FORM_COPY.guidance}</p>
      </header>
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-3 p-0 text-sm font-semibold">{CONTACT_TOPIC_LEGEND}</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONTACT_TOPICS.map((topic) => (
            <label key={topic} className="relative">
              <input type="radio" name="topic" value={topic} defaultChecked={topic === "website"} className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0" />
              <span className="flex min-h-12 h-full items-center gap-2.5 rounded-[12px] border border-line bg-surface px-3.5 py-3 text-sm font-medium transition-colors before:size-4 before:flex-none before:rounded-full before:border before:border-ink-2 before:bg-surface before:shadow-[inset_0_0_0_3px_var(--surface)] before:content-[''] peer-hover:border-ink-2 peer-checked:border-rattan-ink peer-checked:bg-rattan-wash peer-checked:before:border-rattan-ink peer-checked:before:bg-rattan-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rattan">
                {CONTACT_TOPIC_LABELS[topic]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-4 p-0 text-sm font-semibold">{CONTACT_FORM_COPY.detailsLegend}</legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          {field("name", { autoComplete: "name" })}
          {field("phone", { autoComplete: "tel", type: "tel", inputMode: "tel", optional: true })}
          {field("business", { autoComplete: "organization" })}
          {field("city", { autoComplete: "address-level2", optional: true })}
          {field("email", { autoComplete: "email", type: "email", full: true })}
          {field("message", { autoComplete: "off", optional: true, full: true, multiline: true })}
        </div>
      </fieldset>

      {/* Decoys for bots: off screen, out of the tab order and hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 size-px overflow-hidden">
        {HONEYPOT_FIELDS.map((name) => <input key={name} type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />)}
      </div>

      {status.kind === "error" ? <p role="alert" className="rounded-[10px] border border-error/25 bg-error/5 p-4 text-sm text-error">{status.message}</p> : null}

      <div className="grid gap-4 border-t border-line pt-5">
        <p id="ct-notice" className="max-w-[38ch] text-[13px] text-ink-2">
          {CONTACT_FORM_COPY.notice} <Link href="/privacy" className="text-ink underline">{CONTACT_FORM_COPY.privacyLink}</Link>.
        </p>
        <ArrowSubmitButton disabled={submitting} describedBy="ct-notice" className="w-full justify-between">
          {submitting ? CONTACT_FORM_COPY.submitting : CONTACT_FORM_COPY.submit}
        </ArrowSubmitButton>
      </div>
    </form>
  );
}
