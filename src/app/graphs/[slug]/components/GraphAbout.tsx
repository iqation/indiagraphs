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
  let formula = "";
  let explanation = "";
  let exploreSteps: string[] = [];

  switch (metricBehavior?.toLowerCase()) {
    // 📈 Growth / Value Metrics (Gold, GDP, Debt)
    case "growth":
    case "value":
      formula = "CAGR = [(Ending Value / Starting Value) ^ (1 / Years)] − 1";
      explanation =
        "Compound Annual Growth Rate (CAGR) measures the average yearly rate at which a value has grown over time, smoothing short-term fluctuations.";
      exploreSteps = [
        "Select 5Y / 10Y / Custom range to view long-term growth trends.",
        "Adjust start and end FY to analyze different growth phases.",
        "Optionally enter latest value to recalculate CAGR.",
      ];
      break;

    // 💹 Interest / Yield / Rate Metrics (PPF, FD, Sukanya, NSC)
    case "rate":
      formula = "Interest Rate = Annualized return offered during a given period.";
      explanation =
        "Shows how the official interest rate changed over time based on Ministry of Finance or RBI circulars.";
      exploreSteps = [
        "Select time period to compare different rate regimes.",
        "Use the graph to visualize rate cuts or hikes over time.",
      ];
      break;

    // 📊 Inflation / CPI Metrics
    case "inflation":
      formula = "Inflation Rate = [(Current CPI − Previous CPI) / Previous CPI] × 100";
      explanation =
        "Measures the percentage change in the Consumer Price Index (CPI) compared to the previous period — indicating how fast prices are rising.";
      exploreSteps = [
        "Select year range to observe India's inflation trend.",
        "Compare short-term vs. long-term inflation changes.",
      ];
      break;

    // 🧮 Index or Ratio Metrics (CPI Index, Fiscal Ratio, etc.)
    case "index":
    case "ratio":
      formula = "Index = (Current Value / Base Year Value) × 100";
      explanation =
        "Represents a relative measure compared to a base year or reference value — commonly used for CPI, WPI, or fiscal ratios.";
      exploreSteps = [
        "Select time frame to analyze how index values evolved.",
        "Identify patterns during key economic or policy events.",
      ];
      break;

    // 🧾 Fallback for Others
    default:
      formula = "Value = As reported by official data source.";
      explanation =
        "Represents an official dataset showing change over time as published by a verified data provider.";
      exploreSteps = [
        "Use filters to explore time-based patterns.",
        "Analyze direction and scale of change across periods.",
      ];
      break;
  }

  return (
    <section className="bg-white/70 rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-10">
      <p className="text-gray-700 mb-5 leading-relaxed">{description}</p>

      <div className="border-l-4 border-indigo-500 pl-4 mb-4">
        <p className="text-sm text-gray-800 font-medium">
          <span className="font-semibold text-indigo-600">Formula:</span> {formula}
        </p>
      </div>

      <p className="text-sm text-gray-700 mb-4 italic">{explanation}</p>

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

      <div>
        <p className="font-semibold text-gray-800 mb-2">How to explore this graph:</p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {exploreSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}