"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { type ReactElement, useId } from "react";
import { calendarWeeks, dateOf, shiftCalendarMonth } from "@/lib/ecommerce-booking-calendar";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const monthLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
const dayLabel = new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeZone: "UTC" });

interface Props {
  readonly month: string;
  readonly earliestMonth: string;
  readonly latestMonth: string;
  readonly today: string;
  readonly available: ReadonlySet<string>;
  readonly selected: string | null;
  readonly disabled: boolean;
  readonly onMonthChange: (month: string) => void;
  readonly onSelect: (date: string) => void;
}

export function BookingMonth({ month, earliestMonth, latestMonth, today, available, selected, disabled, onMonthChange, onSelect }: Props): ReactElement {
  const titleId = useId();
  return (
    <div className="store-campaign-month">
      <div className="store-campaign-month-heading">
        <h4 id={titleId} aria-live="polite">{monthLabel.format(dateOf(`${month}-01`))}</h4>
        <div className="store-campaign-month-navigation">
          <button type="button" aria-label="Previous month" disabled={disabled || month <= earliestMonth} onClick={() => onMonthChange(shiftCalendarMonth(month, -1))}>
            <CaretLeft size={17} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next month" disabled={disabled || month >= latestMonth} onClick={() => onMonthChange(shiftCalendarMonth(month, 1))}>
            <CaretRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      <table className="store-campaign-month-days" aria-labelledby={titleId}>
        <thead>
          <tr>
            {WEEKDAYS.map((day) => <th scope="col" key={day}><abbr title={day}>{day.slice(0, 3)}</abbr></th>)}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks(month).map((week) => (
            <tr key={week.join(",")}>
              {week.map((date, column) => (
                <td key={date ?? `empty-${column}`}>
                  {date !== null && (
                    <button
                      type="button"
                      aria-label={dayLabel.format(dateOf(date))}
                      aria-current={date === today ? "date" : undefined}
                      aria-pressed={date === selected}
                      disabled={disabled || date < today || !available.has(date)}
                      onClick={() => onSelect(date)}
                    >
                      {dateOf(date).getUTCDate()}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
