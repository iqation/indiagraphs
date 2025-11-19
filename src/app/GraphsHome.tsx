"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  BarChart2,
  RefreshCcw,
  Layers,
  Database,
  LineChart,
  CreditCard,
  Users,
  Wallet,
  BriefcaseBusinessIcon,
  PiggyBank,
  CoinsIcon,
} from "lucide-react";

import { Clock, Building, Zap, CalendarClock } from "lucide-react";
import IGHeader from "./components/IGHeader";
import IGFooter from "./components/IGFooter";

export default function GraphsHome() {
  const [graphs, setGraphs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [visibleCount, setVisibleCount] = useState(12);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const ALL_CATEGORIES = [
    {
      icon: <LineChart className="text-indigo-700" size={24} />,
      title: "Economy & Macro",
      desc: "GDP, inflation, fiscal deficit, repo rate.",
      link: "/category/economy",
      gradient: "from-indigo-50 via-purple-50 to-white",
    },
    {
      icon: <CreditCard className="text-blue-600" size={24} />,
      title: "Banking & Credit",
      desc: "NPAs, loan growth, deposits, credit.",
      link: "/category/banking",
      gradient: "from-blue-50 via-sky-50 to-white",
    },
    {
      icon: <Wallet className="text-purple-600" size={24} />,
      title: "Digital Payments",
      desc: "UPI, wallets, mobile & net banking.",
      link: "/category/digital-payments",
      gradient: "from-purple-50 via-fuchsia-50 to-white",
    },
    {
      icon: <Database className="text-amber-600" size={24} />,
      title: "Commodities",
      desc: "Gold, silver, crude oil, agri.",
      link: "/category/commodities",
      gradient: "from-amber-50 via-yellow-50 to-white",
    },
    {
      icon: <BriefcaseBusinessIcon className="text-amber-700" size={24} />,
      title: "Trade & Exports",
      desc: "Imports, exports, trade balance.",
      link: "/category/trade",
      gradient: "from-emerald-50 via-teal-50 to-white",
    },
    {
      icon: <PiggyBank className="text-green-600" size={24} />,
      title: "Small Savings",
      desc: "Govt savings schemes & rates.",
      link: "/category/small-savings",
      gradient: "from-green-50 via-lime-50 to-white",
    },
    {
      icon: <CoinsIcon className="text-yellow-600" size={24} />,
      title: "Foreign Exchange",
      desc: "FX rates, forex reserves, USD/INR.",
      link: "/category/forex",
      gradient: "from-yellow-50 via-orange-50 to-white",
    },
    {
      icon: <Users className="text-gray-700" size={24} />,
      title: "Social & Demographics",
      desc: "Population, literacy, health.",
      comingSoon: true,
      link: "#",
      gradient: "from-slate-50 via-gray-50 to-white",
    },
  ];

  const VISIBLE_CATEGORIES = showAllCategories
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.slice(0, 6);

  useEffect(() => {
    async function fetchGraphs() {
      try {
        const res = await fetch("/api/graphs", { cache: "no-store" });
        const data = await res.json();
        setGraphs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGraphs();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const q = search.toLowerCase();

    const results = graphs.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q) ||
        g.source?.toLowerCase().includes(q)
    );

    setSearchResults(results.slice(0, 8));
  }, [search, graphs]);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("click", outside);
    return () => document.removeEventListener("click", outside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-700 font-bold">
        Loading graphs...
      </div>
    );
  }

  const displayedGraphs = graphs.slice(0, visibleCount);

  return (
    <>
      <IGHeader />

      {/* HERO ----------------------------------------------------- */}
      <section className="bg-gradient-to-br from-white via-[#f7f5ff] to-[#eef4ff] pt-20 pb-14 border-b relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-200/50 via-purple-200/40 to-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-4rem] left-[-3rem] h-48 w-48 rounded-full bg-gradient-to-tr from-amber-200/40 via-pink-200/40 to-indigo-200/30 blur-3xl" />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 shadow-sm border border-indigo-50 text-xs font-semibold text-indigo-700 mb-4 mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live graphs from India’s trusted public data
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0C1B4D] tracking-tight leading-snug">
            Unlock India’s Data with Precision & Clarity
          </h1>

          <p className="text-slate-700 font-medium max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
            From macro indicators like GDP & inflation to granular views on
            payments, trade, and savings - explore ready to use graphs powered
            by verified Indian sources.
          </p>

          {/* SEARCH ------------------------------------------------ */}
          <div
            className="relative max-w-xl mx-auto mt-7"
            ref={dropdownRef}
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search graphs (e.g., UPI, GDP, CPI inflation, exports)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/90 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 shadow-sm
                             focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm sm:text-base font-medium text-slate-800"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto z-[200]">
                {searchResults.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/graphs/${g.slug}`}
                    className="block px-4 py-3 hover:bg-gray-50 transition"
                    onClick={() => setSearchResults([])}
                  >
                    <p className="font-semibold text-slate-800 text-sm">
                      {g.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {g.category || "Uncategorized"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* BADGES */}
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap mt-5 text-xs sm:text-sm">
            <span className="flex items-center gap-2 px-3 py-1.5 border rounded-full bg-white/60 font-semibold text-slate-700">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              Verified public data
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 border rounded-full bg-white/60 font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-gray-600" />
              Updated to 2025
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 border rounded-full bg-white/60 font-semibold text-slate-700">
              <Building className="w-3.5 h-3.5 text-gray-600" />
              RBI, MOSPI, Govt sources
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 border rounded-full bg-white/60 font-semibold text-slate-700">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              API-ready structure
            </span>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
            <button
              onClick={() =>
                document
                  .getElementById("all-graphs")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="relative inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-white
                         bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
                         shadow-lg shadow-indigo-500/30
                         transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl
                         overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                Explore All Datasets
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                  {graphs.length}+ graphs
                </span>
              </span>
            </button>

            <button
              disabled
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 
                         bg-white/80 text-gray-500 cursor-not-allowed text-sm font-semibold
                         shadow-sm gap-2"
            >
              🔒 Get API Access
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* WHY STRIP ------------------------------------------------ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                Why Indiagraphs
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 tracking-tight">
                Built for analysts, founders, and policy nerds.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-indigo-50 p-1.5">
                  <Layers size={14} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Curated & clean</p>
                  <p className="text-slate-600 text-xs font-medium">
                    Ready-to-use graphs, not raw dumps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-amber-50 p-1.5">
                  <RefreshCcw size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Always fresh</p>
                  <p className="text-slate-600 text-xs font-medium">
                    Updated from official Indian sources.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-teal-50 p-1.5">
                  <Database size={14} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">API-ready</p>
                  <p className="text-slate-600 text-xs font-medium">
                    Structured for models, dashboards & apps.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES ---------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-4" id="categories">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Explore key data categories
          </h2>
          <span className="hidden sm:inline-flex text-xs text-slate-600 font-semibold">
            Click a category to see focused datasets
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VISIBLE_CATEGORIES.map((cat, i) => (
            <CategoryTile key={i} {...cat} />
          ))}
        </div>

        {ALL_CATEGORIES.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-5 py-2.5 rounded-full border border-indigo-200 bg-indigo-50/60 text-indigo-700 text-sm font-bold
                         hover:bg-indigo-100 transition"
            >
              {showAllCategories ? "Show fewer categories" : "View all categories"}
            </button>
          </div>
        )}
      </section>

      {/* ALL GRAPHS ----------------------------------------------- */}
      <section
        id="all-graphs"
        className="max-w-6xl mx-auto px-6 pt-12 pb-16"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">All graphs</h2>
          <p className="text-xs text-slate-600 font-semibold">
            Showing {displayedGraphs.length} of {graphs.length} graphs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGraphs.map((graph) => (
            <Link
              key={graph.slug}
              href={`/graphs/${graph.slug}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                {graph.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 line-clamp-2 font-medium leading-relaxed">
                {graph.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {graph.category && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[11px] rounded-full font-semibold">
                    {graph.category}
                  </span>
                )}
                {graph.source && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[11px] rounded-full font-semibold">
                    {graph.source}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {visibleCount < graphs.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold shadow hover:scale-105 transition"
            >
              Load more graphs
            </button>
          </div>
        )}
      </section>

      {/* CTA ------------------------------------------------------ */}
      <section className="bg-gray-50 py-12 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Ready to use India’s data in your work?
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto font-medium leading-relaxed">
            Whether you are running a desk, a fund, a startup, or a research
            project - Indiagraphs helps you plug into India’s data with less
            friction.
          </p>

          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button
              disabled
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold 
                         flex items-center gap-2 opacity-70 cursor-not-allowed shadow-sm"
            >
              Explore Pricing & API Access
              <span className="text-xs bg-white/90 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200 font-semibold">
                Coming Soon
              </span>
            </button>

            <Link
              href="https://indiagraphs.com/contact/"
              className="px-6 py-3 border text-slate-700 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact sales for enterprise solutions
            </Link>
          </div>
        </div>
      </section>

      <IGFooter />
    </>
  );
}

/* --------------------------------------------------------
   COMPONENTS
-------------------------------------------------------- */

function CategoryTile({
  icon,
  title,
  desc,
  link,
  comingSoon,
  gradient,
}: any) {
  return (
    <Link
      href={comingSoon ? "#" : link}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br
                 shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                 hover:shadow-[0_16px_40px_rgba(79,70,229,0.15)]
                 transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative p-5 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
            {title}
          </h3>
        </div>

        <p className="text-slate-700 text-xs sm:text-sm flex-1 font-medium leading-relaxed">
          {desc}
        </p>

        <p className="mt-4 text-xs font-bold text-indigo-700 group-hover:underline flex items-center gap-1 tracking-tight">
          {comingSoon ? "Coming soon" : "View datasets"}
          {!comingSoon && <span aria-hidden>→</span>}
        </p>
      </div>
    </Link>
  );
}