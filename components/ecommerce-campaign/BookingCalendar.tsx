"use client";

import { CalendarDots } from "@phosphor-icons/react";
import { type FormEvent, type ReactElement, useEffect, useRef, useState } from "react";
import { useFormToken } from "@/components/start/use-form-token";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS } from "@/lib/security/form-fields";
import { ArrowSubmitButton } from "@/components/ui/ArrowButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { campaignWhatsAppMessage, type CampaignSource } from "@/content/ecommerce-campaign";
import { availability, bookingConfirmation, ECOMMERCE_BOOKING_API } from "@/lib/ecommerce-booking";
import { calendarDate, calendarMonth, dateOf } from "@/lib/ecommerce-booking-calendar";
import { BookingMonth } from "./BookingMonth";

interface Props {
  readonly source: CampaignSource | null;
  readonly testimonialOptIn: boolean;
  readonly fallback: string | null;
}
interface Day {
  readonly date: string;
  readonly times: readonly string[];
}
type SlotState = { readonly kind: "loading" | "failed" } | { readonly kind: "ready"; readonly days: readonly Day[] };
type Confirmation = { readonly start: string; readonly status: "accepted" | "pending" };

const dayLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export default function BookingCalendar({ source, testimonialOptIn, fallback }: Props): ReactElement {
  const [timeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata");
  const [slots, setSlots] = useState<SlotState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [month, setMonth] = useState<string | null>(null);
  const [choice, setChoice] = useState<{ readonly date: string; readonly start: string | null } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const submitLock = useRef(false);
  const readyToken = useFormToken();
  const heading = useRef<HTMLHeadingElement>(null);
  const clock = new Intl.DateTimeFormat("en-IN", { timeZone, hour: "numeric", minute: "2-digit" });
  const fullTime = new Intl.DateTimeFormat("en-IN", { timeZone, dateStyle: "full", timeStyle: "short" });

  useEffect(() => {
    heading.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ timeZone });
    void (async (): Promise<void> => {
      try {
        const response = await fetch(`${ECOMMERCE_BOOKING_API}?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Availability request failed");
        const result = availability.parse(await response.json());
        if (!controller.signal.aborted) setSlots({ kind: "ready", days: result.days });
      } catch {
        if (!controller.signal.aborted) setSlots({ kind: "failed" });
      }
    })();
    return () => controller.abort();
  }, [attempt, timeZone]);

  function reload(): void {
    setMonth(null);
    setChoice(null);
    setSlots({ kind: "loading" });
    setAttempt((value) => value + 1);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const start = choice?.start;
    if (!start || submitLock.current) return;
    const form = new FormData(event.currentTarget);
    submitLock.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const token = await readyToken();
      if (token === null) {
        setError("We couldn’t open the booking form. Try again or contact us on WhatsApp.");
        return;
      }
      const response = await fetch(ECOMMERCE_BOOKING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          start,
          timeZone,
          source,
          testimonialOptIn,
          [FORM_TOKEN_FIELD]: token,
          ...Object.fromEntries(HONEYPOT_FIELDS.map((field) => [field, form.get(field)])),
        }),
      });
      if (response.status === 409) {
        setError("That time was just taken. Choose another time below.");
        reload();
      } else if (response.status === 429) {
        setError("There have been several booking attempts. Please wait a few minutes or contact us on WhatsApp.");
      } else if (response.ok) {
        setConfirmation(bookingConfirmation.parse(await response.json()));
      } else {
        setError("We couldn’t confirm this booking. Check your email for an invitation before trying again, or contact us on WhatsApp.");
      }
    } catch {
      setError("We couldn’t confirm this booking. Check your email for an invitation before trying again, or contact us on WhatsApp.");
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  const today = calendarDate(new Date(), timeZone);
  const days = slots.kind === "ready" ? slots.days.filter(({ date }) => date >= today) : [];
  const earliestMonth = calendarMonth(today);
  const latestMonth = calendarMonth(days.at(-1)?.date ?? today);
  const visibleMonth = month ?? calendarMonth(days[0]?.date ?? today);
  const selected = days.find(({ date }) => date === choice?.date)
    ?? days.find(({ date }) => calendarMonth(date) === visibleMonth);
  const contact = (
    <div className="store-campaign-actions">
      <WhatsAppButton location="ecommerce_campaign_calendar" message={campaignWhatsAppMessage(source, testimonialOptIn)} />
      {fallback && <a className="store-campaign-link" href={fallback} target="_blank" rel="noopener noreferrer">Open Cal.com</a>}
    </div>
  );
  return (
    <>
      <div className="store-campaign-calendar-header">
        <CalendarDots size={32} weight="duotone" aria-hidden="true" />
        <h3 ref={heading} tabIndex={-1}>Book a store planning call</h3>
        <p>Tell us about your catalog, delivery and launch plans. Times are in {timeZone.replaceAll("_", " ")}.</p>
      </div>
      {error && <p className="store-campaign-error" role="alert">{error}</p>}
      {confirmation ? (
        <div className="store-campaign-confirmation" role="status">
          <h4>{confirmation.status === "accepted" ? "Your call is booked." : "Booking request sent."}</h4>
          <p>{fullTime.format(new Date(confirmation.start))}. Check your email for the meeting details.</p>
        </div>
      ) : slots.kind === "loading" ? <p role="status">Looking for available dates…</p>
        : slots.kind === "failed" ? (
          <div className="store-campaign-calendar-status">
            <p role="alert">We couldn’t load the calendar. Try again or arrange a call on WhatsApp.</p>
            <button className="store-campaign-link" type="button" onClick={reload}>Try again</button>
            {contact}
          </div>
        ) : (
          <div className="store-campaign-calendar-grid">
            <BookingMonth
              month={visibleMonth}
              earliestMonth={earliestMonth}
              latestMonth={latestMonth}
              today={today}
              available={new Set(days.map(({ date }) => date))}
              selected={selected?.date ?? null}
              disabled={submitting}
              onMonthChange={(nextMonth) => { setMonth(nextMonth); setChoice(null); setError(null); }}
              onSelect={(date) => { if (date !== selected?.date) setChoice({ date, start: null }); setError(null); }}
            />
            <div className="store-campaign-time-panel">
              {selected ? (
                <>
                  <h4>{dayLabel.format(dateOf(selected.date))}</h4>
                  <div className="store-campaign-times" role="group" aria-label="Available times">
                    {selected.times.map((start) => <button key={start} type="button" disabled={submitting} aria-pressed={choice?.start === start} onClick={() => { setChoice({ date: selected.date, start }); setError(null); }}>{clock.format(new Date(start))}</button>)}
                  </div>
                  {choice?.start && (
                    <form className="store-campaign-attendee" onSubmit={(event) => { void submit(event); }}>
                      <p><strong>{fullTime.format(new Date(choice.start))}</strong></p>
                      <label>Your name<input name="name" autoComplete="name" required maxLength={100} disabled={submitting} /></label>
                      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} disabled={submitting} /></label>
                      <div className="sr-only" aria-hidden="true">
                        {HONEYPOT_FIELDS.map((name) => <input key={name} name={name} tabIndex={-1} autoComplete="off" />)}
                      </div>
                      <ArrowSubmitButton disabled={submitting}>{submitting ? "Confirming…" : "Confirm my booking"}</ArrowSubmitButton>
                    </form>
                  )}
                </>
              ) : days.length === 0 ? (
                <div className="store-campaign-calendar-status"><p>There are no times available in the next four weeks. Chat with us to arrange a call.</p>{contact}</div>
              ) : (
                <p className="store-campaign-calendar-hint">There are no available times this month. Use the calendar arrows to see other dates.</p>
              )}
            </div>
          </div>
        )}
      {fallback && slots.kind === "ready" && days.length > 0 && !confirmation && (
        <a className="store-campaign-link" href={fallback} target="_blank" rel="noopener noreferrer">Open the calendar on Cal.com</a>
      )}
    </>
  );
}
