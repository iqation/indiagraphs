import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "PPF Calculator (India) – Maturity & Tax-Free Returns",
  description:
    "PPF Calculator for India. Calculate maturity amount, interest earned, and total investment. Uses current PPF rate (7.1%).",
  alternates: {
    canonical: "https://www.indiagraphs.com/tools/ppf-calculator",
  },
  openGraph: {
    title: "PPF Calculator (India)",
    description:
      "Calculate PPF maturity amount, interest earned, and tax-free returns.",
    url: "https://www.indiagraphs.com/tools/ppf-calculator",
    images: [
      "https://www.indiagraphs.com/og/ppf-calculator.png",
    ],
  },
};

export default function Page({ searchParams }: { searchParams: { embed?: string } }) {
  const isEmbed = searchParams?.embed === "1";
  return <ClientPage isEmbed={isEmbed} />;
}