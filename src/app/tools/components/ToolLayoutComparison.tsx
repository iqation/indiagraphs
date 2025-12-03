"use client";

import Link from "next/link";
import React, { useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
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
  // Detect embed mode
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "1";

  // Embed modal state
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build iframe code dynamically
  const embedCode = `<iframe src="${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""
    }?embed=1" width="100%" height="900" style="border:0;border-radius:12px" loading="lazy"></iframe>`;

  function copyEmbedCode() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main
      className={isEmbed ? "bg-white min-h-screen" : "bg-[#f8f9fb] min-h-screen py-10"}
    >
      {/* EMBED MODAL */}
      {showEmbed && !isEmbed && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl w-full">
            <h2 className="text-xl font-bold mb-2">Embed this calculator</h2>
            <p className="text-sm text-slate-600 mb-4">
              Copy and paste this iframe code into your website or blog.
            </p>

            <textarea
              readOnly
              value={embedCode}
              className="w-full h-32 p-3 border rounded-lg font-mono text-sm bg-slate-50"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowEmbed(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Close
              </button>

              <button
                onClick={copyEmbedCode}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  copied ? "bg-green-600" : "bg-indigo-600"
                }`}
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP SECTION (hidden in embed) */}
      {!isEmbed && (
        <div className="max-w-6xl mx-auto px-4 mb-10 flex items-start justify-between">
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-slate-600 flex gap-2">
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

            {/* Title */}
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

          {/* EMBED BUTTON */}
          {!isEmbed && (
            <button
              onClick={() => setShowEmbed(true)}
              className="px-4 py-2 rounded-lg border text-sm bg-white shadow hover:bg-slate-50"
            >
              Embed
            </button>
          )}
        </div>
      )}

      {/* ==== GRID LAYOUT ==== */}
      <div
        className={`
          max-w-6xl mx-auto px-4 
          grid gap-10
          ${
            isEmbed
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]"
          }
        `}
      >
        {/* LEFT — TOC */}
        {!isEmbed && (
          <aside className="order-2 lg:order-1 hidden lg:block">
            {toc.length > 0 && (
              <div className="mb-8 p-4 rounded-xl bg-white shadow border top-28">
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
        )}

        {/* RIGHT — Calculator & Results */}
        <section className={isEmbed ? "order-1 w-full" : "order-1 lg:order-2 w-full"}>
          <div
            className={
              isEmbed
                ? "bg-white p-6 rounded-2xl border shadow"
                : "bg-white p-6 rounded-2xl shadow-xl border mb-10"
            }
          >
            {calculator}
            {isEmbed && fullWidthResults && (
              <div className="mt-10">{fullWidthResults}</div>
            )}
          </div>

          {!isEmbed && fullWidthResults && (
            <div className="mb-12">{fullWidthResults}</div>
          )}

          {!isEmbed && <article className="prose max-w-none">{children}</article>}
        </section>
      </div>
    </main>
  );
}