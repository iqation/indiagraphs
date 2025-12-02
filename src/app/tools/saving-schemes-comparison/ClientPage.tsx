"use client";

import { useMemo, useState } from "react";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";

import { ToolLayoutComparison } from "../components/ToolLayoutComparison";
import { ToolInput } from "../components/ToolInput";

import "../tools.css";

/* -----------------------------------------------------
   CONFIG
------------------------------------------------------ */

const SCHEMES = [
  { id: "PPF", label: "PPF", baseRate: 7.1, taxable: false, color: "#10B981" },
  { id: "SSY", label: "SSY", baseRate: 8.2, taxable: false, color: "#8B5CF6" },
  { id: "SCSS", label: "SCSS", baseRate: 8.2, taxable: true, color: "#3B82F6" },
  { id: "NSC", label: "NSC", baseRate: 7.7, taxable: false, color: "#FBBF24" },
  { id: "KVP", label: "KVP", baseRate: 7.18, taxable: false, color: "#14B8A6" },
  { id: "FD", label: "FD (Your Bank)", baseRate: null, taxable: true, color: "#F97316" },
];

const TAX_BRACKETS = ["0", "5", "20", "30"];

const INFLATION_OPTIONS = [
  { value: "5.75", label: "5.75% (Avg since 2012)" },
  { value: "4.6", label: "4.6% (Last FY)" },
  { value: "custom", label: "Custom" },
];

/* -----------------------------------------------------
   TYPES
------------------------------------------------------ */

type SchemeConfig = (typeof SCHEMES)[number];

type SchemeResult = SchemeConfig & {
  displayRate: string;
  finalNominal: number;
  finalReal: number;
  nominalCAGR: number;
  realCAGR: number;
};

/* -----------------------------------------------------
   HELPERS
------------------------------------------------------ */

const fIN = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fINR = (n: number) => `₹${fIN(n)}`;

/* -----------------------------------------------------
   MAIN PAGE
------------------------------------------------------ */

export default function SavingsComparisonPage() {
  /* INPUT STATES */
  const [amount, setAmount] = useState("100000");
  const [years, setYears] = useState("10");
  const [inflationOption, setInflationOption] = useState("5.75");
  const [customInflation, setCustomInflation] = useState("");
  const [taxBracket, setTaxBracket] = useState("20");
  const [fdRate, setFdRate] = useState("7");
  const [senior, setSenior] = useState(false);

  const [results, setResults] = useState<SchemeResult[]>([]);

  const inflation = useMemo(() => {
    if (inflationOption === "custom" && customInflation) {
      return parseFloat(customInflation);
    }
    return parseFloat(inflationOption);
  }, [inflationOption, customInflation]);

  /* -----------------------------------------------------
     CALCULATE
  ------------------------------------------------------ */

  function calculate() {
    const principal = parseFloat(amount);
    const yrs = parseInt(years, 10);
    const tax = parseFloat(taxBracket);

    if (!principal || yrs <= 0) {
      alert("Enter valid amount & duration");
      return;
    }

    const infl = inflation / 100;

    const output: SchemeResult[] = SCHEMES.map((sch) => {
      let rate =
        sch.id === "FD"
          ? parseFloat(fdRate) + (senior ? 0.5 : 0)
          : sch.baseRate ?? 7;

      const nominalRate = rate / 100;
      let finalNominal = principal * Math.pow(1 + nominalRate, yrs);
      let effRate = nominalRate;

      // Apply tax reduction
      if (sch.taxable && tax > 0) {
        const profit = finalNominal - principal;
        finalNominal = principal + profit * (1 - tax / 100);
        effRate = Math.pow(finalNominal / principal, 1 / yrs) - 1;
      }

      const finalReal = finalNominal / Math.pow(1 + infl, yrs);
      const realCAGR = ((1 + effRate) / (1 + infl) - 1) * 100;

      return {
        ...sch,
        displayRate: rate.toFixed(2) + "%",
        finalNominal,
        finalReal,
        nominalCAGR: effRate * 100,
        realCAGR,
      };
    });

    setResults(output);
  }

  const best = useMemo(() => {
    if (!results.length) return null;
    return results.reduce((a, b) => (b.realCAGR > a.realCAGR ? b : a));
  }, [results]);

  /* -----------------------------------------------------
     TOC
  ------------------------------------------------------ */

  const toc = [
    { id: "how", label: "How this calculator works" },
    { id: "table", label: "Comparison table" },
    { id: "real", label: "Understanding real returns" },
    { id: "faq", label: "FAQ" },
  ];

  /* -----------------------------------------------------
     FULL WIDTH RESULTS SECTION
  ------------------------------------------------------ */

  const FullResults =
    results.length === 0 ? null : (
      <div>

        {/* Best Scheme Summary */}
        {best && (
          <section className="tool-summary-card mb-8 p-4 bg-emerald-50 border border-emerald-300 rounded-xl">
            <h3 className="text-xl font-bold text-emerald-700">
              🥇 Best Real Return: {best.label}
            </h3>
            <p className="mt-1 text-slate-700">
              Real CAGR: <strong>{best.realCAGR.toFixed(2)}%</strong>
            </p>
          </section>
        )}

        {/* Table */}
        <section id="table" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Comparison table</h2>

          <div className="overflow-x-auto border rounded-xl bg-white shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Scheme</th>
                  <th className="px-4 py-3 text-right">Nominal Rate</th>
                  <th className="px-4 py-3 text-right">Final Amount</th>
                  <th className="px-4 py-3 text-right">Real Value</th>
                  <th className="px-4 py-3 text-right">Nominal CAGR</th>
                  <th className="px-4 py-3 text-right">Real CAGR</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r) => (
                  <tr
                    key={r.id}
                    className={
                      r.id === best?.id
                        ? "bg-emerald-50 font-semibold"
                        : "bg-white"
                    }
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      {r.label}
                    </td>

                    <td className="px-4 py-3 text-right">{r.displayRate}</td>
                    <td className="px-4 py-3 text-right">{fINR(r.finalNominal)}</td>
                    <td className="px-4 py-3 text-right">{fINR(r.finalReal)}</td>
                    <td className="px-4 py-3 text-right">
                      {r.nominalCAGR.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-700">
                      {r.realCAGR.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );

  /* -----------------------------------------------------
     RENDER
  ------------------------------------------------------ */

  return (
    <>
      <IGHeader />

      <ToolLayoutComparison
        title="Real Returns: Savings Schemes Comparison (India)"
        updated="Nov 2025"
        categories={["Finance", "Investments", "Inflation"]}
        breadcrumb={[
          { label: "Tools & Calculators", href: "/tools" },
          { label: "Savings Schemes Comparison" },
        ]}
        toc={toc}
        calculator={
          <>
            <h3 className="text-lg font-bold mb-3">Investment Parameters</h3>

            <ToolInput type="currency" label="Lump-sum Investment (₹)" value={amount} onChange={setAmount} />
            <ToolInput type="number" label="Investment Duration (Years)" value={years} onChange={setYears} />

            <ToolInput
              type="select"
              label="Inflation Assumption"
              value={inflationOption}
              onChange={setInflationOption}
              options={INFLATION_OPTIONS}
            />

            {inflationOption === "custom" && (
              <ToolInput type="percent" label="Custom Inflation (%)" value={customInflation} onChange={setCustomInflation} />
            )}

            {/* Tax Buttons */}
            <label className="tool-label mt-4 font-bold">Tax Bracket</label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
              {TAX_BRACKETS.map((t) => (
                <button
                  key={t}
                  className={`flex-1 px-3 py-2 rounded ${
                    t === taxBracket ? "bg-indigo-600 text-white" : "text-slate-700"
                  }`}
                  onClick={() => setTaxBracket(t)}
                >
                  {t}%
                </button>
              ))}
            </div>

            <ToolInput type="percent" label="FD Interest Rate (%)" value={fdRate} onChange={setFdRate} />

            <label className="flex items-center gap-2 mt-3">
              <input type="checkbox" checked={senior} onChange={(e) => setSenior(e.target.checked)} />
              <span className="text-sm">Senior Citizen (+0.5%)</span>
            </label>

            <button className="tool-button tool-button-full mt-6" onClick={calculate}>
              Compare Schemes & Get Real Returns
            </button>

            {results.length > 0 && (
              <p className="text-xs text-slate-500 mt-3 border-t pt-3">
                Based on {years} years, inflation {inflation.toFixed(2)}%, tax {taxBracket}%.
              </p>
            )}
          </>
        }
        fullWidthResults={FullResults}
      >
        {/* LEFT-SIDE CONTENT */}
        <section id="how">
          <h2>How this calculator works</h2>
          <p>
            This calculator computes both <strong>nominal</strong> and{" "}
            <strong>inflation-adjusted real</strong> returns using official rates
            of major Indian savings schemes.
          </p>
        </section>

        <section id="real">
          <h2>Understanding real returns</h2>
          <p>
            Real return ≈ Nominal return − Inflation.  
            It indicates whether your wealth is truly growing after inflation.
          </p>
        </section>

        <section id="faq">
          <h2>FAQ</h2>
          <p><strong>Is this financial advice?</strong> No — educational use only.</p>
        </section>
      </ToolLayoutComparison>

      <IGFooter />
    </>
  );
}