"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";

type Props = {
  allLabels: string[];
  startLabel: string;
  endLabel: string;
  setStartLabel: (v: string) => void;
  setEndLabel: (v: string) => void;
  setLatestValue: (v: number | null) => void;
  setPeriodType: (v: string) => void;
  periodType: string;
  unit?: string;
  metricBehavior?: string; // ✅ NEW — passed from dataset
  allowLatestValue?: boolean; // ✅ Add this
};

export default function GraphFilters({
  allLabels,
  startLabel,
  endLabel,
  setStartLabel,
  setEndLabel,
  setLatestValue,
  setPeriodType,
  periodType,
  unit,
  metricBehavior,
}: Props) {
  const [priceInput, setPriceInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🧠 Validation: Ensure end FY ≥ start FY
  useEffect(() => {
    if (periodType !== "custom") {
      setErrorMessage("");
      return;
    }

    if (startLabel && endLabel) {
      const startIndex = allLabels.indexOf(startLabel);
      const endIndex = allLabels.indexOf(endLabel);

      if (endIndex < startIndex) {
        setErrorMessage("End year cannot be earlier than start year.");
      } else {
        setErrorMessage("");
      }
    } else {
      setErrorMessage("");
    }
  }, [startLabel, endLabel, allLabels, periodType]);

  // 📌 Smart placeholder logic
  const isGrowthType =
    metricBehavior === "growth" ||
    metricBehavior === "value" ||
    metricBehavior === "price";
  const placeholder = isGrowthType
    ? `Enter latest price ${unit ? `(${unit})` : ""}`
    : `Enter latest value ${unit ? `(${unit})` : ""}`;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-2">
      {/* 🧭 Period Selection */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        {/* Period Type Selector */}
        <div className="relative">
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 rounded-full bg-white/80
                       border border-gray-200 text-gray-700 text-sm font-medium
                       shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-300 
                       focus:border-indigo-300 transition-all cursor-pointer"
          >
            <option value="5">5 Years</option>
            <option value="10">10 Years</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Show Custom Inputs only for "Custom" */}
        {periodType === "custom" && (
          <>
            {/* Start FY */}
            <div className="relative">
              <select
                value={startLabel}
                onChange={(e) => setStartLabel(e.target.value)}
                className="appearance-none px-5 py-2.5 pr-10 rounded-full bg-white/80 
                           border border-gray-200 text-gray-700 text-sm font-medium
                           shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-300 
                           transition-all cursor-pointer"
              >
                <option value="">Start FY</option>
                {[...new Set(allLabels)]
                  .filter((label) => label && label.trim() !== "")
                  .sort()
                  .map((label, index) => (
                    <option key={`${label}-${index}`} value={label}>
                      {label}
                    </option>
                  ))}
              </select>
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400"
              />
            </div>

            {/* End FY */}
            <div className="relative">
              <select
                value={endLabel}
                onChange={(e) => setEndLabel(e.target.value)}
                className={`appearance-none px-5 py-2.5 pr-10 rounded-full bg-white/80 
                           border text-gray-700 text-sm font-medium
                           shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-300 
                           transition-all cursor-pointer ${
                             errorMessage
                               ? "border-red-400 focus:ring-red-300"
                               : "border-gray-200"
                           }`}
              >
                <option value="">End FY</option>
                {[...new Set(allLabels)]
                  .filter((label) => label && label.trim() !== "")
                  .sort()
                  .map((label, index) => (
                    <option key={`${label}-${index}`} value={label}>
                      {label}
                    </option>
                  ))}
              </select>
              <ArrowRight
                size={16}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  errorMessage ? "text-red-400" : "text-indigo-400"
                }`}
              />
            </div>

            {/* ✅ Unified Latest Input */}
            <input
              id="latest-value"
              type="text"
              inputMode="decimal"
              pattern="^[0-9]*\\.?[0-9]*$"
              value={priceInput}
              onChange={(e) => {
                const value = e.target.value;

                if (/[^0-9.]/.test(value)) return;
                if ((value.match(/\./g) || []).length > 1) return;

                setPriceInput(value);
                setLatestValue(value ? Math.max(parseFloat(value), 0) : null);
              }}
              onBlur={() => {
                if (priceInput.endsWith(".")) {
                  const fixed = priceInput.slice(0, -1);
                  setPriceInput(fixed);
                  setLatestValue(fixed ? parseFloat(fixed) : null);
                }
              }}
              placeholder={placeholder}
              className="px-5 py-2.5 rounded-full bg-white/80 border text-gray-700 text-sm font-medium w-48 text-center
                         shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 
                         transition-all placeholder-gray-400 border-gray-200"
            />
          </>
        )}
      </div>

      {/* ⚠️ Validation Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">
          {errorMessage}
        </p>
      )}
    </div>
  );
}