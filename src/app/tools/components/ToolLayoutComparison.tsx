"use client";

import Link from "next/link";
import React, { ReactNode } from "react";
import "../../tools/tools.css";

export function ToolLayoutComparison({
  title,
  updated,
  categories = [],
  breadcrumb = [],
  toc = [],
  calculator,
  children,
  fullWidthResults,
}: {
  title: string;
  updated?: string;
  categories?: string[];
  breadcrumb?: { label: string; href?: string }[];
  toc?: { id: string; label: string }[];
  calculator: ReactNode;
  children: ReactNode;
  fullWidthResults?: ReactNode;
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

        {updated && <p className="mt-1 text-sm text-slate-500">Updated: {updated}</p>}

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

      {/* ==== GRID: LEFT = TOC, RIGHT = EVERYTHING ELSE ==== */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-10">

        {/* LEFT COLUMN — TOC only */}
        <aside className="order-2 lg:order-1 hidden lg:block  ">
          {toc.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-white shadow border  top-28">
              <h2 className="font-bold text-slate-800 mb-3 text-lg">
                Table of contents
              </h2>

              <ul className="space-y-2 list-disc pl-5 marker:text-slate-400">
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
        </aside>

        {/* RIGHT COLUMN — Calculator + Results + Article */}
        <section className="order-1 lg:order-2 w-full">

          {/* Calculator */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border mb-10  top-28">
            {calculator}
          </div>

          {/* Results */}
          {fullWidthResults && (
            <div className="mb-12">
              {fullWidthResults}
            </div>
          )}

          {/* Article */}
          <article className="prose max-w-none">
            {children}
          </article>
        </section>

      </div>
    </main>
  );
}