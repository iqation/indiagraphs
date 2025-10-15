"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
  ChartDataset,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import { useRef } from "react";

// 🪄 Register chart components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

// ✅ Extend dataset type to allow glow properties
type GlowDataset = ChartDataset<"line"> & {
  borderShadowColor?: string;
  borderShadowBlur?: number;
};

// 🌈 Custom glow plugin (safe version)
ChartJS.register({
  id: "lineGlow",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;

    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      const ds = dataset as GlowDataset;

      if (!meta.hidden && ds.borderShadowColor && meta?.dataset) {
        ctx.save();
        ctx.shadowColor = ds.borderShadowColor;
ctx.shadowBlur = ds.borderShadowBlur ?? 10;

// ✅ Ensure borderWidth is always a number
const lineWidth =
  typeof ds.borderWidth === "number"
    ? ds.borderWidth
    : Array.isArray(ds.borderWidth)
    ? ds.borderWidth[0] ?? 2
    : 2;

ctx.lineWidth = lineWidth;
ctx.strokeStyle = ds.borderColor as string;
        ctx.beginPath();

        // ✅ Type-safe null check before drawing
        // ✅ Safely cast and call draw if it exists
const datasetEl = meta.dataset as unknown as { draw?: (ctx: CanvasRenderingContext2D) => void };
if (datasetEl && typeof datasetEl.draw === "function") {
  datasetEl.draw(ctx);
}

        ctx.restore();
      }
    });
  },
});

export default function GraphChart({
  title,
  labels,
  values,
}: {
  title: string;
  labels: string[];
  values: number[];
}) {
  const chartRef = useRef<any>(null);

  // 🌅 Gradient fill generator
  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(59,91,219,0.25)");
    gradient.addColorStop(0.5, "rgba(59,91,219,0.1)");
    gradient.addColorStop(1, "rgba(59,91,219,0)");
    return gradient;
  };

  // 📊 Chart Data
  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: "#3B5BDB",
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "#3B5BDB22";
          return getGradient(ctx, chartArea);
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.4,
        borderJoinStyle: "round",
        borderCapStyle: "round",

        // 🌟 Point styling
        pointBackgroundColor: labels.map((l) =>
          l === "Latest" ? "#FF7043" : "#3B5BDB"
        ),
        pointBorderColor: labels.map((l) =>
          l === "Latest" ? "#ffffff" : "#3B5BDB"
        ),
        pointRadius: labels.map((l) => (l === "Latest" ? 7 : 3)),
        pointHoverRadius: labels.map((l) => (l === "Latest" ? 9 : 5)),
        pointHoverBorderWidth: 2,
        borderDash: labels.includes("Latest") ? [5, 4] : undefined,

        // 💫 Glow
        borderShadowColor: "rgba(59,91,219,0.6)",
        borderShadowBlur: 10,
      } as GlowDataset,
    ],
  };

  // ⚙️ Chart Options
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1800,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          color: "#6b7280",
          font: { size: 12, weight: 600 },
          boxWidth: 10,
          boxHeight: 4,
          usePointStyle: true,
          padding: 8,
        },
      },
      tooltip: {
        backgroundColor: "rgba(28,28,50,0.95)",
        borderColor: "#3B5BDB",
        borderWidth: 1,
        cornerRadius: 8,
        titleColor: "#fff",
        bodyColor: "#e0e7ff",
        displayColors: false,
        padding: 10,
        callbacks: {
          label: (context) =>
            ` ₹${context.parsed.y.toLocaleString("en-IN")}`,
        },
      },
      datalabels: {
        align: "top",
        anchor: "end",
        color: "#374151",
        font: { weight: 600, size: 11 },
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels?.[ctx.dataIndex];
          return label === "Latest"
            ? `₹${(value as number).toLocaleString("en-IN")}`
            : "";
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: "rgba(0,0,0,0.04)",
          ...( { drawBorder: false } as any ),
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          callback: (value: string | number) =>
            typeof value === "number"
              ? value.toLocaleString("en-IN")
              : value,
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-[#eef2ff] rounded-2xl p-5 sm:p-6 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-all h-[420px]">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}