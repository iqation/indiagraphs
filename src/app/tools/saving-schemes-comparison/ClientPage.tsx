"use client";

import { useMemo, useState } from "react";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";

import { ToolLayoutComparison } from "../components/ToolLayoutComparison";
import { ToolInput } from "../components/ToolInput";

import "../tools.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

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

    const output: SchemeResult[] = SCHEMES
  .filter((sch) => selectedSchemes.includes(sch.id))
  .map((sch) => {
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

    const filteredOutput = output.filter(r => selectedSchemes.includes(r.id));
setResults(filteredOutput);
  }

  const best = useMemo(() => {
    if (!results.length) return null;
    return results.reduce((a, b) => (b.realCAGR > a.realCAGR ? b : a));
  }, [results]);


  const [selectedSchemes, setSelectedSchemes] = useState(
  SCHEMES.map((s) => s.id) // default: all schemes selected
);

function toggleScheme(id: string) {
  setSelectedSchemes((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
}
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

{/* -------------------------------------------
    STATE FOR CHART TOGGLE (Nominal vs Real)
-------------------------------------------- */}
const [chartView, setChartView] = useState<"nominal" | "real">("nominal");

/* -------------------------------------------
    BAR CHART DATA
-------------------------------------------- */
const chartData = results.map((r) => ({
  scheme: r.label,
  nominal: Math.round(r.finalNominal),
  real: Math.round(r.finalReal),
}));

/* -------------------------------------------
    LINE CHART DATA (Nominal + Real Growth)
-------------------------------------------- */
const trajectoryData = Array.from({ length: Number(years) + 1 }).map((_, i) => {
  const row: any = { year: i };
  results.forEach((r) => {
    const nominalGrowth = Number(amount) * Math.pow(1 + r.nominalCAGR / 100, i);
    const realGrowth =
      nominalGrowth / Math.pow(1 + inflation / 100, i);

    row[`${r.label}_nominal`] = Math.round(nominalGrowth);
    row[`${r.label}_real`] = Math.round(realGrowth);
  });
  return row;
});

  const FullResults =
    results.length === 0 ? null : (
      <div>

        {/* Best Scheme Summary */}
        {best && (
       <section className="mb-8 p-4 border border-indigo-200 bg-indigo-50 rounded-xl">
  <p className="text-sm font-medium text-indigo-700">
    Based on your inputs, the highest <strong>inflation-adjusted Real CAGR</strong> is:
  </p>
  <p className="text-2xl font-bold text-indigo-800 mt-1">
    {best.label} ({best.realCAGR.toFixed(2)}%)
  </p>
</section>
        )}

        {/* Table */}
     <section id="table" className="mb-14">
  <h2 className="text-2xl font-bold mb-5">Comparison table</h2>

  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,10,0.04)]">
    <table className="min-w-full text-sm">

      {/* HEADER */}
      <thead>
        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 whitespace-nowrap">
          <th className="px-4 py-3 text-left font-semibold w-[160px]">Scheme</th>
          <th className="px-4 py-3 text-right font-semibold">Nominal Rate</th>
          <th className="px-4 py-3 text-right font-semibold">Final Amount</th>
          <th className="px-4 py-3 text-right font-semibold">Real Value</th>
          <th className="px-4 py-3 text-right font-semibold">Nominal CAGR</th>
          <th className="px-4 py-3 text-right font-semibold">Real CAGR</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {results.map((r) => {
          const isBest = r.id === best?.id;


          // Prepare data for charts
const chartData = results.map((r) => ({
  scheme: r.label,
  nominal: Math.round(r.finalNominal),
  real: Math.round(r.finalReal),
  color: r.color
}));

// Growth over years for line chart
const trajectoryData = Array.from({ length: parseInt(years, 10) + 1 }, (_, i) => {
  const year = i;
  const inflationRate = inflation / 100;

  const row: any = { year };

  results.forEach((s) => {
    const nominal = parseFloat(amount) * Math.pow(1 + s.nominalCAGR / 100, year);
    const real = nominal / Math.pow(1 + inflationRate, year);

    row[s.label + "_nominal"] = Math.round(nominal);
    row[s.label + "_real"] = Math.round(real);
  });

  return row;
});

          return (
            <tr
              key={r.id}
              className={`transition-all duration-150 whitespace-nowrap ${
                isBest
                  ? "bg-indigo-50/60 hover:bg-indigo-50 font-semibold"
                  : "hover:bg-slate-50"
              }`}
            >
              {/* SCHEME */}
              <td className="px-4 py-3 flex items-center gap-2 text-slate-900">

                {/* Color dot */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: r.color }}
                />

                {/* Name */}
                <span className="truncate max-w-[110px]">{r.label}</span>

                {/* Best performer (tiny pill) */}
                {isBest && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                    Best
                  </span>
                )}

                {/* Taxable tiny pill */}
                {r.taxable && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 whitespace-nowrap">
                    Tax
                  </span>
                )}
              </td>

              {/* NUMERIC COLUMNS — NON-WRAPPING */}
              <td className="px-4 py-3 text-right text-slate-700">{r.displayRate}</td>

              <td className="px-4 py-3 text-right font-medium text-slate-900">
                {fINR(r.finalNominal)}
              </td>

              <td className="px-4 py-3 text-right font-medium text-slate-900">
                {fINR(r.finalReal)}
              </td>

              <td className="px-4 py-3 text-right text-slate-700">
                {r.nominalCAGR.toFixed(2)}%
              </td>

              <td
                className={`px-4 py-3 text-right font-semibold ${
                  r.realCAGR >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {r.realCAGR.toFixed(2)}%
              </td>

            </tr>

            
          );
          
        })}
      </tbody>
    </table>
  </div>

  {/* FOOTNOTE */}
  <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-3xl">
    <strong>Note:</strong> Taxable schemes (SCSS, FD) show reduced returns after applying
    your selected tax bracket. Tax-free schemes like PPF and SSY keep their full nominal
    rate which is why SSY and SCSS have the same 8.2% nominal rate but different Real CAGR.
  </p>
</section>

{/* ================================
    BAR CHART — Final Amount vs Real
=================================== */}
<section className="mb-12">
  <h2 className="text-2xl font-bold mb-3">Final Amount vs Real Value</h2>
  <p className="text-sm text-slate-600 mb-4">
    Compare your total maturity value (nominal) against inflation-adjusted real value.
  </p>

  <div className="w-full h-80 bg-white border rounded-2xl shadow p-5">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        barSize={22}
        barCategoryGap="20%"
      >
        <XAxis
          type="number"
          tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
          tick={{ fontSize: 12, fontWeight: 600 }}
        />

        <YAxis
          dataKey="scheme"
          type="category"
          width={90}
          tick={{ fontSize: 13, fontWeight: 700 }}
        />

        <Tooltip
          formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
          contentStyle={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
          }}
        />

        <Legend />

        <Bar
          dataKey="nominal"
          name="Nominal Amount"
          fill="#3b82f6"
          radius={[6, 6, 6, 6]}
        />
        <Bar
          dataKey="real"
          name="Real Value"
          fill="#10b981"
          radius={[6, 6, 6, 6]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</section>

{/* ================================
    LINE CHART — Growth Trajectory
=================================== */}
<section>
  <h2 className="text-2xl font-bold mb-3">Growth Trajectory Over Time</h2>
  <p className="text-sm text-slate-600 mb-4">
    Track how each scheme grows over time in nominal or inflation-adjusted terms.
  </p>

  {/* Toggle Buttons */}
  <div className="flex gap-3 mb-4">
    <button
      onClick={() => setChartView("nominal")}
      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition
        ${
          chartView === "nominal"
            ? "bg-indigo-600 text-white shadow"
            : "bg-slate-200 text-slate-700"
        }`}
    >
      Nominal Growth
    </button>

    <button
      onClick={() => setChartView("real")}
      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition
        ${
          chartView === "real"
            ? "bg-indigo-600 text-white shadow"
            : "bg-slate-200 text-slate-700"
        }`}
    >
      Real (Inflation-adjusted)
    </button>
  </div>

  <div className="w-full h-96 bg-white border rounded-2xl shadow p-5">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={trajectoryData}>
        <CartesianGrid stroke="#e5e7eb" />

        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fontWeight: 600 }}
        />

        <YAxis
          tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
          tick={{ fontSize: 12, fontWeight: 600 }}
        />

        <Tooltip
          formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
          contentStyle={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
          }}
        />

        <Legend />

        {results.map((s) => (
          <Line
            key={s.id}
            type="monotone"
            dataKey={
              chartView === "nominal"
                ? `${s.label}_nominal`
                : `${s.label}_real`
            }
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            name={
              chartView === "nominal"
                ? `${s.label}`
                : `${s.label}`
            }
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
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

            {/* Select Schemes */}
<label className="tool-label mt-6 font-bold">Select Schemes to Compare</label>

<div className="flex justify-between items-center mb-3">
  <button
    type="button"
    className="text-xs text-indigo-600 hover:underline"
    onClick={() => setSelectedSchemes(SCHEMES.map(s => s.id))}
  >
    Select All
  </button>
  <button
    type="button"
    className="text-xs text-slate-500 hover:underline"
    onClick={() => setSelectedSchemes([])}
  >
    Clear All
  </button>
</div>

<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  {SCHEMES.map((s) => {
    const isChecked = selectedSchemes.includes(s.id);
    return (
      <label
        key={s.id}
        className={`
          flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer transition
          ${isChecked
            ? "bg-indigo-50 border-indigo-500 shadow-sm"
            : "bg-slate-100 border-slate-200 hover:bg-slate-200"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          <span className="text-sm font-medium text-slate-800">{s.label}</span>
        </div>

        {s.taxable ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
            Taxable
          </span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            Tax-free
          </span>
        )}

        <input
          type="checkbox"
          checked={isChecked}
          className="hidden"
          onChange={() =>
            setSelectedSchemes((prev) =>
              isChecked
                ? prev.filter((id) => id !== s.id)
                : [...prev, s.id]
            )
          }
        />
      </label>
    );
  })}
</div>

            {inflationOption === "custom" && (
              <ToolInput type="percent" label="Custom Inflation (%)" value={customInflation} onChange={setCustomInflation} />
            )}

            {/* Tax Buttons */}
            <label className="tool-label mt-4 ">Tax Bracket (for FD & SCSS only)</label>
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
       {/* LEFT-SIDE CONTENT */}
<section id="how">
  <h2>How this Savings Schemes Comparison Calculator works</h2>

  <p>
    Most savers compare instruments only by their printed interest rate but
    two options with the same rate can behave very differently once tax,
    inflation, and compounding are considered. This calculator brings every
    major Indian small-savings scheme and bank fixed deposit onto a fair,
    comparable scale.
  </p>

  <p>Here’s what happens behind the scenes:</p>

  <ul>
    <li>Uses latest government-notified rates for PPF, SSY, NSC, SCSS and KVP</li>
    <li>Adjusts FD rate using your bank rate + senior citizen premium</li>
    <li>Applies your income-tax slab for FD and SCSS</li>
    <li>Simulates multi-year compounding to compute maturity value</li>
    <li>Adjusts every scheme for inflation to compute real value</li>
    <li>Ranks all schemes by real CAGR, not just nominal return</li>
    <li>Highlights which option truly preserves purchasing power</li>
  </ul>

  <p>
    The goal is simple: help you understand which savings option actually grows
    your money in real terms not just on paper, but after inflation and taxes.
  </p>

  <h3>Interest rates and assumptions used</h3>

  <p>
    This calculator uses the most recently published small-savings rates from
    the Government of India. These rates change every quarter, so always
    double-check before making major decisions.
  </p>

  <ul>
    <li><strong>PPF:</strong> 7.1%, 15-year, tax-free</li>
    <li><strong>SSY:</strong> 8.2%, tax-free maturity</li>
    <li><strong>SCSS:</strong> 8.2%, taxable</li>
    <li><strong>NSC:</strong> 7.7%, 5-year lock-in</li>
    <li><strong>KVP:</strong> Doubles in 115 months (~7.18% CAGR)</li>
    <li><strong>FD:</strong> Your bank rate, taxable, +0.5% for seniors</li>
  </ul>

  <p>
    For KVP, the government specifies a doubling period instead of an interest
    rate. The calculator converts this into an annual compounded rate for fair
    comparison.
  </p>
</section>
<section id="real">
  <h2>Understanding real returns</h2>

  <p>
    Interest rates show how much your money grows in nominal terms. But
    inflation shows how fast your cost of living rises. Real return is the
    difference it tells you whether your wealth is actually growing in
    purchasing-power terms.
  </p>

  <p>
    If an investment earns 7% but inflation is 6%, your real growth is only
    around 1%. Sometimes, especially after tax, real returns can even become
    negative.
  </p>

  <p><strong>Formula used:</strong></p>
  <div className="tool-detail-formula">
    Real CAGR = (1 + Nominal CAGR) / (1 + Inflation Rate) − 1
  </div>

  <h3>Why nominal returns are misleading</h3>

  <ul>
    <li>FD and SCSS returns fall sharply after tax for 20–30% slabs</li>
    <li>High inflation can wipe out most of the gains</li>
    <li>PPF and SSY often outperform due to tax-free compounding</li>
    <li>
      A lower nominal rate can beat a higher rate if it is more tax-efficient
    </li>
  </ul>

  <p>
    This calculator helps you see the long-term picture: how each scheme grows
    your wealth after inflation and tax the only metric that matters for real
    financial planning.
  </p>
</section>

<section id="faq">
  <h2>Frequently Asked Questions</h2>

  <h3>1. Which scheme gives the highest real return?</h3>
  <p>
    Historically, <strong>PPF</strong> and <strong>SSY</strong> deliver the
    strongest real returns because of their tax-free structure. FD and SCSS may
    fall behind once tax is applied.
  </p>

  <h3>2. Can bank FDs give negative real returns?</h3>
  <p>
    Yes. If inflation is higher than your post-tax FD return, your real return
    becomes negative meaning your money loses purchasing power over time.
  </p>

  <h3>3. Do small-savings schemes always beat inflation?</h3>
  <p>
    No. They outperform inflation during some periods but may fall behind in
    high-inflation years. Long-term tax efficiency often matters more than the
    nominal rate.
  </p>

  <h3>4. How is the KVP annual rate calculated?</h3>
  <p>
    KVP declares a <em>doubling period</em>, not an annual rate. The calculator
    converts it using compound-interest maths:
  </p>

  <div className="tool-detail-formula">
    Annual CAGR = 2<sup>(1 / Years to Double)</sup> − 1
  </div>

  <h3>5. Is this financial advice?</h3>
  <p>
    No. This tool is for educational comparison and planning. Always consult a
    qualified advisor before making significant investment decisions.
  </p>
</section>
      </ToolLayoutComparison>

      <IGFooter />
    </>
  );
}