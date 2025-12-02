// app/tools/page.tsx
import type { Metadata } from "next";
import ToolsHomeClient from "./ToolsHome";

// ---------------------
// ✅ SEO Metadata (server-only)
// ---------------------
export const metadata: Metadata = {
  title: "Indiagraphs Data-Backed Calculators - Smart Tools Built on Real Indian Data",
  description:
    "Explore Indiagraphs' growing collection of clean, research-backed calculators built using Indian historical datasets.",
  alternates: {
    canonical: "https://www.indiagraphs.com/tools",
  },
  openGraph: {
    title: "Indiagraphs Data-Backed Calculators",
    description:
      "Accurate, research-driven calculators for India — solar farm income, real returns, savings comparison and more.",
    url: "https://www.indiagraphs.com/tools",
    type: "website",
    images: ["https://www.indiagraphs.com/og/tools-home.png"],
  },
};

// ---------------------
// 🔥 Server Component → Renders the Client UI
// ---------------------
export default function ToolsPage() {
  return <ToolsHomeClient />;
}