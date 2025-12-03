// app/tools/real-return-savings-calculator/page.tsx

import type { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Real Returns Calculator (India) - Inflation Adjusted Savings",
  description:
    "Calculate real returns after inflation for PPF, SSY, FD, SCSS, NSC and RDs. Compare nominal vs real CAGR instantly.",
  alternates: {
    canonical: "https://www.indiagraphs.com/tools/real-return-savings-calculator",
  },
  openGraph: {
    title: "Real Returns Calculator (India) - Inflation Adjusted Savings",
    description:
      "Compute inflation-adjusted real returns for Indian savings schemes like PPF, SSY, FD, NSC & SCSS.",
    type: "article",
    url: "https://www.indiagraphs.com/tools/real-return-savings-calculator",
    images: [
      "https://www.indiagraphs.com/og/real-returns.png",
    ],
  },
};

// ---------- SERVER COMPONENT WRAPPER ----------
export default async function Page(props: { searchParams: Promise<{ embed?: string }> }) {
  
  const search = await props.searchParams;  // ⬅️ FIX
  const isEmbed = search?.embed === "1";

  return <ClientPage isEmbed={isEmbed} />;
}