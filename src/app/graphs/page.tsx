import type { Metadata } from "next";
import GraphsHome from "../GraphsHome";

export const metadata: Metadata = {
  title: "Explore India's Data Through Interactive Graphs",
  description:
    "Dive into India's economy, markets, and society with interactive, data-driven charts powered by trusted public sources.",
  openGraph: {
    title: "Interactive Graphs on India's Economy & Markets | Indiagraphs",
    description:
      "Visualize India's key indicators — GDP, gold prices, taxes, inflation, and more — through dynamic, interactive charts.",
    url: "https://indiagraphs.com/graphs",
    siteName: "Indiagraphs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Indiagraphs – Interactive Data Visualizations",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiagraphs – Interactive Data Insights on India",
    description:
      "Explore India's growth story through interactive graphs and data visualizations from credible sources.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://indiagraphs.com/graphs" },
};

export default function GraphsPage() {
  return <GraphsHome />;
}