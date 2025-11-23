// src/app/data/page.tsx
import type { Metadata } from "next";
import { supabaseServer } from "./lib/supabaseServer";
import DataHome from "./DataHome";

export const metadata: Metadata = {
  title: "India's Data Stories, Interactive Graphs & Insights | Indiagraphs",
  description:
    "Explore India's economy, markets, society, and government data through interactive charts, visual stories, and insights powered by trusted official sources.",
  openGraph: {
    title: "Indiagraphs - India's Data Stories, Charts & Interactive Visual Insights",
    description:
      "Discover data-driven insights on India with interactive graphs, visual stories, and reliable indicators sourced from RBI, MOSPI, NSO, and more.",
    url: "https://indiagraphs.com",
    siteName: "Indiagraphs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Indiagraphs - India's Data Stories & Interactive Visualizations",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiagraphs - India's Data Stories & Interactive Graphs",
    description:
      "Visualize India's key indicators through interactive charts and data stories backed by official, credible Indian data.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://indiagraphs.com" },
};

export default async function DataPage() {
  const { data: graphs } = await supabaseServer
    .from("graphs")
    .select("title, slug, description, category, source")
    .order("title", { ascending: true });

  return <DataHome graphs={graphs ?? []} />;
}