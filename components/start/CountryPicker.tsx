"use client";
// components/start/CountryPicker.tsx
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import { type KeyboardEvent, type ReactElement, useEffect, useId, useRef, useState } from "react";
import { PHONE_COUNTRIES, type PhoneCountry } from "@/content/phone-countries";
import "./country-picker.css";

interface CountryPickerProps {
  readonly value: PhoneCountry;
  readonly onChange: (country: PhoneCountry) => void;
  /** Called after a country is picked, so the form can move the cursor to the number. */
  readonly onPicked?: () => void;
}

/** How long a run of typed letters counts as one search ("un" then "i" finds United). */
const TYPEAHEAD_MS = 700;
const LAST = PHONE_COUNTRIES.length - 1;

/**
 * The code in front of the mobile number: a button showing "+91" that opens a list of countries under the field. It is a
 * listbox in the usual way: the arrow keys, Home and End move, Enter or Space picks, Escape closes, and typing a country's
 * first letters jumps to it. The list is positioned against the field's box, which the caller makes `relative`.
 */
export function CountryPicker({ value, onChange, onPicked }: CountryPickerProps): ReactElement {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef<{ text: string; timer: ReturnType<typeof setTimeout> | undefined }>({ text: "", timer: undefined });
  const optionId = (index: number): string => `${id}-${PHONE_COUNTRIES[index]?.iso ?? "none"}`;

  // Focus moves into the list while it is open, and a press anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus({ preventScroll: true });
    const away = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // The highlighted country stays in view as the arrows move through a long list.
  useEffect(() => {
    if (open) document.getElementById(`${id}-${PHONE_COUNTRIES[active]?.iso ?? "none"}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const show = (): void => {
    setActive(Math.max(0, PHONE_COUNTRIES.findIndex((country) => country.iso === value.iso)));
    setOpen(true);
  };
  const pick = (country: PhoneCountry): void => {
    onChange(country);
    setOpen(false);
    if (onPicked) onPicked();
    else triggerRef.current?.focus();
  };
  const jumpTo = (letter: string): void => {
    clearTimeout(typed.current.timer);
    typed.current.text += letter.toLowerCase();
    typed.current.timer = setTimeout(() => { typed.current.text = ""; }, TYPEAHEAD_MS);
    const found = PHONE_COUNTRIES.findIndex((country) => country.name.toLowerCase().startsWith(typed.current.text));
    if (found >= 0) setActive(found);
  };

  const onTriggerKey = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      show();
    }
  };
  const onListKey = (event: KeyboardEvent<HTMLUListElement>): void => {
    switch (event.key) {
      case "ArrowDown": event.preventDefault(); setActive((index) => Math.min(LAST, index + 1)); break;
      case "ArrowUp": event.preventDefault(); setActive((index) => Math.max(0, index - 1)); break;
      case "Home": event.preventDefault(); setActive(0); break;
      case "End": event.preventDefault(); setActive(LAST); break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const country = PHONE_COUNTRIES[active];
        if (country) pick(country);
        break;
      }
      case "Escape": event.preventDefault(); setOpen(false); triggerRef.current?.focus(); break;
      case "Tab": setOpen(false); break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) jumpTo(event.key);
    }
  };

  return (
    <div ref={rootRef} className="flex">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={`Country code: ${value.name}, ${value.dial}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onTriggerKey}
        className="flex h-full cursor-pointer items-center gap-1.5 border-r border-line bg-transparent pl-4 pr-3 text-[15px] text-ink-2 outline-none! transition-colors duration-200 hover:text-ink"
      >
        <span className="num">{value.dial}</span>
        <CaretDown aria-hidden="true" size={12} weight="bold" className={`transition-transform duration-300 ease-[var(--ease)] ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label="Country code"
          aria-activedescendant={optionId(active)}
          onKeyDown={onListKey}
          className="country-pop absolute left-0 top-[calc(100%+8px)] z-30 max-h-[17.5rem] w-full overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-float)] outline-none!"
        >
          {PHONE_COUNTRIES.map((country, index) => {
            const selected = country.iso === value.iso;
            return (
              <li key={country.iso} role="presentation" className={index === 0 ? "mb-1.5 border-b border-line pb-1.5" : undefined}>
                <div
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => pick(country)}
                  className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 text-[15px] transition-colors duration-150 ${index === active ? "bg-sunken" : ""} ${selected ? "font-medium text-ink" : "text-ink-2"}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span aria-hidden="true" className="grid size-4 flex-none place-items-center text-rattan-text">{selected ? <Check size={14} weight="bold" /> : null}</span>
                    <span className="truncate">{country.name}</span>
                  </span>
                  <span className="num flex-none text-[14px] text-ink-2">{country.dial}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
