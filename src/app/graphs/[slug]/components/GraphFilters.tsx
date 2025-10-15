"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";

type Props = {
  allLabels: string[];
  startLabel: string;
  endLabel: string;
  setStartLabel: (v: string) => void;
  setEndLabel: (v: string) => void;
  setLatestValue: (v: number | null) => void;
  setPeriodType: (v: string) => void;
  periodType: string;
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
}: Props) {
  const [priceInput, setPriceInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceInput(value);
    setLatestValue(value ? parseFloat(value) : null);
  };

  // 🧠 Validation: Ensure end FY ≥ start FY
  // 🧠 Validation: Ensure end FY ≥ start FY
useEffect(() => {
  if (periodType !== "custom") {
    setErrorMessage(""); // clear error when not custom
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

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-2">
      {/* 🧭 Period Selection */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
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
                {allLabels.map((label) => (
                  <option key={label} value={label}>
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
                {allLabels.map((label) => (
                  <option key={label} value={label}>
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

            {/* Latest Price */}
           <input
  type="text"
  inputMode="decimal"
  pattern="^[0-9]*\\.?[0-9]*$"
  value={priceInput}
  onChange={(e) => {
    const value = e.target.value;

    // ✅ Block invalid characters (non-numeric or negative)
    if (/[^0-9.]/.test(value)) return;

    // ✅ Prevent multiple decimals
    if ((value.match(/\./g) || []).length > 1) return;

    // ✅ Update valid value
    setPriceInput(value);
    setLatestValue(value ? Math.max(parseFloat(value), 0) : null);
  }}
  onBlur={() => {
    // ✅ Clean trailing decimal on blur
    if (priceInput.endsWith(".")) {
      const fixed = priceInput.slice(0, -1);
      setPriceInput(fixed);
      setLatestValue(fixed ? parseFloat(fixed) : null);
    }
  }}
  placeholder="Latest Price (₹)"
  className={`px-5 py-2.5 rounded-full bg-white/80 border text-gray-700 text-sm font-medium w-44 text-center
              shadow-sm hover:shadow-md focus:ring-2 transition-all placeholder-gray-400
              ${
                priceInput && parseFloat(priceInput) < 0
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-indigo-300"
              }`}
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