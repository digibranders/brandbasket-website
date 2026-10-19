import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { BASKET_COPY } from "@/content/basket";
import { COMPARE, type CompareCell } from "@/content/pricing";
import { CompareTabs } from "./CompareTabs";

/** Per column: hidden at 760 px and below unless CompareTabs shows it. Literal strings so Tailwind generates them. */
const PHONE_HIDE: readonly string[] = [
  "max-[760.98px]:group-data-[show=1]/cmp:hidden max-[760.98px]:group-data-[show=2]/cmp:hidden max-[760.98px]:group-data-[show=3]/cmp:hidden",
  "max-[760.98px]:group-data-[show=0]/cmp:hidden max-[760.98px]:group-data-[show=2]/cmp:hidden max-[760.98px]:group-data-[show=3]/cmp:hidden",
  "max-[760.98px]:group-data-[show=0]/cmp:hidden max-[760.98px]:group-data-[show=1]/cmp:hidden max-[760.98px]:group-data-[show=3]/cmp:hidden",
  "max-[760.98px]:group-data-[show=0]/cmp:hidden max-[760.98px]:group-data-[show=1]/cmp:hidden max-[760.98px]:group-data-[show=2]/cmp:hidden",
];

const CELL = "border-b border-line px-[18px] max-[760.98px]:px-3.5";
const PAD = "py-3.5 max-[760.98px]:py-3";

function Cell({ value, column }: { readonly value: CompareCell; readonly column: number }): ReactElement {
  const hide = PHONE_HIDE[column] ?? "";
  if (typeof value === "string") return <td className={`${CELL} ${PAD} num text-center text-sm ${hide}`}>{value}</td>;
  return (
    <td className={`${CELL} ${PAD} text-center ${hide}`}>
      {value
        ? <Check aria-hidden="true" className="inline-block size-5 text-sage" />
        : <Minus aria-hidden="true" className="inline-block size-5 text-ink-2/45" />}
      <span className="sr-only">{value ? COMPARE.included : COMPARE.notIncluded}</span>
    </td>
  );
}

/** Read-only comparison of the four baskets (mock: #h-compare, .cmp). Names, list prices and ticks only. */
export function CompareTable(): ReactElement {
  const span = COMPARE.columns.length + 1;
  return (
    <Section id="compare" labelledBy="h-compare" tight className="scroll-mt-24 pt-16!">
      <Reveal>
        <SectionHead id="h-compare" title={COMPARE.heading} lede={COMPARE.lede} />
      </Reveal>
      <Reveal>
        <CompareTabs label={COMPARE.tabsLabel} baskets={COMPARE.columns.map((col) => ({ name: col.name, price: `${col.price} ${BASKET_COPY.perMonth}` }))}>
          <table aria-labelledby="h-compare" className="w-full border-separate border-spacing-0 text-[14.5px] [&_tr:last-child>*]:border-b-0">
            {/* Phones hide the header row visually but keep it, minus the hidden columns, for screen readers. */}
            <thead className="max-[760.98px]:sr-only">
              <tr>
                <th scope="col" className={`${CELL} pb-3.5 pt-6 text-left align-bottom`}><span className="sr-only">{COMPARE.rowHeader}</span></th>
                {COMPARE.columns.map((col, i) => (
                  <th key={col.id} scope="col" className={`${CELL} pb-3.5 pt-6 text-left align-bottom ${PHONE_HIDE[i] ?? ""}`}>
                    <span className="block font-display text-[19px] font-medium tracking-[-0.02em]">{col.name}</span>
                    <span className="num mt-1.5 block font-display text-[30px] font-medium tracking-[-0.04em]">
                      {col.price}<small className="font-sans text-xs font-normal tracking-normal text-ink-2">{col.priceSuffix}</small>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.groups.map((group) => [
                <tr key={group.title}>
                  <th colSpan={span} className={`${CELL} bg-bg py-2.5 text-left text-[13px] font-semibold text-ink-2`}>{group.title}</th>
                </tr>,
                ...group.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className={`${CELL} ${PAD} w-[30%] text-left font-medium text-ink max-[760.98px]:w-[62%]`}>
                      {row.label}
                      {row.note ? <small className="block text-[12.5px] font-normal text-ink-2">{row.note}</small> : null}
                    </th>
                    {row.cells.map((value, i) => <Cell key={COMPARE.columns[i]?.id ?? i} value={value} column={i} />)}
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </CompareTabs>
      </Reveal>
    </Section>
  );
}
