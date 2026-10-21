import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { ERROR_STATES, ERROR_UI, type ErrorKind } from "@/content/errors";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ErrorScene } from "./ErrorScene";
import "./errors.css";

interface ErrorExperienceProps {
  readonly kind: ErrorKind;
  readonly underNav: boolean;
  readonly retry?: () => void;
}

/** Also renders independently of layout providers in global-error. */
export function ErrorExperience({ kind, underNav, retry }: ErrorExperienceProps): ReactElement {
  const state = ERROR_STATES[kind];
  const canRetry = state.retryable && retry !== undefined;
  return (
    <section className={`error-experience ${underNav ? "error-experience--under-nav" : ""}`} data-error-kind={kind}>
      <div className="error-experience__inner in-wrap">
        <div className="error-experience__copy">
          <p className="error-experience__eyebrow"><span>{state.code}</span><span>{state.label}</span></p>
          <h1>{state.title}</h1>
          <p className="error-experience__body">{state.body}</p>
          <div className="error-experience__actions">
            {canRetry ? (
              <button className="error-action" type="button" onClick={retry}>{ERROR_UI.retry}<ArrowUpRight aria-hidden="true" size={18} /></button>
            ) : (
              <Link className="error-action" href="/" prefetch={false}>{ERROR_UI.home}<ArrowUpRight aria-hidden="true" size={18} /></Link>
            )}
            {kind === "not-found" || kind === "gone" ? (
              <Link className="error-text-link" href="/pricing" prefetch={false}>{ERROR_UI.pricing}</Link>
            ) : canRetry ? (
              <Link className="error-text-link" href="/" prefetch={false}>{ERROR_UI.home}</Link>
            ) : <WhatsAppButton location={`error_${kind}`} />}
          </div>
          {canRetry && <div className="error-experience__support"><WhatsAppButton location={`error_${kind}`} /></div>}
        </div>
        <ErrorScene scene={state.scene} code={state.code} />
      </div>
    </section>
  );
}
