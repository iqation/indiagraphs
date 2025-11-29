"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type PieChartProps = {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  width?: number;
  height?: number;
};

export function IG_PieChart({
  data,
  colors = ["#4CAF50", "#FFC107", "#03A9F4", "#E91E63"],
  width = 350,
  height = 280,
}: PieChartProps) {
  return (
    <div className="tool-chart-container">
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          label
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={colors[i % colors.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}