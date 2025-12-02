// src/app/tools/utils/validation.ts

export type NumberRule = {
  label: string;        // for messages – "Land area", "Tariff rate", etc.
  value: string;        // raw string from input
  required?: boolean;   // default true
  min?: number;         // default 0
  max?: number;         // default Infinity
};

export function validateNumberField(rule: NumberRule): string {
  const {
    label,
    value,
    required = true,
    min = 0,
    max = Infinity,
  } = rule;

  if (required && (!value || value.trim() === "")) {
    return `${label} is required`;
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return `${label} must be a valid number`;
  }

  if (num < min) {
    return `${label} must be at least ${min}`;
  }

  if (num > max) {
    return `${label} must be less than or equal to ${max}`;
  }

  return ""; // no error
}