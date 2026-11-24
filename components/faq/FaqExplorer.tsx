"use client";
import type { Icon } from "@phosphor-icons/react";
import { ChartLineUp, CurrencyInr, Globe, Headset, MagnifyingGlass, Palette, Plus, PuzzlePiece, ShieldCheck, Timer, TrendUp, Wrench, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { type ReactElement, type ReactNode, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import "@/components/faq/faq.css";
import { FaqAnswerBody } from "@/components/faq/FaqAnswer";
import type { FaqChip, FaqIconKey, FaqQuestion, FaqTopic } from "@/content/faq";

/** A question with its lower-case search text, worked out on the server so this island ships no copy of its own. */
export interface ExplorerQuestion extends FaqQuestion {
  readonly hay: string;
}

export interface ExplorerTopic extends Omit<FaqTopic, "groups"> {
  readonly groups: readonly { readonly heading: string; readonly questions: readonly ExplorerQuestion[] }[];
}

export interface ExplorerCopy {
  readonly h1: string;
  readonly lede: string;
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly clear: string;
  readonly topicsLabel: string;
  readonly emptyHeading: string;
  readonly emptyBody: string;
  readonly emptyLink: string;
  readonly emptyHref: string;
}

interface FaqExplorerProps {
  readonly topics: readonly ExplorerTopic[];
  readonly copy: ExplorerCopy;
  readonly quick: readonly { readonly id: string; readonly label: string }[];
  readonly chipLabels: Readonly<Record<FaqChip, string>>;
  /** The plan card, rendered on the server and set beside the headline. */
  readonly aside: ReactNode;
}

const ICONS: Readonly<Record<FaqIconKey, Icon>> = { CurrencyInr, Palette, Timer, Globe, Wrench, ChartLineUp, ShieldCheck, PuzzlePiece, Headset, TrendUp };

const CHIP_STYLE: Readonly<Record<FaqChip, string>> = {
  yes: "bg-[color-mix(in_srgb,var(--sage)_14%,var(--surface))] text-[color-mix(in_srgb,var(--sage)_82%,var(--ink))]",
  no: "bg-sunken text-ink-2",
  "not-included": "bg-sunken text-ink-2",
  extra: "bg-rattan-wash text-rattan-ink",
  "not-guaranteed": "bg-rattan-wash text-rattan-ink",
};

const GUTTER = "clamp(18px,4vw,56px)";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The question with every searched word marked. */
function Marked({ text, words }: { readonly text: string; readonly words: readonly string[] }): ReactElement {
  if (words.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${words.map(escapeRegExp).join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <mark key={`${part}-${i}`} className="rounded bg-rattan-wash px-0.5 text-inherit">{part}</mark> : part))}
    </>
  );
}

/**
 * The FAQ page's top half: headline, search and the plan card, then the topic list beside the questions. All the questions are in the
 * page's HTML (the ones not on screen are only hidden), so search engines and readers without script still have them. Search narrows
 * every topic at once; a link to #q-... opens that question; a link to #t-... opens that topic.
 */
export function FaqExplorer({ topics, copy, quick, chipLabels, aside }: FaqExplorerProps): ReactElement {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(topics[0]?.slug ?? "");
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const pending = useRef<string | null>(null);
  const strip = useRef<HTMLUListElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const browse = useRef<HTMLElement>(null);

  const searching = query.trim().length > 1;
  const words = useMemo(() => (searching ? query.trim().toLowerCase().split(/\s+/).filter(Boolean) : []), [query, searching]);
  const matches = useMemo(() => {
    if (!searching) return null;
    const all = topics.flatMap((topic) => topic.groups.flatMap((group) => group.questions));
    return new Set(all.filter((question) => words.every((word) => question.hay.includes(word))).map((question) => question.id));
  }, [topics, words, searching]);
  const hits = matches?.size ?? 0;
  const autoOpen = searching && hits <= 4;

  const goTo = useCallback(
    (hash: string) => {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      const topic = id.startsWith("t-") ? topics.find((candidate) => `t-${candidate.slug}` === id) : topics.find((candidate) => candidate.groups.some((group) => group.questions.some((question) => `q-${question.id}` === id)));
      if (topic === undefined) return;
      pending.current = id.startsWith("q-") ? id : null;
      setQuery("");
      setActive(topic.slug);
      bump();
    },
    [topics],
  );

  // After a link to a question has switched topic, open it and bring it to the middle of the screen.
  useEffect(() => {
    const id = pending.current;
    if (id === null) return;
    pending.current = null;
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) {
      el.open = true;
      el.scrollIntoView({ block: "center" });
    }
  });

  useEffect(() => {
    const run = (): void => {
      if (window.location.hash !== "") goTo(window.location.hash);
    };
    run();
    window.addEventListener("hashchange", run);
    return () => window.removeEventListener("hashchange", run);
  }, [goTo]);

  // On phones the topics are a strip: keep the open topic in view.
  useEffect(() => {
    const el = strip.current;
    const on = el?.querySelector<HTMLElement>("[aria-current]");
    if (el && on) el.scrollTo({ left: on.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - 8 });
  }, [active]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        field.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const pickTopic = (slug: string): void => {
    window.history.replaceState(null, "", `#t-${slug}`);
    setQuery("");
    setActive(slug);
    const top = browse.current;
    if (top !== null && top.getBoundingClientRect().top < 0) window.scrollTo({ top: window.scrollY + top.getBoundingClientRect().top - 88 });
  };

  const shown = (topic: ExplorerTopic): number => (matches === null ? topic.count : topic.groups.reduce((sum, group) => sum + group.questions.filter((question) => matches.has(question.id)).length, 0));

  return (
    <>
      <section aria-labelledby="h-faq" className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
        <div className="in-wrap relative grid grid-cols-[minmax(0,1fr)] gap-10 pb-14 pt-32 min-[1040px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[1040px]:items-center min-[1040px]:gap-16">
          <div className="min-w-0">
            <h1 id="h-faq" className="max-w-[14ch] font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-[1.02] tracking-[-0.045em]">{copy.h1}</h1>
            <p className="mt-5 max-w-[46ch] text-lg text-ink-2">{copy.lede}</p>
            <form role="search" onSubmit={(event) => event.preventDefault()} className="relative mt-9 max-w-[620px]">
              <label htmlFor="faq-search" className="sr-only">{copy.searchLabel}</label>
              <MagnifyingGlass aria-hidden="true" weight="regular" className="pointer-events-none absolute left-[18px] top-1/2 size-[18px] -translate-y-1/2 text-ink-2" />
              <input
                id="faq-search"
                ref={field}
                type="search"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("");
                }}
                placeholder={copy.searchPlaceholder}
                className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-24 text-base text-ink transition-colors duration-300 placeholder:text-ink-2 hover:border-ink-2 focus-visible:border-ink focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query === "" ? (
                <kbd aria-hidden="true" className="absolute right-[18px] top-1/2 hidden -translate-y-1/2 rounded-md bg-sunken px-2 py-px font-mono text-xs text-ink-2 min-[720px]:block">/</kbd>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    field.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-1 rounded-full bg-sunken pl-2.5 pr-3 text-[13px] font-semibold text-ink transition-colors duration-300 hover:bg-rattan-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rattan-ink"
                >
                  <X aria-hidden="true" weight="bold" className="size-4" />
                  {copy.clear}
                </button>
              )}
            </form>
            <ul className="mt-5 flex flex-wrap gap-2">
              {quick.map((item) => (
                <li key={item.id}>
                  <a href={`#q-${item.id}`} className="block rounded-full border border-line bg-surface px-4 py-2 text-[14.5px] font-medium transition-[background-color,transform] duration-500 ease-[var(--ease)] hover:-translate-y-px hover:bg-rattan-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rattan-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">{aside}</div>
        </div>
      </section>

      <section id="faq" ref={browse} aria-label={copy.topicsLabel} className="in-wrap pb-16 pt-6 min-[640px]:pb-24">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 min-[1040px]:grid-cols-[284px_minmax(0,1fr)] min-[1040px]:items-start min-[1040px]:gap-16">
          <nav
            aria-label={copy.topicsLabel}
            style={{ marginInline: `calc(${GUTTER} * -1)`, paddingInline: GUTTER }}
            className="sticky top-16 z-20 transition-[top] duration-[420ms] ease-[var(--ease)] [html[data-nav='hidden']_&]:max-[1039px]:top-0 [html[data-nav='hidden']_&]:min-[1040px]:top-8 border-b border-line-2 bg-[var(--nav)] py-2.5 backdrop-blur-[14px] min-[1040px]:top-28 min-[1040px]:z-auto min-[1040px]:!mx-0 min-[1040px]:border-0 min-[1040px]:!px-0 min-[1040px]:bg-transparent min-[1040px]:py-0 min-[1040px]:backdrop-blur-none"
          >
            <ul ref={strip} className="faq-strip flex gap-2 overflow-x-auto min-[1040px]:grid min-[1040px]:gap-1 min-[1040px]:overflow-visible">
              {topics.map((topic) => {
                const TopicIcon = ICONS[topic.icon];
                const on = !searching && topic.slug === active;
                const n = shown(topic);
                return (
                  <li key={topic.slug} className="flex-none min-[1040px]:flex-auto">
                    <a
                      href={`#t-${topic.slug}`}
                      aria-current={on ? "true" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        pickTopic(topic.slug);
                      }}
                      className={`flex min-h-11 items-center gap-3 whitespace-nowrap rounded-full border px-4 text-[15px] font-medium leading-tight transition-[background-color,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rattan-ink min-[1040px]:min-h-12 min-[1040px]:whitespace-normal min-[1040px]:border-transparent ${
                        on ? "border-ink bg-ink text-action-ink" : "border-line bg-surface text-ink-2 hover:text-ink min-[1040px]:bg-transparent min-[1040px]:hover:bg-line-2"
                      } ${searching && n === 0 ? "opacity-45" : ""}`}
                    >
                      <TopicIcon aria-hidden="true" className="hidden size-5 flex-none min-[1040px]:block" />
                      <span className="min-[1040px]:flex-1">{topic.name}</span>
                      <span className={`text-[13px] tabular-nums ${on ? "text-rattan-wash" : "text-ink-2"}`}>{n}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0">
            {searching ? (
              <p role="status" className="mb-7 font-display text-[clamp(24px,2.6vw,34px)] font-medium tracking-[-0.035em]">
                {hits === 0 ? "" : `${hits} ${hits === 1 ? "answer" : "answers"} for `}
                {hits === 0 ? null : <span className="text-rattan-ink">“{query.trim()}”</span>}
              </p>
            ) : null}
            {searching && hits === 0 ? (
              <div className="max-w-[52ch] pb-6">
                <h2 className="font-display text-[clamp(26px,3vw,38px)] font-normal leading-[1.1] tracking-[-0.04em]">{copy.emptyHeading}</h2>
                <p className="mt-3 text-ink-2">{copy.emptyBody}</p>
                <Link href={copy.emptyHref} className="mt-6 inline-flex rounded-full border border-ink px-6 py-3 text-[15px] font-semibold transition-colors duration-300 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rattan-ink">
                  {copy.emptyLink}
                </Link>
              </div>
            ) : null}
            {topics.map((topic) => {
              const visible = searching ? shown(topic) > 0 : topic.slug === active;
              return (
                <section key={topic.slug} id={`t-${topic.slug}`} aria-labelledby={`h-${topic.slug}`} hidden={!visible} className={`${searching ? "not-first:mt-14" : ""} scroll-mt-28 ${visible ? "faq-panel-in" : ""}`}>
                  <header className="flex items-baseline justify-between gap-6 border-b border-ink pb-5">
                    <h2 id={`h-${topic.slug}`} className="font-display text-[clamp(30px,3.4vw,46px)] font-normal leading-[1.04] tracking-[-0.045em]">{topic.name}</h2>
                    <p className="whitespace-nowrap text-[14.5px] tabular-nums text-ink-2">{shown(topic)} {shown(topic) === 1 ? "question" : "questions"}</p>
                  </header>
                  {topic.groups.map((group) => {
                    const items = matches === null ? group.questions : group.questions.filter((question) => matches.has(question.id));
                    if (items.length === 0) return null;
                    return (
                      <div key={group.heading} className="mt-9">
                        <h3 className="pb-1.5 text-[15px] font-semibold text-rattan-ink">{group.heading}</h3>
                        {items.map((question) => (
                          <details key={question.id} id={`q-${question.id}`} open={autoOpen || undefined} className="faq-q group border-b border-line">
                            <summary className="flex min-h-[68px] cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-rattan-ink min-[720px]:flex-nowrap [&::-webkit-details-marker]:hidden">
                              <span className="min-w-0 flex-1 basis-[calc(100%-60px)] font-display text-[17px] font-medium leading-[1.3] tracking-[-0.015em] transition-colors duration-300 group-hover:text-rattan-ink min-[720px]:basis-auto min-[720px]:text-[19px]">
                                <Marked text={question.q} words={words} />
                              </span>
                              {question.chip === undefined ? null : (
                                <span className={`order-3 flex-none rounded-full px-3 py-[7px] text-[13px] font-semibold leading-none min-[720px]:order-none ${CHIP_STYLE[question.chip]}`}>{chipLabels[question.chip]}</span>
                              )}
                              <span aria-hidden="true" className="order-2 grid size-10 flex-none place-items-center rounded-full border border-line bg-surface transition-[background-color,color,rotate,border-color] duration-500 ease-[var(--ease)] group-hover:bg-rattan-wash group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-action-ink group-open:group-hover:border-ink-2 group-open:group-hover:bg-ink-2 min-[720px]:order-none">
                                <Plus weight="bold" className="size-[18px]" />
                              </span>
                            </summary>
                            <div className="faq-ans max-w-[68ch] pb-6 text-[16px] leading-[1.65] text-ink-2 min-[720px]:pr-14">
                              <FaqAnswerBody answer={question.a} />
                            </div>
                          </details>
                        ))}
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
