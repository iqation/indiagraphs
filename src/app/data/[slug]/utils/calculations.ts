// src/app/graphs/[slug]/utils/calculations.ts

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Calculate total return percentage
 */
export function calculateTotalReturn(startValue: number, endValue: number): number {
  if (startValue <= 0) return 0;
  return ((endValue - startValue) / startValue) * 100;
}

/**
 * Filter data points between selected years
 */
export function filterDataByYears(
  data: { period_label: string; value: number }[],
  startYear: string,
  endYear: string
) {
  const startIndex = data.findIndex((d) => d.period_label === startYear);
  const endIndex = data.findIndex((d) => d.period_label === endYear);
  if (startIndex < 0 || endIndex < 0) return data;
  return data.slice(startIndex, endIndex + 1);
}