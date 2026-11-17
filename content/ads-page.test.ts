import { describe, expect, it } from "vitest";
import { formatMoney } from "@/lib/currency";
import { extrasFor, planPrice } from "@/lib/pricing";
import { ADS_CONTROL, ADS_HOW, adsFactsFor, adsMoneyFor, adsReportFor } from "./ads-page";

const CURRENCIES = ["INR", "USD"] as const;

describe("paid ads page copy", () => {
  for (const currency of CURRENCIES) {
    describe(currency, () => {
      it("builds the fee and the ad budget cap from the pricing module", () => {
        const [fee, budget] = adsMoneyFor(currency).parts;
        expect(fee.amount).toBe(formatMoney(planPrice("ads", currency), currency));
        expect(budget.amount).toContain(formatMoney(extrasFor(currency).adBudgetCap, currency));
        expect(adsFactsFor(currency).map((fact) => fact.text).join(" ")).toContain(formatMoney(extrasFor(currency).adBudgetCap, currency));
      });

      it("keeps sample report numbers that add up: campaign leads make the total", () => {
        const report = adsReportFor(currency);
        const total = report.campaigns.reduce((sum, row) => sum + Number(row.leads), 0);
        expect(String(total)).toBe(report.kpis.find((kpi) => kpi.label === "Leads")?.value);
        expect(report.chip).toMatch(/example/i);
      });
    });
  }

  it("never names the rupee in copy the dollar page also shows", () => {
    const shared = JSON.stringify([ADS_HOW, ADS_CONTROL, adsMoneyFor("USD"), adsFactsFor("USD"), adsReportFor("USD")]);
    expect(shared).not.toMatch(/rupee|₹/i);
  });
});
