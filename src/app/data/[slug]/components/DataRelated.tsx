"use client";

type RelatedGraphsProps = {
  related?: { title: string; slug: string }[];
};

import Link from "next/link";

export default function RelatedGraphs({ related }: RelatedGraphsProps) {
  if (!related || related.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-indigo-900 mb-3">Related Graphs</h3>
      <div className="flex flex-wrap gap-3">
        {related.map((g) => (
          <Link
            key={g.slug}
            href={`/data/${g.slug}`}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-100 text-sm font-medium transition"
          >
            {g.title}
          </Link>
        ))}
      </div>
    </div>
  );
}