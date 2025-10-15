"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabaseClient";
import { Search } from "lucide-react";
import IGHeader from "./components/IGHeader";
import IGFooter from "./components/IGFooter";

export default function GraphsHome() {
  const [graphs, setGraphs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Fetch graphs
  useEffect(() => {
    async function fetchGraphs() {
      try {
        const { data, error } = await supabase
          .from("graphs")
          .select("title, slug, category, description, source")
          .order("created_at", { ascending: false });

        if (error) throw error;
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

  return (
    <>
      <IGHeader />
      <main className="min-h-screen bg-gradient-to-br from-[#fdfdfe] to-[#f5f7ff] pb-16">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17153B]">
              Explore Interactive Graphs
            </h1>
            <p className="mt-3 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Discover visual stories from India’s economy, markets, and society —
              powered by trusted public data sources.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search graphs (e.g., gold, GDP, inflation)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white/90
                           shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300
                           placeholder-gray-400 text-gray-700 text-sm sm:text-base transition-all"
              />
            </div>
          </div>

          {/* Graphs Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No graphs found for your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((graph) => (
                <Link
                  key={graph.slug}
                  href={`/graphs/${graph.slug}`}
                  className="group bg-white/70 border border-white/60 backdrop-blur-md rounded-2xl p-6 
                             shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                             flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#17153B] group-hover:text-indigo-600 line-clamp-2">
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
        </section>
      </main>
      <IGFooter />
    </>
  );
}