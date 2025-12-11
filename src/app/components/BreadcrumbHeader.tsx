"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BreadcrumbHeader({
  category,
  title,
}: {
  category?: string | null;
  title?: string;
}) {
  const hasValidCategory =
    category &&
    category.toLowerCase() !== "uncategorized" &&
    category.trim() !== "";

  // Format category name nicely → "small-savings" → "Small Savings"
  const formattedCategory = hasValidCategory
    ? category
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <nav
      className="text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-5"
      aria-label="Breadcrumb"
    >
      {/* 🏠 Home */}
      <Link
        href="https://indiagraphs.com"
        className="hover:text-indigo-600 transition"
      >
        Home
      </Link>

      {/* 👉 Category */}
      {formattedCategory && (
        <>
          <ChevronRight size={14} className="text-gray-400" />

          <Link
            href={`/category/${category}`}
            className="hover:text-indigo-600 transition capitalize"
          >
            {formattedCategory}
          </Link>
        </>
      )}

      {/* 👉 Title */}
      {title && (
        <>
          <ChevronRight size={14} className="text-gray-400" />

          <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {title}
          </span>
        </>
      )}
    </nav>
  );
}