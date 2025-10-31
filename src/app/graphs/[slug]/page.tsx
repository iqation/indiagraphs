import { supabaseServer } from "../../lib/supabaseServer";
import GraphPage from "./GraphPage";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  // 🔍 Fetch minimal data
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
    .single();

  if (!graph) {
    return {
      title: "Graph Not Found",
      description: "The requested graph could not be found.",
      robots: { index: false },
    };
  }

  // 🧮 Extract & sort labels chronologically
  const dataPoints = Array.isArray(graph.datasets?.[0]?.data_points)
    ? graph.datasets[0].data_points
    : [];

  const labels = dataPoints.map((p) => p.period_label).filter(Boolean);

  labels.sort((a, b) => {
    const getYear = (label: string) => {
      const match = label.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    };
    return getYear(a) - getYear(b);
  });

  // 🧩 Parse start & end years (handles FY like 1985–86 → 1985 and 2024–25 → 2025)
  // 🧠 Smarter year range detector (handles "Apr 2020 – Dec 2025")
function extractYears(label: string) {
  if (!label) return { start: null, end: null };

  // Try to find both 4-digit years anywhere in the label
  const fullMatch = label.match(/(\d{4}).*?(\d{4})/);
  if (fullMatch) {
    return {
      start: parseInt(fullMatch[1]),
      end: parseInt(fullMatch[2]),
    };
  }

  // Try to find FY-style ranges like 2020–21 or 2019–2020
  const fyMatch = label.match(/(\d{4})[–-](\d{2,4})/);
  if (fyMatch) {
    const start = parseInt(fyMatch[1]);
    const endPart = parseInt(fyMatch[2]);
    let end = endPart < 100 ? start - (start % 100) + endPart : endPart;
    if (end < start) end += 100;
    return { start, end };
  }

  // Fallback: single year
  const single = label.match(/\d{4}/);
  return {
    start: single ? parseInt(single[0]) : null,
    end: single ? parseInt(single[0]) : null,
  };
}
  const firstLabel = labels[0] || "";
  const lastLabel = labels.at(-1) || "";
  const { start: startYear } = extractYears(firstLabel);
  const { end: endYear } = extractYears(lastLabel);

  const yearRange =
    startYear && endYear && startYear !== endYear
      ? `${startYear}–${endYear}`
      : startYear || endYear || "Historical Data";

  // 🧠 Source info
  const sourceText = graph.source ? ` | Source: ${graph.source}` : "";

  // ✅ Title & description (Next.js will append "| Indiagraphs" automatically)
  const title = `${graph.title} (${yearRange})${sourceText}`;
  const description = `${graph.description} Covers ${yearRange}.${sourceText}`;

  // 🖼️ OG Image
  const ogImage = `https://data.indiagraphs.com/og-images/${slug}.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://data.indiagraphs.com/graphs/${slug}`,
      siteName: "Indiagraphs",
      images: [{ url: ogImage, width: 1200, height: 630, alt: graph.title }],
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: `https://data.indiagraphs.com/graphs/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GraphPage />;
}