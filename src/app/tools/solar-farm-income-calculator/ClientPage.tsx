"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import { ToolLayout } from "../components/ToolLayout";
import { ToolInput } from "../components/ToolInput";
import { ToolOutput } from "../components/ToolOutput";
import { validateNumberField } from "../utils/validation";


import "../tools.css";

// ⭐ Add this EXACTLY here
type Props = {
  isEmbed: boolean;
};

// Format numbers with commas for India
const formatIN = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("en-IN") : "0";

export default function SolarFarmIncomeCalculatorPage({ isEmbed }: Props) {

  // ⭐ Detect embed mode

  // Inputs
  const [area, setArea] = useState("");
  const [tariff, setTariff] = useState("");
  const [cuf, setCuf] = useState("19");
  const [mwPerAcre, setMwPerAcre] = useState("1");

  // Results
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [totalGeneration, setTotalGeneration] = useState<number | null>(null);

  // --- AUTO TOC ---
  const [toc, setToc] = useState<{ id: string; label: string }[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tocItems = [
  { id: "how-it-works", label: "How this calculator works" },
  { id: "assumptions", label: "Key assumptions & logic" },
  { id: "realism-note", label: "Realism note" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "faq", label: "Frequently asked questions" },
];

  useEffect(() => {
    if (!contentRef.current) return;

    const headings = Array.from(
      contentRef.current.querySelectorAll("h2[id]")
    ).map((h) => ({
      id: h.id,
      label: h.textContent || "",
    }));

    setToc(headings);
  }, []);

  // Compute generation per acre
  const generationPerAcre = useMemo(() => {
    const cufVal = parseFloat(cuf);
    const mwVal = parseFloat(mwPerAcre);
    const hours = 8760;

    if (!cufVal || !mwVal) return 0;

    const raw = mwVal * 1000 * hours * (cufVal / 100);
    return Math.round(raw * 0.9);
  }, [cuf, mwPerAcre]);

   // ----------------------
// ⭐ ERROR STATE
// ----------------------
const [errors, setErrors] = useState({
  area: "",
  tariff: "",
  cuf: "",
  mwPerAcre: ""
});

// ----------------------
// ⭐ VALIDATION FUNCTION
// ----------------------
function runValidation() {
  const newErrors = {
    area: validateNumberField({
      label: "Land area",
      value: area,
      min: 0.1,
      max: 100000
    }),
    tariff: validateNumberField({
      label: "Tariff rate",
      value: tariff,
      min: 0.1,
      max: 50
    }),
    cuf: validateNumberField({
      label: "CUF",
      value: cuf,
      min: 5,
      max: 60
    }),
    mwPerAcre: validateNumberField({
      label: "Installed capacity per acre",
      value: mwPerAcre,
      min: 0.1,
      max: 5
    })
  };

  setErrors(newErrors);

  return Object.values(newErrors).every((e) => e === "");
}


  const calculate = () => {
    if (!runValidation()) return;
    const areaVal = parseFloat(area);
    const tariffVal = parseFloat(tariff);

    if (!areaVal || !tariffVal) {
      alert("Please enter valid values.");
      return;
    }

    const totalGen = areaVal * generationPerAcre;
    setTotalGeneration(totalGen);
    setAnnualIncome(totalGen * tariffVal);
  };

  const monthlyIncome = useMemo(
    () => (annualIncome ? Math.round(annualIncome / 12) : 0),
    [annualIncome]
  );

  // Calculator card (right)
  const calculatorCard = (
    <>
      <ToolInput
        type="number"
        label="Land area (in acres)"
        value={area}
        onChange={setArea}
        error={errors.area}
      />

      <ToolInput
        type="number"
        label="Tariff rate (₹ per kWh)"
        value={tariff}
        onChange={setTariff}
        error={errors.tariff}
      />

      <ToolInput
        type="number"
        label="CUF (Capacity Utilization Factor %)"
        min={10}
        max={25}
        step={0.1}
        value={cuf}
        onChange={setCuf}
      />

      <ToolInput
        type="number"
        label="Installed capacity per acre (MW)"
        help="Most utility-scale plants install ~1 MW/acre."
        min={0.2}
        max={1}
        step={0.01}
        value={mwPerAcre}
        onChange={setMwPerAcre}
      />

      <ToolInput
        type="text"
        readOnly
        label="Annual generation per acre (kWh)"
        value={formatIN(generationPerAcre)}
        onChange={() => {}}
      />

      <button className="tool-button tool-button-full" onClick={calculate}>
        Calculate Income
      </button>

      {annualIncome !== null && totalGeneration !== null && (
        <ToolOutput
          headline={`₹ ${formatIN(annualIncome)}`}
          headlineLabel="Estimated Annual Income"
          note={`Based on ${area} acre(s), tariff ₹${tariff}/kWh and ${formatIN(
            totalGeneration
          )} kWh/year total generation.`}
          kpis={[
            { label: "Yearly", value: `₹ ${formatIN(annualIncome)}` },
            { label: "Monthly", value: `₹ ${formatIN(monthlyIncome)}` },
            { label: "Generation", value: `${formatIN(totalGeneration)} kWh` },
          ]}
        />
      )}
    </>
  );

 
  return (
    <>
    {!isEmbed && <IGHeader />}
    <ToolLayout
      title="Solar Farm Income Calculator"
      updated="Nov 2025"
      categories={["Energy", "Solar", "Investments"]}
      breadcrumb={[
        { label: "Tools & Calculators", href: "/tools" },
        { label: "Solar Farm Income Calculator" },
      ]}
      calculator={calculatorCard}
      toc={tocItems}  
    >
      {/* --- AUTO TOC --- */}

      
      

      {/* --- FULL CONTENT --- */}
      <div ref={contentRef}>
        {/* ============================
            HOW IT WORKS
        ============================ */}
        <section id="how-it-works">
          <h2>How this Solar Farm Income Calculator works</h2>

          <p>
            This tool gives you a quick, back-of-the-envelope estimate of how
            much income a solar farm can generate from your land in India. You
            choose:
          </p>

          <ul>
            <li>How many acres of land you want to use</li>
            <li>The tariff rate (₹ per unit / kWh) from your PPA</li>
            <li>
              CUF - Capacity Utilization Factor (how efficiently the plant runs)
            </li>
            <li>
              Installed capacity per acre (MW), usually close to 1 MW/acre for
              utility-scale
            </li>
          </ul>

          <p>
            The calculator then estimates the annual energy generation and
            multiplies it by your tariff to get a rough yearly income.
          </p>
        </section>

        {/* ============================
            ASSUMPTIONS
        ============================ */}
        <section id="assumptions">
          <h2>Key assumptions and logic</h2>

          <div className="tool-detail-table">
            <div className="tool-detail-table-row">
              <div>Land area</div>
              <div>1 acre ≈ 4,047 sq.m</div>
              <div>Typical farm-scale plot</div>
            </div>
            <div className="tool-detail-table-row">
              <div>Installable capacity</div>
              <div>~1 MW (DC) per acre</div>
              <div>Can vary by design & layout</div>
            </div>
            <div className="tool-detail-table-row">
              <div>CUF (efficiency factor)</div>
              <div>~19% (default)</div>
              <div>
                Higher in Rajasthan/Gujarat, lower in cloudier regions
              </div>
            </div>
            <div className="tool-detail-table-row">
              <div>Annual hours</div>
              <div>8,760 hours/year</div>
              <div>Standard calendar year</div>
            </div>
            <div className="tool-detail-table-row">
              <div>Loss factor</div>
              <div>~10% losses</div>
              <div>Cable, inverter, downtime etc.</div>
            </div>
            <div className="tool-detail-table-row">
              <div>Tariff</div>
              <div>₹2.5 – ₹4.0 / kWh</div>
              <div>State & PPA dependent</div>
            </div>
          </div>

          <p>
            With the default values (1 acre, 1 MW, 19% CUF), the theoretical
            generation is:
          </p>

          <div className="tool-detail-formula">
            1 MW × 8,760 hours × 19% = 1,664,400 kWh/year
          </div>

          <p>
            After ~10% system losses, we round this to{" "}
            <strong>~15,00,000 kWh/year</strong> per acre. The calculator
            multiplies this by your land area and tariff rate.
          </p>

          <p className="tool-detail-footnote">
            Note: CUF reference is broadly aligned with CERC RE Tariff
            Regulations for solar PV projects.
          </p>
        </section>

        {/* ============================
            REALISM NOTE
        ============================ */}
        <section id="realism-note">
          <h2>Realism note</h2>

          <p>This is intentionally a quick estimation tool. It does not include:</p>

          <ul>
            <li>Project capital cost and financing</li>
            <li>O&M (operation & maintenance) expenses</li>
            <li>Panel degradation over 25 years</li>
            <li>Land cost or lease charges</li>
            <li>Grid availability and curtailment</li>
          </ul>

          <p>
            Think of it as a friendly “first pass” before you open Excel or call
            your consultant.
          </p>
        </section>

        {/* ============================
            DISCLAIMER
        ============================ */}
        <section id="disclaimer">
          <h2>Disclaimer</h2>

          <p>
            This calculator is for educational use only. Actual returns will
            depend on site-specific solar irradiation, EPC quality, financing
            terms, state policies and the fine print of your Power Purchase
            Agreement (PPA).
          </p>

          <p>
            Indiagraphs is not responsible for investment decisions taken solely
            on the basis of this estimate. Please treat this as a starting
            point, not financial advice.
          </p>
        </section>

        {/* ============================
            FAQ
        ============================ */}
        <section id="faq">
          <h2>Frequently Asked Questions</h2>

          <h3>1. How much can I earn from a 1 acre solar plant in India?</h3>
          <p>
            With a CUF of around 19% and a tariff of ₹3.5 per unit, a 1 MW plant
            on 1 acre can generate roughly{" "}
            <strong>1.5 million kWh/year</strong>. That works out to around{" "}
            <strong>₹52–53 lakh</strong> in annual revenue before costs.
          </p>

          <h3>2. What is CUF and why does it matter?</h3>
          <p>
            CUF (Capacity Utilization Factor) measures how much energy a plant
            actually generates versus running at full capacity all year. For
            solar PV in India, CUF usually falls between 16–22%. Higher CUF =
            more kWh = more revenue.
          </p>

          <h3>3. How much does a 1 MW solar plant generate per year?</h3>
          <p>
            A 1 MW plant in India typically generates{" "}
            <strong>1.5–1.7 million kWh per year</strong>, depending on
            sunlight, panel quality and downtime. Our default setting is
            deliberately conservative.
          </p>

          <h3>4. Are these numbers India only?</h3>
          <p>
            The defaults are tuned for India, but you can use the calculator
            anywhere by adjusting CUF, MW per acre and tariff according to your
            local conditions.
          </p>

          <h3>5. Does this include project costs and maintenance?</h3>
          <p>
            No. This is a <strong>gross income</strong> estimate. Net profit
            will depend on capex, O&M, financing structure and taxes.
          </p>
        </section>
      </div>
    </ToolLayout>
    {!isEmbed && <IGFooter />}
    </>
  );
}