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
    category && category.toLowerCase() !== "uncategorized" && category.trim() !== "";

  return (
    <nav
      className="text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-5"
      aria-label="Breadcrumb"
    >
      {/* 🏠 Home - Main domain */}
      <Link href="https://indiagraphs.com" className="hover:text-indigo-600 transition">
        Home
      </Link>
      <ChevronRight size={14} className="text-gray-400" />

    

      {/* 🗂️ Category */}
      {hasValidCategory && (
        <>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="capitalize text-gray-500">{category}</span>
        </>
      )}

      {/* 📈 Graph Title */}
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