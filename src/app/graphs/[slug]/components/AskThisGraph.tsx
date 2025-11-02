"use client";
import { useState } from "react";

export default function AskThisGraph({ graphData }: { graphData: any }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  async function handleAsk() {
    setLoading(true);
    setInsight(null);

    try {
      const res = await fetch("/api/ask-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ graph: graphData }),
      });
      const data = await res.json();
      setInsight(data.answer || "No clear insight generated.");
    } catch (err) {
      console.error("AskThisGraph error:", err);
      setInsight("⚠️ Unable to generate insight right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 bg-white/70 backdrop-blur-md border border-gray-100 rounded-xl shadow-sm p-6 text-center">
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500
                   text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03]
                   transition-all disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "🟢 Ask this Graph: What does this trend mean?"}
      </button>

      {insight && (
        <p className="mt-4 text-gray-700 text-sm leading-relaxed animate-fadeIn">
          {insight}
        </p>
      )}
    </section>
  );
}