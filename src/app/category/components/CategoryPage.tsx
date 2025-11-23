"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORY_META } from "./CategoryMeta";
import IGHeader from "../../components/IGHeader";
import IGFooter from "@/app/components/IGFooter";
import { ChevronRight } from "lucide-react";
import Head from "next/head";

export default function CategoryPage({ slug }: { slug: string }) {
  const meta = CATEGORY_META[slug as keyof typeof CATEGORY_META];

  const [graphs, setGraphs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGraphs() {
      try {
        const res = await fetch("/api/graphs", { cache: "no-store" });
        const data = await res.json();

        const filtered = data.filter(
          (g: any) => g.category?.toLowerCase() === slug.toLowerCase()
        );

        setGraphs(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchGraphs();
  }, [slug]);

  if (!meta)
    return (
      <>
        <IGHeader />
        <main className="p-10 text-center text-gray-600">Category Not Found</main>
        <IGFooter />
      </>
    );

  const Icon = meta.icon;

  // ⭐ SAFE FALLBACK SEO FIELDS
  const seoTitle = meta.seoTitle || `${meta.title} Data – Indiagraphs`;
  const seoDescription = meta.seoDescription || meta.description;

  return (
    <>
      {/* ✅ Dynamic SEO Metadata */}
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Head>

      <IGHeader />

      <main className="min-h-screen bg-gradient-to-br from-[#fafbff] to-[#eef3ff] pb-24 overflow-x-hidden">

        {/* 🌐 Hero Section */}
        <section className="relative w-full py-14 bg-gradient-to-r from-indigo-50 via-white to-sky-50">
          <div className="relative max-w-6xl mx-auto px-6">
            
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500 gap-2 mb-4">
              <Link href="/" className="hover:text-indigo-600">Home</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">{meta.title}</span>
            </nav>

            {/* Header / Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow">
                <Icon size={36} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-[#17153B] tracking-tight">
                  {meta.title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 mt-2 max-w-xl text-lg leading-relaxed">
                  {meta.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔍 Stats Summary */}
        <section className="max-w-6xl mx-auto px-6 mt-8">
          <div className="grid sm:grid-cols-3 gap-4">
            
            <div className="bg-white/70 border border-gray-100 backdrop-blur-xl p-4 rounded-xl shadow-sm">
              <p className="text-gray-500 text-sm">Datasets Available</p>
              <h3 className="text-2xl font-bold text-indigo-600">{graphs.length}</h3>
            </div>
            
            <div className="bg-white/70 border border-gray-100 backdrop-blur-xl p-4 rounded-xl shadow-sm">
              <p className="text-gray-500 text-sm">Latest Update</p>
              <h3 className="text-lg font-semibold text-gray-700">Auto-Refreshed</h3>
            </div>
            
            <div className="bg-white/70 border border-gray-100 backdrop-blur-xl p-4 rounded-xl shadow-sm">
              <p className="text-gray-500 text-sm">Sources</p>
              <h3 className="text-lg font-semibold text-gray-700">RBI • MOSPI • Govt</h3>
            </div>

          </div>
        </section>

        {/* 📊 Dataset Cards */}
        <section className="max-w-6xl mx-auto px-6 mt-14">
          <h2 className="text-2xl font-bold text-[#17153B] mb-6">
            Explore Datasets
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : graphs.length === 0 ? (
            <p>No datasets found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {graphs.map((g) => (
                <Link
                  key={g.slug}
                  href={`/data/${g.slug}`}
                  className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 shadow-[0_4px_14px_rgba(0,0,0,0.08)] 
                             hover:shadow-[0_6px_20px_rgba(79,70,229,0.25)] hover:scale-[1.015] transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{g.title}</h3>

                  <p className="mt-2 text-gray-600 line-clamp-3 text-sm">
                    {g.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {g.category && (
                      <span className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full">
                        {g.category}
                      </span>
                    )}
                    {g.source && (
                      <span className="px-3 py-1 text-xs bg-amber-50 text-amber-700 rounded-full">
                        {g.source}
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