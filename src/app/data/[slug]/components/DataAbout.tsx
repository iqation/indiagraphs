"use client";

type Props = {
  description: string;
  source: string;
  source_url?: string;
  metricBehavior?: string;
  category?: string;
};

export default function GraphAbout({
  description,
  source,
  source_url,
  metricBehavior,
  category,
}: Props) {
  // Normalize behavior
  const behavior = (metricBehavior || "").toLowerCase();

  let formula = "";
  let explanation = "";
  let exploreSteps: string[] = [];

  switch (behavior) {
    // -----------------------------
    //  📈 TRUE GROWTH METRICS ONLY
    // -----------------------------
    case "growth":
      formula = "CAGR = [(Ending Value / Starting Value) ^ (1 / Years)] − 1";
      explanation =
        "CAGR shows the long-term annual growth rate of a metric, smoothing out short-term fluctuations.";
      exploreSteps = [
        "Choose 5Y / 10Y / Custom to compare long-term phases.",
        "Adjust Start–End years to re-evaluate growth periods.",
        "Enter the latest value (optional) to recalculate returns."
      ];
      break;

    // -----------------------------
    //  ❗ VALUE METRICS (NO CAGR)
    //  Example: Digital payments, frauds, tax collections, etc.
    // -----------------------------
    case "value":
      formula = "Value = As reported by the official source.";
      explanation =
        "This dataset represents reported values over time. Growth patterns should be interpreted using the chart and filters, not CAGR.";
      exploreSteps = [
        "Use custom date filters to explore different periods.",
        "Track short-term spikes or declines using MoM changes.",
        "Compare early vs recent values to understand scale changes."
      ];
      break;

    // -----------------------------
    //  💹 RATE / INTEREST / YIELD
    // -----------------------------
    case "rate":
      formula = "Interest Rate = Annual return offered for the period.";
      explanation =
        "Shows how official rates set by RBI or Government changed over time.";
      exploreSteps = [
        "Use time filters to compare old vs new rate regimes.",
        "Observe policy-driven rate cuts or hikes."
      ];
      break;

    // -----------------------------
    //  📊 INDEXES (CPI, WPI, etc.)
    // -----------------------------
    case "index":
      formula = "Index = (Current Value / Base Year Value) × 100";
      explanation =
        "Indexes show change relative to a base year, commonly used for prices or fiscal indicators.";
      exploreSteps = [
        "Switch time ranges to analyze inflationary or deflationary phases.",
        "Identify major economic event impacts on the index."
      ];
      break;

    // -----------------------------
    //  ⚖️ RATIOS (Debt/GDP, Fiscal ratio)
    // -----------------------------
    case "ratio":
      formula = "Ratio = Numerator / Denominator × 100";
      explanation = "Represents proportional change between two variables.";
      exploreSteps = [
        "Analyze shifts during economic cycles.",
        "Identify periods of fiscal tightening or loosening."
      ];
      break;

    // -----------------------------
    //  💱 FOREX
    // -----------------------------
    case "forex":
      formula = "Exchange Rate = ₹ per foreign currency unit";
      explanation =
        "Shows how the Indian Rupee has strengthened or weakened against other currencies.";
      exploreSteps = [
        "Compare long-term depreciation trends.",
        "Spot sharp movements around global events."
      ];
      break;

    // -----------------------------
    //  🌾 TRADE / EXPORTS
    // -----------------------------
    case "trade":
      formula = "Growth = [(Latest − Start) / Start] × 100";
      explanation =
        "Shows evolution of India’s trade metrics, measured in volume or value.";
      exploreSteps = [
        "Use dataset selector for quantity/value comparison.",
        "Track how exports/imports responded to global cycles."
      ];
      break;

    // -----------------------------
    //  🌐 DEFAULT
    // -----------------------------
    default:
      formula = "Value = As reported by the official source.";
      explanation =
        "Represents data published directly by government or authoritative sources.";
      exploreSteps = [
        "Use time filters to explore patterns.",
        "Compare early vs recent periods for changes."
      ];
  }

  return (
    <section className="bg-white/70 rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-10">

      {/* No need to repeat header description here */}
     
      {/* Formula */}
      {formula && (
        <div className="border-l-4 border-indigo-500 pl-4 mb-4">
          <p className="text-sm text-gray-800 font-medium">
            <span className="font-semibold text-indigo-600">Formula:</span> {formula}
          </p>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <p className="text-sm text-gray-700 mb-4 italic">{explanation}</p>
      )}

      {/* Source */}
      <p className="text-sm text-gray-700 mb-3">
        <span className="font-semibold text-gray-800">Source:</span>{" "}
        {source_url ? (
          <a
            href={source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {source}
          </a>
        ) : (
          source
        )}
      </p>

      {/* Explore Tips */}
      <div>
        <p className="font-semibold text-gray-800 mb-2">
          How to explore this graph:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {exploreSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}