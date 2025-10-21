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
import { metricBehaviorLogic } from "../../config/metricBehaviorLogic";
//import IGHeader from "@/app/components/IGHeader";

export default function GraphPage() {
  const { slug } = useParams();

  // 🔹 States
  const [graph, setGraph] = useState<any>(null);
  const [dataset, setDataset] = useState<any[]>([]);
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
  const [activeDatasetId, setActiveDatasetId] = useState<number | null>(null);

  

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

        // Fetch all datasets (instead of single)
const { data: datasetData, error: datasetError } = await supabase
  .from("datasets")
  .select("id, name, color, unit, metric_type, metric_behavior")
  .eq("graph_id", graphData.id);

if (datasetError || !datasetData?.length) throw datasetError;

// Save all datasets (array)
setDataset(datasetData);

// Default active dataset (first)
setActiveDatasetId(datasetData[0]?.id || null);



        // Fetch data points for all datasets
const { data: points, error: pointsError } = await supabase
  .from("data_points")
  .select("dataset_id, period_label, value, period_start")
  .in("dataset_id", datasetData.map((d) => d.id))
  .order("period_start", { ascending: true });

if (pointsError) throw pointsError;

// Store all points
setDataPoints(points || []);

// ✅ Default filtered data for first dataset
const firstDatasetId = datasetData[0]?.id;
const defaultFiltered = (points || []).filter(
  (p) => p.dataset_id === firstDatasetId
);
setFiltered(defaultFiltered);

        setDataPoints(points || []);
       
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


// 🔁 Update filtered data when dropdown changes
useEffect(() => {
  if (!activeDatasetId) return;
  const newFiltered = dataPoints.filter((d) => d.dataset_id === activeDatasetId);
  setFiltered(newFiltered);
}, [activeDatasetId, dataPoints]);


  // ⚙️ Filter + Calculate stats
  // ⚙️ Filter + Calculate stats (scoped per dataset)
useEffect(() => {
  if (!dataPoints.length || !activeDatasetId) return;

  // 🔹 Step 1: filter only current dataset
  let filteredData = dataPoints.filter((d) => d.dataset_id === activeDatasetId);

  // 🔹 Step 2: apply time filters
  if (periodType === "5") filteredData = filteredData.slice(-6);
  else if (periodType === "10") filteredData = filteredData.slice(-11);
  else if (periodType === "custom" && startLabel && endLabel) {
    const startIdx = filteredData.findIndex((d) => d.period_label === startLabel);
    const endIdx = filteredData.findIndex((d) => d.period_label === endLabel);
    if (startIdx >= 0 && endIdx >= 0) {
      filteredData = filteredData.slice(startIdx, endIdx + 1);
    }
  }

  // 🔹 Step 3: append latest manual value if entered
  if (latestValue) {
    filteredData = [
      ...filteredData,
      { period_label: "Latest", value: latestValue, dataset_id: activeDatasetId },
    ];
  }

  // 🔹 Step 4: update filtered state
  setFiltered(filteredData);

  // 🔹 Step 5: calculate CAGR + Total Return (only for growth datasets)
  if (filteredData.length >= 2) {
    const start = filteredData[0].value;
    const end = filteredData[filteredData.length - 1].value;
    const years = filteredData.length - 1;

    const cagrVal = ((Math.pow(end / start, 1 / years) - 1) * 100).toFixed(2);
    const totalVal = (((end - start) / start) * 100).toFixed(2);

    setCagr(`${cagrVal}%`);
    setTotalReturn(`${totalVal}%`);
  }
}, [activeDatasetId, periodType, startLabel, endLabel, latestValue, dataPoints]);
 

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

    // 🎯 Determine which dataset is active
const activeDataset =
  Array.isArray(dataset) && activeDatasetId
    ? dataset.find((d) => d.id === activeDatasetId)
    : dataset[0];
  // Only use points belonging to the active dataset
const activeData = dataPoints.filter((p) => p.dataset_id === activeDatasetId);
const labels = activeData.map((d) => d.period_label);
const values = activeData.map((d) => d.value);

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

{/* Dataset Selector */}
{Array.isArray(dataset) && dataset.length > 1 && (
  <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-8 animate-fadeInUp">
    <div className="relative flex items-center gap-3 flex-wrap justify-center">
      <label
        htmlFor="dataset-select"
        className="text-sm text-gray-600 font-medium whitespace-nowrap"
      >
        Select Dataset:
      </label>

      {/* Custom dropdown container */}
      <div className="relative">
        <select
          id="dataset-select"
          className="appearance-none px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm text-sm text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all 
                     hover:shadow-md min-w-[260px] text-center pr-8 cursor-pointer"
          value={activeDatasetId ?? ""}
          onChange={(e) => setActiveDatasetId(Number(e.target.value))}
        >
          {dataset.map((ds) => {
            const unitText =
              ds.name.includes(ds.unit) || !ds.unit ? "" : ` (${ds.unit})`;
            return (
              <option key={`${ds.id}-${ds.name}`} value={ds.id}>
                {ds.name}
                {unitText}
              </option>
            );
          })}
        </select>

        {/* Custom SVG arrow */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-70"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  </div>
)}
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

 {/* Stats (Dynamic from metricBehaviorLogic) */}
<section className="mb-4 sm:mb-5 animate-fadeInUp">
  {(() => {
    if (!activeDataset) return null;

    const behavior =
      activeDataset.metric_behavior ||
      activeDataset.metric_type ||
      "value";
    console.log("📊 Active Metric Behavior:", behavior);
    const unit = activeDataset.unit || "";
    const start = labels[0] || "—";
    const end = labels.at(-1) || "—";
    const yearsText = `${start} → ${end}`;
    const logicFn =
  metricBehaviorLogic[
    behavior as keyof typeof metricBehaviorLogic
  ] || metricBehaviorLogic.value;

  // Recalculate cards every time dataset changes
const validValues = values.filter((v) => !isNaN(v));


    // Generate the stats dynamically
    const stats = logicFn(values, cagr, totalReturn, yearsText, unit);

    return (
  <div className="transition-opacity duration-300 ease-in-out" key={activeDatasetId}>
    <GraphStats stats={stats} />
  </div>
);
  })()}
</section>
          {/* Chart */}
          <section className="animate-fadeInUp">
            <GraphChart
  title={activeDataset?.name || graph.title}
  labels={filtered.map((d) => d.period_label)}
  values={filtered.map((d) => d.value)}
  unit={activeDataset?.unit || ""}
/>
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