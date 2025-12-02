// src/app/tools/components/ToolLayout.tsx
"use client";

import React from "react";
import Link from "next/link";
import "../../tools/tools.css";

export function ToolLayout({
  title,
  updated,
  categories = [],
  breadcrumb = [],
  toc = [],
  calculator,
  children,          // left text content
  fullWidthResults,  // NEW — full-width results & charts
}: {
  title: string;
  updated?: string;
  categories?: string[];
  breadcrumb?: { label: string; href?: string }[];
  toc?: { id: string; label: string }[];
  calculator: React.ReactNode;
  children: React.ReactNode;
  fullWidthResults?: React.ReactNode;
}) {
  return (
    <main className="bg-[#f8f9fb] min-h-screen py-10">
      
      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-4 mb-6 text-sm text-slate-600 flex gap-2">
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {b.href ? (
              <Link href={b.href} className="hover:underline text-indigo-600">
                {b.label}
              </Link>
            ) : (
              <span>{b.label}</span>
            )}
            {i < breadcrumb.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {title}
        </h1>

        {updated && (
          <p className="mt-1 text-sm text-slate-500">Updated: {updated}</p>
        )}

        <div className="flex gap-2 flex-wrap mt-3">
          {categories.map((c) => (
            <span
              key={c}
              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* GRID LAYOUT – LEFT CONTENT + RIGHT CALCULATOR */}
      <div
        className="
          max-w-6xl mx-auto px-4 
          grid grid-cols-1 
          lg:grid-cols-[minmax(0,1fr)_400px] 
          gap-10
        "
      >

        {/* LEFT SIDE — TEXT CONTENT */}
        <div className="order-2 lg:order-1 prose max-w-none">
          
          {/* TABLE OF CONTENTS */}
          {toc.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-white shadow border">
              <h2 className="font-bold text-slate-800 mb-3 text-lg">
                Table of contents
              </h2>
              <ul className="space-y-2">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actual content */}
          {children}
        </div>

        {/* RIGHT SIDE — CALCULATOR */}
        <aside className="order-1 lg:order-2">
          <div className="sticky top-30">
            <div className="bg-white p-6 rounded-2xl shadow-xl border">
              {calculator}
            </div>
          </div>
        </aside>

      </div>

      {/* FULL WIDTH RESULTS (optional new block) */}
      {fullWidthResults && (
        <div className="max-w-6xl mx-auto px-4 mt-16">
          {fullWidthResults}
        </div>
      )}
    </main>
  );
}