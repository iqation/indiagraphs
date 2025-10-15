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
  // Only show category if we have a valid one AND category pages exist
  const hasValidCategory =
    category && category.toLowerCase() !== "uncategorized" && category.trim() !== "";

  return (
    <nav
      className="text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-5"
      aria-label="Breadcrumb"
    >
      {/* 🏠 Home */}
      <Link href="/" className="hover:text-indigo-600 transition">
        Home
      </Link>
      <ChevronRight size={14} className="text-gray-400" />

      {/* 📊 Graphs main page */}
      <Link href="/graphs" className="hover:text-indigo-600 transition">
        Graphs
      </Link>

      {/* 🗂️ Category — show only if category pages exist */}
      {hasValidCategory && (
        <>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="capitalize text-gray-500">{category}</span>
        </>
      )}

      {/* 📈 Current page title */}
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