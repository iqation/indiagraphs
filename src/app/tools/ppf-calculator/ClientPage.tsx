"use client";

import { useState, useMemo, useRef } from "react";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import { ToolLayout } from "../components/ToolLayout";
import { ToolInput } from "../components/ToolInput";
import { ToolOutput } from "../components/ToolOutput";
import { validateNumberField } from "../utils/validation";

import "../tools.css";

type Props = { isEmbed: boolean };

// Format numbers with Indian commas
const formatIN = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("en-IN") : "0";

export default function PPFCalculatorPage({ isEmbed }: Props) {
  // -------------------------------
  // INPUTS
  // -------------------------------
  const [amount, setAmount] = useState("");        // Yearly contribution
  const [years, setYears] = useState("15");        // Lock-in min 15
  const [rate] = useState(7.1);                    // Current PPF rate (fixed)

  const [errors, setErrors] = useState({
    amount: "",
    years: "",
  });

  const [maturity, setMaturity] = useState<number | null>(null);
  const [totalInvested, setTotalInvested] = useState<number | null>(null);

  // -------------------------------
  // VALIDATION
  // -------------------------------
  function runValidation() {
    const newErrors = {
      amount: validateNumberField({
        label: "Annual contribution",
        value: amount,
        min: 500,
        max: 150000,
      }),
      years: validateNumberField({
        label: "Years",
        value: years,
        min: 15,
        max: 50,
      }),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  }

  // -------------------------------
  // CALCULATE PPF MATURITY
  // -------------------------------
  function calculate() {
    if (!runValidation()) return;

    const yearly = parseFloat(amount);
    const n = parseInt(years);
    const r = rate / 100;

    let balance = 0;
    for (let i = 1; i <= n; i++) {
      balance = (balance + yearly) * (1 + r);
    }

    setMaturity(Math.round(balance));
    setTotalInvested(yearly * n);
  }

  // -------------------------------
  // TOC
  // -------------------------------
  const tocItems = [
    { id: "how", label: "How this calculator works" },
    { id: "formula", label: "PPF formula explained" },
    { id: "faq", label: "FAQ" },
  ];

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {!isEmbed && <IGHeader />}

      <ToolLayout
        title="PPF Calculator (India)"
        updated="2025"
        categories={["PPF", "Investments", "Tax-free"]}
        breadcrumb={[
          { label: "Tools & Calculators", href: "/tools" },
          { label: "PPF Calculator" },
        ]}
        toc={tocItems}
        calculator={
          <>
            <ToolInput
              type="number"
              label="Annual contribution (₹)"
              value={amount}
              onChange={setAmount}
              error={errors.amount}
              help="PPF allows up to ₹1.5 lakh per year."
            />

            <ToolInput
              type="number"
              label="Duration (years)"
              value={years}
              onChange={setYears}
              error={errors.years}
              help="Minimum 15 years. You may extend in blocks of 5 years."
            />

            <ToolInput
              type="text"
              label="PPF Interest Rate (%)"
              value={rate.toString()}
              readOnly
            />

            <button className="tool-button tool-button-full" onClick={calculate}>
              Calculate PPF Maturity
            </button>

            {maturity !== null && totalInvested !== null && (
              <ToolOutput
                headline={`₹ ${formatIN(maturity)}`}
                headlineLabel="PPF Maturity Amount"
                note={`Total invested over ${years} years: ₹ ${formatIN(
                  totalInvested
                )}`}
                kpis={[
                  { label: "Total Invested", value: `₹ ${formatIN(totalInvested)}` },
                  {
                    label: "Total Interest Earned",
                    value: `₹ ${formatIN(maturity - totalInvested)}`,
                  },
                  {
                    label: "Average Annual Return",
                    value: `${rate.toFixed(2)}% (tax-free)`,
                  },
                ]}
              />
            )}
          </>
        }
      >
        {/* -------------------------- */}
        {/* ARTICLE CONTENT */}
        {/* -------------------------- */}
        <div ref={contentRef}>
          {/* HOW */}
          <section id="how">
            <h2>How this PPF Calculator works</h2>
            <p>
              PPF (Public Provident Fund) is one of India's safest and most tax-efficient
              long-term investments. This calculator shows you the final maturity amount based on:
            </p>
            <ul>
              <li>Annual investment amount</li>
              <li>PPF interest rate (7.1%)</li>
              <li>Duration (minimum 15 years)</li>
              <li>Yearly compounding</li>
            </ul>
            <p>
              PPF maturity and interest earned are completely <strong>tax-free</strong>.
            </p>
          </section>

          {/* FORMULA */}
          <section id="formula">
            <h2>PPF Formula Explained</h2>
            <p>
              PPF follows yearly compounding. Each year’s deposit earns interest until maturity.
            </p>

            <blockquote className="tool-detail-formula">
              Balanceₙ = (Balanceₙ₋₁ + Annual Deposit) × (1 + Rate)
            </blockquote>

            <p>
              For a 15-year term, this repeats 15 times. Extending PPF allows the same formula with
              more years added.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2>Frequently Asked Questions</h2>

            <h3>1. What is the maximum I can invest in PPF?</h3>
            <p>
              You can invest a maximum of <strong>₹1.5 lakh per year</strong>. Any amount above
              this does not earn interest.
            </p>

            <h3>2. Are PPF returns taxable?</h3>
            <p>No. PPF follows the EEE model — investment, interest, and maturity are all tax-free.</p>

            <h3>3. Can I extend PPF beyond 15 years?</h3>
            <p>
              Yes. You can extend in blocks of 5 years with or without contributions.
            </p>

            <h3>4. Is PPF better than FD?</h3>
            <p>
              Usually yes, because:
              <ul>
                <li>PPF is tax-free</li>
                <li>FD interest is taxable</li>
                <li>PPF rate is stable and government-backed</li>
              </ul>
            </p>
          </section>
        </div>
      </ToolLayout>

      {!isEmbed && <IGFooter />}
    </>
  );
}