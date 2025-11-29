"use client";

import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export function IG_LineChart({
  data = [],
  dataKey = "value",
  color = "#FF7043",
  width = 350,
  height = 280,
}) {
  return (
    <div className="tool-chart-container">
      <RLineChart width={width} height={height} data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />
        <YAxis />

        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </RLineChart>
    </div>
  );
}