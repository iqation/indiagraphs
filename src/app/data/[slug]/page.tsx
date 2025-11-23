import { supabaseServer } from "../../lib/supabaseServer";
import DataPage from "./DataPage";

export async function generateMetadata({ params }: { params: any }) {
  const { slug } = (await params) as { slug: string };

  // Fetch minimal SEO-required fields
  const { data: graph } = await supabaseServer
    .from("graphs")
    .select(`
      title,
      description,
      source,
      category,
      datasets (
        data_points (period_label)
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (!graph) {
    return {
      title: "Data Not Found",
      description: "The requested dataset does not exist.",
      robots: { index: false },
    };
  }

  // ──────────────────────────────────────────────
  // Extract year range
  // ──────────────────────────────────────────────
  const points = Array.isArray(graph.datasets?.[0]?.data_points)
    ? graph.datasets[0].data_points
    : [];

  let labels = points.map((p) => p.period_label).filter(Boolean);

  labels.sort((a, b) => {
    const extractYear = (label: string) => {
      const m = label.match(/\d{4}/);
      return m ? parseInt(m[0]) : 0;
    };
    return extractYear(a) - extractYear(b);
  });

  function extractYears(label: string) {
    if (!label) return { start: null, end: null };

    const range = label.match(/(\d{4}).*?(\d{4})/);
    if (range) {
      return { start: parseInt(range[1]), end: parseInt(range[2]) };
    }

    const fy = label.match(/(\d{4})[–-](\d{2,4})/);
    if (fy) {
      const start = parseInt(fy[1]);
      const endPart = parseInt(fy[2]);
      let end = endPart < 100 ? start - (start % 100) + endPart : endPart;
      if (end < start) end += 100;
      return { start, end };
    }

    const single = label.match(/\d{4}/);
    return single
      ? { start: parseInt(single[0]), end: parseInt(single[0]) }
      : { start: null, end: null };
  }

  const { start: startYear } = extractYears(labels[0] || "");
  const { end: endYear } = extractYears(labels.at(-1) || "");

  const yearRange =
    startYear && endYear && startYear !== endYear
      ? `${startYear}–${endYear}`
      : startYear || endYear || "";

  const sourceText = graph.source ? ` | Source: ${graph.source}` : "";

  const title = `${graph.title}${yearRange ? ` (${yearRange})` : ""}${sourceText}`;
  const description = `${graph.description || ""} ${yearRange ? `Covers ${yearRange}.` : ""} ${sourceText}`;

  const ogImage = `https://data.indiagraphs.com/og-images/${slug}.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://indiagraphs.com/data/${slug}`,
      siteName: "Indiagraphs",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: `https://indiagraphs.com/data/${slug}` },
  };
}

export default async function Page({ params }: { params: any }) {
  const { slug } = (await params) as { slug: string };
  return <DataPage slug={slug} />;
}