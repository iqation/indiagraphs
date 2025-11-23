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
      { label: "Latest FY Index", value: `${latest} ${unit}` },
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

  forex: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));
    const latest = valid.at(-1)?.toFixed(2) ?? "--";
    const yoyChange =
      valid.length >= 2
        ? (((valid.at(-1)! - valid.at(-2)!) / valid.at(-2)!) * 100).toFixed(2)
        : "--";
    return [
      { label: "Latest FY Rate", value: `${latest} ${unit}` },
      { label: "YoY Change", value: `${yoyChange}%` },
      { label: "Years", value: yearsText },
    ];
  },

  trade: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));
    const max = valid.length
      ? Math.max(...valid).toLocaleString("en-IN")
      : "--";
    const growth =
      valid.length >= 2
        ? (((valid.at(-1)! - valid[0]) / valid[0]) * 100).toFixed(1)
        : "--";
    return [
      { label: "Max", value: `${max} ${unit}` },
      { label: "Growth Since Start", value: `${growth}%` },
      { label: "Years", value: yearsText },
    ];
  },

  /**
   * 🚀 NEW & IMPROVED — Digital Payments, Volumes, Monthly data
   * For metric_behavior = "value"
   * Shows: MoM growth, Total Growth, Period
   */
  value: (values, cagr, totalReturn, yearsText, unit) => {
    const valid = values.filter((v) => !isNaN(v));

    // detect monthly payment-like datasets
    const isMonthly =
      values.length > 12 ||
      unit?.includes("cr") ||
      unit?.includes("Cr") ||
      unit?.includes("₹") ||
      unit?.includes("transactions");

    if (isMonthly) {
      // MoM
      let mom = "--";
      if (values.length >= 2) {
        const prev = values.at(-2);
        const curr = values.at(-1);
        mom = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(2) + "%" : "--";
      }

      // Total growth
      const start = values[0];
      const end = values.at(-1);
      const totalGrowth =
        start > 0 ? (((end - start) / start) * 100).toFixed(2) + "%" : "--";

      return [
        { label: "MoM Growth", value: mom },
        { label: "Total Growth", value: totalGrowth },
        { label: "Period", value: yearsText },
      ];
    }

    // fallback for normal datasets
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