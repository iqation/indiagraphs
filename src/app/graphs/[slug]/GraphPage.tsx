"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

// Components
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import BreadcrumbHeader from "../../components/BreadcrumbHeader";
import GraphHeader from "./components/GraphHeader";
import GraphFilters from "./components/GraphFilters";
import GraphStats from "./components/GraphStats";
import GraphChart from "./components/GraphChart";
import GraphAbout from "./components/GraphAbout";
import RelatedGraphs from "./components/RelatedGraphs";
//import IGHeader from "@/app/components/IGHeader";

export default function GraphPage() {
  const { slug } = useParams();

  // 🔹 States
  const [graph, setGraph] = useState<any>(null);
  const [dataset, setDataset] = useState<any>(null);
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [periodType, setPeriodType] = useState("custom");
  const [startLabel, setStartLabel] = useState("");
  const [endLabel, setEndLabel] = useState("");
  const [latestValue, setLatestValue] = useState<number | null>(null);

  const [cagr, setCagr] = useState<string>("--");
  const [totalReturn, setTotalReturn] = useState<string>("--");
  const [relatedGraphs, setRelatedGraphs] = useState<
    { title: string; slug: string }[]
  >([]);

  // 🚀 Fetch Graph + Dataset + DataPoints
  useEffect(() => {
    async function fetchGraph() {
      try {
        // 1️⃣ Graph details
        const { data: graphData, error: graphError } = await supabase
          .from("graphs")
          .select("*")
          .eq("slug", slug)
          .single();
        if (graphError || !graphData) throw graphError;
        setGraph(graphData);

        // 2️⃣ Dataset
        const { data: datasetData, error: datasetError } = await supabase
          .from("datasets")
          .select("id, name, color, unit, metric_type")
          .eq("graph_id", graphData.id)
          .single();
        if (datasetError || !datasetData) throw datasetError;
        setDataset(datasetData);

        // 3️⃣ Data points
        const { data: points, error: pointsError } = await supabase
          .from("data_points")
          .select("period_label, value")
          .eq("dataset_id", datasetData.id)
          .order("period_start", { ascending: true });
        if (pointsError) throw pointsError;

        setDataPoints(points || []);
        setFiltered(points || []);

        // 4️⃣ Related graphs
        const { data: related, error: relatedError } = await supabase
          .from("graphs")
          .select("title, slug")
          .eq("category", graphData.category)
          .neq("slug", slug)
          .limit(4);
        if (!relatedError) setRelatedGraphs(related || []);

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setLoading(false);
      }
    }

    fetchGraph();
  }, [slug]);

  // ⚙️ Filter + Calculate stats
  useEffect(() => {
    if (!dataPoints.length) return;

    let filteredData = [...dataPoints];

    if (periodType === "5") filteredData = dataPoints.slice(-6);
    else if (periodType === "10") filteredData = dataPoints.slice(-11);
    else if (periodType === "custom" && startLabel && endLabel) {
      const startIdx = dataPoints.findIndex((d) => d.period_label === startLabel);
      const endIdx = dataPoints.findIndex((d) => d.period_label === endLabel);
      if (startIdx >= 0 
        
        
        && endIdx >= 0)
        filteredData = dataPoints.slice(startIdx, endIdx + 1);
    }

    if (latestValue) {
      filteredData = [
        ...filteredData,
        { period_label: "Latest", value: latestValue },
      ];
    }

    setFiltered(filteredData);

    if (filteredData.length >= 2) {
      const start = filteredData[0].value;
      const end = filteredData[filteredData.length - 1].value;
      const years = filteredData.length - 1;

      const cagrVal = ((Math.pow(end / start, 1 / years) - 1) * 100).toFixed(2);
      const totalVal = (((end - start) / start) * 100).toFixed(2);

      setCagr(`${cagrVal}%`);
      setTotalReturn(`${totalVal}%`);
    }
  }, [periodType, startLabel, endLabel, latestValue, dataPoints]);

  // ⏳ Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600 font-semibold">
        Loading Graph Data...
      </div>
    );

  if (!graph || !dataPoints.length)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
        Graph not found or has no data.
      </div>
    );

  if (!dataset)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dataset...
      </div>
    );

  const labels = filtered.map((d) => d.period_label);
  const values = filtered.map((d) => d.value);

  // ✅ Render (optimized first fold)
  return (
    
      <>
    <IGHeader />

     <main
  className="min-h-screen bg-gradient-to-br from-[#fdfdfe] to-[#f5f7ff] py-6 sm:py-8 relative"
  style={{
    zIndex: 0,
    isolation: "isolate",
    position: "relative",
    overflow: "visible",
  }}
>
        <div className="mx-auto w-full max-w-[940px] px-5 sm:px-6 space-y-6 sm:space-y-7">
          {/* Breadcrumb */}
          <BreadcrumbHeader category={graph.category} />

          {/* Header */}
          <section className="mb-3 sm:mb-4 animate-fadeInUp">
            <GraphHeader
              title={graph.title}
              subtitle={graph.description || ""}
              source={graph.source}
            />
          </section>

          {/* Filters */}
          <section className="mb-4 sm:mb-5 animate-fadeInUp">
            <GraphFilters
              allLabels={dataPoints.map((d) => d.period_label)}
              startLabel={startLabel}
              endLabel={endLabel}
              setStartLabel={setStartLabel}
              setEndLabel={setEndLabel}
              setLatestValue={setLatestValue}
              setPeriodType={setPeriodType}
              periodType={periodType}
            />
          </section>

          {/* Stats */}
          <section className="mb-4 sm:mb-5 animate-fadeInUp">
            {(() => {
              const stats: { label: string; value: string }[] = [];
              if (dataset.metric_type === "growth") {
                stats.push(
                  { label: "CAGR", value: cagr },
                  { label: "Total Return", value: totalReturn },
                  { label: "Years", value: `${labels[0]} → ${labels.at(-1)}` }
                );
              } else if (dataset.metric_type === "value") {
                stats.push(
                  {
                    label: `Latest Value (${dataset.unit || ""})`,
                    value: values.at(-1)?.toLocaleString("en-IN") || "--",
                  },
                  {
  label: "Years",
  value: (() => {
    // ✅ Build a clean array of all available labels
    const allLabels = dataPoints.map((d) => d.period_label);

    // ✅ Handle quick ranges first
    if (periodType === "5") return "Last 5 Years";
    if (periodType === "10") return "Last 10 Years";

    // ✅ Handle custom or default
    if (!startLabel || !endLabel) return "Select range";

    const startIndex = allLabels.indexOf(startLabel);
    const endIndex = allLabels.indexOf(endLabel);

    // ✅ Validate index range
    if (endIndex < startIndex) return "Invalid range";

    // ✅ Safely return the formatted years
    const start = labels[0] || "—";
    const end = labels[labels.length - 1] || "—";
    return `${start} → ${end}`;
  })(),
}
                );
              } else if (dataset.metric_type === "ratio") {
                const avg =
                  values.length > 0
                    ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
                    : "--";
                stats.push(
                  { label: "Average", value: `${avg}${dataset.unit || "%"}` },
                  { label: "Years", value: `${labels[0]} → ${labels.at(-1)}` }
                );
              } else if (dataset.metric_type === "index") {
                const change =
                  values.length >= 2
                    ? (((values.at(-1)! - values[0]) / values[0]) * 100).toFixed(2)
                    : "--";
                stats.push(
                  { label: "Change", value: `${change}%` },
                  { label: "Years", value: `${labels[0]} → ${labels.at(-1)}` }
                );
              } else {
                stats.push({
                  label: "Years",
                  value: `${labels[0]} → ${labels.at(-1)}`,
                });
              }
              return <GraphStats stats={stats} />;
            })()}
          </section>

          {/* Chart */}
          <section className="animate-fadeInUp">
            <GraphChart title={graph.title} labels={labels} values={values} />
          </section>

          {/* About */}
          <GraphAbout
            description={graph.description}
            source={graph.source}
            formula={"CAGR = [(Ending Value / Starting Value) ^ (1 / Years)] - 1"}
            interactionSteps={[
              "Select time range (5Y / 10Y / Custom)",
              "Adjust start and end FY to explore different trends",
              "Optionally enter custom latest price to recalculate CAGR",
            ]}
          />

          {/* Related */}
          <RelatedGraphs related={relatedGraphs} />
        </div>
      </main>
      
    <IGFooter />
   </>
  );
  
}