"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import IGHeader from "./components/IGHeader";
import IGFooter from "./components/IGFooter";

export default function GraphsHome() {
  const [graphs, setGraphs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // 🚀 Fetch graphs
  useEffect(() => {
    async function fetchGraphs() {
      try {
        const res = await fetch("/api/graphs", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch graphs");
        const data = await res.json();
        setGraphs(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error("Error fetching graphs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGraphs();
  }, []);

  // 🔍 Handle search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(graphs);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        graphs.filter(
          (g) =>
            g.title.toLowerCase().includes(lower) ||
            g.category?.toLowerCase().includes(lower) ||
            g.source?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, graphs]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-700 font-semibold">
        Loading graphs...
      </div>
    );

  const displayedGraphs = filtered.slice(0, visibleCount);

  return (
    <>
      <IGHeader />

      <main className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#eef3ff] pb-16 relative overflow-hidden">
        {/* 🩶 Subtle background grid */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

     {/* 🏛️ Hero / Header Section */}
<section className="relative text-center pt-10 sm:pt-14 pb-4 sm:pb-8 px-4">
  {/* 💎 Trust Badges */}
  <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
    <span className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold 
                    bg-white/40 backdrop-blur-md border border-white/60 
                    text-indigo-800 shadow-[0_0_8px_rgba(79,70,229,0.2)]">
      Verified Public Data
    </span>
    <span className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold 
                    bg-gradient-to-r from-amber-50/40 to-amber-100/30 
                    backdrop-blur-md border border-amber-200/60 
                    text-amber-700 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
      Updated till 2025
    </span>
    <span className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold 
                    bg-gradient-to-r from-emerald-50/40 to-teal-100/30 
                    backdrop-blur-md border border-emerald-200/60 
                    text-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
      Trusted Indian Sources
    </span>
  </div>

  {/* Heading */}
  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17153B] tracking-tight mb-2">
    Welcome to India’s Data Library
  </h1>

  <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
    Explore verified data visualizations and interactive insights from India’s
    economy, markets, and society - all built from trusted sources.
  </p>

  {/* 🔍 Search */}
  <div className="flex justify-center mt-5 sm:mt-6 px-3 sm:px-0">
    <div className="relative w-full max-w-[360px] sm:max-w-lg">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search datasets (e.g., GDP, Gold, Inflation)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white/70 
                   shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 
                   placeholder-gray-400 text-gray-700 text-sm sm:text-base transition-all 
                   backdrop-blur-md"
      />
    </div>
  </div>

  {/* ✨ Thin divider (closer to cards) */}
  <div className="mt-5 sm:mt-6 mx-auto w-10/12 h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent"></div>
</section>

        {/* 📈 Graphs Grid */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-8 sm:mt-10">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No graphs found for your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedGraphs.map((graph) => (
                <Link
                  key={graph.slug}
                  href={`/graphs/${graph.slug}`}
                  className="group bg-white/60 border border-gray-100/60 backdrop-blur-lg 
                             rounded-2xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.05)] 
                             hover:shadow-[0_4px_24px_rgba(79,70,229,0.18)] hover:scale-[1.015]
                             transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[#17153B] 
                                   group-hover:text-indigo-600 line-clamp-2">
                      {graph.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {graph.description || "View detailed data visualization →"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {graph.category && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-3 py-1 rounded-full">
                        {graph.category}
                      </span>
                    )}
                    {graph.source && (
                      <span className="text-xs bg-amber-50 text-amber-700 font-medium px-3 py-1 rounded-full">
                        {graph.source}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 🧭 Load More */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 
                           text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] 
                           transition-all"
              >
                Load More Graphs
              </button>
            </div>
          )}
        </section>
      </main>

      <IGFooter />
    </>
  );
}