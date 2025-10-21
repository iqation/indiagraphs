// @ts-nocheck
export const metricBehaviorLogic = {
  growth: (values, cagr, totalReturn, yearsText, unit) => [
    { label: "CAGR", value: cagr || "--" },
    { label: "Total Return", value: totalReturn || "--" },
    { label: "Years", value: yearsText },
  ],

  rate: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));
    const max = valid.length ? Math.max(...valid).toFixed(2) : "--";
    const avg = valid.length
      ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)
      : "--";
    return [
      { label: "Max", value: `${max}${unit}` },
      { label: "Average", value: `${avg}${unit}` },
      { label: "Years", value: yearsText },
    ];
  },

  index: (values, cagr, totalReturn, yearsText, unit) => {
    const latest = values.at(-1)?.toLocaleString("en-IN") ?? "--";
    const change =
      values.length >= 2
        ? (((values.at(-1)! - values[0]) / values[0]) * 100).toFixed(1)
        : "--";
    return [
      { label: "Latest", value: `${latest} ${unit}` },
      { label: "Change Since Base", value: `${change}%` },
      { label: "Years", value: yearsText },
    ];
  },

  stock: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));
    const latest = valid.at(-1)?.toLocaleString("en-IN") ?? "--";
    const growth =
      valid.length >= 2
        ? (((valid.at(-1)! - valid[0]) / valid[0]) * 100).toFixed(1)
        : "--";
    return [
      { label: "Latest", value: `${latest} ${unit}` },
      { label: "Growth Since Start", value: `${growth}%` },
      { label: "Years", value: yearsText },
    ];
  },

  ratio: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));
    const max = valid.length ? Math.max(...valid).toFixed(2) : "--";
    const min = valid.length ? Math.min(...valid).toFixed(2) : "--";
    return [
      { label: "Max", value: `${max}${unit}` },
      { label: "Min", value: `${min}${unit}` },
      { label: "Years", value: yearsText },
    ];
  },

  value: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));
    const max = valid.length
      ? Math.max(...valid).toLocaleString("en-IN")
      : "--";
    const avg = valid.length
      ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)
      : "--";
    return [
      { label: "Max", value: `${max} ${unit}` },
      { label: "Average", value: `${avg} ${unit}` },
      { label: "Years", value: yearsText },
    ];
  },
};