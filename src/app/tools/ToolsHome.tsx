// app/tools/ToolsHomeClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import IGHeader from "../components/IGHeader";
import IGFooter from "../components/IGFooter";

export type Tool = {
  slug: string;
  name: string;
  primaryCategory: string;
  categories: string[];
  emoji: string;
  description: string;
  tags: string[];
};

export const TOOLS: Tool[] = [
  {
    slug: "/tools/solar-farm-income-calculator",
    name: "Solar Farm Income Calculator",
    primaryCategory: "economy",
    categories: ["Energy", "Solar", "Investments"],
    emoji: "☀️",
    description:
      "Estimate annual solar plant revenue using CUF, tariff rate and MW/acre.",
    tags: ["solar", "income", "energy", "farm", "renewable"],
  },
  {
    slug: "/tools/real-return-savings-calculator",
    name: "Real Returns Calculator",
    primaryCategory: "small-savings",
    categories: ["Finance", "Investments", "Inflation", "Real Returns"],
    emoji: "📈",
    description:
      "Calculate inflation-adjusted real returns for PPF, SSY, FD, NSC and SCSS.",
    tags: ["real returns", "inflation", "PPF", "FD", "finance"],
  },
  {
    slug: "/tools/saving-schemes-comparison",
    name: "Savings Schemes Comparison",
    primaryCategory: "small-savings",
    categories: ["Finance", "Investments", "Inflation"],
    emoji: "💰",
    description:
      "Compare PPF vs SSY vs FD vs SCSS returns side-by-side.",
    tags: ["comparison", "savings", "returns", "PPF", "SCSS"],
  },
];

export default function ToolsHomeClient() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;

    return TOOLS.filter((tool) => {
      const haystack = (
        tool.name +
        " " +
        tool.primaryCategory +
        " " +
        tool.categories.join(" ") +
        " " +
        tool.description +
        " " +
        tool.tags.join(" ")
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const resultLabel =
    filtered.length === 1
      ? "1 calculator found"
      : `${filtered.length} calculators found`;

  return (
    <>
      <IGHeader />
      <main className="w-full bg-[#f4f6fb]">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-b border-slate-200/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold tracking-tight text-slate-900">
                  Indiagraphs Tools &amp; Calculators
                </h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
                  Smart, India-focused calculators powered by real historical datasets 
                  and transparent assumptions built for accurate decision-making.
                </p>
              </div>

              <div className="hidden sm:block lg:min-w-[320px]">
                <SearchBox query={query} setQuery={setQuery} />
              </div>
            </div>

            <div className="mt-6 sm:hidden">
              <SearchBox query={query} setQuery={setQuery} />
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-500">{resultLabel}</p>
          </div>
        </div>

        {/* Tools grid */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center text-sm text-slate-500">
              No calculators match{" "}
              <span className="font-semibold text-slate-700">“{query}”</span>.
              <br />
              Try a different keyword like{" "}
              <span className="font-medium">solar</span>,{" "}
              <span className="font-medium">income</span>, or{" "}
              <span className="font-medium">savings</span>.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}

          <div className="mt-10 text-xs sm:text-sm text-slate-500">
            More calculators are being added steadily. If there’s a calculator you
            want to see on Indiagraphs, just drop us a note.
          </div>
        </div>
      </main>
      <IGFooter />
    </>
  );
}

function SearchBox({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 pl-5 pr-10 text-sm sm:text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Search tools e.g. solar, income..."
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5">
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.slug}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2 text-xs sm:text-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-base">
          {tool.emoji}
        </span>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
          {tool.primaryCategory} {/* ⭐ UPDATED */}
        </span>
      </div>

      <h2 className="text-sm sm:text-base font-semibold leading-snug text-slate-900">
        {tool.name}
      </h2>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3">
        {tool.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="ml-2 inline-flex items-center text-[11px] sm:text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
          Open →
        </span>
      </div>
    </Link>
  );
}