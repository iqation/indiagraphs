"use client";

import Link from "next/link";
import { TOOLS } from "../../../tools/ToolsHome";
import he from "he";

type Story = {
  title: string;
  slug: string;
  cover?: string;
};

/* -----------------------------------------
   RELATED TOOLS (Calculators)
-------------------------------------------- */
export function RelatedTools({ category }: { category: string }) {
  const calculators = TOOLS.filter((t) => t.primaryCategory === category);
  if (!calculators.length) return null;

  return (
    <>
      <h3 className="text-lg font-semibold text-indigo-900 mb-3">
        Related Tools
      </h3>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="space-y-3">
          {calculators.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.slug}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50/60 transition"
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-lg">
                {tool.emoji}
              </div>
              <span className="font-medium text-sm text-slate-800">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/* -----------------------------------------
   RELATED STORIES
-------------------------------------------- */
export function RelatedStories({ stories }: { stories: Story[] | null }) {
  if (!stories || stories.length === 0) return null;

  return (
    <>
      <h3 className="text-lg font-semibold text-indigo-900 mb-3">
        Popular Data Stories
      </h3>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <ul className="space-y-3">
          {stories.map((s) => (
            <li key={s.slug} className="flex gap-3 items-center">
              {s.cover && (
                <img
                  src={s.cover}
                  className="w-12 h-12 object-cover rounded-md border"
                  alt={s.title}
                />
              )}

              <Link
                href={`/data-stories/${s.slug}`}
                className="text-sm text-indigo-700 font-medium leading-tight hover:text-indigo-900 hover:underline"
              >
                {he.decode(s.title)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}