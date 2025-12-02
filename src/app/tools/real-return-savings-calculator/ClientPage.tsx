"use client";

import { useState, useMemo, useRef } from "react";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import { ToolLayout } from "../components/ToolLayout";
import { ToolInput } from "../components/ToolInput";
import { ToolOutput } from "../components/ToolOutput";
import { validateNumberField } from "../utils/validation";

import "../tools.css";


// Format for India
const formatIN = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("en-IN") : "0";

// KVP effective interest rate (115 months = 9.58 years)
const KVP_EffectiveRate = () => {
  const months = 115;
  const years = months / 12;
  const maturity = 2;
  const rate = Math.pow(maturity, 1 / years) - 1;
  return rate * 100;
};


/** export const metadata = generateToolMetadata("real-return-savings-calculator"); */

export default function RealReturnsCalculatorPage() {
  const [investmentType, setInvestmentType] = useState<"lumpsum" | "sip">(
    "lumpsum"
  ); // NEW: Lumpsum vs Monthly SIP

  const [amount, setAmount] = useState("");
  const [years, setYears] = useState("10");

  const [scheme, setScheme] = useState("PPF");
  const [fdRate, setFdRate] = useState("7");
  const [senior, setSenior] = useState(false);

  const [inflationOption, setInflationOption] = useState("5.75");
  const [customInflation, setCustomInflation] = useState("");

  const [taxRate, setTaxRate] = useState("0");

  const [nominalValue, setNominalValue] = useState<number | null>(null);
  const [realValue, setRealValue] = useState<number | null>(null);

  // ----------------------------------------------------
  // ⭐ ADD THIS — ERROR STATE (already told earlier)
  // ----------------------------------------------------
  const [errors, setErrors] = useState({
    amount: "",
    years: "",
    fdRate: ""
  });

  // ----------------------------------------------------
  // ⭐ INSERT runValidation() RIGHT HERE
  // ----------------------------------------------------
  function runValidation() {
    const newErrors = {
      amount: validateNumberField({
        label: investmentType === "lumpsum"
          ? "Investment amount"
          : "Monthly contribution",
        value: amount,
        min: 1
      }),

      years: validateNumberField({
        label: "Investment duration",
        value: years,
        min: 1,
        max: 50
      }),

      fdRate:
        scheme === "FD"
          ? validateNumberField({
              label: "FD interest rate",
              value: fdRate,
              min: 1,
              max: 20
            })
          : ""
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  }

  // Table of contents (static)
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tocItems = [
    { id: "how-it-works", label: "How this calculator works" },
    { id: "assumptions", label: "Assumptions & interest rates" },
    { id: "real-returns", label: "What are real returns?" },
    { id: "faq", label: "Frequently asked questions" },
  ];

  // Scheme lists
  const LUMPSUM_SCHEMES = [
    { value: "PPF", label: "PPF (7.1%)" },
    { value: "SSY", label: "SSY (8.2%)" },
    { value: "SCSS", label: "SCSS (8.2%)" },
    { value: "NSC", label: "NSC (7.7%)" },
    { value: "KVP", label: "KVP (~7.18% effective)" },
    { value: "FD", label: "FD (Custom)" },
  ] as const;

  const SIP_SCHEMES = [
    { value: "PPF", label: "PPF - Monthly contributions" },
    { value: "SSY", label: "SSY - Monthly contributions" },
    { value: "FD", label: "FD / RD - Monthly deposit" },
  ] as const;

  // Ensure currently selected scheme is compatible with investmentType
  const availableSchemes =
    investmentType === "lumpsum" ? LUMPSUM_SCHEMES : SIP_SCHEMES;

  const schemeIsAvailable = availableSchemes.some((s) => s.value === scheme);
  if (!schemeIsAvailable) {
    // fallback if user switches type and current scheme isn't valid there
    if (investmentType === "lumpsum") {
      // default to PPF if somehow invalid (very rare)
      if (scheme !== "PPF") {
        setScheme("PPF");
      }
    } else {
      // SIP mode: restrict to allowed schemes
      if (scheme !== "PPF" && scheme !== "SSY" && scheme !== "FD") {
        setScheme("PPF");
      }
    }
  }

  // Get scheme interest rate (annual nominal)
  const schemeRate = useMemo(() => {
    switch (scheme) {
      case "PPF":
        return 7.1;
      case "SSY":
        return 8.2;
      case "SCSS":
        return 8.2;
      case "NSC":
        return 7.7;
      case "KVP":
        return KVP_EffectiveRate();
      case "FD":
        return senior ? parseFloat(fdRate || "0") + 0.5 : parseFloat(fdRate || "0");
      default:
        return 7;
    }
  }, [scheme, fdRate, senior]);

  const inflation = useMemo(() => {
    if (inflationOption === "custom" && customInflation) {
      return parseFloat(customInflation);
    }
    return parseFloat(inflationOption);
  }, [inflationOption, customInflation]);

  const isTaxableScheme = scheme === "FD" || scheme === "SCSS";

  const calculateReturns = () => {
     if (!runValidation()) return;
    const amt = parseFloat(amount);
    const yrs = parseInt(years);
    const rAnnual = schemeRate / 100;


    let value = 0;
    let totalInvested = amt; // used for SIP tax logic also

    if (investmentType === "lumpsum") {
      // LUMPSUM: standard compound interest
      value = amt * Math.pow(1 + rAnnual, yrs);
      totalInvested = amt;
    } else {
      // SIP: monthly contributions
      const nMonths = yrs * 12;
      const rMonthly = rAnnual / 12;

      totalInvested = amt * nMonths;

      if (rMonthly > 0) {
        // FV of annuity (end-of-month SIP)
        value =
          amt * ((Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly);
      } else {
        // zero rate edge case
        value = totalInvested;
      }
    }

    // Apply tax if scheme is taxable (FD / SCSS)
    if (isTaxableScheme) {
      const tax = parseFloat(taxRate || "0");
      if (tax > 0) {
        const gain = value - totalInvested;
        value = totalInvested + gain * (1 - tax / 100);
      }
    }

    setNominalValue(value);

    // Real value adjusted for inflation (approx, over 'yrs' years)
    const real = value / Math.pow(1 + inflation / 100, yrs);
    setRealValue(real);
  };

  return (
    <>
      <IGHeader />

      <ToolLayout
        title="Real Returns Calculator (India)"
        updated="Nov 2025"
        categories={["Finance", "Investments", "Inflation"]}
        breadcrumb={[
          { label: "Tools & Calculators", href: "/tools" },
          { label: "Real Returns Calculator" },
        ]}
        toc={tocItems}
        calculator={
          <>
            {/* Investment type toggle */}
            <label className="tool-label">Investment type</label>
            <div className="flex space-x-2 p-1 bg-slate-100 rounded-lg mb-2">
              <button
                type="button"
                onClick={() => setInvestmentType("lumpsum")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  investmentType === "lumpsum"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Lumpsum
              </button>
              <button
                type="button"
                onClick={() => setInvestmentType("sip")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  investmentType === "sip"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Monthly SIP
              </button>
            </div>

            {/* Amount label adapts to mode */}
            <ToolInput
              type="number"
              label={
                investmentType === "lumpsum"
                  ? "Investment amount (₹)"
                  : "Monthly contribution (₹)"
              }
              value={amount}
              onChange={setAmount}
              error={errors.amount}
            />

            <ToolInput
              type="number"
              label="Investment duration (years)"
              value={years}
              onChange={setYears}
              
            />

            {/* Scheme select: options depend on investment type */}
            <label className="tool-label">Select scheme</label>
            <select
              className="tool-select"
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
            >
              {availableSchemes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* FD custom rate & senior citizen toggle – for any FD mode */}
            {scheme === "FD" && (
              <>
                <ToolInput
                  type="number"
                  label="FD / RD interest rate (%)"
                  value={fdRate}
                  onChange={setFdRate}
                />
{errors.fdRate && <p className="tool-error-text">{errors.fdRate}</p>}
                <label className="tool-checkbox">
                  <input
                    type="checkbox"
                    checked={senior}
                    onChange={(e) => setSenior(e.target.checked)}
                  />
                  Senior citizen (+0.5%)
                </label>
              </>
            )}

            {/* Tax rate – only for taxable schemes: FD & SCSS */}
            {isTaxableScheme && (
              <>
                <label className="tool-label mt-4">Tax rate (%)</label>
                <div className="flex space-x-2 p-1 bg-slate-100 rounded-lg">
                  {["0", "5", "20", "30"].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setTaxRate(rate)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        taxRate === rate
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-700 hover:bg-white"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Inflation */}
            <label className="tool-label">Inflation option</label>
            <select
              className="tool-select"
              value={inflationOption}
              onChange={(e) => setInflationOption(e.target.value)}
            >
              <option value="5.75">5.75% (Avg since 2012)</option>
              <option value="4.6">4.6% (Last FY)</option>
              <option value="custom">Custom</option>
            </select>

            {inflationOption === "custom" && (
              <ToolInput
                type="number"
                label="Custom inflation rate (%)"
                value={customInflation}
                onChange={setCustomInflation}
              />
            )}

            <button
              className="tool-button tool-button-full"
              onClick={calculateReturns}
            >
              Calculate real returns
            </button>

            {nominalValue !== null && realValue !== null && (
              <ToolOutput
                headline={`₹ ${formatIN(nominalValue)}`}
                headlineLabel={
                  investmentType === "lumpsum"
                    ? "Final amount (nominal)"
                    : "Final value (nominal, SIP)"
                }
                note={`Real value after inflation: ₹ ${formatIN(realValue)}`}
                kpis={[
                  {
                    label: "Nominal CAGR",
                    value: `${schemeRate.toFixed(2)}%`,
                  },
                  {
                    label: "Real CAGR",
                    value: `${(
                      ((1 + schemeRate / 100) / (1 + inflation / 100) - 1) *
                      100
                    ).toFixed(2)}%`,
                  },
                  {
                    label: "Value after inflation",
                    value: `₹ ${formatIN(realValue)}`,
                  },
                ]}
              />
            )}
          </>
        }
      >
        {/* ============================
              CONTENT
        ============================ */}
        <div ref={contentRef}>
          {/* ============================
              HOW IT WORKS
          ============================ */}
          <section id="how-it-works">
            <h2>How this Real Returns Calculator works</h2>
            <p>
              Most Indians compare investments using only the headline interest
              rate but this can be misleading. This calculator helps you
              understand the <em>true</em> value of your money by adjusting
              returns for inflation, tax, and compounding. It compares major
              small-savings schemes and bank FDs using government-notified
              interest rates.
            </p>

            <ul>
              <li>
                Calculates nominal and inflation-adjusted real value for each
                scheme
              </li>
              <li>
                Applies your income-tax slab for taxable schemes such as FD and
                SCSS
              </li>
              <li>
                Simulates long-term compounding to estimate
                purchasing-power growth
              </li>
              <li>
                Highlights which scheme preserves (or grows) wealth after
                inflation
              </li>
            </ul>

            <p>
              This gives you a more accurate picture of which savings option
              helps your money retain or increase its real value over time.
            </p>
          </section>

          {/* ============================
              ASSUMPTIONS
          ============================ */}
          <section id="assumptions">
            <h2>Interest rates and assumptions used</h2>

            <p>
              The calculator uses the latest publicly available small-savings
              rates from the Government of India. These rates change every
              quarter, so always cross-verify before major decisions.
            </p>

            <div className="tool-detail-table">
              <div className="tool-detail-table-row">
                <div>PPF</div>
                <div>7.1%</div>
                <div>15-year tenure</div>
              </div>
              <div className="tool-detail-table-row">
                <div>SSY</div>
                <div>8.2%</div>
                <div>Tax-free maturity</div>
              </div>
              <div className="tool-detail-table-row">
                <div>SCSS</div>
                <div>8.2%</div>
                <div>Taxable interest</div>
              </div>
              <div className="tool-detail-table-row">
                <div>NSC</div>
                <div>7.7%</div>
                <div>5-year lock-in</div>
              </div>
              <div className="tool-detail-table-row">
                <div>KVP</div>
                <div>≈7.18%</div>
                <div>Doubles in 115 months</div>
              </div>
            </div>

            <p>
              Kisan Vikas Patra doesn&apos;t have a fixed annual rate in its
              notification instead, the maturity period (when the investment
              doubles) is provided. We convert this into an effective compounded
              annual return.
            </p>
          </section>

          {/* ============================
              REAL RETURNS
          ============================ */}
          <section id="real-returns">
            <h2>What are real returns?</h2>

            <p>
              Real return = Nominal return − Inflation. It measures how much
              your purchasing power actually increases. For example, if an
              investment earns 7% but inflation is 6%, your real growth is only
              around 1%.
            </p>

            <p>
              Very often, people assume that a higher interest rate means higher
              wealth creation. But if inflation is high, even a good-looking
              rate may give <em>negative</em> real returns.
            </p>

            <blockquote className="tool-detail-formula">
              Real CAGR = (1 + Nominal CAGR) / (1 + Inflation Rate) − 1
            </blockquote>

            <p>
              This formula gives a more accurate long-term picture of how
              different schemes perform in real terms. Taxation also plays a key
              role - taxable schemes often fall behind, especially in higher
              income-tax slabs.
            </p>

            <ul>
              <li>High inflation erodes purchasing power rapidly</li>
              <li>
                Tax reduces effective FD and SCSS returns at 20%–30% slabs
              </li>
              <li>PPF and SSY benefit from tax-free compounding</li>
              <li>Real returns often matter more than nominal returns</li>
            </ul>

            <p>
              A scheme with a lower nominal rate can outperform a higher-rate
              option if it is tax-efficient or inflation-resistant.
            </p>
          </section>

          {/* ============================
              FAQ
          ============================ */}
          <section id="faq">
            <h2>Frequently Asked Questions</h2>

            <h3>1. Which investment gives the highest real return today?</h3>
            <p>
              Historically, PPF and SSY often deliver the strongest
              inflation-adjusted returns due to their fully tax-free structure.
              FD and SCSS returns may drop sharply after tax, especially for
              investors in the 20%–30% tax slabs.
            </p>

            <h3>2. Can FDs give negative real returns?</h3>
            <p>
              Yes. If inflation is greater than your post-tax FD return, your
              real return becomes negative. This means the value of your money
              reduces over time even though the FD “grows”.
            </p>

            <h3>3. Do small-savings schemes always beat inflation?</h3>
            <p>
              No. They outperform inflation during some periods but may fall
              behind during high-inflation years. Long-term tax-efficiency often
              determines their real performance.
            </p>

            <h3>4. How is the KVP annual rate calculated?</h3>
            <p>
              KVP is defined using a “doubling time”. The annual return is
              derived using compound-interest math:
            </p>

            <blockquote className="tool-detail-formula">
              Annual CAGR = (2)^(1 / Years to Double) − 1
            </blockquote>

            <h3>5. Is this financial advice?</h3>
            <p>
              No. This tool is for educational estimation. Please consult a
              qualified advisor for investment decisions.
            </p>
          </section>
        </div>
      </ToolLayout>

      <IGFooter />
    </>
  );
}