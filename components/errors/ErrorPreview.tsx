"use client";

import { useState, type ReactElement } from "react";
import { ERROR_STATES, ERROR_UI, type ErrorKind } from "@/content/errors";
import { ErrorExperience } from "./ErrorExperience";

function isErrorKind(value: string): value is ErrorKind {
  return Object.hasOwn(ERROR_STATES, value);
}

export function ErrorPreview(): ReactElement {
  const [kind, setKind] = useState<ErrorKind>("not-found");
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("");
  return (
    <div className="error-preview">
      <div className="in-wrap">
        <div className="error-preview__toolbar">
          <label className="error-preview__select">{ERROR_UI.previewLabel}<select value={kind} onChange={(event) => {
            const value = event.target.value;
            if (isErrorKind(value)) { setKind(value); setMessage(""); }
          }}>{Object.entries(ERROR_STATES).map(([key, state]) => <option key={key} value={key}>{state.code}: {state.label}</option>)}</select></label>
          <p>{ERROR_UI.previewNote}</p>
        </div>
        <p className="error-preview__status" role="status">{message}</p>
      </div>
      <ErrorExperience key={`${kind}-${attempt}`} kind={kind} underNav={false} retry={() => { setAttempt((value) => value + 1); setMessage(ERROR_UI.previewRetry); }} />
    </div>
  );
}
