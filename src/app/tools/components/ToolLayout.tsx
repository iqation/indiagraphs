// src/app/tools/components/ToolLayout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "../../tools/tools.css";

export function ToolLayout({
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
  calculator: React.ReactNode;
  children: React.ReactNode;
  fullWidthResults?: React.ReactNode;
}) {
  // ⭐ Detect embed mode
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "1";

  // ⭐ Embed modal state
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build iframe embed code dynamically
  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href.split("?")[0]
      : "";
  const embedCode = `<iframe src="${pageUrl}?embed=1" width="100%" height="700" style="border:0;border-radius:12px" loading="lazy"></iframe>`;

  return (
    <main
      className={
        isEmbed ? "bg-white min-h-screen" : "bg-[#f8f9fb] min-h-screen py-10"
      }
    >
      {/* BREADCRUMB — HIDE IN EMBED */}
      {!isEmbed && (
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
      )}

      {/* PAGE HEADER + EMBED BUTTON — HIDE IN EMBED */}
      {!isEmbed && (
        <div className="max-w-6xl mx-auto px-4 mb-10 flex items-start justify-between">
          <div>
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

          {/* ⭐ EMBED BUTTON */}
          <button
            onClick={() => setShowEmbed(true)}
            className="px-3 py-1.5 text-sm bg-white border rounded-lg shadow hover:bg-slate-50"
          >
            Embed
          </button>
        </div>
      )}

      {/* GRID LAYOUT – FULL WIDTH IN EMBED */}
      <div
        className={`
          max-w-6xl mx-auto px-4 
          grid 
          ${isEmbed ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px]"} 
          gap-10
        `}
      >
        {/* LEFT SIDE — TEXT CONTENT (HIDDEN IN EMBED) */}
        {!isEmbed && (
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
        )}

        {/* RIGHT SIDE — CALCULATOR (FULL WIDTH IN EMBED) */}
        <aside className={isEmbed ? "w-full order-1" : "order-1 lg:order-2"}>
          <div className={isEmbed ? "" : "sticky top-30"}>
            <div className="bg-white p-6 rounded-2xl shadow-xl border">
              {/* Calculator */}
              {calculator}

              {/* Results inside card in embed mode */}
              {isEmbed && fullWidthResults && (
                <div className="mt-8">{fullWidthResults}</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* FULL WIDTH RESULTS (normal mode only) */}
      {!isEmbed && fullWidthResults && (
        <div className="max-w-6xl mx-auto px-4 mt-16">
          {fullWidthResults}
        </div>
      )}

      {/* ⭐ EMBED MODAL (only on normal page, not inside iframe) */}
      {showEmbed && !isEmbed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-3">Embed this calculator</h2>

            <p className="text-sm text-slate-600 mb-2">
              Copy and paste this iframe code into your website or blog.
            </p>

            <textarea
              className="w-full p-3 border rounded-lg font-mono text-xs bg-slate-50"
              rows={4}
              readOnly
              value={embedCode}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowEmbed(false)}
                className="px-4 py-2 rounded-lg bg-slate-200"
              >
                Close
              </button>

<button
  onClick={() => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }}
  className={`
    px-4 py-2 rounded-lg text-white transition-all
    ${copied ? "bg-green-600" : "bg-indigo-600"}
  `}
>
  {copied ? "Copied!" : "Copy Code"}
</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}