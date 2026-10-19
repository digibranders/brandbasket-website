"use client";
// components/contact/ContactForm.tsx
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactElement } from "react";
import { z } from "zod";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CONTACT_ERRORS, CONTACT_FORM_COPY, CONTACT_LABELS, CONTACT_TOPIC_LABELS, CONTACT_TOPIC_LEGEND } from "@/content/contact";
import { basket } from "@/lib/basket-store";
import { CONTACT_MAX, CONTACT_TOPICS, contactSchema, parsePlanParam, parseTopicParam } from "@/lib/contact-schema";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { ADDONS, basketPlans, type PlanId } from "@/lib/pricing";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS } from "@/lib/security/form-fields";

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

/** `?plan=` wins (signupHref writes it); otherwise a basket picked earlier in this visit. Empty means a general enquiry. */
function pagePlans(): PlanId[] {
  const fromUrl = parsePlanParam(new URLSearchParams(window.location.search).get("plan"));
  if (fromUrl.length > 0) return fromUrl;
  const pick = basket.get();
  return ADDONS.some((id) => pick[id]) ? basketPlans(pick).map((plan) => plan.id) : [];
}

export function ContactForm(): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    const topic = parseTopicParam(new URLSearchParams(window.location.search).get("topic"));
    const radio = topic ? formRef.current?.querySelector<HTMLInputElement>(`input[name="topic"][value="${topic}"]`) : null;
    if (radio) radio.checked = true;

    const controller = new AbortController();
    fetch("/api/form-token", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        const parsed = tokenResponse.safeParse(data);
        if (parsed.success) tokenRef.current = parsed.data.token;
      })
      // No token means the submit shows the WhatsApp message instead of posting.
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (status.kind === "done") doneRef.current?.focus();
  }, [status.kind]);

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
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (!tokenRef.current) {
      setStatus({ kind: "error", message: CONTACT_ERRORS.send });
      return;
    }

    setStatus({ kind: "submitting" });
    const body = {
      topic: value("topic"),
      ...Object.fromEntries(FIELDS.map((name) => [name, value(name)])),
      plans: pagePlans(),
      noticeVersion: LEGAL_TEXT_VERSION,
      [FORM_TOKEN_FIELD]: tokenRef.current,
      ...Object.fromEntries(HONEYPOT_FIELDS.map((name) => [name, value(name)])),
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = contactResponse.safeParse(await res.json().catch(() => null));
      if (res.ok && result.success && "ok" in result.data) {
        setStatus({ kind: "done" });
        return;
      }
      const failure = result.success && "error" in result.data ? result.data : null;
      if (failure?.fields) {
        const fields = failure.fields;
        setErrors(Object.fromEntries(FIELDS.flatMap((name) => (fields[name]?.[0] ? [[name, fields[name][0]]] : []))));
      }
      setStatus({ kind: "error", message: failure?.error ?? CONTACT_ERRORS.send });
    } catch {
      setStatus({ kind: "error", message: CONTACT_ERRORS.send });
    }
  }

  if (status.kind === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} className="grid justify-items-start gap-3.5 py-2 outline-none">
        <CheckCircle aria-hidden="true" weight="fill" className="size-10 text-sage" />
        <b className="font-display text-[26px] font-medium tracking-[-0.03em]">{CONTACT_FORM_COPY.doneTitle}</b>
        <p className="max-w-[44ch] text-ink-2">{CONTACT_FORM_COPY.doneBody}</p>
        <WhatsAppButton />
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
      className: `w-full rounded-[14px] border border-line bg-bg px-3.5 py-3 text-base text-ink transition-[border-color,box-shadow,background-color] duration-[250ms] ease-[var(--ease)] focus:border-ink focus:bg-surface focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--rattan)_35%,transparent)] focus:outline-none aria-invalid:border-error ${rest.multiline ? "min-h-[116px] resize-y" : ""}`,
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
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-[22px]">
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-3 p-0 font-display text-xl font-medium tracking-[-0.02em]">{CONTACT_TOPIC_LEGEND}</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((topic) => (
            <label key={topic} className="relative">
              <input type="radio" name="topic" value={topic} defaultChecked={topic === "website"} className="peer absolute inset-0 m-0 cursor-pointer opacity-0" />
              <span className="inline-flex items-center gap-[9px] rounded-full border border-line bg-bg py-[9px] pl-[11px] pr-[15px] text-[14.5px] font-medium transition-[border-color,background-color] duration-[250ms] ease-[var(--ease)] before:size-3.5 before:flex-none before:rounded-full before:border-[1.5px] before:border-[color-mix(in_srgb,var(--ink-2)_60%,transparent)] before:bg-surface before:shadow-[inset_0_0_0_3px_var(--surface)] before:transition-[background-color,border-color] before:duration-[250ms] before:content-[''] peer-[:hover:not(:checked)]:border-ink-2 peer-checked:border-ink peer-checked:bg-surface peer-checked:before:border-ink peer-checked:before:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rattan">
                {CONTACT_TOPIC_LABELS[topic]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-x-3.5 gap-y-4 max-[560px]:grid-cols-1">
        {field("name", { autoComplete: "name" })}
        {field("phone", { autoComplete: "tel", type: "tel", inputMode: "tel" })}
        {field("business", { autoComplete: "organization" })}
        {field("city", { autoComplete: "address-level2", optional: true })}
        {field("email", { autoComplete: "email", type: "email", optional: true, full: true })}
        {field("message", { autoComplete: "off", optional: true, full: true, multiline: true })}
      </div>

      {/* Decoys for bots: off screen, out of the tab order and hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 size-px overflow-hidden">
        {HONEYPOT_FIELDS.map((name) => <input key={name} type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />)}
      </div>

      {status.kind === "error" ? <p role="alert" className="text-[13px] text-error">{status.message}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3.5">
        <p id="ct-notice" className="max-w-[38ch] text-[13px] text-ink-2">
          {CONTACT_FORM_COPY.notice} <Link href="/privacy" className="text-ink underline">{CONTACT_FORM_COPY.privacyLink}</Link>.
        </p>
        <button type="submit" disabled={submitting} aria-describedby="ct-notice" className="group inline-flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-full bg-action py-[7px] pl-[22px] pr-[7px] text-[15px] font-semibold text-action-ink transition-transform duration-500 ease-[var(--ease)] active:scale-[0.98] disabled:cursor-wait max-[560px]:w-full max-[560px]:justify-between">
          {submitting ? CONTACT_FORM_COPY.submitting : CONTACT_FORM_COPY.submit}
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-rattan text-ink transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-[1.06]">
            <svg viewBox="0 0 16 16" className="size-[15px]"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </button>
      </div>
    </form>
  );
}
