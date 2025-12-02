"use client";

import React from "react";

type Option = { label: string; value: string | number };

type ToolInputProps = {
  type?:
    | "text"
    | "number"
    | "textarea"
    | "select"
    | "multi-select"
    | "radio"
    | "slider"
    | "slider-number"
    | "toggle"
    | "unit"
    | "date"
    | "currency"
    | "percent"
    | "file";

  label?: string;
  value: any;
  onChange: (value: any) => void;

  help?: string;
  options?: Option[] | string[];

  unit?: string;
  min?: number;
  max?: number;
  step?: number;

  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;

  /** NEW */
  error?: string;
};

export function ToolInput({
  type = "text",
  label,
  value,
  onChange,
  help,
  options = [],
  unit,
  min,
  max,
  step,
  placeholder,
  readOnly = false,
  disabled = false,
  error,
}: ToolInputProps) {
  return (
    <div className="tool-input-block">

      {label && <label className="tool-label">{label}</label>}
      {help && <div className="tool-help">{help}</div>}

      {/* TEXT / NUMBER */}
      {(type === "text" || type === "number") && (
        <input
          type={type}
          className={`tool-input ${error ? "tool-input-error" : ""}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          readOnly={readOnly}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
      )}

      {/* TEXTAREA */}
      {type === "textarea" && (
        <textarea
          className={`tool-input tool-textarea ${
            error ? "tool-input-error" : ""
          }`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {/* SELECT */}
      {type === "select" && (
        <select
          className={`tool-input tool-select ${error ? "tool-input-error" : ""}`}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((o: any, i: number) => (
            <option key={i} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
      )}

      {/* MULTI SELECT */}
      {type === "multi-select" && (
        <select
          multiple
          className={`tool-input tool-multiselect ${
            error ? "tool-input-error" : ""
          }`}
          value={value}
          onChange={(e) => {
            const vals = Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            );
            onChange(vals);
          }}
        >
          {options.map((o: any, i: number) => (
            <option key={i} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
      )}

      {/* RADIO GROUP */}
      {type === "radio" && (
        <div className="tool-radio-group">
          {options.map((o: any, i: number) => (
            <label key={i} className="tool-radio-item">
              <input
                type="radio"
                checked={value === o.value}
                onChange={() => onChange(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      )}

      {/* TOGGLE */}
      {type === "toggle" && (
        <label className="tool-toggle">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="tool-toggle-slider"></span>
        </label>
      )}

      {/* SLIDER */}
      {type === "slider" && (
        <>
          <input
            type="range"
            className="tool-slider"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="tool-slider-value">{value}</div>
        </>
      )}

      {/* SLIDER + NUMBER */}
      {type === "slider-number" && (
        <div className="tool-slider-row">
          <input
            type="range"
            className="tool-slider"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            type="number"
            className={`tool-input tool-input-mini ${
              error ? "tool-input-error" : ""
            }`}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* UNIT INPUT */}
      {type === "unit" && (
        <div className="tool-unit-container">
          <input
            type="number"
            className={`tool-input ${error ? "tool-input-error" : ""}`}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="tool-unit">{unit}</span>
        </div>
      )}

      {/* DATE */}
      {type === "date" && (
        <input
          type="date"
          className={`tool-input ${error ? "tool-input-error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {/* CURRENCY */}
      {type === "currency" && (
        <div className="tool-unit-container">
          <span className="tool-unit">₹</span>
          <input
            type="number"
            className={`tool-input ${error ? "tool-input-error" : ""}`}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* PERCENT */}
      {type === "percent" && (
        <div className="tool-unit-container">
          <input
            type="number"
            className={`tool-input ${error ? "tool-input-error" : ""}`}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="tool-unit">%</span>
        </div>
      )}

      {/* FILE */}
      {type === "file" && (
        <input
          type="file"
          className="tool-input"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      )}

      {/* ERROR MESSAGE (all types) */}
      {error && <div className="tool-input-error-message">{error}</div>}
    </div>
  );
}