"use client";

import React from "react";

type KPI = {
  label: string;
  value: string | number;
};

type ToolOutputProps = {
  headline?: string | number;
  headlineLabel?: string;
  note?: string;
  kpis?: KPI[];
  chart?: React.ReactNode; // optional charts (Pie/Bar/Line etc)
};

export function ToolOutput({
  headline,
  headlineLabel,
  note,
  kpis = [],
  chart,
}: ToolOutputProps) {
  return (
    <div className="tool-output-wrapper">

      {/* MAIN HEADLINE CARD */}
      {headline !== undefined && (
        <div className="tool-result tool-result-card">
          {headlineLabel && (
            <div className="tool-result-label">{headlineLabel}</div>
          )}

          <div className="tool-result-main">{headline}</div>

          {note && <p className="tool-result-note">{note}</p>}
        </div>
      )}

      {/* KPI BLOCKS */}
      {kpis.length > 0 && (
        <div className="tool-kpis">
          {kpis.map((k, i) => (
            <div key={i} className="tool-kpi">
              <strong>{k.value}</strong>
              {k.label}
            </div>
          ))}
        </div>
      )}

      {/* OPTIONAL CHART SECTION */}
      {chart && <div className="tool-output-chart">{chart}</div>}
    </div>
  );
}