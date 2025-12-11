// app/tools/solar-farm-income-calculator/page.tsx
import { Metadata } from "next";
import ClientPage from "./ClientPage";

// ----------- SEO METADATA (server) -----------
export const metadata: Metadata = {
  title: "Solar Farm Income Calculator (India) - Annual Revenue Estimate",
  description:
    "Calculate solar farm income per acre in India using CUF, tariff rate and MW/acre. Ideal for feasibility studies and investor analysis.",
  alternates: {
    canonical:
      "https://www.indiagraphs.com/tools/solar-farm-income-calculator",
  },
  openGraph: {
    title: "Solar Farm Income Calculator (India) - Annual Revenue Estimate",
    description:
      "Estimate solar income per acre using CUF and tariff. Accurate, easy-to-use tool for investors and farmers.",
    url: "https://www.indiagraphs.com/tools/solar-farm-income-calculator",
    images: [
      {
        url: "https://www.indiagraphs.com/og/solar-farm.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  keywords: [
    "solar income calculator",
    "solar farm earnings",
    "solar per acre income",
    "renewable energy calculator",
    "solar power India",
  ],
  other: {
    "last-updated": "Nov 2024",
  },
};

// ---------- SERVER COMPONENT WRAPPER ----------
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  const isEmbed = params?.embed === "1";

  return <ClientPage isEmbed={isEmbed} />;
}
