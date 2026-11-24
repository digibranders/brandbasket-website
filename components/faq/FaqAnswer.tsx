import type { ReactElement, ReactNode } from "react";
import type { FaqAnswer as Answer } from "@/content/faq";

/** Splits a long answer into two paragraphs near its middle, so a wall of text breaks where a sentence ends. */
export function paragraphs(text: string): readonly string[] {
  const sentences = text.split(/(?<=\.)\s+(?=[A-Z])/);
  if (text.length < 330 || sentences.length < 3) return [text];
  const first: string[] = [];
  let length = 0;
  for (const sentence of sentences) {
    if (length >= text.length * 0.45) break;
    first.push(sentence);
    length += sentence.length + 1;
  }
  const rest = sentences.slice(first.length);
  return rest.length === 0 ? [text] : [first.join(" "), rest.join(" ")];
}

/** Amounts in an answer are set in the heavier ink so the number is what the eye finds. */
function withAmounts(text: string): ReactNode[] {
  return text.split(/([₹$][\d,]+)/).map((part, i) => (i % 2 === 1 ? <strong key={`${part}-${i}`} className="whitespace-nowrap font-semibold text-ink">{part}</strong> : part));
}

export function FaqAnswerBody({ answer }: { readonly answer: Answer }): ReactElement {
  if (typeof answer !== "string") {
    return (
      <>
        <p>{withAmounts(answer.lead)}</p>
        <ul className="mt-3 grid list-disc gap-1 pl-5 marker:text-rattan">
          {answer.items.map((item) => (
            <li key={item}>{withAmounts(item)}</li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      {paragraphs(answer).map((paragraph, i) => (
        <p key={paragraph} className={i === 0 ? undefined : "mt-3"}>
          {withAmounts(paragraph)}
        </p>
      ))}
    </>
  );
}
